import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Sprout, Loader2, ChevronDown, Info, BarChart3,
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { cropApi, marketApi, weatherApi } from '../api/client'

// ── Constants ──────────────────────────────────────────────────────────────
const CROP_OPTIONS = [
  'wheat', 'rice', 'maize', 'cotton', 'tomato', 'potato', 'onion',
  'chickpea', 'lentil', 'mungbean', 'sugarcane', 'banana', 'mango',
  'grapes', 'watermelon', 'blackgram', 'pigeonpeas',
]

const SOIL_PRESETS = {
  alluvial: { n: 55, p: 30, k: 200, ph: 7.0, label: 'Alluvial (Indo-Gangetic)' },
  black:    { n: 45, p: 25, k: 230, ph: 7.5, label: 'Black Cotton Soil' },
  red:      { n: 35, p: 20, k: 150, ph: 6.2, label: 'Red & Laterite' },
  loam:     { n: 60, p: 35, k: 210, ph: 6.8, label: 'Loam (General)' },
  sandy:    { n: 25, p: 15, k: 120, ph: 6.0, label: 'Sandy Soil' },
  clay:     { n: 50, p: 28, k: 250, ph: 7.2, label: 'Clay Soil' },
}

const DISTRICT_AVG = {
  wheat: 3.2, rice: 4.1, maize: 5.0, cotton: 2.5, sugarcane: 72,
  potato: 25, tomato: 42, onion: 20, chickpea: 1.5, lentil: 1.1,
  mungbean: 0.8, blackgram: 0.85, pigeonpeas: 1.1, banana: 43,
  mango: 8.5, grapes: 21, watermelon: 25, default: 2.5,
}

function parseYield(str) {
  if (!str) return null
  const rangeMatch = str.match(/([\d.]+)[-\u2013]([\d.]+)\s*t/i)
  if (rangeMatch) return [parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2])]
  const singleMatch = str.match(/([\d.]+)\s*t/i)
  if (singleMatch) {
    const v = parseFloat(singleMatch[1])
    return [+(v * 0.85).toFixed(1), +(v * 1.15).toFixed(1)]
  }
  return null
}

