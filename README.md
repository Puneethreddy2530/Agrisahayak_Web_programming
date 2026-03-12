<p align="center">
  <img src="https://img.shields.io/badge/AgriSahayak-v2.3-22C55E?style=for-the-badge&labelColor=0f172a" alt="version"/>
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="python"/>
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="fastapi"/>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react"/>
  <img src="https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="pytorch"/>
  <img src="https://img.shields.io/badge/DuckDB-0.10-FFF000?style=for-the-badge&logo=duckdb&logoColor=black" alt="duckdb"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="license"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="prs"/>
</p>

<h1 align="center">🌾 AgriSahayak</h1>
<h3 align="center">AI · Space Tech · Post-Quantum Cryptography · For Bharat's 600 Million Farmers</h3>

<p align="center">
  A full-stack intelligent agriculture platform that fuses <strong>satellite imagery</strong>, <strong>deep learning</strong>,<br/>
  <strong>post-quantum cryptography</strong>, and <strong>decentralized finance</strong> to empower Indian smallholder farmers.
</p>

<p align="center">
  <a href="#-the-problem">Problem</a> •
  <a href="#-solution-five-integrated-layers">Solution</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-environment-variables">Config</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🎯 The Problem

| Statistic | Impact |
|-----------|--------|
| **600M** farmers in India — 85% smallholder (<2 acres) | No access to precision agriculture |
| **₹1.5L crore** lost annually to post-harvest waste | Zero data-driven logistics |
| **8 months** average crop insurance claim processing | Manual, paper-based process |
| **₹0** earned from carbon sequestration | No mechanism for smallholders |
| **40%** farms without 4G connectivity | Cannot access web-based tools |
| **RSA-2048** secures every current smart contract | Breaks when quantum computers arrive |

---

