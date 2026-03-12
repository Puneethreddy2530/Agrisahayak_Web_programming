import axios from 'axios'
import { cacheResponse, getCachedResponse } from './idb'

const API_BASE = '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

function clearAuthAndRedirect(message = 'Session expired. Please log in again.') {
  localStorage.removeItem('authToken')
  localStorage.removeItem('farmer')
  localStorage.removeItem('cropCycles')
  window.dispatchEvent(new CustomEvent('auth:logout'))
  if (window.location.pathname !== '/profile') {
    window.location.href = '/profile'
  }
  throw new Error(message)
}

function readErrorDetail(err, status) {
  if (Array.isArray(err?.detail)) {
    return err.detail.map((e) => e.msg || JSON.stringify(e)).join('; ')
  }
  if (typeof err?.detail === 'string') {
    return err.detail
  }
  return `HTTP ${status}`
}

function isAuthFailure(status, detail) {
  if (status === 401) return true
  if (status !== 403) return false
  const msg = String(detail || '').toLowerCase()
  return msg.includes('token') || msg.includes('not authenticated') || msg.includes('credentials')
}

// Wraps an axios request config with exponential-backoff retry.
// 4xx errors are never retried. Back-off delays: 1 s, 2 s, 4 s.
async function apiRequestWithRetry(requestConfig, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiClient.request(requestConfig)
    } catch (err) {
      const status = err?.response?.status
      // Client errors (4xx) — throw immediately, no retry
      if (status !== undefined && status >= 400 && status < 500) throw err
      // Last attempt — propagate whatever error we have
      if (attempt === maxRetries - 1) throw err
      // Exponential back-off: 1 s → 2 s → 4 s
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
}

async function apiRequest(
  path,
  { method = 'GET', headers = {}, body = undefined, tokenOverride = undefined, redirectOnAuthFailure = true } = {},
) {
  const token = tokenOverride ?? localStorage.getItem('authToken')
  const isMultipart = typeof FormData !== 'undefined' && body instanceof FormData

  const requestHeaders = {
    ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }

  try {
    const response = await apiRequestWithRetry(
      { url: path, method, headers: requestHeaders, data: body, timeout: isMultipart ? 60000 : 30000 },
      isMultipart ? 1 : 3,   // no retry for file uploads
    )
    const data = response.data
    if (method === 'GET') cacheResponse(path, data)
    return data
  } catch (error) {
    if (error?.response) {
      const status = error.response.status
      const detail = readErrorDetail(error.response.data, status)
      if (redirectOnAuthFailure && isAuthFailure(status, detail)) {
        clearAuthAndRedirect('Session expired. Please log in again.')
      }
      if (status === 500) throw new Error('Server error. Please try again.')
      throw new Error(detail || `HTTP ${status}`)
    }

    if (error?.request) {
      if (method === 'GET') {
        const entry = await getCachedResponse(path)
        if (entry) {
          window.dispatchEvent(
            new CustomEvent('api:cache-hit', { detail: { url: path, cachedAt: entry.timestamp } })
          )
          return entry.data
        }
      }
      throw new Error('Network error. Please check your connection.')
    }

    throw new Error(error?.message || 'Request failed')
  }
}

// Core request wrapper
async function apiFetch(path, options = {}) {
  return apiRequest(path, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
  })
}

// Multipart (file upload)
async function apiUpload(path, formData) {
  return apiRequest(path, {
    method: 'POST',
    body: formData,
  })
}

// Fetch with explicit admin token (bypasses localStorage token)
async function apiFetchAdmin(path, adminToken, options = {}) {
  return apiRequest(path, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
    tokenOverride: adminToken,
    redirectOnAuthFailure: false,
  })
}

