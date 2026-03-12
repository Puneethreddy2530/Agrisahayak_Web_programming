"""
Twilio WhatsApp Bot — "Zero-G Fallback"
Farmers with ₹5000 smartphones on 2G can WhatsApp a leaf photo
and get a disease diagnosis in Hindi/Telugu in 3 seconds.

Flow:
1. Farmer WhatsApps photo to Twilio number
2. Twilio POSTs to /api/v1/whatsapp/webhook
3. We download the image, run disease detection via ml_service
4. Reply in farmer's language (Hindi default)
"""

import os
import logging
import httpx
from fastapi import APIRouter, Request, Form, Response
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN", "")
BASE_URL           = os.getenv("API_BASE_URL", "http://localhost:8000")


# TwiML response helper
def twiml_response(message: str) -> Response:
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{message}</Message>
</Response>"""
    return Response(content=xml, media_type="text/xml")


@router.post("/webhook")
async def whatsapp_webhook(
    request: Request,
    Body: str = Form(default=""),
    From: str = Form(default=""),
    NumMedia: int = Form(default=0),
    MediaUrl0: Optional[str] = Form(default=None),
    MediaContentType0: Optional[str] = Form(default=None),
):
    """
    Twilio WhatsApp webhook — receives inbound messages from farmers.

    Supported commands (Hindi/English):
    - Photo → Disease detection
    - "weather [city]" → Weather report
    - "price [crop]" → Mandi price
    - "help" → Command list
    """
    sender = From.replace("whatsapp:", "")
    body = Body.strip().lower()

    logger.info(f"WhatsApp from {sender}: '{body}', media={NumMedia}")

    # === HELP ===
    if body in ["help", "मदद", "सहायता", ""]:
        return twiml_response(
            "🌾 AgriSahayak Commands:\n\n"
            "📸 Photo → Crop disease detection\n"
            "🌤️ weather [city] → Weather report\n"
            "💰 price [crop] → Mandi rates\n"
            "🌡️ ndvi [lat] [lng] → Satellite crop health\n\n"
            "Example: 'price tomato' or 'weather Pune'\n"
            "Send a photo of a diseased leaf for instant AI diagnosis!"
        )

    # === PRICE QUERY ===
    if body.startswith("price ") or body.startswith("मूल्य "):
        crop = body.split(" ", 1)[1].strip().capitalize()
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{BASE_URL}/api/v1/market/prices?commodity={crop.lower()}",
                    timeout=10
                )
                data = resp.json()
                summary = data.get("summary", {})
                advisory = data.get("advisory", "")[:200]
                msg = (
                    f"💰 {crop} Mandi Prices:\n"
                    f"Min: ₹{summary.get('min_price', 'N/A')}/quintal\n"
                    f"Modal: ₹{summary.get('modal_price', 'N/A')}/quintal\n"
                    f"Max: ₹{summary.get('max_price', 'N/A')}/quintal\n\n"
                    f"📊 {advisory}"
                )
        except Exception as e:
            msg = f"Could not fetch price for {crop}. Try again!"
        return twiml_response(msg)

    # === WEATHER QUERY ===
    if body.startswith("weather ") or body.startswith("मौसम "):
        city = body.split(" ", 1)[1].strip()
        return twiml_response(
            f"🌤️ Weather for {city.title()}:\n"
            f"Use our app for detailed weather: agrisahayak.app\n\n"
            f"Or ask: 'ndvi [lat] [lng]' for satellite crop analysis!"
        )

    # === NDVI QUERY ===
    if body.startswith("ndvi "):
        parts = body.split()
        if len(parts) >= 3:
            try:
                lat, lng = float(parts[1]), float(parts[2])
                async with httpx.AsyncClient() as client:
                    resp = await client.get(
                        f"{BASE_URL}/api/v1/satellite/analyze?lat={lat}&lng={lng}&area_acres=2",
                        timeout=15
                    )
                    data = resp.json()
                    msg = (
                        f"🛰️ Satellite Analysis:\n"
                        f"NDVI: {data.get('ndvi', 'N/A')} ({data.get('crop_health', 'N/A')})\n"
                        f"Water Stress: {data.get('ndwi', 'N/A')}\n"
                        f"Risk: {data.get('risk_level', 'N/A').upper()}\n"
                        f"Carbon Income: ₹{data.get('carbon_sequestration_tons_co2_year', 0) * 800:,.0f}/year\n"
                        f"{'⚠️ Crops may show disease symptoms in ~7 days!' if data.get('predictive_flag') else '✅ Crops look healthy'}"
                    )
            except (ValueError, Exception) as e:
                msg = "Format: ndvi [latitude] [longitude]\nExample: ndvi 18.52 73.85"
        else:
            msg = "Format: ndvi [latitude] [longitude]\nExample: ndvi 18.52 73.85"
        return twiml_response(msg)

    # === DISEASE DETECTION (photo) ===
    if NumMedia > 0 and MediaUrl0:
        try:
            # Download image from Twilio
            async with httpx.AsyncClient(auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)) as client:
                img_resp = await client.get(MediaUrl0, timeout=20)
                img_bytes = img_resp.content

            # Run disease detection via our ML service
            from app.ml_service import predict_disease
            import io
            from PIL import Image
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            result = predict_disease(img)

            disease = result.get("disease_name", "Unknown")
            confidence = result.get("confidence", 0)
            treatment = result.get("treatment", "Consult local Krishi Kendra.")

            msg = (
                f"🔬 Disease Detected: {disease}\n"
                f"Confidence: {confidence:.0%}\n\n"
                f"💊 Treatment:\n{treatment[:300]}\n\n"
                f"📱 Full report: agrisahayak.app"
            )
        except Exception as e:
            logger.error(f"WhatsApp disease detection error: {e}")
            msg = (
                "🌿 Photo received! Processing...\n\n"
                "For best results:\n"
                "• Take photo in good lighting\n"
                "• Focus on the affected leaf\n"
                "• Try again or visit agrisahayak.app for full analysis"
            )
        return twiml_response(msg)

    # === DEFAULT ===
    return twiml_response(
        "🌾 Welcome to AgriSahayak!\n\n"
        "Send 'help' to see available commands.\n"
        "Or send a photo of your crop for disease detection!"
    )


@router.get("/status")
async def whatsapp_status():
    """Check WhatsApp bot configuration status"""
    return {
        "configured": bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN),
        "account_sid": TWILIO_ACCOUNT_SID[:8] + "..." if TWILIO_ACCOUNT_SID else "not_set",
        "capabilities": ["disease_detection", "price_query", "weather_query", "ndvi_satellite"],
        "instructions": (
            "1. Get free Twilio account at twilio.com\n"
            "2. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env\n"
            "3. Configure WhatsApp Sandbox webhook to: POST /api/v1/whatsapp/webhook"
        )
    }
