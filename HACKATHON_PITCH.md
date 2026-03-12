# AgriSahayak — AI + Space + Quantum for Bharat's Farmers

## The Problem (In Numbers)
- 600M farmers in India, 85% smallholder (<2 acres)
- ₹1.5L crore lost annually to post-harvest waste
- Crop insurance claims take 8 months to process
- Farmers earn ₹0 from the carbon they sequester every year
- Rural connectivity: 40% farms have no 4G signal

## Our Solution: 5 Integrated Layers

### Layer 1: Ground Truth (Disease Detection)
EfficientNetV2 model + WhatsApp Twilio bot.
A farmer on a ₹5,000 smartphone WhatsApps a leaf photo.
Backend runs PyTorch inference in 3 seconds, replies in Hindi.

### Layer 2: Space Intelligence (Sentinel-2 Satellite)
We integrated Copernicus Sentinel-2 (free, 10m resolution, 5-day refresh).
While the farmer uses our WhatsApp bot for ground-level disease detection,
our PyTorch backend pulls multispectral infrared data from space.
NDVI (NIR-Red bands) shows crop health a WEEK before leaves show symptoms.
Stored as GEOMETRY polygons in DuckDB spatial extension. Zero PostGIS. Zero bloat.

### Layer 3: Predictive Mandi Arbitrage (FinTech)
Live mandi prices + DuckDB OLAP analytics.
Our algorithm calculates: revenue = (qty/100) × modal_price
Net Gain = Revenue - (distance × ₹8/km × 2)
Farmer gets told: "Drive to Mumbai Vashi mandi, not Pune. ₹3,200 extra profit today."

### Layer 4: Parametric Insurance (Web3)
Land registered → Falcon-512 quantum-resistant signature minted.
Sentinel-2 monitors NDVI every 5 days.
NDVI drops below 0.25 (flood/drought detected from space)?
Smart contract auto-triggers ₹15,000/acre payout. ZERO paperwork.
8-month wait → 0 days.

### Layer 5: Carbon Credits (ESG)
Sentinel-2 biomass analysis → tCO2 sequestered calculated.
AgriCarbon tokens minted, secured with Falcon-512.
Global corporations buy from village-level farmers directly.
Passive income without planting a single extra seed.

## Quantum Computing Justification
"Why are you using post-quantum cryptography for a farming app?"

Because we built three things that require it:
1. Land Registry: Falcon-512 signatures on land polygon ownership records
2. Parametric Insurance: Smart contract payouts require tamper-proof oracle data
3. Fleet Routing: Our logistics uses simulated quantum annealing — the exact mathematical
   framework that quantum computers would use — to solve the multi-farm TSP.

When quantum computers break RSA-2048, every existing agricultural smart contract dies.
Ours won't.

## Architecture
Farmer Phone → WhatsApp (Twilio) → FastAPI Backend
↓
PyTorch EfficientNetV2 (disease)
Sentinel-2 Satellite API (NDVI)
DuckDB Spatial Extension (polygons)
Gemini AI (advisory)
Falcon-512 PQC (signatures)
Simulated Annealing (logistics)
React + Framer Motion (UI)

## Live Demo Flow (3 minutes)
1. Show WhatsApp bot: send leaf photo → Hindi diagnosis in 3 sec
2. Show Satellite Oracle: enter farm coords → NDVI + carbon income
3. Show Mandi Navigator: input 500kg tomato → Best mandi with net profit
4. Show Outbreak Map + NDVI satellite layer toggle
5. Show Logistics Optimizer: 10 farms, run quantum routing
6. Pitch line: "Banks need land collateral. We use mathematical truth."

EXECUTION ORDER SUMMARY
PHASE 0 (30 min):  Bug fixes — DuckDB spatial, mandi-navigator endpoint, requirements.txt
PHASE 1 (60 min):  Sentinel-2 satellite service + API + satellite/__init__.py
PHASE 2 (30 min):  Twilio WhatsApp bot endpoint + register in router
PHASE 3 (90 min):  SatelliteOracle.jsx frontend page + API client additions + routing
PHASE 4 (45 min):  DeFi/Web3 tokenized harvest endpoint
PHASE 5 (45 min):  Quantum annealing logistics endpoint + LogisticsOptimizer.jsx
PHASE 6 (30 min):  Polish — Home.jsx stats, OutbreakMap NDVI toggle, Sidebar nav items
PHASE 7 (15 min):  HACKATHON_PITCH.md

TOTAL: ~6 hours of focused implementation
DEMO-READY: After Phase 3 (Satellite Oracle UI is the WOW moment for judges)
