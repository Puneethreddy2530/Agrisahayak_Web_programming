"""
Disease Outbreak Map API
Real-time disease outbreak mapping with Leaflet.js integration

Features:
- Interactive India map with disease hotspots
- District-level clustering
- Time-lapse outbreak spread
- Predictive zones (ML-based)
- Export to PDF for government officials

Technology:
- DuckDB for analytics
- GeoJSON for map data
- Leaflet.js (frontend)
"""

from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

from app.analytics.duckdb_engine import get_duckdb


# ==================================================
# MODELS
# ==================================================

class MapPoint(BaseModel):
    """Single point on the map"""
    lat: float
    lng: float
    disease: str
    disease_hindi: str
    crop: str
    confidence: float
    severity: str
    district: str
    state: str
    detected_at: str


class DistrictCluster(BaseModel):
    """District-level cluster"""
    district: str
    state: str
    lat: float
    lng: float
    total_cases: int
    diseases: Dict[str, int]
    severity_score: float
    status: str  # red, yellow, green
    last_case: str


class OutbreakTimeframe(BaseModel):
    """Outbreak data for a specific timeframe"""
    date: str
    cases: int
    new_cases: int
    districts_affected: int
    top_disease: str


# Indian state coordinates for mapping - comprehensive coverage
INDIA_STATES = {
    "Maharashtra": {"lat": 19.7515, "lng": 75.7139, "districts": {
        "Pune": {"lat": 18.5204, "lng": 73.8567},
        "Mumbai": {"lat": 19.0760, "lng": 72.8777},
        "Nashik": {"lat": 19.9975, "lng": 73.7898},
        "Nagpur": {"lat": 21.1458, "lng": 79.0882},
        "Aurangabad": {"lat": 19.8762, "lng": 75.3433},
        "Kolhapur": {"lat": 16.7050, "lng": 74.2433},
        "Solapur": {"lat": 17.6599, "lng": 75.9064},
        "Ahmednagar": {"lat": 19.0948, "lng": 74.7480},
        "Satara": {"lat": 17.6805, "lng": 74.0183}
    }},
    "Punjab": {"lat": 31.1471, "lng": 75.3412, "districts": {
        "Ludhiana": {"lat": 30.9010, "lng": 75.8573},
        "Amritsar": {"lat": 31.6340, "lng": 74.8723},
        "Jalandhar": {"lat": 31.3260, "lng": 75.5762},
        "Patiala": {"lat": 30.3398, "lng": 76.3869},
        "Bathinda": {"lat": 30.2110, "lng": 74.9455},
        "Mohali": {"lat": 30.7046, "lng": 76.7179},
        "Gurdaspur": {"lat": 32.0414, "lng": 75.4033},
        "Sangrur": {"lat": 30.2314, "lng": 75.8413}
    }},
    "Uttar Pradesh": {"lat": 26.8467, "lng": 80.9462, "districts": {
        "Lucknow": {"lat": 26.8467, "lng": 80.9462},
        "Varanasi": {"lat": 25.3176, "lng": 82.9739},
        "Agra": {"lat": 27.1767, "lng": 78.0081},
        "Kanpur": {"lat": 26.4499, "lng": 80.3319},
        "Allahabad": {"lat": 25.4358, "lng": 81.8463},
        "Meerut": {"lat": 28.9845, "lng": 77.7064},
        "Gorakhpur": {"lat": 26.7606, "lng": 83.3732},
        "Mathura": {"lat": 27.4924, "lng": 77.6737},
        "Jhansi": {"lat": 25.4484, "lng": 78.5685}
    }},
    "Karnataka": {"lat": 15.3173, "lng": 75.7139, "districts": {
        "Bangalore": {"lat": 12.9716, "lng": 77.5946},
        "Mysore": {"lat": 12.2958, "lng": 76.6394},
        "Belgaum": {"lat": 15.8497, "lng": 74.4977},
        "Hubli": {"lat": 15.3647, "lng": 75.1240},
        "Mangalore": {"lat": 12.9141, "lng": 74.8560},
        "Gulbarga": {"lat": 17.3297, "lng": 76.8343},
        "Bellary": {"lat": 15.1394, "lng": 76.9214},
        "Shimoga": {"lat": 13.9299, "lng": 75.5681}
    }},
    "Telangana": {"lat": 18.1124, "lng": 79.0193, "districts": {
        "Hyderabad": {"lat": 17.3850, "lng": 78.4867},
        "Warangal": {"lat": 17.9784, "lng": 79.5941},
        "Nizamabad": {"lat": 18.6725, "lng": 78.0940},
        "Karimnagar": {"lat": 18.4386, "lng": 79.1288},
        "Khammam": {"lat": 17.2473, "lng": 80.1514},
        "Nalgonda": {"lat": 17.0575, "lng": 79.2680},
        "Mahbubnagar": {"lat": 16.7488, "lng": 77.9850}
    }},
    "Gujarat": {"lat": 22.2587, "lng": 71.1924, "districts": {
        "Ahmedabad": {"lat": 23.0225, "lng": 72.5714},
        "Surat": {"lat": 21.1702, "lng": 72.8311},
        "Vadodara": {"lat": 22.3072, "lng": 73.1812},
        "Rajkot": {"lat": 22.3039, "lng": 70.8022},
        "Bhavnagar": {"lat": 21.7645, "lng": 72.1519},
        "Jamnagar": {"lat": 22.4707, "lng": 70.0577},
        "Junagadh": {"lat": 21.5222, "lng": 70.4579},
        "Gandhinagar": {"lat": 23.2156, "lng": 72.6369}
    }},
    "Tamil Nadu": {"lat": 11.1271, "lng": 78.6569, "districts": {
        "Chennai": {"lat": 13.0827, "lng": 80.2707},
        "Coimbatore": {"lat": 11.0168, "lng": 76.9558},
        "Madurai": {"lat": 9.9252, "lng": 78.1198},
        "Tiruchirappalli": {"lat": 10.7905, "lng": 78.7047},
        "Salem": {"lat": 11.6643, "lng": 78.1460},
        "Tirunelveli": {"lat": 8.7139, "lng": 77.7567},
        "Erode": {"lat": 11.3410, "lng": 77.7172},
        "Vellore": {"lat": 12.9165, "lng": 79.1325}
    }},
    "West Bengal": {"lat": 22.9868, "lng": 87.8550, "districts": {
        "Kolkata": {"lat": 22.5726, "lng": 88.3639},
        "Howrah": {"lat": 22.5958, "lng": 88.2636},
        "Durgapur": {"lat": 23.5204, "lng": 87.3119},
        "Siliguri": {"lat": 26.7271, "lng": 88.6393},
        "Asansol": {"lat": 23.6889, "lng": 86.9661},
        "Bardhaman": {"lat": 23.2324, "lng": 87.8615},
        "Malda": {"lat": 25.0108, "lng": 88.1411},
        "Midnapore": {"lat": 22.4249, "lng": 87.3198}
    }},
    "Madhya Pradesh": {"lat": 22.9734, "lng": 78.6569, "districts": {
        "Bhopal": {"lat": 23.2599, "lng": 77.4126},
        "Indore": {"lat": 22.7196, "lng": 75.8577},
        "Jabalpur": {"lat": 23.1815, "lng": 79.9864},
        "Gwalior": {"lat": 26.2183, "lng": 78.1828},
        "Ujjain": {"lat": 23.1765, "lng": 75.7885},
        "Sagar": {"lat": 23.8388, "lng": 78.7378},
        "Rewa": {"lat": 24.5310, "lng": 81.2979},
        "Satna": {"lat": 24.5702, "lng": 80.8329}
    }},
    "Rajasthan": {"lat": 27.0238, "lng": 74.2179, "districts": {
        "Jaipur": {"lat": 26.9124, "lng": 75.7873},
        "Jodhpur": {"lat": 26.2389, "lng": 73.0243},
        "Udaipur": {"lat": 24.5854, "lng": 73.7125},
        "Kota": {"lat": 25.2138, "lng": 75.8648},
        "Ajmer": {"lat": 26.4499, "lng": 74.6399},
        "Bikaner": {"lat": 28.0229, "lng": 73.3119},
        "Alwar": {"lat": 27.5530, "lng": 76.6346},
        "Bharatpur": {"lat": 27.2152, "lng": 77.5030}
    }},
    "Andhra Pradesh": {"lat": 15.9129, "lng": 79.7400, "districts": {
        "Visakhapatnam": {"lat": 17.6868, "lng": 83.2185},
        "Vijayawada": {"lat": 16.5062, "lng": 80.6480},
        "Guntur": {"lat": 16.3067, "lng": 80.4365},
        "Tirupati": {"lat": 13.6288, "lng": 79.4192},
        "Nellore": {"lat": 14.4426, "lng": 79.9865},
        "Kakinada": {"lat": 16.9891, "lng": 82.2475},
        "Rajahmundry": {"lat": 17.0050, "lng": 81.7787},
        "Kurnool": {"lat": 15.8281, "lng": 78.0373}
    }},
    "Kerala": {"lat": 10.8505, "lng": 76.2711, "districts": {
        "Thiruvananthapuram": {"lat": 8.5241, "lng": 76.9366},
        "Kochi": {"lat": 9.9312, "lng": 76.2673},
        "Kozhikode": {"lat": 11.2588, "lng": 75.7804},
        "Thrissur": {"lat": 10.5276, "lng": 76.2144},
        "Kannur": {"lat": 11.8745, "lng": 75.3704},
        "Kollam": {"lat": 8.8932, "lng": 76.6141},
        "Alappuzha": {"lat": 9.4981, "lng": 76.3388},
        "Palakkad": {"lat": 10.7867, "lng": 76.6548}
    }},
    "Odisha": {"lat": 20.9517, "lng": 85.0985, "districts": {
        "Bhubaneswar": {"lat": 20.2961, "lng": 85.8245},
        "Cuttack": {"lat": 20.4625, "lng": 85.8830},
        "Rourkela": {"lat": 22.2604, "lng": 84.8536},
        "Berhampur": {"lat": 19.3150, "lng": 84.7941},
        "Sambalpur": {"lat": 21.4669, "lng": 83.9812},
        "Puri": {"lat": 19.8135, "lng": 85.8312},
        "Balasore": {"lat": 21.4942, "lng": 86.9317},
        "Bhadrak": {"lat": 21.0548, "lng": 86.4972}
    }},
    "Bihar": {"lat": 25.0961, "lng": 85.3131, "districts": {
        "Patna": {"lat": 25.5941, "lng": 85.1376},
        "Gaya": {"lat": 24.7914, "lng": 85.0002},
        "Bhagalpur": {"lat": 25.2538, "lng": 86.9834},
        "Muzaffarpur": {"lat": 26.1209, "lng": 85.3647},
        "Darbhanga": {"lat": 26.1542, "lng": 85.8918},
        "Purnia": {"lat": 25.7771, "lng": 87.4753},
        "Bihar Sharif": {"lat": 25.2042, "lng": 85.5218},
        "Arrah": {"lat": 25.5544, "lng": 84.6631}
    }},
    "Jharkhand": {"lat": 23.6102, "lng": 85.2799, "districts": {
        "Ranchi": {"lat": 23.3441, "lng": 85.3096},
        "Jamshedpur": {"lat": 22.8046, "lng": 86.2029},
        "Dhanbad": {"lat": 23.7957, "lng": 86.4304},
        "Bokaro": {"lat": 23.6693, "lng": 86.1511},
        "Hazaribagh": {"lat": 23.9966, "lng": 85.3619},
        "Deoghar": {"lat": 24.4764, "lng": 86.6931}
    }},
    "Assam": {"lat": 26.2006, "lng": 92.9376, "districts": {
        "Guwahati": {"lat": 26.1445, "lng": 91.7362},
        "Dibrugarh": {"lat": 27.4728, "lng": 94.9120},
        "Jorhat": {"lat": 26.7509, "lng": 94.2037},
        "Silchar": {"lat": 24.8333, "lng": 92.7789},
        "Tezpur": {"lat": 26.6528, "lng": 92.7926},
        "Nagaon": {"lat": 26.3465, "lng": 92.6840}
    }},
    "Haryana": {"lat": 29.0588, "lng": 76.0856, "districts": {
        "Chandigarh": {"lat": 30.7333, "lng": 76.7794},
        "Gurugram": {"lat": 28.4595, "lng": 77.0266},
        "Faridabad": {"lat": 28.4089, "lng": 77.3178},
        "Panipat": {"lat": 29.3909, "lng": 76.9635},
        "Ambala": {"lat": 30.3752, "lng": 76.7821},
        "Karnal": {"lat": 29.6857, "lng": 76.9905},
        "Hisar": {"lat": 29.1492, "lng": 75.7217},
        "Rohtak": {"lat": 28.8955, "lng": 76.6066}
    }},
    "Chhattisgarh": {"lat": 21.2787, "lng": 81.8661, "districts": {
        "Raipur": {"lat": 21.2514, "lng": 81.6296},
        "Bilaspur": {"lat": 22.0797, "lng": 82.1409},
        "Durg": {"lat": 21.1904, "lng": 81.2849},
        "Korba": {"lat": 22.3595, "lng": 82.7501},
        "Rajnandgaon": {"lat": 21.0972, "lng": 81.0290},
        "Raigarh": {"lat": 21.8974, "lng": 83.3950}
    }},
    "Uttarakhand": {"lat": 30.0668, "lng": 79.0193, "districts": {
        "Dehradun": {"lat": 30.3165, "lng": 78.0322},
        "Haridwar": {"lat": 29.9457, "lng": 78.1642},
        "Nainital": {"lat": 29.3919, "lng": 79.4542},
        "Haldwani": {"lat": 29.2183, "lng": 79.5130},
        "Roorkee": {"lat": 29.8543, "lng": 77.8880},
        "Rishikesh": {"lat": 30.0869, "lng": 78.2676}
    }}
}


