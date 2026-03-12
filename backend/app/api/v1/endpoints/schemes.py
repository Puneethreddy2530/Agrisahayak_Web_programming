"""
Government Schemes Endpoints
Information about agricultural subsidies and welfare schemes
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class SchemeDetails(BaseModel):
    """Government scheme information"""
    id: str
    name: str
    name_hindi: str
    category: str = ""
    ministry: str
    description: str
    benefits: List[str]
    eligibility: List[str]
    documents_required: List[str]
    apply_link: str
    helpline: str


class SchemeResponse(BaseModel):
    """Scheme search response"""
    total: int
    schemes: List[SchemeDetails]


# Schemes database
SCHEMES = [
    {
        "id": "pm-kisan",
        "name": "PM-KISAN",
        "name_hindi": "पीएम-किसान सम्मान निधि",
        "category": "subsidy",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Direct income support of ₹6000/year to farmer families in 3 equal installments of ₹2000 each.",
        "benefits": [
            "₹6,000 per year in 3 installments of ₹2,000",
            "Direct bank transfer (DBT)",
            "No intermediaries"
        ],
        "eligibility": [
            "Small and marginal farmers",
            "Landholding up to 2 hectares",
            "Valid Aadhaar card",
            "Not a government employee, taxpayer, or institutional landholder"
        ],
        "documents_required": ["Aadhaar Card", "Land records (Khatauni)", "Bank account details"],
        "apply_link": "https://pmkisan.gov.in",
        "helpline": "155261"
    },
    {
        "id": "pmfby",
        "name": "PM Fasal Bima Yojana",
        "name_hindi": "प्रधानमंत्री फसल बीमा योजना",
        "category": "insurance",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Crop insurance scheme providing financial support against crop loss/damage due to natural calamities, pests and diseases.",
        "benefits": [
            "Low premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops",
            "Up to 100% sum insured on crop loss",
            "Covers natural calamities, pest outbreaks, diseases"
        ],
        "eligibility": [
            "All farmers (loanee and non-loanee)",
            "Crops notified under the scheme in your state",
            "Apply before the sowing deadline"
        ],
        "documents_required": ["Aadhaar Card", "Land records", "Bank account", "Sowing certificate"],
        "apply_link": "https://pmfby.gov.in",
        "helpline": "1800-180-1111"
    },
    {
        "id": "kcc",
        "name": "Kisan Credit Card",
        "name_hindi": "किसान क्रेडिट कार्ड",
        "category": "credit",
        "ministry": "Ministry of Finance / NABARD",
        "description": "Credit facility for short-term cultivation, post-harvest, and maintenance expenses at subsidized 4% interest rate.",
        "benefits": [
            "Credit up to ₹3 lakh at 4% interest (after subvention)",
            "Interest subvention of 3% on timely repayment",
            "Flexible repayment linked to harvest cycle",
            "Also covers animal husbandry and fisheries"
        ],
        "eligibility": [
            "Owner cultivators",
            "Tenant farmers / oral lessees",
            "Sharecroppers and SHG members",
            "Allied activities: fisheries & animal husbandry farmers"
        ],
        "documents_required": ["Land ownership / lease proof", "Identity proof (Aadhaar)", "Address proof", "Passport photo"],
        "apply_link": "https://www.nabard.org",
        "helpline": "1800-180-8087"
    },
    {
        "id": "soil-health-card",
        "name": "Soil Health Card Scheme",
        "name_hindi": "मृदा स्वास्थ्य कार्ड योजना",
        "category": "subsidy",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Free soil testing every 2 years and issuance of Soil Health Cards with crop-wise fertilizer recommendations.",
        "benefits": [
            "Free soil testing for 12 parameters",
            "Crop-wise fertilizer and micronutrient recommendations",
            "Reduces excess fertilizer use, cuts costs"
        ],
        "eligibility": ["All farmers with agricultural land"],
        "documents_required": ["Aadhaar Card", "Land details"],
        "apply_link": "https://soilhealth.dac.gov.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "pmksy",
        "name": "PM Krishi Sinchai Yojana",
        "name_hindi": "प्रधानमंत्री कृषि सिंचाई योजना",
        "category": "irrigation",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "'More crop per drop' – provides end-to-end irrigation supply solutions including subsidy for micro-irrigation systems.",
        "benefits": [
            "55% subsidy on drip/sprinkler for general farmers",
            "90% subsidy for small/marginal farmers",
            "Har Khet Ko Pani – irrigation connectivity",
            "Watershed development support"
        ],
        "eligibility": [
            "All farmers with agricultural land",
            "Priority to small and marginal farmers",
            "Minimum 0.4 ha plot for individual benefit"
        ],
        "documents_required": ["Land records", "Bank details", "Application form"],
        "apply_link": "https://pmksy.gov.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "pkvy",
        "name": "Paramparagat Krishi Vikas Yojana",
        "name_hindi": "परंपरागत कृषि विकास योजना",
        "category": "organic",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Financial support for organic farming cluster formation, PGS certification, and marketing of organic produce.",
        "benefits": [
            "₹50,000 per hectare over 3 years (₹31,000 to farmer directly)",
            "Organic certification support",
            "Training and capacity building",
            "Market linkage assistance"
        ],
        "eligibility": [
            "Farmer groups (minimum 50 farmers, 50 acres)",
            "Willing to adopt organic practices for 3 years",
            "Land area minimum 1 acre (0.4 ha) per farmer"
        ],
        "documents_required": ["Aadhaar Card", "Land records", "Group formation certificate"],
        "apply_link": "https://pgsindia-ncof.gov.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "smam",
        "name": "Sub-Mission on Agricultural Mechanization",
        "name_hindi": "कृषि यंत्रीकरण उप-मिशन",
        "category": "equipment",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Financial assistance for purchase of farm machinery and equipment, including custom hiring centers for small farmers.",
        "benefits": [
            "25–50% subsidy on farm equipment",
            "Up to 80% subsidy for SC/ST/women farmers",
            "Custom hiring centers with up to ₹25 lakh support",
            "High-tech hubs with up to ₹1 crore support"
        ],
        "eligibility": [
            "Individual farmers with minimum 0.5 ha land",
            "FPOs, cooperatives, SHGs",
            "Higher subsidy for SC/ST/women/NE farmers"
        ],
        "documents_required": ["Aadhaar", "Land records", "Bank passbook", "Category certificate if applicable"],
        "apply_link": "https://agrimachinery.nic.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "rkvy",
        "name": "Rashtriya Krishi Vikas Yojana",
        "name_hindi": "राष्ट्रीय कृषि विकास योजना",
        "category": "subsidy",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Centrally-sponsored scheme providing flexibility to states for agriculture and allied sector development.",
        "benefits": [
            "State-specific agriculture projects",
            "Infrastructure, seed improvement, extension services",
            "REAP – Remunerative Approaches for Agriculture and Allied Sector Prosperity",
            "Short-duration agri-preneurship grants"
        ],
        "eligibility": [
            "All farmers – via state government programs",
            "FPOs and cooperatives",
            "Agri-entrepreneurs"
        ],
        "documents_required": ["Aadhaar", "Land records", "Project proposal (for entrepreneurs)"],
        "apply_link": "https://rkvy.nic.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "nfsm",
        "name": "National Food Security Mission",
        "name_hindi": "राष्ट्रीय खाद्य सुरक्षा मिशन",
        "category": "subsidy",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Increases production of rice, wheat, pulses, coarse cereals, and nutri-cereals through area expansion and productivity enhancement.",
        "benefits": [
            "Subsidized seeds (50% subsidy on certified seeds)",
            "Subsidized agricultural inputs",
            "Demonstration and training",
            "Micro-nutrient and soil amendment subsidies"
        ],
        "eligibility": [
            "Farmers in notified NFSM districts",
            "Priority to small and marginal farmers",
            "Covers rice, wheat, pulses, coarse cereals growers"
        ],
        "documents_required": ["Aadhaar", "Land records"],
        "apply_link": "https://nfsm.gov.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "enam",
        "name": "National Agriculture Market (eNAM)",
        "name_hindi": "राष्ट्रीय कृषि बाजार (ई-नाम)",
        "category": "market",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Online trading platform for agricultural commodities enabling farmers to sell produce across 1,000+ APMC mandis nationally.",
        "benefits": [
            "Better price discovery through transparent bidding",
            "Access to buyers across India",
            "Reduced broker dependency",
            "Online payment directly to bank"
        ],
        "eligibility": [
            "Any farmer registered at a linked APMC mandi",
            "Trader or FPO with APMC license"
        ],
        "documents_required": ["Aadhaar", "Bank account", "APMC registration"],
        "apply_link": "https://enam.gov.in",
        "helpline": "1800-270-0224"
    },
    {
        "id": "pm-aasha",
        "name": "PM-AASHA",
        "name_hindi": "प्रधानमंत्री अन्नदाता आय संरक्षण अभियान",
        "category": "market",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Price support and price deficiency payment scheme ensuring farmers get MSP for oilseeds, pulses and copra.",
        "benefits": [
            "Price Support Scheme (PSS) – govt procurement at MSP",
            "Price Deficiency Payment (PDPS) – compensation if market price < MSP",
            "Pilot Private Procurement & Stockist Scheme (PPPS)"
        ],
        "eligibility": [
            "Farmers growing notified oilseeds, pulses, copra",
            "Registered with state government procurement",
            "Valid Aadhaar-linked bank account"
        ],
        "documents_required": ["Aadhaar", "Land records", "Bank account"],
        "apply_link": "https://pmaasha.nic.in",
        "helpline": "1800-270-0224"
    },
    {
        "id": "pmkmy",
        "name": "PM Kisan Maandhan Yojana",
        "name_hindi": "प्रधानमंत्री किसान मानधन योजना",
        "category": "pension",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Voluntary and contributory pension scheme providing ₹3,000/month pension to small and marginal farmers at age 60.",
        "benefits": [
            "₹3,000 per month pension after age 60",
            "Matched contribution by Central Government",
            "Monthly premium: ₹55–₹200 based on entry age"
        ],
        "eligibility": [
            "Entry age 18–40 years",
            "Small and marginal farmers (land up to 2 ha)",
            "Enrolled in PM-KISAN"
        ],
        "documents_required": ["Aadhaar", "Bank passbook", "Land records"],
        "apply_link": "https://pmkmy.gov.in",
        "helpline": "1800-267-6888"
    },
    {
        "id": "aif",
        "name": "Agriculture Infrastructure Fund",
        "name_hindi": "कृषि अवसंरचना कोष",
        "category": "credit",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Medium-to-long-term financing facility for post-harvest management and community farm asset infrastructure.",
        "benefits": [
            "₹1 lakh crore fund for agri infrastructure loans",
            "3% interest subvention per annum",
            "Credit guarantee coverage under CGTMSE",
            "For warehouses, cold storage, primary processing units"
        ],
        "eligibility": [
            "Farmers, FPOs, PACS, Agri-entrepreneurs",
            "Start-ups in agri infrastructure",
            "Self-help groups, Joint liability groups"
        ],
        "documents_required": ["Aadhaar", "Project report", "Land/lease documents", "Bank account"],
        "apply_link": "https://agriinfra.dac.gov.in",
        "helpline": "1800-180-7777"
    },
    {
        "id": "nhm",
        "name": "National Horticulture Mission",
        "name_hindi": "राष्ट्रीय बागवानी मिशन",
        "category": "horticulture",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Holistic development of horticulture sector including fruits, vegetables, flowers, spices, mushroom, and plantation crops.",
        "benefits": [
            "50% subsidy on planting material for fruits/vegetables",
            "50% subsidy on protected cultivation (polyhouse)",
            "Subsidy on cold storage and pack houses",
            "Market linkage and post-harvest support"
        ],
        "eligibility": [
            "All farmers with horticulture crops",
            "Priority to NE states, tribal, SC/ST farmers",
            "FPOs and cooperatives also eligible"
        ],
        "documents_required": ["Aadhaar", "Land records", "Bank account"],
        "apply_link": "https://nhb.gov.in",
        "helpline": "0124-2340429"
    },
    {
        "id": "fpo-scheme",
        "name": "Formation & Promotion of FPOs",
        "name_hindi": "किसान उत्पादक संगठन (FPO) योजना",
        "category": "collective",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Government support for forming and strengthening Farmer Producer Organizations over 5 years.",
        "benefits": [
            "₹18 lakh equity grant per FPO",
            "Credit guarantee coverage up to ₹2 crore",
            "Professional cluster management agency support",
            "Training, handholding for 5 years"
        ],
        "eligibility": [
            "Minimum 300 farmers for plains, 100 for NE/hill areas",
            "Registered as a company under Companies Act / cooperative",
            "Active participation of farmer members"
        ],
        "documents_required": ["FPO registration certificate", "Member list", "Bank account", "Business plan"],
        "apply_link": "https://sfacindia.com",
        "helpline": "1800-270-0224"
    },
    {
        "id": "atma",
        "name": "ATMA Scheme (Agricultural Technology Management Agency)",
        "name_hindi": "कृषि प्रौद्योगिकी प्रबंधन एजेंसी",
        "category": "training",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Decentralized scheme for agricultural extension, farmer training, exposure visits, and Kisan Melas.",
        "benefits": [
            "Free farmer training and demonstrations",
            "Exposure visits to research stations",
            "Kisan Melas and krishi darshans",
            "Farm school programs"
        ],
        "eligibility": ["All farmers in ATMA-registered districts"],
        "documents_required": ["Aadhaar", "Farmer registration"],
        "apply_link": "https://atma-nim.nic.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "agri-clinic",
        "name": "Agri-Clinics and Agri-Business Centres Scheme",
        "name_hindi": "कृषि क्लिनिक और कृषि व्यापार केंद्र योजना",
        "category": "training",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Supports agriculture graduates to set up Agri-Clinics providing expert advisory services to farmers.",
        "benefits": [
            "Subsidized training for agriculture graduates",
            "Loan subsidy up to 44% for SC/ST/women, 36% for others",
            "Maximum composite loan ₹20 lakh (individual), ₹100 lakh (joint)",
            "NABARD-backed credit guarantee"
        ],
        "eligibility": [
            "Agriculture graduates / diploma holders",
            "Graduates in allied sciences (forestry, veterinary, etc.)"
        ],
        "documents_required": ["Degree certificate", "Aadhaar", "Business plan", "Bank account"],
        "apply_link": "https://agriclinics.net",
        "helpline": "1800-180-1551"
    },
    {
        "id": "nmsa",
        "name": "National Mission for Sustainable Agriculture",
        "name_hindi": "राष्ट्रीय सतत कृषि मिशन",
        "category": "subsidy",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Promotes sustainable agriculture practices including soil health management, water use efficiency, and climate adaptation.",
        "benefits": [
            "Support for dryland farming development",
            "Soil health and fertility management",
            "Climate change adaptation measures",
            "On-farm water management support"
        ],
        "eligibility": [
            "All farmers, priority to rain-fed area farmers",
            "Farmers in climate-vulnerable districts"
        ],
        "documents_required": ["Aadhaar", "Land records"],
        "apply_link": "https://nmsa.dac.gov.in",
        "helpline": "1800-180-1551"
    },
    {
        "id": "wdpsca",
        "name": "Watershed Development Programme (PMKSY-WDC)",
        "name_hindi": "वाटरशेड विकास कार्यक्रम",
        "category": "irrigation",
        "ministry": "Ministry of Rural Development",
        "description": "Integrated watershed management for soil and water conservation, groundwater recharge, and improved livelihood in rainfed areas.",
        "benefits": [
            "₹12,000–15,000 per hectare support",
            "Soil and water conservation works",
            "Groundwater recharge structures",
            "Livelihood improvement for farmers"
        ],
        "eligibility": [
            "Farmers in notified watershed project areas",
            "Rain-fed areas, degraded land holders"
        ],
        "documents_required": ["Aadhaar", "Land records", "Watershed project registration"],
        "apply_link": "https://dolr.gov.in",
        "helpline": "1800-180-6763"
    },
    {
        "id": "interests-subvention",
        "name": "Interest Subvention Scheme for Short-term Loans",
        "name_hindi": "अल्पकालिक ऋण ब्याज अनुदान योजना",
        "category": "credit",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Makes short-term crop loans up to ₹3 lakh available at 4% per annum with prompt repayment incentive.",
        "benefits": [
            "Crop loans at 7% interest (with 2% govt subvention)",
            "Additional 3% incentive for prompt repayment → effective 4%",
            "Coverage extended to post-harvest storage loans",
            "Available through commercial banks, RRBs, cooperative banks"
        ],
        "eligibility": [
            "All farmers with crop loan needs up to ₹3 lakh",
            "Linked to KCC"
        ],
        "documents_required": ["Aadhaar", "Land records", "KCC"],
        "apply_link": "https://nabard.org",
        "helpline": "1800-180-8087"
    },
    {
        "id": "gramin-bhandaran",
        "name": "Gramin Bhandaran Yojana (Rural Godown Scheme)",
        "name_hindi": "ग्रामीण भंडारण योजना",
        "category": "infrastructure",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Capital subsidy for construction of rural storage godowns to prevent distress sale and enable price-based selling.",
        "benefits": [
            "Subsidy: 25% for general (max ₹87.5 lakh), 33% for SC/ST/NE (max ₹3 crore)",
            "Covers construction, renovation of godowns",
            "Capacity: 100 MT to 30,000 MT"
        ],
        "eligibility": [
            "Individual farmers, FPOs, SHGs, companies",
            "Panchayats, cooperatives",
            "Land ownership or long-term lease"
        ],
        "documents_required": ["Aadhaar", "Land/lease documents", "Construction estimate", "Bank account"],
        "apply_link": "https://nabard.org",
        "helpline": "1800-180-8087"
    }
]


@router.get("/list", response_model=SchemeResponse)
async def list_schemes(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in scheme names")
):
    """
    Get list of all government agricultural schemes.
    
    - **category**: Filter by category (credit, insurance, subsidy)
    - **search**: Search term to filter schemes
    """
    
    filtered = SCHEMES
    
    if category:
        category = category.lower()
        filtered = [s for s in filtered if s.get("category", "").lower() == category]
    
    if search:
        search = search.lower()
        filtered = [s for s in filtered if search in s["name"].lower() or search in s["name_hindi"].lower() or search in s["description"].lower()]
    
    return SchemeResponse(
        total=len(filtered),
        schemes=[SchemeDetails(**s) for s in filtered]
    )


@router.get("/{scheme_id}", response_model=SchemeDetails)
async def get_scheme_details(scheme_id: str):
    """Get detailed information about a specific scheme"""
    
    for scheme in SCHEMES:
        if scheme["id"] == scheme_id:
            return SchemeDetails(**scheme)
    
    raise HTTPException(status_code=404, detail="Scheme not found")


@router.get("/eligibility-check/{scheme_id}")
async def check_eligibility(
    scheme_id: str,
    land_size: float = Query(..., description="Land size in hectares"),
    farmer_type: str = Query(..., description="owner/tenant/sharecropper/landless")
):
    """Check if a farmer is eligible for a specific scheme based on land size and farmer type."""

    scheme = next((s for s in SCHEMES if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    eligible = True
    reasons = []
    tips = []

    is_small_marginal = land_size <= 2
    is_tenant = farmer_type in ("tenant", "sharecropper", "oral-lessee")
    is_landless = farmer_type == "landless"

    if scheme_id == "pm-kisan":
        if land_size > 2:
            eligible = False
            reasons.append("Land holding exceeds the 2 hectare limit for PM-KISAN.")
        if is_landless:
            eligible = False
            reasons.append("PM-KISAN requires ownership of agricultural land.")
        if eligible:
            tips.append("Apply at your nearest Common Service Centre (CSC) or at pmkisan.gov.in.")

    elif scheme_id == "pmkmy":
        if land_size > 2:
            eligible = False
            reasons.append("PM Kisan Maandhan Yojana is only for small/marginal farmers (up to 2 ha).")
        else:
            tips.append("Monthly premium ranges from ₹55 to ₹200 depending on your age at enrollment.")

    elif scheme_id == "kcc":
        if is_landless:
            eligible = False
            reasons.append("Kisan Credit Card requires land ownership/tenancy/sharecropping proof.")
        else:
            tips.append("Apply at any bank branch or cooperative bank with land/lease documents.")

    elif scheme_id == "pmfby":
        tips.append("Apply before the sowing deadline for your crop season in your state.")
        tips.append("Loanee farmers are auto-enrolled; non-loanee must apply manually.")

    elif scheme_id == "pkvy":
        if land_size < 0.4:
            eligible = False
            reasons.append("PKVY requires minimum 0.4 hectare land per farmer in a group.")
        else:
            tips.append("Minimum 50 farmers must form a group collectively owning at least 50 acres.")

    elif scheme_id == "smam":
        if land_size < 0.5 and not (farmer_type in ("fpo", "cooperative")):
            eligible = False
            reasons.append("SMAM individual benefit requires minimum 0.5 hectare land holding.")
        elif is_small_marginal:
            tips.append("As a small/marginal farmer you may qualify for higher subsidy (up to 80% for SC/ST/women).")

    elif scheme_id == "pmksy":
        if land_size < 0.4:
            tips.append("Minimum 0.4 ha plot required for individual drip/sprinkler subsidy benefit.")
        if is_small_marginal:
            tips.append("Small/marginal farmers get 90% subsidy on micro-irrigation equipment.")
        else:
            tips.append("General category farmers get 55% subsidy on drip/sprinkler systems.")

    elif scheme_id == "aif":
        tips.append("Minimum loan amount ₹1 lakh. Apply through any scheduled commercial bank or cooperative bank.")
        tips.append("Interest subvention of 3% per annum on loan up to ₹2 crore.")

    elif scheme_id == "gramin-bhandaran":
        if land_size < 0.1 and not (farmer_type in ("fpo", "cooperative", "company")):
            eligible = False
            reasons.append("You need land or a long-term lease to construct a rural godown.")

    elif scheme_id in ("soil-health-card", "enam", "atma", "nfsm", "nmsa", "rkvy", "nhm",
                       "wdpsca", "interests-subvention", "fpo-scheme", "agri-clinic",
                       "pm-aasha", "gramin-bhandaran"):
        # Generally open to all farmers
        tips.append("This scheme is open to all eligible farmers. Contact your local Agriculture Department office to apply.")

    if not eligible and not reasons:
        reasons.append("Based on the information provided, you do not meet the eligibility criteria for this scheme.")

    return {
        "scheme": scheme["name"],
        "scheme_id": scheme_id,
        "eligible": eligible,
        "reasons": reasons if not eligible else ["You appear to be eligible for this scheme."],
        "tips": tips,
        "next_steps": scheme["documents_required"] if eligible else [],
        "apply_link": scheme.get("apply_link", ""),
        "helpline": scheme.get("helpline", "")
    }
