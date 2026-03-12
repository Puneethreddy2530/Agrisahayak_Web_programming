"""
Instant Camera Disease Detection API
Direct camera capture with GPS extraction and instant analysis

Features:
- Direct camera capture (HTML5 Camera API integration)
- GPS extraction from EXIF metadata
- Instant disease analysis (< 1 second)
- Cryptographic signature for results
- Auto-add to analytics heatmap
- Batch image analysis

Technology:
- PIL/Pillow for image processing
- ExifRead for GPS extraction
- PyTorch disease model
- DuckDB for analytics
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import asyncio
import tempfile
import os
import io
import base64
import uuid
import logging
import time
from datetime import datetime
from PIL import Image
from collections import defaultdict

from app.api.v1.endpoints.auth import get_current_user, UserInfo, Depends

logger = logging.getLogger(__name__)
router = APIRouter()

# Constants
MAX_IMAGE_SIZE_MB = 10
CONFIDENCE_THRESHOLD = 0.5
CAMERA_RATE_LIMIT_PER_MIN = 10

# Simple In-Memory Rate Limiting
REQUEST_LOG = defaultdict(list)

# Try to import exifread for GPS extraction
try:
    import exifread
    EXIF_AVAILABLE = True
except ImportError:
    EXIF_AVAILABLE = False
    logger.warning("exifread not installed. Install with: pip install exifread")

from app.ml_service import predict_disease
from app.db.database import get_db
from app.db import crud
from app.crypto.signature_service import sign_and_store
from app.analytics.duckdb_engine import get_duckdb


# ==================================================
# MODELS
# ==================================================

class GPSCoordinates(BaseModel):
    """GPS coordinates extracted from image"""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[float] = None
    timestamp: Optional[str] = None
    source: str = "exif"


class CameraDetectionResult(BaseModel):
    """Camera-based disease detection result"""
    detection_id: str
    success: bool
    plant_type: str
    disease_name: str
    disease_hindi: str
    confidence: float
    severity: str
    is_healthy: bool
    description: str
    treatment: List[str]
    prevention: List[str]
    immediate_action: str
    gps: Optional[GPSCoordinates] = None
    district: Optional[str] = None
    state: Optional[str] = None
    captured_at: str
    processing_time_ms: float
    signature: Optional[dict] = None
    analytics_synced: bool = False
    uncertain_prediction: bool = False


class BatchCameraRequest(BaseModel):
    """Batch camera analysis request"""
    images: List[str] = Field(..., description="List of base64 encoded images")
    farmer_id: Optional[str] = None
    auto_sync_analytics: bool = True


# Disease information with Hindi translations
DISEASE_INFO_HINDI = {
    "Late_blight": {
        "hindi_name": "झुलसा रोग (Late Blight)",
        "description": "This is a serious fungal disease that spreads quickly in wet conditions.",
        "description_hi": "यह एक गंभीर फफूंद रोग है जो गीली स्थिति में तेजी से फैलता है।",
        "treatment": [
            "Apply Mancozeb fungicide (2g/L water)",
            "Remove infected plants immediately",
            "Improve air circulation"
        ],
        "treatment_hi": [
            "मैनकोजेब फफूंदनाशी का छिड़काव करें (2g/L पानी)",
            "संक्रमित पौधों को तुरंत हटाएं",
            "हवा का आवागमन बढ़ाएं"
        ],
        "immediate": "Stop irrigation and apply fungicide immediately"
    },
    "Early_blight": {
        "hindi_name": "अगेती झुलसा (Early Blight)",
        "description": "Fungal disease causing concentric rings on leaves",
        "description_hi": "पत्तियों पर सांद्र वलय बनाने वाला फफूंद रोग",
        "treatment": [
            "Apply copper-based fungicide",
            "Remove lower infected leaves",
            "Mulch around plants"
        ],
        "treatment_hi": [
            "तांबे वाली फफूंदनाशी का छिड़काव करें",
            "नीचे की संक्रमित पत्तियों को हटाएं",
            "पौधों के चारों ओर मल्चिंग करें"
        ],
        "immediate": "Remove infected leaves and spray fungicide"
    },
    "Bacterial_spot": {
        "hindi_name": "जीवाणु धब्बा (Bacterial Spot)",
        "description": "Bacterial infection causing water-soaked spots",
        "description_hi": "पानी जैसे धब्बे बनाने वाला जीवाणु संक्रमण",
        "treatment": [
            "Apply copper hydroxide spray",
            "Avoid overhead watering",
            "Remove infected plants"
        ],
        "treatment_hi": [
            "कॉपर हाइड्रोक्साइड का छिड़काव करें",
            "ऊपर से पानी देने से बचें",
            "संक्रमित पौधों को हटाएं"
        ],
        "immediate": "Isolate infected plants and apply copper spray"
    },
    "healthy": {
        "hindi_name": "स्वस्थ (Healthy)",
        "description": "Plant appears healthy with no visible disease",
        "description_hi": "पौधा स्वस्थ है, कोई रोग नहीं दिखाई दे रहा",
        "treatment": ["Continue good practices", "Monitor regularly"],
        "treatment_hi": ["अच्छी प्रथाओं को जारी रखें", "नियमित निगरानी करें"],
        "immediate": "No action needed - plant is healthy!"
    }
}

# Severity mapping
SEVERITY_MAP = {
    "Late_blight": "severe",
    "Early_blight": "moderate",
    "Bacterial_spot": "moderate",
    "healthy": "none"
}


# ==================================================
# HELPER FUNCTIONS
# ==================================================

def extract_gps_from_exif(image_path: str) -> Optional[GPSCoordinates]:
    """
    Extract GPS coordinates from image EXIF data
    
    Returns GPS coordinates if available
    """
    if not EXIF_AVAILABLE:
        return None
    
    try:
        with open(image_path, 'rb') as f:
            tags = exifread.process_file(f, details=False)
        
        # Check for GPS tags
        gps_latitude = tags.get('GPS GPSLatitude')
        gps_latitude_ref = tags.get('GPS GPSLatitudeRef')
        gps_longitude = tags.get('GPS GPSLongitude')
        gps_longitude_ref = tags.get('GPS GPSLongitudeRef')
        gps_altitude = tags.get('GPS GPSAltitude')
        gps_date = tags.get('GPS GPSDate')
        gps_time = tags.get('GPS GPSTimeStamp')
        
        if not gps_latitude or not gps_longitude:
            return None
        
        # Convert to decimal degrees
        def to_decimal(values, ref):
            d = float(values.values[0].num) / float(values.values[0].den)
            m = float(values.values[1].num) / float(values.values[1].den)
            s = float(values.values[2].num) / float(values.values[2].den)
            
            decimal = d + (m / 60.0) + (s / 3600.0)
            if ref in ['S', 'W']:
                decimal = -decimal
            return decimal
        
        lat = to_decimal(gps_latitude, str(gps_latitude_ref))
        lon = to_decimal(gps_longitude, str(gps_longitude_ref))
        
        alt = None
        if gps_altitude:
            alt = float(gps_altitude.values[0].num) / float(gps_altitude.values[0].den)
        
        # Build timestamp
        timestamp = None
        if gps_date and gps_time:
            timestamp = f"{gps_date} {gps_time}"
        
        return GPSCoordinates(
            latitude=round(lat, 6),
            longitude=round(lon, 6),
            altitude=round(alt, 1) if alt else None,
            timestamp=timestamp,
            source="exif"
        )
    
    except Exception as e:
        logger.warning(f"GPS extraction failed: {e}")
        return None


def get_district_from_gps(lat: float, lon: float) -> Dict:
    """
    Reverse geocode GPS to district/state
    
    For now, uses hardcoded mapping for Indian states
    In production, use Google Geocoding API or Nominatim
    """
    # Simple India bounding box check
    if not (8.0 <= lat <= 37.0 and 68.0 <= lon <= 97.0):
        return {"district": "Unknown", "state": "Unknown"}
    
    # Rough state mapping based on coordinates
    # Production: Use actual reverse geocoding API
    if 18.0 <= lat <= 20.5 and 72.5 <= lon <= 80.5:
        return {"district": "Pune", "state": "Maharashtra"}
    elif 28.0 <= lat <= 32.0 and 74.0 <= lon <= 78.0:
        return {"district": "Ludhiana", "state": "Punjab"}
    elif 25.0 <= lat <= 28.5 and 80.0 <= lon <= 88.0:
        return {"district": "Varanasi", "state": "Uttar Pradesh"}
    elif 12.0 <= lat <= 18.0 and 76.0 <= lon <= 80.0:
        return {"district": "Hyderabad", "state": "Telangana"}
    elif 10.0 <= lat <= 13.0 and 76.0 <= lon <= 78.0:
        return {"district": "Bangalore", "state": "Karnataka"}
    else:
        return {"district": "Delhi", "state": "Delhi"}


def sync_to_duckdb(detection_result: dict):
    """Sync detection result to DuckDB for analytics"""
    try:
        conn = get_duckdb()
        
        # ID is now handled by DuckDB SEQUENCE DEFAULT
        conn.execute("""
            INSERT INTO disease_analytics 
            (disease_name, disease_hindi, crop, confidence, severity, 
             district, state, latitude, longitude, farmer_id, detected_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            detection_result.get("disease_name", "Unknown"),
            detection_result.get("disease_hindi", ""),
            detection_result.get("plant_type", "Unknown"),
            detection_result.get("confidence", 0.0),
            detection_result.get("severity", "unknown"),
            detection_result.get("district", "Unknown"),
            detection_result.get("state", "Unknown"),
            detection_result.get("latitude"),
            detection_result.get("longitude"),
            detection_result.get("farmer_id"),
            datetime.now()
        ])
        
        logger.info(f"Synced detection {detection_result.get('detection_id')} to DuckDB")
        return True
    
    except Exception as e:
        logger.error(f"DuckDB sync failed: {e}")
        return False