def get_district_coordinates(district: str, state: str) -> Dict:
    """Get coordinates for a district"""
    state_data = INDIA_STATES.get(state, {})
    districts = state_data.get("districts", {})
    
    if district in districts:
        return districts[district]
    
    # Return state center as fallback
    return {"lat": state_data.get("lat", 20.5937), "lng": state_data.get("lng", 78.9629)}


# ==================================================
# DEMO FALLBACK DATA (shown when DuckDB has no real data)
# ==================================================

DEMO_CLUSTERS = [
    {"district": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567,
     "total_cases": 47, "diseases": {"Late Blight": 28, "Early Blight": 19},
     "severe_count": 12, "last_case": "2026-03-03T14:22:00",
     "severity_score": 85, "status": "red"},
    {"district": "Nashik", "state": "Maharashtra", "lat": 19.9975, "lng": 73.7898,
     "total_cases": 31, "diseases": {"Powdery Mildew": 20, "Downy Mildew": 11},
     "severe_count": 7, "last_case": "2026-03-02T11:10:00",
     "severity_score": 65, "status": "yellow"},
    {"district": "Ludhiana", "state": "Punjab", "lat": 30.9010, "lng": 75.8573,
     "total_cases": 58, "diseases": {"Wheat Rust": 40, "Smut": 18},
     "severe_count": 20, "last_case": "2026-03-04T09:00:00",
     "severity_score": 95, "status": "red"},
    {"district": "Amritsar", "state": "Punjab", "lat": 31.6340, "lng": 74.8723,
     "total_cases": 23, "diseases": {"Wheat Rust": 23},
     "severe_count": 6, "last_case": "2026-03-01T17:30:00",
     "severity_score": 55, "status": "yellow"},
    {"district": "Guntur", "state": "Andhra Pradesh", "lat": 16.3067, "lng": 80.4365,
     "total_cases": 44, "diseases": {"Chilli Anthracnose": 30, "Leaf Curl Virus": 14},
     "severe_count": 15, "last_case": "2026-03-03T08:45:00",
     "severity_score": 80, "status": "red"},
    {"district": "Krishna", "state": "Andhra Pradesh", "lat": 16.6100, "lng": 80.6460,
     "total_cases": 18, "diseases": {"Rice Blast": 18},
     "severe_count": 3, "last_case": "2026-02-28T12:00:00",
     "severity_score": 40, "status": "yellow"},
    {"district": "Coimbatore", "state": "Tamil Nadu", "lat": 11.0168, "lng": 76.9558,
     "total_cases": 12, "diseases": {"Coconut Bud Rot": 8, "Root Wilt": 4},
     "severe_count": 2, "last_case": "2026-02-25T15:00:00",
     "severity_score": 25, "status": "green"},
    {"district": "Indore", "state": "Madhya Pradesh", "lat": 22.7196, "lng": 75.8577,
     "total_cases": 35, "diseases": {"Soybean Yellow Mosaic": 22, "Pod Borer": 13},
     "severe_count": 9, "last_case": "2026-03-02T14:00:00",
     "severity_score": 70, "status": "red"},
    {"district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873,
     "total_cases": 9, "diseases": {"Cumin Blight": 9},
     "severe_count": 1, "last_case": "2026-02-20T10:30:00",
     "severity_score": 20, "status": "green"},
    {"district": "Mysuru", "state": "Karnataka", "lat": 12.2958, "lng": 76.6394,
     "total_cases": 27, "diseases": {"Ragi Blast": 17, "Stem Borer": 10},
     "severe_count": 5, "last_case": "2026-03-01T07:00:00",
     "severity_score": 55, "status": "yellow"},
]

