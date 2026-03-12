"""
Local Storage Client - Drop-in replacement for Supabase
Uses SQLite + local filesystem. No network calls, no external dependencies.
Original Supabase integration removed because Supabase CDN is unreachable in India.
All public functions keep their original signatures so callers need no changes.
"""

import os
import json
import sqlite3
import threading
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

# -- Storage paths -----------------------------------------------------------
_BASE_DIR    = Path(__file__).parent.parent.parent   # backend/
_DB_PATH     = _BASE_DIR / "local_storage.db"
_UPLOADS_DIR = _BASE_DIR / "uploads"
_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Thread-safe write lock (SQLite WAL handles concurrent reads fine)
_db_lock = threading.Lock()

# Image upload constraints (kept from original for compatibility)
MAX_IMAGE_SIZE      = 10 * 1024 * 1024        # 10 MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


# -- Internal helpers --------------------------------------------------------

def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(_DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def _init_local_db():
    """Create tables on first import (idempotent)."""
    with _db_lock:
        conn = _get_conn()
        try:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS disease_alerts (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    disease_name TEXT,
                    district     TEXT,
                    severity     TEXT,
                    description  TEXT,
                    confidence   REAL,
                    location     TEXT,
                    created_at   TEXT
                );
                CREATE TABLE IF NOT EXISTS chat_history (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    farmer_id  TEXT,
                    message    TEXT,
                    response   TEXT,
                    metadata   TEXT,
                    created_at TEXT
                );
                CREATE TABLE IF NOT EXISTS pq_signatures (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    entity_type TEXT,
                    entity_id   TEXT,
                    signature   TEXT,
                    public_key  TEXT,
                    data_hash   TEXT,
                    algorithm   TEXT,
                    created_at  TEXT
                );
                CREATE TABLE IF NOT EXISTS analytics_cache (
                    cache_key  TEXT PRIMARY KEY,
                    cache_data TEXT,
                    expires_at TEXT
                );
            """)
            conn.commit()
            logger.info("Local storage DB initialised at %s", _DB_PATH)
        finally:
            conn.close()


_init_local_db()


# -- Lifecycle (no-ops; main.py calls these) ---------------------------------

async def init_local_storage():
    """No-op. Local DB initialises at import time."""
    logger.info("Local storage ready (SQLite)")


async def close_local_storage():
    """No-op. SQLite connections are per-call."""
    pass


# Backwards-compat aliases kept in case any other module still imports the old names
async def init_supabase():
    await init_local_storage()


async def close_supabase():
    await close_local_storage()


# -- Disease Alerts ----------------------------------------------------------

async def create_disease_alert(
    disease_name: str,
    district: str,
    severity: str,
    description: str,
    confidence: float = None,
    location: str = None,
) -> Dict:
    row = {
        "disease_name": disease_name,
        "district":     district,
        "severity":     severity,
        "description":  description,
        "confidence":   confidence,
        "location":     location,
        "created_at":   datetime.now(timezone.utc).isoformat(),
    }
    with _db_lock:
        conn = _get_conn()
        try:
            cur = conn.execute(
                "INSERT INTO disease_alerts (disease_name,district,severity,description,confidence,location,created_at) "
                "VALUES (:disease_name,:district,:severity,:description,:confidence,:location,:created_at)",
                row,
            )
            conn.commit()
            row["id"] = cur.lastrowid
        finally:
            conn.close()
    logger.info("Disease alert saved locally: %s in %s", disease_name, district)
    return row


async def get_recent_alerts(district: str = None, hours: int = 48) -> List[Dict]:
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    conn = _get_conn()
    try:
        if district:
            rows = conn.execute(
                "SELECT * FROM disease_alerts WHERE district=? AND created_at>=? ORDER BY created_at DESC LIMIT 50",
                (district, cutoff),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM disease_alerts WHERE created_at>=? ORDER BY created_at DESC LIMIT 50",
                (cutoff,),
            ).fetchall()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error("get_recent_alerts error: %s", e)
        return []
    finally:
        conn.close()


# -- Chat History ------------------------------------------------------------

async def save_chat(farmer_id: str, message: str, response: str, metadata: Dict = None) -> Dict:
    row = {
        "farmer_id":  farmer_id,
        "message":    message,
        "response":   response,
        "metadata":   json.dumps(metadata or {}),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    with _db_lock:
        conn = _get_conn()
        try:
            cur = conn.execute(
                "INSERT INTO chat_history (farmer_id,message,response,metadata,created_at) "
                "VALUES (:farmer_id,:message,:response,:metadata,:created_at)",
                row,
            )
            conn.commit()
            row["id"] = cur.lastrowid
        finally:
            conn.close()
    return row


async def get_chat_history(farmer_id: str, limit: int = 10) -> List[Dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM chat_history WHERE farmer_id=? ORDER BY created_at DESC LIMIT ?",
            (farmer_id, limit),
        ).fetchall()
        result = []
        for r in rows:
            d = dict(r)
            try:
                d["metadata"] = json.loads(d.get("metadata") or "{}")
            except Exception:
                d["metadata"] = {}
            result.append(d)
        return result
    except Exception as e:
        logger.error("get_chat_history error: %s", e)
        return []
    finally:
        conn.close()


# -- Image Storage (local filesystem) ----------------------------------------

async def upload_disease_image(farmer_id: str, image_bytes: bytes, filename: str) -> str:
    """Save image to local uploads folder; return a relative URL."""
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise ValueError(
            f"Image too large: {len(image_bytes)} bytes (max {MAX_IMAGE_SIZE // 1024 // 1024} MB)"
        )
    farmer_dir = _UPLOADS_DIR / farmer_id
    farmer_dir.mkdir(parents=True, exist_ok=True)
    timestamp   = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    safe_name   = f"{timestamp}_{Path(filename).name}"
    dest        = farmer_dir / safe_name
    dest.write_bytes(image_bytes)
    url = f"/uploads/{farmer_id}/{safe_name}"
    logger.info("Image saved locally: %s", dest)
    return url


# -- Cryptographic Signature Storage -----------------------------------------

async def store_signature(
    entity_type: str,
    entity_id: str,
    signature: str,
    public_key: str,
    data_hash: str,
) -> Dict:
    row = {
        "entity_type": entity_type,
        "entity_id":   entity_id,
        "signature":   signature,
        "public_key":  public_key,
        "data_hash":   data_hash,
        "algorithm":   "ECC-P256-SHA256",
        "created_at":  datetime.now(timezone.utc).isoformat(),
    }
    with _db_lock:
        conn = _get_conn()
        try:
            cur = conn.execute(
                "INSERT INTO pq_signatures "
                "(entity_type,entity_id,signature,public_key,data_hash,algorithm,created_at) "
                "VALUES (:entity_type,:entity_id,:signature,:public_key,:data_hash,:algorithm,:created_at)",
                row,
            )
            conn.commit()
            row["id"] = cur.lastrowid
        finally:
            conn.close()
    logger.info("Signature stored locally for %s:%s", entity_type, entity_id)
    return row


async def verify_signature(entity_type: str, entity_id: str) -> Optional[Dict]:
    conn = _get_conn()
    try:
        row = conn.execute(
            "SELECT * FROM pq_signatures WHERE entity_type=? AND entity_id=? ORDER BY created_at DESC LIMIT 1",
            (entity_type, entity_id),
        ).fetchone()
        return dict(row) if row else None
    except Exception as e:
        logger.error("verify_signature error: %s", e)
        return None
    finally:
        conn.close()


# -- Analytics Cache ---------------------------------------------------------

def _parse_iso_datetime(dt_string: str) -> datetime:
    if dt_string.endswith("Z"):
        dt_string = dt_string[:-1] + "+00:00"
    try:
        return datetime.fromisoformat(dt_string)
    except ValueError:
        return datetime.now(timezone.utc)


async def get_cached_analytics(cache_key: str) -> Optional[Dict]:
    conn = _get_conn()
    try:
        row = conn.execute(
            "SELECT cache_data, expires_at FROM analytics_cache WHERE cache_key=?",
            (cache_key,),
        ).fetchone()
        if row and datetime.now(timezone.utc) < _parse_iso_datetime(row["expires_at"]):
            return json.loads(row["cache_data"])
        return None
    except Exception as e:
        logger.warning("get_cached_analytics error for %s: %s", cache_key, e)
        return None
    finally:
        conn.close()


async def cache_analytics(cache_key: str, data: Dict, ttl_hours: int = 24):
    expires_at = (datetime.now(timezone.utc) + timedelta(hours=ttl_hours)).isoformat()
    with _db_lock:
        conn = _get_conn()
        try:
            conn.execute(
                "INSERT INTO analytics_cache (cache_key,cache_data,expires_at) VALUES (?,?,?) "
                "ON CONFLICT(cache_key) DO UPDATE SET cache_data=excluded.cache_data, expires_at=excluded.expires_at",
                (cache_key, json.dumps(data), expires_at),
            )
            conn.commit()
        except Exception as e:
            logger.warning("cache_analytics error for %s: %s", cache_key, e)
        finally:
            conn.close()


# -- Real-time stub ----------------------------------------------------------

async def subscribe_to_alerts(district: str, callback):
    """Local storage has no push; use polling."""
    logger.warning("subscribe_to_alerts: not supported in local-only mode")


# -- Compatibility stubs -----------------------------------------------------

class _NoOpSupabaseClient:
    async def close(self): pass

def get_supabase() -> _NoOpSupabaseClient:
    """Stub. All storage is handled by the module-level functions above."""
    return _NoOpSupabaseClient()

class AsyncSupabaseClient(_NoOpSupabaseClient):
    """Stub kept for backwards-compatibility."""
    pass
