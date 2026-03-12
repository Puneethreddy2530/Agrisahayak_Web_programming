"""
Gemini Flash AI Client
Used for market price advisory and weather intelligent suggestions.
Chatbot remains on Ollama.
"""

import os
import sys
import logging
import httpx
from typing import Optional

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except AttributeError:
    pass  # stdout not reconfigurable in this environment

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyClD-o2DFsljkMij8btl5L-AKRqKDDod20")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

_httpx_client: Optional[httpx.AsyncClient] = None


def _strip_markdown(text: str) -> str:
    """Remove markdown formatting from Gemini responses so plain text
    renders cleanly in the UI without **bold** or *italic* asterisks."""
    import re
    text = re.sub(r'\*{1,3}([^*\n]+?)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,2}([^_\n]+?)_{1,2}', r'\1', text)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^[\-\*]\s+', '• ', text, flags=re.MULTILINE)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


async def _get_client() -> httpx.AsyncClient:
    global _httpx_client
    if _httpx_client is None or _httpx_client.is_closed:
        # No client-level timeout — we use per-request timeouts so each caller
        # can specify how long it is willing to wait.
        _httpx_client = httpx.AsyncClient(timeout=None)
    return _httpx_client


async def ask_gemini(prompt: str, system: str = "", max_tokens: int = 512, timeout: float = 20.0) -> str:
    """
    Call Gemini 2.5 Flash and return the text response.
    timeout — per-request seconds; callers should set this aggressively.
    Returns empty string on any failure so callers can gracefully fall back.
    """
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set — skipping Gemini call")
        return ""

    contents = []
    if system:
        # Gemini doesn't have a system role — prepend as first user turn context
        contents.append({"role": "user", "parts": [{"text": system}]})
        contents.append({"role": "model", "parts": [{"text": "Understood. I will follow these instructions."}]})

    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": max_tokens,
            "topP": 0.9,
        },
    }

    try:
        client = await _get_client()
        resp = await client.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=payload,
            timeout=timeout,
        )
        if resp.status_code != 200:
            logger.error(f"Gemini API error {resp.status_code}: {resp.text[:200]}")
            return ""

        data = resp.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return ""

        parts = candidates[0].get("content", {}).get("parts", [])
        return _strip_markdown(parts[0].get("text", "")) if parts else ""

    except Exception as e:
        logger.error(f"Gemini call failed: {e}")
        return ""


async def get_market_advisory(
    commodity: str,
    commodity_hindi: str,
    national_avg: float,
    msp: Optional[float],
    trend: str,
    best_states: list,
    top_prices: list,   # list of {state, avg_price}
    lowest_prices: list,  # list of {state, avg_price}
    season: str,
) -> str:
    """
    Generate an intelligent market advisory for a commodity using Gemini Flash.
    Falls back to a simple rule-based string if Gemini is unavailable.
    """
    msp_line = f"MSP: ₹{msp}/quintal. " if msp else "No MSP for this commodity. "
    top_str = ", ".join(f"{p['state']} (₹{p['avg_price']})" for p in top_prices[:3])
    low_str = ", ".join(f"{p['state']} (₹{p['avg_price']})" for p in lowest_prices[:3])

    prompt = f"""You are an expert Indian agricultural market analyst. Give a practical, concise selling advisory for a farmer.

Commodity: {commodity} ({commodity_hindi})
Season: {season}
National Average Price: ₹{national_avg}/quintal
{msp_line}
Price Trend: {trend}
Best Selling States: {top_str}
Cheapest States (avoid selling here): {low_str}

Write 2-3 sentences of actionable advice covering:
1. Whether to sell now or wait based on trend and current vs MSP
2. Which states offer the best price differential and why transport may/may not be worth it
3. Any seasonal price pattern the farmer should know

Be direct and practical. Use ₹ symbol. Keep it under 80 words."""

    result = await ask_gemini(prompt)
    if result:
        return result

    # Fallback static advisory
    if trend == "up":
        return "📈 Prices are rising. Hold stock 1-2 weeks for better returns if storage is available."
    elif trend == "down":
        return "📉 Prices declining. Consider selling soon to minimize losses."
    elif trend == "volatile":
        return "📊 Prices are fluctuating. Monitor daily and sell during price spikes."
    return "➡️ Prices are stable. Sell based on your cash flow needs."


async def get_weather_suggestions(
    location: str,
    crop: Optional[str],
    temperature: float,
    humidity: float,
    rainfall_24h: float,
    forecast_summary: str,
    risk_alerts: list,  # list of dicts with risk_type, severity, title
    irrigation_recommendation: str,
    harvest_recommendation: str,
    risk_score: int,
) -> str:
    """
    Generate intelligent farming suggestions based on weather data using Gemini Flash.
    Returns an empty string on failure.
    """
    crop_line = f"Crop being grown: {crop}." if crop else "No specific crop mentioned."
    alerts_str = "; ".join(
        f"{a['title']} ({a['severity']})"
        for a in risk_alerts[:4]
    ) if risk_alerts else "No major alerts."

    prompt = f"""You are AgriSahayak, an expert Indian farming advisor. Based on the weather data below, give a farmer 3-4 specific, actionable farming suggestions for today and the next 3 days.

Location: {location}
{crop_line}
Current Temperature: {temperature}°C | Humidity: {humidity}% | Rainfall last 24h: {rainfall_24h}mm
7-Day Forecast Summary: {forecast_summary}
Active Risk Alerts: {alerts_str}
Irrigation Advisory: {irrigation_recommendation}
Harvest Advisory: {harvest_recommendation}
Overall Risk Score: {risk_score}/100

Instructions:
- Give exactly 3-4 bullet points in English
- Each point must mention a specific action (spray, irrigate, harvest, apply fertilizer, etc.)
- Mention timing (morning/evening/today/next 3 days) where relevant
- Keep each bullet under 20 words
- Use Indian farming context (mandi, kharif, rabi, acres)"""

    result = await ask_gemini(prompt, max_tokens=1024)
    return result
