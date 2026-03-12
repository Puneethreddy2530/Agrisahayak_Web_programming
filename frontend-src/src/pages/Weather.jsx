import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Cloud, Droplets, Wind, Eye, RefreshCw, MapPin,
  AlertTriangle, ShieldCheck, Sprout, Droplet
} from 'lucide-react'
import { weatherApi } from '../api/client'
import SkeletonCard from '../components/common/SkeletonCard'
import { useT } from '../i18n'

// ── Condition helpers ────────────────────────────────────────────────────────

function getConditionType(icon, description) {
  if (!icon && !description) return 'default'
  const code = icon ? icon.replace(/[dn]$/, '') : ''
  if (code === '01' || /clear|sun/i.test(description ?? '')) return 'sunny'
  if (code === '11' || /storm|thunder|lightning/i.test(description ?? '')) return 'stormy'
  if (['09', '10'].includes(code) || /rain|shower/i.test(description ?? '')) return 'rainy'
  if (code === '13' || /snow/i.test(description ?? '')) return 'snowy'
  if (code === '50' || /fog|mist/i.test(description ?? '')) return 'foggy'
  return 'cloudy'
}

const CONDITION_BG = {
  sunny:  'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(251,146,60,0.11) 0%, transparent 70%), radial-gradient(ellipse 60% 35% at 85% 100%, rgba(234,179,8,0.08) 0%, transparent 70%)',
  stormy: 'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(124,58,237,0.14) 0%, transparent 70%), radial-gradient(ellipse 60% 35% at 85% 100%, rgba(67,56,202,0.10) 0%, transparent 70%)',
  rainy:  'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(96,165,250,0.11) 0%, transparent 70%), radial-gradient(ellipse 60% 35% at 85% 100%, rgba(59,130,246,0.08) 0%, transparent 70%)',
  snowy:  'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(186,230,253,0.10) 0%, transparent 70%), radial-gradient(ellipse 60% 35% at 85% 100%, rgba(147,197,253,0.07) 0%, transparent 70%)',
  foggy:  'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(148,163,184,0.08) 0%, transparent 70%)',
  cloudy: 'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(148,163,184,0.06) 0%, transparent 70%)',
  default: 'none',
}

// ── Animated SVG weather icons ───────────────────────────────────────────────

function AnimatedSun({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <motion.g
        style={{ originX: '28px', originY: '28px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <line
            key={angle}
            x1="28" y1="7" x2="28" y2="3"
            stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round"
            transform={`rotate(${angle} 28 28)`}
          />
        ))}
      </motion.g>
      <motion.circle
        cx="28" cy="28" r="12"
        fill="#FCD34D"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="28" cy="28" r="8" fill="#FDE68A" />
    </svg>
  )
}

