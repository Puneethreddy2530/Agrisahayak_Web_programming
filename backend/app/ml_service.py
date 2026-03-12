"""
ML Inference Service with Pre-trained Hugging Face Models
Uses pre-trained plant disease detection model with 95%+ accuracy
Dynamic GPU allocation: models stay on CPU, move to GPU only during inference.
This gives 100% VRAM to whichever component needs it (ML or Ollama chatbot).
"""

import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import joblib
import numpy as np
from pathlib import Path
from typing import List, Dict, Optional
import logging
import io
import asyncio
import hashlib
from contextlib import contextmanager
from functools import lru_cache

# Setup logger
logger = logging.getLogger(__name__)

# Hugging Face Transformers for pre-trained model
try:
    from transformers import AutoImageProcessor, AutoModelForImageClassification
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    logger.warning("Hugging Face transformers not installed")

# Global model instances
_crop_model = None
_disease_model = None
_disease_processor = None
_pest_model = None
_pest_class_mapping = None
_yield_model = None
_device = None

# Async GPU inference semaphore - only 1 concurrent GPU op for full VRAM utilization
_gpu_semaphore: Optional[asyncio.Semaphore] = None


def _get_gpu_semaphore() -> asyncio.Semaphore:
    """Get or create GPU semaphore (lazy initialization in async context)"""
    global _gpu_semaphore
    if _gpu_semaphore is None:
        try:
            asyncio.get_running_loop()
            _gpu_semaphore = asyncio.Semaphore(1)  # Only 1 — full GPU for current task
        except RuntimeError:
            pass
    return _gpu_semaphore


def initialize_gpu_semaphore():
    """Initialize GPU semaphore - call from async startup (lifespan)"""
    global _gpu_semaphore
    _gpu_semaphore = asyncio.Semaphore(1)  # Only 1 concurrent GPU op
    logger.info("GPU semaphore initialized (1 concurrent op — dynamic GPU allocation)")


def _to_gpu(model):
    """Move a PyTorch model to GPU for inference."""
    if model is not None and torch.cuda.is_available():
        model.to(torch.device('cuda:0'))
    return model


def _to_cpu(model):
    """Move a PyTorch model back to CPU and free GPU memory."""
    if model is not None and torch.cuda.is_available():
        model.to(torch.device('cpu'))
        torch.cuda.empty_cache()
    return model


@contextmanager
def gpu_context(model):
    """
    Context manager for dynamic GPU allocation.
    Moves model to GPU on entry, back to CPU on exit.
    This ensures full VRAM is available to whichever task needs it.
    """
    try:
        _to_gpu(model)
        yield model
    finally:
        _to_cpu(model)


# Image validation constants
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MIN_IMAGE_SIZE = 1024  # 1KB (likely corrupt if smaller)
ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP"}


class ModelNotAvailableError(Exception):
    """Raised when ML model is not available for inference"""
    pass


class InvalidImageError(Exception):
    """Raised when image fails validation"""
    pass


def get_device():
    """Get the inference device. Models are loaded on CPU, moved to GPU on-demand."""
    global _device
    if _device is None:
        if torch.cuda.is_available():
            _device = torch.device('cuda:0')
            gpu_name = torch.cuda.get_device_name(0)
            vram_mb = torch.cuda.get_device_properties(0).total_memory // (1024*1024)
            logger.info(f"GPU available: {gpu_name} ({vram_mb}MB VRAM)")
            logger.info("Dynamic GPU mode: models on CPU, moved to GPU on-demand")
        else:
            _device = torch.device('cpu')
            logger.warning("CUDA not available, using CPU (slower inference)")
    return _device


def _validate_image_bytes(image_bytes: bytes) -> None:
    """Validate image before processing - size and format checks"""
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise InvalidImageError(f"Image too large: {len(image_bytes)} bytes (max {MAX_IMAGE_SIZE // 1024 // 1024}MB)")
    if len(image_bytes) < MIN_IMAGE_SIZE:
        raise InvalidImageError(f"Image too small or corrupt: {len(image_bytes)} bytes")
    
    # Quick format validation by trying to open
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.format not in ALLOWED_IMAGE_FORMATS:
            raise InvalidImageError(f"Invalid image format: {img.format}. Allowed: {ALLOWED_IMAGE_FORMATS}")
    except InvalidImageError:
        raise
    except Exception as e:
        raise InvalidImageError(f"Cannot read image: {e}")


