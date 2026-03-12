import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Minus, RefreshCw, Search,
  ShoppingBasket, ChevronDown, Clock, Zap, Download, LayoutGrid, Table2,
  Loader2, AlertCircle, Compass
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts'
import { marketApi } from '../api/client'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import AnimatedNumber from '../components/common/AnimatedNumber'

// ── useDebounce hook ───────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const CROPS = [
  'Rice','Wheat','Maize','Cotton','Tomato','Potato','Onion','Sugarcane',
  'Bajra','Jowar','Soybean','Groundnut','Mustard','Chickpea','Mango'
]

const STATES = [
  'Maharashtra','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan',
  'Gujarat','Karnataka','Andhra Pradesh','Telangana','Bihar','West Bengal',
  'Tamil Nadu','Odisha','Chhattisgarh'
]

// Static ticker base — prices animate with loaded data if available
const TICKER_BASE = [
  { name: 'Rice', price: 2150, change: 45 },
  { name: 'Wheat', price: 2280, change: -20 },
  { name: 'Maize', price: 1820, change: 30 },
  { name: 'Cotton', price: 6700, change: 120 },
  { name: 'Tomato', price: 1600, change: -80 },
  { name: 'Onion', price: 2400, change: 90 },
  { name: 'Potato', price: 1250, change: -30 },
  { name: 'Soybean', price: 4200, change: 60 },
  { name: 'Mustard', price: 5100, change: -40 },
  { name: 'Sugarcane', price: 350, change: 5 },
  { name: 'Groundnut', price: 5500, change: 80 },
  { name: 'Chickpea', price: 5800, change: -25 },
]

