import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { analyticsApi } from '../api/client'

const AppContext = createContext(null)

const initialState = {
  farmer: null,
  cycles: [],
  authToken: localStorage.getItem('authToken') || null,
  language: localStorage.getItem('appLanguage') || 'en',
  isOnline: navigator.onLine,
  notifications: [],
  alertToasts: [],
  sidebarOpen: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FARMER':
      return { ...state, farmer: action.payload }
    case 'SET_CYCLES':
      return { ...state, cycles: action.payload }
    case 'SET_TOKEN':
      return { ...state, authToken: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 20) }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    case 'ADD_ALERT_TOAST':
      return { ...state, alertToasts: [action.payload, ...state.alertToasts].slice(0, 5) }
    case 'DISMISS_ALERT_TOAST':
      return { ...state, alertToasts: state.alertToasts.filter((t) => t.id !== action.payload) }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false }
    case 'LOGOUT':
      localStorage.removeItem('authToken')
      localStorage.removeItem('farmer')
      localStorage.removeItem('cropCycles')
      return { ...initialState, authToken: null, farmer: null, cycles: [] }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    // Hydrate from localStorage on first load
    try {
      const savedFarmer = localStorage.getItem('farmer')
      const savedCycles = localStorage.getItem('cropCycles')
      return {
        ...init,
        farmer: savedFarmer ? JSON.parse(savedFarmer) : null,
        cycles: savedCycles ? JSON.parse(savedCycles) : [],
      }
    } catch {
      return init
    }
  })

  // Persist farmer + cycles to localStorage whenever they change
  useEffect(() => {
    if (state.farmer) localStorage.setItem('farmer', JSON.stringify(state.farmer))
    else localStorage.removeItem('farmer')
  }, [state.farmer])

  useEffect(() => {
    localStorage.setItem('cropCycles', JSON.stringify(state.cycles))
  }, [state.cycles])

  useEffect(() => {
    if (state.authToken) localStorage.setItem('authToken', state.authToken)
    else localStorage.removeItem('authToken')
  }, [state.authToken])

  useEffect(() => {
    localStorage.setItem('appLanguage', state.language)
  }, [state.language])

  // Online/offline tracking
  useEffect(() => {
    const onOnline  = () => dispatch({ type: 'SET_ONLINE', payload: true })
    const onOffline = () => dispatch({ type: 'SET_ONLINE', payload: false })
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online',  onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  // Outbreak alert polling
  const seenAlertIds = useRef(new Set())

  useEffect(() => {
    if (!state.authToken) {
      seenAlertIds.current.clear()
      return
    }

    function playAlertChime() {
      const webAudioBeep = () => {
        try {
          const actx = new (window.AudioContext || window.webkitAudioContext)()
          const osc  = actx.createOscillator()
          const gain = actx.createGain()
          osc.connect(gain)
          gain.connect(actx.destination)
          osc.type = 'sine'
          osc.frequency.value = 440
          gain.gain.setValueAtTime(0.15, actx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.8)
          osc.start(actx.currentTime)
          osc.stop(actx.currentTime + 0.8)
        } catch {}
      }
      try {
        const audio = new Audio('/alert.mp3')
        audio.volume = 0.4
        audio.play().catch(webAudioBeep)
      } catch {
        webAudioBeep()
      }
    }

    async function pollAlerts() {
      try {
        const alerts = await analyticsApi.getOutbreakAlerts(5, 7)
        if (!Array.isArray(alerts)) return
        let chimePlayed = false
        for (const alert of alerts.slice(0, 5)) {
          const key = `${alert.disease}|${alert.district}`
          if (seenAlertIds.current.has(key)) continue
          seenAlertIds.current.add(key)
          const toast = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            disease: alert.disease,
            district: alert.district,
            state: alert.state,
            cases: alert.cases,
            severity: alert.severity,
          }
          dispatch({ type: 'ADD_ALERT_TOAST', payload: toast })
          if (!chimePlayed && (alert.severity === 'high' || alert.severity === 'critical')) {
            playAlertChime()
            chimePlayed = true
          }
        }
      } catch {}
    }

    pollAlerts()
    const intervalId = setInterval(pollAlerts, 60_000)
    return () => clearInterval(intervalId)
  }, [state.authToken])

  // Helper: derive home stats from state
  const homeStats = (() => {
    const active = (state.cycles || []).filter(c => c.status !== 'completed')
    const lands  = state.farmer?.lands || []
    const acres  = lands.reduce((s, l) => s + (parseFloat(l.area) || 0), 0)
    const scores = active.map(c => c.health_score ?? c.healthScore).filter(h => h != null && !isNaN(h))
    const health = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
    const alerts = active.filter(c =>
      (c.disease_reports?.length > 0) || (c.health_score != null && c.health_score < 70)
    ).length
    return { activeCrops: active.length, totalLands: lands.length, totalAcres: acres, avgHealth: health, alerts }
  })()

  return (
    <AppContext.Provider value={{ state, dispatch, homeStats }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
