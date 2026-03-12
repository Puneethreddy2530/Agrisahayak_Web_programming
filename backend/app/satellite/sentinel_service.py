"""
Sentinel-2 Satellite Service
Fetches NDVI, NDWI, and biomass data for farmer land coordinates
using the Copernicus Data Space Ecosystem (Sentinel Hub API).

Why Sentinel-2:
- Free, 10m resolution, updated every 5 days
- Bands B04 (Red), B08 (NIR), B11 (SWIR) available
- NDVI = (NIR - Red) / (NIR + Red) -> crop health
- NDWI = (Green - NIR) / (Green + NIR) -> water stress
- Uses Statistical API (JSON) — no rasterio / TIFF parsing needed
"""

import os
import math
import logging
import asyncio
import hashlib
import httpx
import numpy as np
from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple

logger = logging.getLogger(__name__)

# Copernicus Data Space Ecosystem credentials (free registration at dataspace.copernicus.eu)
SENTINEL_CLIENT_ID = os.getenv("SENTINEL_CLIENT_ID", "")
SENTINEL_CLIENT_SECRET = os.getenv("SENTINEL_CLIENT_SECRET", "")
SENTINEL_TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
SENTINEL_PROCESS_URL = "https://sh.dataspace.copernicus.eu/api/v1/process"
SENTINEL_STATS_URL = "https://sh.dataspace.copernicus.eu/api/v1/statistics"

# Cache token (refresh at 25 min; they expire in 30)
_token_cache: Dict = {"token": None, "expires_at": 0}


