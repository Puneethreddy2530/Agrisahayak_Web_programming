"""
API Router - Combines all endpoint routes
ALL DATA IS PERSISTED TO DATABASE - No in-memory storage

FEATURES:
- Voice-to-Text Agricultural Assistant
- Camera Disease Detection with GPS
- Disease Outbreak Map
- Farmer Dashboard
- Pest Detection (IP102 trained)
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, crop, disease, disease_history, weather, market,
    schemes, farmer, cropcycle, fertilizer, expense, export, complaints,
    analytics, chatbot,
    # NEW FEATURES
    voice, camera, outbreak_map, dashboard,
    pest,  # Pest detection with EfficientNetV2
    pqc,
    satellite,
    logistics,
    whatsapp,
    defi
)

api_router = APIRouter()

# Authentication (first) - BACKEND AS SOURCE OF TRUTH
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(farmer.router, prefix="/farmer", tags=["Farmer Profile"])
api_router.include_router(cropcycle.router, prefix="/cropcycle", tags=["Crop Lifecycle"])
api_router.include_router(crop.router, prefix="/crop", tags=["Crop Advisory"])
api_router.include_router(fertilizer.router, prefix="/fertilizer", tags=["Fertilizer Advisory"])
api_router.include_router(expense.router, prefix="/expense", tags=["Expense & Profit"])
api_router.include_router(disease.router, prefix="/disease", tags=["Disease Detection"])
api_router.include_router(disease_history.router, prefix="/disease-history", tags=["Disease History & Trends"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather Intelligence"])
api_router.include_router(market.router, prefix="/market", tags=["Market Prices"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["Government Schemes"])
# Complaints System - Farmers submit, Admin reviews
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints System"])

# CSV Export endpoints for research - Professional feature
api_router.include_router(export.router, prefix="/export", tags=["Data Export (Research)"])

# DuckDB Analytics - High-performance OLAP analytics
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics (DuckDB)"])

# AI Chatbot - Ollama Local LLM
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["AI Chatbot (Ollama)"])

# ============================================
# NEW FEATURES - HACKATHON ADDITIONS
# ============================================

# ðŸŽ¤ Voice-to-Text Agricultural Assistant
# - Speech recognition (Whisper AI)
# - Text-to-Speech responses (edge-tts)
# - Hindi/English support
api_router.include_router(voice.router, prefix="/voice", tags=["ðŸŽ¤ Voice Assistant"])

# ðŸ“¸ Camera Disease Detection with GPS
# - Direct camera capture analysis
# - GPS extraction from EXIF
# - Auto-sync to analytics heatmap
api_router.include_router(camera.router, prefix="/camera", tags=["ðŸ“¸ Camera Detection"])

# ï¸ Disease Outbreak Map
# - Interactive heatmap data
# - District clustering
# - Time-lapse outbreak spread
# - GeoJSON export
api_router.include_router(outbreak_map.router, prefix="/outbreak-map", tags=["ðŸ—ºï¸ Outbreak Map"])

# ðŸ“Š Farmer Dashboard
# - Personalized insights
# - Crop health scores
# - Price tracking
# - Action items
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["ðŸ“Š Farmer Dashboard"])

# ðŸ› Pest Detection
# - EfficientNetV2-S model (100% accuracy)
# - IP102 dataset trained
# - 3 pest classes: Rice Leaf Roller, White Grub, Armyworm
# - Camera & drag-drop support
api_router.include_router(pest.router, prefix="/pest", tags=["ðŸ› Pest Detection"])

# Post-Quantum Cryptography endpoints
api_router.include_router(pqc.router, prefix="/pqc", tags=["Post-Quantum Security"])

# ðŸ›°ï¸ Satellite Intelligence â€” Sentinel-2 NDVI + Carbon Credits + Parametric Insurance
api_router.include_router(satellite.router, prefix="/satellite", tags=["ðŸ›°ï¸ Satellite Intelligence"])

# ðŸš› Quantum-Annealed Logistics â€” Multi-farm harvest routing optimizer
api_router.include_router(logistics.router, prefix="/logistics", tags=["ðŸš› Quantum Logistics"])

# 📱 WhatsApp Bot — Twilio "Zero-G Fallback" for rural farmers
api_router.include_router(whatsapp.router, prefix="/whatsapp", tags=["📱 WhatsApp Bot"])

# 🪙 DeFi — Tokenized Harvests & Parametric Insurance Ledger
api_router.include_router(defi.router, prefix="/defi", tags=["🪙 DeFi"])