## ✅ Solution — Five Integrated Layers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         🌾  AgriSahayak Platform                        │
├──────────────┬─────────────┬────────────────┬────────────┬──────────────┤
│  Layer 1     │  Layer 2    │   Layer 3      │  Layer 4   │   Layer 5    │
│  Ground      │  Space      │   FinTech      │   Web3     │    ESG       │
│  Truth       │  Intel      │   Arbitrage    │  Insurance │   Carbon     │
├──────────────┼─────────────┼────────────────┼────────────┼──────────────┤
│ EfficientNet │ Sentinel-2  │ Live Mandi     │ Falcon-512 │ Biomass →    │
│ V2 Disease + │ NDVI 10m    │ Prices DuckDB  │ PQC Smart  │ tCO2 →       │
│ WhatsApp Bot │ Resolution  │ GPS Arbitrage  │ Contract   │ AgriCarbon   │
└──────────────┴─────────────┴────────────────┴────────────┴──────────────┘
```

### Layer 1 — Ground Truth (Disease & Pest)
A farmer WhatsApps a leaf photo → **PyTorch EfficientNetV2** inference in **3 seconds** → reply in Hindi/regional language. Supports camera capture, drag-drop upload, and GPS-tagged EXIF metadata for outbreak correlation.

### Layer 2 — Space Intelligence (Sentinel-2)
Integrated with **Copernicus Sentinel-2** (free, 10m resolution, 5-day refresh). Pulls NIR+Red band multispectral data → NDVI scores reveal crop health **a week before** visible symptoms. Stored as GEOMETRY polygons in **DuckDB spatial** — zero PostGIS bloat.

### Layer 3 — Mandi Arbitrage (FinTech)
Live prices via AGMARKNET + DuckDB OLAP analytics. GPS haversine sorting tells farmers exactly which mandi maximizes profit today:
```
Net Gain = (qty/100 × modal_price) − (distance_km × ₹8 × 2)
```

### Layer 4 — Parametric Insurance (Web3 + PQC)
Land registered with **Falcon-512 quantum-resistant signature**. Sentinel-2 monitors NDVI every 5 days. NDVI < 0.25 (flood/drought)? **Auto-trigger ₹15,000/acre payout** — zero paperwork, 8-month wait → **0 days**.

### Layer 5 — Carbon Credits (ESG)
Sentinel-2 biomass analysis → **tCO2 sequestered** calculated. **AgriCarbon tokens** minted with Falcon-512 proofs. Global corporations buy directly from village farmers — passive income without planting a single extra seed.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🧠 AI & Machine Learning
- **Disease Detection** — EfficientNetV2, camera/drag-drop upload
- **Pest Classifier** — IP102-trained EfficientNetV2-S, 3-class
- **Crop Recommender** — PyTorch Neural Net + Random Forest fallback
- **Yield Predictor** — Gradient boosting regression
- **Fertilizer Advisor** — Soil-based NPK recommendation engine
- **AI Chatbot** — Ollama local LLM + RAG over crop knowledge base
- **Weather Intelligence** — Gemini 2.5 Flash powered forecasts

</td>
<td width="50%" valign="top">

### 🛰️ Space & Geospatial
- **Sentinel-2 Satellite** — 10m resolution, 5-day NDVI refresh
- **Outbreak Map** — Interactive disease heatmap with DuckDB clustering
- **Mandi Navigator** — GPS haversine routing, 150km radius
- **3D Globe** — Three.js real-time hero visualization
- **Leaflet Maps** — React-Leaflet satellite overlays
- **Carbon Credits** — Satellite biomass → tCO2 calculation
- **Parametric Insurance** — NDVI-triggered auto-payouts

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔐 Post-Quantum Security
- **NeoShield PQC** — 3-layer post-quantum signature framework
- **Dilithium3 / Falcon-512** — NIST PQC lattice-based crypto
- **HMAC-SHA3-256** — Symmetric binding layer
- **UOV Multivariate** — Deterministic 3rd-party verifiable layer
- **JWT Authentication** — Secure token-based auth with bcrypt
- **Land Registry** — Quantum-resistant ownership proofs
- **Rate Limiting** — slowapi per-IP throttling

</td>
<td width="50%" valign="top">

### 🌐 Accessibility & UX
- **Voice Commands** — STT in 9 Indian languages
- **Text-to-Speech** — Microsoft Edge-TTS, 9 neural voices
- **11 Languages** — Full i18n (Hindi, Tamil, Telugu, Kannada, …)
- **WCAG AA** — ARIA labels, contrast ratios, focus-visible
- **PWA Offline** — Service worker with cache fallback
- **WhatsApp Bot** — Twilio zero-connectivity fallback
- **Framer Motion** — Smooth page transitions & micro-animations

</td>
</tr>
</table>

---

## 🏗 Architecture

```
                        ┌─────────────────────────────────────┐
   Farmer Phone         │         AgriSahayak Platform         │
  ─────────────         │                                       │
  WhatsApp (Twilio) ───►│  FastAPI Backend (Python 3.11)        │
  React PWA ──────────►│                                       │
  Voice STT ──────────►│  ┌─────────────────────────────────┐  │
                        │  │  AI / ML Inference Layer         │  │
                        │  │  - EfficientNetV2  (PyTorch)     │  │
                        │  │  - Crop Neural Net (PyTorch)     │  │
                        │  │  - Yield Predictor (sklearn)     │  │
                        │  │  - Ollama LLM + RAG Engine       │  │
                        │  │  - Gemini 2.5 Flash              │  │
                        │  └──────────────┬──────────────────┘  │
                        │                 │                       │
                        │  ┌──────────────▼──────────────────┐  │
                        │  │  Data / Storage Layer            │  │
                        │  │  - DuckDB OLAP + Spatial         │  │
                        │  │  - SQLAlchemy ORM (SQLite/PG)    │  │
                        │  │  - Supabase (optional cloud)     │  │
                        │  └──────────────┬──────────────────┘  │
                        │                 │                       │
                        │  ┌──────────────▼──────────────────┐  │
                        │  │  External Integrations           │  │
                        │  │  - Copernicus Sentinel-2 API     │  │
                        │  │  - AGMARKNET Mandi Prices        │  │
                        │  │  - Twilio WhatsApp Webhook       │  │
                        │  │  - Open-Meteo Weather API        │  │
                        │  └──────────────┬──────────────────┘  │
                        │                 │                       │
                        │  ┌──────────────▼──────────────────┐  │
                        │  │  NeoShield PQC Layer             │  │
                        │  │  - Falcon-512 / Dilithium3       │  │
                        │  │  - HMAC-SHA3-256                 │  │
                        │  │  - UOV Multivariate Simulation   │  │
                        │  └─────────────────────────────────┘  │
                        └─────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.109 | Async REST API — 20+ modules, Swagger UI at `/docs` |