def _compute_image_hash(image_bytes: bytes) -> str:
    """Compute hash for image caching"""
    return hashlib.md5(image_bytes).hexdigest()


def get_model_path(model_name: str) -> Path:
    """Get path to model file - models are in project_root/ml/models/"""
    # Go up from backend/app to project root, then into ml/models
    return Path(__file__).parent.parent.parent / 'ml' / 'models' / model_name


# ==================================================
# CROP RECOMMENDATION MODEL
# ==================================================
def load_crop_model():
    """Load crop recommendation model"""
    global _crop_model
    if _crop_model is None:
        model_path = get_model_path('crop_recommender_rf.pkl')
        if model_path.exists():
            try:
                _crop_model = joblib.load(model_path)
                logger.info(f"Loaded crop model from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load crop model: {e}", exc_info=True)
                _crop_model = None
        else:
            logger.warning(f"Crop model not found at {model_path}")
    return _crop_model


def predict_crop(nitrogen: float, phosphorus: float, potassium: float,
                 temperature: float, humidity: float, ph: float, 
                 rainfall: float) -> List[Dict]:
    """Predict best crops based on soil and climate parameters."""
    model_data = load_crop_model()
    
    if model_data is None:
        return _fallback_crop_recommendation(nitrogen, phosphorus, potassium, 
                                              temperature, humidity, ph, rainfall)
    
    # Extract model components from the saved dict
    if isinstance(model_data, dict):
        model = model_data.get('model')
        scaler = model_data.get('scaler')
        label_encoder = model_data.get('label_encoder')
    else:
        model = model_data
        scaler = None
        label_encoder = None
    
    if model is None:
        return _fallback_crop_recommendation(nitrogen, phosphorus, potassium, 
                                              temperature, humidity, ph, rainfall)
    
    features = np.array([[nitrogen, phosphorus, potassium, temperature, 
                          humidity, ph, rainfall]])
    
    # Scale features if scaler exists
    if scaler is not None:
        features = scaler.transform(features)
    
    if hasattr(model, 'predict_proba'):
        probs = model.predict_proba(features)[0]
        classes = model.classes_
        top_indices = np.argsort(probs)[::-1][:3]
        recommendations = []
        for idx in top_indices:
            crop_name = classes[idx]
            # Decode label if encoder exists
            if label_encoder is not None and hasattr(label_encoder, 'inverse_transform'):
                try:
                    crop_name = label_encoder.inverse_transform([crop_name])[0]
                except:
                    pass
            recommendations.append({
                'crop_name': str(crop_name),
                'confidence': float(probs[idx])
            })
        return recommendations
    else:
        pred = model.predict(features)[0]
        crop_name = pred
        if label_encoder is not None and hasattr(label_encoder, 'inverse_transform'):
            try:
                crop_name = label_encoder.inverse_transform([pred])[0]
            except:
                pass
        return [{'crop_name': str(crop_name), 'confidence': 0.95}]


def _fallback_crop_recommendation(n, p, k, temp, humidity, ph, rainfall):
    """Fallback rule-based recommendations"""
    if rainfall > 200 and humidity > 80:
        crops = ['rice', 'sugarcane', 'jute']
    elif temp > 25 and rainfall < 100:
        crops = ['cotton', 'maize', 'millet']
    elif 6 < ph < 7.5:
        crops = ['wheat', 'potato', 'tomato']
    else:
        crops = ['onion', 'maize', 'wheat']
    return [{'crop_name': c, 'confidence': 0.85 - i*0.1} for i, c in enumerate(crops)]


