"""
DeFi / Web3 Pitch Layer — Tokenized Harvests & Parametric Insurance Ledger

This is a SIMULATION for the hackathon pitch. It demonstrates the concepts
without requiring actual blockchain deployment.

Real implementation would use:
- Ethereum/Polygon smart contracts (Solidity)
- Falcon-512 signatures (already in pq_signer.py)  
- Chainlink oracles connecting Sentinel-2 NDVI to on-chain contracts
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import hashlib
import json
import logging

from app.crypto.pq_signer import sign_data
from app.satellite.sentinel_service import analyze_land

logger = logging.getLogger(__name__)
router = APIRouter()


def generate_contract_address(seed: str) -> str:
    """Generate deterministic fake contract address for demo"""
    h = hashlib.sha256(seed.encode()).hexdigest()
    return f"0x{h[:40]}"


def generate_tx_hash(data: str) -> str:
    """Generate deterministic fake transaction hash for demo"""
    h = hashlib.sha256(f"{data}{datetime.utcnow().strftime('%Y%m%d%H')}".encode()).hexdigest()
    return f"0x{h}"


class HarvestTokenRequest(BaseModel):
    farmer_id: str
    land_id: str
    crop: str
    area_acres: float
    expected_yield_kg: float
    lat: float
    lng: float
    token_price_inr: float = 100.0  # INR per token


@router.post("/tokenize-harvest")
async def tokenize_harvest(request: HarvestTokenRequest):
    """
    Mint 'Yield Tokens' representing a farmer's upcoming harvest.
    Investors buy tokens upfront; Sentinel-2 acts as oracle to release tranches.
    
    Pitch: "We tokenize the harvest. The satellite proves the crops are growing.
    The smart contract streams capital to the farmer as NDVI confirms growth."
    """
    # Get current satellite reading
    analysis = await analyze_land(request.lat, request.lng, request.area_acres)
    
    # Token count: 1 token = 1 kg of expected yield
    token_count = int(request.expected_yield_kg)
    total_funding = token_count * request.token_price_inr
    
    # Tranches: release 25% on planting, 25% at NDVI>0.4, 25% at NDVI>0.6, 25% at harvest
    tranches = [
        {"tranche": 1, "trigger": "planting_verified", "ndvi_threshold": 0.0, "percent": 25,
         "amount_inr": round(total_funding * 0.25), "status": "released"},
        {"tranche": 2, "trigger": "ndvi_growth", "ndvi_threshold": 0.4, "percent": 25,
         "amount_inr": round(total_funding * 0.25),
         "status": "released" if analysis["ndvi"] >= 0.4 else "pending"},
        {"tranche": 3, "trigger": "ndvi_healthy", "ndvi_threshold": 0.6, "percent": 25,
         "amount_inr": round(total_funding * 0.25),
         "status": "released" if analysis["ndvi"] >= 0.6 else "pending"},
        {"tranche": 4, "trigger": "harvest_complete", "ndvi_threshold": 0.0, "percent": 25,
         "amount_inr": round(total_funding * 0.25), "status": "pending"},
    ]
    
    released = sum(t["amount_inr"] for t in tranches if t["status"] == "released")
    pending = total_funding - released
    
    contract_address = generate_contract_address(f"{request.farmer_id}{request.land_id}")
    
    # Sign with Falcon-512
    contract_data = {
        "farmer_id": request.farmer_id,
        "land_id": request.land_id,
        "crop": request.crop,
        "tokens": token_count,
        "total_inr": total_funding,
        "contract": contract_address,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    try:
        sig_b64, _data_hash = sign_data(contract_data)  # returns (str, str)
        pq_signature = sig_b64
        algorithm = "falcon-512"
    except Exception:
        pq_signature = generate_tx_hash(json.dumps(contract_data))
        algorithm = "falcon-512 (simulation)"
    
    return {
        "contract_address": contract_address,
        "transaction_hash": generate_tx_hash(contract_address),
        "farmer_id": request.farmer_id,
        "crop": request.crop,
        "token_name": f"{request.crop.upper()}-YIELD-{datetime.utcnow().strftime('%Y%m')}",
        "token_count": token_count,
        "token_price_inr": request.token_price_inr,
        "total_funding_inr": total_funding,
        "released_inr": released,
        "pending_inr": pending,
        "current_ndvi": analysis["ndvi"],
        "crop_health": analysis["crop_health"],
        "tranches": tranches,
        "pq_signature": pq_signature[:64] + "...",
        "signature_algorithm": algorithm,
        "oracle": "Sentinel-2 NDVI via Copernicus Data Space Ecosystem",
        "blockchain": "AgriLedger (Polygon-compatible simulation)",
        "pitch": (
            f"Farmer {request.farmer_id} tokenized {token_count} kg of {request.crop} "
            f"into {token_count} Yield Tokens at ₹{request.token_price_inr} each. "
            f"Total funding: ₹{total_funding:,}. Current satellite NDVI: {analysis['ndvi']:.3f}. "
            f"₹{released:,} auto-released by smart contract. "
            f"Secured with Falcon-512 post-quantum cryptography."
        )
    }


@router.get("/portfolio/{farmer_id}")
async def get_farmer_portfolio(farmer_id: str):
    """Get farmer's tokenized harvest portfolio (demo data)"""
    # Generate consistent demo portfolio
    h = int(hashlib.md5(farmer_id.encode()).hexdigest()[:8], 16)
    crops = ["Rice", "Tomato", "Wheat", "Cotton"]
    
    tokens = []
    for i, crop in enumerate(crops[:2 + (h % 2)]):
        contract = generate_contract_address(f"{farmer_id}{crop}")
        tokens.append({
            "contract": contract,
            "crop": crop,
            "tokens_issued": 500 + (h * (i+1) % 1000),
            "token_price_inr": 80 + (i * 20),
            "total_value_inr": (500 + (h * (i+1) % 1000)) * (80 + i * 20),
            "status": ["active", "funded", "harvested"][i % 3],
        })
    
    return {
        "farmer_id": farmer_id,
        "total_tokens": sum(t["tokens_issued"] for t in tokens),
        "total_portfolio_inr": sum(t["total_value_inr"] for t in tokens),
        "tokens": tokens,
    }


@router.get("/carbon-market")
async def get_carbon_market():
    """Global AgriCarbon token market overview"""
    return {
        "market_name": "AgriCarbon Exchange",
        "total_tokens_issued": 847293,
        "total_co2_sequestered_tons": round(847293 / 10, 1),
        "token_price_inr": 80,
        "token_price_usd": 0.96,
        "24h_volume_inr": 2847000,
        "participating_farmers": 3241,
        "states_covered": 12,
        "corporate_buyers": ["TCS Carbon Offset Fund", "Infosys ESG Portfolio", "Mahindra Green Initiative"],
        "pitch": (
            "Indian farmers sequester 847,000 tCO2/year but earn ₹0 from it. "
            "AgriCarbon bridges this gap: satellite-verified carbon credits, "
            "minted to the farmer, sold to global corporations. Zero paperwork."
        )
    }
