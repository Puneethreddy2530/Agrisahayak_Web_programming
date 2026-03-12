"""
Post-Quantum Cryptographic Signatures using Falcon-512
=======================================================
NIST PQC Standardized Algorithm - Lattice-based Digital Signature

Falcon-512 provides:
- 128-bit post-quantum security level (NIST Level I)
- ~897 byte public keys
- ~1281 byte secret keys  
- ~666 byte signatures (variable, max 752)
- Fast signing and verification based on NTRU lattices

This is QUANTUM-RESISTANT - secure against Shor's algorithm attacks
that would break RSA/ECC on a cryptographically-relevant quantum computer.

Reference: https://falcon-sign.info/
NIST: https://csrc.nist.gov/projects/post-quantum-cryptography
"""

import os
import base64
import json
import logging
import hashlib
import threading
from typing import Tuple, Dict, Optional
from datetime import datetime

# Post-Quantum Cryptography - Falcon-512
from pqcrypto.sign import falcon_512

logger = logging.getLogger(__name__)

# Key storage directory
KEYS_DIR = "keys"
FALCON_SECRET_KEY_FILE = os.path.join(KEYS_DIR, "falcon512_secret.key")
FALCON_PUBLIC_KEY_FILE = os.path.join(KEYS_DIR, "falcon512_public.key")

# Thread-safe key loading
_keypair_lock = threading.Lock()
_public_key: Optional[bytes] = None
_secret_key: Optional[bytes] = None


def get_algorithm_info() -> Dict:
    """Get information about the cryptographic algorithm"""
    return {
        "algorithm": "Falcon-512",
        "type": "Post-Quantum Digital Signature",
        "security_level": "NIST Level I (128-bit post-quantum)",
        "basis": "NTRU Lattice + Fast Fourier Sampling",
        "public_key_size": falcon_512.PUBLIC_KEY_SIZE,
        "secret_key_size": falcon_512.SECRET_KEY_SIZE,
        "max_signature_size": falcon_512.SIGNATURE_SIZE,
        "quantum_resistant": True,
        "nist_status": "Standardized (FIPS 206 Draft)"
    }


def init_keypair() -> Tuple[bytes, bytes]:
    """
    Initialize or load Falcon-512 keypair
    
    Returns:
        (public_key, secret_key) as raw bytes
    """
    global _public_key, _secret_key
    
    with _keypair_lock:
        # Create keys directory if doesn't exist
        os.makedirs(KEYS_DIR, exist_ok=True)
        
        # Check if Falcon keys already exist
        if os.path.exists(FALCON_SECRET_KEY_FILE) and os.path.exists(FALCON_PUBLIC_KEY_FILE):
            logger.info("Loading existing Falcon-512 keypair")
            
            with open(FALCON_SECRET_KEY_FILE, 'rb') as f:
                _secret_key = f.read()
            
            with open(FALCON_PUBLIC_KEY_FILE, 'rb') as f:
                _public_key = f.read()
            
            # Validate key sizes with detailed error messages
            if len(_public_key) != falcon_512.PUBLIC_KEY_SIZE:
                logger.error(f"❌ CORRUPT PUBLIC KEY: {len(_public_key)} bytes != expected {falcon_512.PUBLIC_KEY_SIZE}")
                logger.warning("⚠️ Regenerating keys will invalidate ALL previous signatures!")
                logger.warning("⚠️ In production, alert admin before proceeding")
                return _generate_new_keypair()
            
            if len(_secret_key) != falcon_512.SECRET_KEY_SIZE:
                logger.error(f"❌ CORRUPT SECRET KEY: {len(_secret_key)} bytes != expected {falcon_512.SECRET_KEY_SIZE}")
                logger.warning("⚠️ Regenerating keys will invalidate ALL previous signatures!")
                logger.warning("⚠️ In production, alert admin before proceeding")
                return _generate_new_keypair()
            
            logger.info(f"✓ Falcon-512 keypair loaded successfully (PK: {len(_public_key)} bytes, SK: {len(_secret_key)} bytes)")
            return _public_key, _secret_key
        
        return _generate_new_keypair()


