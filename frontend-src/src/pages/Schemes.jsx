import { useState, useEffect, useMemo } from 'react'
import { schemesApi } from '../api/client'
import SkeletonCard from '../components/common/SkeletonCard'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  Star, ExternalLink, RefreshCw, MapPin, Leaf,
  IndianRupee, Users, Phone,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
]

const FARMING_TYPES = [
  { id: 'food_crops',       label: 'Food Crops',       icon: '🌾', desc: 'Wheat, Rice, Pulses, Oilseeds' },
  { id: 'horticulture',     label: 'Horticulture',      icon: '🥭', desc: 'Fruits, Vegetables, Spices' },
  { id: 'organic',          label: 'Organic Farming',  icon: '🌿', desc: 'Chemical-free, natural farming' },
  { id: 'animal_husbandry', label: 'Animal Husbandry', icon: '🐄', desc: 'Cows, Buffalo, Goats, Poultry' },
  { id: 'fisheries',        label: 'Fisheries',         icon: '🐟', desc: 'Fish, Shrimp, Aquaculture' },
  { id: 'sericulture',      label: 'Sericulture',       icon: '🐛', desc: 'Silk worm farming' },
  { id: 'floriculture',     label: 'Floriculture',      icon: '🌸', desc: 'Flowers, Ornamental plants' },
]

const NE_HILL_STATES = [
  'Himachal Pradesh','Uttarakhand','Jammu & Kashmir','Ladakh','Sikkim',
  'Arunachal Pradesh','Manipur','Meghalaya','Mizoram','Nagaland','Tripura','Assam',
]

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMES DATABASE
// ─────────────────────────────────────────────────────────────────────────────