async def get_sentinel_token() -> Optional[str]:
    """Get OAuth2 access token for Sentinel Hub API."""
    if not SENTINEL_CLIENT_ID or not SENTINEL_CLIENT_SECRET:
        logger.warning("Sentinel credentials not configured — using mock NDVI data")
        return None

    now = datetime.now().timestamp()
    if _token_cache["token"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(SENTINEL_TOKEN_URL, data={
            "client_id": SENTINEL_CLIENT_ID,
            "client_secret": SENTINEL_CLIENT_SECRET,
            "grant_type": "client_credentials",
        })
        resp.raise_for_status()
        data = resp.json()
        _token_cache["token"] = data["access_token"]
        _token_cache["expires_at"] = now + 25 * 60
        logger.info("Sentinel Hub token acquired (%s…)", data["access_token"][:8])
        return _token_cache["token"]


def lat_lng_to_bbox(lat: float, lng: float, buffer_km: float = 1.0) -> Tuple[float, float, float, float]:
    """Convert centre point + buffer to bounding box (min_lng, min_lat, max_lng, max_lat)."""
    lat_deg = buffer_km / 111.0
    lng_deg = buffer_km / (111.0 * math.cos(math.radians(lat)))
    return (lng - lng_deg, lat - lat_deg, lng + lng_deg, lat + lat_deg)


def compute_ndvi_mock(lat: float, lng: float, area_acres: float, crop: Optional[str] = None) -> Dict:
    """
    Realistic mock NDVI when Sentinel credentials are not configured.
    Uses lat/lng to generate geographically consistent values.
    Applies per-crop NDVI offsets so different crops produce meaningfully
    different readings for the same location.
    Suitable for hackathon demos where API keys aren't ready.
    """
    # Per-crop NDVI offset — reflects real-world canopy density differences.
    # Dense canopy (sugarcane, banana) → higher NDVI; sparse/root crops → lower.
    CROP_NDVI_OFFSET = {
        "rice":       0.00, "wheat":     -0.05, "maize":      0.05,
        "cotton":    -0.08, "tomato":    -0.10, "potato":    -0.05,
        "onion":     -0.12, "sugarcane":  0.12, "soybean":    0.00,
        "groundnut": -0.03, "mustard":   -0.02, "chickpea":  -0.05,
        "tur":       -0.03, "moong":     -0.06, "banana":     0.15,
    }
    crop_offset = CROP_NDVI_OFFSET.get((crop or "").lower(), 0.0)

    import hashlib, math
    # Geographic base seed (stable per location) + temporal jitter
    # so each analysis call produces slightly different but realistic values.
    geo_hash = int(hashlib.md5(f"{lat:.3f}{lng:.3f}".encode()).hexdigest()[:8], 16)
    now = datetime.utcnow()
    # Seasonal component: NDVI naturally peaks in monsoon (Jul-Sep) and dips in dry season
    month_angle = (now.month - 1) / 12.0 * 2 * math.pi
    seasonal = 0.08 * math.sin(month_angle - math.pi / 3)  # peak ~Aug
    # Per-call jitter: timestamp-based so consecutive calls differ
    time_seed = int(now.timestamp()) // 10  # changes every 10 seconds
    rng = np.random.RandomState((geo_hash + time_seed) % (2**31))

    # Base NDVI varies by latitude (tropical India ~= 0.5-0.8), shifted by crop + season
    base_ndvi = float(np.clip(0.45 + (rng.random() * 0.35) + crop_offset + seasonal, 0.05, 0.95))
    ndwi = 0.1 + (rng.random() * 0.3)
    soil_moisture = 0.2 + (rng.random() * 0.4)

    # Classify health
    if base_ndvi > 0.7:
        health = "excellent"
        risk = "low"
    elif base_ndvi > 0.5:
        health = "good"
        risk = "low"
    elif base_ndvi > 0.35:
        health = "moderate"
        risk = "medium"
    elif base_ndvi > 0.2:
        health = "stressed"
        risk = "high"
    else:
        health = "critical"
        risk = "critical"

    # Estimate carbon capture: rough formula - 1 ton C/ha/year for average NDVI 0.5
    # area_acres -> hectares; scale by NDVI
    area_ha = area_acres * 0.4047
    carbon_tons = round(area_ha * base_ndvi * 2.1, 2)  # tCO2/year

    return {
        "ndvi": round(float(base_ndvi), 4),
        "ndwi": round(float(ndwi), 4),
        "soil_moisture_index": round(float(soil_moisture), 4),
        "crop_health": health,
        "risk_level": risk,
        "carbon_sequestration_tons_co2_year": carbon_tons,
        "area_ha": round(area_ha, 3),
        "data_source": "mock_simulated",
        "analysis_date": datetime.utcnow().isoformat(),
        "next_update_days": 5,
        "predictive_flag": base_ndvi < 0.4,  # True = crops likely to show symptoms in ~7 days
    }


async def fetch_ndvi_real(lat: float, lng: float, area_acres: float, token: str) -> Dict:
    """
    Fetch real NDVI/NDWI/NDMI from Sentinel-2 via Sentinel Hub **Statistical API**.
    Returns JSON — no rasterio / TIFF parsing needed.
    Searches the last 60 days for cloud-free imagery (≤30 % cloud).
    """
    bbox = lat_lng_to_bbox(lat, lng, buffer_km=0.5)

    # Evalscript: output NDVI, NDWI, NDMI as separate outputs so the
    # Statistical API reports per-output statistics.
    evalscript = """
//VERSION=3
function setup() {
  return {
    input: [{ bands: ["B03","B04","B08","B11","dataMask"] }],
    output: [
      { id: "ndvi", bands: 1 },
      { id: "ndwi", bands: 1 },
      { id: "ndmi", bands: 1 }
    ]
  };
}
function evaluatePixel(s) {
  if (s.dataMask === 0) return { ndvi: [-9999], ndwi: [-9999], ndmi: [-9999] };
  var eps = 0.00001;
  var ndvi = (s.B08 - s.B04) / (s.B08 + s.B04 + eps);
  var ndwi = (s.B03 - s.B08) / (s.B03 + s.B08 + eps);
  var ndmi = (s.B08 - s.B11) / (s.B08 + s.B11 + eps);
  return { ndvi: [ndvi], ndwi: [ndwi], ndmi: [ndmi] };
}
"""

    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=60)
    time_from = start_date.strftime("%Y-%m-%dT00:00:00Z")
    time_to = end_date.strftime("%Y-%m-%dT23:59:59Z")

    payload = {
        "input": {
            "bounds": {
                "bbox": list(bbox),
                "properties": {"crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"},
            },
            "data": [{
                "type": "sentinel-2-l2a",
                "dataFilter": {
                    "timeRange": {"from": time_from, "to": time_to},
                    "maxCloudCoverage": 30,
                    "mosaickingOrder": "leastCC",
                },
            }],
        },
        "aggregation": {
            "timeRange": {"from": time_from, "to": time_to},
            "aggregationInterval": {"of": "P60D"},
            "evalscript": evalscript,
            "resx": 10,
            "resy": 10,
        },
    }

    async with httpx.AsyncClient(timeout=45) as client:
        resp = await client.post(
            SENTINEL_STATS_URL,
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )

        if resp.status_code == 400:
            detail = resp.text[:300]
            logger.warning("Sentinel Statistical API 400: %s", detail)
            raise ValueError(f"Sentinel API rejected request: {detail}")

        resp.raise_for_status()
        stats = resp.json()

    # Parse the response. Structure:
    # data[0].outputs.<id>.bands.B0.stats.{min, max, mean, stDev, sampleCount, noDataCount}
    try:
        outputs = stats["data"][0]["outputs"]

        def _mean(output_name: str) -> float:
            band_stats = outputs[output_name]["bands"]["B0"]["stats"]
            sample = band_stats.get("sampleCount", 0)
            nodata = band_stats.get("noDataCount", 0)
            if sample <= nodata:
                return float("nan")
            return float(band_stats["mean"])

        ndvi = _mean("ndvi")
        ndwi = _mean("ndwi")
        soil_moisture = _mean("ndmi")

        if math.isnan(ndvi):
            logger.warning("No valid pixels from Sentinel-2 for (%.4f, %.4f)", lat, lng)
            raise ValueError("No valid satellite pixels — probably cloudy or ocean")
    except (KeyError, IndexError) as exc:
        logger.error("Unexpected Statistical API response: %s", exc)
        raise ValueError("Could not parse Sentinel-2 statistics") from exc

    # Classify
    if ndvi > 0.7:
        health, risk = "excellent", "low"
    elif ndvi > 0.5:
        health, risk = "good", "low"
    elif ndvi > 0.35:
        health, risk = "moderate", "medium"
    elif ndvi > 0.2:
        health, risk = "stressed", "high"
    else:
        health, risk = "critical", "critical"

    area_ha = area_acres * 0.4047
    carbon_tons = round(area_ha * max(ndvi, 0) * 2.1, 2)

    return {
        "ndvi": round(ndvi, 4),
        "ndwi": round(ndwi, 4),
        "soil_moisture_index": round(soil_moisture, 4),
        "crop_health": health,
        "risk_level": risk,
        "carbon_sequestration_tons_co2_year": carbon_tons,
        "area_ha": round(area_ha, 3),
        "data_source": "sentinel-2-l2a",
        "analysis_date": datetime.utcnow().isoformat(),
        "next_update_days": 5,
        "predictive_flag": ndvi < 0.4,
    }