DEMO_ALERTS = [
    {"district": "Ludhiana", "state": "Punjab", "disease": "Wheat Rust",
     "cases": 40, "severity": 95, "level": "critical",
     "latest_case": "2026-03-04T09:00:00",
     "message": "⚠️ 40 cases of Wheat Rust detected in Ludhiana"},
    {"district": "Pune", "state": "Maharashtra", "disease": "Late Blight",
     "cases": 28, "severity": 85, "level": "critical",
     "latest_case": "2026-03-03T14:22:00",
     "message": "⚠️ 28 cases of Late Blight detected in Pune"},
    {"district": "Indore", "state": "Madhya Pradesh", "disease": "Soybean Yellow Mosaic",
     "cases": 22, "severity": 70, "level": "warning",
     "latest_case": "2026-03-02T14:00:00",
     "message": "⚠️ 22 cases of Soybean Yellow Mosaic detected in Indore"},
    {"district": "Guntur", "state": "Andhra Pradesh", "disease": "Chilli Anthracnose",
     "cases": 30, "severity": 80, "level": "critical",
     "latest_case": "2026-03-03T08:45:00",
     "message": "⚠️ 30 cases of Chilli Anthracnose detected in Guntur"},
    {"district": "Nashik", "state": "Maharashtra", "disease": "Powdery Mildew",
     "cases": 20, "severity": 65, "level": "warning",
     "latest_case": "2026-03-02T11:10:00",
     "message": "⚠️ 20 cases of Powdery Mildew detected in Nashik"},
]