| **Python** | 3.11 | Core runtime |
| **PyTorch** + Torchvision | 2.1 | EfficientNetV2 disease/pest inference |
| **Transformers** | 4.36 | Hugging Face model loading |
| **DuckDB** | 0.10 | OLAP analytics + spatial extensions + heatmaps |
| **SQLAlchemy** | 2.0 | Relational ORM (SQLite local / Supabase Postgres) |
| **Ollama** | latest | Local GPU-accelerated LLM (RAG chatbot) |
| **Gemini 2.5 Flash** | — | Weather intelligence, crop & market advisory |
| **Edge-TTS** | — | 9 Microsoft neural voices for Indian languages |
| **pqcrypto** | — | Dilithium3 / Falcon-512 NIST PQC signatures |
| **python-jose** | — | JWT token generation & validation |
| **slowapi** | — | Per-IP rate limiting |
| **httpx** | — | Async HTTP client for external APIs |
| **Uvicorn** | — | ASGI server with hot-reload |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | Component-driven SPA |
| **Vite** | 5.4 | Lightning-fast dev server & bundler |
| **TailwindCSS** | 3.4 | Utility-first responsive styling |
| **Framer Motion** | 12 | Page transitions & micro-animations |
| **Three.js** | 0.183 | 3D interactive globe visualization |
| **Recharts** | 2.15 | Data visualization & analytics charts |
| **React-Leaflet** | — | Interactive satellite & outbreak maps |
| **Zustand** | 5 | Lightweight global state management |
| **TanStack Query** | 5 | Server state, caching & background sync |
| **GSAP** | 3.14 | Advanced timeline animations |
| **html2canvas + jsPDF** | — | Export analytics to PDF/PNG |
| **QRCode.react** | — | QR code generation |
| **Lucide React** | — | Modern icon library |

### Infrastructure & Integrations
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerized single-image deployment |
| **Twilio** | WhatsApp bot webhook for zero-connectivity access |
| **Copernicus API** | Free Sentinel-2 satellite data (ESA) |
| **AGMARKNET / data.gov.in** | Live mandi price feeds |
| **Open-Meteo** | Free weather forecast API |
| **Supabase** *(optional)* | Cloud auth, file storage, remote PostgreSQL |

---

## 📦 Project Structure