// ── Top Ticker strip ────────────────────────────────
function TopTicker({ liveItems }) {
  const items = liveItems?.length ? liveItems : TICKER_BASE
  // Double the list so marquee loops seamlessly
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        background: 'rgba(10,21,16,0.9)',
        border: '1px solid rgba(34,197,94,0.12)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-center">
        {/* Label pill */}
        <div
          className="shrink-0 px-3 py-2 flex items-center gap-1.5 text-xs font-bold"
          style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', borderRight: '1px solid rgba(34,197,94,0.12)' }}
        >
          <Zap size={11} />
          LIVE
        </div>
        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden py-2">
          <div className="ticker-track">
            {doubled.map((item, i) => {
              const up = item.change > 0
              const down = item.change < 0
              return (
                <span key={i} className="flex items-center gap-2 px-4 text-sm whitespace-nowrap">
                  <span className="text-text-2 font-medium">{item.name}</span>
                  <span className="text-text-1 font-semibold">₹{item.price?.toLocaleString('en-IN')}</span>
                  <span className={up ? 'text-emerald-400' : down ? 'text-red-400' : 'text-text-3'}>
                    {up ? '▲' : down ? '▼' : '▬'}
                    {Math.abs(item.change)}
                  </span>
                  <span className="text-border mx-1">|</span>
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Bottom Ticker strip (reversed direction) ─────────────────────
function BottomTicker({ liveItems }) {
  const items = liveItems?.length ? [...liveItems].reverse() : [...TICKER_BASE].reverse()
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        background: 'rgba(10,21,16,0.9)',
        border: '1px solid rgba(139,92,246,0.18)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-center">
        <div
          className="shrink-0 px-3 py-2 flex items-center gap-1.5 text-xs font-bold"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', borderRight: '1px solid rgba(139,92,246,0.15)' }}
        >
          <Zap size={11} />
          MANDI
        </div>
        <div className="flex-1 overflow-hidden py-2">
          <div className="ticker-track-reverse">
            {doubled.map((item, i) => {
              const up = item.change > 0
              const down = item.change < 0
              return (
                <span key={i} className="flex items-center gap-2 px-4 text-sm whitespace-nowrap">
                  <span className="text-text-2 font-medium">{item.name}</span>
                  <span className="text-text-1 font-semibold">₹{item.price?.toLocaleString('en-IN')}</span>
                  <span className={up ? 'text-violet-400' : down ? 'text-red-400' : 'text-text-3'}>
                    {up ? '▲' : down ? '▼' : '▬'}
                    {Math.abs(item.change)}
                  </span>
                  <span className="text-border mx-1">|</span>
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Best Time to Sell badge ────────────────────────────
function SellBadge({ change }) {
  if (change == null) return null
  if (change > 30)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
        style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
        <TrendingUp size={10} /> Sell Now
      </span>
    )
  if (change < -20)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
        style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
        <TrendingDown size={10} /> Hold
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
      <Clock size={10} /> Watch
    </span>
  )
}

// ── CSV export ────────────────────────────────────────
function exportCSV(rows, crop, state) {
  const header = ['Rank', 'Commodity', 'Market', 'State', 'Min', 'Modal', 'Max', 'Change', 'Signal']
  const body = rows.map((r, i) => {
    const change = r.price_change ?? 0
    const signal = change > 30 ? 'Sell Now' : change < -20 ? 'Hold' : 'Watch'
    return [i + 1, crop, r.market || r.market_name || '', state, r.min_price ?? '', r.modal_price ?? '', r.max_price ?? '', change, signal]
  })
  const csv = [header, ...body].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `market_${crop}_${state}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── Virtualized Bloomberg table ───────────────────────
const ROW_H = 42
function VirtualTable({ rows, crop, state }) {
  const containerRef = useRef()
  const [scrollTop, setScrollTop] = useState(0)
  const viewH = 462
  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - 1)
  const endIdx = Math.min(rows.length, startIdx + Math.ceil(viewH / ROW_H) + 3)
  const pad = startIdx * ROW_H
  const COLS = ['#', 'Commodity', 'Market', 'State', 'Min', 'Modal', 'Max', 'Chg', 'Signal']
  const GRID = '44px 88px 1fr 100px 72px 86px 72px 60px 80px'
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: GRID, background: '#070f0b', borderBottom: '1px solid rgba(34,197,94,0.15)', padding: '0 8px', minWidth: 720 }}>
        {COLS.map(c => (
          <div key={c} style={{ padding: '8px 6px', fontSize: 10, fontWeight: 700, color: '#4E6357', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{c}</div>
        ))}
      </div>
      <div
        ref={containerRef}
        style={{ height: viewH, overflowY: 'auto', minWidth: 720, position: 'relative' }}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: rows.length * ROW_H, position: 'relative' }}>
          <div style={{ position: 'absolute', top: pad, left: 0, right: 0 }}>
            {rows.slice(startIdx, endIdx).map((row, rel) => {
              const i = startIdx + rel
              const change = row.price_change ?? 0
              const signal = change > 30 ? 'Sell' : change < -20 ? 'Hold' : 'Watch'
              const sigColor = change > 30 ? '#22C55E' : change < -20 ? '#f87171' : '#fbbf24'
              const chgColor = change > 0 ? '#34d399' : change < 0 ? '#f87171' : '#6B7280'
              return (
                <div
                  key={i}
                  style={{
                    display: 'grid', gridTemplateColumns: GRID,
                    height: ROW_H, background: i % 2 === 0 ? '#0f1813' : '#111d16',
                    padding: '0 8px', borderBottom: '1px solid rgba(255,255,255,0.025)', alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#4E6357', fontFamily: 'monospace' }}>{i + 1}</span>
                  <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>{crop}</span>
                  <span style={{ fontSize: 12, color: '#E8F0EA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.market || row.market_name || '—'}</span>
                  <span style={{ fontSize: 11, color: '#8FA898', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.state || state}</span>
                  <span style={{ fontSize: 11, color: '#8FA898', fontFamily: 'monospace' }}>₹{row.min_price ?? '—'}</span>
                  <span style={{ fontSize: 13, color: '#E8F0EA', fontWeight: 700, fontFamily: 'monospace' }}>₹{row.modal_price ?? '—'}</span>
                  <span style={{ fontSize: 11, color: '#8FA898', fontFamily: 'monospace' }}>₹{row.max_price ?? '—'}</span>
                  <span style={{ fontSize: 11, color: chgColor, fontFamily: 'monospace' }}>{change > 0 ? '+' : ''}{change}</span>
                  <span style={{ fontSize: 10, color: sigColor, fontWeight: 700, letterSpacing: '0.04em' }}>{signal}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Heat map view ─────────────────────────────────────
function HeatMapView({ rows }) {
  const cells = rows.slice(0, 16)
  if (!cells.length) return <div className="p-8 text-center text-text-3 text-sm">No data to display</div>
  const prices = cells.map(r => r.modal_price ?? 0)
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
      {cells.map((row, i) => {
        const norm = maxP > minP ? (row.modal_price - minP) / (maxP - minP) : 0.5
        const h = Math.round(norm * 120)     // 0=red → 120=green
        const l = Math.round(10 + norm * 10) // lightness 10%–20%
        const bg = `hsl(${h}, 55%, ${l}%)`
        const border = `hsl(${h}, 55%, ${l + 14}%)`
        const change = row.price_change ?? 0
        return (
          <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '12px 10px' }}>
            <p style={{ fontSize: 11, color: `hsl(${h}, 60%, 70%)`, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row.market || row.market_name || `Market ${i + 1}`}
            </p>
            <p style={{ fontSize: 16, color: '#E8F0EA', fontWeight: 800, fontFamily: 'monospace' }}>
              ₹{row.modal_price?.toLocaleString('en-IN') ?? '—'}
            </p>
            <p style={{ fontSize: 10, color: change > 0 ? '#4ade80' : change < 0 ? '#f87171' : '#8FA898', marginTop: 2 }}>
              {change > 0 ? '▲' : change < 0 ? '▼' : '▬'} {Math.abs(change)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ── Mandi Navigator helpers ──────────────────────────────
function hashDist(name = '') {
  let h = 5381
  for (let i = 0; i < name.length; i++) h = ((h << 5) + h) ^ name.charCodeAt(i)
  return 5 + (Math.abs(h) % 296)   // 5–300 km, deterministic per mandi name
}

function MandiNavigator({ farmerState }) {
  const [navCrop,    setNavCrop]    = useState('Rice')
  const [navQty,     setNavQty]     = useState(500)
  const [navMaxDist, setNavMaxDist] = useState(150)
  const [results,    setResults]    = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [gpsCoords,  setGpsCoords]  = useState(null)
  const [gpsLabel,   setGpsLabel]   = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)

  // On mount: try to get GPS coordinates and reverse-geocode to a district label
  useEffect(() => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setGpsCoords({ lat, lng })
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const geo = await res.json()
          const addr = geo.address || {}
          const label = addr.county || addr.city || addr.town || addr.village || addr.state || 'your location'
          setGpsLabel(label)
        } catch {
          setGpsLabel('your GPS location')
        } finally {
          setGpsLoading(false)
        }
      },
      () => setGpsLoading(false)
    )
  }, [])

  async function findMandis(e) {
    e.preventDefault()
    setLoading(true); setError(null); setResults(null)
    try {
      let rows = []
      // Try dedicated navigator endpoint first; fall back to prices endpoint
      try {
        const params = new URLSearchParams({
          crop: navCrop,
          state: farmerState,
          qty: navQty,
          max_distance: navMaxDist,
        })
        if (gpsCoords) {
          params.set('lat', gpsCoords.lat)
          params.set('lng', gpsCoords.lng)
        }
        const r = await fetch(`/api/v1/market/mandi-navigator?${params}`)
        if (r.ok) {
          const d = await r.json()
          rows = d.mandis ?? d.prices ?? []
        } else throw new Error('fallback')
      } catch {
        const d = await marketApi.getPrices(navCrop, farmerState)
        rows = d?.prices ?? []
      }

      // Enrich: assign deterministic distance, compute revenue & net gain
      const enriched = rows
        .map(r => {
          const name     = r.market || r.market_name || ''
          const distance = r.distance_km ?? hashDist(name + navCrop)
          const modal    = r.modal_price ?? 0
          const estRev   = (navQty / 100) * modal
          const fuelCost = distance * 4 * 2      // ₹4/km both ways
          return { ...r, name, distance, modal, estRev, netGain: estRev - fuelCost }
        })
        .filter(r => r.distance <= navMaxDist)
        .sort((a, b) => b.netGain - a.netGain)
        .slice(0, 5)

      setResults(enriched)
    } catch (e) {
      setError(e.message || 'Failed to load mandi data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      <form onSubmit={findMandis} className="card p-5 space-y-4">
        {/* Crop selector */}
        <div>
          <label htmlFor="nav-crop" className="text-xs font-semibold text-text-3 uppercase tracking-wide block mb-1.5">Crop</label>
          <div className="relative">
            <select
              id="nav-crop"
              className="input w-full appearance-none pr-8 cursor-pointer"
              value={navCrop}
              onChange={e => setNavCrop(e.target.value)}
            >
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="nav-qty" className="text-xs font-semibold text-text-3 uppercase tracking-wide block mb-1.5">
            Quantity (kg)
          </label>
          <input
            id="nav-qty"
            type="number"
            min={100}
            step={50}
            className="input w-full"
            value={navQty}
            onChange={e => setNavQty(Math.max(100, Number(e.target.value)))}
          />
        </div>

        {/* Max Distance slider */}
        <div>
          <label htmlFor="nav-dist" className="text-xs font-semibold text-text-3 uppercase tracking-wide flex items-center justify-between mb-1.5">
            <span>Max Distance</span>
            <span className="text-primary font-bold">{navMaxDist} km</span>
          </label>
          <input
            id="nav-dist"
            type="range"
            min={10} max={200} step={5}
            value={navMaxDist}
            onChange={e => setNavMaxDist(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
            aria-valuemin={10}
            aria-valuemax={200}
            aria-valuenow={navMaxDist}
            aria-valuetext={`${navMaxDist} kilometers`}
          />
          <div className="flex justify-between text-text-3 text-[10px] mt-0.5">
            <span>10 km</span><span>200 km</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Finding mandis…</>
            : <>🧭 Find Best Mandis</>}
        </button>

        {/* GPS location banner */}
        {gpsLoading && (
          <p className="text-text-3 text-xs flex items-center gap-1.5">
            <Loader2 size={11} className="animate-spin" /> Detecting your location…
          </p>
        )}
        {!gpsLoading && gpsLabel && (
          <p className="text-xs text-green-400 flex items-center gap-1.5">
            📍 Using your GPS location: <span className="font-semibold">{gpsLabel}</span>
          </p>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="card p-4 border-red-500/20 bg-red-500/5 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-text-2 text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {results !== null && results.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-text-2 text-sm font-medium">No mandis found within {navMaxDist} km</p>
          <p className="text-text-3 text-xs mt-1">Try increasing the maximum distance.</p>
        </div>
      )}

      {/* Result cards */}
      <AnimatePresence>
        {results?.map((r, i) => {
          const isBest = i === 0
          return (
            <motion.div
              key={r.name + i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="card p-4"
              style={isBest
                ? { border: '1.5px solid #d97706', background: 'rgba(217,119,6,0.05)' }
                : {}}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-text-1 font-semibold truncate">{r.name || '—'}</p>
                  <p className="text-text-3 text-xs mt-0.5">{r.state || farmerState}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isBest && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
                      style={{ background: 'rgba(217,119,6,0.18)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.35)' }}
                    >
                      Best Choice 🏆
                    </span>
                  )}
                  <span className="text-text-3 text-xs whitespace-nowrap">📍 {Math.round(r.distance)} km</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {[
                  { label: 'Modal Price',   value: `₹${r.modal.toLocaleString('en-IN')}/q`,              color: '#22C55E' },
                  { label: 'Est. Revenue',  value: `₹${Math.round(r.estRev).toLocaleString('en-IN')}`,   color: '#60a5fa' },
                  { label: 'Fuel Cost',     value: `₹${Math.round(r.distance * 4 * 2).toLocaleString('en-IN')}`, color: '#f87171' },
                  { label: 'Net Gain',      value: `₹${Math.round(r.netGain).toLocaleString('en-IN')}`,  color: r.netGain >= 0 ? '#4ade80' : '#f87171' },
                ].map(s => (
                  <div key={s.label} className="bg-surface-2 rounded-lg p-2.5 text-center">
                    <p className="font-bold text-sm" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-text-3 text-[10px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Get Directions link */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(r.name + ' mandi')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                🗺️ Get Directions
              </a>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ── Gradient area chart ────────────────────────────────
function PriceChart({ prices }) {
  if (!prices?.length) return null
  const chartData = prices.slice(0, 12).map((r, i) => ({
    market: (r.market || r.market_name || `M${i + 1}`).slice(0, 10),
    price: r.modal_price ?? 0,
    min: r.min_price ?? 0,
    max: r.max_price ?? 0,
  }))
  const avg = Math.round(chartData.reduce((s, r) => s + r.price, 0) / chartData.length)
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-2 text-sm font-semibold">Modal Price Across Markets</span>
        <span className="text-text-3 text-xs">Avg ₹{avg.toLocaleString('en-IN')}/q</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="market" tick={{ fill: '#4E6357', fontSize: 10 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: '#4E6357', fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} width={44}
          />
          <Tooltip
            contentStyle={{
              background: '#0F1813', border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 8, fontSize: 12, color: '#E8F0EA',
            }}
            formatter={v => [`₹${v.toLocaleString('en-IN')}/q`, 'Modal']}
            labelStyle={{ color: '#8FA898' }}
          />
          <ReferenceLine y={avg} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 3" label={false} />
          <Area
            type="monotone" dataKey="price"
            stroke="#22C55E" strokeWidth={2}
            fill="url(#priceGrad)"
            dot={{ r: 3, fill: '#22C55E', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#22C55E', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Market() {
  const [crop, setCrop] = useState('Rice')
  const [state, setState] = useState('Maharashtra')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [marketSearch, setMarketSearch] = useState('')
  const [view, setView] = useState('table') // 'table' | 'heatmap'
  const [liveTickerItems, setLiveTickerItems] = useState(TICKER_BASE)
  const [activeTab, setActiveTab] = useState('prices') // 'prices' | 'navigator'
  const debouncedSearch = useDebounce(marketSearch, 300)

  // Fetch ticker prices for all crops on mount
  useEffect(() => {
    const DEFAULT_STATE = 'Maharashtra'
    Promise.allSettled(CROPS.map(c => marketApi.getPrices(c, DEFAULT_STATE)))
      .then(results => {
        const mapped = results
          .map((r, i) => {
            if (r.status !== 'fulfilled') return null
            const summary = r.value?.summary
            if (!summary?.modal_price) return null
            return {
              name: CROPS[i],
              price: Math.round(summary.modal_price),
              change: Math.round(r.value?.prices?.[0]?.price_change ?? 0),
            }
          })
          .filter(Boolean)
        if (mapped.length > 0) setLiveTickerItems(mapped)
        // else keep TICKER_BASE already in state
      })
  }, [])

  async function fetchPrices() {
    setLoading(true); setError(null)
    try {
      const res = await marketApi.getPrices(crop, state)
      setData(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPrices() }, [crop, state])

  const filteredPrices = useMemo(() => {
    if (!data?.prices) return []
    if (!debouncedSearch) return data.prices
    const q = debouncedSearch.toLowerCase()
    return data.prices.filter(r =>
      (r.market || r.market_name || '').toLowerCase().includes(q) ||
      (r.district || '').toLowerCase().includes(q)
    )
  }, [data, debouncedSearch])

  // Build live ticker items from loaded data (top prices for current crop)
  const tickerItems = useMemo(() => {
    if (!data?.prices?.length) return null
    return data.prices.slice(0, 8).map(r => ({
      name: `${crop} • ${(r.market || '').slice(0, 10)}`,
      price: r.modal_price ?? 0,
      change: r.price_change ?? 0,
    }))
  }, [data, crop])

  return (
    <div className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Market Prices</h1>
          <p className="text-text-3 text-sm mt-0.5">Live mandi rates across India</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-icon"
            onClick={() => setView(v => v === 'table' ? 'heatmap' : 'table')}
            title={view === 'table' ? 'Heat Map view' : 'Table view'}
            aria-label={view === 'table' ? 'Switch to heat map view' : 'Switch to table view'}
          >
            {view === 'table' ? <LayoutGrid size={15} aria-hidden="true" /> : <Table2 size={15} aria-hidden="true" />}
          </button>
          {filteredPrices.length > 0 && (
            <button className="btn-icon" onClick={() => exportCSV(filteredPrices, crop, state)} title="Export CSV" aria-label={`Export ${crop} prices in ${state} as CSV`}>
              <Download size={15} aria-hidden="true" />
            </button>
          )}
          <button className="btn-icon" onClick={fetchPrices} disabled={loading} aria-label="Refresh market prices">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── Mode tabs ── */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl" role="tablist" aria-label="Market view">
        {[['prices', <ShoppingBasket size={14} aria-hidden="true" />, 'Market Prices'], ['navigator', <Compass size={14} aria-hidden="true" />, '🧭 Mandi Navigator']].map(([tab, icon, label]) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-surface-1 text-text-1 shadow' : 'text-text-3 hover:text-text-2'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {activeTab === 'navigator' && <MandiNavigator farmerState={state} />}

      {activeTab === 'prices' && <>
      {/* ── Top Ticker ── */}
      <TopTicker liveItems={liveTickerItems} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            className="input w-full pl-8"
            placeholder="Search market / district…"
            value={marketSearch}
            onChange={e => setMarketSearch(e.target.value)}
            aria-label="Search by market or district name"
          />
        </div>
        <div className="relative">
          <select
            className="input appearance-none pr-8 cursor-pointer"
            value={crop}
            onChange={e => setCrop(e.target.value)}
            aria-label="Select crop"
          >
            {CROPS.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="input appearance-none pr-8 cursor-pointer" value={state} onChange={e => setState(e.target.value)} aria-label="Select state">
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
        </div>
      </div>

      {/* Summary cards */}
      {data?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Min Price',   value: data.summary.min_price,   fmt: v => `₹${Math.round(v).toLocaleString('en-IN')}`, accent: '#3B82F6' },
            { label: 'Max Price',   value: data.summary.max_price,   fmt: v => `₹${Math.round(v).toLocaleString('en-IN')}`, accent: '#22C55E' },
            { label: 'Modal Price', value: data.summary.modal_price, fmt: v => `₹${Math.round(v).toLocaleString('en-IN')}`, accent: '#22C55E' },
            { label: 'Markets',     value: data.summary.total_markets, fmt: v => Math.round(v).toString(), accent: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center" style={{ borderLeft: `3px solid ${s.accent}` }}>
              <p className="text-2xl font-bold text-text-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <AnimatedNumber value={s.value ?? 0} format={s.fmt} />
              </p>
              <p className="text-text-3 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Gradient price chart */}
      {data?.prices?.length > 2 && <PriceChart prices={data.prices} />}

      {/* Bloomberg terminal: table / heatmap */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <ShoppingBasket size={16} className="text-primary" />
          <span className="font-medium text-text-1">{crop}</span>
          <span className="text-text-3 text-sm">— {state}</span>
          {filteredPrices.length > 0 && (
            <span className="ml-auto text-text-3 text-xs">
              {filteredPrices.length} of {data?.prices?.length ?? 0} mandis
              {view === 'heatmap' && ' · top 16'}
            </span>
          )}
        </div>

        {loading ? (
          <SkeletonCard rows={5} className="rounded-none border-0 shadow-none" />
        ) : error ? (
          <EmptyState title="Could not load prices" description={error} action={{ label: 'Retry', onClick: fetchPrices }} className="rounded-none border-0" />
        ) : !data?.prices?.length ? (
          <EmptyState title="No price data" description="No mandi data found for this crop and state. Try a different selection." className="rounded-none border-0" />
        ) : view === 'heatmap' ? (
          <HeatMapView rows={filteredPrices} />
        ) : (
          <VirtualTable rows={filteredPrices} crop={crop} state={state} />
        )}
      </div>

      {/* ── Bottom Ticker ── */}
      <BottomTicker liveItems={liveTickerItems} />

      {data?.last_updated && (
        <p className="text-text-3 text-xs text-right">Updated: {new Date(data.last_updated).toLocaleString()}</p>
      )}
      </>}
    </div>
  )
}