# ==================================================
# ENDPOINTS
# ==================================================

@router.get("/health")
async def map_health():
    """Check outbreak map service health"""
    return {
        "service": "outbreak-map",
        "status": "healthy",
        "coverage": {
            "states": len(INDIA_STATES),
            "districts": sum(len(s.get("districts", {})) for s in INDIA_STATES.values())
        },
        "features": [
            "Real-time heatmap",
            "District clustering",
            "Time-lapse animation",
            "Severity indicators",
            "GeoJSON export"
        ]
    }


@router.get("/points")
async def get_outbreak_points(
    days: int = Query(30, le=365, description="Number of days to look back"),
    min_confidence: float = Query(0.5, ge=0, le=1),
    state: Optional[str] = Query(None, description="Filter by state"),
    disease: Optional[str] = Query(None, description="Filter by disease")
):
    """
    Get disease outbreak points for map visualization
    
    Returns individual detection points with GPS
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=days)
        
        # Build query
        query = """
            SELECT 
                COALESCE(latitude, 0) as lat,
                COALESCE(longitude, 0) as lng,
                disease_name,
                COALESCE(disease_hindi, disease_name) as disease_hindi,
                crop,
                confidence,
                severity,
                district,
                state,
                detected_at
            FROM disease_analytics
            WHERE detected_at >= ?
              AND confidence >= ?
              AND disease_name != 'healthy'
        """
        params = [cutoff, min_confidence]
        
        if state:
            query += " AND state = ?"
            params.append(state)
        
        if disease:
            query += " AND disease_name = ?"
            params.append(disease)
        
        query += " ORDER BY detected_at DESC LIMIT 500"
        
        result = conn.execute(query, params).fetchall()
        
        points = []
        for row in result:
            # Get coordinates from district if not available
            lat, lng = row[0], row[1]
            if lat == 0 or lng == 0:
                coords = get_district_coordinates(row[7] or "Unknown", row[8] or "Unknown")
                lat, lng = coords["lat"], coords["lng"]
            
            points.append({
                "lat": lat,
                "lng": lng,
                "disease": row[2],
                "disease_hindi": row[3],
                "crop": row[4],
                "confidence": round(row[5] or 0, 3),
                "severity": row[6],
                "district": row[7],
                "state": row[8],
                "detected_at": row[9].isoformat() if row[9] else None
            })
        
        return {
            "period_days": days,
            "total_points": len(points),
            "filters": {
                "state": state,
                "disease": disease,
                "min_confidence": min_confidence
            },
            "points": points
        }
    
    except Exception as e:
        logger.error(f"Get outbreak points error: {e}")
        raise HTTPException(500, str(e))


@router.get("/clusters")
async def get_district_clusters(
    days: int = Query(30, le=365)
):
    """
    Get district-level disease clusters
    
    Aggregates cases per district with severity score
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=days)
        
        result = conn.execute("""
            SELECT 
                district,
                state,
                disease_name,
                COUNT(*) as cases,
                AVG(confidence) as avg_confidence,
                COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe_count,
                MAX(detected_at) as last_case
            FROM disease_analytics
            WHERE detected_at >= ?
              AND disease_name != 'healthy'
            GROUP BY district, state, disease_name
            ORDER BY cases DESC
        """, [cutoff]).fetchall()
        
        # Aggregate by district
        districts = {}
        for row in result:
            district = row[0] or "Unknown"
            state = row[1] or "Unknown"
            key = f"{district}_{state}"
            
            if key not in districts:
                coords = get_district_coordinates(district, state)
                districts[key] = {
                    "district": district,
                    "state": state,
                    "lat": coords["lat"],
                    "lng": coords["lng"],
                    "total_cases": 0,
                    "diseases": {},
                    "severe_count": 0,
                    "last_case": None
                }
            
            districts[key]["total_cases"] += row[3]
            districts[key]["diseases"][row[2]] = row[3]
            districts[key]["severe_count"] += row[5] or 0
            
            if row[6]:
                if not districts[key]["last_case"] or row[6] > districts[key]["last_case"]:
                    districts[key]["last_case"] = row[6]
        
        # Calculate severity score and status
        clusters = []
        for d in districts.values():
            # Severity score: 0-100
            severity_score = min(100, (d["total_cases"] * 5) + (d["severe_count"] * 20))
            
            # Status based on severity
            if severity_score >= 70:
                status = "red"
            elif severity_score >= 30:
                status = "yellow"
            else:
                status = "green"
            
            clusters.append({
                **d,
                "severity_score": severity_score,
                "status": status,
                "last_case": d["last_case"].isoformat() if d["last_case"] else None
            })
        
        # Sort by severity
        clusters.sort(key=lambda x: x["severity_score"], reverse=True)

        # Fall back to demo data when DuckDB has no real records
        if not clusters:
            clusters = DEMO_CLUSTERS

        return {
            "period_days": days,
            "total_clusters": len(clusters),
            "red_zones": sum(1 for c in clusters if c["status"] == "red"),
            "yellow_zones": sum(1 for c in clusters if c["status"] == "yellow"),
            "green_zones": sum(1 for c in clusters if c["status"] == "green"),
            "clusters": clusters,
            "is_demo": not bool(result)
        }
    
    except Exception as e:
        logger.error(f"Get clusters error: {e}")
        raise HTTPException(500, str(e))