```
AgriSahayak/
│
├── 🐍 start.py                         # Smart launcher (GPU, Ollama, React, checks)
├── 🐋 Dockerfile                        # Production container (HuggingFace Spaces)
├── 📋 requirements.txt                  # Top-level Python dependencies
│
├── 🔧 backend/
│   ├── requirements.txt                 # Backend-specific dependencies
│   └── app/
│       ├── main.py                      # FastAPI app, middleware, SPA serving
│       ├── ml_service.py                # ML model loader (singleton, lazy)
│       │
│       ├── api/v1/
│       │   ├── router.py                # Central route registry (20+ modules)
│       │   └── endpoints/
│       │       ├── auth.py              # JWT login / register / token refresh
│       │       ├── crop.py              # AI crop advisory
│       │       ├── disease.py           # EfficientNetV2 disease detection
│       │       ├── pest.py              # IP102 pest classification
│       │       ├── weather.py           # Gemini weather intelligence
│       │       ├── market.py            # Mandi prices + GPS arbitrage
│       │       ├── satellite.py         # Sentinel-2 NDVI + carbon + insurance
│       │       ├── logistics.py         # Quantum-annealed fleet routing
│       │       ├── chatbot.py           # Ollama RAG chatbot
│       │       ├── voice.py             # STT / TTS (9 languages)
│       │       ├── whatsapp.py          # Twilio webhook
│       │       ├── defi.py              # DeFi tokenized harvests & insurance
│       │       ├── pqc.py               # Post-quantum crypto operations
│       │       ├── analytics.py         # DuckDB OLAP analytics
│       │       ├── outbreak_map.py      # Disease heatmap GeoJSON
│       │       ├── fertilizer.py        # NPK fertilizer advisor
│       │       ├── expense.py           # Expense & profit tracker
│       │       ├── schemes.py           # Government scheme finder
│       │       ├── complaints.py        # Farmer complaint system
│       │       ├── cropcycle.py         # Crop lifecycle management
│       │       ├── dashboard.py         # Personalized farmer dashboard
│       │       ├── camera.py            # Camera capture + GPS EXIF
│       │       ├── farmer.py            # Farmer profile management
│       │       └── export.py            # CSV / research data export
│       │
│       ├── ai/
│       │   └── gemini_client.py         # Google Gemini 2.5 Flash
│       ├── chatbot/
│       │   ├── ollama_client.py         # Local Ollama LLM client
│       │   └── rag_engine.py            # Retrieval-augmented generation
│       ├── crypto/
│       │   ├── neoshield_pqc.py         # NeoShield 3-layer PQC engine
│       │   ├── hybrid.py                # Classical + post-quantum hybrid
│       │   ├── pq_signer.py             # Falcon-512 / Dilithium3 signer
│       │   └── signature_service.py     # Signing orchestration
│       ├── analytics/
│       │   └── duckdb_engine.py         # DuckDB spatial analytics engine
│       ├── ml/models/
│       │   ├── crop_model.py            # Neural net crop recommender wrapper
│       │   └── disease_model.py         # EfficientNetV2 classifier wrapper
│       ├── external/
│       │   ├── weather_api.py           # Weather data provider
│       │   └── market_api.py            # AGMARKNET mandi feed
│       ├── satellite/
│       │   └── sentinel_service.py      # Sentinel-2 NDVI + carbon service
│       ├── storage/
│       │   └── supabase_client.py       # Cloud storage client
│       ├── db/
│       │   ├── database.py              # SQLAlchemy engine + session factory
│       │   ├── models.py                # ORM models
│       │   └── crud.py                  # CRUD operations
│       └── core/
│           └── config.py                # Pydantic settings (env-driven)
│
├── ⚛️  frontend-src/
│   ├── package.json                     # React 18 + Vite 5 dependencies
│   ├── vite.config.js                   # Vite config with proxy to :8000
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                      # Router + auth guards + offline bar
│       ├── i18n.js                      # i18next config (11 languages)
│       ├── contexts/AppContext.jsx       # Global state provider
│       ├── store/                        # Zustand stores
│       ├── api/
│       │   ├── client.js                # Axios instance + interceptors
│       │   └── idb.js                   # IndexedDB offline cache
│       ├── components/
│       │   ├── GlobeVisualization.jsx   # Three.js 3D globe
│       │   ├── VoiceCommandBar.jsx      # Voice STT/TTS UI component
│       │   ├── YieldPredictor.jsx       # Yield forecast widget
│       │   ├── LoadingScreen.jsx        # Animated splash screen
│       │   └── layout/
│       │       ├── MainLayout.jsx       # Sidebar + content scaffold
│       │       └── Sidebar.jsx          # Navigation + i18n picker
│       └── pages/
│           ├── Home.jsx                 # Dashboard + 3D globe hero
│           ├── Disease.jsx              # Photo-based disease detection
│           ├── Pest.jsx                 # Pest identification
│           ├── CropAdvisor.jsx          # AI crop recommendations
│           ├── CropCycle.jsx            # Lifecycle timeline + confetti
│           ├── Weather.jsx              # Gemini-powered weather
│           ├── Market.jsx               # Mandi prices + navigator
│           ├── SatelliteOracle.jsx      # NDVI maps + carbon + insurance
│           ├── LogisticsOptimizer.jsx   # Quantum fleet routing
│           ├── Chatbot.jsx              # AI chatbot interface
│           ├── Analytics.jsx            # Charts + PDF export
│           ├── OutbreakMap.jsx          # Disease heatmap
│           ├── Fertilizer.jsx           # NPK soil advisor
│           ├── Expense.jsx              # Income/expense tracker
│           ├── SoilPassport.jsx         # Soil health passport
│           ├── Schemes.jsx              # Government scheme finder
│           ├── Complaints.jsx           # Issue reporting
│           ├── Admin.jsx                # Admin panel
│           ├── Profile.jsx              # User profile
│           └── Login.jsx                # Authentication
│
├── 🧪 ml/
│   ├── models/                          # Trained model weights (not in repo — see below)
│   ├── training/                        # Training scripts (reproducible)
│   │   ├── crop_recommendation/train.py
│   │   ├── disease_detection/train.py
│   │   └── yield_prediction/train.py
│   ├── notebooks/                       # Jupyter experiment notebooks
│   └── data/processed / raw/           # Datasets (not in repo)
│
├── 🔐 neoshield/                        # Post-quantum crypto standalone module
├── 🔑 keys/                             # PQC key storage (git-ignored)
└── 📋 requirements.txt                  # Root-level unified requirements
```

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| **Python** | 3.11+ | Required |
| **Node.js** | 18+ | Required for frontend |
| **npm** | 9+ | Required for frontend |
| **Ollama** | latest | Optional — enables local AI chatbot |
| **CUDA GPU** | — | Optional — accelerates ML & Ollama |