def _generate_new_keypair() -> Tuple[bytes, bytes]:
    """Generate new Falcon-512 keypair and save to disk"""
    global _public_key, _secret_key
    
    logger.info("🔐 Generating new Falcon-512 post-quantum keypair...")
    
    # Generate keypair using pqcrypto
    _public_key, _secret_key = falcon_512.generate_keypair()
    
    # Save to disk (binary format)
    with open(FALCON_SECRET_KEY_FILE, 'wb') as f:
        f.write(_secret_key)
    
    # Secure private key: owner-only read/write
    try:
        os.chmod(FALCON_SECRET_KEY_FILE, 0o600)
    except OSError:
        logger.warning("Could not set private key permissions (Windows)")
    
    with open(FALCON_PUBLIC_KEY_FILE, 'wb') as f:
        f.write(_public_key)
    
    logger.info(f"✓ Falcon-512 keypair generated:")
    logger.info(f"    Public key:  {len(_public_key)} bytes")
    logger.info(f"    Secret key:  {len(_secret_key)} bytes")
    logger.info(f"    Saved to: {KEYS_DIR}/")
    
    return _public_key, _secret_key


def load_keypair() -> Tuple[bytes, bytes]:
    """Load or initialize keypair - thread-safe"""
    global _public_key, _secret_key
    
    if _public_key is None or _secret_key is None:
        return init_keypair()
    
    return _public_key, _secret_key


def get_public_key() -> bytes:
    """Get public key bytes"""
    pk, _ = load_keypair()
    return pk


def get_public_key_base64() -> str:
    """Get public key as base64 string (for sharing/embedding)"""
    return base64.b64encode(get_public_key()).decode('utf-8')


def get_public_key_hex() -> str:
    """Get public key as hex string"""
    return get_public_key().hex()


# ==================================================
# SIGNING FUNCTIONS
# ==================================================

def sign_data(data: Dict, secret_key: bytes = None) -> Tuple[str, str]:
    """
    Sign data with Falcon-512 secret key
    
    Args:
        data: Dictionary to sign (will be JSON serialized canonically)
        secret_key: Secret key bytes (loads from file if None)
    
    Returns:
        (signature_base64, data_hash_hex)
    """
    # Load secret key if not provided
    if secret_key is None:
        _, secret_key = load_keypair()
    
    # Convert data to canonical JSON bytes (deterministic)
    data_string = json.dumps(data, sort_keys=True, separators=(',', ':'))
    data_bytes = data_string.encode('utf-8')
    
    # Compute SHA-256 hash for reference/logging (Falcon hashes internally with SHAKE-256)
    data_hash = hashlib.sha256(data_bytes).hexdigest()
    
    # Sign with Falcon-512
    signature = falcon_512.sign(secret_key, data_bytes)
    
    # Encode signature as base64
    signature_b64 = base64.b64encode(signature).decode('utf-8')
    
    logger.debug(f"Data signed with Falcon-512. Hash: {data_hash[:16]}... Sig: {len(signature)} bytes")
    
    return signature_b64, data_hash


def verify_signature(
    data: Dict,
    signature_b64: str,
    public_key: bytes = None
) -> bool:
    """
    Verify Falcon-512 signature
    
    Args:
        data: Original data dictionary
        signature_b64: Base64-encoded signature
        public_key: Public key bytes (loads from file if None)
    
    Returns:
        True if signature is valid, False otherwise
    """
    # Load public key if not provided
    if public_key is None:
        public_key, _ = load_keypair()
    
    try:
        # Convert data to canonical JSON bytes
        data_string = json.dumps(data, sort_keys=True, separators=(',', ':'))
        data_bytes = data_string.encode('utf-8')
        
        # Decode signature
        signature = base64.b64decode(signature_b64)
        
        # Verify with Falcon-512
        valid = falcon_512.verify(public_key, data_bytes, signature)
        
        logger.debug(f"Signature verification: {'✓ VALID' if valid else '✗ INVALID'}")
        return valid
        
    except Exception as e:
        logger.warning(f"Signature verification failed: {e}")
        return False


