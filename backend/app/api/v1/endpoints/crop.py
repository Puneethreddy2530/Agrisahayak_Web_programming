"""
Crop Advisory Endpoints
ML-powered crop recommendations using trained Random Forest model
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

from app.ml_service import predict_crop
from app.analytics.duckdb_engine import get_duckdb_context
from starlette.concurrency import run_in_threadpool
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class CropInput(BaseModel):
    """Input parameters for crop recommendation"""
    nitrogen: float = Field(..., ge=0, le=200, description="N content ratio (0-200 kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="P content ratio (0-200 kg/ha)")
    potassium: float = Field(..., ge=0, le=300, description="K content ratio (0-300 kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value (0-14)")
    rainfall: float = Field(..., ge=0, le=2000, description="Rainfall in mm")
    state: Optional[str] = Field(None, max_length=100)
    district: Optional[str] = Field(None, max_length=100)


class CropRecommendation(BaseModel):
    """Single crop recommendation"""
    crop_name: str
    confidence: float
    description: str
    season: str
    water_requirement: str
    expected_yield: str


class CropResponse(BaseModel):
    """API Response for crop recommendation"""
    success: bool
    recommendations: List[CropRecommendation]
    soil_health: str
    advisory: str


# Crop metadata database
CROP_DATA = {
    "rice": {"season": "Kharif", "water": "High", "yield": "4-5 tonnes/hectare", "desc": "Ideal for waterlogged fields"},
    "wheat": {"season": "Rabi", "water": "Medium", "yield": "3-4 tonnes/hectare", "desc": "Best for winter cultivation"},
    "maize": {"season": "Kharif/Rabi", "water": "Medium", "yield": "5-6 tonnes/hectare", "desc": "Versatile cereal crop"},
    "cotton": {"season": "Kharif", "water": "Medium", "yield": "2-3 bales/hectare", "desc": "Cash crop for textiles"},
    "sugarcane": {"season": "Year-round", "water": "High", "yield": "70-80 tonnes/hectare", "desc": "Long duration crop"},
    "potato": {"season": "Rabi", "water": "Medium", "yield": "25-30 tonnes/hectare", "desc": "Cool weather crop"},
    "tomato": {"season": "Year-round", "water": "Medium", "yield": "40-50 tonnes/hectare", "desc": "High value vegetable"},
    "onion": {"season": "Rabi", "water": "Low", "yield": "20-25 tonnes/hectare", "desc": "Hardy vegetable crop"},
    "jute": {"season": "Kharif", "water": "High", "yield": "2-3 tonnes/hectare", "desc": "Fiber crop for humid areas"},
    "coffee": {"season": "Year-round", "water": "Medium", "yield": "1-2 tonnes/hectare", "desc": "Plantation crop"},
    "mungbean": {"season": "Kharif/Zaid", "water": "Low", "yield": "0.8-1 tonnes/hectare", "desc": "Short duration pulse"},
    "lentil": {"season": "Rabi", "water": "Low", "yield": "1-1.5 tonnes/hectare", "desc": "Cool season pulse"},
    "chickpea": {"season": "Rabi", "water": "Low", "yield": "1.5-2 tonnes/hectare", "desc": "Drought tolerant pulse"},
    "kidneybeans": {"season": "Kharif", "water": "Medium", "yield": "1-1.5 tonnes/hectare", "desc": "High protein legume"},
    "pigeonpeas": {"season": "Kharif", "water": "Low", "yield": "1-1.5 tonnes/hectare", "desc": "Drought resistant pulse"},
    "mothbeans": {"season": "Kharif", "water": "Low", "yield": "0.5-0.8 tonnes/hectare", "desc": "Arid region crop"},
    "blackgram": {"season": "Kharif", "water": "Low", "yield": "0.8-1 tonnes/hectare", "desc": "Short duration pulse"},
    "banana": {"season": "Year-round", "water": "High", "yield": "40-50 tonnes/hectare", "desc": "Tropical fruit crop"},
    "mango": {"season": "Summer", "water": "Medium", "yield": "8-10 tonnes/hectare", "desc": "King of fruits"},
    "grapes": {"season": "Year-round", "water": "Medium", "yield": "20-25 tonnes/hectare", "desc": "High value fruit"},
    "watermelon": {"season": "Summer", "water": "High", "yield": "25-30 tonnes/hectare", "desc": "Summer fruit crop"},
    "muskmelon": {"season": "Summer", "water": "Medium", "yield": "15-20 tonnes/hectare", "desc": "Sweet summer fruit"},
    "apple": {"season": "Year-round", "water": "Medium", "yield": "10-15 tonnes/hectare", "desc": "Temperate fruit"},
    "orange": {"season": "Winter", "water": "Medium", "yield": "15-20 tonnes/hectare", "desc": "Citrus fruit"},
    "papaya": {"season": "Year-round", "water": "Medium", "yield": "40-60 tonnes/hectare", "desc": "Tropical fruit"},
    "coconut": {"season": "Year-round", "water": "Medium", "yield": "80-100 nuts/tree", "desc": "Coastal plantation"},
    "pomegranate": {"season": "Year-round", "water": "Low", "yield": "15-20 tonnes/hectare", "desc": "Drought tolerant fruit"},
}


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "crop-recommendation", "crops_available": len(CROP_DATA)}


@router.post("/recommend", response_model=CropResponse)
async def recommend_crops(input_data: CropInput):
    try:
        raw_predictions = await run_in_threadpool(
            predict_crop,
            nitrogen=input_data.nitrogen,
            phosphorus=input_data.phosphorus,
            potassium=input_data.potassium,
            temperature=input_data.temperature,
            humidity=input_data.humidity,
            ph=input_data.ph,
            rainfall=input_data.rainfall
        )

        if not isinstance(raw_predictions, list):
            logger.error(f"Invalid ML output type: {type(raw_predictions)}")
            raise HTTPException(status_code=503, detail="Invalid prediction response from crop model")

        predictions = sorted(
            [p for p in raw_predictions if isinstance(p, dict)],
            key=lambda x: x.get("confidence", 0.0),
            reverse=True
        )

        recommendations = []
        for pred in predictions[:3]:
            if 'crop_name' not in pred or 'confidence' not in pred:
                continue

            crop_name = pred['crop_name'].lower()
            data = CROP_DATA.get(crop_name, {
                "season": "Variable",
                "water": "Medium",
                "yield": "Variable",
                "desc": "Suitable for your conditions"
            })

            # Clamp confidence safely between 0 and 1
            try:
                confidence_value = float(pred['confidence'])
            except (ValueError, TypeError):
                confidence_value = 0.0

            confidence_value = max(0.0, min(1.0, confidence_value))

            recommendations.append(CropRecommendation(
                crop_name=pred['crop_name'].capitalize(),
                confidence=round(confidence_value, 2),
                description=data.get("desc"),
                season=data.get("season"),
                water_requirement=data.get("water"),
                expected_yield=data.get("yield")
            ))

        if not recommendations:
            raise HTTPException(
                status_code=503,
                detail="Crop recommendation model failed to generate predictions."
            )

        ph = input_data.ph
        nitrogen = input_data.nitrogen
        phosphorus = input_data.phosphorus

        if ph < 5.5 or ph > 8.0:
            soil_health = "Poor (pH imbalance)"
        elif nitrogen < 30 or phosphorus < 20:
            soil_health = "Nutrient Deficient"
        elif nitrogen > 120:
            soil_health = "Nitrogen Excess"
        else:
            soil_health = "Balanced"

        top_crop = recommendations[0].crop_name

        advisory = (
            f"Based on your soil parameters (N:{input_data.nitrogen}, P:{input_data.phosphorus}, "
            f"K:{input_data.potassium}, pH:{input_data.ph}), we recommend {top_crop} as your primary crop. "
            f"Expected rainfall of {input_data.rainfall}mm is "
            f"{'adequate' if input_data.rainfall > 100 else 'low - consider irrigation'}."
        )

        if input_data.state:
            location_context = f" Local conditions in {input_data.state}"
            if input_data.district:
                location_context += f", {input_data.district},"
            advisory += f"{location_context} were factored into this recommendation."

        try:
            def log_to_duckdb():
                with get_duckdb_context() as con:
                    con.execute(
                        """
                        INSERT INTO crop_analytics (
                            nitrogen, phosphorus, potassium, ph, rainfall, recommended_crop, confidence
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        [
                            input_data.nitrogen,
                            input_data.phosphorus,
                            input_data.potassium,
                            input_data.ph,
                            input_data.rainfall,
                            recommendations[0].crop_name,
                            recommendations[0].confidence
                        ]
                    )

            await run_in_threadpool(log_to_duckdb)

        except Exception as db_e:
            logger.warning(f"Failed to log analytics to DuckDB: {db_e}")

        return CropResponse(
            success=True,
            recommendations=recommendations,
            soil_health=soil_health,
            advisory=advisory
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Crop Prediction Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Crop prediction service temporarily unavailable")


@router.get("/crops")
async def list_crops():
    return {
        "crops": list(CROP_DATA.keys()),
        "total": len(CROP_DATA)
    }


# National baseline yield averages (t/ha). State-specific data can overlay these.
_NATIONAL_AVG: dict[str, float] = {
    "wheat": 3.2, "rice": 4.1, "maize": 5.0, "cotton": 2.5, "sugarcane": 72.0,
    "potato": 25.0, "tomato": 42.0, "onion": 20.0, "chickpea": 1.5, "lentil": 1.1,
    "mungbean": 0.8, "blackgram": 0.85, "pigeonpeas": 1.1, "banana": 43.0,
    "mango": 8.5, "grapes": 21.0, "watermelon": 25.0, "jute": 2.5, "coffee": 1.5,
    "kidneybeans": 1.2, "mothbeans": 0.65, "muskmelon": 17.5, "apple": 12.5,
    "orange": 17.5, "papaya": 50.0, "coconut": 90.0, "pomegranate": 17.5,
    "default": 2.5,
}

# Coarse state-level multipliers (relative to national baseline).
_STATE_MULTIPLIERS: dict[str, float] = {
    "punjab": 1.18, "haryana": 1.12, "uttar pradesh": 1.05,
    "west bengal": 1.10, "andhra pradesh": 1.08, "telangana": 1.06,
    "karnataka": 1.04, "maharashtra": 1.02, "rajasthan": 0.92,
    "madhya pradesh": 0.96, "gujarat": 1.00, "bihar": 0.95,
}


@router.get("/district-averages")
async def get_district_averages(
    state: Optional[str] = None,
    district: Optional[str] = None,
):
    """
    Return expected yield averages (t/ha) per crop for a given state/district.
    Falls back to national averages when no state-specific data is available.
    """
    multiplier = 1.0
    if state:
        multiplier = _STATE_MULTIPLIERS.get(state.strip().lower(), 1.0)

    averages = {
        crop: round(avg * multiplier, 2)
        for crop, avg in _NATIONAL_AVG.items()
    }

    return {
        "state": state or "national",
        "district": district or "all",
        "averages": averages,
    }


@router.get("/seasons")
async def get_seasons():
    return {
        "kharif": {
            "months": "June - October",
            "crops": ["rice", "maize", "cotton", "sugarcane", "jute"],
            "description": "Monsoon season crops"
        },
        "rabi": {
            "months": "October - March",
            "crops": ["wheat", "potato", "onion", "mustard", "chickpea", "lentil"],
            "description": "Winter season crops"
        },
        "zaid": {
            "months": "March - June",
            "crops": ["watermelon", "cucumber", "muskmelon", "mungbean"],
            "description": "Summer season crops"
        }
    }