@router.get("/timelapse")
async def get_outbreak_timelapse(
    days: int = Query(30, le=90),
    interval: str = Query("day", description="Aggregation: day, week")
):
    """
    Get outbreak spread over time for animation
    
    Returns daily/weekly case counts
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=days)
        
        trunc = "day" if interval == "day" else "week"
        
        result = conn.execute(f"""
            SELECT 
                DATE_TRUNC('{trunc}', detected_at) as period,
                COUNT(*) as cases,
                COUNT(DISTINCT district) as districts,
                MODE(disease_name) as top_disease
            FROM disease_analytics
            WHERE detected_at >= ?
              AND disease_name != 'healthy'
            GROUP BY period
            ORDER BY period
        """, [cutoff]).fetchall()
        
        timeframes = []
        prev_cases = 0
        
        for row in result:
            cases = row[1]
            timeframes.append({
                "date": row[0].strftime("%Y-%m-%d") if row[0] else None,
                "cases": cases,
                "new_cases": cases - prev_cases if prev_cases else cases,
                "districts_affected": row[2],
                "top_disease": row[3]
            })
            prev_cases = cases
        
        return {
            "period_days": days,
            "interval": interval,
            "frames": len(timeframes),
            "peak_day": max(timeframes, key=lambda x: x["cases"])["date"] if timeframes else None,
            "timeframes": timeframes
        }
    
    except Exception as e:
        logger.error(f"Timelapse error: {e}")
        raise HTTPException(500, str(e))


@router.get("/heatmap-data")
async def get_heatmap_data(
    days: int = Query(30, le=365)
):
    """
    Get heatmap intensity data for Leaflet
    
    Returns [lat, lng, intensity] format
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=days)
        
        result = conn.execute("""
            SELECT 
                district,
                state,
                COUNT(*) as cases,
                COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe
            FROM disease_analytics
            WHERE detected_at >= ?
              AND disease_name != 'healthy'
            GROUP BY district, state
        """, [cutoff]).fetchall()
        
        heatmap_data = []
        max_cases = max((row[2] for row in result), default=1)
        
        for row in result:
            coords = get_district_coordinates(row[0] or "Unknown", row[1] or "Unknown")
            
            # Intensity: normalized 0-1, boosted by severe cases
            intensity = (row[2] / max_cases) + (row[3] * 0.2 / max_cases)
            intensity = min(1.0, intensity)
            
            heatmap_data.append([
                coords["lat"],
                coords["lng"],
                round(intensity, 3)
            ])
        
        return {
            "period_days": days,
            "total_districts": len(heatmap_data),
            "max_intensity_district": result[0][0] if result else None,
            "heatmap": heatmap_data
        }
    
    except Exception as e:
        logger.error(f"Heatmap data error: {e}")
        raise HTTPException(500, str(e))


