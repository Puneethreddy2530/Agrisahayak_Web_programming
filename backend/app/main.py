"""
AgriSahayak - FastAPI Backend
AI-Powered Smart Agriculture Platform
"""

from dotenv import load_dotenv
load_dotenv()  # Load .env file before any other imports

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from contextlib import asynccontextmanager
import torch
import os
import logging

# Optional rate limiting (install slowapi for production)
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    SLOWAPI_AVAILABLE = True
except ImportError:
    SLOWAPI_AVAILABLE = False

from app.api.v1.router import api_router
from app.core.config import settings
from app.ml_service import load_all_models
from app.db import create_tables, get_db_info
from app.storage.supabase_client import init_local_storage, close_local_storage
from app.crypto.pq_signer import load_keypair
from app.analytics.duckdb_engine import init_duckdb, close_duckdb

logger = logging.getLogger(__name__)

# Rate limiter (shared across all endpoints) - optional
limiter = Limiter(key_func=get_remote_address) if SLOWAPI_AVAILABLE else None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events with graceful failure handling"""
    # Startup
    logger.info("Starting AgriSahayak Backend...")
    logger.info(f"CUDA Available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        logger.info(f"GPU: {torch.cuda.get_device_name(0)}")
    
    # Initialize database (required)
    logger.info("Initializing database...")
    try:
        create_tables()
        db_info = get_db_info()
        logger.info(f"Database ready: {db_info['engine']}")
        # WARN: Production should use Alembic migrations
        if os.getenv("ENVIRONMENT", "development") == "production":
            logger.warning("WARN: create_tables() used in production. Consider Alembic migrations.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise  # DB is required, fail fast
    
    # Load ML models (optional - app can start without)
    try:
        load_all_models()
    except Exception as e:
        logger.warning(f"ML model loading failed (app will use fallbacks): {e}")
    
    # Initialize local storage
    try:
        await init_local_storage()
    except Exception as e:
        logger.warning(f"Local storage init failed (app will continue): {e}")
    
    # Load cryptographic keys (optional)
    try:
        logger.info("Loading cryptographic keys...")
        load_keypair()
        logger.info("Cryptographic keys loaded")
    except Exception as e:
        logger.warning(f"Crypto key loading failed: {e}")
    
    # Initialize DuckDB Analytics Engine
    try:
        logger.info("Initializing DuckDB analytics...")
        init_duckdb()
        logger.info("✅ DuckDB analytics ready")
    except Exception as e:
        logger.warning(f"DuckDB init failed (analytics will be limited): {e}")
    
    # Initialize GPU semaphore in async context
    try:
        from app.ml_service import initialize_gpu_semaphore
        initialize_gpu_semaphore()
        logger.info("✅ GPU semaphore initialized")
    except Exception as e:
        logger.warning(f"GPU semaphore init failed: {e}")

    # Pre-warm Ollama model into GPU VRAM so first chat response is instant
    try:
        from app.chatbot.ollama_client import warm_model
        warmed = await warm_model()
        if warmed:
            logger.info("✅ Ollama model pre-warmed in GPU VRAM")
        else:
            logger.warning("Ollama warm-up skipped (Ollama may not be running)")
    except Exception as e:
        logger.warning(f"Ollama warm-up failed (non-critical): {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AgriSahayak...")
    try:
        await close_local_storage()
    except Exception as e:
        logger.warning(f"Local storage cleanup error: {e}")

    try:
        close_duckdb()
        logger.info("DuckDB connection closed")
    except Exception as e:
        logger.warning(f"DuckDB cleanup error: {e}")

    # Close Chatbot AsyncClient
    try:
        from app.chatbot.ollama_client import _httpx_client
        if _httpx_client:
            await _httpx_client.aclose()
            logger.info("Chatbot HTTP client closed")
    except Exception as e:
        logger.warning(f"Chatbot HTTP client cleanup error: {e}")


app = FastAPI(
    title="AgriSahayak API",
    description="AI-Powered Smart Agriculture & Farmer Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Add rate limiter to app state (if available)
if SLOWAPI_AVAILABLE and limiter:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
else:
    logger.warning("slowapi not installed - rate limiting disabled")

# CORS Middleware - SECURE configuration
# NOTE: allow_credentials=True requires explicit origins (no wildcards)
ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4200",
    "http://localhost:3000",
    "http://127.0.0.1:4200",
    "http://127.0.0.1:3000",
]
# Add production domains from environment
if os.getenv("FRONTEND_ORIGIN"):
    ALLOWED_ORIGINS.append(os.getenv("FRONTEND_ORIGIN"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # No "*" with credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    """Log all requests with timing"""
    import time
    start_time = time.time()
    
    # Log request
    logger.info(f"{request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        
        # Log response time
        process_time = (time.time() - start_time) * 1000
        response.headers["X-Process-Time"] = f"{process_time:.0f}ms"
        
        if process_time > 5000:  # Warn for slow requests
            logger.warning(f"Slow request: {request.url.path} took {process_time:.0f}ms")
        
        return response
    
    except Exception as e:
        logger.error(f"Request failed: {e}", exc_info=True)
        raise


# Cache control middleware (prevent static file caching)
@app.middleware("http")
async def add_cache_control_headers(request, call_next):
    """Disable caching for static files to prevent stale UI"""
    response = await call_next(request)
    if request.url.path.startswith("/static") or request.url.path in ["/", "/app", "/index.html"]:
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response


# UTF-8 charset middleware — ensures all JSON responses declare charset=utf-8
# so browsers and proxies never mis-decode ₹, °C, or Devanagari as Latin-1
@app.middleware("http")
async def add_utf8_charset(request, call_next):
    response = await call_next(request)
    ct = response.headers.get("content-type", "")
    if "application/json" in ct and "charset" not in ct:
        response.headers["content-type"] = "application/json; charset=utf-8"
    return response


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Use absolute path resolution regardless of working directory
_HERE = os.path.abspath(__file__)  # backend/app/main.py
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(_HERE)))  # project root

# Serve React built app (frontend-dist/) — primary UI
REACT_DIST_DIR = os.path.join(_PROJECT_ROOT, "frontend-dist")

# Keep old vanilla frontend dir only for legacy static fallback
FRONTEND_DIR = os.path.join(_PROJECT_ROOT, "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# REACT_DIST_DIR already defined above
if os.path.exists(REACT_DIST_DIR):
    _react_assets = os.path.join(REACT_DIST_DIR, "assets")
    if os.path.exists(_react_assets):
        app.mount("/assets", StaticFiles(directory=_react_assets), name="react-assets")

# Serve locally-uploaded images (replaces Supabase Storage)
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(_HERE)), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.get("/")
async def root():
    """Serve the React app or API info"""
    react_index = os.path.join(REACT_DIST_DIR, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)
    vanilla_index = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(vanilla_index):
        return FileResponse(vanilla_index)
    return {
        "message": "AgriSahayak API - Smart Agriculture Platform",
        "version": "1.0.0",
        "cuda_available": torch.cuda.is_available(),
        "docs": "/docs"
    }


@app.get("/app")
async def serve_app():
    """Serve the frontend app"""
    react_index = os.path.join(REACT_DIST_DIR, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)
    vanilla_index = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(vanilla_index):
        return FileResponse(vanilla_index)
    return {"error": "Frontend not found"}


@app.get("/index.html")
async def serve_index_html():
    """Explicit /index.html → React app"""
    react_index = os.path.join(REACT_DIST_DIR, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)
    return JSONResponse({"error": "Not found"}, status_code=404)


@app.get("/sw.js")
async def serve_sw_js():
    """Serve the real PWA service worker from frontend-dist/sw.js.
    Must be defined BEFORE the SPA catch-all so it isn't intercepted.
    Served with Cache-Control: no-store so the browser always fetches the latest version.
    """
    from fastapi.responses import Response
    sw_path = os.path.join(REACT_DIST_DIR, "sw.js")
    if os.path.exists(sw_path):
        with open(sw_path, "r", encoding="utf-8") as f:
            content = f.read()
        return Response(
            content=content,
            media_type="application/javascript",
            headers={"Cache-Control": "no-store, max-age=0"},
        )
    # SW not built yet — return empty placeholder so registration doesn't hard-fail
    return Response(
        content="// sw.js not built yet — run: npm run build inside frontend-src/",
        media_type="application/javascript",
        headers={"Cache-Control": "no-store"},
    )


@app.get("/service-worker.js")
async def serve_service_worker():
    """Legacy kill-switch service worker: clears old vanilla-JS PWA caches and unregisters itself."""
    kill_sw = """
