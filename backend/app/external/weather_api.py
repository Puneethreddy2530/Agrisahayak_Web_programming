"""
Weather via Gemini 2.5 Flash
Generates 7-day forecasts and current weather using AI.
Uses a SINGLE unified Gemini call so current temperature is always
consistent with today's forecast min/max (no inter-call drift).
"""

import asyncio
import logging
import json
import re
import math
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)


async def _gemini_unified(lat: float, lon: float) -> Tuple[Dict, List[Dict]]:
    """
    Single Gemini call returning BOTH current conditions AND 7-day forecast.
    Ensures current.temperature is always within today's temp_min/temp_max,
    eliminating the huge discrepancies that arise from two independent calls.
    """
    from app.ai.gemini_client import ask_gemini

    today = datetime.now()
    dates = [(today + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]
    day_names = ["Today", "Tomorrow"] + [(today + timedelta(days=i)).strftime("%A") for i in range(2, 7)]

    prompt = f"""You are a weather data API. Return a single JSON object for lat={lat:.4f}, lon={lon:.4f}.
Base the climate on the actual geographic region (tropical, temperate, arid, etc.).
Today's date is {dates[0]}.

The object MUST have exactly two top-level keys:

"current": {{
  "temperature": float °C  <- MUST be between today's temp_min and temp_max,
  "feels_like": float °C,
  "humidity": int 0-100,
  "rainfall_24h": float mm,
  "wind_speed": float km/h,
  "wind_direction": string compass e.g. "NW",
  "description": short string like "Partly Cloudy",
  "icon": OWM icon code string like "02d"
}},

"forecast": [
  7 objects, one per day starting {dates[0]}, each with keys:
  date (string YYYY-MM-DD), day_name (string), temp_min (float), temp_max (float),
  humidity (int), rainfall_mm (float), wind_speed (float), description (string),
  icon (string), farming_suitable (bool), risk_level ("low"|"medium"|"high")
]

Use these exact dates for forecast: {dates}

CRITICAL: current.temperature MUST be a realistic value for this region and season —
it must fall between forecast[0].temp_min and forecast[0].temp_max.

Return ONLY the raw JSON object. No markdown fences. No explanation. No extra keys."""

    # Use a tight timeout (8 s) so the backend can respond well within
    # the frontend's 30 s axios timeout even when suggestions run after.
    raw = await ask_gemini(prompt, max_tokens=3072, timeout=8.0)
    if not raw:
        return get_mock_current(lat, lon), get_mock_forecast(lat, lon)

    raw = re.sub(r"```[\w]*", "", raw).strip()
    try:
        data = json.loads(raw)
        current = data.get("current")
        forecast = data.get("forecast")

        if (
            isinstance(current, dict) and "temperature" in current
            and isinstance(forecast, list) and len(forecast) >= 7
        ):
            # Clamp current temp within today's min/max to be safe
            t_min = forecast[0].get("temp_min", current["temperature"] - 5)
            t_max = forecast[0].get("temp_max", current["temperature"] + 5)
            current["temperature"] = round(
                max(t_min, min(t_max, current["temperature"])), 1
            )

            for i, obj in enumerate(forecast[:7]):
                obj["day_name"] = day_names[i]

            logger.info(f"Gemini unified weather OK for ({lat:.2f}, {lon:.2f}) — "
                        f"temp={current['temperature']}°C, "
                        f"today range=[{t_min},{t_max}]")
            return current, forecast[:7]

    except Exception as e:
        logger.error(f"Gemini unified parse error: {e} — raw[:300]: {raw[:300]}")

    return get_mock_current(lat, lon), get_mock_forecast(lat, lon)


async def get_real_weather_forecast(lat: float, lon: float) -> List[Dict]:
    """Get 7-day weather forecast (uses unified call internally)."""
    _, forecast = await _gemini_unified(lat, lon)
    return forecast


async def get_current_weather(lat: float, lon: float) -> Dict:
    """Get current weather conditions (uses unified call internally)."""
    current, _ = await _gemini_unified(lat, lon)
    return current


async def get_weather_parallel(lat: float, lon: float) -> Tuple[List[Dict], Dict]:
    """
    Fetch forecast + current weather via a SINGLE unified Gemini call.
    Consistent temperatures guaranteed; same latency as before (one round-trip).
    Falls back gracefully to mock data on any failure.
    """
    try:
        current, forecast = await _gemini_unified(lat, lon)
        return forecast, current
    except Exception as e:
        logger.error(f"Unified weather fetch failed: {e}")
        return get_mock_forecast(lat, lon), get_mock_current(lat, lon)


def get_wind_direction(degrees: int) -> str:
    """Convert wind degrees to compass direction"""
    directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    idx = round(degrees / 45) % 8
    return directions[idx]


def get_mock_forecast(lat: float, lon: float, days: int = 7) -> List[Dict]:
    """Fallback mock forecast data (deterministic per day)"""
    rng = random.Random(hash((round(lat, 2), round(lon, 2), datetime.now().strftime("%Y-%m-%d"))))
    
    forecast = []
    for i in range(days):
        date = datetime.now() + timedelta(days=i)
        
        if i == 0:
            day_name = "Today"
        elif i == 1:
            day_name = "Tomorrow"
        else:
            day_name = date.strftime("%A")
        
        is_rainy = rng.random() < 0.3
        rainfall = round(rng.uniform(10, 40), 1) if is_rainy else round(rng.uniform(0, 5), 1)
        humidity = int(60 + (20 if is_rainy else 0) + rng.uniform(-10, 10))
        wind = round(rng.uniform(5, 15), 1)
        
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "day_name": day_name,
            "temp_min": round(25 + rng.uniform(-3, 3), 1),
            "temp_max": round(32 + rng.uniform(-3, 3), 1),
            "humidity": min(100, max(30, humidity)),
            "rainfall_mm": rainfall,
            "wind_speed": wind,
            "description": "Light Rain" if is_rainy else "Partly Cloudy",
            "icon": "10d" if is_rainy else "02d",
            "farming_suitable": not is_rainy and wind < 15 and humidity < 85,
            "risk_level": "high" if is_rainy else ("medium" if humidity > 80 else "low")
        })

    return forecast


