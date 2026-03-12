"""
Farmer Dashboard API
Personalized insights and action items for farmers

Features:
- Crop health scores per crop
- Alerts (weather warnings, disease risks)
- Price tracker for grown crops
- Yield predictions
- Action items ("Spray fungicide today")
- Daily summary

Technology:
- DuckDB for analytics
- Weather API integration
- Market price API
- ML predictions
"""

from fastapi import APIRouter, Query, HTTPException, Depends, Path
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool
import logging
import random
import asyncio

logger = logging.getLogger(__name__)
router = APIRouter()

from app.analytics.duckdb_engine import get_duckdb
from app.db.database import get_db
from app.db import crud
from app.db.models import Farmer
from app.api.v1.endpoints.auth import get_current_user, UserInfo
from app.external.weather_api import get_real_weather_forecast, get_mock_forecast
from app.chatbot.ollama_client import is_ollama_running


# ==================================================
# MODELS
# ==================================================

class CropHealth(BaseModel):
    """Health status of a crop"""
    crop_name: str
    status: str  # healthy, warning, danger
    status_emoji: str
    health_score: int  # 0-100
    disease_risk: Optional[str] = None
    last_check: Optional[str] = None
    recommended_action: Optional[str] = None


class Alert(BaseModel):
    """Dashboard alert"""
    id: str
    type: str  # weather, disease, price, reminder
    severity: str  # info, warning, danger
    title: str
    title_hindi: str
    message: str
    message_hindi: str
    action_url: Optional[str] = None
    created_at: str


class PriceTracker(BaseModel):
    """Price tracking for a commodity"""
    commodity: str
    current_price: float
    change_percent: float
    change_direction: str  # up, down, stable
    market: str
    last_updated: str


class ActionItem(BaseModel):
    """Recommended action for farmer"""
    id: str
    priority: str  # high, medium, low
    action: str
    action_hindi: str
    reason: str
    deadline: Optional[str] = None
    completed: bool = False


class DashboardData(BaseModel):
    """Complete dashboard data"""
    greeting: str
    greeting_hindi: str
    farmer_name: str
    location: str
    date: str
    weather_summary: Dict
    crop_health: List[CropHealth]
    alerts: List[Alert]
    prices: List[PriceTracker]
    action_items: List[ActionItem]
    yield_predictions: List[Dict]
    stats: Dict


# ==================================================
# DEPENDENCIES
# ==================================================