// AgriSahayak — service worker kill switch
// Clears all caches from the old vanilla-JS PWA and unregisters this SW.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.registration.unregister())
  );
});
"""
    from fastapi.responses import Response
    return Response(content=kill_sw, media_type="application/javascript",
                    headers={"Cache-Control": "no-store"})


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_info = get_db_info()
    return {
        "status": "healthy",
        "cuda": torch.cuda.is_available(),
        "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "database": db_info
    }


@app.get("/api/v1/analytics/health")
async def analytics_health_check():
    """Specific health check for analytics engine"""
    from app.analytics.duckdb_engine import analytics_health
    return analytics_health()


@app.get("/health/detailed")
async def detailed_health_check():
    """Comprehensive health check for monitoring"""
    from datetime import datetime
    
    health = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {}
    }
    
    # Check database
    try:
        db_info = get_db_info()
        health["services"]["database"] = {
            "status": "healthy",
            "engine": db_info.get("engine"),
            "connected": db_info.get("is_connected", True)
        }
    except Exception as e:
        health["services"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health["status"] = "degraded"
    
    # Check Ollama
    try:
        from app.chatbot.ollama_client import is_ollama_running, OLLAMA_URL, OLLAMA_MODEL
        ollama_running = await is_ollama_running()
        health["services"]["ollama"] = {
            "status": "healthy" if ollama_running else "offline",
            "url": OLLAMA_URL,
            "model": OLLAMA_MODEL
        }
        if not ollama_running:
            health["status"] = "degraded"
    except Exception as e:
        health["services"]["ollama"] = {
            "status": "error",
            "error": str(e)
        }
    
    # Check DuckDB
    try:
        from app.analytics.duckdb_engine import get_duckdb
        conn = get_duckdb()
        result = conn.execute("SELECT 1").fetchone()
        health["services"]["duckdb"] = {
            "status": "healthy" if result and result[0] == 1 else "degraded"
        }
    except Exception as e:
        health["services"]["duckdb"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health["status"] = "degraded"
    
    # Check GPU
    health["services"]["gpu"] = {
        "available": torch.cuda.is_available(),
        "device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "memory_allocated": f"{torch.cuda.memory_allocated(0) / 1024**2:.0f}MB" if torch.cuda.is_available() else None
    }
    
    # Check ML models
    try:
        from app.ml_service import _disease_model, _crop_model
        health["services"]["ml_models"] = {
            "disease_model": "loaded" if _disease_model is not None else "not_loaded",
            "crop_model": "loaded" if _crop_model is not None else "not_loaded"
        }
    except Exception as e:
        health["services"]["ml_models"] = {"status": "error", "error": str(e)}
    
    return health


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """SPA catch-all: serve React index.html for any non-API client-side route"""
    # Never intercept API or special routes
    if (full_path.startswith("api/") or full_path.startswith("static/")
            or full_path.startswith("uploads/") or full_path.startswith("assets/")
            or full_path in ("health", "docs", "redoc", "openapi.json", "sw.js", "service-worker.js")):
        return JSONResponse({"error": "Not found"}, status_code=404)
    react_index = os.path.join(REACT_DIST_DIR, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)
    vanilla_index = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(vanilla_index):
        return FileResponse(vanilla_index)
    return JSONResponse({"error": "Frontend not found"}, status_code=404)
