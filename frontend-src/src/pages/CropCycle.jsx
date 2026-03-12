import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Plus, Sprout, Calendar, X, Loader2, CheckCircle2, Clock, AlertTriangle, MapPin, NotebookPen } from 'lucide-react'
import { cropCycleApi, farmerApi } from '../api/client'
import { useApp } from '../contexts/AppContext'
import EmptyState from '../components/common/EmptyState'
import SkeletonCard from '../components/common/SkeletonCard'

const CROPS = ['Rice','Wheat','Maize','Cotton','Sugarcane','Soybean','Groundnut','Potato','Tomato','Onion','Chickpea','Bajra','Jowar','Mustard','Turmeric','Ginger']

// Map display labels → backend enum values
const SEASONS = [
  { label: 'Kharif (June–Oct)',  value: 'kharif' },
  { label: 'Rabi (Oct–Mar)',     value: 'rabi' },
  { label: 'Zaid (Mar–Jun)',     value: 'zaid' },
]

// Convert backend health_status string → numeric score for HealthBar
function healthScore(status) {
  const map = { healthy: 90, at_risk: 55, infected: 25, recovered: 75 }
  return map[(status || '').toLowerCase()] ?? 70
}

function statusBadge(isActive) {
  return isActive ? 'badge badge-green' : 'badge badge-blue'
}