// Auth
export const authApi = {
  // username + password login
  login: (username, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  // Full registration: name, phone, username, password, state, district, language
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  // OTP flow
  requestOtp: (phone) =>
    apiFetch('/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) =>
    apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  me: () => apiFetch('/auth/me'),
  adminLogin: (adminId, password, district = 'Demo District') =>
    apiFetch('/auth/admin/login', { method: 'POST', body: JSON.stringify({ admin_id: adminId, password, district }) }),
  changePassword: (data) =>
    apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
}

// â”€â”€ Farmer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const farmerApi = {
  getMe: () => apiFetch('/farmer/me'),
  getProfile: (id) => apiFetch(`/farmer/profile/${id}`),
  update: (id, data) => apiFetch(`/farmer/profile/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getLands: (farmerId) => apiFetch(`/farmer/land/farmer/${farmerId}`).then(res => Array.isArray(res) ? res : (res.lands || [])),
  addLand: (data) => apiFetch('/farmer/land/register', { method: 'POST', body: JSON.stringify(data) }),
}

// â”€â”€ Weather â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const weatherApi = {
  getIntelligence: (lat, lon, crop) =>
    apiFetch(`/weather/intelligence?lat=${lat}&lon=${lon}${crop ? `&crop=${crop}` : ''}`),
  getRiskAnalysis: (lat, lon, crop) =>
    apiFetch(`/weather/risk-analysis?lat=${lat}&lon=${lon}${crop ? `&crop=${crop}` : ''}`),
  getSpraySchedule: (lat, lon, days = 5) =>
    apiFetch(`/weather/spray-schedule?lat=${lat}&lon=${lon}&days=${days}`),
}

// â”€â”€ Market â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const marketApi = {
  getPrices: (commodity, state) =>
    apiFetch(`/market/prices?commodity=${commodity}${state ? `&state=${state}` : ''}`),
  getTrends: (commodity) => apiFetch(`/market/trends?commodity=${commodity}`),
}

// â”€â”€ Disease Detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const diseaseApi = {
  detect: (formData) => apiUpload('/disease/detect', formData),
  getHistory: (limit = 10) => apiFetch(`/disease/history?limit=${limit}`),
  deleteHistory: (id) => apiFetch(`/disease/history/${id}`, { method: 'DELETE' }),
  getDiseases: () => apiFetch('/disease/diseases'),
  getDisease: (id) => apiFetch(`/disease/diseases/${id}`),
}

// â”€â”€ Pest Detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const pestApi = {
  detect: (formData) => apiUpload('/pest/detect', formData),
}

// â”€â”€ Crop Cycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const cropCycleApi = {
  start: (data) => apiFetch('/cropcycle/start', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id) => apiFetch(`/cropcycle/${id}`),
  getLandCycles: (landId) => apiFetch(`/cropcycle/land/${landId}`),
  listActive: async () => {
    const res = await apiFetch('/cropcycle/all/active')
    if (res?.message?.toLowerCase().includes('no lands')) {
      const err = new Error(res.message)
      err.noLands = true
      throw err
    }
    return Array.isArray(res) ? res : (res.cycles || [])
  },
  logActivity: (cycleId, data) =>
    apiFetch(`/cropcycle/${cycleId}/activity`, { method: 'POST', body: JSON.stringify(data) }),
  complete: (cycleId) =>
    apiFetch(`/cropcycle/${cycleId}/complete`, { method: 'POST', body: JSON.stringify({}) }),
}

// â”€â”€ Chatbot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const chatApi = {
  send: (question, language = 'english', context = null) =>
    apiFetch('/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({ question, language, output_language: language, context, use_history: false }),
    }),
  status: () => apiFetch('/chatbot/health'),
  getHistory: (farmerId) => apiFetch(`/chatbot/history/${farmerId}`),
  deleteHistory: (farmerId) => apiFetch(`/chatbot/history/${farmerId}`, { method: 'DELETE' }),
  quickResponses: () => apiFetch('/chatbot/quick-responses'),
}

// â”€â”€ Fertilizer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fertilizerApi = {
  // crop is query param, SoilInput {nitrogen, phosphorus, potassium, ph} is body
  recommend: (crop, soil) =>
    apiFetch(`/fertilizer/recommend?crop=${encodeURIComponent(crop)}`, { method: 'POST', body: JSON.stringify(soil) }),
}

// â”€â”€ Crop Advisor (Recommendation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const cropApi = {
  recommend: (data) => apiFetch('/crop/recommend', { method: 'POST', body: JSON.stringify(data) }),
  predictYield: (data) => apiFetch('/crop/predict-yield', { method: 'POST', body: JSON.stringify(data) }),
  getCrops: () => apiFetch('/crop/crops'),
  getSeasons: () => apiFetch('/crop/seasons'),
  getDistrictAverages: (state, district) => {
    const params = new URLSearchParams()
    if (state) params.set('state', state)
    if (district) params.set('district', district)
    return apiFetch(`/crop/district-averages?${params}`)
  },
}

// â”€â”€ Analytics (DuckDB) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const analyticsApi = {
  getDiseaseHeatmap: (days = 30) => apiFetch(`/analytics/disease-heatmap?days=${days}`),
  getDiseaseTrends: (days = 90) => apiFetch(`/analytics/disease-trends?days=${days}`),
  getDiseaseByCrop: (days = 30) => apiFetch(`/analytics/disease-by-crop?days=${days}`),
  getDiseaseByeCrop: (days = 30) => apiFetch(`/analytics/disease-by-crop?days=${days}`), // kept for compat
  getOutbreakAlerts: (threshold = 10, days = 7) =>
    apiFetch(`/analytics/outbreak-alerts?threshold=${threshold}&days=${days}`),
  getSeasonalPatterns: (days = 365) => apiFetch(`/analytics/seasonal-patterns?days=${days}`),
  getYieldSummary: () => apiFetch('/analytics/yield-summary'),
  getDistrictHealth: (district) =>
    apiFetch(`/analytics/district-health/${encodeURIComponent(district)}`),
}

// â”€â”€ Complaints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Backend ComplaintCreate: { category, subject, description, urgency?, photo? }
// Valid categories: water, seeds, fertilizer, pests, market, subsidy, land, equipment, other
// Valid urgencies: low, medium, high, critical
export const complaintsApi = {
  submit: (data) => apiFetch('/complaints/', { method: 'POST', body: JSON.stringify(data) }),
  getMine: () => apiFetch('/complaints/my'),
  getById: (id) => apiFetch(`/complaints/${id}`),
  getAdminAll: () => apiFetch('/complaints/admin/all'),
  updateAdmin: (id, data) =>
    apiFetch(`/complaints/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

// â”€â”€ Expense â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const expenseApi = {
  estimate: (data) => apiFetch('/expense/estimate', { method: 'POST', body: JSON.stringify(data) }),
  getReferenceCosts: (crop) =>
    apiFetch(`/expense/reference-costs/${encodeURIComponent(crop)}`),
  getMarketPrices: () => apiFetch('/expense/market-prices'),
  compare: (scenarios) =>
    apiFetch('/expense/compare', { method: 'POST', body: JSON.stringify(scenarios) }),
}

// â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const dashboardApi = {
  get: (farmerId) => apiFetch(`/dashboard/?farmer_id=${farmerId}`),
  getQuick: (farmerId) => apiFetch(`/dashboard/quick?farmer_id=${farmerId}`),
  getInsights: (farmerId) => apiFetch(`/dashboard/insights?farmer_id=${farmerId}`),
  getNotifications: (farmerId) => apiFetch(`/dashboard/notifications?farmer_id=${farmerId}`),
}

// â”€â”€ Schemes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const schemesApi = {
  list: ({ category, search } = {}) => {
    const params = new URLSearchParams()
    if (category && category !== 'all') params.append('category', category)
    if (search) params.append('search', search)
    const q = params.toString()
    return apiFetch(`/schemes/list${q ? '?' + q : ''}`)
  },
  get: (id) => apiFetch(`/schemes/${id}`),
  checkEligibility: (id, landSize, farmerType) =>
    apiFetch(`/schemes/eligibility-check/${id}?land_size=${landSize}&farmer_type=${farmerType}`),
}