### 1. Clone the Repository

```bash
git clone https://github.com/Puneethreddy2530/Agrisahayak_Web_programming.git
cd Agrisahayak_Web_programming
```

### 2. Create Virtual Environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd frontend-src
npm install
cd ..
```

### 5. Configure Environment

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables)):

```bash
# Minimum required to run with core features
GEMINI_API_KEY=your_gemini_api_key
```

### 6. Launch (Smart Startup)

```bash
python start.py
```

The smart startup script automatically:
- ✅ Builds the React frontend (Vite 5)
- ✅ Validates npm packages
- ✅ Starts Ollama with GPU acceleration (if available)
- ✅ Validates Gemini, Sentinel-2, Twilio credentials
- ✅ Verifies ML model weights presence
- ✅ Seeds DuckDB analytics with demo data
- ✅ Opens browser at `http://localhost:8000`

#### Startup Flags

```bash
python start.py --clean       # Fresh npm install + rebuild
python start.py --port 8080   # Custom port
python start.py --prod        # Production mode (no hot-reload)
python start.py --no-browser  # Skip auto-open browser
python start.py --check       # Validate all dependencies without starting
```

### 🐋 Docker

```bash
docker build -t agrisahayak .
docker run -p 7860:7860 --env-file .env agrisahayak
```

---

## 🔌 API Reference

Interactive Swagger docs available at **`http://localhost:8000/docs`** after startup.