# ==================================================
# ENDPOINTS
# ==================================================

@router.get("/health")
async def camera_health(user: UserInfo = Depends(get_current_user)):
    """Check camera detection service health"""
    return {
        "service": "camera-detection",
        "status": "healthy",
        "exif_extraction": EXIF_AVAILABLE,
        "supported_formats": ["jpg", "jpeg", "png", "webp"],
        "max_file_size_mb": 10,
        "gps_reverse_geocoding": True,
        "analytics_sync": True
    }


@router.post("/detect", response_model=CameraDetectionResult)
async def detect_from_camera(
    image: UploadFile = File(..., description="Captured image from camera"),
    farmer_id: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None, description="Manual GPS lat if EXIF not available"),
    longitude: Optional[float] = Form(None, description="Manual GPS lon if EXIF not available"),
    district: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    auto_sync: bool = Form(True, description="Auto-sync to analytics"),
    user: UserInfo = Depends(get_current_user)
):
    """
    Instant Camera Disease Detection
    
    Features:
    - Direct camera capture analysis
    - Auto GPS extraction from EXIF
    - Instant ML prediction
    - Analytics heatmap sync
    - Cryptographic signing
    
    Workflow:
    1. Farmer captures image from camera
    2. GPS extracted from EXIF (if available)
    3. ML model predicts disease
    4. Result signed cryptographically
    5. Auto-synced to DuckDB heatmap
    """
    start_time = time.time()
    detection_id = str(uuid.uuid4())[:8]
    
    # 0. Rate Limiting
    now = time.time()
    user_key = f"camera_{user.phone}"
    REQUEST_LOG[user_key] = [t for t in REQUEST_LOG[user_key] if now - t < 60]
    if len(REQUEST_LOG[user_key]) >= CAMERA_RATE_LIMIT_PER_MIN:
        raise HTTPException(status_code=429, detail="Too many camera requests. Please wait a minute.")
    REQUEST_LOG[user_key].append(now)

    # 0.5 GPS Consistency Check
    if (latitude is not None and longitude is None) or (longitude is not None and latitude is None):
        raise HTTPException(400, "Both latitude and longitude must be provided together.")

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if image.content_type and image.content_type not in allowed_types:
        raise HTTPException(400, f"Invalid image type: {image.content_type}")
    
    # Derrive farmer_id from user if not provided
    farmer_id = farmer_id or user.farmer_id
    
    # Save to temp file with size and validity checks
    suffix = os.path.splitext(image.filename or "image.jpg")[1] or ".jpg"
    
    content = await image.read()
    if not content:
        raise HTTPException(400, "Empty image file.")
        
    if len(content) > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File too large (Max {MAX_IMAGE_SIZE_MB}MB)")

    # Verify image integrity
    try:
        img_check = Image.open(io.BytesIO(content))
        img_check.verify()
    except Exception as e:
        raise HTTPException(400, f"Invalid image content: {str(e)}")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Step 1: Extract GPS from EXIF
        gps = extract_gps_from_exif(tmp_path)
        
        # Fall back to manual GPS if provided
        if not gps and latitude and longitude:
            gps = GPSCoordinates(
                latitude=latitude,
                longitude=longitude,
                source="manual"
            )
        
        # Step 2: Get district from GPS
        final_district = district
        final_state = state
        
        if gps and gps.latitude and gps.longitude:
            # Validate manual GPS ranges if provided manually
            if gps.source == "manual":
                if not (-90 <= gps.latitude <= 90):
                    raise HTTPException(400, f"Invalid latitude: {gps.latitude}. Must be between -90 and 90.")
                if not (-180 <= gps.longitude <= 180):
                    raise HTTPException(400, f"Invalid longitude: {gps.longitude}. Must be between -180 and 180.")
            
            location = get_district_from_gps(gps.latitude, gps.longitude)
            final_district = final_district or location["district"]
            final_state = final_state or location["state"]
        
        # Step 3: Run ML prediction (non-blocking)
        prediction = await asyncio.to_thread(predict_disease, tmp_path)
        
        if not isinstance(prediction, dict):
            raise HTTPException(500, "Invalid prediction output from ML service")
        
        disease_key = prediction.get("disease", "healthy")
        plant_type = prediction.get("plant", "Unknown")
        confidence = prediction.get("confidence", 0.0)
        is_healthy = prediction.get("is_healthy", False)
        
        uncertain_prediction = confidence < CONFIDENCE_THRESHOLD and not is_healthy
        
        # Get disease info
        disease_info = DISEASE_INFO_HINDI.get(disease_key, DISEASE_INFO_HINDI["healthy"])
        severity = SEVERITY_MAP.get(disease_key, "unknown")
        
        # Step 4: Build result
        result = CameraDetectionResult(
            detection_id=detection_id,
            success=True,
            plant_type=plant_type,
            disease_name=disease_key,
            disease_hindi=disease_info["hindi_name"],
            confidence=round(confidence, 3),
            severity=severity,
            is_healthy=is_healthy,
            description=disease_info["description"],
            treatment=disease_info["treatment"],
            prevention=disease_info.get("prevention", []),
            immediate_action=disease_info["immediate"],
            gps=gps,
            district=final_district,
            state=final_state,
            captured_at=datetime.now().isoformat(),
            processing_time_ms=0,  # Will update
            signature=None,
            analytics_synced=False,
            uncertain_prediction=uncertain_prediction
        )
        
        # Step 5: Sign result cryptographically
        try:
            signature = sign_and_store({
                "detection_id": detection_id,
                "disease": disease_key,
                "confidence": confidence,
                "timestamp": result.captured_at
            })
            result.signature = signature
        except Exception as e:
            logger.warning(f"Signing failed: {e}")
        
        # Step 6: Sync to DuckDB analytics
        if auto_sync:
            sync_data = {
                "detection_id": detection_id,
                "disease_name": disease_key,
                "disease_hindi": disease_info["hindi_name"],
                "plant_type": plant_type,
                "confidence": confidence,
                "severity": severity,
                "district": final_district,
                "state": final_state,
                "latitude": gps.latitude if gps else None,
                "longitude": gps.longitude if gps else None,
                "farmer_id": farmer_id
            }
            result.analytics_synced = sync_to_duckdb(sync_data)
        
        # Calculate processing time
        result.processing_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Camera detection error: {e}")
        raise HTTPException(500, str(e))
    
    finally:
        # Cleanup
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@router.post("/detect/base64", response_model=CameraDetectionResult)
async def detect_from_base64(
    image_base64: str = Form(..., description="Base64 encoded image"),
    farmer_id: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    district: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    user: UserInfo = Depends(get_current_user)
):
    """
    Detect disease from base64 encoded image
    
    Useful for direct camera capture in JavaScript
    """
    start_time = time.time()
    detection_id = str(uuid.uuid4())[:8]
    
    # 0. Rate Limiting
    now = time.time()
    user_key = f"camera_{user.phone}"
    REQUEST_LOG[user_key] = [t for t in REQUEST_LOG[user_key] if now - t < 60]
    if len(REQUEST_LOG[user_key]) >= CAMERA_RATE_LIMIT_PER_MIN:
        raise HTTPException(status_code=429, detail="Too many camera requests. Please wait a minute.")
    REQUEST_LOG[user_key].append(now)

    # 0.5 GPS Consistency Check
    if (latitude is not None and longitude is None) or (longitude is not None and latitude is None):
        raise HTTPException(400, "Both latitude and longitude must be provided together.")

    # Decode base64
    try:
        # Remove data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        image_bytes = base64.b64decode(image_base64)
    except Exception as e:
        raise HTTPException(400, f"Invalid base64 image: {e}")
    
    # Derrive farmer_id from user if not provided
    farmer_id = farmer_id or user.farmer_id
    
    if len(image_bytes) > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File too large (Max {MAX_IMAGE_SIZE_MB}MB)")

    # Verify image integrity
    try:
        img_check = Image.open(io.BytesIO(image_bytes))
        img_check.verify()
    except Exception as e:
        raise HTTPException(400, f"Invalid image content: {str(e)}")

    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
        tmp_file.write(image_bytes)
        tmp_path = tmp_file.name
    
    try:
        # Extract GPS
        gps = extract_gps_from_exif(tmp_path)
        
        if not gps and latitude and longitude:
            gps = GPSCoordinates(latitude=latitude, longitude=longitude, source="manual")
        
        # Get location
        final_district = district
        final_state = state
        
        if gps and gps.latitude:
            # Validate manual GPS ranges if provided manually
            if gps.source == "manual":
                if not (-90 <= gps.latitude <= 90):
                    raise HTTPException(400, f"Invalid latitude: {gps.latitude}. Must be between -90 and 90.")
                if not (-180 <= gps.longitude <= 180):
                    raise HTTPException(400, f"Invalid longitude: {gps.longitude}. Must be between -180 and 180.")

            location = get_district_from_gps(gps.latitude, gps.longitude)
            final_district = final_district or location["district"]
            final_state = final_state or location["state"]
        
        # Run prediction (non-blocking)
        prediction = await asyncio.to_thread(predict_disease, tmp_path)
        
        if not isinstance(prediction, dict):
            raise HTTPException(500, "Invalid prediction output from ML service")
        
        disease_key = prediction.get("disease", "healthy")
        plant_type = prediction.get("plant", "Unknown")
        confidence = prediction.get("confidence", 0.0)
        is_healthy = prediction.get("is_healthy", False)
        
        uncertain_prediction = confidence < CONFIDENCE_THRESHOLD and not is_healthy
        
        disease_info = DISEASE_INFO_HINDI.get(disease_key, DISEASE_INFO_HINDI["healthy"])
        severity = SEVERITY_MAP.get(disease_key, "unknown")
        
        result = CameraDetectionResult(
            detection_id=detection_id,
            success=True,
            plant_type=plant_type,
            disease_name=disease_key,
            disease_hindi=disease_info["hindi_name"],
            confidence=round(confidence, 3),
            severity=severity,
            is_healthy=is_healthy,
            description=disease_info["description"],
            treatment=disease_info["treatment"],
            prevention=[],
            immediate_action=disease_info["immediate"],
            gps=gps,
            district=final_district,
            state=final_state,
            captured_at=datetime.now().isoformat(),
            processing_time_ms=round((time.time() - start_time) * 1000, 2),
            signature=None,
            uncertain_prediction=uncertain_prediction,
            analytics_synced=sync_to_duckdb({
                "detection_id": detection_id,
                "disease_name": disease_key,
                "disease_hindi": disease_info["hindi_name"],
                "plant_type": plant_type,
                "confidence": confidence,
                "severity": severity,
                "district": final_district,
                "state": final_state,
                "latitude": gps.latitude if gps else None,
                "longitude": gps.longitude if gps else None,
                "farmer_id": farmer_id
            })
        )
        
        return result
    
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@router.post("/batch")
async def batch_detect(
    images: List[UploadFile] = File(..., description="Multiple images to analyze"),
    farmer_id: Optional[str] = Form(None),
    user: UserInfo = Depends(get_current_user)
):
    """
    Batch process multiple images for disease detection
    
    Useful for analyzing entire field at once
    """
    if len(images) > 10:
        raise HTTPException(400, "Maximum 10 images allowed per batch")
    
    # Derrive farmer_id from user if not provided
    farmer_id = farmer_id or user.farmer_id

    results = []
    
    for image in images:
        try:
            # Validate file type
            allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
            if image.content_type and image.content_type not in allowed_types:
                results.append({"filename": image.filename, "success": False, "error": "Invalid MIME type"})
                continue

            # Check size
            content = await image.read()
            await image.seek(0) # Reset pointer for safety
            
            if not content:
                results.append({"filename": image.filename, "success": False, "error": "Empty image file"})
                continue

            if len(content) > MAX_IMAGE_SIZE_MB * 1024 * 1024:
                results.append({"filename": image.filename, "success": False, "error": f"File too large (> {MAX_IMAGE_SIZE_MB}MB)"})
                continue
            
            # Verify integrity
            try:
                img_check = Image.open(io.BytesIO(content))
                img_check.verify()
            except Exception as e:
                results.append({"filename": image.filename, "success": False, "error": f"Invalid image integrity: {str(e)}"})
                continue

            # Save temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                tmp.write(content)
                tmp_path = tmp.name
            
            # Extract GPS
            gps = extract_gps_from_exif(tmp_path)
            
            # Predict (non-blocking)
            prediction = await asyncio.to_thread(predict_disease, tmp_path)
            
            if not isinstance(prediction, dict):
                results.append({"filename": image.filename, "success": False, "error": "Invalid ML output"})
                continue
            
            results.append({
                "filename": image.filename,
                "success": True,
                "disease": prediction.get("disease", "unknown"),
                "plant": prediction.get("plant", "Unknown"),
                "confidence": prediction.get("confidence", 0.0),
                "is_healthy": prediction.get("is_healthy", False),
                "gps": gps.dict() if gps else None
            })
            
            # Cleanup
            os.unlink(tmp_path)
        
        except Exception as e:
            results.append({
                "filename": image.filename,
                "success": False,
                "error": str(e)
            })
    
    # Summary
    successful = sum(1 for r in results if r["success"])
    diseased = sum(1 for r in results if r["success"] and not r.get("is_healthy", True))
    
    return {
        "total_images": len(images),
        "processed": successful,
        "failed": len(images) - successful,
        "diseased_count": diseased,
        "healthy_count": successful - diseased,
        "results": results
    }


