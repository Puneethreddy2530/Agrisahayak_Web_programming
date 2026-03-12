import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { Menu, X, MapPin, Globe } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import PageTransition from '../common/PageTransition'
import VoiceCommandBar from '../VoiceCommandBar'
import { useEffect, useState, useRef } from 'react'
import { LANGUAGES } from '../../i18n'

// ── Individual outbreak toast card ──────────────────────────────────
const SEVERITY_META = {
  critical: { label: 'Critical', bg: 'bg-red-600',    text: 'text-white' },
  high:     { label: 'High',     bg: 'bg-orange-500', text: 'text-white' },
  medium:   { label: 'Medium',   bg: 'bg-amber-400',  text: 'text-zinc-900' },
}

function ToastCard({ toast }) {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const meta = SEVERITY_META[toast.severity] || { label: 'Alert', bg: 'bg-zinc-600', text: 'text-white' }

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'DISMISS_ALERT_TOAST', payload: toast.id }), 8000)
    return () => clearTimeout(t)
  }, [toast.id, dispatch])

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.9 }}
      transition={{ duration: 0.22 }}
      className="relative overflow-hidden w-72 rounded-xl border border-border-strong bg-surface-1/95 shadow-xl backdrop-blur-md"
    >
      {/* Auto-dismiss progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 8, ease: 'linear' }}
      />

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-text-1 text-sm font-semibold capitalize truncate">{toast.disease}</p>
            <p className="text-text-3 text-xs truncate">
              {toast.district}{toast.state ? `, ${toast.state}` : ''}
              {toast.cases ? ` · ${toast.cases} cases` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
              {meta.label}
            </span>
            <button
              onClick={() => dispatch({ type: 'DISMISS_ALERT_TOAST', payload: toast.id })}
              className="opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X size={13} />
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            navigate('/outbreak-map')
            dispatch({ type: 'DISMISS_ALERT_TOAST', payload: toast.id })
          }}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <MapPin size={11} /> View Outbreak Map
        </button>
      </div>
    </motion.div>
  )
}

// ── Toast stack container ───────────────────────────────────────────────
function ToastContainer() {
  const { state } = useApp()
  return (
      <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2 items-end pointer-events-none"
           role="region" aria-label="Alerts" aria-live="assertive" aria-atomic="false">
      <AnimatePresence>
        {state.alertToasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastCard toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Mobile language picker ─────────────────────────────────────────────────
function MobileLangPicker() {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onOutside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const current = LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0]

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        className="btn-icon"
        onClick={() => setOpen(o => !o)}
        aria-label="Change display language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={15} aria-hidden="true" />
        <span className="text-[10px] font-medium text-text-2 hidden xs:inline" aria-hidden="true">{current.native}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-44 bg-surface-1 border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="max-h-72 overflow-y-auto py-1" role="listbox" aria-label="Language options">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={state.language === l.code}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    state.language === l.code
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-text-2 hover:bg-surface-2 hover:text-text-1'
                  }`}
                  onClick={() => {
                    dispatch({ type: 'SET_LANGUAGE', payload: l.code })
                    localStorage.setItem('appLanguage', l.code)
                    setOpen(false)
                  }}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Layout ────────────────────────────────────────────────────────────
export default function MainLayout() {
  const { dispatch } = useApp()
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />

      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-bg/90 backdrop-blur border-b border-border flex items-center px-4 gap-3 z-20 lg:hidden">
        <button className="btn-icon" aria-label="Open navigation menu" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
          <Menu size={18} aria-hidden="true" />
        </button>
        <span className="text-text-1 text-sm font-medium">AgriSahayak</span>
        <MobileLangPicker />
      </div>

      {/* Main content: offset by sidebar on lg */}
      <main id="main-content" className="flex-1 lg:ml-[220px] min-w-0 pt-14 lg:pt-0">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <VoiceCommandBar />
      <ToastContainer />
    </div>
  )
}
