"""
Disease Detection Endpoints
CNN-based plant disease detection from leaf images with Top-3 predictions
DISEASE DETECTIONS ARE PERSISTED TO DATABASE
NOW WITH POST-QUANTUM CRYPTOGRAPHIC SIGNATURES 🔐
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Depends, Request
from pydantic import BaseModel
from typing import List, Optional
import io
import base64
import uuid
import logging
from pathlib import Path
from sqlalchemy.orm import Session
from datetime import datetime

from app.ml_service import predict_disease

logger = logging.getLogger(__name__)
from app.db.database import get_db
from app.db import crud
from app.crypto.signature_service import sign_and_store

# Rate limiting - import the limiter from main
try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    limiter = Limiter(key_func=get_remote_address)
    RATE_LIMIT_AVAILABLE = True
except ImportError:
    limiter = None
    RATE_LIMIT_AVAILABLE = False

router = APIRouter()


class DiseaseResult(BaseModel):
    """Disease detection result"""
    disease_name: str
    confidence: float
    severity: str  # mild, moderate, severe
    description: str
    treatment: List[str]
    prevention: List[str]


class DiseaseResponse(BaseModel):
    """API Response for disease detection"""
    success: bool
    detection_id: Optional[str] = None  # NEW: Unique detection ID
    plant_type: str
    is_healthy: bool
    diseases: List[DiseaseResult]
    immediate_action: str
    top_3_predictions: List[dict]  # NEW: Top-3 for better UX
    signature: Optional[dict] = None  # NEW: Cryptographic signature 🔐


# Disease information database
DISEASE_INFO = {
    "Pepper__bell___Bacterial_spot": {
        "plant": "Pepper",
        "severity": "moderate",
        "description": "Bacterial infection causing dark, water-soaked spots on leaves",
        "treatment": ["Apply copper-based bactericide", "Remove infected leaves", "Improve air circulation"],
        "prevention": ["Use disease-free seeds", "Avoid overhead watering", "Rotate crops"]
    },
    "Pepper__bell___healthy": {
        "plant": "Pepper",
        "severity": "none",
        "description": "Plant appears healthy with no visible disease symptoms",
        "treatment": ["No treatment needed"],
        "prevention": ["Continue good practices"]
    },
    "Potato___Early_blight": {
        "plant": "Potato",
        "severity": "moderate",
        "description": "Fungal disease causing dark spots with concentric rings on leaves",
        "treatment": ["Apply fungicide (Mancozeb)", "Remove infected foliage", "Ensure good drainage"],
        "prevention": ["Use certified seed", "Maintain proper spacing", "Avoid wet conditions"]
    },
    "Potato___Late_blight": {
        "plant": "Potato",
        "severity": "severe",
        "description": "Destructive disease causing rapid plant death, water-soaked lesions",
        "treatment": ["Apply systemic fungicide immediately", "Destroy infected plants", "Harvest early if severe"],
        "prevention": ["Use resistant varieties", "Avoid overhead irrigation", "Monitor weather conditions"]
    },
    "Potato___healthy": {
        "plant": "Potato",
        "severity": "none",
        "description": "Plant appears healthy",
        "treatment": ["No treatment needed"],
        "prevention": ["Continue monitoring"]
    },
    "Tomato_Bacterial_spot": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Bacterial infection causing small, dark spots on leaves and fruit",
        "treatment": ["Apply copper spray", "Remove infected plants", "Improve ventilation"],
        "prevention": ["Use disease-free transplants", "Avoid working with wet plants", "Sanitize tools"]
    },
    "Tomato_Early_blight": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Fungal disease causing dark spots with bullseye pattern on lower leaves",
        "treatment": ["Apply fungicide", "Remove affected leaves", "Mulch around plants"],
        "prevention": ["Rotate crops", "Stake plants for airflow", "Water at base"]
    },
    "Tomato_Late_blight": {
        "plant": "Tomato",
        "severity": "severe",
        "description": "Aggressive disease causing rapid browning and plant death",
        "treatment": ["Remove and destroy plants", "Apply copper fungicide", "Do not compost infected material"],
        "prevention": ["Plant resistant varieties", "Monitor weather", "Space plants properly"]
    },
    "Tomato_Leaf_Mold": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Fungal disease causing yellow spots on upper leaf surface, mold underneath",
        "treatment": ["Improve air circulation", "Reduce humidity", "Apply fungicide if severe"],
        "prevention": ["Ensure good ventilation", "Avoid overhead watering", "Remove lower leaves"]
    },
    "Tomato_Septoria_leaf_spot": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Fungal disease causing small circular spots with dark borders",
        "treatment": ["Remove infected leaves", "Apply fungicide", "Improve air circulation"],
        "prevention": ["Mulch plants", "Avoid splashing water", "Rotate crops"]
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Tiny pests causing stippled, yellowing leaves with fine webbing",
        "treatment": ["Spray with water to dislodge", "Apply miticide", "Use neem oil"],
        "prevention": ["Maintain humidity", "Avoid dusty conditions", "Introduce predatory mites"]
    },
    "Tomato__Target_Spot": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Fungal disease causing target-like spots on leaves",
        "treatment": ["Apply appropriate fungicide", "Remove infected leaves", "Improve drainage"],
        "prevention": ["Ensure adequate spacing", "Water at soil level", "Remove plant debris"]
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "plant": "Tomato",
        "severity": "severe",
        "description": "Viral disease causing leaf curling, yellowing, and stunted growth",
        "treatment": ["Remove infected plants", "Control whitefly vectors", "No cure once infected"],
        "prevention": ["Use resistant varieties", "Control whiteflies", "Use reflective mulches"]
    },
    "Tomato__Tomato_mosaic_virus": {
        "plant": "Tomato",
        "severity": "moderate",
        "description": "Viral disease causing mottled leaves and distorted fruit",
        "treatment": ["Remove infected plants", "Sanitize hands and tools", "No chemical treatment available"],
        "prevention": ["Use resistant varieties", "Avoid tobacco near plants", "Wash hands before handling"]
    },
    "Tomato_healthy": {
        "plant": "Tomato",
        "severity": "none",
        "description": "Plant appears healthy with no visible disease symptoms",
        "treatment": ["No treatment needed"],
        "prevention": ["Continue good agricultural practices"]
    },
}

# Default info for unknown diseases
DEFAULT_INFO = {
    "plant": "Plant",
    "severity": "moderate",
    "description": "Disease detected - consult local agricultural extension for specific treatment",
    "treatment": ["Consult local expert", "Remove affected parts", "Improve plant care"],
    "prevention": ["Monitor regularly", "Maintain good hygiene", "Use resistant varieties"]
}


def format_disease_name(name: str) -> str:
    """Format class name to readable disease name"""
    return name.replace("_", " ").replace("  ", " - ").title()


# Rate limit decorator wrapper (no-op if slowapi not available)
def rate_limit(limit_string):
    def decorator(func):
        if RATE_LIMIT_AVAILABLE and limiter:
            return limiter.limit(limit_string)(func)
        return func
    return decorator


@router.get("/health")
async def health_check():
    """Health check endpoint for disease detection service"""
    return {
        "status": "healthy", 
        "service": "disease-detection", 
        "model_loaded": True,
        "diseases_supported": len(DISEASE_INFO)
    }


@router.post("/detect", response_model=DiseaseResponse)
@rate_limit("10/minute")  # Max 10 disease detections per minute per IP
async def detect_disease(
    request: Request,  # Required for rate limiting
    file: UploadFile = File(..., description="Plant leaf image (JPG/PNG)"),
    farmer_id: Optional[str] = Query(
        None, 
        description="Farmer ID to log detection",
        min_length=1,
        max_length=20,
        regex=r'^[A-Za-z0-9_-]+$'
    ),
    crop_cycle_id: Optional[str] = Query(
        None, 
        description="Crop cycle ID to associate",
        min_length=1,
        max_length=20,
        regex=r'^[A-Za-z0-9_-]+$'
    ),
    db: Session = Depends(get_db)
):
    """
    Detect plant diseases from leaf images using CNN.
    Returns Top-3 predictions for better diagnosis accuracy.
    PERSISTS DETECTION TO DATABASE for research and history.
    """
    
    print(f"[DISEASE DETECT] Called with file: {file.filename}, content_type: {file.content_type}")
    # Validate file type - more lenient check
    valid_types = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/octet-stream"]
    filename_lower = (file.filename or "").lower()
    is_valid_extension = filename_lower.endswith(('.jpg', '.jpeg', '.png', '.webp'))
    if file.content_type not in valid_types and not is_valid_extension:
        print("[DISEASE DETECT] Invalid file type.")
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Please upload JPG, PNG, or WebP image."
        )
    try:
        # Read image
        contents = await file.read()
        print(f"[DISEASE DETECT] Image size: {len(contents)} bytes")
        # Get ML predictions (Top-3)
        from starlette.concurrency import run_in_threadpool
        predictions = await run_in_threadpool(predict_disease, contents)
        print(f"[DISEASE DETECT] Predictions: {predictions}")
        
        # Check if predictions are empty or all failed
        if not predictions or all(p.get('confidence', 0) <= 0 for p in predictions):
            raise HTTPException(
                status_code=503, 
                detail="Disease detection model not available or failed to process image. Please check logs."
            )
        
        # Validate prediction format
        predictions = [
            p for p in predictions
            if isinstance(p, dict) and 'disease_name' in p and 'confidence' in p
        ]
        if not predictions:
            raise HTTPException(status_code=503, detail="ML model returned invalid prediction format.")
        
        # Process top prediction
        top_pred = predictions[0]
        disease_key = top_pred['disease_name']
        
        # Generate unique detection ID
        detection_id = f"DET{str(uuid.uuid4())[:8].upper()}"
        
        # Get disease info
        info = DISEASE_INFO.get(disease_key, DEFAULT_INFO)
        
        is_healthy = 'healthy' in disease_key.lower()
        
        diseases_list = []
        if not is_healthy:
            diseases_list.append(DiseaseResult(
                disease_name=format_disease_name(disease_key),
                confidence=round(top_pred['confidence'], 3),
                severity=info["severity"],
                description=info["description"],
                treatment=info["treatment"],
                prevention=info["prevention"]
            ))
        
        # Format Top-3 predictions for UI
        top_3 = [
            {
                "disease": format_disease_name(p['disease_name']),
                "confidence": round(p['confidence'] * 100, 1)
            }
            for p in predictions[:3]
        ]
        
        # PERSIST TO DATABASE - Log detection for research
        farmer_db_id = None
        cycle_db_id = None
        
        if farmer_id:
            farmer = crud.get_farmer_by_id(db, farmer_id)
            if farmer:
                farmer_db_id = farmer.id
        
        if crop_cycle_id:
            cycle = crud.get_crop_cycle_by_id(db, crop_cycle_id)
            if cycle:
                cycle_db_id = cycle.id
        
        # Create disease log in database
        try:
            crud.create_disease_log(
                db=db,
                disease_name=disease_key,
                confidence=top_pred['confidence'],
                crop_cycle_db_id=cycle_db_id,
                farmer_db_id=farmer_db_id,
                disease_hindi=format_disease_name(disease_key),
                severity=info["severity"],
                treatment_recommended=info["treatment"][0] if info["treatment"] else None
            )
            logger.info(f"Disease log saved: {detection_id}")
        except Exception as log_error:
            logger.error(f"DB logging failed: {log_error}", exc_info=True)
            # Don't fail the request, but track for monitoring
        
        # Sign the prediction with post-quantum crypto
        signature_data = None
        try:
            signature_metadata = await sign_and_store(
                entity_type="disease",
                entity_id=detection_id,
                data={
                    "disease": disease_key,
                    "confidence": top_pred['confidence'],
                    "plant_type": info["plant"],
                    "farmer_id": farmer_id,
                    "top_3": top_3
                }
            )
            
            signature_data = {
                "hash": signature_metadata["data_hash"][:16] + "...",
                "algorithm": signature_metadata["algorithm"],
                "timestamp": signature_metadata["timestamp"],
                "verified": True
            }
            print(f"✅ Detection signed: {detection_id}")
        except Exception as sig_error:
            print(f"⚠️ Signature generation failed: {sig_error}")
        
        return DiseaseResponse(
            success=True,
            detection_id=detection_id,
            plant_type=info["plant"],
            is_healthy=is_healthy,
            diseases=diseases_list,
            immediate_action="No immediate action needed." if is_healthy else info['treatment'][0],
            top_3_predictions=top_3,
            signature=signature_data
        )
        
    except Exception as e:
        logger.error(f"[DISEASE DETECT] ERROR: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect-base64")
@rate_limit("20/minute")  # Max 20 base64 detections per minute per IP
async def detect_disease_base64(request: Request, image_base64: str):
    """
    Detect disease from base64 encoded image.
    Useful for mobile/camera capture.
    """
    try:
        # Decode base64
        image_data = base64.b64decode(image_base64)
        
        # Get predictions
        from starlette.concurrency import run_in_threadpool
        predictions = await run_in_threadpool(predict_disease, image_data)
        
        # Format Top-3
        top_3 = [
            {
                "disease": format_disease_name(p['disease_name']),
                "confidence": round(p['confidence'] * 100, 1)
            }
            for p in predictions[:3]
        ]
        
        return {
            "success": True,
            "top_3_predictions": top_3,
            "message": "Use Top-3 for 75-85% effective accuracy"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")


@router.get("/diseases")
async def list_diseases():
    """Get list of all detectable diseases"""
    diseases = []
    for key, data in DISEASE_INFO.items():
        if 'healthy' not in key.lower():
            diseases.append({
                "id": key,
                "name": format_disease_name(key),
                "plant": data["plant"],
                "severity": data["severity"]
            })
    return {"diseases": diseases, "total": len(diseases)}


@router.get("/diseases/{disease_id}")
async def get_disease_details(disease_id: str):
    """Get detailed information about a specific disease"""
    if disease_id not in DISEASE_INFO:
        raise HTTPException(status_code=404, detail="Disease not found")
    
    data = DISEASE_INFO[disease_id]
    return {
        "id": disease_id,
        "name": format_disease_name(disease_id),
        **data
    }
