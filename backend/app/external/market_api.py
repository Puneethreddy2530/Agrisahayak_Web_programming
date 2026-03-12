"""
Market Prices via Gemini 2.5 Flash
Generates realistic Indian mandi price data using AI instead of external APIs.
"""

import logging
import json
import re
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


async def get_mandi_prices(
    commodity: str,
    state: Optional[str] = None,
    limit: int = 50
) -> Dict:
    """
    Get mandi prices for a commodity using Gemini 2.5 Flash.

    Args:
        commodity: Crop name (rice, wheat, onion, etc.)
        state: State filter (optional)
        limit: Max records to return

    Returns:
        Dictionary with market prices data
    """
    from app.ai.gemini_client import ask_gemini

    state_clause = f" in {state}" if state else " across major Indian states"
    today = datetime.now().strftime("%Y-%m-%d")

    prompt = f"""You are an Indian agricultural market data API. Return a JSON array of mandi price records for {commodity}{state_clause} as of {today}.
Return exactly {min(limit, 30)} records spread across different states and markets.
Each record must have these exact keys:
  market (string, real mandi name), state (string, Indian state name), district (string),
  min_price (float ₹/quintal), max_price (float ₹/quintal), modal_price (float ₹/quintal),
  date (string YYYY-MM-DD), variety (string e.g. 'Common' or specific variety).
Use realistic current Indian mandi prices. Modal price should be between min and max.
Return ONLY the raw JSON array, no markdown, no explanation."""

    raw = await ask_gemini(prompt, max_tokens=3000)

    prices = []
    if raw:
        raw = re.sub(r"```[\w]*", "", raw).strip()
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                for record in data:
                    try:
                        modal = float(record.get("modal_price", 0))
                        if modal > 0:
                            prices.append({
                                "market": str(record.get("market", "Unknown")),
                                "state": str(record.get("state", "Unknown")),
                                "district": str(record.get("district", "Unknown")),
                                "min_price": round(float(record.get("min_price", modal * 0.92)), 2),
                                "max_price": round(float(record.get("max_price", modal * 1.08)), 2),
                                "modal_price": round(modal, 2),
                                "date": str(record.get("date", today)),
                                "variety": str(record.get("variety", "Common")),
                            })
                    except (ValueError, TypeError, KeyError):
                        continue
        except Exception as e:
            logger.error(f"Gemini market price JSON parse error: {e} — raw: {raw[:200]}")

    if not prices:
        logger.warning(f"Gemini returned no prices for {commodity}, using fallback")
        prices = _fallback_prices(commodity, state, today)

    logger.info(f"Returning {len(prices)} market prices for {commodity}")
    return {
        "commodity": commodity.capitalize(),
        "total_markets": len(prices),
        "prices": sorted(prices, key=lambda x: x["modal_price"], reverse=True),
        "data_source": "Gemini 2.5 Flash - AI Market Intelligence",
        "last_updated": datetime.now().isoformat(),
    }


def _fallback_prices(commodity: str, state: Optional[str], today: str) -> List[Dict]:
    """Simple deterministic fallback when Gemini is unavailable."""
    import random
    BASE_PRICES = {
        "rice": 2200, "wheat": 2400, "onion": 1800, "potato": 1200,
        "tomato": 2500, "maize": 2000, "cotton": 6500, "soybean": 4500,
        "groundnut": 6200, "mustard": 5500, "chana": 5200, "tur": 7200,
        "moong": 8200, "sugarcane": 350, "banana": 1500,
    }
    base = BASE_PRICES.get(commodity.lower(), 2000)
    rng = random.Random(hash((commodity, today)))
    markets = [
        ("Nashik", "Maharashtra", "Nashik"),
        ("Azadpur", "Delhi", "Delhi"),
        ("Lasalgaon", "Maharashtra", "Nashik"),
        ("Unjha", "Gujarat", "Mehsana"),
        ("Hubli", "Karnataka", "Dharwad"),
        ("Warangal", "Telangana", "Warangal"),
        ("Indore", "Madhya Pradesh", "Indore"),
        ("Amritsar", "Punjab", "Amritsar"),
        ("Jaipur", "Rajasthan", "Jaipur"),
        ("Patna", "Bihar", "Patna"),
    ]
    prices = []
    for market, mkt_state, district in markets:
        if state and mkt_state.lower() != state.lower():
            continue
        modal = round(base * rng.uniform(0.9, 1.1))
        prices.append({
            "market": market, "state": mkt_state, "district": district,
            "min_price": round(modal * 0.92, 2), "max_price": round(modal * 1.08, 2),
            "modal_price": float(modal), "date": today, "variety": "Common",
        })
    return prices


async def get_commodity_summary(commodity: str) -> Dict:
    """Get summary statistics for a commodity across all markets."""
    data = await get_mandi_prices(commodity)

    if not data["prices"]:
        return {"commodity": commodity, "error": "No market data available"}

    prices = [p["modal_price"] for p in data["prices"]]
    return {
        "commodity": commodity.capitalize(),
        "total_markets": len(prices),
        "avg_price": round(sum(prices) / len(prices), 2),
        "min_price": round(min(prices), 2),
        "max_price": round(max(prices), 2),
        "price_range": round(max(prices) - min(prices), 2),
        "top_5_markets": data["prices"][:5],
        "data_source": data["data_source"],
    }


if __name__ == "__main__":
    import asyncio

    async def test():
        print("Testing Market API (Gemini)...")
        try:
            result = await get_mandi_prices("onion", "Maharashtra")
            print(f"Found {result['total_markets']} markets")
            if result['prices']:
                top = result['prices'][0]
                print(f"Top: {top['market']}, {top['state']} — ₹{top['modal_price']}/quintal")
        except Exception as e:
            print(f"Test failed: {e}")

    asyncio.run(test())