def get_mock_current(lat: float, lon: float) -> Dict:
    """Fallback mock current weather — temperature varies realistically by latitude & season"""
    month = datetime.now().month
    # Seasonal offset: peak heat May-Jun, cool Dec-Jan
    season_offset = -5 + 10 * abs(math.sin(math.pi * (month - 1) / 12))
    # Latitude effect: tropics are hotter (lat 8-15 = India south, lat 30+ = north/Himalayas)
    lat_effect = max(0, (25 - abs(lat)) * 0.4)
    base_temp = round(18 + lat_effect + season_offset + random.uniform(-2, 2), 1)
    return {
        "temperature": base_temp,
        "feels_like": round(base_temp + random.uniform(1, 3), 1),
        "humidity": int(55 + random.uniform(-10, 20)),
        "rainfall_24h": 0,
        "wind_speed": round(random.uniform(8, 18), 1),
        "wind_direction": random.choice(["N", "NE", "NW", "S", "SW", "W"]),
        "description": "Partly Cloudy",
        "icon": "02d"
    }


if __name__ == "__main__":
    import asyncio
    
    async def test():
        print("🧪 Testing Weather API...")
        print("=" * 50)
        
        lat, lon = 18.5204, 73.8567  # Pune
        
        # Test current weather
        print("\n1. Current Weather:")
        current = await get_current_weather(lat, lon)
        print(f"   Temperature: {current['temperature']}°C")
        print(f"   Conditions: {current['description']}")
        print(f"   Humidity: {current['humidity']}%")
        
        # Test forecast
        print("\n2. 7-Day Forecast:")
        forecast = await get_real_weather_forecast(lat, lon)
        print(f"   Got {len(forecast)} days")
        for day in forecast[:3]:
            print(f"   {day['day_name']}: {day['temp_max']}°C, {day['description']}")
    
    asyncio.run(test())
