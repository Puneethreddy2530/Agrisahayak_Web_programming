import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Crosshair } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { satelliteApi } from '../api/client'
import { MapContainer, TileLayer, Marker, useMapEvents, ImageOverlay, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet default marker icon (CSS-bundler issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const GREEN_ICON = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const CROPS = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Tomato', 'Potato', 'Onion', 'Sugarcane',
  'Soybean', 'Groundnut', 'Mustard', 'Chickpea', 'Tur', 'Moong', 'Banana',
]

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function ndviColor(ndvi) {
  if (ndvi < 0.2) return '#ef4444'
  if (ndvi < 0.35) return '#f97316'
  if (ndvi < 0.5) return '#facc15'
  if (ndvi < 0.7) return '#22c55e'
  return '#10b981'
}

function prettyHealth(label) {
  const normalized = String(label || '').toLowerCase()
  if (normalized === 'excellent') return 'Excellent'
  if (normalized === 'good') return 'Good'
  if (normalized === 'moderate') return 'Moderate'
  if (normalized === 'stressed') return 'Stressed'
  return 'Critical'
}

function riskTone(label) {
  const normalized = String(label || '').toLowerCase()
  if (normalized === 'critical') return { text: 'text-red-400', dot: '#ef4444', bg: 'rgba(239,68,68,0.09)', border: 'rgba(239,68,68,0.35)' }
  if (normalized === 'high') return { text: 'text-amber-300', dot: '#f59e0b', bg: 'rgba(245,158,11,0.09)', border: 'rgba(245,158,11,0.35)' }
  if (normalized === 'medium') return { text: 'text-yellow-300', dot: '#facc15', bg: 'rgba(250,204,21,0.09)', border: 'rgba(250,204,21,0.35)' }
  return { text: 'text-emerald-400', dot: '#22c55e', bg: 'rgba(34,197,94,0.09)', border: 'rgba(34,197,94,0.35)' }
}

function rupees(value) {
  return `₹${Math.round(toNumber(value, 0)).toLocaleString('en-IN')}`
}

function makeLandId(coords) {
  const trimmed = coords.name.trim().toLowerCase()
  if (trimmed) {
    const slug = trimmed.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    if (slug) return `land-${slug}`
  }
  return `L${Math.round(coords.lat * 1000)}${Math.round(coords.lng * 1000)}`
}

function NDVIGauge({ ndvi }) {
  const value = clamp(toNumber(ndvi, 0), 0, 1)
  const radius = 68
  const strokeWidth = 12
  const size = 180
  const circumference = 2 * Math.PI * radius
  const dash = circumference * value
  const color = ndviColor(value)

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ndviTrack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ndviTrack)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.7s ease, stroke 0.5s ease' }}
        />
        <text
          x="50%"
          y="47%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#e8f0ea"
          style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {value.toFixed(2)}
        </text>
        <text
          x="50%"
          y="63%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#8fa898"
          style={{ fontSize: 12 }}
        >
          NDVI
        </text>
      </svg>
    </div>
  )
}