// â”€â”€ Outbreak Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const outbreakMapApi = {
  getClusters: (days = 30) => apiFetch(`/outbreak-map/clusters?days=${days}`),
  getAlerts: (days = 7, threshold = 50) =>
    apiFetch(`/outbreak-map/alerts?days=${days}&severity_threshold=${threshold}`),
  getPoints: (days = 30, state = null) =>
    apiFetch(`/outbreak-map/points?days=${days}${state ? `&state=${encodeURIComponent(state)}` : ''}`),
  getStateSummary: (days = 30) => apiFetch(`/outbreak-map/state-summary?days=${days}`),
  seedDemoData: (count = 1000) =>
    apiFetch(`/outbreak-map/seed-demo-data?count=${count}`, { method: 'POST' }),
}

// â”€â”€ Admin (composite dashboard using admin token) â”€â”€â”€â”€â”€
export const adminApi = {
  login: (adminId, password, district = 'Demo District') =>
    apiFetch('/auth/admin/login', { method: 'POST', body: JSON.stringify({ admin_id: adminId, password, district }) }),
  getDashboard: async (adminToken, days = 30) => {
    const [usersRes, alertsRes, complaintsRes, trendsRes] = await Promise.allSettled([
      apiFetchAdmin('/auth/admin/users?limit=500', adminToken),
      apiFetchAdmin(`/analytics/outbreak-alerts?days=${days}`, adminToken),
      apiFetchAdmin('/complaints/admin/all', adminToken),
      apiFetchAdmin(`/analytics/disease-trends?days=${days}`, adminToken),
    ])
    const users = usersRes.status === 'fulfilled' ? (usersRes.value?.users || []) : []
    const alertData = alertsRes.status === 'fulfilled' ? alertsRes.value : {}
    const complaints = complaintsRes.status === 'fulfilled' ? (complaintsRes.value || []) : []
    const trendsRaw = trendsRes.status === 'fulfilled' ? (trendsRes.value?.trends || []) : []

    // Farmers by state (top 10)
    const stateMap = {}
    users.forEach(u => { const s = u.state || 'Unknown'; stateMap[s] = (stateMap[s] || 0) + 1 })
    const farmers_by_state = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Disease trends aggregated by week
    const weekMap = {}
    trendsRaw.forEach(t => {
      const wk = t.week ? t.week.slice(0, 10) : null
      if (wk) weekMap[wk] = (weekMap[wk] || 0) + (t.cases || 0)
    })
    const disease_trends = Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, cases]) => ({
        week: new Date(week).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        cases,
      }))

    // Complaint stats by status
    const statusMap = {}
    complaints.forEach(c => { const s = c.status || 'open'; statusMap[s] = (statusMap[s] || 0) + 1 })
    const complaint_stats = Object.entries(statusMap).map(([name, value]) => ({ name, value }))

    return {
      total_farmers: usersRes.status === 'fulfilled' ? (usersRes.value?.total || users.length) : 0,
      total_scans: complaints.length,
      active_outbreaks: alertData.active_alerts || 0,
      resolved_cases: complaints.filter(c => c.status === 'resolved').length,
      recent_complaints: complaints.slice(0, 10).map(c => ({
        ...c,
        farmer_name: c.farmer_name || 'Unknown',
        district: c.district || '—',
      })),
      all_complaints: complaints,
      farmers_by_state,
      disease_trends,
      complaint_stats,
    }
  },
    getUsers: (adminToken) => apiFetchAdmin('/auth/admin/users', adminToken),
  getAllComplaints: (adminToken) => apiFetchAdmin('/complaints/admin/all', adminToken),
  updateComplaint: (adminToken, id, data) =>
    apiFetchAdmin(`/complaints/admin/${id}`, adminToken, { method: 'PUT', body: JSON.stringify(data) }),
}