| Module | Prefix | Description |
|--------|--------|-------------|
| 🔐 **Auth** | `/api/v1/auth` | JWT login / register / token refresh |
| 👨‍🌾 **Farmer** | `/api/v1/farmer` | Profile management |
| 🌱 **Crop** | `/api/v1/crop` | AI-powered crop advisory |
| 🌿 **Fertilizer** | `/api/v1/fertilizer` | NPK-based recommendations |
| 💰 **Expense** | `/api/v1/expense` | Income & expense tracking |
| 🩺 **Disease** | `/api/v1/disease` | EfficientNetV2 leaf diagnosis |
| 📊 **Disease History** | `/api/v1/disease-history` | Trend & recurrence analysis |
| ⛅ **Weather** | `/api/v1/weather` | Gemini-powered forecasts |
| 🏪 **Market** | `/api/v1/market` | Live mandi prices + GPS arbitrage |
| 🏛 **Schemes** | `/api/v1/schemes` | Government scheme finder |
| 📢 **Complaints** | `/api/v1/complaints` | Farmer issue reporting |
| 📤 **Export** | `/api/v1/export` | CSV data export for research |
| 📈 **Analytics** | `/api/v1/analytics` | DuckDB OLAP dashboard |
| 🤖 **Chatbot** | `/api/v1/chatbot` | Ollama RAG chatbot |
| 🎤 **Voice** | `/api/v1/voice` | STT + TTS (9 Indian languages) |
| 📸 **Camera** | `/api/v1/camera` | Direct capture + GPS EXIF |
| 🗺 **Outbreak Map** | `/api/v1/outbreak-map` | Disease heatmap + GeoJSON |
| 📊 **Dashboard** | `/api/v1/dashboard` | Personalized farmer insights |
| 🐛 **Pest** | `/api/v1/pest` | IP102 pest classification |
| 🔐 **PQC** | `/api/v1/pqc` | Post-quantum crypto operations |
| 🛰 **Satellite** | `/api/v1/satellite` | NDVI + carbon + parametric insurance |
| 🚛 **Logistics** | `/api/v1/logistics` | Quantum-annealed fleet routing |
| 📱 **WhatsApp** | `/api/v1/whatsapp` | Twilio webhook bot |
| 🪙 **DeFi** | `/api/v1/defi` | Tokenized harvests & insurance ledger |
| 🔄 **Crop Cycle** | `/api/v1/cropcycle` | Crop lifecycle management |

### Example: Disease Detection

```bash
curl -X POST http://localhost:8000/api/v1/disease/detect \
  -H "Authorization: Bearer <JWT>" \
  -F "file=@leaf_photo.jpg"
```

**Response:**
```json
{
  "disease": "Tomato Late Blight",
  "confidence": 0.94,
  "severity": "High",
  "treatment": "Apply copper-based fungicide. Remove infected leaves.",
  "prevention": "Use resistant varieties. Avoid overhead irrigation.",
  "language": "hi"
}
```

### Example: Satellite Oracle

```bash
curl -X POST http://localhost:8000/api/v1/satellite/ndvi \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"lat": 17.385, "lon": 78.486, "crop": "rice", "acres": 2.5}'
```

**Response:**
```json
{
  "ndvi": 0.62,
  "health_status": "Good",
  "carbon_sequestered_tco2": 1.87,
  "carbon_value_inr": 9350,
  "insurance_triggered": false,
  "next_check": "2026-03-17"
}
```

---

## ⚙️ Environment Variables

Create `.env` in the project root:

```env
# ── AI Services ──────────────────────────────────────────────────────
GEMINI_API_KEY=                   # Google Gemini 2.5 Flash (REQUIRED for weather/advisory)
OLLAMA_URL=http://localhost:11434 # Local Ollama LLM server

# ── Satellite (Copernicus) ───────────────────────────────────────────
SENTINEL_CLIENT_ID=               # Free at https://dataspace.copernicus.eu
SENTINEL_CLIENT_SECRET=

# ── Mandi Prices ─────────────────────────────────────────────────────
MARKET_API_KEY=                   # AGMARKNET / data.gov.in API key

# ── WhatsApp Bot (Twilio) ────────────────────────────────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# ── Authentication ───────────────────────────────────────────────────
SECRET_KEY=change-this-to-a-long-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ── Database ─────────────────────────────────────────────────────────
DATABASE_URL=sqlite:///./agrisahayak.db  # Default: SQLite
SUPABASE_URL=                            # Optional: Cloud Postgres
SUPABASE_KEY=

# ── Deployment ───────────────────────────────────────────────────────
PORT=8000
ENVIRONMENT=development  # or production
```