async def get_current_farmer(
    db: Session = Depends(get_db),
    current_user: UserInfo = Depends(get_current_user)
) -> Farmer:
    """Shared dependency to fetch and validate farmer profile once per request"""
    farmer = crud.get_farmer_by_id(db, current_user.farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return farmer


# ==================================================
# HELPER FUNCTIONS
# ==================================================

def get_greeting() -> tuple:
    """Get time-based greeting"""
    hour = datetime.now().hour
    
    if hour < 12:
        return "Good Morning", "सुप्रभात"
    elif hour < 17:
        return "Good Afternoon", "नमस्कार"
    else:
        return "Good Evening", "शुभ संध्या"


async def get_crop_health_from_analytics(farmer_id: str, crops: List[str]) -> List[CropHealth]:
    """Get crop health from disease analytics (Non-blocking)"""
    try:
        now = datetime.now()
        cutoff = now - timedelta(days=30)
        
        health_data = []
        
        # Batch query for all farmer's crops (ONE query instead of N)
        # SQL sorts by last_detected DESC, so first occurrence per crop is the latest
        def fetch_batch_health():
            with get_duckdb_context(read_only=True) as con:
                return con.execute("""
                    SELECT 
                        crop,
                        disease_name,
                        COUNT(*) as cases,
                        MAX(detected_at) as last_detected
                    FROM disease_analytics
                    WHERE farmer_id = ?
                      AND detected_at >= ?
                      AND disease_name != 'healthy'
                    GROUP BY crop, disease_name
                    ORDER BY last_detected DESC
                """, [farmer_id, cutoff]).fetchall()
                
        raw_results = await run_in_threadpool(fetch_batch_health)
        
        # Build results_map preserving the MOST RECENT entry per crop
        results_map = {}
        for row in raw_results:
            crop_key = row[0].lower()
            if crop_key not in results_map:
                results_map[crop_key] = (row[1], row[2], row[3])
        
        for crop in crops:
            crop_key = crop.lower()
            if crop_key in results_map:
                disease, cases, last_detected = results_map[crop_key]
                health_data.append(CropHealth(
                    crop_name=crop.title(),
                    status="warning" if cases < 3 else "danger",
                    status_emoji="🟡" if cases < 3 else "🔴",
                    health_score=max(20, 80 - (cases * 15)),
                    disease_risk=disease,
                    last_check=last_detected.strftime("%Y-%m-%d") if last_detected else None,
                    recommended_action=f"Check for {disease} and apply treatment"
                ))
            else:
                # Healthy
                health_data.append(CropHealth(
                    crop_name=crop.title(),
                    status="healthy",
                    status_emoji="🟢",
                    health_score=95,
                    last_check=now.strftime("%Y-%m-%d"),
                    recommended_action="Maintain current irrigation schedule"
                ))
        
        return health_data
    
    except asyncio.CancelledError:
        raise
    except Exception as e:
        logger.error(f"Crop health error: {e}")
        return []


async def get_alerts_for_farmer(farmer_id: str, district: str) -> List[Alert]:
    """Get alerts for a farmer (Non-blocking)"""
    alerts = []
    now = datetime.now()
    
    try:
        cutoff = now - timedelta(days=7)
        
        # Check for disease outbreaks in area (Non-blocking)
        def fetch_outbreaks():
            with get_duckdb_context(read_only=True) as con:
                return con.execute("""
                    SELECT disease_name, COUNT(*) as cases
                    FROM disease_analytics
                    WHERE district = ?
                      AND detected_at >= ?
                      AND disease_name != 'healthy'
                    GROUP BY disease_name
                    HAVING COUNT(*) >= 3
                    ORDER BY cases DESC
                    LIMIT 3
                """, [district, cutoff]).fetchall()

        result = await run_in_threadpool(fetch_outbreaks)
        
        for row in result:
            alerts.append(Alert(
                id=f"disease_{row[0]}_{now.timestamp()}",
                type="disease",
                severity="warning",
                title=f"{row[0]} outbreak in area",
                title_hindi=f"क्षेत्र में {row[0]} का प्रकोप",
                message=f"{row[1]} cases detected in {district}. Take preventive measures.",
                message_hindi=f"{district} में {row[1]} मामले पाए गए। सावधानी बरतें।",
                action_url="/disease-detection",
                created_at=now.isoformat()
            ))
    
    except Exception as e:
        logger.warning(f"Alert check error: {e}")
    
    # Add weather alert (only if forecast is healthy/available)
    try:
        forecast = get_mock_forecast(district)
        if forecast and forecast.get("rain_probability", 0) > 50:
            alerts.append(Alert(
                id=f"weather_{now.timestamp()}",
                type="weather",
                severity="warning",
                title="Heavy rain forecast",
                title_hindi="भारी बारिश का अनुमान",
                message="Consider delaying irrigation or pesticide application.",
                message_hindi="सिंचाई या कीटनाशक छिड़काव टालने पर विचार करें।",
                action_url="/weather",
                created_at=now.isoformat()
            ))
    except Exception as e:
        logger.debug(f"Weather alert skip: {e}")
    
    return alerts


def get_price_tracker(crops: List[str]) -> List[PriceTracker]:
    """Get current prices for farmer's crops"""
    prices = []
    
    # Mock price data (in production, fetch from market API)
    price_data = {
        "tomato": {"price": 2200, "change": -2.1, "market": "Pune"},
        "potato": {"price": 1500, "change": 1.5, "market": "Nashik"},
        "onion": {"price": 1850, "change": 5.2, "market": "Lasalgaon"},
        "wheat": {"price": 2400, "change": 0.5, "market": "Delhi"},
        "rice": {"price": 3200, "change": -0.8, "market": "Karnal"},
        "cotton": {"price": 6500, "change": 3.2, "market": "Rajkot"},
        "sugarcane": {"price": 310, "change": 0.0, "market": "Kolhapur"}
    }
    
    for crop in crops:
        crop_lower = crop.lower()
        if crop_lower in price_data:
            data = price_data[crop_lower]
            prices.append(PriceTracker(
                commodity=crop.title(),
                current_price=data["price"],
                change_percent=data["change"],
                change_direction="up" if data["change"] > 0 else ("down" if data["change"] < 0 else "stable"),
                market=data["market"],
                last_updated=datetime.now().strftime("%Y-%m-%d %H:%M")
            ))
    
    return prices


def get_action_items(crop_health: List[CropHealth], alerts: List[Alert]) -> List[ActionItem]:
    """Generate action items based on crop health and alerts"""
    actions = []
    now = datetime.now()
    
    # Check crop health
    for crop in crop_health:
        if crop.status == "danger":
            actions.append(ActionItem(
                id=f"action_disease_{crop.crop_name}",
                priority="high",
                action=f"Apply fungicide to {crop.crop_name} immediately",
                action_hindi=f"{crop.crop_name} पर तुरंत फफूंदनाशी लगाएं",
                reason=f"{crop.disease_risk} detected - risk of spread",
                deadline=(now + timedelta(days=1)).strftime("%Y-%m-%d"),
                completed=False
            ))
        elif crop.status == "warning":
            actions.append(ActionItem(
                id=f"action_monitor_{crop.crop_name}",
                priority="medium",
                action=f"Inspect {crop.crop_name} for disease symptoms",
                action_hindi=f"{crop.crop_name} में रोग के लक्षण जांचें",
                reason=f"{crop.disease_risk} risk in area",
                deadline=(now + timedelta(days=3)).strftime("%Y-%m-%d"),
                completed=False
            ))
    
    # Add routine actions
    actions.append(ActionItem(
        id="action_water",
        priority="medium",
        action="Check soil moisture and irrigate if needed",
        action_hindi="मिट्टी की नमी जांचें और आवश्यकतानुसार सिंचाई करें",
        reason="Optimal moisture ensures healthy growth",
        deadline=now.strftime("%Y-%m-%d"),
        completed=False
    ))
    
    return actions


def get_yield_predictions(farmer_id: str, crops: List[str]) -> List[Dict]:
    """Get yield predictions for farmer's crops"""
    predictions = []
    
    for crop in crops:
        # Mock prediction (in production, use ML model)
        base_yield = {"tomato": 25, "potato": 20, "onion": 18, "wheat": 40, "rice": 35}.get(crop.lower(), 15)
        
        predictions.append({
            "crop": crop.title(),
            "predicted_yield_kg_per_acre": base_yield * 100,
            "confidence": round(random.uniform(0.75, 0.95), 2),
            "comparison_to_avg": f"+{random.randint(5, 15)}%",
            "factors": ["Good rainfall", "Healthy soil"],
            "harvest_window": (datetime.now() + timedelta(days=random.randint(30, 60))).strftime("%Y-%m-%d")
        })
    
    return predictions


# ==================================================
# ENDPOINTS
# ==================================================

@router.get("/health")
async def dashboard_health(current_user: UserInfo = Depends(get_current_user)):
    """Check dashboard service health (Authenticated)"""
    return {
        "service": "farmer-dashboard",
        "status": "healthy",
        "features": [
            "Personalized greeting",
            "Crop health monitoring",
            "Alerts & warnings",
            "Price tracking",
            "Action items",
            "Yield predictions"
        ],
        "ollama_available": await is_ollama_running()
    }


@router.get("/", response_model=DashboardData)
async def get_farmer_dashboard(
    farmer: Farmer = Depends(get_current_farmer)
):
    """
    Get personalized farmer dashboard
    
    Returns complete dashboard data including:
    - Greeting
    - Crop health scores
    - Alerts
    - Price tracker
    - Action items
    - Yield predictions
    """
    farmer_id = farmer.farmer_id
    farmer_name = farmer.name
    district = farmer.district
    state = farmer.state
    
    # Parse crops from DB profile (fallback to default string)
    crops_str = getattr(farmer, 'crops', "Tomato,Potato,Onion") or "Tomato,Potato,Onion"
    crop_list = [c.strip() for c in crops_str.split(",") if c.strip()]
    
    # Get greeting
    greeting_en, greeting_hi = get_greeting()
    
    # Get weather summary (mock for now)
    weather_summary = {
        "temperature": 28,
        "humidity": 65,
        "condition": "Partly Cloudy",
        "condition_hindi": "आंशिक बादल",
        "rain_probability": 30,
        "farming_suitable": True,
        "advisory": "Good day for field work",
        "advisory_hindi": "खेत में काम के लिए अच्छा दिन"
    }
    
    # Get crop health (Async helper)
    crop_health = await get_crop_health_from_analytics(farmer_id, crop_list)
    
    # If no data, generate defaults
    if not crop_health:
        crop_health = [
            CropHealth(crop_name=c.title(), status="healthy", status_emoji="🟢", health_score=90)
            for c in crop_list
        ]
    
    # Get alerts (Async helper)
    alerts = await get_alerts_for_farmer(farmer_id, district)
    
    # Get prices
    prices = get_price_tracker(crop_list)
    
    # Get action items
    action_items = get_action_items(crop_health, alerts)
    
    # Get yield predictions
    yield_predictions = get_yield_predictions(farmer_id, crop_list)
    
    # Calculate stats
    healthy_crops = sum(1 for c in crop_health if c.status == "healthy")
    
    return DashboardData(
        greeting=f"{greeting_en}, {farmer_name}!",
        greeting_hindi=f"{greeting_hi}, {farmer_name}!",
        farmer_name=farmer_name,
        location=f"{district}, {state}",
        date=datetime.now().strftime("%A, %d %B %Y"),
        weather_summary=weather_summary,
        crop_health=crop_health,
        alerts=alerts,
        prices=prices,
        action_items=action_items,
        yield_predictions=yield_predictions,
        stats={
            "total_crops": len(crop_list),
            "healthy_crops": healthy_crops,
            "at_risk_crops": len(crop_list) - healthy_crops,
            "active_alerts": len(alerts),
            "pending_actions": sum(1 for a in action_items if not a.completed),
            "avg_health_score": sum(c.health_score for c in crop_health) / len(crop_health) if crop_health else 0
        }
    )


@router.get("/quick")
async def get_quick_dashboard(
    farmer: Farmer = Depends(get_current_farmer)
):
    """
    Get quick dashboard summary (lightweight)
    
    For mobile/low-bandwidth
    """
    district = farmer.district
    greeting_en, greeting_hi = get_greeting()
    
    # Quick stats only
    try:
        cutoff = datetime.now() - timedelta(days=7)
        
        # Count recent disease cases in area (Non-blocking)
        def count_diseases():
            with get_duckdb_context(read_only=True) as con:
                return con.execute("""
                    SELECT COUNT(*) FROM disease_analytics
                    WHERE district = ? AND detected_at >= ? AND disease_name != 'healthy'
                """, [district, cutoff]).fetchone()
                
        result = await run_in_threadpool(count_diseases)
        
        disease_risk_level = "low"
        if result and result[0] > 10:
            disease_risk_level = "high"
        elif result and result[0] > 3:
            disease_risk_level = "medium"
    except:
        disease_risk_level = "unknown"
    
    return {
        "greeting": greeting_en,
        "greeting_hindi": greeting_hi,
        "date": datetime.now().strftime("%d %b %Y"),
        "disease_risk_level": disease_risk_level,
        "weather": "Partly Cloudy, 28°C",
        "top_alert": "Light rain expected today",
        "top_action": "Check crop health",
        "market_trend": "Prices stable"
    }


@router.get("/crop-health/{crop}")
async def get_single_crop_health(
    crop: str = Path(..., max_length=50, description="Crop name"),
    days: int = Query(30, ge=1, le=365),
    farmer: Farmer = Depends(get_current_farmer)
):
    """Get detailed health for a single crop"""
    farmer_id = farmer.farmer_id
    
    try:
        cutoff = datetime.now() - timedelta(days=days)
        
        def fetch_detailed_health():
            with get_duckdb_context(read_only=True) as con:
                return con.execute("""
                    SELECT 
                        disease_name,
                        COUNT(*) as cases,
                        AVG(confidence) as avg_confidence,
                        MAX(detected_at) as last_detected
                    FROM disease_analytics
                    WHERE farmer_id = ?
                      AND crop = ?
                      AND detected_at >= ?
                    GROUP BY disease_name
                    ORDER BY last_detected DESC
                """, [farmer_id, crop, cutoff]).fetchall()
                
        result = await run_in_threadpool(fetch_detailed_health)
        
        diseases = []
        for row in result:
            diseases.append({
                "disease": row[0],
                "cases": row[1],
                "confidence": round(row[2] or 0, 3),
                "last_seen": row[3].isoformat() if row[3] else None
            })
        
        # Calculate health score
        healthy_count = sum(1 for d in diseases if d["disease"] == "healthy")
        disease_count = sum(d["cases"] for d in diseases if d["disease"] != "healthy")
        
        if disease_count == 0:
            health_score = 100
            status = "healthy"
        elif disease_count < 3:
            health_score = 70
            status = "warning"
        else:
            health_score = 40
            status = "danger"
        
        return {
            "crop": crop.title(),
            "health_score": health_score,
            "status": status,
            "detections": diseases,
            "period_days": days,
            "recommendations": [
                "Regular monitoring recommended",
                "Keep area clean and well-drained"
            ] if status == "healthy" else [
                "Apply appropriate treatment",
                "Remove infected plants",
                "Consult local agricultural officer"
            ]
        }
    
    except Exception as e:
        logger.error(f"Crop health error: {e}")
        raise HTTPException(500, str(e))


@router.post("/action-complete/{action_id}")
async def mark_action_complete(
    action_id: str = Path(..., max_length=100),
    current_user: UserInfo = Depends(get_current_user)
):
    """Mark an action item as completed"""
    # In production, save to database
    return {
        "success": True,
        "action_id": action_id,
        "completed_at": datetime.now().isoformat(),
        "message": "Action marked as complete"
    }


@router.get("/insights")
async def get_dashboard_insights(
    farmer: Farmer = Depends(get_current_farmer)
):
    """
    Get AI-powered insights summary
    
    Uses analytics data to generate insights
    """
    farmer_id = farmer.farmer_id
    district = farmer.district
    
    insights = []
    now = datetime.now()

    try:
        # Log analytics to DuckDB (Non-blocking)
        def log_dashboard_view():
            with get_duckdb_context() as con:
                con.execute("""
                    INSERT INTO dashboard_analytics (farmer_id, district, viewed_at)
                    VALUES (?, ?, ?)
                """, [farmer_id, district, now])
                
        await run_in_threadpool(log_dashboard_view)

        cutoff = now - timedelta(days=30)
        
        # Top disease in area (Non-blocking)
        def fetch_top_disease():
            with get_duckdb_context(read_only=True) as con:
                return con.execute("""
                    SELECT disease_name, COUNT(*) as cases
                    FROM disease_analytics
                    WHERE district = ? AND detected_at >= ? AND disease_name != 'healthy'
                    GROUP BY disease_name
                    ORDER BY cases DESC
                    LIMIT 1
                """, [district, cutoff]).fetchone()
                
        result = await run_in_threadpool(fetch_top_disease)
        
        if result:
            insights.append({
                "type": "disease_trend",
                "title": f"{result[0]} is most common disease in your area",
                "title_hindi": f"{result[0]} आपके क्षेत्र में सबसे आम रोग है",
                "detail": f"{result[1]} cases detected in last 30 days",
                "icon": "🔬"
            })
        
        # Price trend insight
        insights.append({
            "type": "price_insight",
            "title": "Onion prices expected to rise",
            "title_hindi": "प्याज की कीमतों में बढ़ोतरी की उम्मीद",
            "detail": "Based on supply-demand analysis",
            "icon": "📈"
        })
        
        # Weather insight
        insights.append({
            "type": "weather_insight",
            "title": "Good conditions for sowing next week",
            "title_hindi": "अगले सप्ताह बुवाई के लिए अच्छी स्थिति",
            "detail": "Moderate temperatures and adequate moisture expected",
            "icon": "🌤️"
        })
    
    except Exception as e:
        logger.warning(f"Insights error: {e}")
    
    return {
        "farmer_id": farmer_id,
        "district": district,
        "generated_at": datetime.now().isoformat(),
        "insights": insights
    }


@router.get("/notifications")
async def get_farmer_notifications(
    limit: int = Query(10, le=50),
    current_user: UserInfo = Depends(get_current_user)
):
    """Get recent notifications for farmer"""
    # Mock notifications
    notifications = [
        {
            "id": "1",
            "type": "disease_alert",
            "title": "Late Blight Alert",
            "message": "High risk of Late Blight in your area. Take preventive measures.",
            "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
            "read": False
        },
        {
            "id": "2",
            "type": "price_update",
            "title": "Price Update",
            "message": "Tomato prices increased by 5% in Pune market",
            "created_at": (datetime.now() - timedelta(hours=6)).isoformat(),
            "read": True
        },
        {
            "id": "3",
            "type": "weather",
            "title": "Rain Forecast",
            "message": "Light rain expected tomorrow. Plan accordingly.",
            "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
            "read": True
        }
    ]
    
    return {
        "farmer_id": current_user.farmer_id,
        "total": len(notifications),
        "unread": sum(1 for n in notifications if not n["read"]),
        "notifications": notifications[:limit]
    }