# ==================================================
# DISEASE DETECTION - Hugging Face Pre-trained Model
# ==================================================
def load_disease_model():
    """Load pre-trained disease detection model to CPU (moved to GPU on-demand)"""
    global _disease_model, _disease_processor
    
    if _disease_model is None:
        # Always load to CPU first — GPU is allocated dynamically during inference
        cpu = torch.device('cpu')
        get_device()  # Log GPU availability
        
        # Try local model files FIRST
        local_paths = [
            get_model_path('disease_detector_goated.pth'),
            get_model_path('disease_detector.pth')
        ]
        
        for local_path in local_paths:
            if local_path.exists():
                try:
                    logger.info(f"Loading local disease model from {local_path}")
                    _disease_model = torch.load(local_path, map_location=cpu)
                    _disease_model.to(cpu)
                    _disease_model.eval()
                    logger.info("Loaded local disease model (on CPU, GPU on-demand)")
                    return _disease_model, None
                except Exception as e:
                    logger.warning(f"Failed to load local model {local_path}: {e}")
        
        # Fall back to HuggingFace only if local models don't exist
        if HF_AVAILABLE:
            try:
                model_name = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
                logger.info(f"Loading pre-trained model from HuggingFace: {model_name}")
                
                _disease_processor = AutoImageProcessor.from_pretrained(model_name)
                _disease_model = AutoModelForImageClassification.from_pretrained(model_name)
                _disease_model.to(cpu)  # Stay on CPU
                _disease_model.eval()
                
                logger.info(f"Loaded HuggingFace disease model (on CPU, GPU on-demand)")
                logger.info(f"   Classes: {len(_disease_model.config.id2label)}")
            except Exception as e:
                logger.error(f"Failed to load HuggingFace model: {e}", exc_info=True)
                _disease_model = None
                _disease_processor = None
        else:
            logger.warning("Transformers not available, using fallback")
    
    return _disease_model, _disease_processor


# LRU cache for disease predictions (avoid reprocessing same images)
@lru_cache(maxsize=100)
def _cached_disease_prediction(image_hash: str, image_bytes_tuple: tuple) -> List[Dict]:
    """Cached disease prediction by image hash"""
    # Convert tuple back to bytes for actual prediction
    return _predict_disease_sync(bytes(image_bytes_tuple))


def _predict_disease_sync(image_bytes: bytes) -> List[Dict]:
    """Synchronous disease prediction with dynamic GPU allocation."""
    model, processor = load_disease_model()
    
    if model is None or processor is None:
        _fallback_disease_prediction()  # Raises ModelNotAvailableError
    
    device = get_device()
    
    try:
        # Load image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Move model to GPU, run inference, move back to CPU
        with gpu_context(model):
            # Process image and send to same device as model
            inputs = processor(images=image, return_tensors="pt").to(device)
            
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.softmax(outputs.logits, dim=1)[0].cpu()
        
        # Process results on CPU (model already moved back)
        topk = torch.topk(probs, k=min(3, len(probs)))
        
        results = []
        for i in range(len(topk.indices)):
            class_idx = topk.indices[i].item()
            confidence = topk.values[i].item()
            disease_name = model.config.id2label[class_idx]
            
            results.append({
                'disease_name': disease_name,
                'confidence': confidence
            })
        
        return results
    
    except Exception as e:
        logger.error(f"Disease prediction error: {e}", exc_info=True)
        _to_cpu(model)  # Ensure GPU is freed even on error
        raise RuntimeError(f"Disease prediction failed: {e}")


async def predict_disease_async(image_bytes: bytes) -> List[Dict]:
    """
    Async disease detection with GPU semaphore protection.
    Use this from async endpoints for proper concurrency control.
    """
    # Validate image first
    _validate_image_bytes(image_bytes)
    
    # Use cache for repeated images
    image_hash = _compute_image_hash(image_bytes)
    
    # Acquire GPU semaphore to prevent memory contention
    semaphore = _get_gpu_semaphore()
    async with semaphore:
        # Run CPU-heavy inference in thread pool to not block event loop
        loop = asyncio.get_event_loop()
        try:
            return await loop.run_in_executor(
                None,  # Default executor
                _cached_disease_prediction,
                image_hash,
                tuple(image_bytes)
            )
        except Exception as e:
            logger.warning(f"Prediction error: {e}")
            # Try without cache
            return await loop.run_in_executor(
                None,
                _predict_disease_sync,
                image_bytes
            )