@router.get("/geojson")
async def get_outbreak_geojson(
    days: int = Query(30, le=365)
):
    """
    Export outbreak data as GeoJSON for advanced mapping
    
    Compatible with QGIS, ArcGIS, Leaflet GeoJSON layer
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=days)
        
        result = conn.execute("""
            SELECT 
                district,
                state,
                disease_name,
                COUNT(*) as cases,
                AVG(confidence) as avg_confidence,
                COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe_count
            FROM disease_analytics
            WHERE detected_at >= ?
              AND disease_name != 'healthy'
            GROUP BY district, state, disease_name
        """, [cutoff]).fetchall()
        
        features = []
        for row in result:
            coords = get_district_coordinates(row[0] or "Unknown", row[1] or "Unknown")
            
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [coords["lng"], coords["lat"]]
                },
                "properties": {
                    "district": row[0],
                    "state": row[1],
                    "disease": row[2],
                    "cases": row[3],
                    "avg_confidence": round(row[4] or 0, 3),
                    "severe_cases": row[5] or 0
                }
            })
        
        geojson = {
            "type": "FeatureCollection",
            "features": features,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "period_days": days,
                "source": "AgriSahayak Disease Analytics"
            }
        }
        
        return geojson
    
    except Exception as e:
        logger.error(f"GeoJSON export error: {e}")
        raise HTTPException(500, str(e))


@router.get("/alerts")
async def get_outbreak_alerts(
    severity_threshold: int = Query(50, ge=0, le=100)
):
    """
    Get active outbreak alerts
    
    Returns districts with high disease activity
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=7)  # Last week only
        
        result = conn.execute("""
            SELECT 
                district,
                state,
                disease_name,
                COUNT(*) as cases,
                MAX(detected_at) as latest
            FROM disease_analytics
            WHERE detected_at >= ?
              AND disease_name != 'healthy'
            GROUP BY district, state, disease_name
            HAVING COUNT(*) >= 3
            ORDER BY cases DESC
            LIMIT 20
        """, [cutoff]).fetchall()
        
        alerts = []
        for row in result:
            severity = min(100, row[3] * 10)
            
            if severity >= severity_threshold:
                alerts.append({
                    "district": row[0],
                    "state": row[1],
                    "disease": row[2],
                    "cases": row[3],
                    "severity": severity,
                    "level": "critical" if severity >= 80 else ("warning" if severity >= 50 else "watch"),
                    "latest_case": row[4].isoformat() if row[4] else None,
                    "message": f"⚠️ {row[3]} cases of {row[2]} detected in {row[0]}"
                })
        
        # Fall back to demo data when DuckDB has no real records
        if not alerts:
            alerts = [a for a in DEMO_ALERTS if a["severity"] >= severity_threshold]

        return {
            "active_alerts": len(alerts),
            "critical": sum(1 for a in alerts if a["level"] == "critical"),
            "warning": sum(1 for a in alerts if a["level"] == "warning"),
            "alerts": alerts,
            "is_demo": not bool(result)
        }
    
    except Exception as e:
        logger.error(f"Alerts error: {e}")
        raise HTTPException(500, str(e))


