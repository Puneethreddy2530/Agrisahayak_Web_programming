"""
Pest Detection Endpoints
EfficientNetV2-based pest classification from images with Top-3 predictions
Trained on IP102 dataset subset (3 pest classes)

Classes:
1. Rice Leaf Roller (Cnaphalocrocis medinalis)
2. White Grub (Holotrichia spp.)
3. Tobacco Cutworm / Armyworm (Spodoptera litura)
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Depends, Request
from pydantic import BaseModel
from typing import List, Optional
import io
import base64
import uuid
import logging
from datetime import datetime

from app.ml_service import predict_pest, InvalidImageError

logger = logging.getLogger(__name__)

router = APIRouter()


class PestResult(BaseModel):
    """Single pest detection result"""
    pest_name: str
    hindi_name: str
    scientific_name: str
    confidence: float
    severity: str  # mild, moderate, severe
    description: str
    treatment: List[str]
    prevention: List[str]
    immediate_action: str


class PestResponse(BaseModel):
    """API Response for pest detection"""
    success: bool
    detection_id: str
    top_prediction: PestResult
    top_3_predictions: List[dict]
    detected_at: str


class PestBase64Request(BaseModel):
    """Request model for base64 image pest detection"""
    image_base64: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class PestBase64Response(BaseModel):
    """Response for base64 pest detection"""
    success: bool
    detection_id: str
    pest_name: str
    pest_name_hindi: str
    scientific_name: str
    confidence: float
    severity: str
    description: str
    treatment: List[str]
    prevention: List[str]
    immediate_action: str
    top_3: List[dict]
    gps_location: Optional[dict] = None
    detected_at: str


@router.post("/detect", response_model=PestResponse)
async def detect_pest(
    request: Request,
    file: UploadFile = File(..., description="Pest/insect image (JPG/PNG)")
):
    """
    Detect pest from uploaded image using EfficientNetV2-S CNN.
    Returns Top-3 predictions with treatment recommendations.
    
    Supported pests:
    - Rice Leaf Roller
    - White Grub
    - Tobacco Cutworm / Armyworm
    """
    
    logger.info(f"[PEST DETECT] File: {file.filename}, type: {file.content_type}")
    
    # Validate file type — accept any image/* MIME type or known image extensions
    content_type = (file.content_type or "").lower()
    filename_lower = (file.filename or "").lower()
    is_image_mime = content_type.startswith("image/") or content_type == "application/octet-stream"
    is_valid_extension = filename_lower.endswith(('.jpg', '.jpeg', '.png', '.webp', '.heic', '.bmp'))
    
    if not is_image_mime and not is_valid_extension:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image (JPG, PNG, WebP)."
        )
    
    try:
        contents = await file.read()
        logger.info(f"[PEST DETECT] Image size: {len(contents)} bytes")
        
        # Get ML predictions (Top-3)
        from starlette.concurrency import run_in_threadpool
        predictions = await run_in_threadpool(predict_pest, contents)
        
        if not predictions:
            raise HTTPException(
                status_code=503,
                detail="Pest detection model not available or failed to process image."
            )
        
        # Generate detection ID
        detection_id = f"PEST{str(uuid.uuid4())[:8].upper()}"
        
        # Process top prediction
        top_pred = predictions[0]
        
        top_result = PestResult(
            pest_name=top_pred.get('pest_name', 'Unknown'),
            hindi_name=top_pred.get('hindi_name', ''),
            scientific_name=top_pred.get('scientific_name', ''),
            confidence=round(top_pred.get('confidence', 0), 4),
            severity=top_pred.get('severity', 'moderate'),
            description=top_pred.get('description', ''),
            treatment=top_pred.get('treatment', []),
            prevention=top_pred.get('prevention', []),
            immediate_action=top_pred.get('immediate_action', 'Consult local expert')
        )
        
        # Format Top-3 for UI
        top_3 = [
            {
                "pest": p.get('pest_name', 'Unknown'),
                "hindi": p.get('hindi_name', ''),
                "confidence": round(p.get('confidence', 0) * 100, 1)
            }
            for p in predictions[:3]
        ]
        
        return PestResponse(
            success=True,
            detection_id=detection_id,
            top_prediction=top_result,
            top_3_predictions=top_3,
            detected_at=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except InvalidImageError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"[PEST DETECT] Error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Pest detection failed: {str(e)}"
        )


@router.post("/detect/base64", response_model=PestBase64Response)
async def detect_pest_base64(req: PestBase64Request):
    """
    Detect pest from base64 encoded image.
    Use this for camera capture and drag-drop uploads.
    
    Example:
    ```json
    {
        "image_base64": "/9j/4AAQ...",
        "latitude": 28.6139,
        "longitude": 77.2090
    }
    ```
    """
    
    try:
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(req.image_base64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid base64 image: {e}")
        
        logger.info(f"[PEST DETECT BASE64] Image size: {len(image_bytes)} bytes")
        
        # Get predictions
        from starlette.concurrency import run_in_threadpool
        predictions = await run_in_threadpool(predict_pest, image_bytes)
        
        if not predictions:
            raise HTTPException(
                status_code=503,
                detail="Pest detection model not available"
            )
        
        detection_id = f"PEST{str(uuid.uuid4())[:8].upper()}"
        top_pred = predictions[0]
        
        # GPS location if provided
        gps = None
        if req.latitude and req.longitude:
            gps = {
                "latitude": req.latitude,
                "longitude": req.longitude
            }
        
        return PestBase64Response(
            success=True,
            detection_id=detection_id,
            pest_name=top_pred.get('pest_name', 'Unknown'),
            pest_name_hindi=top_pred.get('hindi_name', ''),
            scientific_name=top_pred.get('scientific_name', ''),
            confidence=round(top_pred.get('confidence', 0), 4),
            severity=top_pred.get('severity', 'moderate'),
            description=top_pred.get('description', ''),
            treatment=top_pred.get('treatment', []),
            prevention=top_pred.get('prevention', []),
            immediate_action=top_pred.get('immediate_action', ''),
            top_3=[
                {
                    "pest": p.get('pest_name'),
                    "hindi": p.get('hindi_name'),
                    "confidence": round(p.get('confidence', 0) * 100, 1)
                }
                for p in predictions[:3]
            ],
            gps_location=gps,
            detected_at=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except InvalidImageError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"[PEST DETECT BASE64] Error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def pest_detection_health():
    """Check pest detection service health"""
    from app.ml_service import load_pest_model
    
    model, class_mapping = load_pest_model()
    
    return {
        "service": "pest-detection",
        "status": "ready" if model is not None else "unavailable",
        "model": "EfficientNetV2-S (IP102 trained)",
        "classes": list(class_mapping.values()) if class_mapping else [],
        "supported_pests": [
            "Rice Leaf Roller",
            "White Grub (Scarab larvae)",
            "Tobacco Cutworm / Armyworm"
        ]
    }


@router.get("/pests")
async def list_supported_pests():
    """List all supported pest classes with details"""
    from app.ml_service import PEST_CLASS_INFO
    
    pests = []
    for class_key, info in PEST_CLASS_INFO.items():
        pests.append({
            "class_id": class_key,
            "name": info.get('name'),
            "hindi_name": info.get('hindi_name'),
            "scientific_name": info.get('scientific_name'),
            "severity": info.get('severity'),
            "description": info.get('description'),
            "treatment": info.get('treatment'),
            "prevention": info.get('prevention')
        })
    
    return {
        "total_pests": len(pests),
        "model": "EfficientNetV2-S",
        "accuracy": "100% (validation)",
        "pests": pests
    }