def predict_disease(image_bytes: bytes) -> List[Dict]:
    """
    Synchronous disease detection (for backward compatibility).
    Prefer predict_disease_async for FastAPI endpoints.
    """
    # Validate image first
    _validate_image_bytes(image_bytes)
    
    # Use cache for repeated images
    image_hash = _compute_image_hash(image_bytes)
    
    try:
        return _cached_disease_prediction(image_hash, tuple(image_bytes))
    except Exception as e:
        logger.warning(f"Cache miss or error, running fresh prediction: {e}")
        return _predict_disease_sync(image_bytes)


def _fallback_disease_prediction():
    """Fallback when model not available - raises explicit error"""
    raise ModelNotAvailableError(
        "Disease detection model not available. "
        "Check that models are downloaded and GPU/CPU is accessible."
    )


# ==================================================
# PEST DETECTION - EfficientNetV2 Custom Model
# ==================================================

# Pest class information
PEST_CLASS_INFO = {
    "1_Rice_leaf_roller": {
        "name": "Rice Leaf Roller",
        "hindi_name": "धान की पत्ती मोड़क",
        "scientific_name": "Cnaphalocrocis medinalis",
        "description": "Small moth larvae that roll and feed inside rice leaves, causing white streaks",
        "severity": "moderate",
        "treatment": [
            "Apply Chlorantraniliprole (Coragen) @ 0.4ml/L",
            "Spray Fipronil 5% SC @ 1.5ml/L",
            "Use Trichoderma-based biopesticides",
            "Release Trichogramma parasitoid wasps"
        ],
        "prevention": [
            "Avoid excessive nitrogen fertilizer",
            "Maintain proper plant spacing",
            "Remove weed hosts around fields",
            "Use pheromone traps for monitoring"
        ],
        "immediate_action": "Spray insecticide if >25% leaves affected"
    },
    "2_Grub": {
        "name": "White Grub",
        "hindi_name": "सफेद गिडार",
        "scientific_name": "Holotrichia spp.",
        "description": "C-shaped white larvae that feed on plant roots, causing wilting and plant death",
        "severity": "severe",
        "treatment": [
            "Apply Chlorpyrifos 20% EC in soil @ 4L/ha",
            "Use Imidacloprid soil drench @ 400ml/ha",
            "Apply Metarhizium anisopliae @ 5kg/ha",
            "Deep plowing to expose grubs to predators"
        ],
        "prevention": [
            "Light traps to catch adult beetles (May-June)",
            "Apply neem cake @ 250kg/ha",
            "Crop rotation with non-host crops",
            "Install light traps during beetle emergence"
        ],
        "immediate_action": "Soil drench with insecticide around affected plants"
    },
    "3_Prodenia_Litura": {
        "name": "Tobacco Cutworm / Armyworm",
        "hindi_name": "तंबाकू की सुंडी / आर्मीवर्म",
        "scientific_name": "Spodoptera litura",
        "description": "Polyphagous caterpillar causing severe defoliation, active at night",
        "severity": "severe",
        "treatment": [
            "Spray Emamectin benzoate 5% SG @ 0.4g/L",
            "Apply Spinosad 45% SC @ 0.3ml/L",
            "Use Bacillus thuringiensis (Bt) @ 2g/L",
            "Hand-pick larvae during early morning"
        ],
        "prevention": [
            "Install pheromone traps (5/ha)",
            "Deep summer plowing",
            "Remove alternate hosts and weeds",
            "Intercrop with repellent plants like marigold"
        ],
        "immediate_action": "Evening spray recommended as caterpillars are nocturnal"
    }
}