> **Security note:** Never commit `.env` to version control. Use `.env.example` as a reference template.

---

## 🤖 Machine Learning Models

> **Model weights are not included in this repository** (binary files ~200MB+). Download or train them separately.

| Model | Architecture | Dataset | Task |
|-------|-------------|---------|------|
| `crop_recommender_nn.pth` | PyTorch Neural Net | Soil + climate CSV | Optimal crop suggestion |
| `crop_recommender_rf.pkl` | Random Forest | Same | CPU fallback |
| `yield_predictor.joblib` | Gradient Boosting | Historical yield data | Harvest forecasting |
| `disease_detector.pth` | EfficientNetV2 | PlantVillage + custom | Leaf disease classification |
| `pest_classifier_best.pth` | EfficientNetV2-S | IP102 (102 pest classes) | Pest identification |

### Training Models from Scratch

```bash
# Crop recommender
python ml/training/crop_recommendation/train.py

# Disease detector
python ml/training/disease_detection/train.py

# Yield predictor
python ml/training/yield_prediction/train.py
```

All models **gracefully degrade** to rule-based heuristics if weights are missing — no crashes, no 500 errors.

---

## 🔐 NeoShield — Post-Quantum Cryptography

AgriSahayak implements **NeoShield**, a custom 3-layer post-quantum signature framework protecting land records, insurance oracles, and carbon tokens:

```
┌───────────────────────────────────────────────────────────────┐
│                    NeoShield PQC Engine                        │
├───────────────────────────────────────────────────────────────┤
│  Layer 1 ─ Dilithium3 / Falcon-512                            │
│            NIST PQC Round 3 lattice-based signatures          │
│                                                               │
│  Layer 2 ─ HMAC-SHA3-256                                      │
│            Symmetric binding layer (quantum-safe hash)        │
│                                                               │
│  Layer 3 ─ UOV Multivariate Simulation                        │
│            Deterministic, 3rd-party verifiable                │
│                                                               │
│  Aggregate Security: 128-bit post-quantum security level      │
└───────────────────────────────────────────────────────────────┘
```

**Why PQC for agriculture?**
- **Land Registry** — Falcon-512 signatures on ownership polygon records
- **Parametric Insurance** — Tamper-proof satellite oracle data for claim triggers
- **Carbon Tokens** — Cryptographic proof of tCO2 sequestration
- **Fleet Routing** — Simulated quantum annealing (Travelling Salesman Problem)

> *When quantum computers break RSA-2048, every existing agricultural smart contract dies. Ours won't.*

---

## 🌐 Internationalization (i18n)

Full UI translations across **11 Indian languages** with TTS voice support:

| Language | Code | Voice (TTS) | STT |
|----------|------|-------------|-----|
| English | `en` | ✅ Microsoft Neural | ✅ |
| हिन्दी Hindi | `hi` | ✅ Microsoft Neural | ✅ |
| मराठी Marathi | `mr` | ✅ Microsoft Neural | ✅ |
| ਪੰਜਾਬੀ Punjabi | `pa` | ✅ Microsoft Neural | ✅ |
| ગુજરાતી Gujarati | `gu` | ✅ Microsoft Neural | ✅ |
| தமிழ் Tamil | `ta` | ✅ Microsoft Neural | ✅ |
| తెలుగు Telugu | `te` | ✅ Microsoft Neural | ✅ |
| ಕನ್ನಡ Kannada | `kn` | ✅ Microsoft Neural | ✅ |
| বাংলা Bengali | `bn` | ✅ Microsoft Neural | ✅ |
| ଓଡ଼ିଆ Odia | `or` | ✅ Microsoft Neural | — |
| മലയാളം Malayalam | `ml` | ✅ Microsoft Neural | — |

---

## 📱 WhatsApp Integration (Zero-G Fallback)

For the 40% of Indian farms **without 4G connectivity**:

```
Farmer (₹5,000 phone)
       │
       │ WhatsApp photo/text
       ▼
Twilio Webhook ──► FastAPI Backend
                       │
               ┌───────┴────────┐
               │                │
        PyTorch Inference   Gemini Advisory
        (Disease detection) (Weather/Crop)
               │                │
               └───────┬────────┘
                       │
               Reply in Hindi/Regional Language
               in < 3 seconds
```

**Setup:** Configure Twilio credentials in `.env`, set sandbox webhook to:
```
POST https://your-domain.com/api/v1/whatsapp/webhook
```

---

## 🛰 Satellite Oracle — Sentinel-2 Details

| Parameter | Value |
|-----------|-------|
| Data Source | Copernicus Sentinel-2 (ESA) — free tier |
| Ground Resolution | 10m GSD |
| Revisit Frequency | Every 5 days |
| Spectral Bands Used | NIR (B8) + Red (B4) → NDVI |
| Storage Backend | DuckDB spatial with GEOMETRY polygons |
| Cache TTL | 5 minutes per (crop, lat, lon) tuple |
| Carbon Calculation | NDVI-based biomass → tCO2/acre |
| Insurance Trigger | NDVI < 0.25 → auto-payout event |

---

## 🚛 Quantum-Annealed Logistics

The logistics optimizer solves the **multi-farm Travelling Salesman Problem** using simulated quantum annealing — the same mathematical framework real quantum computers use:

1. **Input:** N farm coordinates + harvest quantities
2. **Algorithm:** Simulated annealing with quantum-inspired temperature schedule
3. **Output:** Optimal route minimizing total distance + fuel cost
4. **Visualization:** Interactive Leaflet map with animated waypoints

---

## ♿ Accessibility (WCAG AA)

- ✅ ARIA labels on all icon-only buttons and form controls
- ✅ Live `aria-live` regions for dynamic content updates
- ✅ Color contrast ratios meeting WCAG AA standards (4.5:1 minimum)
- ✅ `focus-visible` ring for full keyboard navigation
- ✅ Text shadow on gradient hero banners for readability
- ✅ Semantic HTML5 landmark elements (`<main>`, `<nav>`, `<aside>`)
- ✅ Skip-to-content link for screen readers

---

## 🛡 Security

| Feature | Implementation |
|---------|---------------|
| Password Hashing | `bcrypt` (cost factor 12) |
| JWT Tokens | `python-jose` — HS256, 30-min expiry |
| Rate Limiting | `slowapi` — per-IP configurable |
| CORS | Configurable `ALLOWED_ORIGINS` |
| Security Headers | `X-Frame-Options`, `X-Content-Type-Options`, `HSTS` |
| Input Validation | Pydantic v2 strict schemas on all endpoints |
| File Upload | MIME-type validation, size limits, no path traversal |
| PQC Signing | NeoShield 3-layer quantum-resistant signatures |
| Secrets Management | `.env` file (never committed), `keys/` git-ignored |

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/<your-username>/Agrisahayak_Web_programming.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make changes, then commit
git commit -m "feat: add your feature description"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

### Commit Message Convention

| Prefix | Use For |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation update |
| `refactor:` | Code restructure (no behavior change) |
| `test:` | Adding or updating tests |
| `chore:` | Dependency bumps, CI configs |

---

## 🗺 Roadmap

- [ ] Fine-tuned disease model on Indian crop varieties
- [ ] on-device TFLite model for offline disease detection
- [ ] Actual Ethereum smart contracts for parametric insurance
- [ ] Multi-tenant SaaS version for FPOs & agri-retailers
- [ ] Android app using React Native
- [ ] Integration with PM-KISAN & eNAM government APIs
- [ ] Real Copernicus STAC API integration (currently simulated)

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Puneeth Reddy T**

[![GitHub](https://img.shields.io/badge/GitHub-Puneethreddy2530-181717?style=flat-square&logo=github)](https://github.com/Puneethreddy2530)

---

<p align="center">
  <strong>🌾 AgriSahayak — Because every farmer deserves the power of AI, Space, and Quantum.</strong>
</p>