# ---------------------------------------------------------------------------
# NDVI Tile URL helper — lets the frontend show an NDVI colour overlay
# on a Leaflet map using Sentinel Hub's Process API (returns PNG tiles).
# ---------------------------------------------------------------------------
NDVI_TILE_EVALSCRIPT = """
//VERSION=3
function setup() {
  return { input: ["B04","B08","dataMask"], output: { bands: 4 } };
}
function evaluatePixel(s) {
  if (s.dataMask === 0) return [0,0,0,0];
  var ndvi = (s.B08-s.B04)/(s.B08+s.B04+1e-5);
  if (ndvi < 0.1) return [0.75,0.15,0.15,0.85];
  if (ndvi < 0.2) return [0.85,0.35,0.10,0.85];
  if (ndvi < 0.35) return [0.95,0.75,0.15,0.80];
  if (ndvi < 0.5) return [0.55,0.85,0.15,0.75];
  if (ndvi < 0.7) return [0.13,0.78,0.22,0.75];
  return [0.05,0.55,0.15,0.75];
}
"""

async def get_ndvi_tile(lat: float, lng: float, token: str, width: int = 512, height: int = 512) -> Optional[bytes]:
    """
    Return a single NDVI false-colour PNG for a ~2 km box around (lat, lng).
    Returns None on any error so callers can fall back gracefully.
    """
    bbox = lat_lng_to_bbox(lat, lng, buffer_km=1.0)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=60)

    payload = {
        "input": {
            "bounds": {
                "bbox": list(bbox),
                "properties": {"crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"},
            },
            "data": [{
                "type": "sentinel-2-l2a",
                "dataFilter": {
                    "timeRange": {
                        "from": start_date.strftime("%Y-%m-%dT00:00:00Z"),
                        "to": end_date.strftime("%Y-%m-%dT23:59:59Z"),
                    },
                    "maxCloudCoverage": 30,
                    "mosaickingOrder": "leastCC",
                },
            }],
        },
        "output": {
            "width": width,
            "height": height,
            "responses": [{"identifier": "default", "format": {"type": "image/png"}}],
        },
        "evalscript": NDVI_TILE_EVALSCRIPT,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                SENTINEL_PROCESS_URL,
                json=payload,
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            )
            resp.raise_for_status()
            return resp.content  # PNG bytes
    except Exception as exc:
        logger.warning("NDVI tile fetch failed: %s", exc)
        return None


async def analyze_land(lat: float, lng: float, area_acres: float = 2.0, crop: Optional[str] = None) -> Dict:
    """
    Main entry point: analyze a farmer's land using Sentinel-2 satellite data.
    Falls back to realistic mock data if credentials are not configured.
    """
    try:
        token = await get_sentinel_token()
        if token:
            result = await fetch_ndvi_real(lat, lng, area_acres, token)
        else:
            result = compute_ndvi_mock(lat, lng, area_acres, crop)
    except Exception as e:
        logger.error(f"Satellite analysis failed: {e}, using mock data")
        result = compute_ndvi_mock(lat, lng, area_acres, crop)
    result["crop"] = crop
    return result


async def batch_analyze_lands(lands: list) -> list:
    """Analyze multiple lands concurrently (max 5 parallel requests)"""
    sem = asyncio.Semaphore(5)

    async def analyze_one(land):
        async with sem:
            result = await analyze_land(
                land.get("latitude", 20.5937),
                land.get("longitude", 78.9629),
                land.get("area_acres", 2.0),
                land.get("crop")
            )
            return {"land_id": land.get("id"), "land_name": land.get("name", ""), **result}

    return await asyncio.gather(*[analyze_one(l) for l in lands])