function AnimatedRain({ size = 56 }) {
  const drops = [
    { x: 16, delay: 0 }, { x: 24, delay: 0.3 },
    { x: 32, delay: 0.15 }, { x: 40, delay: 0.5 },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <ellipse cx="30" cy="22" rx="14" ry="9" fill="#94A3B8" />
      <ellipse cx="20" cy="25" rx="9"  ry="7" fill="#94A3B8" />
      <ellipse cx="38" cy="26" rx="8"  ry="6" fill="#94A3B8" />
      <rect x="11" y="25" width="33" height="8" rx="4" fill="#94A3B8" />
      {drops.map((d, i) => (
        <motion.line
          key={i} x1={d.x} y1="36" x2={d.x - 2} y2="44"
          stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"
          animate={{ y: [0, 7, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: d.delay, ease: 'easeIn' }}
        />
      ))}
    </svg>
  )
}

function AnimatedStorm({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <ellipse cx="30" cy="18" rx="14" ry="9" fill="#475569" />
      <ellipse cx="19" cy="22" rx="9" ry="7" fill="#475569" />
      <ellipse cx="39" cy="23" rx="8" ry="6" fill="#475569" />
      <rect x="10" y="21" width="34" height="7" rx="3" fill="#475569" />
      {/* Lightning bolt */}
      <motion.path
        d="M31 27 L25 41 L30 41 L23 55 L36 38 L30 38 Z"
        fill="#FDE047" stroke="#FCD34D" strokeWidth="0.5"
        animate={{ opacity: [1, 0.05, 1, 0.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.25, 0.5, 0.65, 1] }}
      />
    </svg>
  )
}

function AnimatedFog({ size = 56 }) {
  const lines = [
    { y: 18, delay: 0,    w: 36 },
    { y: 29, delay: 0.5,  w: 28 },
    { y: 40, delay: 0.25, w: 32 },
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      {lines.map((l, i) => (
        <motion.rect
          key={i} x={8} y={l.y} width={l.w} height={4} rx={2}
          fill="#94A3B8"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

const WEATHER_EMOJIS = {
  '01': '☀️', '02': '⛅', '03': '🌥️', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️',
}

function weatherEmoji(icon) {
  if (!icon) return '🌤️'
  return WEATHER_EMOJIS[icon.replace(/[dn]$/, '')] || '🌤️'
}

function WeatherIcon({ icon, description, size = 56 }) {
  const type = getConditionType(icon, description)
  if (type === 'sunny') return <AnimatedSun size={size} />
  if (type === 'rainy') return <AnimatedRain size={size} />
  if (type === 'stormy') return <AnimatedStorm size={size} />
  if (type === 'foggy') return <AnimatedFog size={size} />
  return <span style={{ fontSize: size * 0.78, lineHeight: 1 }}>{weatherEmoji(icon)}</span>
}

// ── Weather Hero ───────────────────────────────────────────
function WeatherHero({ w, conditionType, locationName, t }) {
  return (
    <div
      className="card p-6 relative overflow-hidden"
      style={{ background: CONDITION_BG[conditionType] ?? 'none' }}
    >
      <div className="flex items-center gap-1.5 text-text-3 text-sm mb-5">
        <MapPin size={13} />
        <span>{locationName || 'Your Location'}</span>
        <span className="ml-auto text-text-3 text-sm">{t('weather_feels')} {w.feels_like ?? '--'}°C</span>
      </div>
      <div className="flex items-center gap-6">
        <WeatherIcon
          icon={w.icon || w.weather_icon}
          description={w.description || w.condition}
          size={80}
        />
        <div>
          <p
            className="glow-text leading-none"
            style={{ fontSize: 72, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}
          >
            {w.temperature ?? w.temp ?? '--'}°C
          </p>
          <p className="text-text-2 text-lg capitalize mt-2">{w.description || w.condition || 'Clear'}</p>
        </div>
      </div>
    </div>
  )
}

// ── Farming Tip typewriter ───────────────────────────────
function cleanTip(raw) {
  if (!raw) return ''
  return raw
    .replace(/\*{1,3}([^*\n]+?)\*{1,3}/g, '$1')
    .replace(/_{1,2}([^_\n]+?)_{1,2}/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

function FarmingTip({ tip, t }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const cleanedTip = cleanTip(tip)

  useEffect(() => {
    if (!cleanedTip) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      // Type 3 chars at a time for faster reveal
      i = Math.min(i + 3, cleanedTip.length)
      setDisplayed(cleanedTip.slice(0, i))
      if (i >= cleanedTip.length) { clearInterval(id); setDone(true) }
    }, 16)
    return () => clearInterval(id)
  }, [cleanedTip])

  if (!cleanedTip) return null
  return (
    <div className="card p-5">
      <h3 className="font-display text-text-1 font-semibold mb-3 flex items-center gap-2">
        <span>🌾</span> {t('weather_tip')}
      </h3>
      <p className="text-text-2 text-sm leading-relaxed whitespace-pre-line">
        {displayed}
        {!done && <span className="opacity-60" style={{ animation: 'none' }}>▌</span>}
      </p>
    </div>
  )
}

// ── Animated risk bar ────────────────────────────────────────────────────────

function RiskBar({ value, label, color }) {
  const pct = Math.min(100, Math.max(0, (value ?? 0) * 100))
  const barRef = useRef()

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    el.style.transition = 'none'
    el.style.width = '0%'
    void el.offsetWidth
    el.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.width = `${pct}%`
  }, [pct])

  return (
    <div>
      <div className="flex justify-between text-xs text-text-3 mb-1">
        <span>{label}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div ref={barRef} className={`h-full rounded-full ${color}`} style={{ width: 0 }} />
      </div>
    </div>
  )
}

export default function Weather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inputCity, setInputCity] = useState('')
  const [locationName, setLocationName] = useState('')
  const coordsRef = useRef(null)
  const [spraySchedule, setSpraySchedule] = useState([])
  const t = useT()

  const fetchByCoords = useCallback(async (lat, lon) => {
    coordsRef.current = { lat, lon }
    setLoading(true); setError(null)
    try {
      const res = await weatherApi.getIntelligence(lat, lon)
      setData(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      const d = await res.json()
      const addr = d.address || {}
      const place = addr.village || addr.suburb || addr.town || addr.city || addr.county || d.display_name?.split(',')[0] || ''
      const state  = addr.state || ''
      setLocationName(state ? `${place}, ${state}` : place)
    } catch {
      setLocationName('')
    }
  }

  function requestGPS() {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        p => {
          reverseGeocode(p.coords.latitude, p.coords.longitude)
          fetchByCoords(p.coords.latitude, p.coords.longitude)
        },
        () => {
          const c = coordsRef.current
          fetchByCoords(c ? c.lat : 18.5204, c ? c.lon : 73.8567)
        },
        { timeout: 5000, enableHighAccuracy: false, maximumAge: 30000 }
      )
    } else {
      const c = coordsRef.current
      fetchByCoords(c ? c.lat : 18.5204, c ? c.lon : 73.8567)
    }
  }

  useEffect(() => {
    requestGPS()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const coords = coordsRef.current
    const fc = data?.forecast || []
    if (!data || !coords || fc.length === 0) return
    weatherApi.getSpraySchedule(coords.lat, coords.lon, 5)
      .then(res => {
        const windows = res?.spray_windows || []
        const schedule = fc.slice(0, 5).map(day => {
          const match = windows.find(sw => sw.date === day.date)
          return {
            ...day,
            suitability: match ? match.suitability : 'avoid',
            time_slots: match?.time_slots ?? [],
          }
        })
        setSpraySchedule(schedule)
      })
      .catch(() => {
        setSpraySchedule(fc.slice(0, 5).map(day => {
          const rain = day.rainfall_mm ?? (day.rain_chance != null ? day.rain_chance * 10 : 0)
          const wind = day.wind_speed ?? 0
          const hum  = day.humidity ?? 60
          let suitability
          if (rain > 5 || wind > 25 || hum > 85) suitability = 'avoid'
          else if (wind < 15 && hum >= 40 && hum <= 70 && rain < 1) suitability = 'excellent'
          else suitability = 'fair'
          return { ...day, suitability, time_slots: [] }
        }))
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function searchCity() {
    if (!inputCity.trim()) return
    setLoading(true); setError(null)
    const query = inputCity.trim()
    try {
      // Geocode city to lat/lon via Nominatim (free, no API key needed)
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
      const geoData = await geo.json()
      if (geoData.length > 0) {
        const parts = geoData[0].display_name?.split(',') || []
        setLocationName(parts.slice(0, 2).join(',').trim() || query)
        await fetchByCoords(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon))
      } else {
        setError('City not found — showing your GPS location.')
        requestGPS()
      }
    } catch {
      setError('Could not find city. Using GPS location.')
      requestGPS()
    }
    // Note: do NOT call setLoading(false) here — fetchByCoords/requestGPS manage their own loading state
  }

  const w = data?.current || data
  const risks = data?.risk_analysis || data?.risks || {}
  const forecast = data?.forecast || []
  const advice = data?.agricultural_advisory || data?.advisory || {}
  const farmingTip = data?.ai_farming_suggestions || null

  const conditionType = w ? getConditionType(w.icon || w.weather_icon, w.description || w.condition) : 'default'
  const bgGradient = CONDITION_BG[conditionType] ?? 'none'

  return (
    <div className="page-content space-y-5" style={{ background: bgGradient, transition: 'background 0.8s ease' }}>
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">{t('weather_title')}</h1>
          <p className="text-text-3 text-sm mt-0.5 flex items-center gap-1">
            {locationName
              ? <><MapPin size={11} className="shrink-0" />{locationName}</>
              : t('weather_subtitle')}
          </p>
        </div>
        <button className="btn-icon" onClick={requestGPS} disabled={loading} aria-label="Refresh weather using my GPS location">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
        </button>
      </header>

      {/* City search */}
      <div className="flex gap-2">
        <input
          id="weather-city"
          className="input flex-1"
          placeholder={t('weather_search_placeholder')}
          aria-label="Search weather by city name"
          value={inputCity}
          onChange={e => setInputCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchCity()}
        />
        <button className="btn-primary px-5" onClick={searchCity} aria-label="Search weather for entered city">{t('search')}</button>
      </div>

      {loading && <SkeletonCard rows={4} />}

      {error && <div className="card p-4 text-text-3 text-sm">{error}</div>}

      {!loading && w && (
        <>
          {/* ── Cinematic Hero ── */}
          <WeatherHero w={w} conditionType={conditionType} locationName={locationName} t={t} />

          {/* Stats row */}
          <div className="card p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Droplets size={14}/>, label: t('weather_humidity'), value: `${w.humidity ?? '--'}%` },
                { icon: <Wind size={14}/>, label: t('weather_wind'), value: `${w.wind_speed ?? '--'} km/h` },
                { icon: <Eye size={14}/>, label: t('weather_visibility'), value: `${w.visibility ?? '--'} km` },
                { icon: <Cloud size={14}/>, label: t('weather_cloud'), value: `${w.cloudiness ?? w.clouds ?? '--'}%` },
              ].map(s => (
                <div key={s.label} className="bg-surface-2 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-text-3">{s.icon}</span>
                  <div>
                    <p className="text-text-3 text-xs">{s.label}</p>
                    <p className="text-text-1 text-sm font-medium">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agricultural advisory */}
          {Object.keys(advice).length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <Sprout size={15} className="text-primary" /> {t('weather_advisory')}
              </h3>
              <div className="space-y-3">
                {advice.irrigation && (
                  <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <Droplet size={15} className="text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-text-1 text-sm font-medium">{t('weather_irrigation')}</p>
                      <p className="text-text-2 text-sm">{advice.irrigation}</p>
                    </div>
                  </div>
                )}
                {advice.spray_window && (
                  <div className="flex items-start gap-3 p-3 bg-primary-dim border border-primary/20 rounded-lg">
                    <Sprout size={15} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-text-1 text-sm font-medium">{t('weather_spray')}</p>
                      <p className="text-text-2 text-sm">{advice.spray_window}</p>
                    </div>
                  </div>
                )}
                {advice.general && (
                  <div className="flex items-start gap-3 p-3 bg-surface-2 rounded-lg">
                    <ShieldCheck size={15} className="text-text-3 mt-0.5 shrink-0" />
                    <p className="text-text-2 text-sm">{advice.general}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk analysis */}
          {Object.keys(risks).length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-400" /> {t('weather_risk')}
              </h3>
              <div className="space-y-3">
                {risks.disease_risk != null && <RiskBar value={risks.disease_risk} label={t('weather_disease_risk')} color="bg-red-400" />}
                {risks.frost_risk != null && <RiskBar value={risks.frost_risk} label={t('weather_frost_risk')} color="bg-blue-400" />}
                {risks.drought_risk != null && <RiskBar value={risks.drought_risk} label={t('weather_drought_risk')} color="bg-amber-400" />}
                {risks.flood_risk != null && <RiskBar value={risks.flood_risk} label={t('weather_flood_risk')} color="bg-cyan-400" />}
              </div>
            </div>
          )}

          {/* 7-Day Forecast – horizontal glassmorphism strip */}
          {forecast.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4">{t('weather_forecast')}</h3>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
              >
                {forecast.slice(0, 7).map((day, i) => (
                  <div
                    key={i}
                    className="shrink-0 rounded-xl p-3 text-center"
                    style={{
                      minWidth: 78,
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <p className="text-text-3 text-xs mb-1.5">
                      {i === 0 ? t('weather_today') : new Date(day.date || Date.now() + i * 86400000).toLocaleDateString('en', { weekday: 'short' })}
                    </p>
                    <div className="flex justify-center mb-1.5">
                      <WeatherIcon icon={day.icon} description={day.description} size={30} />
                    </div>
                    <p className="text-text-1 text-sm font-semibold">{day.temp_max ?? day.max ?? day.high ?? '--'}°</p>
                    <p className="text-text-3 text-xs">{day.temp_min ?? day.min ?? day.low ?? '--'}°</p>
                    {day.rain_chance != null && (
                      <p className="text-blue-400 text-xs mt-1">{Math.round(day.rain_chance * 100)}%</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Spray Windows */}
          {spraySchedule.length > 0 && (() => {
            const SPRAY_STYLE = {
              excellent: { dot: 'bg-green-500', text: 'text-green-400', label: 'Ideal' },
              good:      { dot: 'bg-green-400', text: 'text-green-400', label: 'Good' },
              fair:      { dot: 'bg-amber-400', text: 'text-amber-400', label: 'Acceptable' },
              avoid:     { dot: 'bg-red-500',   text: 'text-red-400',   label: 'Avoid' },
            }
            return (
              <div className="card p-5">
                <h3 className="font-display text-text-1 font-semibold mb-1 flex items-center gap-2">
                  <Sprout size={15} className="text-primary" /> Best Spray Windows
                </h3>
                <p className="text-text-3 text-xs mb-4">Optimal spray timing for pesticides &amp; fertilizers over the next 5 days</p>
                <div
                  className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
                >
                  {spraySchedule.map((day, i) => {
                    const style = SPRAY_STYLE[day.suitability] ?? SPRAY_STYLE.fair
                    return (
                      <div
                        key={i}
                        className="shrink-0 rounded-xl p-3 text-center"
                        style={{
                          minWidth: 90,
                          background: 'rgba(255,255,255,0.03)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <p className="text-text-3 text-xs mb-2">
                          {i === 0 ? 'Today' : new Date(day.date || Date.now() + i * 86400000).toLocaleDateString('en', { weekday: 'short' })}
                        </p>
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1.5 ${style.dot}`} />
                        <p className={`text-xs font-medium ${style.text}`}>{style.label}</p>
                        {day.time_slots?.length > 0 && (
                          <p className="text-text-3 text-[10px] mt-1.5 leading-tight">{day.time_slots[0]}</p>
                        )}
                        {day.wind_speed != null && (
                          <p className="text-text-3 text-[10px] mt-1">💨 {day.wind_speed}km/h</p>
                        )}
                        {day.suitability === 'avoid' && (
                          <p className="text-[10px] mt-1">🌧️</p>
                        )}
                      </div>
                    )
                  })}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-text-3 text-xs">Legend:</span>
                  {[
                    { dot: 'bg-green-500', label: 'Ideal' },
                    { dot: 'bg-amber-400', label: 'Acceptable' },
                    { dot: 'bg-red-500',   label: 'Avoid' },
                  ].map(l => (
                    <span key={l.label} className="flex items-center gap-1.5 text-text-3 text-xs">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${l.dot}`} />
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Farming Tip of the Day */}
          <FarmingTip tip={farmingTip} t={t} />
        </>
      )}
    </div>
  )
}
