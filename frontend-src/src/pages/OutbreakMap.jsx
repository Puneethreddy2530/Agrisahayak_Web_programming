import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Satellite,
  TrendingUp,
  X,
} from 'lucide-react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { outbreakMapApi } from '../api/client'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import { useOutbreakMapStore } from '../store/useOutbreakMapStore'

const STATUS_DOT = {
  red: 'bg-red-400 animate-pulse',
  yellow: 'bg-amber-400',
  green: 'bg-emerald-400',
}

const STATUS_BADGE = {
  red: 'badge-red',
  yellow: 'badge-yellow',
  green: 'badge-green',
}

const STATUS_LABEL = {
  red: 'High Risk',
  yellow: 'Moderate',
  green: 'Low Risk',
}

const CIRCLE_COLOR = {
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#10b981',
}

const INDIA_CENTER = [20.5937, 78.9629]

// ── Inject pulse keyframes once ──────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('outbreak-pulse-styles')) {
  const s = document.createElement('style')
  s.id = 'outbreak-pulse-styles'
  s.textContent = `
    @keyframes outbreak-ripple {
      0%   { transform: scale(0.7); opacity: 0.55; }
      100% { transform: scale(2.8); opacity: 0; }
    }
  `
  document.head.appendChild(s)
}

// ── Custom pulsing DivIcon ────────────────────────────────────────────────────
function createPulseIcon(color, caseCount) {
  const size = Math.max(14, Math.min(56, (Number(caseCount) || 0) * 1.5 + 14))
  const dot  = Math.max(6, Math.round(size * 0.4))
  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;">
      <span style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.25;
        animation:outbreak-ripple 1.8s ease-out infinite;"></span>
      <span style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.15;
        animation:outbreak-ripple 1.8s ease-out 0.65s infinite;"></span>
      <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:${dot}px;height:${dot}px;border-radius:50%;background:${color};
        box-shadow:0 0 8px ${color}80;"></span>
    </div>`
  return L.divIcon({
    html,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2)],
  })
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

// ── Memoized map — only re-renders when the clusters array reference changes ────
const MemoMap = memo(function MapView({ clusters, showNdviLayer }) {
  return (
    <div className="relative">
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        scrollWheelZoom
        style={{ height: '440px', width: '100%', background: '#0d1117' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        {showNdviLayer && (
          <TileLayer
            url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/2024-01-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
            attribution="NASA GIBS - MODIS NDVI"
            opacity={0.5}
          />
        )}
        {clusters.map((cluster, index) => {
          const lat = toNumber(cluster.lat)
          const lng = toNumber(cluster.lng)
          if (lat === null || lng === null) return null
          const color = CIRCLE_COLOR[cluster.status] || '#6b7280'
          return (
            <Marker
              key={`${cluster.district}-${cluster.state}-${index}`}
              position={[lat, lng]}
              icon={createPulseIcon(color, cluster.total_cases)}
            >
              <Popup>
                <div className="min-w-[190px]">
                  <div className="font-semibold text-sm mb-1">
                    {cluster.district}, {cluster.state}
                  </div>
                  <div className="font-medium text-xs mb-2" style={{ color }}>
                    {STATUS_LABEL[cluster.status] || cluster.status}
                  </div>
                  <div className="text-xs text-gray-700">Total Cases: {cluster.total_cases}</div>
                  <div className="text-xs text-gray-700">Severity Score: {cluster.severity_score}</div>
                  {cluster.severe_count > 0 && (
                    <div className="text-xs text-red-600">Severe: {cluster.severe_count}</div>
                  )}
                  <ul className="mt-2 pl-4 text-xs text-gray-700 list-disc">
                    {Object.entries(cluster.diseases || {}).map(([disease, count]) => (
                      <li key={disease}>{disease}: <strong>{count}</strong></li>
                    ))}
                  </ul>
                  {cluster.last_case && (
                    <div className="text-[11px] text-gray-500 mt-2">
                      Last: {new Date(cluster.last_case).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Legend overlay — bottom-left of map */}
      <div
        className="absolute bottom-8 left-3 z-[1000] rounded-xl px-3 py-2.5 space-y-1.5"
        style={{
          background: 'rgba(9,16,14,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <p className="text-text-3 text-[10px] font-medium uppercase tracking-wider mb-2">Severity</p>
        {[
          { color: '#ef4444', label: 'High Risk' },
          { color: '#f59e0b', label: 'Moderate'  },
          { color: '#10b981', label: 'Low Risk'  },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="relative flex items-center justify-center" style={{ width: 14, height: 14 }}>
              <span className="absolute inset-0 rounded-full" style={{ background: color, opacity: 0.22, animation: 'outbreak-ripple 1.8s ease-out infinite' }} />
              <span className="block rounded-full" style={{ width: 6, height: 6, background: color, boxShadow: `0 0 5px ${color}` }} />
            </span>
            <span className="text-text-2 text-xs">{label}</span>
          </div>
        ))}
        <p className="text-text-3 pt-1 border-t border-white/5" style={{ fontSize: 10 }}>Dot size = case count</p>
      </div>
    </div>
  )
})

export default function OutbreakMap() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSeedingDemo, setIsSeedingDemo] = useState(false)
  const [seedMsg, setSeedMsg] = useState(null)
  const [showNdviLayer, setShowNdviLayer] = useState(false)
  const [error, setError] = useState(null)
  const seedToastTimer = useRef(null)

  const {
    search,
    stateFilter,
    statusFilter,
    setSearch,
    setStateFilter,
    setStatusFilter,
    resetFilters,
  } = useOutbreakMapStore()

  // Debounced search: typing updates searchInput immediately; store is updated after 300 ms
  const [searchInput, setSearchInput] = useState(search)
  const [showAll,     setShowAll]     = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await outbreakMapApi.getClusters(30)
      setData(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Commit debounced search value to the store
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Reset pagination whenever active filters change
  useEffect(() => { setShowAll(false) }, [search, stateFilter, statusFilter])

  function showSeedToast(msg) {
    if (seedToastTimer.current) clearTimeout(seedToastTimer.current)
    setSeedMsg(msg)
    seedToastTimer.current = setTimeout(() => setSeedMsg(null), 6000)
  }

  async function handleSeed() {
    setIsSeedingDemo(true)
    setSeedMsg(null)
    try {
      const res = await outbreakMapApi.seedDemoData(1000)
      showSeedToast({ ok: true, count: res.count, text: `✅ ${res.count} outbreak records seeded!` })
      await load()
    } catch (e) {
      showSeedToast({ ok: false, text: e.message || 'Seed failed' })
    } finally {
      setIsSeedingDemo(false)
    }
  }

  const clusters = data?.clusters || []
  const states = useMemo(
    () => ['all', ...new Set(clusters.map((c) => c.state).filter(Boolean)).values()],
    [clusters],
  )

  const filtered = useMemo(() => {
    return clusters.filter((cluster) => {
      const q = search.toLowerCase()
      const matchQ =
        !q ||
        cluster.district?.toLowerCase().includes(q) ||
        cluster.state?.toLowerCase().includes(q) ||
        Object.keys(cluster.diseases || {}).some((disease) => disease.toLowerCase().includes(q))

      const matchState = stateFilter === 'all' || cluster.state === stateFilter
      const matchStatus = statusFilter === 'all' || cluster.status === statusFilter

      return matchQ && matchState && matchStatus
    })
  }, [clusters, search, stateFilter, statusFilter])

  const redCount    = clusters.filter((c) => c.status === 'red').length
  const yellowCount  = clusters.filter((c) => c.status === 'yellow').length
  const greenCount   = clusters.filter((c) => c.status === 'green').length

  // Stable event handlers — avoids inline-arrow re-creation on every render
  const handleSearchInput  = useCallback(e => setSearchInput(e.target.value), [])
  const handleStateFilter  = useCallback(e => setStateFilter(e.target.value),  [setStateFilter])
  const handleStatusFilter = useCallback(e => setStatusFilter(e.target.value), [setStatusFilter])

  // Cap sidebar list at 100 items until the user explicitly asks for more
  const LIST_LIMIT = 100
  const visibleList = useMemo(
    () => (showAll || filtered.length <= LIST_LIMIT ? filtered : filtered.slice(0, LIST_LIMIT)),
    [filtered, showAll],
  )

  return (
    <div className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Outbreak Map</h1>
          <p className="text-text-3 text-sm mt-0.5">
            District-level disease outbreak intelligence across India
            {data?.is_demo && <span className="ml-2 badge badge-yellow text-xs">Demo Data</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5"
            onClick={handleSeed}
            disabled={isSeedingDemo}
          >
            {isSeedingDemo
              ? <Loader2 size={13} className="animate-spin" />
              : <Database size={13} />}
            {isSeedingDemo ? 'Generating...' : 'Generate 1000 Records'}
          </button>
          <button
            className={`btn-secondary flex items-center gap-1.5 text-xs px-3 py-1.5 ${showNdviLayer ? 'border-violet-500/50 text-violet-300' : ''}`}
            onClick={() => setShowNdviLayer(v => !v)}
          >
            <Satellite size={13} />
            {showNdviLayer ? '🛰️ NDVI Active' : 'Satellite Layer'}
          </button>
          <button className="btn-icon" onClick={load} disabled={loading} aria-label="Refresh outbreak map data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {seedMsg && (
          <motion.div
            key="seed-toast"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm border ${
              seedMsg.ok
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}
          >
            <CheckCircle size={15} className={seedMsg.ok ? 'text-emerald-400 shrink-0' : 'text-red-400 shrink-0'} />
            <span className="flex-1">{seedMsg.text}</span>
            {seedMsg.ok && (
              <button
                className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                onClick={() => { setSeedMsg(null); load() }}
              >
                Refresh Map
              </button>
            )}
            <button
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => setSeedMsg(null)}
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="card p-3 border-red-500/30 bg-red-500/5"
          >
            <p className="text-text-3 text-xs mb-1 flex items-center gap-1">
              <AlertTriangle size={11} className="text-red-400" /> Red Zones
            </p>
            <p className="text-2xl font-bold text-red-400">{redCount}</p>
            <p className="text-text-3 text-xs">High risk districts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
            className="card p-3 border-amber-500/30 bg-amber-500/5"
          >
            <p className="text-text-3 text-xs mb-1 flex items-center gap-1">
              <Activity size={11} className="text-amber-400" /> Yellow Zones
            </p>
            <p className="text-2xl font-bold text-amber-400">{yellowCount}</p>
            <p className="text-text-3 text-xs">Moderate risk districts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="card p-3 border-emerald-500/30 bg-emerald-500/5"
          >
            <p className="text-text-3 text-xs mb-1 flex items-center gap-1">
              <TrendingUp size={11} className="text-emerald-400" /> Green Zones
            </p>
            <p className="text-2xl font-bold text-emerald-400">{greenCount}</p>
            <p className="text-text-3 text-xs">Low risk districts</p>
          </motion.div>
        </div>
      )}

      {redCount > 0 && !loading && (
        <div className="card p-4 border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-text-2 text-sm">
            {redCount} high-risk district{redCount !== 1 ? 's' : ''} detected. Farmers in affected
            areas should take preventive action immediately.
          </p>
        </div>
      )}

      <div className="card overflow-hidden" role="region" aria-label="Disease outbreak map of India">
        <MemoMap clusters={filtered} showNdviLayer={showNdviLayer} />
      </div>

      <div
        className="rounded-xl p-3"
        style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p className="text-text-3 text-xs font-medium uppercase tracking-wider mb-3">Filter Outbreaks</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              className="input w-full pl-8"
              placeholder="Search district, state or disease..."
              aria-label="Search by district, state or disease"
              value={searchInput}
              onChange={handleSearchInput}
            />
          </div>

          <select className="input" value={stateFilter} onChange={handleStateFilter} aria-label="Filter outbreaks by state">
            {states.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName === 'all' ? 'All States' : stateName}
              </option>
            ))}
          </select>

          <select className="input" value={statusFilter} onChange={handleStatusFilter} aria-label="Filter outbreaks by risk level">
            <option value="all">All Risk Levels</option>
            <option value="red">High Risk</option>
            <option value="yellow">Moderate</option>
            <option value="green">Low Risk</option>
          </select>

          <button className="btn-secondary" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonCard rows={6} />
      ) : error ? (
        <EmptyState title="Could not load outbreaks" description={error} action={{ label: 'Retry', onClick: load }} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No outbreaks found"
          description="No district data matches your current filters. Try adjusting or resetting them."
          action={{ label: 'Reset Filters', onClick: resetFilters }}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="text-text-2 text-sm font-medium">
              {filtered.length} district{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-text-3 text-xs">Last 30 days</span>
          </div>
          <div className="divide-y divide-border">
            {visibleList.map((cluster, index) => (
              <div key={index} className="p-4 flex items-start gap-4 hover:bg-surface-2 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${STATUS_DOT[cluster.status] || 'bg-text-3'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-text-1 font-medium text-sm">{cluster.district}</span>
                    <span className="text-text-3 text-xs">{cluster.state}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-1">
                    {Object.entries(cluster.diseases || {}).map(([disease, count]) => (
                      <span key={disease} className="badge text-xs">
                        {disease} ({count})
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-text-3 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> {cluster.total_cases} case
                      {cluster.total_cases !== 1 ? 's' : ''}
                    </span>
                    {cluster.severe_count > 0 && <span className="text-red-400">{cluster.severe_count} severe</span>}
                    {cluster.last_case && <span>Last: {new Date(cluster.last_case).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`badge ${STATUS_BADGE[cluster.status] || 'badge'}`}>
                    {STATUS_LABEL[cluster.status] || cluster.status}
                  </span>
                  <span className="text-text-3 text-xs">Score: {cluster.severity_score}</span>
                </div>
              </div>
            ))}
            {!showAll && filtered.length > LIST_LIMIT && (
              <div className="px-4 py-3 flex items-center justify-center">
                <button
                  className="btn-secondary text-sm"
                  onClick={() => setShowAll(true)}
                >
                  Show {filtered.length - LIST_LIMIT} more district{filtered.length - LIST_LIMIT !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
