import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, animate } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import {
  Search, Bell, User, Sprout, MapPin, AlertTriangle, HeartPulse,
  Camera, CloudSun, TrendingUp, FlaskConical, Bot, Leaf,
  RefreshCw, Wind, Droplets, ChevronRight, WifiOff, Thermometer
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { weatherApi, analyticsApi } from '../api/client'
import YieldPredictor from '../components/YieldPredictor'
import SkeletonCard from '../components/common/SkeletonCard'
import GlobeVisualization from '../components/GlobeVisualization'

// ── Greeting helper ────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function greetingEmoji() {
  const h = new Date().getHours()
  if (h < 6)  return '🌙'
  if (h < 12) return '🌱'
  if (h < 17) return '☀️'
  return '🌾'
}

// ── Hexagon SVG background pattern ─────────────────────
const HEX_PATTERN = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='100'><polygon points='28,2 54,17 54,47 28,62 2,47 2,17' fill='none' stroke='rgba(34,197,94,1)' stroke-width='0.6'/><polygon points='28,52 54,67 54,97 28,112 2,97 2,67' fill='none' stroke='rgba(34,197,94,1)' stroke-width='0.6'/></svg>`

// ── Animated counter ───────────────────────────────────
function AnimatedNumber({ to, suffix = '', fixed = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const ctrl = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = fixed > 0 ? v.toFixed(fixed) + suffix : Math.round(v) + suffix
      },
    })
    return () => ctrl.stop()
  }, [to, suffix, fixed])
  return <span ref={ref}>0{suffix}</span>
}

// ── Mini sparkline ─────────────────────────────────────
function MiniSparkline({ data, color }) {
  const pts = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={pts} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          dot={false} isAnimationActive={true} animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Hero Stat Card ─────────────────────────────────────
function HeroStatCard({ icon: Icon, iconColor, label, value, suffix = '', fixed = 0, spark, sparkColor, detail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-lg flex flex-col gap-1 p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(21,32,25,0.95) 0%, rgba(15,24,19,0.95) 100%)',
        border: '1px solid rgba(34,197,94,0.1)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Glow blob */}
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl" style={{ background: `${iconColor}22` }} />
      <div className="flex items-center gap-2 mb-0.5">
        <Icon size={14} style={{ color: iconColor }} />
        <span className="text-xs text-text-3 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text-1 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <AnimatedNumber to={typeof value === 'number' ? value : parseFloat(value) || 0} suffix={suffix} fixed={fixed} />
      </p>
      {detail && <p className="text-xs text-text-3 mt-0.5">{detail}</p>}
      {spark && <div className="mt-1 -mx-1"><MiniSparkline data={spark} color={iconColor} /></div>}
    </motion.div>
  )
}

// ── Weather icon map ───────────────────────────────────
const ICON_MAP = {
  '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️',
}

// ── Stat Card ──────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, label, value, sub, subColor = 'text-text-3' }) {
  return (
    <div className="card p-5 flex items-center gap-4 transition-all duration-200 hover:border-border-strong hover:bg-surface-2">
      <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-text-3 text-xs font-medium">{label}</p>
        <p className="text-text-1 text-xl font-bold leading-tight">{value}</p>
        <p className={`text-xs mt-0.5 ${subColor}`}>{sub}</p>
      </div>
    </div>
  )
}

// ── Quick Action Card ──────────────────────────────────
function ActionCard({ icon: Icon, iconBg, textColor, label, to }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      aria-label={label}
      className="card p-4 flex flex-col items-center gap-2.5 transition-all duration-200
                 hover:border-border-strong hover:bg-surface-2 active:scale-95 cursor-pointer"
    >
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={textColor} />
      </div>
      <span className="text-text-2 text-xs font-medium text-center leading-tight">{label}</span>
    </button>
  )
}

// ── Weather Widget ─────────────────────────────────────
function WeatherWidget() {
  const navigate = useNavigate()
  const [wx, setWx] = useState({ status: 'loading' })

  const load = useCallback(async () => {
    setWx({ status: 'loading' })
    let lat = 18.52, lon = 73.85
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000, maximumAge: 300000 })
      )
      lat = pos.coords.latitude
      lon = pos.coords.longitude
    } catch { /* use defaults */ }

    try {
      const data = await weatherApi.getIntelligence(lat, lon)
      const cur  = data.current
      const code = (cur.icon || '01d').substring(0, 2)
      let advice = 'Conditions look good for farming today.'
      if (data.risk_alerts?.length) {
        advice = data.risk_alerts[0].action_required || data.risk_alerts[0].description || advice
      } else if (data.irrigation_advice?.recommendation) {
        advice = data.irrigation_advice.recommendation
      }
      setWx({
        status: 'ok',
        temp: `${Math.round(cur.temperature)}°C`,
        condition: cur.description || 'Clear',
        icon: ICON_MAP[code] || '🌤️',
        humidity: cur.humidity,
        wind: cur.wind_speed,
        location: data.location || '',
        advice,
        riskScore: data.overall_risk_score,
      })
    } catch {
      const h = new Date().getHours()
      setWx({
        status: 'offline',
        temp: h < 10 ? '22°C' : h < 16 ? '32°C' : '27°C',
        icon: '📡',
        condition: 'Offline',
        advice: 'Weather unavailable — check server connection.',
      })
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        {/* Left: temp + icon */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-4xl leading-none select-none">
            {wx.status === 'loading' ? '🌤️' : wx.icon}
          </span>
          <div>
            {wx.status === 'loading' ? (
              <>
                <div className="skeleton h-7 w-20 mb-1.5" />
                <div className="skeleton h-4 w-28" />
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-text-1">{wx.temp}</span>
                  {wx.humidity != null && (
                    <span className="text-xs text-text-3 flex items-center gap-1">
                      <Droplets size={11} /> {wx.humidity}%
                    </span>
                  )}
                  {wx.wind != null && (
                    <span className="text-xs text-text-3 flex items-center gap-1">
                      <Wind size={11} /> {wx.wind} km/h
                    </span>
                  )}
                </div>
                <p className="text-text-2 text-sm capitalize">{wx.condition}</p>
              </>
            )}
          </div>
        </div>

        {/* Right: advice + action */}
        <div className="flex-1 min-w-0 hidden sm:block">
          {wx.status === 'loading' ? (
            <div className="skeleton h-4 w-full" />
          ) : (
            <p className="text-text-2 text-sm leading-relaxed line-clamp-2">{wx.advice}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={load}
            disabled={wx.status === 'loading'}
            className="btn-icon disabled:opacity-40"
            aria-label="Refresh weather"
            title="Refresh"
          >
            <RefreshCw size={15} className={wx.status === 'loading' ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => navigate('/weather')}
            className="btn-secondary text-xs px-3 py-1.5 hidden sm:flex"
          >
            Full Forecast <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Mobile advice */}
      {wx.status !== 'loading' && wx.advice && (
        <p className="text-text-2 text-sm mt-3 sm:hidden leading-relaxed">{wx.advice}</p>
      )}

      {/* Risk bar */}
      {wx.riskScore != null && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-text-3 mb-1.5">
            <span>Farm Risk Score</span>
            <span className={wx.riskScore > 60 ? 'text-red-400' : wx.riskScore > 30 ? 'text-amber-400' : 'text-primary'}>
              {wx.riskScore}/100
            </span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                wx.riskScore > 60 ? 'bg-red-500' : wx.riskScore > 30 ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${wx.riskScore}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Home ──────────────────────────────────────────
export default function Home() {
  const { state, homeStats, dispatch } = useApp()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [liveTemp, setLiveTemp] = useState(null)  // { temp, condition, location }
  const [impactStats, setImpactStats] = useState({
    total_farmers: 847,
    disease_detections: 3241,
    avg_confidence: 94.2,
    states_covered: 12,
  })
  const [impactLoading, setImpactLoading] = useState(true)

  // Fetch platform-wide impact stats on mount
  useEffect(() => {
    analyticsApi.getYieldSummary()
      .then(res => {
        if (res) {
          setImpactStats(prev => ({
            total_farmers:      res.total_farmers      ?? prev.total_farmers,
            disease_detections: res.disease_detections ?? prev.disease_detections,
            avg_confidence:     res.avg_confidence     ?? prev.avg_confidence,
            states_covered:     res.states_covered     ?? prev.states_covered,
          }))
        }
      })
      .catch(() => { /* keep defaults */ })
      .finally(() => setImpactLoading(false))
  }, [])

  // Fetch live temperature from user's location on mount
  useEffect(() => {
    let cancelled = false
    async function fetchTemp() {
      let lat = 18.52, lon = 73.85
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000, maximumAge: 600000 })
        )
        lat = pos.coords.latitude
        lon = pos.coords.longitude
      } catch { /* use defaults */ }
      try {
        const data = await weatherApi.getIntelligence(lat, lon)
        if (!cancelled && data?.current) {
          setLiveTemp({
            temp: `${Math.round(data.current.temperature)}°C`,
            condition: data.current.description || 'Clear',
            location: data.location || '',
          })
        }
      } catch { /* silent */ }
    }
    fetchTemp()
    return () => { cancelled = true }
  }, [])

  const greeting = getGreeting()
  const emoji    = greetingEmoji()
  const name     = state.farmer?.name?.split(' ')[0] || 'Farmer'
  const alertCount = homeStats.alerts
  const unreadCount = state.notifications.filter(n => !n.read).length

  const SEARCH_ROUTES = [
    { q: ['disease', 'scan', 'detect'], to: '/disease' },
    { q: ['pest', 'insect'],            to: '/pest' },
    { q: ['market', 'price', 'mandi'], to: '/market' },
    { q: ['weather', 'rain', 'cloud'],  to: '/weather' },
    { q: ['chat', 'ai', 'bot'],         to: '/chatbot' },
    { q: ['crop', 'advisor', 'recom'],  to: '/crop' },
    { q: ['cycle', 'track'],            to: '/crop-cycle' },
    { q: ['fertilizer', 'npk'],        to: '/fertilizer' },
    { q: ['expense', 'profit'],         to: '/expense' },
    { q: ['scheme', 'govt', 'subsidy'], to: '/schemes' },
    { q: ['analytics', 'data'],         to: '/analytics' },
    { q: ['complaint', 'report'],       to: '/complaints' },
    { q: ['outbreak', 'map'],           to: '/outbreak-map' },
    { q: ['profile', 'account'],        to: '/profile' },
  ]

  function handleSearch(e) {
    if (e.key === 'Enter' && searchQ.trim()) {
      const q = searchQ.toLowerCase()
      const match = SEARCH_ROUTES.find(r => r.q.some(keyword => q.includes(keyword)))
      if (match) navigate(match.to)
      setSearchOpen(false)
      setSearchQ('')
    }
    if (e.key === 'Escape') { setSearchOpen(false); setSearchQ('') }
  }

  return (
    <div className="page-content space-y-5">

      {/* ── Hero Section ── */}
      <section
        className="relative rounded-xl overflow-hidden px-6 py-7"
        style={{
          background: 'linear-gradient(135deg, #0d1f14 0%, #07120d 100%)',
          border: '1px solid rgba(34,197,94,0.1)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Hexagon background pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(HEX_PATTERN)}")`,
            backgroundSize: '56px 100px',
            opacity: 0.03,
          }}
        />

        {/* Greeting row */}
        <div className="relative flex items-start justify-between mb-5 gap-4">
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-text-3 text-sm font-medium mb-0.5"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </motion.p>
            <motion.h1
              className="font-display text-2xl sm:text-3xl font-bold text-text-1 flex items-center gap-2"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              {greeting}, <span className="text-primary">{name}</span>
              <span className="text-2xl leading-none select-none">{emoji}</span>
            </motion.h1>
            {[state.farmer?.district, state.farmer?.state].filter(Boolean).length > 0 && (
              <motion.p
                className="text-text-3 text-sm mt-1 flex items-center gap-1.5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              >
                <MapPin size={12} />
                {[state.farmer?.district, state.farmer?.state].filter(Boolean).join(', ')}
              </motion.p>
            )}
          </div>
          {/* 3D Globe — desktop only */}
          <div className="hidden md:block shrink-0" style={{ width: 200, height: 200, marginTop: -8 }}>
            <GlobeVisualization />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 md:hidden">
            {!state.isOnline && <span className="badge badge-yellow"><WifiOff size={10} /> Offline</span>}
          </div>
        </div>

        <div className="relative flex flex-wrap items-center gap-2 mb-4">
          <span
            className="badge"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            🤖 AI-Powered
          </span>
          <span
            className="badge"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            🛰️ Powered by Sentinel-2
          </span>
        </div>

        {/* Hero stat strip */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
          <HeroStatCard
            icon={AlertTriangle}
            iconColor="#F59E0B"
            label="Active Alerts"
            value={homeStats.alerts}
            suffix=""
            spark={[0, 1, 0, 2, homeStats.alerts, homeStats.alerts]}
            sparkColor="#F59E0B"
            detail={homeStats.alerts > 0 ? 'Needs attention' : 'All clear today'}
          />
          <HeroStatCard
            icon={Sprout}
            iconColor="#22C55E"
            label="Crops Monitored"
            value={homeStats.activeCrops}
            suffix=""
            spark={[1, 2, homeStats.activeCrops, homeStats.activeCrops, homeStats.activeCrops, homeStats.activeCrops]}
            sparkColor="#22C55E"
            detail={`${homeStats.totalAcres.toFixed(1)} acres total`}
          />
          <HeroStatCard
            icon={TrendingUp}
            iconColor="#3B82F6"
            label="Market Index"
            value={homeStats.totalLands > 0 ? 82 + homeStats.totalLands : 78}
            suffix=""
            spark={[72, 75, 78, 80, 82, homeStats.totalLands > 0 ? 82 + homeStats.totalLands : 78]}
            sparkColor="#3B82F6"
            detail="Price trend: stable"
          />
          <HeroStatCard
            icon={CloudSun}
            iconColor="#22D3EE"
            label="Weather Score"
            value={liveTemp ? 88 : 72}
            suffix="/100"
            spark={[60, 65, 70, 75, 80, liveTemp ? 88 : 72]}
            sparkColor="#22D3EE"
            detail={liveTemp ? liveTemp.condition : 'Fetching…'}
          />
        </div>
      </section>

      {/* ── Header (search + notifications) ── */}
      <header className="flex items-center justify-between pt-1">
        <div className="min-w-0">
          {!state.isOnline && (
            <span className="badge badge-yellow sm:hidden">
              <WifiOff size={10} /> Offline
            </span>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                id="home-search"
                aria-label="Search features"
                className="input w-48 sm:w-64 text-sm py-1.5"
                placeholder="Search features…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          ) : (
            <button className="btn-icon" aria-label="Open search" onClick={() => setSearchOpen(true)} title="Search">
              <Search size={17} />
            </button>
          )}

          {/* Notifications */}
          <button
            className="btn-icon relative"
            aria-label={`Notifications${(alertCount + unreadCount) > 0 ? `, ${alertCount + unreadCount} unread` : ''}`}
            title="Notifications"
            onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}
          >
            <Bell size={17} aria-hidden="true" />
            {(alertCount + unreadCount) > 0 && (
              <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {alertCount + unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            className="w-8 h-8 rounded bg-primary-dim text-primary text-sm font-bold flex items-center justify-center hover:bg-primary-glow transition-colors duration-150"
            onClick={() => navigate('/profile')}
            aria-label="Go to profile page"
            title="Profile"
          >
            {state.farmer?.name?.charAt(0)?.toUpperCase() || <User size={15} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          icon={Thermometer}
          iconBg={liveTemp ? 'bg-orange-500/10 text-orange-400' : 'bg-surface-3 text-text-3'}
          label="Temperature"
          value={liveTemp ? liveTemp.temp : '--°C'}
          sub={liveTemp ? liveTemp.condition : 'Fetching…'}
          subColor={liveTemp ? 'text-orange-400' : 'text-text-3'}
        />
        <StatCard
          icon={Sprout}
          iconBg="bg-primary/10 text-primary"
          label="Active Crops"
          value={homeStats.activeCrops}
          sub={homeStats.activeCrops > 0 ? `${homeStats.activeCrops} growing` : 'Add a crop cycle'}
          subColor="text-text-3"
        />
        <StatCard
          icon={MapPin}
          iconBg="bg-blue-500/10 text-blue-400"
          label="Total Lands"
          value={homeStats.totalLands}
          sub={`${homeStats.totalAcres.toFixed(1)} acres`}
          subColor="text-text-3"
        />
        <StatCard
          icon={AlertTriangle}
          iconBg={alertCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-surface-3 text-text-3'}
          label="Alerts"
          value={homeStats.alerts}
          sub={alertCount > 0 ? 'Needs attention' : 'All clear'}
          subColor={alertCount > 0 ? 'text-amber-400' : 'text-primary'}
        />
        <StatCard
          icon={HeartPulse}
          iconBg={
            homeStats.avgHealth == null ? 'bg-surface-3 text-text-3'
            : homeStats.avgHealth >= 70 ? 'bg-primary/10 text-primary'
            : homeStats.avgHealth >= 50 ? 'bg-amber-500/10 text-amber-400'
            : 'bg-red-500/10 text-red-400'
          }
          label="Crop Health"
          value={homeStats.avgHealth != null ? `${homeStats.avgHealth}%` : '--%'}
          sub={
            homeStats.avgHealth == null ? 'No active crops'
            : homeStats.avgHealth >= 70 ? 'Good'
            : homeStats.avgHealth >= 50 ? 'Fair'
            : 'Needs care'
          }
          subColor={
            homeStats.avgHealth == null ? 'text-text-3'
            : homeStats.avgHealth >= 70 ? 'text-primary'
            : homeStats.avgHealth >= 50 ? 'text-amber-400'
            : 'text-red-400'
          }
        />
      </div>

      {/* ── Weather Widget ── */}
      <WeatherWidget />

      {/* ── Quick Actions ── */}
      <section aria-label="Quick actions">
        <h2 className="font-display text-text-2 text-sm font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <ActionCard icon={Camera}       iconBg="bg-primary/10"        textColor="text-primary"    label="Scan Crop"    to="/disease" />
          <ActionCard icon={CloudSun}     iconBg="bg-blue-500/10"       textColor="text-blue-400"   label="Weather"      to="/weather" />
          <ActionCard icon={TrendingUp}   iconBg="bg-amber-500/10"      textColor="text-amber-400"  label="Prices"       to="/market" />
          <ActionCard icon={FlaskConical} iconBg="bg-purple-500/10"     textColor="text-purple-400" label="Soil & Fert."  to="/fertilizer" />
          <ActionCard icon={Bot}          iconBg="bg-cyan-500/10"       textColor="text-cyan-400"   label="AI Chat"      to="/chatbot" />
          <ActionCard icon={Leaf}         iconBg="bg-primary/10"        textColor="text-primary"    label="Crop Tips"    to="/crop" />
        </div>
      </section>

      {/* ── Active Crop Cycles ── */}
      {homeStats.activeCrops > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-text-2 text-sm font-semibold">Active Crop Cycles</h2>
            <button onClick={() => navigate('/crop-cycle')} className="btn-ghost text-xs py-1 px-2">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {(state.cycles || [])
              .filter(c => c.status !== 'completed')
              .slice(0, 3)
              .map((cycle, i) => {
                const health = cycle.health_score ?? cycle.healthScore
                const isLow  = health != null && health < 70
                return (
                  <div
                    key={cycle.id || i}
                    className="card p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-2 hover:border-border-strong transition-all duration-150"
                    onClick={() => navigate('/crop-cycle')}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <Sprout size={15} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-text-1 text-sm font-medium capitalize truncate">
                          {cycle.crop_name || cycle.cropName || 'Unknown Crop'}
                        </p>
                        <p className="text-text-3 text-xs truncate">
                          {cycle.land_name || cycle.landName || 'Unknown Land'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {health != null && (
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${isLow ? 'text-amber-400' : 'text-primary'}`}>
                            {health}%
                          </p>
                          <p className="text-text-3 text-xs">health</p>
                        </div>
                      )}
                      <span className={`badge ${isLow ? 'badge-yellow' : 'badge-green'}`}>
                        {cycle.status || 'active'}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      )}

      {/* ── Platform Impact Stats ── */}
      <section aria-label="Platform impact statistics">
        <h2 className="font-display text-text-2 text-sm font-semibold mb-3">Platform Impact</h2>
        <div role="status" aria-live="polite" aria-label={impactLoading ? 'Loading impact statistics' : ''}>
        {impactLoading ? (
          <SkeletonCard rows={2} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Sprout,      color: '#22C55E', label: 'Farmers Helped',      value: impactStats.total_farmers,      suffix: '+', fixed: 0 },
              { icon: HeartPulse,  color: '#F59E0B', label: 'Disease Detections',  value: impactStats.disease_detections, suffix: '+', fixed: 0 },
              { icon: TrendingUp,  color: '#3B82F6', label: 'Avg Accuracy',        value: impactStats.avg_confidence,     suffix: '%', fixed: 1 },
              { icon: MapPin,      color: '#A78BFA', label: 'States Covered',      value: impactStats.states_covered,     suffix: '',  fixed: 0 },
              { icon: Leaf,        color: '#10B981', label: 'Carbon Credits',      staticValue: '8,473 tCO2',             sub: 'Carbon sequestration tracked' },
              { icon: RefreshCw,   color: '#8B5CF6', label: 'Satellite Scans',     staticValue: '5-Day Cycle',            sub: 'Sentinel-2 satellite refresh' },
            ].map(({ icon: Icon, color, label, value, suffix, fixed, staticValue, sub }) => (
              <div
                key={label}
                className="card p-4 flex flex-col gap-1"
                style={{ borderLeft: `3px solid ${color}` }}
              >
                <div className="flex items-center gap-1.5">
                  <Icon size={13} style={{ color }} />
                  <span className="text-text-3 text-xs font-medium">{label}</span>
                </div>
                <p className="text-2xl font-bold text-text-1 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {staticValue ? (
                    staticValue
                  ) : (
                    <AnimatedNumber
                      to={typeof value === 'number' ? value : parseFloat(value) || 0}
                      suffix={suffix}
                      fixed={fixed}
                    />
                  )}
                </p>
                {sub && <p className="text-xs text-text-3 mt-0.5">{sub}</p>}
              </div>
            ))}
          </div>
        )}
        </div>
      </section>
      {state.farmer && <YieldPredictor />}

      {/* ── No farmer CTA ── */}
      {!state.farmer && (
        <div className="card p-6 text-center border-border-strong">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Leaf size={22} className="text-primary" />
          </div>
          <h3 className="font-display text-text-1 font-semibold mb-1">Welcome to AgriSahayak</h3>
          <p className="text-text-2 text-sm mb-4">Your AI-powered farming companion. Create a profile to get started.</p>
          <button onClick={() => navigate('/profile')} className="btn-primary mx-auto">
            Get Started
          </button>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