def sign_message(message: str, secret_key: bytes = None) -> str:
    """
    Sign a simple string message
    
    Args:
        message: String to sign
        secret_key: Secret key bytes (loads from file if None)
    
    Returns:
        Base64-encoded signature
    """
    if secret_key is None:
        _, secret_key = load_keypair()
    
    message_bytes = message.encode('utf-8')
    signature = falcon_512.sign(secret_key, message_bytes)
    
    return base64.b64encode(signature).decode('utf-8')


def verify_message(message: str, signature_b64: str, public_key: bytes = None) -> bool:
    """
    Verify a signed message
    
    Args:
        message: Original message string
        signature_b64: Base64-encoded signature
        public_key: Public key bytes (loads from file if None)
    
    Returns:
        True if valid, False otherwise
    """
    if public_key is None:
        public_key, _ = load_keypair()
    
    try:
        message_bytes = message.encode('utf-8')
        signature = base64.b64decode(signature_b64)
        return falcon_512.verify(public_key, message_bytes, signature)
    except Exception as e:
        logger.warning(f"Message verification failed: {e}")
        return False


def sign_bytes(data: bytes, secret_key: bytes = None) -> bytes:
    """
    Sign raw bytes directly
    
    Args:
        data: Bytes to sign
        secret_key: Secret key bytes (loads from file if None)
    
    Returns:
        Raw signature bytes
    """
    if secret_key is None:
        _, secret_key = load_keypair()
    
    return falcon_512.sign(secret_key, data)


def verify_bytes(data: bytes, signature: bytes, public_key: bytes = None) -> bool:
    """
    Verify signature on raw bytes
    
    Args:
        data: Original bytes
        signature: Raw signature bytes
        public_key: Public key bytes (loads from file if None)
    
    Returns:
        True if valid, False otherwise
    """
    if public_key is None:
        public_key, _ = load_keypair()
    
    try:
        return falcon_512.verify(public_key, data, signature)
    except Exception:
        return False


# ==================================================
# COMPLETE SIGNED PAYLOAD
# ==================================================

def create_signed_payload(data: Dict) -> Dict:
    """
    Create a complete signed payload with metadata
    
    Args:
        data: Data to sign
    
    Returns:
        Signed payload with signature, algorithm info, and timestamp
    """
    signature_b64, data_hash = sign_data(data)
    
    return {
        "data": data,
        "signature": signature_b64,
        "hash": data_hash,
        "algorithm": "Falcon-512",
        "public_key": get_public_key_base64(),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "quantum_resistant": True,
        "security_level": "NIST Level I (128-bit PQ)"
    }


def verify_signed_payload(payload: Dict) -> Tuple[bool, str]:
    """
    Verify a complete signed payload
    
    Args:
        payload: Signed payload from create_signed_payload()
    
    Returns:
        (is_valid, message)
    """
    try:
        # Extract components
        data = payload.get("data")
        signature_b64 = payload.get("signature")
        public_key_b64 = payload.get("public_key")
        
        if not all([data, signature_b64, public_key_b64]):
            return False, "Missing required fields (data, signature, public_key)"
        
        # Decode public key
        public_key = base64.b64decode(public_key_b64)
        
        # Validate public key size
        if len(public_key) != falcon_512.PUBLIC_KEY_SIZE:
            return False, f"Invalid public key size: {len(public_key)} (expected {falcon_512.PUBLIC_KEY_SIZE})"
        
        # Verify
        if verify_signature(data, signature_b64, public_key):
            return True, "✓ Signature valid (Falcon-512 verified)"
        else:
            return False, "✗ Invalid signature"
            
    except Exception as e:
        return False, f"Verification error: {e}"


# ==================================================
# PREDICTION SIGNING (for ML outputs)
# ==================================================

