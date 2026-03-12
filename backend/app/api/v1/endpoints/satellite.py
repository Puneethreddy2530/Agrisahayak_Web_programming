"""
Satellite Intelligence Endpoints
NDVI analysis, carbon credits, parametric insurance triggers, NDVI tile overlay
"""

from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional, Tuple
from datetime import datetime
import logging

from app.satellite.sentinel_service import analyze_land, batch_analyze_lands, get_sentinel_token, get_ndvi_tile
from app.analytics.duckdb_engine import get_duckdb_context

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# Short-lived in-process cache: avoids duplicate Sentinel API calls when
# /carbon-credits or /parametric-insurance are requested for the same parcel
# shortly after /analyze (common UI flow).  TTL matches Sentinel update cadence.
# ---------------------------------------------------------------------------
_ANALYSIS_TTL = 300  # seconds (5 min)
_analysis_cache: dict = {}  # key -> (result_dict, expires_at_ts)


def _analysis_cache_key(lat: float, lng: float, area_acres: float, crop: str = "") -> str:
    return f"{round(lat, 4)}:{round(lng, 4)}:{area_acres}:{(crop or '').lower()}"


async def _cached_analyze(lat: float, lng: float, area_acres: float, crop: str = "") -> dict:
    """Call analyze_land, returning a cached result if one exists within TTL."""
    key = _analysis_cache_key(lat, lng, area_acres, crop)
    now = datetime.utcnow().timestamp()
    cached = _analysis_cache.get(key)
    if cached and now < cached[1]:
        return cached[0]
    result = await analyze_land(lat, lng, area_acres, crop)
    _analysis_cache[key] = (result, now + _ANALYSIS_TTL)
    return result


class LandAnalysisRequest(BaseModel):
    lat: float
    lng: float
    area_acres: float = 2.0
    land_id: Optional[str] = None
    crop: Optional[str] = None


class BatchAnalysisRequest(BaseModel):
    lands: List[dict]