export default function SatelliteOracle() {
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629, acres: 2.0, name: '', crop: 'Rice' })
  const [analysis, setAnalysis] = useState(null)
  const [carbonData, setCarbonData] = useState(null)
  const [insuranceData, setInsuranceData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analysis') // 'analysis' | 'carbon' | 'insurance'
  const [ndviThreshold, setNdviThreshold] = useState(0.25)
  const [error, setError] = useState(null)

  const landId = useMemo(() => makeLandId(coords), [coords])

  const historyData = useMemo(() => {
    return [...history]
      .filter((item) => Number.isFinite(toNumber(item?.ndvi, NaN)))
      .map((item, idx) => {
        const dt = item?.analyzed_at ? new Date(item.analyzed_at) : null
        const dateLabel = dt && !Number.isNaN(dt.getTime())
          ? dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          : `P${idx + 1}`
        return {
          date: dateLabel,
          ndvi: clamp(toNumber(item.ndvi, 0), 0, 1),
          stamp: dt && !Number.isNaN(dt.getTime()) ? dt.getTime() : idx,
        }
      })
      .sort((a, b) => a.stamp - b.stamp)
  }, [history])

  const [ndviOverlay, setNdviOverlay] = useState(null) // { url, bounds }
  const mapRef = useRef(null)

  const analysisIncomeEstimate = useMemo(() => {
    const tons = toNumber(analysis?.carbon_sequestration_tons_co2_year, 0)
    return Math.round(tons * 800)
  }, [analysis])

  async function refreshHistory(currentLandId) {
    try {
      const histRes = await satelliteApi.getHistory(currentLandId)
      setHistory(Array.isArray(histRes?.history) ? histRes.history : [])
    } catch {
      setHistory([])
    }
  }

  async function handleAnalyze(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    setCarbonData(null)
    setInsuranceData(null)
    setNdviOverlay(null)
    try {
      const result = await satelliteApi.analyzeLand(coords.lat, coords.lng, coords.acres, landId, coords.crop)
      setAnalysis(result)
      setActiveTab('analysis')
      await refreshHistory(landId)

      // Fetch NDVI false-colour overlay for the map
      const tileUrl = satelliteApi.ndviTileUrl(coords.lat, coords.lng)
      try {
        const resp = await fetch(tileUrl)
        if (resp.ok && resp.headers.get('content-type')?.includes('image')) {
          const blob = await resp.blob()
          const blobUrl = URL.createObjectURL(blob)
          const bufferDeg = 1.0 / 111.0  // ~1 km
          const lngBuf = bufferDeg / Math.cos((coords.lat * Math.PI) / 180)
          setNdviOverlay({
            url: blobUrl,
            bounds: [
              [coords.lat - bufferDeg, coords.lng - lngBuf],
              [coords.lat + bufferDeg, coords.lng + lngBuf],
            ],
          })
        }
      } catch { /* overlay is optional */ }
    } catch (e) {
      setError(e?.message || 'Failed to analyze land from satellite data.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCarbonCredits() {
    setError(null)
    setLoading(true)
    try {
      const result = await satelliteApi.getCarbonCredits(landId, coords.lat, coords.lng, coords.acres, coords.crop)
      setCarbonData(result)
      if (result?.analysis) setAnalysis(result.analysis)
      setActiveTab('carbon')
    } catch (e) {
      setError(e?.message || 'Failed to calculate carbon credits.')
    } finally {
      setLoading(false)
    }
  }

  async function handleInsuranceCheck() {
    setError(null)
    setLoading(true)
    try {
      const result = await satelliteApi.checkInsurance(
        landId,
        coords.lat,
        coords.lng,
        coords.acres,
        ndviThreshold,
        coords.crop
      )
      setInsuranceData(result)
      setActiveTab('insurance')
    } catch (e) {
      setError(e?.message || 'Failed to check insurance status.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Leaflet helper components ──────────────────────────────────── */
  function LocationPicker() {
    useMapEvents({
      click(e) {
        setCoords((prev) => ({
          ...prev,
          lat: Number(e.latlng.lat.toFixed(4)),
          lng: Number(e.latlng.lng.toFixed(4)),
        }))
      },
    })
    return null
  }

  function MapAutoCenter() {
    const map = useMap()
    useEffect(() => {
      map.flyTo([coords.lat, coords.lng], map.getZoom(), { duration: 0.6 })
    }, [coords.lat, coords.lng, map])
    return null
  }

  const tone = riskTone(analysis?.risk_level)
  const ndvi = clamp(toNumber(analysis?.ndvi, 0), 0, 1)
  const ndwi = toNumber(analysis?.ndwi, 0)
  const soilMoisture = toNumber(analysis?.soil_moisture_index, 0)

  return (
    <div
      className="page-content space-y-5"
      style={{
        background: 'radial-gradient(circle at 10% 0%, rgba(34,197,94,0.12) 0%, transparent 35%), radial-gradient(circle at 100% 100%, rgba(59,130,246,0.09) 0%, transparent 40%), #0A0F0B',
      }}
    >
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Satellite Oracle</h1>
        <p className="text-text-3 text-sm mt-0.5">Sentinel-2 · 10m resolution · Updated every 5 days</p>
      </header>

      <div className="grid lg:grid-cols-[minmax(320px,400px),1fr] gap-4">
        <form onSubmit={handleAnalyze} className="card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-3 block mb-1.5">Latitude</label>
              <input
                type="number"
                step="0.0001"
                placeholder="20.5937"
                className="input w-full"
                value={coords.lat}
                onChange={(e) => setCoords((prev) => ({ ...prev, lat: toNumber(e.target.value, prev.lat) }))}
              />
            </div>
            <div>
              <label className="text-xs text-text-3 block mb-1.5">Longitude</label>
              <input
                type="number"
                step="0.0001"
                placeholder="78.9629"
                className="input w-full"
                value={coords.lng}
                onChange={(e) => setCoords((prev) => ({ ...prev, lng: toNumber(e.target.value, prev.lng) }))}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-3 block mb-1.5">Area in acres</label>
            <input
              type="number"
              step="0.1"
              className="input w-full"
              value={coords.acres}
              onChange={(e) => setCoords((prev) => ({ ...prev, acres: toNumber(e.target.value, prev.acres) }))}
            />
          </div>

          <div>
            <label className="text-xs text-text-3 block mb-1.5">Land Name (optional)</label>
            <input
              type="text"
              className="input w-full"
              placeholder="North field"
              value={coords.name}
              onChange={(e) => setCoords((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs text-text-3 block mb-1.5">Crop</label>
            <select
              className="input w-full"
              value={coords.crop}
              onChange={(e) => setCoords((prev) => ({ ...prev, crop: e.target.value }))}
            >
              {CROPS.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
            {loading ? 'Analyzing…' : '🛰️ Analyze from Space'}
          </button>
          <p className="text-xs text-text-3">Or map your land on the interactive globe below</p>
        </form>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-1 font-semibold">Interactive Map</p>
            <span className="text-xs text-text-3">Click to set coordinates</span>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ height: 340, border: '1px solid rgba(34,197,94,0.22)' }}>
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <LocationPicker />
              <MapAutoCenter />
              <Marker position={[coords.lat, coords.lng]} icon={GREEN_ICON} />
              {ndviOverlay && (
                <ImageOverlay url={ndviOverlay.url} bounds={ndviOverlay.bounds} opacity={0.7} />
              )}
            </MapContainer>
          </div>
          <p className="text-xs text-text-3 mt-3">
            Selected point: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} · Land ID: <span className="text-text-2">{landId}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="card p-5" style={{ border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)' }}>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap gap-2">
              <button
                className={activeTab === 'analysis' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('analysis')}
                type="button"
              >
                Analysis
              </button>
              <button
                className={activeTab === 'carbon' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => carbonData ? setActiveTab('carbon') : handleCarbonCredits()}
                type="button"
              >
                Carbon Credits
              </button>
              <button
                className={activeTab === 'insurance' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => insuranceData ? setActiveTab('insurance') : handleInsuranceCheck()}
                type="button"
              >
                Parametric Insurance
              </button>
            </div>
          </div>

          {/* Tab switching: auto-fetch the secondary tabs on first visit */}

          {activeTab === 'analysis' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="card p-5">
                <div className="grid md:grid-cols-[220px,1fr] gap-6 items-center">
                  <NDVIGauge ndvi={ndvi} />
                  <div>
                    <p className="text-text-3 text-xs uppercase tracking-wide mb-1">Satellite Vegetation Index</p>
                    <p className="text-text-1 text-2xl font-bold">
                      Crop Health: <span style={{ color: ndviColor(ndvi) }}>{prettyHealth(analysis.crop_health)}</span>
                    </p>
                    {analysis.crop && (
                      <p className="text-text-3 text-xs mt-1">
                        Analyzed for: <span className="text-text-2 font-medium">{analysis.crop}</span>
                      </p>
                    )}
                    <p className="text-text-3 text-sm mt-2">
                      NDWI: {ndwi.toFixed(2)}  |  Soil Moisture: {soilMoisture.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="card p-5" style={{ background: 'rgba(59,130,246,0.09)', border: '1px solid rgba(59,130,246,0.28)' }}>
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Water Stress Index</p>
                  <p className="text-text-1 text-2xl font-bold mt-1">{ndwi.toFixed(2)}</p>
                  <p className="text-text-3 text-xs mt-1">NDWI from B03/B08 bands</p>
                </div>

                <div className="card p-5" style={{ background: 'rgba(16,185,129,0.09)', border: '1px solid rgba(16,185,129,0.28)' }}>
                  <p className="text-emerald-300 text-xs uppercase tracking-wide">Carbon Sequestration</p>
                  <p className="text-text-1 text-2xl font-bold mt-1">
                    {toNumber(analysis.carbon_sequestration_tons_co2_year, 0).toFixed(2)} tCO2/year
                  </p>
                  <p className="text-text-3 text-xs mt-1">~{rupees(analysisIncomeEstimate)} annual income</p>
                </div>

                <div className="card p-5" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
                  <p className="text-xs uppercase tracking-wide text-text-3">Risk Level</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ background: tone.dot }}
                    />
                    <p className={`text-lg font-bold ${tone.text}`}>
                      {String(analysis.risk_level || 'low').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {analysis.predictive_flag && (
                <div className="card p-5" style={{ border: '1px solid rgba(245,158,11,0.45)', background: 'rgba(245,158,11,0.10)' }}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={17} className="text-amber-300 shrink-0 mt-0.5" />
                    <p className="text-amber-100 text-sm">
                      ⚠️ Satellite data predicts visible disease symptoms in ~7 days. Act now before yield loss.
                    </p>
                  </div>
                </div>
              )}

              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-text-1 font-semibold">NDVI History</p>
                  <span className="text-text-3 text-xs">0.0 to 1.0 scale</span>
                </div>
                {historyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={historyData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#8fa898', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis
                        domain={[0, 1]}
                        tick={{ fill: '#8fa898', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => Number(v).toFixed(1)}
                        width={35}
                      />
                      <Tooltip
                        formatter={(v) => [Number(v).toFixed(3), 'NDVI']}
                        contentStyle={{
                          background: '#0f1813',
                          border: '1px solid rgba(34,197,94,0.2)',
                          borderRadius: 8,
                          color: '#e8f0ea',
                          fontSize: 12,
                        }}
                        labelStyle={{ color: '#8fa898' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ndvi"
                        stroke="#22C55E"
                        strokeWidth={2}
                        fill="url(#ndviGrad)"
                        dot={{ r: 3, fill: '#22C55E', strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: '#22C55E', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-text-3 text-sm">No historical records yet. Run analysis at least once.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'carbon' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="card p-5">
                <p className="text-text-2 mb-3">Estimate tokenized carbon income from your latest satellite biomass profile.</p>
                <button className="btn-primary" onClick={handleCarbonCredits} type="button" disabled={loading}>
                  {loading ? 'Calculating…' : 'Calculate AgriCarbon Tokens'}
                </button>
              </div>

              {carbonData && (
                <div className="card p-5 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="card p-5" style={{ background: 'rgba(16,185,129,0.08)' }}>
                      <p className="text-text-3 text-xs uppercase tracking-wide">AgriCarbon Tokens</p>
                      <p className="text-text-1 text-2xl font-bold mt-1">
                        {toNumber(carbonData?.carbon_credits?.agri_carbon_tokens, 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="card p-5" style={{ background: 'rgba(59,130,246,0.08)' }}>
                      <p className="text-text-3 text-xs uppercase tracking-wide">Token Price</p>
                      <p className="text-text-1 text-2xl font-bold mt-1">
                        ₹{toNumber(carbonData?.carbon_credits?.token_price_inr, 0)} / token
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="card p-5">
                      <p className="text-text-3 text-xs uppercase tracking-wide">Annual Income (INR)</p>
                      <p className="text-emerald-300 text-2xl font-bold mt-1">
                        {rupees(carbonData?.carbon_credits?.annual_income_inr)}
                      </p>
                    </div>
                    <div className="card p-5">
                      <p className="text-text-3 text-xs uppercase tracking-wide">Annual Income (USD)</p>
                      <p className="text-text-1 text-2xl font-bold mt-1">
                        ${toNumber(carbonData?.carbon_credits?.annual_income_usd, 0).toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>

                  <p className="text-text-2 text-sm italic">{carbonData?.pitch}</p>
                  <div className="card p-5" style={{ border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.07)' }}>
                    <p className="text-emerald-300 text-sm">🔐 Secured with Falcon-512 Post-Quantum Signature</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'insurance' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-text-2 text-sm">NDVI threshold for payout trigger</p>
                  <p className="text-text-1 font-semibold">{ndviThreshold.toFixed(2)}</p>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={0.4}
                  step={0.01}
                  className="input w-full h-2 p-0 accent-emerald-500 cursor-pointer"
                  value={ndviThreshold}
                  onChange={(e) => setNdviThreshold(toNumber(e.target.value, 0.25))}
                />
                <button className="btn-primary" onClick={handleInsuranceCheck} type="button" disabled={loading}>
                  {loading ? 'Checking…' : 'Check Insurance Status'}
                </button>
              </div>

              {insuranceData && (
                <div
                  className="card p-5"
                  style={insuranceData.insurance_triggered
                    ? { border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.10)' }
                    : { border: '1px solid rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.10)' }}
                >
                  <p className={`text-lg font-bold ${insuranceData.insurance_triggered ? 'text-red-300' : 'text-emerald-300'}`}>
                    {insuranceData.insurance_triggered ? '🚨 Triggered' : '✅ Healthy'}
                  </p>
                  <p className="text-text-2 text-sm mt-1">
                    NDVI {toNumber(insuranceData.current_ndvi, 0).toFixed(3)} vs threshold {toNumber(insuranceData.ndvi_threshold, 0).toFixed(2)}
                  </p>
                  <p className="text-text-1 text-xl font-bold mt-2">
                    Payout Amount: {rupees(insuranceData.payout_amount_inr)}
                  </p>
                  <p className="text-text-3 text-sm mt-2">{insuranceData.message}</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
