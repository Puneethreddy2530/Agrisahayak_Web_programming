import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import MainLayout from './components/layout/MainLayout'
import LoadingScreen from './components/LoadingScreen'

// Pages
import Login       from './pages/Login'
import Home        from './pages/Home'
import Profile     from './pages/Profile'
import Disease     from './pages/Disease'
import Pest        from './pages/Pest'
import Market      from './pages/Market'
import Weather     from './pages/Weather'
import Chatbot     from './pages/Chatbot'
import CropAdvisor from './pages/CropAdvisor'
import CropCycle     from './pages/CropCycle'
import Fertilizer    from './pages/Fertilizer'
import Expense       from './pages/Expense'
import SoilPassport  from './pages/SoilPassport'
import Analytics   from './pages/Analytics'
import OutbreakMap from './pages/OutbreakMap'
import Schemes     from './pages/Schemes'
import Complaints  from './pages/Complaints'
import Admin       from './pages/Admin'
import LogisticsOptimizer from './pages/LogisticsOptimizer'
import SatelliteOracle  from './pages/SatelliteOracle'

// ── Offline / cache toast bar ──────────────────────────────────────────────
function OfflineBar() {
  const [bar, setBar] = useState(null)
  // bar: null | { type: 'offline' | 'online' | 'cached', message }

  useEffect(() => {
    let timer

    const onOffline = () => {
      clearTimeout(timer)
      setBar({ type: 'offline', message: '⚠️ You are offline — showing cached data' })
    }

    const onOnline = () => {
      clearTimeout(timer)
      setBar({ type: 'online', message: '✓ Connection restored' })
      timer = setTimeout(() => setBar(null), 3000)
    }

    const onCacheHit = (e) => {
      const { cachedAt } = e.detail
      const time = new Date(cachedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      clearTimeout(timer)
      setBar({ type: 'cached', message: `Showing cached data from ${time}` })
      timer = setTimeout(() => setBar(null), 5000)
    }

    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    window.addEventListener('api:cache-hit', onCacheHit)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('api:cache-hit', onCacheHit)
    }
  }, [])

  if (!bar) return null

  const styles = {
    offline: { background: 'rgba(220,38,38,0.95)', color: '#fff' },
    online:  { background: 'rgba(22,163,74,0.95)',  color: '#fff' },
    cached:  { background: 'rgba(217,119,6,0.95)',  color: '#fff' },
  }

  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        textAlign: 'center', padding: '8px 16px',
        fontSize: '0.85rem', fontWeight: 500,
        backdropFilter: 'blur(6px)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.3)',
        ...styles[bar.type],
      }}
    >
      {bar.message}
    </div>
  )
}

// ── Route guards ───────────────────────────────────────────────────────────
function ProtectedRoute() {
  const { state } = useApp()
  if (!state.authToken) return <Navigate to="/login" replace />
  return <MainLayout />
}

export default function App() {
  return (
    <>
    <LoadingScreen />
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public - no sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Protected - with sidebar */}
          <Route element={<ProtectedRoute />}>
            <Route path="/"            element={<Home />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="/disease"     element={<Disease />} />
            <Route path="/pest"        element={<Pest />} />
            <Route path="/market"      element={<Market />} />
            <Route path="/weather"     element={<Weather />} />
            <Route path="/chatbot"     element={<Chatbot />} />
            <Route path="/crop"        element={<CropAdvisor />} />
            <Route path="/crop-cycle"  element={<CropCycle />} />
            <Route path="/fertilizer"  element={<Fertilizer />} />
            <Route path="/expense"       element={<Expense />} />
            <Route path="/soil-passport" element={<SoilPassport />} />
            <Route path="/analytics"     element={<Analytics />} />
            <Route path="/outbreak-map" element={<OutbreakMap />} />
            <Route path="/schemes"     element={<Schemes />} />
            <Route path="/complaints"  element={<Complaints />} />
            <Route path="/admin"       element={<Admin />} />
            <Route path="/logistics"   element={<LogisticsOptimizer />} />
            <Route path="/satellite"   element={<SatelliteOracle />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
    <OfflineBar />
    </>
  )
}