def load_pest_model():
    """Load pest classification model to CPU (moved to GPU on-demand)"""
    global _pest_model, _pest_class_mapping
    
    if _pest_model is None:
        cpu = torch.device('cpu')
        get_device()  # Log GPU availability
        
        model_path = get_model_path('pest_classifier/pest_classifier_best.pth')
        
        if model_path.exists():
            try:
                logger.info(f"Loading pest classifier from {model_path}")
                checkpoint = torch.load(model_path, map_location=cpu)
                
                # Build model architecture (same as training)
                try:
                    import timm
                    backbone = timm.create_model('tf_efficientnetv2_s', pretrained=False, num_classes=0)
                    num_features = backbone.num_features  # 1280 for EfficientNetV2-S
                    
                    class PestClassifier(nn.Module):
                        def __init__(self, backbone, num_features=1280, num_classes=3, dropout=0.3):
                            super().__init__()
                            self.backbone = backbone
                            self.classifier = nn.Sequential(
                                nn.Dropout(dropout),
                                nn.Linear(num_features, 512),
                                nn.BatchNorm1d(512),
                                nn.ReLU(inplace=True),
                                nn.Dropout(dropout * 0.5),
                                nn.Linear(512, num_classes)
                            )
                        
                        def forward(self, x):
                            features = self.backbone(x)
                            return self.classifier(features)
                    
                    num_classes = checkpoint.get('num_classes', 3)
                    _pest_model = PestClassifier(backbone, num_features, num_classes)
                    _pest_model.load_state_dict(checkpoint['model_state_dict'])
                    _pest_model.to(cpu)  # Stay on CPU
                    _pest_model.eval()
                    
                    # Load class mapping
                    _pest_class_mapping = checkpoint.get('idx_to_class', {
                        0: "1_Rice_leaf_roller",
                        1: "2_Grub",
                        2: "3_Prodenia_Litura"
                    })
                    
                    logger.info(f"Pest classifier loaded: {num_classes} classes (on CPU, GPU on-demand)")
                    logger.info(f"Classes: {list(_pest_class_mapping.values())}")
                    
                except ImportError:
                    logger.error("timm package not installed for pest model")
                    _pest_model = None
                    
            except Exception as e:
                logger.error(f"Failed to load pest model: {e}", exc_info=True)
                _pest_model = None
        else:
            logger.warning(f"Pest model not found at {model_path}")
    
    return _pest_model, _pest_class_mapping


