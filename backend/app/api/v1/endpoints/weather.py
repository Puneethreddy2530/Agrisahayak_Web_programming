"""
Weather Risk Intelligence Endpoints
Decision intelligence, not just data display
Rainfall → Fungal risk, Humidity → Pest risk, Temperature → Irrigation needs
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import asyncio
import logging

# Import real weather API + location-aware mock fallbacks
from app.external.weather_api import (
    get_weather_parallel,
    get_real_weather_forecast,
    get_mock_forecast,
    get_mock_current,
)

# AI: Gemini for weather data suggestions (fallback), Ollama (local GPU) as primary
from app.ai.gemini_client import get_weather_suggestions


async def _suggestions_via_ollama(
    location: str, crop: Optional[str],
    temperature: float, humidity: float, rainfall_24h: float,
    forecast_summary: str, alerts_str: str,
    irrigation_rec: str, harvest_rec: str, risk_score: int,
) -> str:
    """Generate farming suggestions via Ollama (local GPU). Raises on failure."""
    from app.chatbot.ollama_client import ask_ollama

    crop_line = f"Crop: {crop}." if crop else "No specific crop."
    prompt = (
        f"Weather summary for {location}:\n"
        f"Temp {temperature}°C, Humidity {humidity}%, Rain last 24h: {rainfall_24h}mm\n"
        f"Forecast: {forecast_summary}\n"
        f"Active alerts: {alerts_str or 'None'}\n"
        f"Irrigation advisory: {irrigation_rec} | Harvest advisory: {harvest_rec}\n"
        f"Risk score: {risk_score}/100. {crop_line}\n\n"
        "Give a farmer exactly 3-4 concise bullet-point farming tips for today and the next 3 days. "
        "Each tip must mention a specific action and timing. Under 20 words per bullet. "
        "Indian context (mandi, kharif, rabi, acres)."
    )
    result = await ask_ollama(prompt, max_tokens=250, temperature=0.5)
    text = result.get("answer", "").strip()
    if not text:
        raise ValueError("Ollama returned empty response")
    return text

logger = logging.getLogger(__name__)

router = APIRouter()

# ==================================================
# CACHE CONFIGURATION
# ==================================================
WEATHER_CACHE = {}
CACHE_TTL_MINUTES = 10


# ==================================================
# MODELS
# ==================================================
class WeatherData(BaseModel):
    """Current weather information"""
    temperature: float
    feels_like: float
    humidity: float
    rainfall_24h: float
    wind_speed: float
    wind_direction: str
    uv_index: Optional[float] = None
    description: str
    icon: str


class DayForecast(BaseModel):
    """Daily forecast with risk analysis"""
    date: str
    day_name: str
    temp_min: float
    temp_max: float
    humidity: float
    rainfall_mm: float
    wind_speed: float
    description: str
    farming_suitable: bool
    risk_level: str


class RiskAlert(BaseModel):
    """Risk intelligence alert"""
    risk_type: str
    severity: str  # low, medium, high, critical
    title: str
    description: str
    trigger: str
    action_required: str
    time_sensitive: bool
    crops_affected: List[str]


class SprayWindow(BaseModel):
    """Optimal spray timing"""
    date: str
    time_slots: List[str]
    suitability: str
    reason: str


class WeatherIntelligence(BaseModel):
    """Complete weather intelligence response"""
    location: str
    current: WeatherData
    forecast_7day: List[DayForecast]
    risk_alerts: List[RiskAlert]
    spray_windows: List[SprayWindow]
    irrigation_advice: Dict
    harvest_outlook: Dict
    overall_risk_score: int  # 0-100


# ==================================================
# RISK THRESHOLDS
# ==================================================
THRESHOLDS = {
    "fungal_risk": {
        "rainfall_3day": 50,  # mm - High fungal risk if > 50mm in 3 days
        "humidity_sustained": 85,  # % - Sustained high humidity
        "temp_optimal": (20, 30)  # °C - Fungal growth optimal range
    },
    "pest_risk": {
        "temp_min": 25,  # °C - Pests active above this
        "humidity_min": 70,  # % - High pest activity
        "wind_max": 15  # km/h - Low wind = more pests
    },
    "spray_conditions": {
        "wind_max": 10,  # km/h - Too windy above this
        "rain_hours": 4,  # hours - No rain expected
        "humidity_range": (40, 85)
    },
    "irrigation": {
        "high_temp": 35,  # °C - Increase irrigation
        "low_rainfall": 5,  # mm - Irrigate if < 5mm in 3 days
        "high_evaporation": 40  # % humidity - high evaporation
    },
    "harvest": {
        "rain_risk": 10,  # mm - Delay harvest if > 10mm expected
        "humidity_max": 75,  # % - Too moist for harvest
        "wind_max": 25  # km/h - Too windy
    }
}

# Crop-specific risk mapping
CROP_RISKS = {
    "rice": {
        "diseases": ["blast", "brown_spot", "bacterial_blight"],
        "humidity_sensitive": True,
        "waterlogging_tolerant": True
    },
    "wheat": {
        "diseases": ["rust", "powdery_mildew", "karnal_bunt"],
        "humidity_sensitive": True,
        "waterlogging_tolerant": False
    },
    "tomato": {
        "diseases": ["early_blight", "late_blight", "leaf_curl"],
        "humidity_sensitive": True,
        "waterlogging_tolerant": False
    },
    "potato": {
        "diseases": ["late_blight", "early_blight", "black_scurf"],
        "humidity_sensitive": True,
        "waterlogging_tolerant": False
    },
    "cotton": {
        "diseases": ["bacterial_blight", "root_rot"],
        "humidity_sensitive": True,
        "waterlogging_tolerant": False
    },
    "onion": {
        "diseases": ["purple_blotch", "downy_mildew"],
        "humidity_sensitive": True,
        "waterlogging_tolerant": False
    }
}


# ==================================================
# INTELLIGENCE FUNCTIONS
# ==================================================
def analyze_risks(forecast: List[Dict], crop: str = None) -> List[RiskAlert]:
    """Analyze weather data and generate risk alerts"""
    alerts = []
    
    if not forecast:
        return alerts
    
    # Normalize crop name for lookup
    if crop:
        crop = crop.lower()
    
    # Calculate 3-day totals (use available days)
    days_3 = forecast[:3]
    rainfall_3day = sum(f["rainfall_mm"] for f in days_3)
    avg_humidity_3day = sum(f["humidity"] for f in days_3) / len(days_3)
    max_temp_3day = max(f["temp_max"] for f in days_3)
    min_wind = min(f["wind_speed"] for f in days_3)
    
    # 🍄 FUNGAL DISEASE RISK
    if rainfall_3day > THRESHOLDS["fungal_risk"]["rainfall_3day"]:
        severity = "critical" if rainfall_3day > 100 else "high"
        crops = CROP_RISKS.get(crop, {}).get("diseases", ["all crops"]) if crop else ["tomato", "potato", "rice"]
        alerts.append(RiskAlert(
            risk_type="FUNGAL_DISEASE",
            severity=severity,
            title="🍄 High Fungal Disease Risk",
            description=f"Expected {rainfall_3day:.0f}mm rainfall in next 3 days creates ideal conditions for fungal diseases",
            trigger=f"Rainfall > {THRESHOLDS['fungal_risk']['rainfall_3day']}mm threshold",
            action_required="Apply preventive fungicide spray (Mancozeb/Copper) before rain starts",
            time_sensitive=True,
            crops_affected=crops
        ))
    
    if avg_humidity_3day > THRESHOLDS["fungal_risk"]["humidity_sustained"]:
        alerts.append(RiskAlert(
            risk_type="HUMIDITY_RISK",
            severity="high",
            title="💧 Sustained High Humidity Alert",
            description=f"Average humidity {avg_humidity_3day:.0f}% over 3 days increases disease pressure",
            trigger=f"Humidity > {THRESHOLDS['fungal_risk']['humidity_sustained']}% sustained",
            action_required="Improve air circulation, avoid evening irrigation, scout for diseases",
            time_sensitive=False,
            crops_affected=["tomato", "potato", "onion", "chilli"]
        ))
    
    # 🐛 PEST RISK
    if max_temp_3day > THRESHOLDS["pest_risk"]["temp_min"] and min_wind < THRESHOLDS["pest_risk"]["wind_max"]:
        alerts.append(RiskAlert(
            risk_type="PEST_OUTBREAK",
            severity="medium",
            title="🐛 Increased Pest Activity Expected",
            description=f"Warm temps ({max_temp_3day:.0f}°C) + low wind = ideal pest conditions",
            trigger=f"Temp > {THRESHOLDS['pest_risk']['temp_min']}°C, Wind < {THRESHOLDS['pest_risk']['wind_max']}km/h",
            action_required="Scout for aphids, whiteflies, caterpillars. Apply neem oil preventively",
            time_sensitive=False,
            crops_affected=["cotton", "vegetables", "pulses"]
        ))
    
    # 🌊 WATERLOGGING RISK
    if rainfall_3day > 80:
        alerts.append(RiskAlert(
            risk_type="WATERLOGGING",
            severity="high",
            title="🌊 Waterlogging Risk",
            description=f"Heavy rainfall ({rainfall_3day:.0f}mm) may cause waterlogging in low-lying areas",
            trigger="Rainfall > 80mm in 3 days",
            action_required="Clear drainage channels, prepare pumps for water removal",
            time_sensitive=True,
            crops_affected=["potato", "onion", "groundnut", "vegetables"]
        ))
    
    # 🔥 HEAT STRESS
    if max_temp_3day > 38:
        alerts.append(RiskAlert(
            risk_type="HEAT_STRESS",
            severity="high" if max_temp_3day > 42 else "medium",
            title="🔥 Heat Stress Warning",
            description=f"Maximum temperature {max_temp_3day:.0f}°C may cause crop stress",
            trigger="Temperature > 38°C",
            action_required="Increase irrigation frequency, apply mulch, avoid midday field work",
            time_sensitive=True,
            crops_affected=["all standing crops"]
        ))
    
    # 🌬️ WIND DAMAGE
    max_wind = max(f["wind_speed"] for f in days_3)
    if max_wind > 30:
        alerts.append(RiskAlert(
            risk_type="WIND_DAMAGE",
            severity="high",
            title="🌬️ Strong Wind Warning",
            description=f"Wind speeds up to {max_wind:.0f} km/h expected",
            trigger="Wind > 30 km/h",
            action_required="Stake tall crops, protect nurseries, avoid spraying",
            time_sensitive=True,
            crops_affected=["banana", "sugarcane", "maize", "vegetables"]
        ))
    
    return alerts


def calculate_spray_windows(forecast: List[Dict]) -> List[SprayWindow]:
    """Calculate optimal spray timing"""
    windows = []
    
    for f in forecast[:5]:
        if f["rainfall_mm"] < 5 and f["wind_speed"] < THRESHOLDS["spray_conditions"]["wind_max"]:
            if f["humidity"] < 85:
                windows.append(SprayWindow(
                    date=f["date"],
                    time_slots=["6:00-9:00 AM", "4:00-6:00 PM"],
                    suitability="excellent" if f["wind_speed"] < 5 else "good",
                    reason="Low wind, no rain expected, suitable humidity"
                ))
            else:
                windows.append(SprayWindow(
                    date=f["date"],
                    time_slots=["7:00-9:00 AM"],
                    suitability="fair",
                    reason="Morning only - high humidity in evening"
                ))
    
    return windows


def generate_irrigation_advice(forecast: List[Dict]) -> Dict:
    """Generate smart irrigation advice"""
    if not forecast:
        return {"recommendation": "NORMAL", "reason": "No forecast data available", "water_savings": None, "next_3_days_rainfall": 0, "evapotranspiration_risk": "normal"}
    
    days_3 = forecast[:3]
    rainfall_3day = sum(f["rainfall_mm"] for f in days_3)
    max_temp = max(f["temp_max"] for f in days_3)
    avg_humidity = sum(f["humidity"] for f in days_3) / len(days_3)
    
    if rainfall_3day > 30:
        recommendation = "SKIP"
        reason = f"Expected {rainfall_3day:.0f}mm rainfall - skip irrigation for 3-4 days"
        savings = f"Save ~{rainfall_3day * 100:.0f} liters/acre"
    elif max_temp > 35 and avg_humidity < 50:
        recommendation = "INCREASE"
        reason = f"High temp ({max_temp:.0f}°C) + low humidity = high evaporation"
        savings = None
    elif rainfall_3day > 10:
        recommendation = "REDUCE"
        reason = f"Light rain expected ({rainfall_3day:.0f}mm) - reduce irrigation by 50%"
        savings = f"Save ~{rainfall_3day * 50:.0f} liters/acre"
    else:
        recommendation = "NORMAL"
        reason = "Continue regular irrigation schedule"
        savings = None
    
    return {
        "recommendation": recommendation,
        "reason": reason,
        "water_savings": savings,
        "next_3_days_rainfall": round(rainfall_3day, 1),
        "evapotranspiration_risk": "high" if max_temp > 35 else "normal"
    }


def generate_harvest_outlook(forecast: List[Dict]) -> Dict:
    """Generate harvest timing advice"""
    if not forecast:
        return {"recommendation": "MONITOR", "best_harvest_days": [], "reason": "No forecast data available", "grain_drying": "Monitor conditions"}
    
    # Find best harvest window
    best_days = []
    risky_days = []
    
    for f in forecast[:7]:
        if f["rainfall_mm"] < 5 and f["humidity"] < 75 and f["wind_speed"] < 25:
            best_days.append(f["date"])
        elif f["rainfall_mm"] > 20:
            risky_days.append(f["date"])
    
    if best_days:
        recommendation = "PROCEED"
        window = best_days[:3]
        reason = "Dry conditions expected - good for harvesting"
    elif risky_days:
        recommendation = "DELAY"
        window = []
        reason = f"Rain expected on {', '.join(risky_days[:2])} - wait for clear weather"
    else:
        recommendation = "MONITOR"
        window = []
        reason = "Mixed conditions - monitor daily forecast"
    
    return {
        "recommendation": recommendation,
        "best_harvest_days": window,
        "reason": reason,
        "grain_drying": "Indoor drying recommended" if forecast[0]["humidity"] > 70 else "Sun drying possible"
    }


def calculate_risk_score(alerts: List[RiskAlert]) -> int:
    """Calculate overall risk score 0-100"""
    if not alerts:
        return 10
    
    severity_scores = {"low": 15, "medium": 30, "high": 50, "critical": 75}
    
    # New logic: Weighted Max
    # Score = Max_Severity + (Count * 5)
    # This ensures critical alerts dominate (75+), but multiple alerts slightly increase risk
    
    max_severity_score = 0
    for alert in alerts:
        score = severity_scores.get(alert.severity, 20)
        if score > max_severity_score:
            max_severity_score = score
            
    count_factor = len(alerts) * 5
    total_score = max_severity_score + count_factor
    
    return min(100, total_score)


# ==================================================
# RETRY WRAPPER FOR EXTERNAL APIs
# ==================================================
async def get_weather_with_retry(lat: float, lon: float):
    """
    Get weather data with IN-MEMORY CACHING (10 min TTL) + parallel fetch.
    forecast + current are fetched simultaneously via asyncio.gather.
    """
    # 1. Check Cache
    cache_key = (round(lat, 2), round(lon, 2))
    now = datetime.now()
    
    if cache_key in WEATHER_CACHE:
        data, timestamp = WEATHER_CACHE[cache_key]
        if now - timestamp < timedelta(minutes=CACHE_TTL_MINUTES):
            logger.info(f"Weather cache HIT for {cache_key}")
            return data["forecast"], data["current"]
        else:
            del WEATHER_CACHE[cache_key]  # Expired

    # 2. Fetch forecast + current IN PARALLEL
    try:
        forecast, current = await get_weather_parallel(lat, lon)

        # 3. Cache on success
        if forecast and current:
            WEATHER_CACHE[cache_key] = (
                {"forecast": forecast, "current": current},
                datetime.now()
            )
        return forecast, current

    except Exception as e:
        logger.warning(f"Weather fetch failed: {e}")
        return None, None


# ==================================================
# ENDPOINTS
# ==================================================
@router.get("/intelligence")
async def get_weather_intelligence(
    lat: float = Query(18.52, ge=-90, le=90, description="Latitude (-90 to 90)"),
    lon: float = Query(73.85, ge=-180, le=180, description="Longitude (-180 to 180)"),
    crop: Optional[str] = Query(None, description="Current crop for targeted advice"),
    district: Optional[str] = Query(None, description="District name")
):
    """
    Get complete weather risk intelligence with REAL weather data.
    
    Not just weather data - actionable decisions:
    - Fungal disease risk alerts
    - Pest outbreak predictions
    - Optimal spray windows
    - Smart irrigation advice
    - Harvest timing
    """
    
    # ✅ Get REAL weather forecast with parallel fetch + cache
    forecast, current_weather = await get_weather_with_retry(lat, lon)
    
    use_fallback = False
    if forecast is None or current_weather is None:
        # Fallback to location-aware mock data if API fails
        use_fallback = True
        forecast = get_mock_forecast(lat, lon)
        current_weather = get_mock_current(lat, lon)
    
    # Create current weather object using real data
    current = WeatherData(
        temperature=current_weather["temperature"],
        feels_like=current_weather["feels_like"],
        humidity=current_weather["humidity"],
        rainfall_24h=current_weather["rainfall_24h"],
        wind_speed=current_weather["wind_speed"],
        wind_direction=current_weather["wind_direction"],
        uv_index=current_weather.get("uv_index"),  # Dynamic or None
        description=current_weather["description"],
        icon=current_weather["icon"]
    )
    
    # Analyze risks using real forecast
    risk_alerts = analyze_risks(forecast, crop)
    
    # Calculate spray windows
    spray_windows = calculate_spray_windows(forecast)
    
    # Irrigation advice
    irrigation = generate_irrigation_advice(forecast)
    
    # Harvest outlook
    harvest = generate_harvest_outlook(forecast)
    
    # Overall risk score
    risk_score = calculate_risk_score(risk_alerts)
    
    # Build a concise 7-day forecast summary for Gemini
    rainy_days = sum(1 for f in forecast if f["rainfall_mm"] > 5)
    avg_temp = sum(f["temp_max"] for f in forecast) / len(forecast) if forecast else 28
    forecast_summary = (
        f"{rainy_days}/7 rainy days expected, avg high {avg_temp:.0f}°C, "
        f"total rainfall {sum(f['rainfall_mm'] for f in forecast):.0f}mm"
    )

    # ─────────────────────────────────────────────────────────────
    # AI Farming Suggestions
    # 1) Try Ollama (local GPU) — fast, no network latency
    # 2) Fall back to Gemini with an 8 s cap
    # 3) Skip entirely so weather data still returns quickly
    # ─────────────────────────────────────────────────────────────
    alerts_str = "; ".join(f"{a.title} ({a.severity})" for a in risk_alerts[:4])

    ai_suggestions = None
    # --- Ollama first ---
    try:
        ai_suggestions = await asyncio.wait_for(
            _suggestions_via_ollama(
                location=district or f"{lat:.2f}, {lon:.2f}",
                crop=crop,
                temperature=current.temperature,
                humidity=current.humidity,
                rainfall_24h=current.rainfall_24h,
                forecast_summary=forecast_summary,
                alerts_str=alerts_str,
                irrigation_rec=irrigation.get("recommendation", "NORMAL"),
                harvest_rec=harvest.get("recommendation", "MONITOR"),
                risk_score=risk_score,
            ),
            timeout=8.0,
        )
        logger.info("Weather suggestions via Ollama (local GPU)")
    except Exception as ollama_err:
        logger.info(f"Ollama suggestions unavailable ({ollama_err}), trying Gemini...")
        # --- Gemini fallback ---
        try:
            ai_suggestions = await asyncio.wait_for(
                get_weather_suggestions(
                    location=district or f"{lat:.2f}, {lon:.2f}",
                    crop=crop,
                    temperature=current.temperature,
                    humidity=current.humidity,
                    rainfall_24h=current.rainfall_24h,
                    forecast_summary=forecast_summary,
                    risk_alerts=[{"title": a.title, "severity": a.severity} for a in risk_alerts],
                    irrigation_recommendation=irrigation.get("recommendation", "NORMAL"),
                    harvest_recommendation=harvest.get("recommendation", "MONITOR"),
                    risk_score=risk_score,
                ),
                timeout=8.0,
            )
            logger.info("Weather suggestions via Gemini (fallback)")
        except Exception as gemini_err:
            logger.warning(f"Gemini suggestions also failed ({gemini_err}) — skipping AI tips")
    
    return {
        "location": district or f"{lat:.2f}, {lon:.2f}",
        "current": current,
        "forecast_7day": [DayForecast(**f) for f in forecast],
        "risk_alerts": risk_alerts,
        "alert_count": len(risk_alerts),
        "spray_windows": spray_windows,
        "irrigation_advice": irrigation,
        "harvest_outlook": harvest,
        "overall_risk_score": risk_score,
        "risk_level": "critical" if risk_score > 70 else ("high" if risk_score > 50 else ("medium" if risk_score > 30 else "low")),
        "ai_farming_suggestions": ai_suggestions or None,
        "data_source": "Fallback Synthetic" if use_fallback else "OpenWeatherMap",
        "generated_at": datetime.now().isoformat()
    }


@router.get("/risk-analysis")
async def analyze_specific_risk(
    risk_type: str = Query(..., description="fungal/pest/irrigation/harvest"),
    rainfall_forecast: float = Query(0, description="Expected rainfall mm"),
    humidity: float = Query(70, description="Current humidity %"),
    temperature: float = Query(28, description="Current temperature °C"),
    crop: Optional[str] = None
):
    """
    Analyze specific risk based on conditions.
    
    Decision rules:
    - Rainfall > 50mm in 3 days → Fungal risk HIGH
    - Humidity > 85% sustained → Disease pressure HIGH
    - Temp > 35°C → Irrigation needs HIGH
    """
    
    # Normalize crop name
    if crop:
        crop = crop.lower()

    allowed_risks = {"fungal", "pest", "irrigation", "harvest"}
    if risk_type not in allowed_risks:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid risk_type '{risk_type}'. Use one of: {', '.join(sorted(allowed_risks))}"
        )
    
    response = {
        "risk_type": risk_type,
        "input_conditions": {
            "rainfall": rainfall_forecast,
            "humidity": humidity,
            "temperature": temperature,
            "crop": crop
        }
    }
    
    if risk_type == "fungal":
        if rainfall_forecast > 50 and humidity > 80:
            level = "CRITICAL"
            action = "Apply preventive fungicide within 24 hours"
        elif rainfall_forecast > 30 or humidity > 85:
            level = "HIGH"
            action = "Apply fungicide within 48 hours"
        elif rainfall_forecast > 10 and humidity > 70:
            level = "MEDIUM"
            action = "Monitor closely, prepare fungicide"
        else:
            level = "LOW"
            action = "Normal monitoring"
        
        response["risk_level"] = level
        response["action"] = action
        response["diseases_to_watch"] = CROP_RISKS.get(crop, {}).get("diseases", ["general fungal diseases"])
        
    elif risk_type == "pest":
        if temperature > 30 and humidity > 70:
            level = "HIGH"
            action = "Scout fields daily, set traps"
        elif temperature > 25:
            level = "MEDIUM"
            action = "Weekly scouting recommended"
        else:
            level = "LOW"
            action = "Normal monitoring"
        
        response["risk_level"] = level
        response["action"] = action
        response["pests_to_watch"] = ["aphids", "whitefly", "caterpillars"]
        
    elif risk_type == "irrigation":
        if temperature > 35 and humidity < 50 and rainfall_forecast < 5:
            level = "CRITICAL"
            action = "Irrigate immediately, increase frequency"
        elif temperature > 30 and rainfall_forecast < 10:
            level = "HIGH"
            action = "Irrigate within 24 hours"
        elif rainfall_forecast > 20:
            level = "LOW"
            action = "Skip irrigation - rain expected"
        else:
            level = "MEDIUM"
            action = "Follow normal schedule"
        
        response["risk_level"] = level
        response["action"] = action
        
    elif risk_type == "harvest":
        if rainfall_forecast > 20:
            level = "HIGH"
            action = "Delay harvest, protect from rain"
        elif humidity > 80:
            level = "MEDIUM"
            action = "Harvest early morning, ensure proper drying"
        else:
            level = "LOW"
            action = "Proceed with harvest"
        
        response["risk_level"] = level
        response["action"] = action
    
    return response


@router.get("/spray-schedule")
async def get_spray_schedule(
    days: int = Query(default=5, le=7),
    lat: float = Query(18.52, ge=-90, le=90),
    lon: float = Query(73.85, ge=-180, le=180)
):
    """Get optimal spray schedule for next N days"""
    try:
        forecast = await get_real_weather_forecast(lat, lon)
        forecast = forecast[:days]  # Limit to requested days
    except Exception:
        forecast = get_mock_forecast(lat, lon, days)  # Fallback to location-aware mock
    windows = calculate_spray_windows(forecast)
    
    return {
        "spray_windows": windows,
        "total_suitable_days": len(windows),
        "best_day": windows[0].date if windows else "No suitable days",
        "advice": "Morning sprays (6-9 AM) are most effective" if windows else "Wait for better conditions"
    }
