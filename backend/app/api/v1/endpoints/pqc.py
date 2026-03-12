"""
NeoShield post-quantum endpoints.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.crypto.neoshield_pqc import NeoShieldPQC, PQSignature, DILITHIUM_AVAILABLE

router = APIRouter()
_shield: Optional[NeoShieldPQC] = None


def get_shield() -> NeoShieldPQC:
    global _shield
    if _shield is None:
        _shield = NeoShieldPQC()
        _shield.load_or_generate_keys()
    return _shield


class SignRequest(BaseModel):
    content: str = Field(..., min_length=1)


class VerifyRequest(BaseModel):
    content: str = Field(..., min_length=1)
    signature: dict


@router.get("/status")
async def pqc_status():
    shield = get_shield()
    return {
        "online": True,
        "scheme": "NeoShield v1",
        "layers": ["Lattice", "HMAC-SHA3-256", "UOV-sim"],
        "security_bits": 128,
        "dilithium_available": DILITHIUM_AVAILABLE,
        "public_key": shield.keys.public_key_dict() if shield.keys else None,
        "benchmark": shield.benchmark(n=5),
    }


@router.post("/sign")
async def sign_content(request: SignRequest):
    shield = get_shield()
    sig = shield.sign(request.content)
    return {"signature": sig.to_dict(), "scheme": "NeoShield v1"}


@router.post("/verify")
async def verify_content(request: VerifyRequest):
    shield = get_shield()
    try:
        sig = PQSignature.from_dict(request.signature)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid signature payload: {exc}")
    valid, reason = shield.verify(request.content, sig)
    return {"valid": valid, "reason": reason}


@router.get("/benchmark")
async def benchmark():
    shield = get_shield()
    return shield.benchmark(n=10)