const SCHEMES_DB = [
  {
    id: 'pm_kisan',
    name: 'PM-KISAN',
    full_name: 'Pradhan Mantri Kisan Samman Nidhi',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Direct Benefit',
    benefit_summary: '₹6,000/year in 3 direct bank installments',
    benefits: [
      '₹2,000 every 4 months (3 installments/year)',
      'Direct Bank Transfer — no middlemen',
      'All farmer families who cultivate land are eligible',
    ],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Land Records (Khasra/Khatauni)', 'Mobile Number'],
    helpline: '155261 / 011-24300606',
    link: 'https://pmkisan.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must own or cultivate land'); return { score: 0, reasons, disqualifiers: disq } }
      if (!p.has_bank_account) { disq.push('Bank account is required for DBT'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 55
      reasons.push('You cultivate land — primary eligibility met')
      if (p.aadhaar_linked) { score += 25; reasons.push('Aadhaar linked to bank — mandatory requirement satisfied') }
      else disq.push('Aadhaar must be linked to your bank account')
      if (p.land_acres <= 5) { score += 20; reasons.push('Small or marginal farmer — priority category') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Crop Insurance)',
    full_name: 'Pradhan Mantri Fasal Bima Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Insurance',
    benefit_summary: 'Crop insurance at just 1.5–5% premium — govt pays the rest',
    benefits: [
      'Kharif crops: only 2% premium from farmer',
      'Rabi crops: only 1.5% premium from farmer',
      'Horticulture/Commercial crops: 5% premium',
      'Full sum insured paid on natural calamity crop loss',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Passbook', 'Sowing Certificate from Patwari'],
    helpline: '1800-200-7710',
    link: 'https://pmfby.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must grow crops on land'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 45
      if (p.farming_types.some(t => ['food_crops', 'horticulture', 'organic', 'floriculture'].includes(t))) {
        score += 35; reasons.push('You grow crops — crop insurance directly applies')
      }
      if (p.has_bank_account) { score += 10; reasons.push('Bank account for insurance payout') }
      if (p.land_acres <= 2) { score += 10; reasons.push('Marginal farmer — special relief provisions apply') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    full_name: 'Kisan Credit Card Scheme',
    ministry: 'Ministry of Finance / NABARD',
    category: 'Credit & Loans',
    benefit_summary: 'Crop loans up to ₹3 lakh at just 4% effective interest',
    benefits: [
      'Up to ₹3 lakh without collateral at 4% effective rate',
      'Covers crop production, post-harvest & allied activities',
      'Personal accident insurance ₹50,000 included free',
      'Now extended to animal husbandry & fisheries too',
    ],
    documents: ['Aadhaar', 'PAN Card', 'Land Records', 'Bank Account', '2 Passport Photos'],
    helpline: '1800-11-2515 (NABARD)',
    link: 'https://www.nabard.org/kcc',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.has_bank_account) { disq.push('Bank account required to get KCC'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 40
      reasons.push('Bank account holder — can apply for KCC')
      if (p.land_type !== 'landless') { score += 20; reasons.push('Land cultivator — crop credit available') }
      if (['animal_husbandry', 'fisheries'].some(t => p.farming_types.includes(t))) {
        score += 20; reasons.push('KCC also covers livestock & fisheries — you qualify')
      }
      if (p.land_acres <= 5) { score += 15; reasons.push('Small farmer priority category') }
      if (p.annual_income <= 2) { score += 5; reasons.push('Low-income farmer — credit access especially valuable') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pm_maandhan',
    name: 'PM Kisan MaanDhan (Pension)',
    full_name: 'Pradhan Mantri Kisan Maandhan Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Pension',
    benefit_summary: '₹3,000/month pension after age 60 — govt matches your contribution',
    benefits: [
      '₹3,000/month guaranteed pension after age 60',
      'Government matches farmer contribution rupee-for-rupee',
      'Monthly contribution only ₹55–₹200 based on entry age',
      'Spouse pension of ₹1,500/month on death',
    ],
    documents: ['Aadhaar', 'Bank Passbook (savings/Jan Dhan)', 'Land Records'],
    helpline: '1800-267-6888',
    link: 'https://pmkmy.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.age < 18 || p.age > 40) { disq.push(`Entry age must be 18–40 years (you entered ${p.age})`); return { score: 0, reasons, disqualifiers: disq } }
      if (p.land_acres * 0.4047 > 2) { disq.push('Only for small/marginal farmers — land ≤ 2 hectares (≈5 acres)'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 65
      reasons.push(`Age ${p.age} is within the 18–40 entry window`)
      reasons.push('Land ≤ 5 acres — qualifies as small/marginal farmer')
      if (p.has_bank_account) { score += 20; reasons.push('Bank account needed for monthly contribution deduction') }
      if (p.annual_income <= 1.5) { score += 15; reasons.push('Lower income — pension will provide security after 60') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'midh',
    name: 'MIDH (Horticulture Mission)',
    full_name: 'Mission for Integrated Development of Horticulture',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Horticulture',
    benefit_summary: '50–100% subsidy on horticulture infrastructure, saplings & cold storage',
    benefits: [
      '50% subsidy on tissue culture saplings & hybrid seeds',
      'Protected cultivation (greenhouse/polyhouse) — 50% subsidy',
      'Cold storage & pack house — up to ₹10 lakh subsidy',
      'Enhanced support for North-East & hill states',
    ],
    documents: ['Land Records', 'Bank Account', 'Aadhaar', 'Project Report (for infrastructure)'],
    helpline: '011-23382480',
    link: 'https://midh.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('horticulture') && !p.farming_types.includes('floriculture')) {
        disq.push('Only for horticulture / floriculture farmers'); return { score: 0, reasons, disqualifiers: disq }
      }
      let score = 70
      reasons.push('Horticultural crop farmer — primary MIDH eligibility met')
      if (p.farming_types.includes('floriculture')) { score += 5; reasons.push('Floriculture also covered under MIDH') }
      if (NE_HILL_STATES.includes(p.state)) { score += 20; reasons.push(`${p.state} gets enhanced subsidy under MIDH NE/Hill component`) }
      if (p.land_acres <= 5) { score += 5; reasons.push('Small farmers get priority in subsidy allocation') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pkvy',
    name: 'PKVY (Organic Farming)',
    full_name: 'Paramparagat Krishi Vikas Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Organic',
    benefit_summary: '₹50,000/hectare over 3 years to adopt organic farming',
    benefits: [
      '₹50,000/ha over 3 years — ₹31,000 goes directly to farmer',
      'Free PGS-India organic certification',
      'Training, capacity building and organic input support',
      'Branding & marketing help for organic produce',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Account', 'Group of ≥10 farmers needed'],
    helpline: '1800-180-1551',
    link: 'https://pgsindia-ncof.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('organic')) { disq.push('For farmers practicing or switching to organic farming'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 70
      reasons.push('Organic farmer — directly eligible for PKVY subsidy')
      reasons.push('Form a cluster of ≥10 farmers to apply together')
      if (p.land_acres >= 1) { score += 15; reasons.push('Minimum ~1 acre required — you meet this') }
      if (p.annual_income <= 2) { score += 15; reasons.push('Organic premium pricing will significantly boost your income') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'smam',
    name: 'SMAM (Farm Machinery Subsidy)',
    full_name: 'Sub-Mission on Agricultural Mechanization',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Equipment',
    benefit_summary: '40–50% subsidy on tractors, harvesters & tillers',
    benefits: [
      '50% subsidy for SC/ST/women/small farmers',
      '40% subsidy for general category farmers',
      'Custom Hiring Center setup: 40% subsidy up to ₹25 lakh',
      'Farm Machinery Bank (group): up to 80% subsidy',
    ],
    documents: ['Aadhaar', 'Land Records', 'Caste Certificate (SC/ST)', 'Bank Account', 'Equipment Quotation'],
    helpline: '1800-180-1551',
    link: 'https://agrimachinery.nic.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must cultivate land to claim machinery subsidy'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 45
      reasons.push('Land cultivator — eligible for farm machinery subsidy')
      if (['sc', 'st'].includes(p.community)) { score += 30; reasons.push(`${p.community.toUpperCase()} category — enhanced 50% subsidy applies`) }
      else if (p.community === 'obc') { score += 15; reasons.push('OBC farmer — standard 40% subsidy') }
      else { score += 10; reasons.push('40% subsidy available for general category') }
      if (p.land_acres <= 2) { score += 15; reasons.push('Marginal farmer — priority in machinery allocation') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pmksy',
    name: 'PMKSY (Irrigation Subsidy)',
    full_name: 'Pradhan Mantri Krishi Sinchayee Yojana',
    ministry: 'Ministry of Jal Shakti / Agriculture',
    category: 'Irrigation',
    benefit_summary: 'Drip & sprinkler irrigation at 55–90% subsidy',
    benefits: [
      'Small/marginal farmers: up to 90% subsidy on micro-irrigation',
      'Other farmers: up to 55% subsidy',
      'Per Drop More Crop — drip & sprinkler systems covered',
      'Watershed development and water conservation support',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Account', 'Application to District Agriculture Office'],
    helpline: '1800-180-1551',
    link: 'https://pmksy.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must own or cultivate land'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 50
      reasons.push('Land cultivator — eligible for irrigation subsidy')
      if (p.land_acres <= 2) { score += 30; reasons.push('Marginal farmer (≤2 acres) — up to 90% subsidy') }
      else if (p.land_acres <= 5) { score += 18; reasons.push('Small farmer (≤5 acres) — enhanced subsidy rate') }
      if (['sc', 'st'].includes(p.community)) { score += 10; reasons.push(`${p.community.toUpperCase()} community — additional priority`) }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pm_matsya',
    name: 'PM Matsya Sampada (Fisheries)',
    full_name: 'Pradhan Mantri Matsya Sampada Yojana',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Fisheries',
    benefit_summary: '40–60% subsidy for fish farming — ponds, cages, boats & nets',
    benefits: [
      '60% subsidy for SC/ST/women fish farmers',
      '40% subsidy for general category',
      'Pond construction, cage culture, biofloc systems covered',
      'Boat & fishing net subsidy for marine fishers',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Land/Water Body Records', 'Caste Certificate (if applicable)'],
    helpline: '1800-425-1660',
    link: 'https://pmmsy.dof.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('fisheries')) { disq.push('Only for fisheries / aquaculture farmers'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 65
      reasons.push('Fisheries farmer — directly eligible for PM Matsya Sampada')
      if (['sc', 'st'].includes(p.community)) { score += 25; reasons.push(`${p.community.toUpperCase()} fisher — enhanced 60% subsidy vs 40% for others`) }
      if (p.has_bank_account) { score += 10; reasons.push('Bank account for subsidy transfer ready') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'nlm',
    name: 'National Livestock Mission (NLM)',
    full_name: 'National Livestock Mission',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Animal Husbandry',
    benefit_summary: '50% subsidy (up to ₹25 lakh) for livestock enterprise development',
    benefits: [
      '50% subsidy for setting up livestock/poultry enterprise',
      'Fodder and feed development support',
      'Livestock insurance coverage',
      'Breed improvement and technical training',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Project Report', 'Land Documents'],
    helpline: '011-23389928',
    link: 'https://nlm.udyamimitra.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('animal_husbandry')) { disq.push('Only for livestock / animal husbandry farmers'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 65
      reasons.push('Animal husbandry farmer — directly eligible for NLM')
      if (p.annual_income <= 1.5) { score += 15; reasons.push('Lower income group — priority in livestock subsidy') }
      if (['sc', 'st', 'obc'].includes(p.community)) { score += 20; reasons.push(`${p.community.toUpperCase()} community — priority allocation in NLM`) }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'rgm',
    name: 'Rashtriya Gokul Mission',
    full_name: 'Rashtriya Gokul Mission (Indigenous Cattle)',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Animal Husbandry',
    benefit_summary: 'Free AI at doorstep + breed improvement for indigenous cows',
    benefits: [
      'Free Artificial Insemination (AI) at your doorstep',
      'Development & conservation of indigenous cattle breeds',
      'Gokul Gram integrated cattle development centers',
      'Milk production training and enhancement',
    ],
    documents: ['Aadhaar', 'Cattle Ownership Proof'],
    helpline: '011-23389928',
    link: 'https://dahd.nic.in/gokul',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('animal_husbandry')) { return { score: 0, reasons, disqualifiers: ['Only for cattle / dairy farmers'] } }
      let score = 60
      reasons.push('Cattle/dairy farmer — eligible for free AI & breed improvement')
      if (p.annual_income <= 2) { score += 20; reasons.push('Programme especially beneficial for small dairy farmers') }
      return { score, reasons, disqualifiers: disq }
    },
  },
  {
    id: 'enam',
    name: 'e-NAM (Online Market)',
    full_name: 'Electronic National Agriculture Market',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Market',
    benefit_summary: 'Sell produce online across India — better prices, no middlemen',
    benefits: [
      'Pan-India online platform for 200+ commodities',
      'Transparent price discovery via live e-auction',
      'Payment directly to bank within 24 hours',
      'Zero registration fee for farmers',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Mobile Number'],
    helpline: '1800-270-0224',
    link: 'https://enam.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { return { score: 0, reasons, disqualifiers: ['Must have produce to sell'] } }
      let score = 55
      reasons.push('Farmer with produce — can register on e-NAM for free')
      if (p.has_bank_account) { score += 25; reasons.push('Bank account needed for payment — you have it') }
      if (p.farming_types.some(t => ['food_crops', 'horticulture', 'floriculture', 'organic'].includes(t))) {
        score += 20; reasons.push('Your crop types are actively traded on e-NAM')
      }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'soil_health_card',
    name: 'Soil Health Card Scheme',
    full_name: 'Soil Health Card Scheme',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Subsidy',
    benefit_summary: 'Free soil testing + personalised fertilizer advice every 2 years',
    benefits: [
      'Free testing of 12 soil parameters (pH, NPK, micronutrients)',
      'Customised fertilizer recommendations per crop',
      'Reduces over-fertilization → saves money',
      'Issued every 2 years for all farm holdings',
    ],
    documents: ['Aadhaar', 'Land Records', 'Mobile Number'],
    helpline: '1800-180-1551',
    link: 'https://soilhealth.dac.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { return { score: 0, reasons, disqualifiers: ['Must cultivate land'] } }
      let score = 88
      reasons.push('Universal scheme — every land cultivator is eligible')
      if (p.farming_types.includes('organic')) { score = 100; reasons.push('Essential for organic transition — know exact soil status') }
      else if (p.land_acres <= 5) { score = Math.max(score, 90); reasons.push('Small farmer — soil card helps optimise limited inputs') }
      return { score, reasons, disqualifiers: disq }
    },
  },
  {
    id: 'miss',
    name: 'Interest Subvention (MISS)',
    full_name: 'Modified Interest Subvention Scheme',
    ministry: 'Ministry of Agriculture / RBI',
    category: 'Credit & Loans',
    benefit_summary: 'Crop loans at only 4% effective interest for timely repayment',
    benefits: [
      'Short-term crop loans at 7% (2% subvention from Govt)',
      'Extra 3% incentive for prompt repayment → effective 4%',
      'Covers all food crops, horticulture, allied activities',
      'Auto-applied if you have a KCC at any bank',
    ],
    documents: ['KCC or Bank Account', 'Aadhaar', 'Land Records'],
    helpline: '1800-11-2515 (NABARD)',
    link: 'https://www.nabard.org',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.has_bank_account) { return { score: 0, reasons, disqualifiers: ['Bank account required'] } }
      if (p.land_type === 'landless') { return { score: 0, reasons, disqualifiers: ['Crop cultivation required'] } }
      let score = 60
      reasons.push('Active farmer with bank account — eligible for interest subvention')
      if (p.land_acres <= 5) { score += 25; reasons.push('Small farmer — effective 4% rate significantly cuts your borrow cost') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'nfsm',
    name: 'NFSM (Food Security Mission)',
    full_name: 'National Food Security Mission',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Subsidy',
    benefit_summary: 'Free/subsidized HYV seeds + demos for rice, wheat, pulses, oilseeds',
    benefits: [
      'Subsidized or free certified high-yielding variety seeds',
      'Farm machinery demonstration and subsidy',
      'On-farm cluster demonstrations for better practices',
      'Covers rice, wheat, pulses, coarse cereals, nutri-cereals',
    ],
    documents: ['Aadhaar', 'Land Records', 'Application to District Agriculture Officer'],
    helpline: '1800-180-1551',
    link: 'https://nfsm.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('food_crops')) { return { score: 0, reasons, disqualifiers: ['Only for food grain farmers (rice, wheat, pulses, oilseeds)'] } }
      let score = 65
      reasons.push('Food crop farmer — eligible for NFSM seeds and input subsidies')
      if (p.land_acres <= 5) { score += 25; reasons.push('Small & marginal farmers get priority in input distribution') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'wadi_trifood',
    name: 'WADI / TRIFOOD (Tribal)',
    full_name: 'Tribal Sub-Plan / TRIFOOD Scheme',
    ministry: 'Ministry of Tribal Affairs / TRIFED',
    category: 'Horticulture',
    benefit_summary: 'Free horticulture inputs + MSP for minor forest produce (ST only)',
    benefits: [
      'Free horticulture inputs for ST farmers',
      'Minimum Support Price for Minor Forest Produce (MFP)',
      'TRIFOOD processing unit — value addition support',
      'Van Dhan Vikas Kendras — marketing and training help',
    ],
    documents: ['Tribal (ST) Certificate', 'Aadhaar', 'Bank Account'],
    helpline: '1800-425-3465 (TRIFED)',
    link: 'https://trifed.tribal.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.community !== 'st') { return { score: 0, reasons, disqualifiers: ['Exclusively for Scheduled Tribe (ST) farmers'] } }
      let score = 78
      reasons.push('ST community — directly eligible for tribal agricultural schemes')
      if (p.farming_types.some(t => ['horticulture', 'food_crops', 'organic'].includes(t))) {
        score += 22; reasons.push('Forest-based horticulture and food crops fully supported')
      }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'sericulture_scheme',
    name: 'Silk Samagra (Sericulture)',
    full_name: 'Silk Samagra — Central Silk Board',
    ministry: 'Ministry of Textiles — Central Silk Board',
    category: 'Subsidy',
    benefit_summary: '75–90% subsidy on mulberry plantation and silkworm equipment',
    benefits: [
      '90% subsidy for tribal / BPL sericulture farmers',
      '75% subsidy for other farmers',
      'Free silkworm layings (eggs) in some states',
      'Technical training and silk reeling equipment support',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Account', 'Caste Certificate (if applicable)'],
    helpline: '080-26282059 (CSB)',
    link: 'https://csb.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('sericulture')) { return { score: 0, reasons, disqualifiers: ['Only for silk worm / sericulture farmers'] } }
      let score = 70
      reasons.push('Sericulture farmer — directly eligible for Silk Samagra')
      if (['sc', 'st'].includes(p.community)) { score += 25; reasons.push(`${p.community.toUpperCase()} farmer gets higher 75–90% subsidy rate`) }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// ELIGIBILITY ENGINE
// ─────────────────────────────────────────────────────────────────────────────

// Match functions keyed by scheme ID — normalise hyphens to underscores for API IDs
const MATCH_FNS = Object.fromEntries(
  SCHEMES_DB.map(s => [s.id, s.matchFn])
)

function computeMatches(profile, schemesData) {
  return schemesData
    .map(s => {
      const fn = MATCH_FNS[s.id] || MATCH_FNS[s.id?.replace(/-/g, '_')]
      const r = fn
        ? fn(profile)
        : { score: 50, reasons: ['May be applicable to your profile'], disqualifiers: [] }
      return { ...s, score: r.score, reasons: r.reasons, disqualifiers: r.disqualifiers }
    })
    .sort((a, b) => b.score - a.score)
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ['Location & Land', 'Your Profile', 'Farming Type', 'Results']

function StepIndicator({ current }) {
  return (
    <div className="flex items-start">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-start flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 min-w-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
              i < current ? 'bg-primary text-black'
              : i === current ? 'bg-primary/15 border-2 border-primary text-primary'
              : 'bg-surface-2 text-text-3 border border-border'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium text-center leading-tight ${i === current ? 'text-primary' : 'text-text-3'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mt-3.5 transition-all ${i < current ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────────────────────────────────────

const BADGE_COLORS = {
  'Direct Benefit':   'bg-primary/15 text-primary',
  'Insurance':        'bg-blue-500/15 text-blue-400',
  'Credit & Loans':   'bg-amber-500/15 text-amber-400',
  'Pension':          'bg-purple-500/15 text-purple-400',
  'Horticulture':     'bg-emerald-500/15 text-emerald-400',
  'Organic':          'bg-green-500/15 text-green-400',
  'Equipment':        'bg-orange-500/15 text-orange-400',
  'Irrigation':       'bg-cyan-500/15 text-cyan-400',
  'Fisheries':        'bg-sky-600/15 text-sky-300',
  'Animal Husbandry': 'bg-orange-600/15 text-orange-300',
  'Market':           'bg-yellow-500/15 text-yellow-400',
  'Subsidy':          'bg-teal-500/15 text-teal-400',
}

function scoreStyle(score) {
  if (score >= 80) return { ring: 'ring-primary/40', bg: 'bg-primary/10', text: 'text-primary', label: 'High Match', bar: 'bg-primary' }
  if (score >= 55) return { ring: 'ring-amber-400/40', bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'Good Match', bar: 'bg-amber-400' }
  return { ring: 'ring-slate-500/20', bg: 'bg-surface-2', text: 'text-text-3', label: 'Partial', bar: 'bg-slate-500' }
}

function MatchCard({ scheme, rank }) {
  const [open, setOpen] = useState(false)
  const sc = scoreStyle(scheme.score)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(rank * 0.05, 0.4) }}
      className={`card p-4 ring-1 ${sc.ring}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl ${sc.bg} flex flex-col items-center justify-center shrink-0 ring-1 ${sc.ring}`}>
          <span className={`text-base font-bold leading-none ${sc.text}`}>{scheme.score}%</span>
          <span className={`text-[9px] ${sc.text} leading-none mt-0.5`}>{sc.label}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[scheme.category] || 'bg-surface-2 text-text-3'}`}>
              {scheme.category}
            </span>
          </div>
          <h3 className="font-display text-text-1 font-bold text-sm leading-tight">{scheme.name}</h3>
          <p className="text-text-3 text-[11px] leading-tight">{scheme.full_name}</p>
        </div>
        <button onClick={() => setOpen(o => !o)} className="btn-icon shrink-0 text-text-3 text-xs">
          {open ? '▲' : '▼'}
        </button>
      </div>

      <div className="mt-2.5 h-1 bg-surface-2 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${sc.bar}`}
          initial={{ width: 0 }} animate={{ width: `${scheme.score}%` }}
          transition={{ duration: 0.8, delay: rank * 0.05, ease: 'easeOut' }} />
      </div>

      <p className="text-text-2 text-sm mt-2 flex items-center gap-1.5">
        <IndianRupee size={11} className="text-primary shrink-0" />{scheme.benefit_summary}
      </p>

      {scheme.reasons?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {scheme.reasons.map((r, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] text-primary bg-primary/8 border border-primary/15 rounded-full px-2 py-0.5">
              <CheckCircle2 size={9} /> {r}
            </span>
          ))}
        </div>
      )}
      {scheme.disqualifiers?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {scheme.disqualifiers.map((d, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] text-red-400 bg-red-500/8 border border-red-500/15 rounded-full px-2 py-0.5">
              <XCircle size={9} /> {d}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-border space-y-3">
              <div>
                <p className="text-text-3 text-[10px] font-semibold uppercase tracking-wide mb-1.5">Key Benefits</p>
                <ul className="space-y-1">
                  {scheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-2 text-sm">
                      <span className="text-primary mt-0.5 shrink-0">•</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-text-3 text-[10px] font-semibold uppercase tracking-wide mb-1.5">Documents Needed</p>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documents.map((d, i) => (
                    <span key={i} className="text-xs bg-surface-2 text-text-2 px-2 py-0.5 rounded-lg border border-border">{d}</span>
                  ))}
                </div>
              </div>
              <p className="text-text-3 text-[10px]">{scheme.ministry}</p>
              <div className="flex items-center gap-3 pt-0.5">
                {scheme.helpline && (
                  <span className="text-text-3 text-xs flex items-center gap-1">
                    <Phone size={11} className="text-emerald-400" /> {scheme.helpline}
                  </span>
                )}
                {scheme.link && (
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                    Apply Online <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKBOX HELPER
// ─────────────────────────────────────────────────────────────────────────────

function CheckBox({ checked, onChange, label }) {
  return (
    <button type="button" onClick={onChange}
      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${checked ? 'border-primary bg-primary/8' : 'border-border bg-surface hover:border-border-strong'}`}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-primary border-primary' : 'border-border'}`}>
        {checked && <span className="text-black text-[9px] font-bold">✓</span>}
      </div>
      <span className="text-text-2 text-xs">{label}</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const defaultProfile = {
  state: '', land_acres: '', land_type: 'owned',
  community: 'general', annual_income: '', age: '',
  has_bank_account: true, aadhaar_linked: true,
  farming_types: [],
}


export default function Schemes() {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(defaultProfile)
  const [showAll, setShowAll] = useState(false)
  const [filterCat, setFilterCat] = useState('all')
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    schemesApi.list()
      .then(res => {
        const mapped = (res.schemes || []).map(s => ({
          ...s,
          full_name:       s.name_hindi         || '',
          benefit_summary: s.description        || '',
          documents:       s.documents_required || [],
          link:            s.apply_link          || '',
        }))
        setSchemes(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key, val) { setProfile(p => ({ ...p, [key]: val })) }
  function toggleFarming(id) {
    setProfile(p => ({
      ...p,
      farming_types: p.farming_types.includes(id)
        ? p.farming_types.filter(x => x !== id)
        : [...p.farming_types, id],
    }))
  }

  const canNext0 = profile.state && profile.land_acres !== '' && profile.land_type
  const canNext1 = profile.community && profile.annual_income !== '' && profile.age !== ''
  const canNext2 = profile.farming_types.length > 0

  const matches = useMemo(() => {
    if (step < 3) return []
    const p = {
      ...profile,
      land_acres: parseFloat(profile.land_acres) || 0,
      annual_income: parseFloat(profile.annual_income) || 0,
      age: parseInt(profile.age) || 30,
    }
    return computeMatches(p, schemes)
  }, [step, profile, schemes])

  const eligibleMatches = matches.filter(m => m.score >= 50)
  const partialMatches  = matches.filter(m => m.score > 0 && m.score < 50)
  const allCategories   = ['all', ...new Set(schemes.map(s => s.category))]
  const displayMatches  = (showAll ? matches : (eligibleMatches.length > 0 ? eligibleMatches : matches))
    .filter(m => filterCat === 'all' || m.category === filterCat)

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Govt Scheme Finder</h1>
        <p className="text-text-3 text-sm mt-0.5">Answer a few questions — see every scheme you qualify for</p>
      </header>

      {step < 3 && (
        <div className="card p-4">
          <StepIndicator current={step} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 0 */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-5 space-y-4">
            <h2 className="font-display text-text-1 font-semibold flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Location &amp; Land
            </h2>
            <div>
              <label htmlFor="sc-state" className="text-text-3 text-xs font-medium block mb-1.5">State / UT *</label>
              <select id="sc-state" className="input w-full" value={profile.state} onChange={e => set('state', e.target.value)}>
                <option value="">Select your state...</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sc-land-acres" className="text-text-3 text-xs font-medium block mb-1.5">Land you farm (acres) *</label>
                <input id="sc-land-acres" className="input w-full" type="number" min="0" step="0.5" placeholder="e.g. 2.5"
                  value={profile.land_acres} onChange={e => set('land_acres', e.target.value)} />
                <p className="text-text-3 text-[10px] mt-1">Enter 0 if landless / labourer</p>
              </div>
              <div>
                <label htmlFor="sc-land-type" className="text-text-3 text-xs font-medium block mb-1.5">Land ownership *</label>
                <select id="sc-land-type" className="input w-full" value={profile.land_type} onChange={e => set('land_type', e.target.value)}>
                  <option value="owned">I own it</option>
                  <option value="tenant">Tenant / Lease</option>
                  <option value="sharecropper">Sharecropper</option>
                  <option value="landless">Landless labourer</option>
                </select>
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={!canNext0} onClick={() => setStep(1)}>
              Next <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-5 space-y-4">
            <h2 className="font-display text-text-1 font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary" /> Your Profile
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sc-community" className="text-text-3 text-xs font-medium block mb-1.5">Community / Category *</label>
                <select id="sc-community" className="input w-full" value={profile.community} onChange={e => set('community', e.target.value)}>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                  <option value="minority">Minority</option>
                </select>
              </div>
              <div>
                <label htmlFor="sc-age" className="text-text-3 text-xs font-medium block mb-1.5">Your age *</label>
                <input id="sc-age" className="input w-full" type="number" min="18" max="80" placeholder="e.g. 34"
                  value={profile.age} onChange={e => set('age', e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="sc-income" className="text-text-3 text-xs font-medium block mb-1.5">Annual family income *</label>
              <select id="sc-income" className="input w-full" value={profile.annual_income} onChange={e => set('annual_income', e.target.value)}>
                <option value="">Select range...</option>
                <option value="0.5">Below Rs.50,000</option>
                <option value="1">Rs.50,000 to Rs.1 Lakh</option>
                <option value="1.5">Rs.1 to 1.5 Lakh</option>
                <option value="2">Rs.1.5 to 2 Lakh</option>
                <option value="3">Rs.2 to 3 Lakh</option>
                <option value="5">Rs.3 to 5 Lakh</option>
                <option value="10">Above Rs.5 Lakh</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className={'card p-3 flex items-center gap-2 cursor-pointer transition-all ' + (profile.has_bank_account ? 'border-primary bg-primary/5' : '')}
                onClick={() => set('has_bank_account', !profile.has_bank_account)}>
                <div className={'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ' + (profile.has_bank_account ? 'bg-primary border-primary' : 'border-border')}>
                  {profile.has_bank_account && <span className="text-black text-[9px] font-bold">v</span>}
                </div>
                <span className="text-text-2 text-xs">Have bank account</span>
              </label>
              <label className={'card p-3 flex items-center gap-2 cursor-pointer transition-all ' + (profile.aadhaar_linked ? 'border-primary bg-primary/5' : '')}
                onClick={() => set('aadhaar_linked', !profile.aadhaar_linked)}>
                <div className={'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ' + (profile.aadhaar_linked ? 'bg-primary border-primary' : 'border-border')}>
                  {profile.aadhaar_linked && <span className="text-black text-[9px] font-bold">v</span>}
                </div>
                <span className="text-text-2 text-xs">Aadhaar linked to bank</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2" onClick={() => setStep(0)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!canNext1} onClick={() => setStep(2)}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-5 space-y-4">
            <h2 className="font-display text-text-1 font-semibold flex items-center gap-2">
              <Leaf size={16} className="text-primary" /> What do you farm?
              <span className="text-text-3 text-xs font-normal">(select all that apply)</span>
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {FARMING_TYPES.map(ft => {
                const sel = profile.farming_types.includes(ft.id)
                return (
                  <button key={ft.id} onClick={() => toggleFarming(ft.id)}
                    className={'p-3 rounded-xl border text-left transition-all ' + (sel ? 'border-primary bg-primary/8' : 'border-border bg-surface hover:border-border-strong')}>
                    <span className="text-xl">{ft.icon}</span>
                    <p className={'text-sm font-semibold mt-1 ' + (sel ? 'text-primary' : 'text-text-1')}>{ft.label}</p>
                    <p className="text-text-3 text-[10px] leading-snug">{ft.desc}</p>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!canNext2} onClick={() => setStep(3)}>
                Find My Schemes <Star size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Results */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="card p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-text-1 font-semibold">
                  {eligibleMatches.length} scheme{eligibleMatches.length !== 1 ? 's' : ''} you likely qualify for
                </p>
                <p className="text-text-3 text-xs mt-0.5 truncate">
                  {profile.state} &middot; {profile.land_acres} acres &middot; {profile.community.toUpperCase()} &middot;{' '}
                  {profile.farming_types.map(f => FARMING_TYPES.find(x => x.id === f)?.label).join(', ')}
                </p>
              </div>
              <button className="btn-icon shrink-0"
                onClick={() => { setStep(0); setProfile(defaultProfile); setShowAll(false); setFilterCat('all') }}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {allCategories.map(c => (
                <button key={c} onClick={() => setFilterCat(c)}
                  className={'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' + (filterCat === c ? 'bg-primary text-black' : 'bg-surface-2 text-text-3 hover:text-text-2')}>
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map(i => <SkeletonCard key={i} rows={3} />)}
              </div>
            ) : displayMatches.length === 0 ? (
              <div className="card p-10 text-center text-text-3 text-sm">No schemes in this category match your profile</div>
            ) : (
              <div className="space-y-3">{displayMatches.map((s, i) => <MatchCard key={s.id} scheme={s} rank={i} />)}</div>
            )}

            {eligibleMatches.length > 0 && partialMatches.length > 0 && !showAll && (
              <button className="w-full text-sm text-text-3 py-3 hover:text-text-2 transition-colors border border-dashed border-border rounded-xl"
                onClick={() => setShowAll(true)}>
                + Show {partialMatches.length} partial matches too
              </button>
            )}

            <p className="text-text-3 text-xs text-center pb-4">
              Source: Ministry of Agriculture &amp; Farmers Welfare, GOI &middot; Updated 2025 &middot; Verify eligibility with your local agriculture office
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