@router.get("/state-summary")
async def get_state_summary(
    days: int = Query(30, le=365)
):
    """
    Get state-level disease summary
    
    For choropleth map coloring
    """
    try:
        conn = get_duckdb()
        cutoff = datetime.now() - timedelta(days=days)
        
        result = conn.execute("""
            SELECT 
                state,
                COUNT(*) as total_cases,
                COUNT(DISTINCT district) as affected_districts,
                COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe_cases,
                MODE(disease_name) as most_common_disease
            FROM disease_analytics
            WHERE detected_at >= ?
              AND disease_name != 'healthy'
            GROUP BY state
            ORDER BY total_cases DESC
        """, [cutoff]).fetchall()
        
        summaries = []
        for row in result:
            state_info = INDIA_STATES.get(row[0], {})
            
            summaries.append({
                "state": row[0],
                "lat": state_info.get("lat", 20.5937),
                "lng": state_info.get("lng", 78.9629),
                "total_cases": row[1],
                "affected_districts": row[2],
                "severe_cases": row[3] or 0,
                "most_common_disease": row[4],
                "intensity": min(1.0, row[1] / 100)  # Normalized
            })
        
        return {
            "period_days": days,
            "states_affected": len(summaries),
            "total_cases": sum(s["total_cases"] for s in summaries),
            "summaries": summaries
        }
    
    except Exception as e:
        logger.error(f"State summary error: {e}")
        raise HTTPException(500, str(e))