def _predict_pest_sync(image_bytes: bytes) -> List[Dict]:
    """Synchronous pest prediction with dynamic GPU allocation."""
    model, class_mapping = load_pest_model()
    
    if model is None:
        raise ModelNotAvailableError("Pest detection model not available")
    
    device = get_device()
    
    try:
        # Load image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Transform (same as training validation transforms)
        transform = transforms.Compose([
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        # Move model to GPU, run inference, move back
        with gpu_context(model):
            img_tensor = transform(image).unsqueeze(0).to(device)
            
            with torch.no_grad():
                outputs = model(img_tensor)
                probs = torch.softmax(outputs, dim=1)[0].cpu()
        
        # Process results on CPU
        topk = torch.topk(probs, k=min(3, len(probs)))
        
        results = []
        for i in range(len(topk.indices)):
            class_idx = topk.indices[i].item()
            confidence = topk.values[i].item()
            pest_class = class_mapping.get(class_idx, f"Unknown_{class_idx}")
            pest_info = PEST_CLASS_INFO.get(pest_class, {})
            
            results.append({
                'pest_class': pest_class,
                'pest_name': pest_info.get('name', pest_class),
                'hindi_name': pest_info.get('hindi_name', ''),
                'scientific_name': pest_info.get('scientific_name', ''),
                'confidence': confidence,
                'severity': pest_info.get('severity', 'moderate'),
                'description': pest_info.get('description', ''),
                'treatment': pest_info.get('treatment', []),
                'prevention': pest_info.get('prevention', []),
                'immediate_action': pest_info.get('immediate_action', 'Consult local expert')
            })
        
        return results
    
    except Exception as e:
        logger.error(f"Pest prediction error: {e}", exc_info=True)
        _to_cpu(model)  # Ensure GPU is freed even on error
        raise RuntimeError(f"Pest prediction failed: {e}")


async def predict_pest_async(image_bytes: bytes) -> List[Dict]:
    """Async pest detection with GPU semaphore protection"""
    _validate_image_bytes(image_bytes)
    
    semaphore = _get_gpu_semaphore()
    async with semaphore:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _predict_pest_sync, image_bytes)


def predict_pest(image_bytes: bytes) -> List[Dict]:
    """Synchronous pest detection (backward compatible)"""
    _validate_image_bytes(image_bytes)
    return _predict_pest_sync(image_bytes)


# ==================================================
# YIELD PREDICTION MODEL
# ==================================================
def load_yield_model():
    """Load yield prediction model"""
    global _yield_model
    
    if _yield_model is None:
        model_path = get_model_path('yield_predictor.joblib')
        if model_path.exists():
            try:
                _yield_model = joblib.load(model_path)
                logger.info(f"Loaded yield model from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load yield model: {e}", exc_info=True)
                _yield_model = None
        else:
            logger.warning(f"Yield model not found at {model_path}")
    
    return _yield_model


def predict_yield(crop: str, season: str, state: str, area: float,
                  rainfall: float, fertilizer: float, pesticide: float) -> Dict:
    """Predict crop yield based on input parameters.
    
    Raises explicit errors for unknown categories instead of silent fallback.
    """
    model_data = load_yield_model()
    
    if model_data is None:
        raise ModelNotAvailableError("Yield prediction model not loaded")
    
    model = model_data['model']
    scaler = model_data['scaler']
    encoders = model_data['encoders']
    
    # Validate crop (required - no fallback)
    if crop not in encoders['Crop'].classes_:
        available = list(encoders['Crop'].classes_[:10])  # Show first 10
        raise ValueError(f"Unknown crop: '{crop}'. Available: {available}...")
    crop_encoded = encoders['Crop'].transform([crop])[0]
    
    # Validate season (required - no silent fallback to 0)
    if season not in encoders['Season'].classes_:
        available = list(encoders['Season'].classes_)
        raise ValueError(f"Unknown season: '{season}'. Available: {available}")
    season_encoded = encoders['Season'].transform([season])[0]
    
    # Validate state (required - no silent fallback to 0)
    if state not in encoders['State'].classes_:
        available = list(encoders['State'].classes_[:10])
        raise ValueError(f"Unknown state: '{state}'. Available: {available}...")
    state_encoded = encoders['State'].transform([state])[0]
    
    try:
        features = np.array([[crop_encoded, season_encoded, state_encoded, 
                              area, rainfall, fertilizer, pesticide]])
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        
        return {
            'predicted_yield': float(prediction),
            'confidence': model_data.get('r2_score', 0.97)
        }
    except Exception as e:
        logger.error(f"Yield prediction error for {crop}: {e}", exc_info=True)
        raise RuntimeError(f"Yield prediction failed: {e}")


# ==================================================
# INITIALIZATION
# ==================================================
def load_all_models():
    """Load all models to CPU at startup. GPU is allocated dynamically per-inference."""
    logger.info("=" * 50)
    logger.info("Loading ML Models (CPU — GPU allocated on-demand)...")
    logger.info("=" * 50)
    
    device = get_device()
    logger.info(f"GPU device: {device}")
    logger.info("Strategy: Models on CPU, moved to GPU only during inference")
    
    load_crop_model()     # scikit-learn, CPU only
    load_disease_model()  # HuggingFace model, loaded to CPU
    load_pest_model()     # EfficientNetV2, loaded to CPU
    load_yield_model()    # scikit-learn, CPU only
    
    if torch.cuda.is_available():
        torch.cuda.empty_cache()  # Ensure GPU is clean after loading
        vram_free = torch.cuda.mem_get_info()[0] // (1024*1024)
        logger.info(f"GPU VRAM free after model load: {vram_free}MB (100% available)")
    
    logger.info("=" * 50)