// ── Sub-components ─────────────────────────────────────────────────────────
function ConfidenceMeter({ value }) {
  const color = value >= 70 ? 'bg-primary' : value >= 45 ? 'bg-amber-400' : 'bg-red-400'
  const textColor = value >= 70 ? 'text-primary' : value >= 45 ? 'text-amber-400' : 'text-red-400'
  const label = value >= 70 ? 'High confidence' : value >= 45 ? 'Moderate' : 'Low confidence'
  return (
    <div>
      <div className="flex justify-between text-xs text-text-3 mb-1">
        <span>AI Confidence</span>
        <span className={textColor}>{value}% — {label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-3">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function YieldPredictor() {
  const { state } = useApp()
  const farmer = state.farmer

  const [crop, setCrop]               = useState('wheat')
  const [soilType, setSoilType]       = useState('alluvial')
  const [area, setArea]               = useState(1)
  const [n, setN]                     = useState(SOIL_PRESETS.alluvial.n)
  const [p, setP]                     = useState(SOIL_PRESETS.alluvial.p)
  const [k, setK]                     = useState(SOIL_PRESETS.alluvial.k)
  const [ph, setPh]                   = useState(SOIL_PRESETS.alluvial.ph)
  const [temperature, setTemperature] = useState(25)
  const [humidity, setHumidity]       = useState(65)
  const [rainfall, setRainfall]       = useState(120)
  const [advanced, setAdvanced]       = useState(false)
  const [districtAvg, setDistrictAvg] = useState(DISTRICT_AVG)
  const [loading, setLoading]         = useState(false)
  const [result, setResult]           = useState(null)
  const [error, setError]             = useState(null)

  // Fetch district yield averages with localStorage cache (7-day TTL)
  useEffect(() => {
    const st = farmer?.state
    const dt = farmer?.district
    if (!st && !dt) return
    const cacheKey = `agri_district_avg_${st ?? 'na'}_${dt ?? 'na'}`
    const TTL = 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    try {
      const raw = localStorage.getItem(cacheKey)
      if (raw) {
        const { ts, data } = JSON.parse(raw)
        if (Date.now() - ts < TTL && data && Object.keys(data).length > 0) {
          setDistrictAvg({ ...DISTRICT_AVG, ...data })
          return
        }
      }
    } catch {}
    cropApi.getDistrictAverages(st, dt)
      .then(res => {
        if (res?.averages && Object.keys(res.averages).length > 0) {
          const merged = { ...DISTRICT_AVG, ...res.averages }
          setDistrictAvg(merged)
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: res.averages }))
          } catch {}
        }
      })
      .catch(() => {})
  }, [farmer?.state, farmer?.district])

  // Prefill soil from localStorage (written by Soil Passport)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('soilTestData')
      if (stored) {
        const d = JSON.parse(stored)
        if (d.n) setN(Math.round(d.n))
        if (d.p) setP(Math.round(d.p))
        if (d.k) setK(Math.round(d.k))
        if (d.ph) setPh(parseFloat(d.ph))
        setSoilType('custom')
      }
    } catch {}
  }, [])

  // Prefill weather from farmer location
  useEffect(() => {
    const lat = farmer?.latitude ?? farmer?.lands?.[0]?.latitude
    const lon = farmer?.longitude ?? farmer?.lands?.[0]?.longitude
    if (!lat || !lon) return
    weatherApi.getIntelligence(lat, lon)
      .then(w => {
        if (!w?.current) return
        setTemperature(Math.round(w.current.temperature ?? 25))
        setHumidity(Math.round(w.current.humidity ?? 65))
        const rain = (w.current.rainfall_24h ?? 4) * 30
        setRainfall(Math.min(2000, Math.round(rain)))
      })
      .catch(() => {})
  }, [farmer])

  function applyPreset(type) {
    setSoilType(type)
    if (type === 'custom') return
    const preset = SOIL_PRESETS[type]
    setN(preset.n); setP(preset.p); setK(preset.k); setPh(preset.ph)
  }

  async function predict() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const [cropRes, mktRes] = await Promise.allSettled([
        cropApi.recommend({
          nitrogen: n, phosphorus: p, potassium: k,
          temperature, humidity, ph, rainfall,
          state: farmer?.state, district: farmer?.district,
        }),
        marketApi.getPrices(crop, farmer?.state || 'Maharashtra'),
      ])

      let confidence = 0
      let yieldMin = null, yieldMax = null
      let advisory = ''
      let season = ''

      if (cropRes.status === 'fulfilled' && cropRes.value?.success) {
        const recs = cropRes.value.recommendations ?? []
        const match = recs.find(r =>
          r.crop_name?.toLowerCase() === crop.toLowerCase()
        ) ?? recs[0]
        if (match) {
          confidence = Math.round((match.confidence ?? 0) * 100)
          const parsed = parseYield(match.expected_yield)
          if (parsed) [yieldMin, yieldMax] = parsed
          advisory = match.description ?? ''
          season = match.season ?? ''
        }
      }

      // Fallback to district avg when API yields no parseable value
      if (yieldMin === null) {
        const avg = districtAvg[crop] ?? districtAvg.default ?? DISTRICT_AVG.default
        yieldMin = +(avg * 0.85).toFixed(1)
        yieldMax = +(avg * 1.15).toFixed(1)
        if (confidence === 0) confidence = 42
      }

      const totalMin = +(yieldMin * area).toFixed(1)
      const totalMax = +(yieldMax * area).toFixed(1)
      const avgYieldHa = (yieldMin + yieldMax) / 2

      let pricePerTonne = 0
      let marketName = ''
      if (mktRes.status === 'fulfilled' && mktRes.value?.prices?.length > 0) {
        const pm = mktRes.value.prices[0]
        pricePerTonne = (pm.modal_price ?? 0) * 10
        marketName = pm.market_name ?? ''
      }

      const revenue = pricePerTonne > 0
        ? Math.round(avgYieldHa * area * pricePerTonne)
        : null

      const distAvg = districtAvg[crop] ?? districtAvg.default ?? DISTRICT_AVG.default
      const vsDistrict = +(((avgYieldHa - distAvg) / distAvg) * 100).toFixed(0)

      setResult({ yieldMin, yieldMax, totalMin, totalMax, confidence, advisory, season, revenue, pricePerTonne, marketName, vsDistrict })
    } catch {
      setError('Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface-1/80 backdrop-blur-lg p-5">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
        <motion.div
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-36 h-36 rounded-full bg-amber-500/8 blur-3xl"
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display text-text-1 text-sm font-semibold leading-none">Yield Predictor</h2>
            <p className="text-text-3 text-xs mt-0.5">AI-powered harvest estimate</p>
          </div>
        </div>
        <Sprout size={20} className="text-primary/30" />
      </div>

      {/* Controls */}
      <div className="relative space-y-3">
        {/* Crop + Area */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="yp-crop" className="text-text-3 text-xs mb-1 block">Crop</label>
            <div className="relative">
              <select
                id="yp-crop"
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-surface-2 text-text-1 text-sm px-3 py-2 pr-8 focus:outline-none focus:border-primary"
              >
                {CROP_OPTIONS.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label htmlFor="yp-area" className="text-text-3 text-xs mb-1 block">Area (hectares)</label>
            <input
              id="yp-area"
              type="number" min="0.1" max="1000" step="0.1"
              value={area}
              onChange={e => setArea(Math.max(0.1, parseFloat(e.target.value) || 1))}
              className="w-full rounded-lg border border-border bg-surface-2 text-text-1 text-sm px-3 py-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Soil preset */}
        <div>
          <label htmlFor="yp-soil" className="text-text-3 text-xs mb-1 block">Soil Type</label>
          <div className="relative">
            <select
              id="yp-soil"
              value={soilType}
              onChange={e => applyPreset(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-surface-2 text-text-1 text-sm px-3 py-2 pr-8 focus:outline-none focus:border-primary"
            >
              {Object.entries(SOIL_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
              <option value="custom">Custom (from Soil Passport)</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          className="flex items-center gap-1.5 text-xs text-text-3 hover:text-text-2 transition-colors"
          onClick={() => setAdvanced(v => !v)}
          aria-expanded={advanced}
          aria-controls="yp-advanced-params"
        >
          <motion.span animate={{ rotate: advanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={13} />
          </motion.span>
          Advanced parameters (N/P/K, pH, weather)
        </button>

        <AnimatePresence>
          {advanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div
                id="yp-advanced-params"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1"
              >
                {[
                  { label: 'Nitrogen (N)', key: 'n', value: n, set: setN, min: 0, max: 200 },
                  { label: 'Phosphorus (P)', key: 'p', value: p, set: setP, min: 0, max: 150 },
                  { label: 'Potassium (K)', key: 'k', value: k, set: setK, min: 0, max: 400 },
                  { label: 'pH', key: 'ph', value: ph, set: setPh, min: 3, max: 10, step: 0.1 },
                  { label: 'Temp (°C)', key: 'temp', value: temperature, set: setTemperature, min: 5, max: 50 },
                  { label: 'Humidity (%)', key: 'hum', value: humidity, set: setHumidity, min: 0, max: 100 },
                  { label: 'Rainfall (mm/mo)', key: 'rain', value: rainfall, set: setRainfall, min: 0, max: 2000 },
                ].map(({ label, key, value, set, min, max, step = 1 }) => (
                  <div key={label}>
                    <label htmlFor={`yp-adv-${key}`} className="text-text-3 text-xs mb-1 block">{label}</label>
                    <input
                      id={`yp-adv-${key}`}
                      type="number" min={min} max={max} step={step}
                      value={value}
                      onChange={e => set(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-border bg-surface-2 text-text-1 text-xs px-2 py-1.5 focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Predict button */}
        <button
          onClick={predict}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 h-10"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Predicting…</>
            : <><BarChart3 size={15} /> Predict Yield</>
          }
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="relative mt-3 text-xs text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative mt-4 space-y-3 border-t border-border pt-4"
          >
            {/* Yield range */}
            <div className="text-center">
              <p className="text-text-3 text-xs mb-0.5">Estimated Total Yield</p>
              <p className="font-display text-3xl font-bold text-text-1 leading-none">
                {result.totalMin} – {result.totalMax}
                <span className="text-base font-normal text-text-3 ml-1">tonnes</span>
              </p>
              <p className="text-text-3 text-xs mt-1">
                {result.yieldMin} – {result.yieldMax} t/ha
                {result.season && <> · <span className="capitalize">{result.season}</span> season</>}
              </p>
            </div>

            {/* Revenue estimate */}
            {result.revenue != null && result.revenue > 0 && (
              <div className="rounded-lg bg-primary/8 border border-primary/20 p-3 text-center">
                <p className="text-text-3 text-xs">Estimated Revenue</p>
                <p className="text-primary font-display font-bold text-xl">
                  ₹{result.revenue.toLocaleString('en-IN')}
                </p>
                {result.marketName && (
                  <p className="text-text-3 text-xs">
                    @ ₹{result.pricePerTonne.toLocaleString('en-IN')}/t · {result.marketName}
                  </p>
                )}
              </div>
            )}

            {/* AI confidence */}
            <ConfidenceMeter value={result.confidence} />

            {/* District comparison */}
            <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
              <Info size={13} className="text-text-3 shrink-0" />
              <p className="text-text-3 text-xs">
                {result.vsDistrict >= 0
                  ? <span className="text-primary font-medium">+{result.vsDistrict}% above</span>
                  : <span className="text-amber-400 font-medium">{result.vsDistrict}% below</span>
                }
                {' '}district average yield for {crop}
              </p>
            </div>

            {result.advisory && (
              <p className="text-text-3 text-xs leading-relaxed line-clamp-3">{result.advisory}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