def sign_prediction(
    prediction_type: str,
    prediction_id: str,
    prediction_data: Dict
) -> Dict:
    """
    Sign an ML prediction and return signature metadata
    
    This provides cryptographic proof that a prediction came from
    this specific AgriSahayak instance and hasn't been tampered with.
    
    Args:
        prediction_type: 'disease', 'crop', 'yield'
        prediction_id: Unique ID for this prediction
        prediction_data: The actual prediction data
    
    Returns:
        Dictionary with signature info
    """
    # Prepare signing payload
    payload = {
        "type": prediction_type,
        "id": prediction_id,
        "data": prediction_data,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    # Sign the payload
    signature, data_hash = sign_data(payload)
    
    return {
        "prediction": payload,
        "signature": signature,
        "data_hash": data_hash,
        "public_key": get_public_key_base64(),
        "algorithm": "Falcon-512",
        "quantum_resistant": True
    }


def verify_prediction(signed_prediction: Dict) -> Tuple[bool, str]:
    """
    Verify a signed prediction
    
    Args:
        signed_prediction: Output from sign_prediction()
    
    Returns:
        (is_valid, message)
    """
    try:
        prediction = signed_prediction.get("prediction")
        signature = signed_prediction.get("signature")
        public_key_b64 = signed_prediction.get("public_key")
        
        if not all([prediction, signature, public_key_b64]):
            return False, "Missing required fields"
        
        public_key = base64.b64decode(public_key_b64)
        
        if verify_signature(prediction, signature, public_key):
            return True, f"✓ Prediction {prediction.get('id')} verified"
        else:
            return False, "✗ Invalid signature - prediction may be tampered"
            
    except Exception as e:
        return False, f"Verification error: {e}"


# ==================================================
# DEMO / TEST FUNCTIONS
# ==================================================

def demo():
    """Demonstrate Falcon-512 signing and verification"""
    print("=" * 70)
    print("🔐 Falcon-512 Post-Quantum Digital Signature Demo")
    print("=" * 70)
    
    # Show algorithm info
    print("\n📋 Algorithm Information:")
    info = get_algorithm_info()
    for k, v in info.items():
        print(f"    {k}: {v}")
    print()
    
    # Generate/load keys
    print("🔑 Loading/Generating Keypair...")
    pk, sk = load_keypair()
    print(f"    Public key:  {len(pk)} bytes")
    print(f"    Secret key:  {len(sk)} bytes")
    print(f"    PK (hex):    {pk.hex()[:64]}...")
    print()
    
    # Sign some data
    test_data = {
        "farmer_id": "F123456",
        "crop": "rice",
        "yield_kg": 5000,
        "verified": True,
        "location": "Maharashtra, India"
    }
    
    print("✍️  Signing test data...")
    sig, hash_val = sign_data(test_data)
    sig_bytes = base64.b64decode(sig)
    print(f"    Data hash:   {hash_val}")
    print(f"    Signature:   {len(sig_bytes)} bytes")
    print(f"    Sig (b64):   {sig[:60]}...")
    print()
    
    # Verify
    print("🔍 Verifying signature...")
    valid = verify_signature(test_data, sig)
    print(f"    Result: {'✅ VALID' if valid else '❌ INVALID'}")
    print()
    
    # Test tampered data
    print("🧪 Testing tamper detection...")
    tampered = test_data.copy()
    tampered["yield_kg"] = 9999  # Attacker changes yield
    valid_tampered = verify_signature(tampered, sig)
    print(f"    Tampered yield (5000→9999): {'❌ REJECTED' if not valid_tampered else '⚠️ ERROR!'}")
    print()
    
    # Sign a prediction
    print("🤖 Signing ML Prediction...")
    signed_pred = sign_prediction("disease", "DET-20260207-001", {
        "disease": "Late Blight",
        "confidence": 0.94,
        "plant": "Tomato"
    })
    print(f"    Prediction ID: {signed_pred['prediction']['id']}")
    print(f"    Algorithm: {signed_pred['algorithm']}")
    print(f"    Quantum-Safe: {signed_pred['quantum_resistant']}")
    print()
    
    # Verify prediction
    is_valid, msg = verify_prediction(signed_pred)
    print(f"    Verification: {msg}")
    
    print()
    print("=" * 70)
    print("🛡️  Falcon-512 is QUANTUM-RESISTANT!")
    print("    Safe against Shor's algorithm on future quantum computers.")
    print("    Your agricultural data signatures are secure for decades.")
    print("=" * 70)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    demo()