@router.post("/seed-demo-data")
async def seed_demo_data_endpoint(count: int = Query(1000, le=5000)):
    """
    Seed DuckDB with demo outbreak data for analytics testing.

    Generates realistic disease records distributed across 15+ Indian states,
    using India-bounded coordinates, varied disease names, severity 1-10, and
    random status values.
    """
    import random
    import asyncio
    from app.analytics.duckdb_engine import sync_disease_data

    DISEASE_NAMES = ["Blast", "Brown Spot", "Blight", "Rust", "Wilt", "Mosaic", "Rot"]
    STATUSES = ["active", "resolved", "monitoring"]
    CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Soybean",
             "Groundnut", "Tomato", "Potato", "Onion", "Chilli", "Ragi"]

    # Build flat list of (state, district, base_lat, base_lng) from INDIA_STATES
    locations = []
    for state_name, state_data in INDIA_STATES.items():
        for district_name, coords in state_data.get("districts", {}).items():
            locations.append((state_name, district_name, coords["lat"], coords["lng"]))

    records = []
    for i in range(count):
        state, district, base_lat, base_lng = random.choice(locations)
        # Clamp to India bounds: lat 8.0–37.0, lon 68.0–97.5
        lat = round(max(8.0, min(37.0, base_lat + random.uniform(-0.2, 0.2))), 6)
        lng = round(max(68.0, min(97.5, base_lng + random.uniform(-0.2, 0.2))), 6)

        disease = random.choice(DISEASE_NAMES)
        severity_score = round(random.uniform(1, 10), 2)
        # Map numeric score to string for disease_analytics schema
        if severity_score >= 7:
            severity_str = "severe"
        elif severity_score >= 4:
            severity_str = "moderate"
        else:
            severity_str = "mild"

        records.append({
            "id": i + 1,
            "disease_name": disease,
            "disease_hindi": disease,
            "crop": random.choice(CROPS),
            "confidence": round(random.uniform(0.65, 0.98), 3),
            "severity": severity_str,
            "district": district,
            "state": state,
            "latitude": lat,
            "longitude": lng,
            "farmer_id": f"F{state[:2].upper()}{random.randint(1000, 9999)}",
            "detected_at": datetime.utcnow() - timedelta(days=random.randint(0, 90)),
            # status included for completeness (not stored in disease_analytics)
            "status": random.choice(STATUSES),
        })

    try:
        synced = await asyncio.to_thread(sync_disease_data, records)
        return {
            "count": synced,
            "message": f"Seeded {synced} outbreak records",
        }
    except Exception as e:
        logger.error(f"Seed demo data error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