// â”€â”€ Voice â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const voiceApi = {
  transcribe: (formData) => apiUpload('/voice/transcribe', formData),
  chatText: (data) => apiFetch('/voice/chat/text', { method: 'POST', body: JSON.stringify(data) }),
}

// â”€â”€ Disease History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const diseaseHistoryApi = {
  log: (data) => apiFetch('/disease-history/log', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (farmerId, limit = 50) =>
    apiFetch(`/disease-history/history?farmer_id=${farmerId}&limit=${limit}`),
  getFarmReport: (farmerId) => apiFetch(`/disease-history/farm-report/${farmerId}`),
  getTrends: (farmerId, days = 90) =>
    apiFetch(`/disease-history/trends?farmer_id=${farmerId}&days=${days}`),
}

export const satelliteApi = {
  analyzeLand: (lat, lng, areaAcres = 2.0, landId = null, crop = null) => {
    const params = new URLSearchParams({ lat, lng, area_acres: areaAcres })
    if (landId) params.set('land_id', landId)
    if (crop) params.set('crop', crop)
    return apiFetch(`/satellite/analyze?${params}`)
  },
  
  getCarbonCredits: (landId, lat, lng, areaAcres = 2.0, crop = null) => {
    const params = new URLSearchParams({ lat, lng, area_acres: areaAcres })
    if (crop) params.set('crop', crop)
    return apiFetch(`/satellite/carbon-credits/${landId}?${params}`)
  },
  
  checkInsurance: (landId, lat, lng, areaAcres = 2.0, ndviThreshold = 0.25, crop = null) => {
    const params = new URLSearchParams({ lat, lng, area_acres: areaAcres, ndvi_threshold: ndviThreshold })
    if (crop) params.set('crop', crop)
    return apiFetch(`/satellite/parametric-insurance/${landId}?${params}`)
  },
  
  getHistory: (landId) => apiFetch(`/satellite/history/${landId}`),

  /** URL for the NDVI false-colour PNG overlay (GET, returns image/png or 204) */
  ndviTileUrl: (lat, lng) => `${API_BASE}/satellite/ndvi-tile?lat=${lat}&lng=${lng}`,
}