function HealthBar({ score }) {
  const pct = Math.min(100, Math.max(0, score ?? 0))
  const color = pct >= 70 ? 'bg-primary' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-text-3 mb-1">
        <span>Health</span><span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Lifecycle timeline ─────────────────────────────────────────────────────
const LIFECYCLE_STAGES = [
  { id: 'planting',    label: 'Planting',    dayStart: 0  },
  { id: 'germination', label: 'Germination', dayStart: 8  },
  { id: 'vegetative',  label: 'Vegetative',  dayStart: 22 },
  { id: 'flowering',   label: 'Flowering',   dayStart: 58 },
  { id: 'harvest',     label: 'Harvest',     dayStart: 90 },
]

const DEFAULT_TOTAL_DAYS = 120

function getDaysSincePlanting(cycle) {
  const dateStr = cycle.planted_at || cycle.sowing_date
  if (dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
    if (!isNaN(diff)) return Math.max(0, diff)
  }
  return cycle.days_since_sowing ?? 0
}

function CropTimeline({ cycle }) {
  const days        = getDaysSincePlanting(cycle)
  const totalDays   = cycle.duration_days || DEFAULT_TOTAL_DAYS
  const progress    = Math.min(1, days / totalDays)   // 0-1

  let currentIdx = 0
  for (let i = LIFECYCLE_STAGES.length - 1; i >= 0; i--) {
    if (days >= LIFECYCLE_STAGES[i].dayStart) { currentIdx = i; break }
  }

  // Fire confetti exactly once when user reaches Harvest stage
  const confettiFiredRef = useRef(false)
  useEffect(() => {
    if (currentIdx === LIFECYCLE_STAGES.length - 1 && !confettiFiredRef.current) {
      confettiFiredRef.current = true
      confetti({ particleCount: 150, spread: 80, colors: ['#22c55e', '#facc15', '#f97316'] })
    }
  }, [currentIdx])

  const stageListVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const stageItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0 },
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-text-3 text-[11px] font-medium mb-3 flex items-center gap-1">
        <Sprout size={11} /> Lifecycle — Day {days} of ~{totalDays}
      </p>
      <div className="relative">
        {/* Track background */}
        <div className="absolute top-[14px] inset-x-0 h-[2px] bg-surface-3 rounded-full" />
        {/* Animated progress fill — scaleX instead of width to avoid layoutId conflicts */}
        <motion.div
          className="absolute top-[14px] left-0 h-[2px] bg-primary rounded-full origin-left"
          style={{ right: 0, transform: `scaleX(${progress})`, transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Stage nodes — staggered entrance */}
        <motion.div
          className="relative flex justify-between z-10"
          variants={stageListVariants}
          initial="hidden"
          animate="show"
        >
          {LIFECYCLE_STAGES.map((stage, i) => {
            const isPast    = i < currentIdx
            const isCurrent = i === currentIdx
            const daysToStage = stage.dayStart - days
            return (
              <motion.div key={stage.id} className="flex flex-col items-center gap-1" variants={stageItemVariants}>
                <div className="relative flex items-center justify-center">
                  {/* CSS-driven pulse ring — no framer-motion animate on same element as potential layoutId */}
                  {isCurrent && (
                    <span
                      className="absolute rounded-full border-2 border-primary/70 animate-ping"
                      style={{ width: 36, height: 36, animationDuration: '1.6s' }}
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isPast || isCurrent ? 'bg-primary border-primary' : 'bg-surface-2 border-border'
                    }`}
                    style={isCurrent ? { boxShadow: '0 0 12px rgba(34,197,94,0.6)' } : {}}
                  >
                    {isPast && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <polyline points="1,4 3.5,6.5 9,1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <p className={`text-[10px] font-medium text-center leading-tight ${
                  isPast || isCurrent ? 'text-primary' : 'text-text-3'
                }`}>
                  {stage.label}
                </p>
                <p className="text-[10px] text-text-3 text-center">
                  {isPast ? '✓' : isCurrent ? `Day ${days}` : `+${daysToStage}d`}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

// ── Per-cycle health log ──────────────────────────────────────────────────
function HealthLog({ cycleId }) {
  const lsKey = `cycle_log_${cycleId}`
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(lsKey) || '' } catch { return '' }
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  async function saveLog() {
    if (!note.trim()) return
    setSaving(true)
    try { localStorage.setItem(lsKey, note) } catch {}
    try { await cropCycleApi.logActivity(cycleId, { activity_type: 'health_log', notes: note }) } catch {}
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-text-2 text-xs font-semibold mb-2 flex items-center gap-1.5">
        <NotebookPen size={12} /> Health Log
      </p>
      <textarea
        className="input w-full text-xs resize-none leading-relaxed"
        rows={3}
        placeholder="Write today's observations…  e.g. 'Noticed yellowing on lower leaves, applied neem spray'"
        aria-label="Write today's health observations for this crop cycle"
        value={note}
        onChange={e => { setNote(e.target.value); setSaved(false) }}
      />
      <div className="flex justify-end mt-1.5">
        <button
          onClick={saveLog}
          disabled={saving || !note.trim()}
          className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
        >
          {saving
            ? <Loader2 size={11} className="animate-spin" />
            : saved ? '✓ Saved' : 'Save Note'
          }
        </button>
      </div>
    </div>
  )
}

function StartCycleModal({ farmerId, onClose, onCreated, navigate }) {
  const [lands, setLands]           = useState([])
  const [landsLoading, setLandsLoading] = useState(true)
  const [form, setForm] = useState({ land_id: '', crop: 'Rice', season: 'kharif', sowing_date: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Fetch lands fresh every time the modal opens
  useEffect(() => {
    if (!farmerId) { setLandsLoading(false); return }
    farmerApi.getLands(farmerId)
      .then(res => {
        const list = Array.isArray(res) ? res : []
        setLands(list)
        if (list.length > 0) setForm(f => ({ ...f, land_id: list[0].land_id || '' }))
      })
      .catch(() => {})
      .finally(() => setLandsLoading(false))
  }, [farmerId])

  async function submit(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const payload = {
        land_id: form.land_id,
        crop: form.crop,
        season: form.season,
        sowing_date: form.sowing_date || new Date().toISOString().split('T')[0],
      }
      const res = await cropCycleApi.start(payload)
      onCreated(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const noLandsAvailable = !landsLoading && lands.length === 0

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-text-1">Start New Crop Cycle</h3>
          <button className="btn-icon" onClick={onClose}><X size={14}/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {landsLoading ? (
            <div className="flex items-center gap-2 text-text-3 text-sm py-1">
              <Loader2 size={13} className="animate-spin" /> Loading lands…
            </div>
          ) : noLandsAvailable ? (
            <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3 text-sm">
              <p className="text-amber-400 font-medium mb-2">No lands added yet.</p>
              <p className="text-text-3 text-xs mb-3">Please add a land in your Profile first.</p>
              <button
                type="button"
                className="btn-secondary text-xs py-1 px-3"
                onClick={() => { onClose(); navigate('/profile') }}
              >
                Go to Profile
              </button>
            </div>
          ) : (
            <div>
              <label className="label">Select Land</label>
              <select className="input w-full" value={form.land_id} onChange={set('land_id')}>
                {lands.map(l => (
                  <option key={l.land_id} value={l.land_id}>
                    {l.name || l.geo_location || l.land_id} — {l.area_acres ?? l.area ?? '?'} acres ({l.soil_type || 'unknown'})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label">Crop</label>
            <select className="input w-full" value={form.crop} onChange={set('crop')}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Season</label>
            <select className="input w-full" value={form.season} onChange={set('season')}>
              {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Sowing Date</label>
            <input className="input w-full" type="date" value={form.sowing_date} onChange={set('sowing_date')} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading || !form.land_id}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Start Cycle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CropCycle() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [cycles, setCycles] = useState(state.cycles || [])
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [noLands, setNoLands] = useState(false)

  // Load land objects + active cycles when farmer is available, with 10s polling
  useEffect(() => {
    if (!state.farmer) return

    async function load(isFirst = false) {
      if (isFirst) setLoading(true)
      try {
        // Load land objects so we can show names in the modal
        if (isFirst && (state.farmer.id || state.farmer.farmer_id)) {
          const farmerId = state.farmer.id || state.farmer.farmer_id
          const landRes = await farmerApi.getLands(farmerId).catch(() => [])
          setLands(Array.isArray(landRes) ? landRes : [])
        }

        const list = await cropCycleApi.listActive()
        setCycles(list)
        dispatch({ type: 'SET_CYCLES', payload: list })
        setNoLands(false)
      } catch (err) {
        if (err?.noLands) {
          setNoLands(true)
          setCycles([])
        }
      }
      finally { if (isFirst) setLoading(false) }
    }

    load(true)
    const interval = setInterval(() => load(false), 10000)
    return () => clearInterval(interval)
  }, [state.farmer])

  function handleCreated(cycle) {
    const updated = [cycle, ...cycles]
    setCycles(updated)
    dispatch({ type: 'SET_CYCLES', payload: updated })
    setShowModal(false)
  }

  // Backend uses is_active boolean; separate active from completed
  const active = cycles.filter(c => c.is_active === true || c.is_active === 1)
  const past   = cycles.filter(c => c.is_active !== true && c.is_active !== 1)

  if (!state.farmer) {
    return (
      <div className="page-content">
        <EmptyState icon={Sprout} title="Sign in Required" description="Please sign in to manage your crop cycles" />
      </div>
    )
  }

  if (noLands) {
    return (
      <div className="page-content">
        <EmptyState
          icon={MapPin}
          title="No Land Parcels Found"
          description="You need to add a land parcel before starting a crop cycle."
          action={{ label: 'Go to Profile', onClick: () => navigate('/profile') }}
        />
      </div>
    )
  }

  return (
    <div className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Crop Cycles</h1>
          <p className="text-text-3 text-sm mt-0.5">{active.length} active · {past.length} completed</p>
        </div>
        <button className="btn-primary flex items-center gap-1.5" onClick={() => setShowModal(true)}>
          <Plus size={14} /> New Cycle
        </button>
      </header>

      {loading ? (
        <SkeletonCard rows={3} />
      ) : cycles.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="Start Your First Crop Cycle"
          description="Track your crops from sowing to harvest — get yield predictions, health alerts, and activity logs."
          action={{ label: '+ Start First Cycle', onClick: () => setShowModal(true) }}
        />
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h3 className="font-display text-text-2 text-sm font-medium uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Active Cycles
              </h3>
              <div className="space-y-3">
                {active.map(cycle => {
                  const key = cycle.cycle_id || cycle.id
                  const score = healthScore(cycle.health_status)
                  return (
                    <div key={key} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-dim flex items-center justify-center text-lg">🌱</div>
                          <div>
                            <p className="text-text-1 font-semibold">{cycle.crop}</p>
                            <p className="text-text-3 text-xs">{cycle.land_name || cycle.land_id} · {cycle.season || '—'}</p>
                          </div>
                        </div>
                        <span className={statusBadge(cycle.is_active)}>Active</span>
                      </div>
                      <HealthBar score={score} />
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-text-3 text-xs flex items-center gap-1">
                          <Calendar size={11}/> Sown: {cycle.sowing_date || '—'}
                        </span>
                        {cycle.expected_harvest && (
                          <span className="text-text-3 text-xs flex items-center gap-1">
                            <Clock size={11}/> Harvest: {cycle.expected_harvest}
                          </span>
                        )}
                        {cycle.days_since_sowing != null && (
                          <span className="text-text-3 text-xs">Day {cycle.days_since_sowing}</span>
                        )}
                      </div>
                      {cycle.alerts?.length > 0 && (
                        <p className="mt-2 text-amber-400 text-xs flex items-center gap-1">
                          <AlertTriangle size={11}/> {cycle.alerts[0].message || cycle.alerts[0]}
                        </p>
                      )}
                      <CropTimeline cycle={cycle} />
                      <HealthLog cycleId={key} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="font-display text-text-2 text-sm font-medium uppercase tracking-wide mb-3">Past Cycles</h3>
              <div className="space-y-2">
                {past.map(cycle => {
                  const key = cycle.cycle_id || cycle.id
                  return (
                    <div key={key} className="card p-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-text-1 text-sm font-medium">{cycle.crop}</p>
                        <p className="text-text-3 text-xs">
                          {cycle.sowing_date || '—'} — {cycle.expected_harvest || 'Completed'}
                        </p>
                      </div>
                      <span className="badge badge-blue">Completed</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <StartCycleModal
          farmerId={state.farmer?.id || state.farmer?.farmer_id}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
          navigate={navigate}
        />
      )}
    </div>
  )
}