@router.get("/analyze")
async def analyze_land_endpoint(
    lat: float = Query(..., description="Land centroid latitude"),
    lng: float = Query(..., description="Land centroid longitude"),
    area_acres: float = Query(2.0, description="Land area in acres"),
    land_id: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
):
    """
    Analyze a single land parcel using Sentinel-2 satellite data.
    Returns NDVI, NDWI, crop health classification, and carbon credit estimate.
    """
    result = await analyze_land(lat, lng, area_acres, crop)
    # Populate the cache so /carbon-credits and /parametric-insurance reuse this result
    _analysis_cache[_analysis_cache_key(lat, lng, area_acres, crop)] = (
        result, datetime.utcnow().timestamp() + _ANALYSIS_TTL
    )

    # Store result in DuckDB for historical tracking
    try:
        with get_duckdb_context() as conn:
            conn.execute("""
                INSERT INTO satellite_analyses 
                (id, lat, lng, area_acres, crop, ndvi, ndwi, soil_moisture,
                 crop_health, risk_level, carbon_tons, data_source, analyzed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, [
                land_id or f"L{round(lat*1000)}{round(lng*1000)}",
                lat, lng, area_acres, crop,
                result["ndvi"], result["ndwi"], result["soil_moisture_index"],
                result["crop_health"], result["risk_level"],
                result["carbon_sequestration_tons_co2_year"],
                result["data_source"]
            ])
    except Exception as e:
        logger.warning(f"Could not store satellite result: {e}")
    
    return result


@router.post("/analyze/batch")
async def batch_analyze(request: BatchAnalysisRequest):
    """Analyze multiple land parcels in parallel (max 10)"""
    if len(request.lands) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 lands per batch request")
    results = await batch_analyze_lands(request.lands[:10])
    return {"results": results, "count": len(results)}


@router.get("/carbon-credits/{land_id}")
async def get_carbon_credits(
    land_id: str,
    lat: float = Query(...),
    lng: float = Query(...),
    area_acres: float = Query(2.0),
    crop: Optional[str] = Query(None),
):
    """
    Calculate AgriCarbon tokens for a land parcel.
    
    Formula:
    - NDVI-based biomass → estimated tCO2 sequestered per year
    - Carbon price: INR 800–1200 per tCO2 (voluntary carbon market)
    - Token value: 1 AgriCarbon = 0.1 tCO2
    """
    analysis = await _cached_analyze(lat, lng, area_acres, crop or "")

    carbon_tons = analysis["carbon_sequestration_tons_co2_year"]
    token_count = round(carbon_tons * 10, 1)  # 10 tokens per ton
    
    # Market price range (₹ per token)
    token_price_inr = 80   # ₹80 per 0.1 tCO2 = ₹800/tCO2
    token_price_usd = round(token_price_inr / 83, 2)
    
    return {
        "land_id": land_id,
        "analysis": analysis,
        "carbon_credits": {
            "total_co2_tons_year": carbon_tons,
            "agri_carbon_tokens": token_count,
            "token_price_inr": token_price_inr,
            "token_price_usd": token_price_usd,
            "annual_income_inr": round(token_count * token_price_inr),
            "annual_income_usd": round(token_count * token_price_usd, 2),
            "verification": "Sentinel-2 NDVI + Biomass Model",
            "signature_algorithm": "Falcon-512 (Post-Quantum)",
        },
        "pitch": (
            f"Your {area_acres:.1f} acres sequester {carbon_tons} tCO2/year. "
            f"At ₹{token_price_inr * 10}/tCO2, you earn ₹{round(token_count * token_price_inr):,}/year "
            f"in passive carbon income — without planting a single extra seed."
        )
    }


@router.get("/parametric-insurance/{land_id}")
async def parametric_insurance_check(
    land_id: str,
    lat: float = Query(...),
    lng: float = Query(...),
    area_acres: float = Query(2.0),
    ndvi_threshold: float = Query(0.25, description="NDVI below this triggers insurance payout"),
    crop: Optional[str] = Query(None),
):
    """
    Parametric Crop Insurance: auto-trigger payout when NDVI drops below threshold.
    This endpoint simulates what the blockchain oracle would check every 5 days.
    """
    analysis = await _cached_analyze(lat, lng, area_acres, crop or "")
    ndvi = analysis["ndvi"]
    
    triggered = ndvi < ndvi_threshold
    payout_amount = round(area_acres * 15000) if triggered else 0  # ₹15,000/acre
    
    return {
        "land_id": land_id,
        "current_ndvi": ndvi,
        "ndvi_threshold": ndvi_threshold,
        "insurance_triggered": triggered,
        "payout_amount_inr": payout_amount,
        "crop_health": analysis["crop_health"],
        "risk_level": analysis["risk_level"],
        "satellite_date": analysis["analysis_date"],
        "smart_contract_action": "TRIGGER_PAYOUT" if triggered else "MONITOR_5_DAYS",
        "message": (
            f"🚨 NDVI={ndvi:.3f} below threshold {ndvi_threshold}. "
            f"Automatic payout of ₹{payout_amount:,} initiated to farmer account."
            if triggered else
            f"✅ NDVI={ndvi:.3f} healthy. Next satellite check in 5 days."
        )
    }


@router.get("/history/{land_id}")
async def get_satellite_history(land_id: str, limit: int = Query(10)):
    """Get historical NDVI readings for a land parcel"""
    try:
        with get_duckdb_context() as conn:
            result = conn.execute("""
                SELECT ndvi, ndwi, soil_moisture, crop_health, risk_level,
                       carbon_tons, data_source, analyzed_at
                FROM satellite_analyses
                WHERE id = ?
                ORDER BY analyzed_at DESC
                LIMIT ?
            """, [land_id, limit]).fetchall()
        
        return {
            "land_id": land_id,
            "history": [
                {
                    "ndvi": r[0], "ndwi": r[1], "soil_moisture": r[2],
                    "crop_health": r[3], "risk_level": r[4],
                    "carbon_tons": r[5], "data_source": r[6],
                    "analyzed_at": r[7].isoformat() if r[7] else None
                }
                for r in result
            ]
        }
    except Exception as e:
        return {"land_id": land_id, "history": [], "error": str(e)}


@router.get("/ndvi-tile")
async def ndvi_tile_endpoint(
    lat: float = Query(..., description="Centre latitude"),
    lng: float = Query(..., description="Centre longitude"),
):
    """
    Return a false-colour NDVI PNG overlay (~2 km box) for the given point.
    The frontend can display this on a Leaflet ImageOverlay.
    Returns 204 (no content) when Sentinel credentials are missing or the
    tile cannot be produced.
    """
    token = await get_sentinel_token()
    if not token:
        return Response(status_code=204)

    png = await get_ndvi_tile(lat, lng, token)
    if not png:
        return Response(status_code=204)

    return Response(content=png, media_type="image/png",
                    headers={"Cache-Control": "public, max-age=1800"})