@router.get("/outbreak-points")
async def get_outbreak_points(
    days: int = Query(30, le=365),
    min_confidence: float = Query(0.7, ge=0, le=1),
    user: UserInfo = Depends(get_current_user)
):
    """
    Get disease outbreak points for map visualization
    
    Returns GPS coordinates with disease data for heatmap
    """
    try:
        conn = get_duckdb()
        
        from datetime import timedelta
        cutoff = datetime.now() - timedelta(days=days)
        
        result = conn.execute("""
            SELECT 
                latitude,
                longitude,
                disease_name,
                disease_hindi,
                crop,
                confidence,
                severity,
                district,
                state,
                detected_at
            FROM disease_analytics
            WHERE latitude IS NOT NULL 
              AND longitude IS NOT NULL
              AND detected_at >= ?
              AND confidence >= ?
              AND disease_name != 'healthy'
            ORDER BY detected_at DESC
            LIMIT 1000
        """, [cutoff, min_confidence]).fetchall()
        
        points = []
        for row in result:
            points.append({
                "lat": row[0],
                "lng": row[1],
                "disease": row[2],
                "disease_hindi": row[3],
                "crop": row[4],
                "confidence": row[5],
                "severity": row[6],
                "district": row[7],
                "state": row[8],
                "detected_at": row[9].isoformat() if row[9] else None
            })
        
        # Aggregate by district for clustering
        district_summary = {}
        for p in points:
            key = p["district"]
            if key not in district_summary:
                district_summary[key] = {
                    "district": key,
                    "state": p["state"],
                    "cases": 0,
                    "diseases": {},
                    "center_lat": 0,
                    "center_lng": 0
                }
            district_summary[key]["cases"] += 1
            district_summary[key]["center_lat"] += p["lat"]
            district_summary[key]["center_lng"] += p["lng"]
            
            disease = p["disease"]
            if disease not in district_summary[key]["diseases"]:
                district_summary[key]["diseases"][disease] = 0
            district_summary[key]["diseases"][disease] += 1
        
        # Calculate center coordinates
        for key in district_summary:
            count = district_summary[key]["cases"]
            district_summary[key]["center_lat"] /= count
            district_summary[key]["center_lng"] /= count
        
        return {
            "period_days": days,
            "total_points": len(points),
            "points": points,
            "district_clusters": list(district_summary.values())
        }
    
    except Exception as e:
        logger.error(f"Outbreak points error: {e}")
        raise HTTPException(500, str(e))


@router.post("/warm")
async def warm_ml_models(user: UserInfo = Depends(get_current_user)):
    """
    Pre-load ML models into memory to avoid cold-start delays
    """
    try:
        # Create a tiny dummy image
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            dummy_img = Image.new('RGB', (10, 10), color='white')
            dummy_img.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            # Trigger first inference (non-blocking)
            start = time.time()
            await asyncio.to_thread(predict_disease, tmp_path)
            duration = round((time.time() - start) * 1000, 2)
            
            return {
                "status": "warmed",
                "model_preloaded": True,
                "warm_up_time_ms": duration
            }
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    except Exception as e:
        logger.error(f"Model warm-up failed: {e}")
        raise HTTPException(500, f"Warm-up failed: {str(e)}")
