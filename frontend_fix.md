# AgriSahayak - Full Frontend Source Code


## `frontend-src/index.html`


```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#09100E" />
    <meta name="description" content="AgriSahayak - AI-Powered Smart Agriculture Platform" />
    <title>AgriSahayak</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {})
        })
      }
    </script>
  </body>
</html>

```


## `frontend-src/package.json`


```json
{
  "name": "agrisahayak-react",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.66.9",
    "axios": "^1.8.4",
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^12.4.7",
    "gsap": "^3.14.2",
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.446.0",
    "qrcode": "^1.5.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.3.8",
    "react-leaflet": "^4.2.1",
    "react-router-dom": "^6.26.1",
    "recharts": "^2.15.1",
    "three": "^0.183.2",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.12",
    "vite": "^5.4.8"
  }
}

```


## `frontend-src/postcss.config.js`


```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```


## `frontend-src/tailwind.config.js`


```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // AgriSahayak Design Tokens
        bg: '#09100E',
        surface: '#0F1813',
        'surface-2': '#152019',
        'surface-3': '#1B2820',
        border: 'rgba(255,255,255,0.06)',
        'border-strong': 'rgba(255,255,255,0.10)',
        primary: '#22C55E',
        'primary-dim': 'rgba(34,197,94,0.12)',
        'primary-glow': 'rgba(34,197,94,0.25)',
        // Text
        'text-1': '#E8F0EA',
        'text-2': '#8FA898',
        'text-3': '#9CA3AF',
        // Status
        'status-danger': '#EF4444',
        'status-warning': '#F59E0B',
        'status-info': '#3B82F6',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Inter"', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', '16px'],
        sm: ['13px', '20px'],
        base: ['14px', '22px'],
        md: ['15px', '24px'],
        lg: ['17px', '26px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        12: '48px',
        14: '56px',
        16: '64px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
        'primary-glow': '0 0 20px rgba(34,197,94,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.35s ease',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

```


## `frontend-src/vite.config.js`


```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../frontend-dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})

```


## `frontend-src/public/sw.js`


```javascript
// AgriSahayak Service Worker — network-first with cache fallback
// Handles static shell caching and serves stale assets when offline.
// API JSON responses are cached separately in IndexedDB by client.js.

const CACHE_NAME = 'agrisahayak-shell-v1'

// Static shell routes to pre-cache on install
const SHELL_URLS = ['/']

// ── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ── Fetch — network-first ────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e

  // Only intercept GET requests from the same origin
  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  const url = new URL(request.url)

  // Never cache auth / login endpoints (token rotation, sensitive data)
  if (url.pathname.startsWith('/api/v1/auth')) return

  // Never cache Vite HMR and dev-server internals
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/node_modules')) return

  e.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses (status 200-299) for static assets and
        // public API routes (schemes list, market prices, weather, etc.)
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(async () => {
        // Network failed — serve from cache if available
        const cached = await caches.match(request)
        if (cached) return cached

        // For navigation requests return the cached shell
        if (request.mode === 'navigate') {
          const shell = await caches.match('/')
          if (shell) return shell
        }

        // Last-resort empty 503 so axios/fetch still gets a Response object
        return new Response(
          JSON.stringify({ error: 'offline', message: 'You are offline' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      })
  )
})

```


## `frontend-src/src/App.jsx`


```jsx
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

```


## `frontend-src/src/i18n.js`


```javascript
import { useApp } from './contexts/AppContext'

export const LANGUAGES = [
  { code: 'en', native: 'English',    script: 'Latin'    },
  { code: 'hi', native: 'हिंदी',      script: 'Devanagari' },
  { code: 'mr', native: 'मराठी',      script: 'Devanagari' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',     script: 'Gurmukhi'  },
  { code: 'gu', native: 'ગુજરાતી',    script: 'Gujarati'  },
  { code: 'ta', native: 'தமிழ்',      script: 'Tamil'     },
  { code: 'te', native: 'తెలుగు',     script: 'Telugu'    },
  { code: 'kn', native: 'ಕನ್ನಡ',      script: 'Kannada'   },
  { code: 'bn', native: 'বাংলা',       script: 'Bengali'   },
  { code: 'or', native: 'ଓଡ଼ିଆ',      script: 'Odia'      },
  { code: 'ml', native: 'മലയാളം',     script: 'Malayalam' },
]

const T = {
  // ──────────────────────────────── ENGLISH ────────────────────────────────
  en: {
    nav_dashboard: 'Dashboard', nav_disease: 'Disease Detection',
    nav_pest: 'Pest Detection', nav_market: 'Market Prices',
    nav_chatbot: 'AI Chatbot', nav_weather: 'Weather',
    nav_crop_advisor: 'Crop Advisor', nav_crop_cycle: 'Crop Cycle',
    nav_fertilizer: 'Fertilizer', nav_expense: 'Expense & Profit',
    nav_soil: 'Soil Passport', nav_analytics: 'Analytics',
    nav_outbreak: 'Outbreak Map', nav_schemes: 'Govt Schemes',
    nav_complaints: 'Complaints', nav_admin: 'Admin Portal',
    grp_main: 'Main', grp_market_weather: 'Market & Weather',
    grp_farm: 'Farm Management', grp_intelligence: 'Intelligence',
    search: 'Search', save: 'Save', submit: 'Submit', cancel: 'Cancel',
    back: 'Back', next: 'Next', close: 'Close', yes: 'Yes', no: 'No',
    loading: 'Loading…', error: 'Error', no_data: 'No data found',
    logout: 'Logout', profile: 'Profile',
    language: 'Language', select_language: 'Select Language',
    weather_title: 'Weather Intelligence',
    weather_subtitle: 'Hyperlocal forecasts for your farm',
    weather_search_placeholder: 'Search city or district…',
    weather_humidity: 'Humidity', weather_wind: 'Wind',
    weather_visibility: 'Visibility', weather_cloud: 'Cloud Cover',
    weather_feels: 'Feels like',
    weather_advisory: 'Agricultural Advisory',
    weather_irrigation: 'Irrigation', weather_spray: 'Spray Window',
    weather_forecast: '7-Day Forecast', weather_tip: 'Farming Tip of the Day',
    weather_risk: 'Risk Analysis', weather_pest_risk: 'Pest Risk',
    weather_disease_risk: 'Disease Risk', weather_drought_risk: 'Drought Risk',
    weather_frost_risk: 'Frost Risk', weather_flood_risk: 'Flood Risk',
    weather_today: 'Today',
    home_greeting_morning: 'Good Morning', home_greeting_afternoon: 'Good Afternoon',
    home_greeting_evening: 'Good Evening',
    home_active_crops: 'Active Crops', home_total_lands: 'Lands',
    home_total_acres: 'Acres', home_avg_health: 'Avg Health', home_alerts: 'Alerts',
    scheme_title: 'Govt Scheme Finder',
    scheme_subtitle: 'Answer a few questions — see every scheme you qualify for',
    offline: 'Offline mode', system_online: 'Online',
  },

  // ──────────────────────────────── HINDI ──────────────────────────────────
  hi: {
    nav_dashboard: 'डैशबोर्ड', nav_disease: 'रोग पहचान',
    nav_pest: 'कीट पहचान', nav_market: 'बाज़ार भाव',
    nav_chatbot: 'AI सहायक', nav_weather: 'मौसम',
    nav_crop_advisor: 'फसल सलाहकार', nav_crop_cycle: 'फसल चक्र',
    nav_fertilizer: 'उर्वरक', nav_expense: 'खर्च और मुनाफा',
    nav_soil: 'मिट्टी पासपोर्ट', nav_analytics: 'विश्लेषण',
    nav_outbreak: 'रोग प्रकोप मानचित्र', nav_schemes: 'सरकारी योजनाएं',
    nav_complaints: 'शिकायतें', nav_admin: 'प्रशासन',
    grp_main: 'मुख्य', grp_market_weather: 'बाज़ार और मौसम',
    grp_farm: 'खेत प्रबंधन', grp_intelligence: 'जानकारी',
    search: 'खोजें', save: 'सहेजें', submit: 'जमा करें', cancel: 'रद्द करें',
    back: 'वापस', next: 'आगे', close: 'बंद करें', yes: 'हाँ', no: 'नहीं',
    loading: 'लोड हो रहा है…', error: 'त्रुटि', no_data: 'कोई डेटा नहीं',
    logout: 'लॉग आउट', profile: 'प्रोफ़ाइल',
    language: 'भाषा', select_language: 'भाषा चुनें',
    weather_title: 'मौसम जानकारी',
    weather_subtitle: 'आपके खेत के लिए स्थानीय पूर्वानुमान',
    weather_search_placeholder: 'शहर या जिला खोजें…',
    weather_humidity: 'नमी', weather_wind: 'हवा',
    weather_visibility: 'दृश्यता', weather_cloud: 'बादल',
    weather_feels: 'महसूस होता है',
    weather_advisory: 'कृषि सलाह',
    weather_irrigation: 'सिंचाई', weather_spray: 'छिड़काव समय',
    weather_forecast: '7-दिन पूर्वानुमान', weather_tip: 'आज की खेती सलाह',
    weather_risk: 'जोखिम विश्लेषण', weather_pest_risk: 'कीट जोखिम',
    weather_disease_risk: 'रोग जोखिम', weather_drought_risk: 'सूखे का जोखिम',
    weather_frost_risk: 'पाले का जोखिम', weather_flood_risk: 'बाढ़ का जोखिम',
    weather_today: 'आज',
    home_greeting_morning: 'सुप्रभात', home_greeting_afternoon: 'नमस्कार',
    home_greeting_evening: 'शुभ संध्या',
    home_active_crops: 'सक्रिय फसलें', home_total_lands: 'खेत',
    home_total_acres: 'एकड़', home_avg_health: 'औसत स्वास्थ्य', home_alerts: 'चेतावनियां',
    scheme_title: 'सरकारी योजना खोजक',
    scheme_subtitle: 'कुछ सवालों के जवाब दें — पात्र योजनाएं देखें',
    offline: 'ऑफलाइन मोड', system_online: 'ऑनलाइन',
  },

  // ──────────────────────────────── MARATHI ────────────────────────────────
  mr: {
    nav_dashboard: 'डॅशबोर्ड', nav_disease: 'रोग ओळख',
    nav_pest: 'कीड ओळख', nav_market: 'बाजारभाव',
    nav_chatbot: 'AI सहाय्यक', nav_weather: 'हवामान',
    nav_crop_advisor: 'पीक सल्लागार', nav_crop_cycle: 'पीक चक्र',
    nav_fertilizer: 'खते', nav_expense: 'खर्च आणि नफा',
    nav_soil: 'माती पासपोर्ट', nav_analytics: 'विश्लेषण',
    nav_outbreak: 'रोग उद्रेक नकाशा', nav_schemes: 'शासकीय योजना',
    nav_complaints: 'तक्रारी', nav_admin: 'प्रशासन',
    grp_main: 'मुख्य', grp_market_weather: 'बाजार आणि हवामान',
    grp_farm: 'शेत व्यवस्थापन', grp_intelligence: 'माहिती',
    search: 'शोधा', save: 'जतन करा', submit: 'सादर करा', cancel: 'रद्द करा',
    back: 'मागे', next: 'पुढे', close: 'बंद करा', yes: 'हो', no: 'नाही',
    loading: 'लोड होत आहे…', error: 'त्रुटी', no_data: 'डेटा नाही',
    logout: 'लॉग आउट', profile: 'प्रोफाईल',
    language: 'भाषा', select_language: 'भाषा निवडा',
    weather_title: 'हवामान माहिती',
    weather_subtitle: 'तुमच्या शेतासाठी स्थानिक अंदाज',
    weather_search_placeholder: 'शहर किंवा जिल्हा शोधा…',
    weather_humidity: 'आर्द्रता', weather_wind: 'वारा',
    weather_visibility: 'दृश्यमानता', weather_cloud: 'ढग',
    weather_feels: 'जाणवते',
    weather_advisory: 'कृषी सल्ला',
    weather_irrigation: 'सिंचन', weather_spray: 'फवारणी वेळ',
    weather_forecast: '७-दिवसांचा अंदाज', weather_tip: 'आजचा शेती सल्ला',
    weather_risk: 'धोका विश्लेषण', weather_pest_risk: 'कीड धोका',
    weather_disease_risk: 'रोग धोका', weather_drought_risk: 'दुष्काळ धोका',
    weather_frost_risk: 'दंव धोका', weather_flood_risk: 'पूर धोका',
    weather_today: 'आज',
    home_greeting_morning: 'शुभ प्रभात', home_greeting_afternoon: 'नमस्कार',
    home_greeting_evening: 'शुभ संध्या',
    home_active_crops: 'सक्रिय पिके', home_total_lands: 'शेते',
    home_total_acres: 'एकर', home_avg_health: 'सरासरी आरोग्य', home_alerts: 'सूचना',
    scheme_title: 'शासकीय योजना शोधक',
    scheme_subtitle: 'काही प्रश्नांची उत्तरे द्या — पात्र योजना पाहा',
    offline: 'ऑफलाइन मोड', system_online: 'ऑनलाइन',
  },

  // ──────────────────────────────── PUNJABI ────────────────────────────────
  pa: {
    nav_dashboard: 'ਡੈਸ਼ਬੋਰਡ', nav_disease: 'ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ',
    nav_pest: 'ਕੀਟ ਦੀ ਪਛਾਣ', nav_market: 'ਬਾਜ਼ਾਰ ਭਾਅ',
    nav_chatbot: 'AI ਸਹਾਇਕ', nav_weather: 'ਮੌਸਮ',
    nav_crop_advisor: 'ਫਸਲ ਸਲਾਹਕਾਰ', nav_crop_cycle: 'ਫਸਲ ਚੱਕਰ',
    nav_fertilizer: 'ਖਾਦ', nav_expense: 'ਖਰਚਾ ਅਤੇ ਮੁਨਾਫ਼ਾ',
    nav_soil: 'ਮਿੱਟੀ ਪਾਸਪੋਰਟ', nav_analytics: 'ਵਿਸ਼ਲੇਸ਼ਣ',
    nav_outbreak: 'ਰੋਗ ਫੈਲਾਅ ਨਕਸ਼ਾ', nav_schemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
    nav_complaints: 'ਸ਼ਿਕਾਇਤਾਂ', nav_admin: 'ਪ੍ਰਸ਼ਾਸਨ',
    grp_main: 'ਮੁੱਖ', grp_market_weather: 'ਬਾਜ਼ਾਰ ਅਤੇ ਮੌਸਮ',
    grp_farm: 'ਖੇਤ ਪ੍ਰਬੰਧਨ', grp_intelligence: 'ਜਾਣਕਾਰੀ',
    search: 'ਖੋਜੋ', save: 'ਸੁਰੱਖਿਅਤ ਕਰੋ', submit: 'ਜਮ੍ਹਾ ਕਰੋ', cancel: 'ਰੱਦ ਕਰੋ',
    back: 'ਵਾਪਸ', next: 'ਅੱਗੇ', close: 'ਬੰਦ ਕਰੋ', yes: 'ਹਾਂ', no: 'ਨਹੀਂ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…', error: 'ਗਲਤੀ', no_data: 'ਕੋਈ ਡੇਟਾ ਨਹੀਂ',
    logout: 'ਲੌਗ ਆਊਟ', profile: 'ਪ੍ਰੋਫਾਈਲ',
    language: 'ਭਾਸ਼ਾ', select_language: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    weather_title: 'ਮੌਸਮ ਜਾਣਕਾਰੀ',
    weather_subtitle: 'ਤੁਹਾਡੇ ਖੇਤ ਲਈ ਸਥਾਨਕ ਅਨੁਮਾਨ',
    weather_search_placeholder: 'ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਖੋਜੋ…',
    weather_humidity: 'ਨਮੀ', weather_wind: 'ਹਵਾ',
    weather_visibility: 'ਦਿੱਖ', weather_cloud: 'ਬੱਦਲ',
    weather_feels: 'ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ',
    weather_advisory: 'ਖੇਤੀ ਸਲਾਹ',
    weather_irrigation: 'ਸਿੰਚਾਈ', weather_spray: 'ਸਪਰੇਅ ਦਾ ਸਮਾਂ',
    weather_forecast: '7-ਦਿਨ ਪੂਰਵ ਅਨੁਮਾਨ', weather_tip: 'ਅੱਜ ਦੀ ਖੇਤੀ ਸਲਾਹ',
    weather_risk: 'ਜੋਖ਼ਮ ਵਿਸ਼ਲੇਸ਼ਣ', weather_pest_risk: 'ਕੀਟ ਜੋਖ਼ਮ',
    weather_disease_risk: 'ਬਿਮਾਰੀ ਜੋਖ਼ਮ', weather_drought_risk: 'ਸੋਕੇ ਦਾ ਜੋਖ਼ਮ',
    weather_frost_risk: 'ਪਾਲੇ ਦਾ ਜੋਖ਼ਮ', weather_flood_risk: 'ਹੜ੍ਹ ਦਾ ਜੋਖ਼ਮ',
    weather_today: 'ਅੱਜ',
    home_greeting_morning: 'ਸ਼ੁਭ ਸਵੇਰ', home_greeting_afternoon: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
    home_greeting_evening: 'ਸ਼ੁਭ ਸ਼ਾਮ',
    home_active_crops: 'ਸਰਗਰਮ ਫਸਲਾਂ', home_total_lands: 'ਜ਼ਮੀਨਾਂ',
    home_total_acres: 'ਏਕੜ', home_avg_health: 'ਔਸਤ ਸਿਹਤ', home_alerts: 'ਸੂਚਨਾਵਾਂ',
    scheme_title: 'ਸਰਕਾਰੀ ਯੋਜਨਾ ਖੋਜਕ',
    scheme_subtitle: 'ਕੁਝ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ — ਯੋਗ ਯੋਜਨਾਵਾਂ ਵੇਖੋ',
    offline: 'ਆਫਲਾਈਨ ਮੋਡ', system_online: 'ਔਨਲਾਈਨ',
  },

  // ──────────────────────────────── GUJARATI ───────────────────────────────
  gu: {
    nav_dashboard: 'ડૅશબોર્ડ', nav_disease: 'રોગ ઓળખ',
    nav_pest: 'કીટ ઓળખ', nav_market: 'બજાર ભાવ',
    nav_chatbot: 'AI સહાયક', nav_weather: 'હવામાન',
    nav_crop_advisor: 'પાક સલાહકાર', nav_crop_cycle: 'પાક ચક્ર',
    nav_fertilizer: 'ખાતર', nav_expense: 'ખર્ચ અને નફો',
    nav_soil: 'માટી પાસપોર્ટ', nav_analytics: 'વિશ્લેષણ',
    nav_outbreak: 'રોગ ફેલાવો નકશો', nav_schemes: 'સરકારી યોજનાઓ',
    nav_complaints: 'ફરિયાદો', nav_admin: 'એડમિન',
    grp_main: 'મુખ્ય', grp_market_weather: 'બજાર અને હવામાન',
    grp_farm: 'ખેત વ્યવસ્થાપન', grp_intelligence: 'માહિતી',
    search: 'શોધો', save: 'સાચવો', submit: 'સબમિટ', cancel: 'રદ કરો',
    back: 'પાછળ', next: 'આગળ', close: 'બંધ', yes: 'હા', no: 'ના',
    loading: 'લોડ થઈ રહ્યું છે…', error: 'ભૂલ', no_data: 'ડેટા નથી',
    logout: 'લૉગ આઉટ', profile: 'પ્રોફાઈલ',
    language: 'ભાષા', select_language: 'ભાષા પસંદ કરો',
    weather_title: 'હવામાન માહિતી',
    weather_subtitle: 'તમારા ખેત માટે સ્થાનિક આગાહી',
    weather_search_placeholder: 'શહેર અથવા જિલ્લો શોધો…',
    weather_humidity: 'ભેજ', weather_wind: 'પવન',
    weather_visibility: 'દૃશ્યતા', weather_cloud: 'વાદળ',
    weather_feels: 'અનુભવ',
    weather_advisory: 'કૃષિ સલાહ',
    weather_irrigation: 'સિંચાઈ', weather_spray: 'છંટકાવ સમય',
    weather_forecast: '7-દિવસ આગાહી', weather_tip: 'આજની ખેતી સલાહ',
    weather_risk: 'જોખમ વિશ્લેષણ', weather_pest_risk: 'કીટ જોખમ',
    weather_disease_risk: 'રોગ જોખમ', weather_drought_risk: 'દુષ્કાળ જોખમ',
    weather_frost_risk: 'હિમ જોખમ', weather_flood_risk: 'પૂર જોખમ',
    weather_today: 'આજ',
    home_greeting_morning: 'સુપ્રભાત', home_greeting_afternoon: 'નમસ્કાર',
    home_greeting_evening: 'શુભ સાંજ',
    home_active_crops: 'સક્રિય પાક', home_total_lands: 'ખેતરો',
    home_total_acres: 'એકર', home_avg_health: 'સ્વ. સ્તર', home_alerts: 'ચેતવણી',
    scheme_title: 'સરકારી યોજના શોધક',
    scheme_subtitle: 'કેટલાક પ્રશ્નોના જવાબ આપો — પાત્ર યોજનાઓ જુઓ',
    offline: 'ઑફલાઇન મોડ', system_online: 'ઑનલાઇન',
  },

  // ──────────────────────────────── TAMIL ──────────────────────────────────
  ta: {
    nav_dashboard: 'டாஷ்போர்ட்', nav_disease: 'நோய் கண்டறிதல்',
    nav_pest: 'பூச்சி கண்டறிதல்', nav_market: 'சந்தை விலை',
    nav_chatbot: 'AI உதவியாளர்', nav_weather: 'வானிலை',
    nav_crop_advisor: 'பயிர் ஆலோசகர்', nav_crop_cycle: 'பயிர் சுழற்சி',
    nav_fertilizer: 'உர மேலாண்மை', nav_expense: 'செலவு & லாபம்',
    nav_soil: 'மண் பாஸ்போர்ட்', nav_analytics: 'பகுப்பாய்வு',
    nav_outbreak: 'நோய் பரவல் வரைபடம்', nav_schemes: 'அரசு திட்டங்கள்',
    nav_complaints: 'புகார்கள்', nav_admin: 'நிர்வாகம்',
    grp_main: 'முதன்மை', grp_market_weather: 'சந்தை & வானிலை',
    grp_farm: 'பண்ணை மேலாண்மை', grp_intelligence: 'தகவல்',
    search: 'தேடு', save: 'சேமி', submit: 'சமர்பி', cancel: 'ரத்து',
    back: 'திரும்பு', next: 'அடுத்து', close: 'மூடு', yes: 'ஆம்', no: 'இல்லை',
    loading: 'ஏற்றுகிறது…', error: 'பிழை', no_data: 'தரவு இல்லை',
    logout: 'வெளியேறு', profile: 'சுயவிவரம்',
    language: 'மொழி', select_language: 'மொழி தேர்ந்தெடு',
    weather_title: 'வானிலை தகவல்',
    weather_subtitle: 'உங்கள் பண்ணைக்கான உள்ளூர் முன்னறிவிப்பு',
    weather_search_placeholder: 'நகர் அல்லது மாவட்டம் தேடு…',
    weather_humidity: 'ஈரப்பதம்', weather_wind: 'காற்று',
    weather_visibility: 'தெரிவுத்திறன்', weather_cloud: 'மேகம்',
    weather_feels: 'உணர்வு',
    weather_advisory: 'விவசாய ஆலோசனை',
    weather_irrigation: 'நீர்ப்பாசனம்', weather_spray: 'தெளிப்பு நேரம்',
    weather_forecast: '7-நாள் முன்னறிவிப்பு', weather_tip: 'இன்றைய விவசாய குறிப்பு',
    weather_risk: 'அபாய பகுப்பாய்வு', weather_pest_risk: 'பூச்சி அபாயம்',
    weather_disease_risk: 'நோய் அபாயம்', weather_drought_risk: 'வறட்சி அபாயம்',
    weather_frost_risk: 'பனி அபாயம்', weather_flood_risk: 'வெள்ள அபாயம்',
    weather_today: 'இன்று',
    home_greeting_morning: 'காலை வணக்கம்', home_greeting_afternoon: 'மதிய வணக்கம்',
    home_greeting_evening: 'மாலை வணக்கம்',
    home_active_crops: 'செயல்படும் பயிர்கள்', home_total_lands: 'நிலங்கள்',
    home_total_acres: 'ஏக்கர்', home_avg_health: 'சராசரி ஆரோக்கியம்', home_alerts: 'விழிப்பூட்டல்கள்',
    scheme_title: 'அரசு திட்ட தேடல்',
    scheme_subtitle: 'சில கேள்விகளுக்கு பதிலளியுங்கள் — தகுதியான திட்டங்களை காணுங்கள்',
    offline: 'இணைப்பற்ற பயன்முறை', system_online: 'இணைந்துள்ளது',
  },

  // ──────────────────────────────── TELUGU ─────────────────────────────────
  te: {
    nav_dashboard: 'డాష్‌బోర్డ్', nav_disease: 'వ్యాధి నిర్ధారణ',
    nav_pest: 'పురుగు గుర్తింపు', nav_market: 'మార్కెట్ ధరలు',
    nav_chatbot: 'AI సహాయకుడు', nav_weather: 'వాతావరణం',
    nav_crop_advisor: 'పంట సలహాదారు', nav_crop_cycle: 'పంట చక్రం',
    nav_fertilizer: 'ఎరువులు', nav_expense: 'ఖర్చు & లాభం',
    nav_soil: 'మట్టి పాస్‌పోర్ట్', nav_analytics: 'విశ్లేషణ',
    nav_outbreak: 'వ్యాధి వ్యాప్తి పటం', nav_schemes: 'ప్రభుత్వ పథకాలు',
    nav_complaints: 'ఫిర్యాదులు', nav_admin: 'నిర్వహణ',
    grp_main: 'ప్రధాన', grp_market_weather: 'మార్కెట్ & వాతావరణం',
    grp_farm: 'వ్యవసాయ నిర్వహణ', grp_intelligence: 'సమాచారం',
    search: 'వెతకు', save: 'సేవ్', submit: 'సమర్పించు', cancel: 'రద్దు',
    back: 'వెనుక', next: 'తదుపరి', close: 'మూసివేయి', yes: 'అవును', no: 'కాదు',
    loading: 'లోడ్ అవుతోంది…', error: 'లోపం', no_data: 'డేటా లేదు',
    logout: 'లాగ్ అవుట్', profile: 'ప్రొఫైల్',
    language: 'భాష', select_language: 'భాష ఎంచుకోండి',
    weather_title: 'వాతావరణ సమాచారం',
    weather_subtitle: 'మీ పొలానికి స్థానిక వాతావరణ అంచనా',
    weather_search_placeholder: 'నగరం లేదా జిల్లా వెతకండి…',
    weather_humidity: 'తేమ', weather_wind: 'గాలి',
    weather_visibility: 'దృష్టి పరిధి', weather_cloud: 'మేఘం',
    weather_feels: 'అనుభవం',
    weather_advisory: 'వ్యవసాయ సలహా',
    weather_irrigation: 'నీటిపారుదల', weather_spray: 'పిచికారీ సమయం',
    weather_forecast: '7 రోజుల అంచనా', weather_tip: 'నేటి వ్యవసాయ సలహా',
    weather_risk: 'ప్రమాద విశ్లేషణ', weather_pest_risk: 'పురుగు ప్రమాదం',
    weather_disease_risk: 'వ్యాధి ప్రమాదం', weather_drought_risk: 'కరువు ప్రమాదం',
    weather_frost_risk: 'మంచు ప్రమాదం', weather_flood_risk: 'వరద ప్రమాదం',
    weather_today: 'ఈరోజు',
    home_greeting_morning: 'శుభోదయం', home_greeting_afternoon: 'నమస్కారం',
    home_greeting_evening: 'శుభ సాయంత్రం',
    home_active_crops: 'చురుకైన పంటలు', home_total_lands: 'భూములు',
    home_total_acres: 'ఎకరాలు', home_avg_health: 'సగటు ఆరోగ్యం', home_alerts: 'హెచ్చరికలు',
    scheme_title: 'ప్రభుత్వ పథకం ఫైండర్',
    scheme_subtitle: 'కొన్ని ప్రశ్నలకు జవాబివ్వండి — అర్హత ఉన్న పథకాలు చూడండి',
    offline: 'ఆఫ్‌లైన్ మోడ్', system_online: 'ఆన్‌లైన్',
  },

  // ──────────────────────────────── KANNADA ────────────────────────────────
  kn: {
    nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', nav_disease: 'ರೋಗ ಪತ್ತೆ',
    nav_pest: 'ಕೀಟ ಪತ್ತೆ', nav_market: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
    nav_chatbot: 'AI ಸಹಾಯಕ', nav_weather: 'ಹವಾಮಾನ',
    nav_crop_advisor: 'ಬೆಳೆ ಸಲಹೆಗಾರ', nav_crop_cycle: 'ಬೆಳೆ ಚಕ್ರ',
    nav_fertilizer: 'ಗೊಬ್ಬರ', nav_expense: 'ಖರ್ಚು & ಲಾಭ',
    nav_soil: 'ಮಣ್ಣು ಪಾಸ್‌ಪೋರ್ಟ್', nav_analytics: 'ವಿಶ್ಲೇಷಣೆ',
    nav_outbreak: 'ರೋಗ ಹರಡುವಿಕೆ ನಕ್ಷೆ', nav_schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    nav_complaints: 'ದೂರುಗಳು', nav_admin: 'ಆಡಳಿತ',
    grp_main: 'ಮುಖ್ಯ', grp_market_weather: 'ಮಾರುಕಟ್ಟೆ & ಹವಾಮಾನ',
    grp_farm: 'ಕೃಷಿ ನಿರ್ವಹಣೆ', grp_intelligence: 'ಮಾಹಿತಿ',
    search: 'ಹುಡುಕಿ', save: 'ಉಳಿಸಿ', submit: 'ಸಲ್ಲಿಸಿ', cancel: 'ರದ್ದು',
    back: 'ಹಿಂದೆ', next: 'ಮುಂದೆ', close: 'ಮುಚ್ಚಿ', yes: 'ಹೌದು', no: 'ಇಲ್ಲ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…', error: 'ದೋಷ', no_data: 'ಡೇಟಾ ಇಲ್ಲ',
    logout: 'ಲಾಗ್ ಔಟ್', profile: 'ಪ್ರೊಫೈಲ್',
    language: 'ಭಾಷೆ', select_language: 'ಭಾಷೆ ಆಯ್ಕೆ',
    weather_title: 'ಹವಾಮಾನ ಮಾಹಿತಿ',
    weather_subtitle: 'ನಿಮ್ಮ ಕ್ಷೇತ್ರಕ್ಕಾಗಿ ಸ್ಥಳೀಯ ಮುನ್ಸೂಚನೆ',
    weather_search_placeholder: 'ನಗರ ಅಥವಾ ಜಿಲ್ಲೆ ಹುಡುಕಿ…',
    weather_humidity: 'ಆರ್ದ್ರತೆ', weather_wind: 'ಗಾಳಿ',
    weather_visibility: 'ಗೋಚರತೆ', weather_cloud: 'ಮೋಡ',
    weather_feels: 'ಅನುಭವ',
    weather_advisory: 'ಕೃಷಿ ಸಲಹೆ',
    weather_irrigation: 'ನೀರಾವರಿ', weather_spray: 'ಸ್ಪ್ರೇ ಸಮಯ',
    weather_forecast: '7-ದಿನ ಮುನ್ಸೂಚನೆ', weather_tip: 'ಇಂದಿನ ಕೃಷಿ ಸಲಹೆ',
    weather_risk: 'ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ', weather_pest_risk: 'ಕೀಟ ಅಪಾಯ',
    weather_disease_risk: 'ರೋಗ ಅಪಾಯ', weather_drought_risk: 'ಬರಗಾಲ ಅಪಾಯ',
    weather_frost_risk: 'ಮಂಜು ಅಪಾಯ', weather_flood_risk: 'ಪ್ರವಾಹ ಅಪಾಯ',
    weather_today: 'ಇಂದು',
    home_greeting_morning: 'ಶುಭೋದಯ', home_greeting_afternoon: 'ನಮಸ್ಕಾರ',
    home_greeting_evening: 'ಶುಭ ಸಂಜೆ',
    home_active_crops: 'ಸಕ್ರಿಯ ಬೆಳೆಗಳು', home_total_lands: 'ಭೂಮಿಗಳು',
    home_total_acres: 'ಎಕರೆ', home_avg_health: 'ಸಾ. ಆರೋಗ್ಯ', home_alerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    scheme_title: 'ಸರ್ಕಾರಿ ಯೋಜನೆ ಪತ್ತೆ',
    scheme_subtitle: 'ಕೆಲವು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ — ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
    offline: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್', system_online: 'ಆನ್‌ಲೈನ್',
  },

  // ──────────────────────────────── BENGALI ────────────────────────────────
  bn: {
    nav_dashboard: 'ড্যাশবোর্ড', nav_disease: 'রোগ শনাক্তকরণ',
    nav_pest: 'পোকামাকড় শনাক্ত', nav_market: 'বাজারদর',
    nav_chatbot: 'AI সহকারী', nav_weather: 'আবহাওয়া',
    nav_crop_advisor: 'ফসল পরামর্শদাতা', nav_crop_cycle: 'ফসল চক্র',
    nav_fertilizer: 'সার', nav_expense: 'ব্যয় ও লাভ',
    nav_soil: 'মাটি পাসপোর্ট', nav_analytics: 'বিশ্লেষণ',
    nav_outbreak: 'রোগ প্রাদুর্ভাব মানচিত্র', nav_schemes: 'সরকারি প্রকল্প',
    nav_complaints: 'অভিযোগ', nav_admin: 'প্রশাসন',
    grp_main: 'প্রধান', grp_market_weather: 'বাজার ও আবহাওয়া',
    grp_farm: 'খামার ব্যবস্থাপনা', grp_intelligence: 'তথ্য',
    search: 'অনুসন্ধান', save: 'সংরক্ষণ', submit: 'জমা দিন', cancel: 'বাতিল',
    back: 'পিছনে', next: 'পরবর্তী', close: 'বন্ধ', yes: 'হ্যাঁ', no: 'না',
    loading: 'লোড হচ্ছে…', error: 'ত্রুটি', no_data: 'কোনো ডেটা নেই',
    logout: 'লগ আউট', profile: 'প্রোফাইল',
    language: 'ভাষা', select_language: 'ভাষা নির্বাচন',
    weather_title: 'আবহাওয়া তথ্য',
    weather_subtitle: 'আপনার খামারের জন্য স্থানীয় পূর্বাভাস',
    weather_search_placeholder: 'শহর বা জেলা খুঁজুন…',
    weather_humidity: 'আর্দ্রতা', weather_wind: 'বায়ু',
    weather_visibility: 'দৃশ্যমানতা', weather_cloud: 'মেঘ',
    weather_feels: 'অনুভব',
    weather_advisory: 'কৃষি পরামর্শ',
    weather_irrigation: 'সেচ', weather_spray: 'স্প্রে সময়',
    weather_forecast: '৭-দিনের পূর্বাভাস', weather_tip: 'আজকের কৃষি টিপস',
    weather_risk: 'ঝুঁকি বিশ্লেষণ', weather_pest_risk: 'পোকা ঝুঁকি',
    weather_disease_risk: 'রোগ ঝুঁকি', weather_drought_risk: 'খরার ঝুঁকি',
    weather_frost_risk: 'তুষার ঝুঁকি', weather_flood_risk: 'বন্যার ঝুঁকি',
    weather_today: 'আজ',
    home_greeting_morning: 'শুভ সকাল', home_greeting_afternoon: 'শুভ দুপুর',
    home_greeting_evening: 'শুভ সন্ধ্যা',
    home_active_crops: 'সক্রিয় ফসল', home_total_lands: 'জমি',
    home_total_acres: 'একর', home_avg_health: 'গড় স্বাস্থ্য', home_alerts: 'সতর্কতা',
    scheme_title: 'সরকারি প্রকল্প অনুসন্ধান',
    scheme_subtitle: 'কিছু প্রশ্নের উত্তর দিন — যোগ্য প্রকল্পগুলি দেখুন',
    offline: 'অফলাইন মোড', system_online: 'অনলাইন',
  },

  // ──────────────────────────────── ODIA ───────────────────────────────────
  or: {
    nav_dashboard: 'ଡ୍ୟାଶ୍‌ବୋର୍ଡ', nav_disease: 'ରୋଗ ଚିହ୍ନଟ',
    nav_pest: 'ପୋକ ଚିହ୍ନଟ', nav_market: 'ବଜାର ଦର',
    nav_chatbot: 'AI ସହାୟକ', nav_weather: 'ଆବହୱା',
    nav_crop_advisor: 'ଫସଲ ପରାମର୍ଶ', nav_crop_cycle: 'ଫସଲ ଚକ୍ର',
    nav_fertilizer: 'ସାର', nav_expense: 'ଖର୍ଚ ଓ ଲାଭ',
    nav_soil: 'ମାଟି ପାସ୍‌ପୋର୍ଟ', nav_analytics: 'ବିଶ୍ଲେଷଣ',
    nav_outbreak: 'ରୋଗ ଏ ମ୍ୟାପ', nav_schemes: 'ସରକାରୀ ଯୋଜନା',
    nav_complaints: 'ଅଭିଯୋଗ', nav_admin: 'ପ୍ରଶାସନ',
    grp_main: 'ମୁଖ୍ୟ', grp_market_weather: 'ବଜାର ଓ ଆବହୱା',
    grp_farm: 'ଚାଷ ପ୍ରବନ୍ଧ', grp_intelligence: 'ସୂଚନା',
    search: 'ଖୋଜ', save: 'ସଞ୍ଚୟ', submit: 'ଦାଖଲ', cancel: 'ବାତିଲ',
    back: 'ପଛକୁ', next: 'ଆଗକୁ', close: 'ବନ୍ଦ', yes: 'ହଁ', no: 'ନା',
    loading: 'ଲୋଡ ହେଉଛି…', error: 'ତ୍ରୁଟି', no_data: 'ତଥ୍ୟ ନାହିଁ',
    logout: 'ଲଗ ଆଉଟ', profile: 'ପ୍ରୋଫାଇଲ',
    language: 'ଭାଷା', select_language: 'ଭାଷା ବାଛ',
    weather_title: 'ଆବହୱା ସୂଚନା',
    weather_subtitle: 'ଆପଣଙ୍କ ଜମି ପାଇଁ ସ୍ଥାନୀୟ ପୂର୍ବାନୁମାନ',
    weather_search_placeholder: 'ସହର ବା ଜିଲ୍ଲା ଖୋଜ…',
    weather_humidity: 'ଆର୍ଦ୍ରତା', weather_wind: 'ବାୟୁ',
    weather_visibility: 'ଦୃଶ୍ୟ', weather_cloud: 'ମେଘ',
    weather_feels: 'ଲାଗୁଛି',
    weather_advisory: 'କୃଷି ପରାମର୍ଶ',
    weather_irrigation: 'ଜଳସେଚନ', weather_spray: 'ସ୍ପ୍ରେ ସମୟ',
    weather_forecast: '7 ଦିନ ପୂର୍ବାନୁମାନ', weather_tip: 'ଆଜିର ଚାଷ ଟିପ',
    weather_risk: 'ଖତରା ବିଶ୍ଲେଷଣ', weather_pest_risk: 'ପୋକ ଖତରା',
    weather_disease_risk: 'ରୋଗ ଖତରା', weather_drought_risk: 'ଖରା ଖତରା',
    weather_frost_risk: 'ତୁଷାର ଖତରା', weather_flood_risk: 'ବନ୍ୟା ଖତରା',
    weather_today: 'ଆଜି',
    home_greeting_morning: 'ଶୁଭ ପ୍ରଭାତ', home_greeting_afternoon: 'ନମସ୍କାର',
    home_greeting_evening: 'ଶୁଭ ସନ୍ଧ୍ୟା',
    home_active_crops: 'ସକ୍ରିୟ ଫସଲ', home_total_lands: 'ଜମି',
    home_total_acres: 'ଏକର', home_avg_health: 'ଗ. ସ୍ୱାସ୍ଥ୍ୟ', home_alerts: 'ସଚେତନ',
    scheme_title: 'ସରକାରୀ ଯୋଜନା ଖୋଜ',
    scheme_subtitle: 'କିଛି ପ୍ରଶ୍ନ ଉତ୍ତର ଦିଅ — ଯୋଗ୍ୟ ଯୋଜନା ଦେଖ',
    offline: 'ଅଫ୍‌ଲାଇନ ମୋଡ', system_online: 'ଅନ୍‌ଲାଇନ',
  },

  // ──────────────────────────────── MALAYALAM ──────────────────────────────
  ml: {
    nav_dashboard: 'ഡാഷ്‌ബോർഡ്', nav_disease: 'രോഗ കണ്ടുപിടിത്തം',
    nav_pest: 'കീട തിരിച്ചറിയൽ', nav_market: 'വിപണി വില',
    nav_chatbot: 'AI സഹായി', nav_weather: 'കാലാവസ്ഥ',
    nav_crop_advisor: 'വിള ഉപദേഷ്ടാവ്', nav_crop_cycle: 'വിള ചക്രം',
    nav_fertilizer: 'വളങ്ങൾ', nav_expense: 'ചെലവ് & ലാഭം',
    nav_soil: 'മണ്ണ് പാസ്‌പോർട്ട്', nav_analytics: 'വിശകലനം',
    nav_outbreak: 'രോഗ വ്യാപന ഭൂപടം', nav_schemes: 'സർക്കാർ പദ്ധതികൾ',
    nav_complaints: 'പരാതികൾ', nav_admin: 'അഡ്മിൻ',
    grp_main: 'പ്രധാന', grp_market_weather: 'വിപണി & കാലാവസ്ഥ',
    grp_farm: 'കൃഷി മാനേജ്മെന്റ്', grp_intelligence: 'വിവരങ്ങൾ',
    search: 'തിരയുക', save: 'സേവ് ചെയ്യുക', submit: 'സമർപ്പിക്കുക', cancel: 'റദ്ദാക്കുക',
    back: 'പിന്നോട്ട്', next: 'അടുത്തത്', close: 'അടയ്ക്കുക', yes: 'അതെ', no: 'ഇല്ല',
    loading: 'ലോഡ് ആകുന്നു…', error: 'പിഴവ്', no_data: 'ഡേറ്റ ഇല്ല',
    logout: 'ലോഗ്ഔട്ട്', profile: 'പ്രൊഫൈൽ',
    language: 'ഭാഷ', select_language: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    weather_title: 'കാലാവസ്ഥ വിവരം',
    weather_subtitle: 'നിങ്ങളുടെ കൃഷിഭൂമിക്കായി പ്രദേശിക പ്രവചനം',
    weather_search_placeholder: 'നഗരം അല്ലെങ്കിൽ ജില്ല തിരയുക…',
    weather_humidity: 'ആർദ്രത', weather_wind: 'കാറ്റ്',
    weather_visibility: 'ദൃശ്യത', weather_cloud: 'മേഘം',
    weather_feels: 'തോന്നൽ',
    weather_advisory: 'കൃഷി ഉപദേശം',
    weather_irrigation: 'ജലസേചനം', weather_spray: 'തളിക്കൽ സമയം',
    weather_forecast: '7 ദിവസ പ്രവചനം', weather_tip: 'ഇന്നത്തെ കൃഷി നുറുങ്ങ്',
    weather_risk: 'അപകട വിശകലനം', weather_pest_risk: 'കീട അപകടം',
    weather_disease_risk: 'രോഗ അപകടം', weather_drought_risk: 'വരൾച്ച അപകടം',
    weather_frost_risk: 'മഞ്ഞ് അപകടം', weather_flood_risk: 'വെള്ളപ്പൊക്ക അപകടം',
    weather_today: 'ഇന്ന്',
    home_greeting_morning: 'ശുഭപ്രഭാതം', home_greeting_afternoon: 'നമസ്കാരം',
    home_greeting_evening: 'ശുഭ സന്ധ്യ',
    home_active_crops: 'സജീവ വിളകൾ', home_total_lands: 'ഭൂമി',
    home_total_acres: 'ഏക്കർ', home_avg_health: 'ശ. ആരോഗ്യം', home_alerts: 'മുന്നറിയിപ്പ്',
    scheme_title: 'സർക്കാർ പദ്ധതി ഫൈൻഡർ',
    scheme_subtitle: 'ചില ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക — അർഹതയുള്ള പദ്ധതികൾ കാണുക',
    offline: 'ഓഫ്‌ലൈൻ മോഡ്', system_online: 'ഓൺലൈൻ',
  },
}

/** Returns a translation function t(key, fallback?) for the current app language */
export function useT() {
  const { state } = useApp()
  const lang = state?.language || 'en'
  return (key, fallback) =>
    T[lang]?.[key] ?? T.en?.[key] ?? fallback ?? key
}

export { T as TRANSLATIONS }

```


## `frontend-src/src/index.css`


```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Animated grain texture ── */
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10%       { transform: translate(-2%, -3%); }
  20%       { transform: translate(3%, 2%); }
  30%       { transform: translate(-1%, 4%); }
  40%       { transform: translate(4%, -1%); }
  50%       { transform: translate(-3%, 3%); }
  60%       { transform: translate(2%, -4%); }
  70%       { transform: translate(-4%, 1%); }
  80%       { transform: translate(1%, -2%); }
  90%       { transform: translate(3%, 4%); }
}

/* ── Loading screen animations ── */
@keyframes agriLeafDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes agriLoadProgress {
  0%   { width: 0%; }
  55%  { width: 65%; }
  80%  { width: 84%; }
  100% { width: 100%; }
}

/* ── Shimmer skeleton animation ── */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, #152019 25%, #1B2820 50%, #152019 75%);
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
  border-radius: 4px;
}

/* ── WCAG AA colour-contrast overrides ── */
:root {
  --color-text-3: #9CA3AF;
}

/* Visible focus indicator for all interactive elements */
*:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
  border-radius: 4px;
}

@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  html {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    background: radial-gradient(ellipse at center, #0d1f14 0%, #05100a 100%);
    background-attachment: fixed;
    color: #E8F0EA;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  /* Grain / noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.035;
    animation: grain 8s steps(1) infinite;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* Everything above the grain */
  #root { position: relative; z-index: 1; }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0F1813; border-radius: 99px; }
  ::-webkit-scrollbar-thumb { background: #22C55E; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #16a34a; }
  * { scrollbar-width: thin; scrollbar-color: #22C55E #0F1813; }
}

@layer components {
  /* Card base */
  .card {
    background: linear-gradient(135deg, #152019 0%, #0f1813 100%);
    border: 1px solid rgba(34, 197, 94, 0.08);
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04), 0 4px 24px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }

  /* Glowing green text */
  .glow-text {
    color: #22C55E;
    text-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
  }
  .card-hover {
    background: linear-gradient(135deg, #152019 0%, #0f1813 100%);
    border: 1px solid rgba(34, 197, 94, 0.08);
    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04), 0 4px 24px rgba(0, 0, 0, 0.4);
    @apply transition-all duration-200 cursor-pointer
           hover:bg-surface-2 hover:border-border-strong;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.07);
  }

  /* Button variants */
  .btn-primary {
    @apply flex items-center justify-center gap-2 px-4 py-2 rounded
           bg-primary text-bg text-sm font-semibold
           transition-all duration-150 active:scale-95
           hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply flex items-center justify-center gap-2 px-4 py-2 rounded
           bg-surface-2 border border-border text-text-1 text-sm font-medium
           transition-all duration-150 active:scale-95
           hover:bg-surface-3 hover:border-border-strong;
  }
  .btn-ghost {
    @apply flex items-center justify-center gap-2 px-3 py-1.5 rounded
           text-text-2 text-sm font-medium
           transition-all duration-150 active:scale-95
           hover:bg-surface-2 hover:text-text-1;
  }
  .btn-icon {
    @apply flex items-center justify-center w-9 h-9 rounded
           text-text-2 transition-all duration-150
           hover:bg-surface-2 hover:text-text-1 active:scale-90;
  }

  /* Form inputs */
  .input {
    @apply w-full px-3 py-2 rounded bg-surface border border-border
           text-text-1 text-sm placeholder-text-3
           transition-all duration-150
           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20;
  }
  .label {
    @apply block text-xs font-medium text-text-2 mb-1.5;
  }

  /* Page layout */
  .page-content {
    @apply px-6 py-6 max-w-[1140px] mx-auto;
  }

  /* Section title */
  .section-title {
    @apply text-xs font-semibold text-text-3 uppercase tracking-wider mb-3;
  }

  /* Badges */
  .badge {
    @apply inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium;
  }
  .badge-green  { @apply badge bg-primary-dim text-primary; }
  .badge-red    { @apply badge bg-red-500/10 text-red-400; }
  .badge-yellow { @apply badge bg-amber-500/10 text-amber-400; }
  .badge-blue   { @apply badge bg-blue-500/10 text-blue-400; }

  /* Animated loading skeleton */
  .skeleton {
    @apply bg-surface-2 rounded animate-pulse;
  }
}

/* Smooth page transitions */
.page-enter { animation: fadeIn 0.25s ease; }

/* Price ticker marquee */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}
.ticker-track:hover { animation-play-state: paused; }

@keyframes marquee-reverse {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
.ticker-track-reverse {
  display: flex;
  width: max-content;
  animation: marquee-reverse 22s linear infinite;
}
.ticker-track-reverse:hover { animation-play-state: paused; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Lucide icon defaults */
svg.lucide { display: inline-block; flex-shrink: 0; }

/* ── Leaflet map fixes (Tailwind preflight conflict) ── */
.leaflet-container {
  font-family: inherit;
  background: #1a2b1a;
}
.leaflet-container img.leaflet-tile {
  max-width: none !important;
  max-height: none !important;
  width: 256px !important;
  height: 256px !important;
  display: inline !important;
  box-shadow: none !important;
}
.leaflet-container img {
  max-width: none !important;
  box-shadow: none !important;
}
.leaflet-tile-pane { opacity: 1; }
.leaflet-control-zoom a {
  background: #1e2d1e;
  color: #a3d9a3;
  border-color: #2a3d2a;
}
.leaflet-control-zoom a:hover { background: #2a3d2a; }

```


## `frontend-src/src/main.jsx`


```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'
import 'leaflet/dist/leaflet.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

```


## `frontend-src/src/api/client.js`


```javascript
import axios from 'axios'
import { cacheResponse, getCachedResponse } from './idb'

const API_BASE = '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

function clearAuthAndRedirect(message = 'Session expired. Please log in again.') {
  localStorage.removeItem('authToken')
  localStorage.removeItem('farmer')
  localStorage.removeItem('cropCycles')
  window.dispatchEvent(new CustomEvent('auth:logout'))
  if (window.location.pathname !== '/profile') {
    window.location.href = '/profile'
  }
  throw new Error(message)
}

function readErrorDetail(err, status) {
  if (Array.isArray(err?.detail)) {
    return err.detail.map((e) => e.msg || JSON.stringify(e)).join('; ')
  }
  if (typeof err?.detail === 'string') {
    return err.detail
  }
  return `HTTP ${status}`
}

function isAuthFailure(status, detail) {
  if (status === 401) return true
  if (status !== 403) return false
  const msg = String(detail || '').toLowerCase()
  return msg.includes('token') || msg.includes('not authenticated') || msg.includes('credentials')
}

// Wraps an axios request config with exponential-backoff retry.
// 4xx errors are never retried. Back-off delays: 1 s, 2 s, 4 s.
async function apiRequestWithRetry(requestConfig, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiClient.request(requestConfig)
    } catch (err) {
      const status = err?.response?.status
      // Client errors (4xx) — throw immediately, no retry
      if (status !== undefined && status >= 400 && status < 500) throw err
      // Last attempt — propagate whatever error we have
      if (attempt === maxRetries - 1) throw err
      // Exponential back-off: 1 s → 2 s → 4 s
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
}

async function apiRequest(
  path,
  { method = 'GET', headers = {}, body = undefined, tokenOverride = undefined, redirectOnAuthFailure = true } = {},
) {
  const token = tokenOverride ?? localStorage.getItem('authToken')
  const isMultipart = typeof FormData !== 'undefined' && body instanceof FormData

  const requestHeaders = {
    ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }

  try {
    const response = await apiRequestWithRetry(
      { url: path, method, headers: requestHeaders, data: body, timeout: isMultipart ? 60000 : 30000 },
      isMultipart ? 1 : 3,   // no retry for file uploads
    )
    const data = response.data
    if (method === 'GET') cacheResponse(path, data)
    return data
  } catch (error) {
    if (error?.response) {
      const status = error.response.status
      const detail = readErrorDetail(error.response.data, status)
      if (redirectOnAuthFailure && isAuthFailure(status, detail)) {
        clearAuthAndRedirect('Session expired. Please log in again.')
      }
      if (status === 500) throw new Error('Server error. Please try again.')
      throw new Error(detail || `HTTP ${status}`)
    }

    if (error?.request) {
      if (method === 'GET') {
        const entry = await getCachedResponse(path)
        if (entry) {
          window.dispatchEvent(
            new CustomEvent('api:cache-hit', { detail: { url: path, cachedAt: entry.timestamp } })
          )
          return entry.data
        }
      }
      throw new Error('Network error. Please check your connection.')
    }

    throw new Error(error?.message || 'Request failed')
  }
}

// Core request wrapper
async function apiFetch(path, options = {}) {
  return apiRequest(path, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
  })
}

// Multipart (file upload)
async function apiUpload(path, formData) {
  return apiRequest(path, {
    method: 'POST',
    body: formData,
  })
}

// Fetch with explicit admin token (bypasses localStorage token)
async function apiFetchAdmin(path, adminToken, options = {}) {
  return apiRequest(path, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
    tokenOverride: adminToken,
    redirectOnAuthFailure: false,
  })
}

// Auth
export const authApi = {
  // username + password login
  login: (username, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  // Full registration: name, phone, username, password, state, district, language
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  // OTP flow
  requestOtp: (phone) =>
    apiFetch('/auth/request-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) =>
    apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  me: () => apiFetch('/auth/me'),
  adminLogin: (adminId, password, district = 'Demo District') =>
    apiFetch('/auth/admin/login', { method: 'POST', body: JSON.stringify({ admin_id: adminId, password, district }) }),
  changePassword: (data) =>
    apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
}

// â”€â”€ Farmer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const farmerApi = {
  getMe: () => apiFetch('/farmer/me'),
  getProfile: (id) => apiFetch(`/farmer/profile/${id}`),
  update: (id, data) => apiFetch(`/farmer/profile/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getLands: (farmerId) => apiFetch(`/farmer/land/farmer/${farmerId}`).then(res => Array.isArray(res) ? res : (res.lands || [])),
  addLand: (data) => apiFetch('/farmer/land/register', { method: 'POST', body: JSON.stringify(data) }),
}

// â”€â”€ Weather â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const weatherApi = {
  getIntelligence: (lat, lon, crop) =>
    apiFetch(`/weather/intelligence?lat=${lat}&lon=${lon}${crop ? `&crop=${crop}` : ''}`),
  getRiskAnalysis: (lat, lon, crop) =>
    apiFetch(`/weather/risk-analysis?lat=${lat}&lon=${lon}${crop ? `&crop=${crop}` : ''}`),
  getSpraySchedule: (lat, lon, days = 5) =>
    apiFetch(`/weather/spray-schedule?lat=${lat}&lon=${lon}&days=${days}`),
}

// â”€â”€ Market â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const marketApi = {
  getPrices: (commodity, state) =>
    apiFetch(`/market/prices?commodity=${commodity}${state ? `&state=${state}` : ''}`),
  getTrends: (commodity) => apiFetch(`/market/trends?commodity=${commodity}`),
}

// â”€â”€ Disease Detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const diseaseApi = {
  detect: (formData) => apiUpload('/disease/detect', formData),
  getHistory: (limit = 10) => apiFetch(`/disease/history?limit=${limit}`),
  deleteHistory: (id) => apiFetch(`/disease/history/${id}`, { method: 'DELETE' }),
  getDiseases: () => apiFetch('/disease/diseases'),
  getDisease: (id) => apiFetch(`/disease/diseases/${id}`),
}

// â”€â”€ Pest Detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const pestApi = {
  detect: (formData) => apiUpload('/pest/detect', formData),
}

// â”€â”€ Crop Cycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const cropCycleApi = {
  start: (data) => apiFetch('/cropcycle/start', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id) => apiFetch(`/cropcycle/${id}`),
  getLandCycles: (landId) => apiFetch(`/cropcycle/land/${landId}`),
  listActive: async () => {
    const res = await apiFetch('/cropcycle/all/active')
    if (res?.message?.toLowerCase().includes('no lands')) {
      const err = new Error(res.message)
      err.noLands = true
      throw err
    }
    return Array.isArray(res) ? res : (res.cycles || [])
  },
  logActivity: (cycleId, data) =>
    apiFetch(`/cropcycle/${cycleId}/activity`, { method: 'POST', body: JSON.stringify(data) }),
  complete: (cycleId) =>
    apiFetch(`/cropcycle/${cycleId}/complete`, { method: 'POST', body: JSON.stringify({}) }),
}

// â”€â”€ Chatbot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const chatApi = {
  send: (question, language = 'english', context = null) =>
    apiFetch('/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({ question, language, output_language: language, context, use_history: false }),
    }),
  status: () => apiFetch('/chatbot/health'),
  getHistory: (farmerId) => apiFetch(`/chatbot/history/${farmerId}`),
  deleteHistory: (farmerId) => apiFetch(`/chatbot/history/${farmerId}`, { method: 'DELETE' }),
  quickResponses: () => apiFetch('/chatbot/quick-responses'),
}

// â”€â”€ Fertilizer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fertilizerApi = {
  // crop is query param, SoilInput {nitrogen, phosphorus, potassium, ph} is body
  recommend: (crop, soil) =>
    apiFetch(`/fertilizer/recommend?crop=${encodeURIComponent(crop)}`, { method: 'POST', body: JSON.stringify(soil) }),
}

// â”€â”€ Crop Advisor (Recommendation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const cropApi = {
  recommend: (data) => apiFetch('/crop/recommend', { method: 'POST', body: JSON.stringify(data) }),
  predictYield: (data) => apiFetch('/crop/predict-yield', { method: 'POST', body: JSON.stringify(data) }),
  getCrops: () => apiFetch('/crop/crops'),
  getSeasons: () => apiFetch('/crop/seasons'),
  getDistrictAverages: (state, district) => {
    const params = new URLSearchParams()
    if (state) params.set('state', state)
    if (district) params.set('district', district)
    return apiFetch(`/crop/district-averages?${params}`)
  },
}

// â”€â”€ Analytics (DuckDB) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const analyticsApi = {
  getDiseaseHeatmap: (days = 30) => apiFetch(`/analytics/disease-heatmap?days=${days}`),
  getDiseaseTrends: (days = 90) => apiFetch(`/analytics/disease-trends?days=${days}`),
  getDiseaseByCrop: (days = 30) => apiFetch(`/analytics/disease-by-crop?days=${days}`),
  getDiseaseByeCrop: (days = 30) => apiFetch(`/analytics/disease-by-crop?days=${days}`), // kept for compat
  getOutbreakAlerts: (threshold = 10, days = 7) =>
    apiFetch(`/analytics/outbreak-alerts?threshold=${threshold}&days=${days}`),
  getSeasonalPatterns: (days = 365) => apiFetch(`/analytics/seasonal-patterns?days=${days}`),
  getYieldSummary: () => apiFetch('/analytics/yield-summary'),
  getDistrictHealth: (district) =>
    apiFetch(`/analytics/district-health/${encodeURIComponent(district)}`),
}

// â”€â”€ Complaints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Backend ComplaintCreate: { category, subject, description, urgency?, photo? }
// Valid categories: water, seeds, fertilizer, pests, market, subsidy, land, equipment, other
// Valid urgencies: low, medium, high, critical
export const complaintsApi = {
  submit: (data) => apiFetch('/complaints/', { method: 'POST', body: JSON.stringify(data) }),
  getMine: () => apiFetch('/complaints/my'),
  getById: (id) => apiFetch(`/complaints/${id}`),
  getAdminAll: () => apiFetch('/complaints/admin/all'),
  updateAdmin: (id, data) =>
    apiFetch(`/complaints/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

// â”€â”€ Expense â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const expenseApi = {
  estimate: (data) => apiFetch('/expense/estimate', { method: 'POST', body: JSON.stringify(data) }),
  getReferenceCosts: (crop) =>
    apiFetch(`/expense/reference-costs/${encodeURIComponent(crop)}`),
  getMarketPrices: () => apiFetch('/expense/market-prices'),
  compare: (scenarios) =>
    apiFetch('/expense/compare', { method: 'POST', body: JSON.stringify(scenarios) }),
}

// â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const dashboardApi = {
  get: (farmerId) => apiFetch(`/dashboard/?farmer_id=${farmerId}`),
  getQuick: (farmerId) => apiFetch(`/dashboard/quick?farmer_id=${farmerId}`),
  getInsights: (farmerId) => apiFetch(`/dashboard/insights?farmer_id=${farmerId}`),
  getNotifications: (farmerId) => apiFetch(`/dashboard/notifications?farmer_id=${farmerId}`),
}

// â”€â”€ Schemes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const schemesApi = {
  list: ({ category, search } = {}) => {
    const params = new URLSearchParams()
    if (category && category !== 'all') params.append('category', category)
    if (search) params.append('search', search)
    const q = params.toString()
    return apiFetch(`/schemes/list${q ? '?' + q : ''}`)
  },
  get: (id) => apiFetch(`/schemes/${id}`),
  checkEligibility: (id, landSize, farmerType) =>
    apiFetch(`/schemes/eligibility-check/${id}?land_size=${landSize}&farmer_type=${farmerType}`),
}

// â”€â”€ Outbreak Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const outbreakMapApi = {
  getClusters: (days = 30) => apiFetch(`/outbreak-map/clusters?days=${days}`),
  getAlerts: (days = 7, threshold = 50) =>
    apiFetch(`/outbreak-map/alerts?days=${days}&severity_threshold=${threshold}`),
  getPoints: (days = 30, state = null) =>
    apiFetch(`/outbreak-map/points?days=${days}${state ? `&state=${encodeURIComponent(state)}` : ''}`),
  getStateSummary: (days = 30) => apiFetch(`/outbreak-map/state-summary?days=${days}`),
  seedDemoData: (count = 1000) =>
    apiFetch(`/outbreak-map/seed-demo-data?count=${count}`, { method: 'POST' }),
}

// â”€â”€ Admin (composite dashboard using admin token) â”€â”€â”€â”€â”€
export const adminApi = {
  login: (adminId, password, district = 'Demo District') =>
    apiFetch('/auth/admin/login', { method: 'POST', body: JSON.stringify({ admin_id: adminId, password, district }) }),
  getDashboard: async (adminToken, days = 30) => {
    const [usersRes, alertsRes, complaintsRes, trendsRes] = await Promise.allSettled([
      apiFetchAdmin('/auth/admin/users?limit=500', adminToken),
      apiFetchAdmin(`/analytics/outbreak-alerts?days=${days}`, adminToken),
      apiFetchAdmin('/complaints/admin/all', adminToken),
      apiFetchAdmin(`/analytics/disease-trends?days=${days}`, adminToken),
    ])
    const users = usersRes.status === 'fulfilled' ? (usersRes.value?.users || []) : []
    const alertData = alertsRes.status === 'fulfilled' ? alertsRes.value : {}
    const complaints = complaintsRes.status === 'fulfilled' ? (complaintsRes.value || []) : []
    const trendsRaw = trendsRes.status === 'fulfilled' ? (trendsRes.value?.trends || []) : []

    // Farmers by state (top 10)
    const stateMap = {}
    users.forEach(u => { const s = u.state || 'Unknown'; stateMap[s] = (stateMap[s] || 0) + 1 })
    const farmers_by_state = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Disease trends aggregated by week
    const weekMap = {}
    trendsRaw.forEach(t => {
      const wk = t.week ? t.week.slice(0, 10) : null
      if (wk) weekMap[wk] = (weekMap[wk] || 0) + (t.cases || 0)
    })
    const disease_trends = Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, cases]) => ({
        week: new Date(week).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        cases,
      }))

    // Complaint stats by status
    const statusMap = {}
    complaints.forEach(c => { const s = c.status || 'open'; statusMap[s] = (statusMap[s] || 0) + 1 })
    const complaint_stats = Object.entries(statusMap).map(([name, value]) => ({ name, value }))

    return {
      total_farmers: usersRes.status === 'fulfilled' ? (usersRes.value?.total || users.length) : 0,
      total_scans: complaints.length,
      active_outbreaks: alertData.active_alerts || 0,
      resolved_cases: complaints.filter(c => c.status === 'resolved').length,
      recent_complaints: complaints.slice(0, 10).map(c => ({
        ...c,
        farmer_name: c.farmer_name || 'Unknown',
        district: c.district || '—',
      })),
      all_complaints: complaints,
      farmers_by_state,
      disease_trends,
      complaint_stats,
    }
  },
    getUsers: (adminToken) => apiFetchAdmin('/auth/admin/users', adminToken),
  getAllComplaints: (adminToken) => apiFetchAdmin('/complaints/admin/all', adminToken),
  updateComplaint: (adminToken, id, data) =>
    apiFetchAdmin(`/complaints/admin/${id}`, adminToken, { method: 'PUT', body: JSON.stringify(data) }),
}

// â”€â”€ Voice â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const voiceApi = {
  transcribe: (formData) => apiUpload('/voice/transcribe', formData),
  chatText: (data) => apiFetch('/voice/chat/text', { method: 'POST', body: JSON.stringify(data) }),
}

// â”€â”€ Disease History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const diseaseHistoryApi = {
  log: (data) => apiFetch('/disease-history/log', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (farmerId, limit = 50) =>
    apiFetch(`/disease-history/history?farmer_id=${farmerId}&limit=${limit}`),
  getFarmReport: (farmerId) => apiFetch(`/disease-history/farm-report/${farmerId}`),
  getTrends: (farmerId, days = 90) =>
    apiFetch(`/disease-history/trends?farmer_id=${farmerId}&days=${days}`),
}

export const satelliteApi = {
  analyzeLand: (lat, lng, areaAcres = 2.0, landId = null, crop = null) => {
    const params = new URLSearchParams({ lat, lng, area_acres: areaAcres })
    if (landId) params.set('land_id', landId)
    if (crop) params.set('crop', crop)
    return apiFetch(`/satellite/analyze?${params}`)
  },
  
  getCarbonCredits: (landId, lat, lng, areaAcres = 2.0) =>
    apiFetch(`/satellite/carbon-credits/${landId}?lat=${lat}&lng=${lng}&area_acres=${areaAcres}`),
  
  checkInsurance: (landId, lat, lng, areaAcres = 2.0, ndviThreshold = 0.25) =>
    apiFetch(`/satellite/parametric-insurance/${landId}?lat=${lat}&lng=${lng}&area_acres=${areaAcres}&ndvi_threshold=${ndviThreshold}`),
  
  getHistory: (landId) => apiFetch(`/satellite/history/${landId}`),
}



```


## `frontend-src/src/api/idb.js`


```javascript
// ── IndexedDB API-response cache ────────────────────────────────────────────
// Stores last successful GET response per URL path so the app can serve
// stale data while offline.  Non-critical: all errors are swallowed.

const DB_NAME = 'agrisahayak-cache'
const STORE   = 'api-responses'
const VERSION = 1

let _db = null

function openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: 'url' })
    }
    req.onsuccess = (e) => {
      _db = e.target.result
      resolve(_db)
    }
    req.onerror = (e) => reject(e.target.error)
  })
}

/** Persist a successful API response keyed by URL path. Fire-and-forget. */
export async function cacheResponse(url, data) {
  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ url, data, timestamp: Date.now() })
      tx.oncomplete = () => resolve()
      tx.onerror   = (e) => reject(e.target.error)
    })
  } catch {
    // intentionally silent
  }
}

/** Retrieve the last cached response for a URL path, or null if absent. */
export async function getCachedResponse(url) {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(url)
      req.onsuccess = (e) => resolve(e.target.result ?? null)
      req.onerror   = (e) => reject(e.target.error)
    })
  } catch {
    return null
  }
}

```


## `frontend-src/src/components/GlobeVisualization.jsx`


```jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useApp } from '../contexts/AppContext'

export default function GlobeVisualization() {
  const { state } = useApp()
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6)

    // ── Lights ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0x00ff88, 0.8)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // ── Globe (solid sphere) ──────────────────────────────────────────
    const globeGeo = new THREE.SphereGeometry(2, 64, 64)
    const globeMat = new THREE.MeshPhongMaterial({
      color:    0x1a3a2a,
      emissive: 0x0a2a15,
      emissiveIntensity: 0.35,
      shininess: 25,
    })
    const globe = new THREE.Mesh(globeGeo, globeMat)
    scene.add(globe)

    // ── Wireframe overlay ────────────────────────────────────────────
    const wireMat = new THREE.MeshBasicMaterial({
      color:     0x22c55e,
      wireframe: true,
      opacity:   0.07,
      transparent: true,
    })
    const wireframe = new THREE.Mesh(new THREE.SphereGeometry(2.008, 32, 32), wireMat)
    scene.add(wireframe)

    // ── Atmosphere glow ring ─────────────────────────────────────────
    const atmGeo = new THREE.SphereGeometry(2.18, 32, 32)
    const atmMat = new THREE.MeshBasicMaterial({
      color:       0x22c55e,
      transparent: true,
      opacity:     0.04,
      side:        THREE.BackSide,
    })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // ── Farmer marker ─────────────────────────────────────────────────
    const lat = (state.farmer?.latitude  ?? 20.5937) * (Math.PI / 180)
    const lon = (state.farmer?.longitude ?? 78.9629) * (Math.PI / 180)
    const R   = 2.06
    const mx  = R * Math.cos(lat) * Math.cos(lon)
    const my  = R * Math.sin(lat)
    const mz  = R * Math.cos(lat) * Math.sin(lon)

    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    const marker    = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), markerMat)
    marker.position.set(mx, my, mz)
    globe.add(marker)

    // Inner pulse ring around marker
    const ringGeo  = new THREE.RingGeometry(0.07, 0.10, 24)
    const ringMat  = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
    const ring     = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(mx, my, mz)
    ring.lookAt(new THREE.Vector3(mx, my, mz).multiplyScalar(2))
    globe.add(ring)

    // ── Manual orbit state ────────────────────────────────────────────
    let isDragging = false
    let prevMouse  = { x: 0, y: 0 }
    const pivot    = new THREE.Group()
    scene.add(pivot)
    pivot.add(globe)
    pivot.add(wireframe)

    function onMouseDown(e) {
      isDragging = true
      prevMouse  = { x: e.clientX, y: e.clientY }
    }
    function onMouseMove(e) {
      if (!isDragging) return
      const dx = (e.clientX - prevMouse.x) * 0.005
      const dy = (e.clientY - prevMouse.y) * 0.005
      pivot.rotation.y += dx
      pivot.rotation.x  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pivot.rotation.x + dy))
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    function onMouseUp()   { isDragging = false }
    function onTouchStart(e) {
      if (e.touches.length !== 1) return
      isDragging = true
      prevMouse  = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    function onTouchMove(e) {
      if (!isDragging || e.touches.length !== 1) return
      const dx = (e.touches[0].clientX - prevMouse.x) * 0.005
      const dy = (e.touches[0].clientY - prevMouse.y) * 0.005
      pivot.rotation.y += dx
      pivot.rotation.x  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pivot.rotation.x + dy))
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    el.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: true })
    el.addEventListener('touchend',   onMouseUp)

    // ── Resize handler ────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (!el) return
      renderer.setSize(el.clientWidth, el.clientHeight)
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
    })
    ro.observe(el)

    // ── Animation loop ────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Auto-rotate when not dragging
      if (!isDragging) pivot.rotation.y += 0.002

      // Pulsing marker scale
      const pulse = 1.0 + 0.5 * (0.5 + 0.5 * Math.sin(t * 3))
      marker.scale.setScalar(pulse)

      // Pulsing ring opacity
      ringMat.opacity = 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2))

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onMouseUp)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [state.farmer?.latitude, state.farmer?.longitude])

  return (
    <div
      ref={mountRef}
      className="w-full cursor-grab active:cursor-grabbing select-none"
      style={{ height: 350 }}
      aria-hidden="true"
    />
  )
}

```


## `frontend-src/src/components/LoadingScreen.jsx`


```jsx
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const LETTERS = 'AgriSahayak'.split('')

export default function LoadingScreen() {
  // Only show once per browser session
  const [visible] = useState(() => !sessionStorage.getItem('agri_loaded'))
  const [exiting, setExiting] = useState(false)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!visible) return

    const canvas = canvasRef.current
    const W = window.innerWidth
    const H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000)
    camera.position.z = 5

    // World-space viewport dimensions at camera z=5
    const vFov = (camera.fov * Math.PI) / 180
    const viewH = 2 * Math.tan(vFov / 2) * camera.position.z
    const viewW = viewH * (W / H)

    // ── 2000-point particle field ─────────────────────────────
    const COUNT = 2000
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * viewW
      // Bias ~45% of particles toward the bottom third = wheat field silhouette
      const r = Math.random()
      positions[i3 + 1] = r < 0.45
        ? -viewH * 0.05 - Math.random() * viewH * 0.42
        : (Math.random() - 0.5) * viewH
      positions[i3 + 2] = (Math.random() - 0.5) * 2
      speeds[i] = 0.003 + Math.random() * 0.007   // upward drift velocity
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Soft circular sprite via CanvasTexture
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = 16
    spriteCanvas.height = 16
    const ctx = spriteCanvas.getContext('2d')
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    grad.addColorStop(0, 'rgba(34,197,94,0.9)')
    grad.addColorStop(0.4, 'rgba(34,197,94,0.5)')
    grad.addColorStop(1, 'rgba(34,197,94,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 16, 16)
    const sprite = new THREE.CanvasTexture(spriteCanvas)

    const material = new THREE.PointsMaterial({
      size: 0.09,
      map: sprite,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const posAttr = geometry.attributes.position
    const halfH = viewH / 2

    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3
        posAttr.array[i3 + 1] += speeds[i]
        // Wrap particle back to bottom when it drifts above the top edge
        if (posAttr.array[i3 + 1] > halfH + 0.5) {
          posAttr.array[i3 + 1] = -halfH - 0.5
          posAttr.array[i3]     = (Math.random() - 0.5) * viewW
        }
      }
      posAttr.needsUpdate = true
      renderer.render(scene, camera)
    }
    animate()

    // ── Dismiss timing ────────────────────────────────────────
    const exitTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        sessionStorage.setItem('agri_loaded', '1')
        // Force re-render to unmount by reloading location — simpler: just hide via CSS,
        // the component stays mounted but invisible, which is fine.
      }, 620)
    }, 2800)

    return () => {
      clearTimeout(exitTimer)
      cancelAnimationFrame(rafRef.current)
      geometry.dispose()
      material.dispose()
      sprite.dispose()
      renderer.dispose()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#09100E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Dissolve upward exit transition
        transition: 'transform 0.55s cubic-bezier(0.76,0,0.24,1), opacity 0.55s ease',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      {/* Three.js particle field */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* ── Centered logo overlay ──────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', userSelect: 'none' }}>

        {/* Self-drawing SVG leaf */}
        <svg
          width="68" height="68" viewBox="0 0 68 68" fill="none"
          aria-hidden="true"
          style={{ margin: '0 auto 20px', display: 'block', overflow: 'visible' }}
        >
          {/* Glow circle */}
          <circle cx="34" cy="34" r="30"
            fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.08)" strokeWidth="1"
          />
          {/* Stem */}
          <path
            d="M34 58 L34 26"
            stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"
            style={{
              strokeDasharray: 32,
              strokeDashoffset: 32,
              animation: 'agriLeafDraw 0.35s 0.15s ease forwards',
            }}
          />
          {/* Left leaf blade */}
          <path
            d="M34 40 Q18 32 16 14 Q30 10 34 30"
            fill="rgba(34,197,94,0.14)" stroke="#22C55E" strokeWidth="2"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 85,
              strokeDashoffset: 85,
              animation: 'agriLeafDraw 0.55s 0.45s ease forwards',
            }}
          />
          {/* Right leaf blade */}
          <path
            d="M34 47 Q50 39 52 21 Q38 17 34 37"
            fill="rgba(34,197,94,0.09)" stroke="#22C55E" strokeWidth="2"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 85,
              strokeDashoffset: 85,
              animation: 'agriLeafDraw 0.55s 0.70s ease forwards',
            }}
          />
        </svg>

        {/* Letter-by-letter reveal */}
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '2.1rem',
            fontWeight: 700,
            color: '#F0FDF4',
            letterSpacing: '0.03em',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.85 + i * 0.065,
                duration: 0.28,
                ease: 'easeOut',
              }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.45 }}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.72rem',
            color: 'rgba(240,253,244,0.38)',
            marginTop: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Smart Farming Intelligence
        </motion.p>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(34,197,94,0.1)',
        }}
      >
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #16A34A, #22C55E, #4ADE80)',
          width: '0%',
          animation: 'agriLoadProgress 2.5s cubic-bezier(0.4,0,0.2,1) forwards',
          boxShadow: '0 0 10px rgba(34,197,94,0.6)',
        }} />
      </div>
    </div>
  )
}

```


## `frontend-src/src/components/VoiceCommandBar.jsx`


```jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X, History } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

// ── Language code map: AppContext short code → BCP-47 ────────────────────
const LANG_MAP = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
  kn: 'kn-IN', ml: 'ml-IN', mr: 'mr-IN', gu: 'gu-IN',
  pa: 'pa-IN', bn: 'bn-IN', or: 'or-IN', ur: 'ur-IN',
}

// ── Route → spoken confirmation (per language) ────────────────────────
const ROUTE_SPEECH = {
  '/weather':       { en: 'Opening weather', hi: 'मौसम खुल रहा है', mr: 'हवामान उघडत आहे' },
  '/disease':       { en: 'Opening disease detection', hi: 'रोग पहचान खुल रही है' },
  '/market':        { en: 'Opening market prices', hi: 'बाज़ार भाव खुल रहा है' },
  '/chatbot':       { en: 'Sending to chatbot', hi: 'चैटबॉट पर भेज रहे हैं' },
  '/crop':          { en: 'Opening crop advisor', hi: 'फसल सलाहकार खुल रहा है' },
  '/fertilizer':    { en: 'Opening fertilizer guide', hi: 'उर्वरक मार्गदर्शक खुल रहा है' },
  '/schemes':       { en: 'Opening government schemes', hi: 'सरकारी योजनाएं खुल रही हैं' },
  '/pest':          { en: 'Opening pest detection', hi: 'कीट पहचान खुल रही है' },
  '/analytics':     { en: 'Opening analytics', hi: 'विश्लेषण खुल रहा है' },
  '/expense':       { en: 'Opening expense tracker', hi: 'खर्च ट्रैकर खुल रहा है' },
  '/soil-passport': { en: 'Opening soil passport', hi: 'मिट्टी पासपोर्ट खुल रहा है' },
}

// ── Keyword → route map ─────────────────────────────────────────────────────
const CMD_RULES = [
  { keywords: ['weather', 'mausam', 'मौसम', 'baarish', 'rain', 'temperature', 'open weather'], route: '/weather' },
  { keywords: ['market', 'price', 'mandi', 'bhav', 'rate', 'sell', 'बाजार', 'मंडी', 'market prices'], route: '/market' },
  { keywords: ['disease', 'scan', 'rog', 'bimari', 'detect', 'बीमारी', 'रोग', 'detect disease'], route: '/disease' },
  { keywords: ['pest', 'keeda', 'insect', 'keet', 'कीट'], route: '/pest' },
  { keywords: ['chat', 'help', 'sahayak', 'advice', 'salah', 'bot'], route: '/chatbot' },
  { keywords: ['crop', 'fasal', 'kisan', 'advisor', 'फसल'], route: '/crop' },
  { keywords: ['fertilizer', 'khad', 'urvarak', 'खाद', 'उर्वरक'], route: '/fertilizer' },
  { keywords: ['soil', 'passport', 'mitti', 'मिट्टी'], route: '/soil-passport' },
  { keywords: ['expense', 'kharcha', 'cost', 'खर्च'], route: '/expense' },
  { keywords: ['scheme', 'yojana', 'government', 'sarkar', 'योजना'], route: '/schemes' },
  { keywords: ['analytics', 'analysis', 'report', 'data', 'विश्लेषण'], route: '/analytics' },
]

function matchCommand(text) {
  const lower = text.toLowerCase()
  for (const rule of CMD_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))) return rule.route
  }
  return null
}

// ── Speak helper ─────────────────────────────────────────────────────────────────
function speak(text, lang) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang
  utt.rate = 1.1
  window.speechSynthesis.speak(utt)
}

function getSpeakText(route, langCode) {
  const msgs = ROUTE_SPEECH[route]
  if (!msgs) return null
  return msgs[langCode] || msgs.en
}

// ── Canvas waveform (live from AudioContext analyser) ───────────────────────────
function CanvasWaveform({ analyserRef }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId
    function draw() {
      rafId = requestAnimationFrame(draw)
      const analyser = analyserRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!analyser) return
      const bufLen = analyser.frequencyBinCount
      const data = new Uint8Array(bufLen)
      analyser.getByteFrequencyData(data)
      const count = 16
      const bw = Math.floor((canvas.width - (count - 1) * 2) / count)
      for (let i = 0; i < count; i++) {
        const val = data[Math.floor((i / count) * bufLen)] / 255
        const h = Math.max(3, val * canvas.height)
        const x = i * (bw + 2)
        const y = (canvas.height - h) / 2
        ctx.fillStyle = `rgba(255,255,255,${0.35 + val * 0.65})`
        ctx.beginPath()
        if (ctx.roundRect) ctx.roundRect(x, y, bw, h, 2)
        else ctx.rect(x, y, bw, h)
        ctx.fill()
      }
    }
    draw()
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <canvas ref={canvasRef} width={112} height={28} style={{ display: 'block' }} />
}

// ── CSS fallback waveform ─────────────────────────────────────────────────────────
function CSSWaveform() {
  return (
    <div className="flex items-center gap-0.5 h-7">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-white"
          animate={{ height: ['4px', '18px', '4px'] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
          style={{ display: 'block' }}
        />
      ))}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────────────────────
export default function VoiceCommandBar() {
  const { state } = useApp()
  const navigate     = useNavigate()
  const srRef        = useRef(null)
  const analyserRef  = useRef(null)
  const audioCtxRef  = useRef(null)
  const streamRef    = useRef(null)

  const [listening, setListening]     = useState(false)
  const [interim, setInterim]         = useState('')
  const [toast, setToast]             = useState(null)
  const [supported, setSupported]     = useState(true)
  const [history, setHistory]         = useState([])         // last 5 commands
  const [showHistory, setShowHistory] = useState(false)
  const [hasAudioCtx, setHasAudioCtx] = useState(false)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSupported(false)
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const showToast = useCallback((text, type = 'info', autoDismiss = 5000) => {
    setToast({ text, type })
    if (autoDismiss) setTimeout(() => setToast(null), autoDismiss)
  }, [])

  const teardownAudio = useCallback(() => {
    analyserRef.current = null
    setHasAudioCtx(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    audioCtxRef.current?.close()
    audioCtxRef.current = null
  }, [])

  const stopListening = useCallback(() => {
    srRef.current?.stop()
    srRef.current = null
    setListening(false)
    setInterim('')
    teardownAudio()
  }, [teardownAudio])

  const startListening = useCallback(async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      showToast('Voice recognition is not supported in this browser.', 'error')
      return
    }

    // Set up AudioContext for canvas waveform
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = audioCtx
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      audioCtx.createMediaStreamSource(stream).connect(analyser)
      analyserRef.current = analyser
      setHasAudioCtx(true)
    } catch {
      // getUserMedia denied — fall back to CSS animation; still allow speech
      setHasAudioCtx(false)
    }

    const sr = new SR()
    srRef.current = sr
    const bcp47 = LANG_MAP[state.language] || 'en-IN'
    sr.lang = bcp47
    sr.interimResults = true
    sr.maxAlternatives = 1
    sr.continuous = false

    sr.onstart = () => setListening(true)
    sr.onend   = () => {
      setListening(false)
      setInterim('')
      teardownAudio()
    }

    sr.onerror = (e) => {
      setListening(false)
      setInterim('')
      if (e.error !== 'aborted' && e.error !== 'no-speech') {
        showToast(`Mic error: ${e.error}`, 'error')
      }
    }

    sr.onresult = (e) => {
      let interimText = ''
      let finalText   = ''
      for (const result of e.results) {
        if (result.isFinal) finalText   += result[0].transcript
        else                interimText += result[0].transcript
      }
      if (interimText) setInterim(interimText)
      if (!finalText) return
      setInterim(finalText)

      const langCode = state.language || 'en'
      const bcp47cur = LANG_MAP[langCode] || 'en-IN'
      const lower    = finalText.toLowerCase().trim()

      // "ask [query]" — navigate to chatbot with query state
      if (lower.startsWith('ask ')) {
        const query = finalText.slice(4).trim()
        const msg   = getSpeakText('/chatbot', langCode) || 'Sending to chatbot'
        showToast(`Chatbot: "${query}"`, 'route', 2500)
        speak(msg, bcp47cur)
        setHistory(h => [{ text: finalText, time: new Date(), route: '/chatbot' }, ...h].slice(0, 5))
        setTimeout(() => navigate('/chatbot', { state: { query } }), 400)
        return
      }

      const route = matchCommand(finalText)
      if (route) {
        const msg = getSpeakText(route, langCode) || `Going to ${route.replace('/', '') || 'home'}`
        showToast(msg, 'route', 2000)
        speak(msg, bcp47cur)
        setHistory(h => [{ text: finalText, time: new Date(), route }, ...h].slice(0, 5))
        setTimeout(() => navigate(route), 400)
      } else {
        // Default: pass as chatbot query
        const msg = getSpeakText('/chatbot', langCode) || 'Sending to chatbot'
        showToast(`"${finalText}"`, 'info', 3000)
        speak(msg, bcp47cur)
        setHistory(h => [{ text: finalText, time: new Date(), route: '/chatbot' }, ...h].slice(0, 5))
        setTimeout(() => navigate('/chatbot', { state: { query: finalText } }), 400)
      }
    }

    try {
      sr.start()
    } catch {
      showToast('Could not start microphone.', 'error')
    }
  }, [state.language, navigate, showToast, teardownAudio])

  const handleClick = useCallback(() => {
    if (listening) stopListening()
    else           startListening()
  }, [listening, startListening, stopListening])

  // Cleanup on unmount
  useEffect(() => () => {
    srRef.current?.stop()
    streamRef.current?.getTracks().forEach(t => t.stop())
    audioCtxRef.current?.close()
  }, [])

  // Toast colour
  const toastStyle =
    toast?.type === 'error' ? 'bg-red-600/90 text-white'
    : toast?.type === 'route' ? 'bg-primary/90 text-white'
    : 'bg-surface-1/95 border border-border text-text-1'

  // Not supported — show disabled mic with tooltip instead of nothing
  if (!supported) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50"
        title="Voice commands not supported in this browser"
      >
        <button
          disabled
          aria-label="Voice commands not supported in this browser"
          className="w-14 h-14 rounded-full flex items-center justify-center opacity-40 cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)' }}
        >
          <Mic size={22} className="text-white" />
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      style={{ pointerEvents: 'none' }}
    >
      {/* Toast / response */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`max-w-xs rounded-xl px-4 py-2.5 text-sm shadow-lg backdrop-blur-md ${toastStyle}`}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex items-start gap-2">
              <p className="flex-1 leading-snug">{toast.text}</p>
              <button
                onClick={dismissToast}
                className="shrink-0 opacity-60 hover:opacity-100 mt-0.5"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command history slide-up panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            key="history-panel"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="rounded-xl shadow-xl backdrop-blur-md overflow-hidden"
            style={{
              pointerEvents: 'auto',
              width: 240,
              background: 'rgba(15,23,42,0.94)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
              <span className="text-white/80 text-xs font-medium">Recent Commands</span>
              <button onClick={() => setShowHistory(false)} className="text-white/50 hover:text-white/90" aria-label="Close command history">
                <X size={13} aria-hidden="true" />
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-white/40 text-xs text-center py-5 px-3">No commands yet</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {history.map((cmd, i) => (
                  <li
                    key={i}
                    role="button"
                    tabIndex={0}
                    className="px-3 py-2.5 flex items-start gap-2 cursor-pointer hover:bg-white/5"
                    onClick={() => { setShowHistory(false); navigate(cmd.route) }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowHistory(false); navigate(cmd.route) } }}
                  >
                    <span className="text-primary text-xs mt-0.5 shrink-0">⌘</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-xs truncate">{cmd.text}</p>
                      <p className="text-white/40 text-[10px]">
                        {cmd.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        {cmd.route !== '/chatbot' ? ` → ${cmd.route}` : ' → chatbot'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interim transcript */}
      <AnimatePresence>
        {listening && interim && (
          <motion.div
            key="interim"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-surface-1/95 border border-border px-3 py-1.5 text-text-2 text-xs shadow backdrop-blur-md max-w-[220px] truncate"
            style={{ pointerEvents: 'none' }}
          >
            {interim}
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Listening…" animated label (when no interim text yet) */}
      <AnimatePresence>
        {listening && !interim && (
          <motion.div
            key="listening-label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-primary/20 border border-primary/30 px-3 py-1.5 text-primary text-xs shadow backdrop-blur-md flex items-center gap-1.5"
            style={{ pointerEvents: 'none' }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-primary inline-block"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Listening…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button row: history + mic */}
      <div className="flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
        {/* History icon button */}
        <motion.button
          onClick={() => setShowHistory(v => !v)}
          aria-label="Command history"
          whileTap={{ scale: 0.9 }}
          className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md"
          style={{
            background: 'rgba(15,23,42,0.75)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <History size={15} className="text-white/70" />
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold leading-none">
              {history.length}
            </span>
          )}
        </motion.button>

        {/* Mic button */}
        <motion.button
          onClick={handleClick}
          aria-label={listening ? 'Stop listening' : 'Start voice command'}
          animate={listening ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={listening ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
          className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
          style={{
            background: listening
              ? 'linear-gradient(135deg,#16a34a 0%,#15803d 100%)'
              : 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)',
            boxShadow: listening
              ? '0 0 0 6px rgba(34,197,94,0.25),0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.35)',
          }}
        >
          {/* Pulse ring while listening */}
          {listening && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          {listening
            ? (hasAudioCtx ? <CanvasWaveform analyserRef={analyserRef} /> : <CSSWaveform />)
            : <Mic size={22} className="text-white" />
          }
        </motion.button>
      </div>
    </div>
  )
}

```


## `frontend-src/src/components/YieldPredictor.jsx`


```jsx
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

```


## `frontend-src/src/components/common/AnimatedNumber.jsx`


```jsx
import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

/**
 * AnimatedNumber — Smoothly counts from the previous value to the new one.
 *
 * Props:
 *  value     {number}              the target number
 *  format    {(n: number) => string}  formatter (default: rounded locale string)
 *  prefix    {string}              prepended to the formatted output (e.g. "₹")
 *  suffix    {string}              appended  (e.g. "%")
 *  duration  {number}              animation duration in seconds (default 0.9)
 *  className {string}
 */
export default function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString('en-IN'),
  prefix = '',
  suffix = '',
  duration = 0.9,
  className = '',
}) {
  const nodeRef = useRef(null)
  const prevRef = useRef(0)

  useEffect(() => {
    const from   = prevRef.current
    const to     = Number(value) || 0
    prevRef.current = to

    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (nodeRef.current) {
          nodeRef.current.textContent = prefix + format(v) + suffix
        }
      },
    })
    return () => controls.stop()
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const initial = prefix + format(Number(value) || 0) + suffix
  return (
    <span ref={nodeRef} className={className}>
      {initial}
    </span>
  )
}

```


## `frontend-src/src/components/common/EmptyState.jsx`


```jsx
/**
 * EmptyState — Centered illustration + title + description + optional CTA.
 *
 * Props:
 *  icon        {LucideIcon}   optional Lucide icon to show above title
 *  title       {string}       heading
 *  description {string}       sub-text
 *  action      {{ label, onClick }}  optional CTA button
 *  className   {string}
 */

function SeedlingIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <circle cx="36" cy="36" r="32" fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.10)" strokeWidth="1.5" />
      {/* stem */}
      <path d="M36 56V36" stroke="rgba(34,197,94,0.4)" strokeWidth="2" strokeLinecap="round" />
      {/* left leaf */}
      <path
        d="M36 44 Q24 38 22 26 Q33 23 36 36"
        fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.4)"
        strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* right leaf */}
      <path
        d="M36 50 Q48 44 50 32 Q39 29 36 42"
        fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.28)"
        strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* ground dots */}
      <circle cx="28" cy="58" r="2" fill="rgba(34,197,94,0.15)" />
      <circle cx="36" cy="60" r="2.5" fill="rgba(34,197,94,0.12)" />
      <circle cx="44" cy="58" r="2" fill="rgba(34,197,94,0.15)" />
    </svg>
  )
}

export default function EmptyState({
  icon: Icon = null,
  title = 'Nothing here yet',
  description = 'Data will appear here once it becomes available.',
  action = null,
  className = '',
}) {
  return (
    <div className={`card p-10 flex flex-col items-center text-center ${className}`}>
      <div className="mb-4 opacity-80">
        {Icon ? <Icon size={40} className="text-text-3" /> : <SeedlingIllustration />}
      </div>
      <p className="text-text-1 font-medium mb-1.5">{title}</p>
      <p className="text-text-3 text-sm max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button className="btn-secondary mt-5 text-xs" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

```


## `frontend-src/src/components/common/ErrorBoundary.jsx`


```jsx
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected UI error' }
  }

  componentDidCatch(error, errorInfo) {
    // Keep a console trace for production debugging.
    console.error('UI crash captured by ErrorBoundary', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-screen bg-bg text-text-1 flex items-center justify-center p-6">
        <div className="card w-full max-w-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-text-3 text-sm mb-4">
            The app hit an unexpected error. Reload to recover.
          </p>
          <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 break-words">
            {this.state.errorMessage}
          </p>
          <button className="btn-primary" onClick={this.handleReload}>
            Reload App
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary

```


## `frontend-src/src/components/common/PageTransition.jsx`


```jsx
import { motion } from 'framer-motion'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const PAGE_TRANSITION = { duration: 0.25, ease: [0.16, 1, 0.3, 1] }

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={PAGE_TRANSITION}
    >
      {children}
    </motion.div>
  )
}

```


## `frontend-src/src/components/common/SkeletonCard.jsx`


```jsx
/**
 * SkeletonCard — Shimmer loading placeholder.
 * Uses the `.shimmer` CSS class (gradient sweep animation in index.css).
 *
 * Props:
 *  rows     {number}  number of skeleton rows (default 4)
 *  cols     {number}  show N column blocks in header row (default 1)
 *  className {string}  extra classes on the outer card
 */
export default function SkeletonCard({ rows = 4, cols = 1, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="shimmer h-4 w-32 rounded" />
        <div className="shimmer h-6 w-6 rounded" />
      </div>

      {/* Optional multi-col header blocks */}
      {cols > 1 && (
        <div className={`grid grid-cols-${cols} gap-3 mb-5`}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="shimmer h-10 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="shimmer h-3 rounded"
              style={{ flex: `${0.55 + (i % 3) * 0.15}` }}
            />
            <div
              className="shimmer h-3 w-16 rounded shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

```


## `frontend-src/src/components/layout/MainLayout.jsx`


```jsx
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

```


## `frontend-src/src/components/layout/Sidebar.jsx`


```jsx
import { cloneElement, isValidElement } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ScanLine, Bug, TrendingUp, Bot, CloudSun,
  Sprout, RotateCcw, FlaskConical, Calculator, Map, BarChart3,
  MessageSquare, FileText, Shield, LogOut, X, BookMarked, Globe, Truck, Satellite, Satellite
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { useT, LANGUAGES } from '../../i18n'

function buildNavGroups(t) {
  return [
    {
      label: t('grp_main'),
      items: [
        { to: '/',           icon: LayoutDashboard, label: t('nav_dashboard') },
        { to: '/disease',    icon: ScanLine,         label: t('nav_disease') },
        { to: '/pest',       icon: Bug,              label: t('nav_pest') },
      ],
    },
    {
      label: t('grp_market_weather'),
      items: [
        { to: '/market',     icon: TrendingUp,  label: t('nav_market') },
        { to: '/chatbot',    icon: Bot,         label: t('nav_chatbot') },
        { to: '/weather',    icon: CloudSun,    label: t('nav_weather') },
      ],
    },
    {
      label: t('grp_farm'),
      items: [
        { to: '/crop',            icon: Sprout,       label: t('nav_crop_advisor') },
        { to: '/crop-cycle',      icon: RotateCcw,    label: t('nav_crop_cycle') },
        { to: '/fertilizer',      icon: FlaskConical, label: t('nav_fertilizer') },
        { to: '/expense',         icon: Calculator,   label: t('nav_expense') },
        { to: '/soil-passport',   icon: BookMarked,   label: t('nav_soil') },
      ],
    },
    {
      label: t('grp_intelligence'),
      items: [
        { to: '/analytics',    icon: BarChart3,     label: t('nav_analytics') },
        { to: '/outbreak-map', icon: Map,           label: t('nav_outbreak') },
        { path: '/logistics',  icon: <Truck size={18} />,     label: 'Fleet Optimizer',   badge: 'QUANTUM' },
        { path: '/satellite',  icon: <Satellite size={18} />, label: 'Satellite Oracle',  badge: 'NEW' },
        { to: '/schemes',      icon: FileText,      label: t('nav_schemes') },
        { to: '/complaints',   icon: MessageSquare, label: t('nav_complaints') },
        { to: '/admin',        icon: Shield,        label: t('nav_admin') },
      ],
    },
  ]
}

/* Animated leaf SVG logo mark */
function AnimatedLeaf() {
  return (
    <motion.svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      animate={{ scale: [1, 1.14, 1], rotate: [0, 5, -4, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M12 22C12 22 3 16 3 9a9 9 0 0 1 18 0c0 7-9 13-9 13Z"
        fill="rgba(34,197,94,0.18)" stroke="#22C55E" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M12 22V9" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  )
}

/* Single nav item with accent bar + hover gradient */
function NavItem({ to, icon, label, badge, onNavigate }) {
  return (
    <li>
      <NavLink
        to={to}
        end={to === '/'}
        onClick={onNavigate}
        className="group relative flex items-center gap-2.5 px-2.5 py-[7px] rounded text-sm font-medium overflow-hidden"
      >
        {({ isActive }) => (
          <>
            {/* Hover gradient — always mounted, opacity-driven */}
            <span
              className="absolute inset-0 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.09) 0%, transparent 80%)' }}
            />

            {/* Active background pill */}
            {isActive && (
              <motion.span
                layoutId="nav-active-bg"
                className="absolute inset-0 rounded pointer-events-none"
                style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.13) 0%, transparent 85%)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              />
            )}

            {/* Left accent bar */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="nav-accent"
                  className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-full bg-primary"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
            </AnimatePresence>

            <motion.span
              whileHover={{ scale: 1.12, rotate: 5 }}
              transition={{ duration: 0.18, type: 'spring', stiffness: 400, damping: 20 }}
              className="relative shrink-0 flex items-center"
            >
              {isValidElement(icon)
                ? cloneElement(icon, {
                    className: [
                      'transition-colors duration-150',
                      isActive ? 'text-primary' : 'text-text-3 group-hover:text-text-2',
                    ].join(' '),
                  })
                : (() => {
                    const Icon = icon
                    return (
                      <Icon
                        size={15}
                        className={[
                          'transition-colors duration-150',
                          isActive ? 'text-primary' : 'text-text-3 group-hover:text-text-2',
                        ].join(' ')}
                      />
                    )
                  })()}
            </motion.span>
            <span
              className={[
                'relative transition-colors duration-150',
                isActive ? 'text-primary font-semibold' : 'text-text-2 group-hover:text-text-1',
              ].join(' ')}
            >
              {label}
            </span>
            {badge && (
              <span
                className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(139,92,246,0.18)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                {badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  )
}

export default function Sidebar() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const t = useT()
  const navGroups = buildNavGroups(t)

  const closeNav = () => dispatch({ type: 'CLOSE_SIDEBAR' })

  function logout() {
    dispatch({ type: 'LOGOUT' })
    navigate('/profile')
  }

  return (
    <>
      {/* Mobile overlay */}
      {state.sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeNav} />
      )}

      <aside
        aria-label="Site navigation"
        className={[
          'fixed top-0 left-0 h-full z-40 flex flex-col',
          'w-[220px] bg-[#0A1510]',
          'transition-transform duration-300 ease-expo-out',
          state.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{ boxShadow: '1px 0 0 rgba(34,197,94,0.15)' }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between h-14 px-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(34,197,94,0.08)' }}
        >
          <NavLink to="/" className="flex items-center gap-2.5" onClick={closeNav}>
            <AnimatedLeaf />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.975rem', color: '#E8F0EA', letterSpacing: '-0.01em' }}>
              AgriSahayak
            </span>
          </NavLink>
          <button className="btn-icon lg:hidden" onClick={closeNav} aria-label="Close navigation menu">
            <X size={16} />
          </button>
        </div>

        {/* Language picker */}
        <div className="px-3 pt-2.5 pb-2 shrink-0" style={{ borderBottom: '1px solid rgba(34,197,94,0.06)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe size={11} className="text-text-3" aria-hidden="true" />
            <span className="text-text-3 text-[10px] font-medium uppercase tracking-wide">{t('language')}</span>
          </div>
          <select
            id="sidebar-language-picker"
            aria-label="Select display language"
            value={state.language}
            onChange={e => {
              dispatch({ type: 'SET_LANGUAGE', payload: e.target.value })
              localStorage.setItem('appLanguage', e.target.value)
            }}
            className="w-full text-xs rounded-md px-2 py-1.5 bg-surface-2 border border-border text-text-1 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.native}</option>
            ))}
          </select>
        </div>

        {/* Nav */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="section-title px-2 mb-1">{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map(({ to, path, icon, label, badge }) => (
                  <NavItem
                    key={to || path}
                    to={to || path}
                    icon={icon}
                    label={label}
                    badge={badge}
                    onNavigate={closeNav}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 shrink-0 space-y-1" style={{ borderTop: '1px solid rgba(34,197,94,0.08)' }}>
          <NavLink
            to="/profile"
            onClick={closeNav}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 px-2.5 py-2 rounded text-sm font-medium transition-all duration-150',
                isActive ? 'bg-primary/10 text-primary' : 'text-text-2 hover:bg-surface-2 hover:text-text-1',
              ].join(' ')
            }
          >
            <div className="w-6 h-6 rounded-sm bg-surface-3 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {state.farmer?.name?.charAt(0)?.toUpperCase() || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-1 text-xs font-medium truncate">{state.farmer?.name || 'Guest Farmer'}</p>
              <p className="text-text-3 text-xs truncate">{state.farmer?.phone || 'Not logged in'}</p>
            </div>
          </NavLink>

          {state.farmer && (
            <button
              onClick={logout}
              aria-label="Log out of AgriSahayak"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded text-sm text-text-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 w-full"
            >
              <LogOut size={14} aria-hidden="true" />
              <span>{t('logout')}</span>
            </button>
          )}

          {!state.isOnline && (
            <div className="px-2.5 py-1.5 rounded bg-amber-500/10 text-amber-400 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {t('offline')}
            </div>
          )}

          {/* System Status */}
          <div
            className="mx-0.5 mt-1 px-2.5 py-2 rounded"
            style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs text-text-3">
                System&nbsp;<span className="text-primary font-medium">{t('system_online')}</span>
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

```


## `frontend-src/src/contexts/AppContext.jsx`


```jsx
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

```


## `frontend-src/src/pages/Admin.jsx`


```jsx
import { useState, useEffect } from 'react'
import { Shield, Users, AlertTriangle, BarChart2, LogIn, LogOut, RefreshCw, Loader2, Download, CheckCircle2, Clock } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import SkeletonCard from '../components/common/SkeletonCard'
import EmptyState from '../components/common/EmptyState'
import { adminApi } from '../api/client'

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#a78bfa']
const CHART_TOOLTIP = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }

export default function Admin() {
  const [token, setToken] = useState(null)
  const [creds, setCreds] = useState({ admin_id: '', password: '', district: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(30)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [resolvingId, setResolvingId] = useState(null)

  async function login(e) {
    e.preventDefault(); setLoginLoading(true); setLoginError(null)
    try {
      const res = await adminApi.login(creds.admin_id, creds.password, creds.district || 'Demo District')
      setToken(res.access_token || res.token)
    } catch (e) { setLoginError(e.message) }
    finally { setLoginLoading(false) }
  }

  async function loadDashboard() {
    setLoading(true)
    try {
      const res = await adminApi.getDashboard(token, days)
      setData(res)
      setLastUpdated(new Date())
    } catch {}
    finally { setLoading(false) }
  }

  async function resolveComplaint(id, newStatus) {
    setResolvingId(id)
    try {
      await adminApi.updateComplaint(token, id, { status: newStatus })
      setData(prev => {
        const update = list => (list || []).map(c => c.id === id ? { ...c, status: newStatus } : c)
        const updatedAll = update(prev.all_complaints)
        const statusMap = {}
        updatedAll.forEach(c => { const s = c.status || 'open'; statusMap[s] = (statusMap[s] || 0) + 1 })
        return {
          ...prev,
          all_complaints: updatedAll,
          recent_complaints: update(prev.recent_complaints),
          resolved_cases: updatedAll.filter(c => c.status === 'resolved').length,
          complaint_stats: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
        }
      })
    } catch {
      // keep existing state on failure
    } finally {
      setResolvingId(null)
    }
  }

  function exportCSV() {
    const complaints = data?.all_complaints || data?.recent_complaints || []
    if (!complaints.length) return
    const header = ['ID', 'Farmer', 'District', 'Subject', 'Category', 'Status', 'Created At']
    const rows = complaints.map(c => [
      c.id ?? '',
      c.farmer_name ?? '',
      c.district ?? '',
      `"${(c.subject ?? '').replace(/"/g, '""')}"`,
      c.category ?? '',
      c.status ?? '',
      c.created_at ?? '',
    ].join(','))
    const csv = [header.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `complaints-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (!token) return
    loadDashboard()
    const id = setInterval(loadDashboard, 60000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days])

  if (!token) {
    return (
      <div className="page-content">
        <div className="card max-w-sm mx-auto p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-dim flex items-center justify-center">
              <Shield size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-text-1 font-bold">Admin Portal</h1>
              <p className="text-text-3 text-xs">District Officer Access</p>
            </div>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label htmlFor="admin-id" className="label">Admin ID</label>
              <input id="admin-id" className="input w-full" required value={creds.admin_id} onChange={e => setCreds(c => ({ ...c, admin_id: e.target.value }))} placeholder="admin or officer" />
            </div>
            <div>
              <label htmlFor="admin-district" className="label">District</label>
              <input id="admin-district" className="input w-full" value={creds.district} onChange={e => setCreds(c => ({ ...c, district: e.target.value }))} placeholder="e.g. Pune (optional)" />
            </div>
            <div>
              <label htmlFor="admin-password" className="label">Password</label>
              <input id="admin-password" className="input w-full" type="password" required value={creds.password} onChange={e => setCreds(c => ({ ...c, password: e.target.value }))} />
            </div>
            {loginError && <p className="text-red-400 text-sm" role="alert">{loginError}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loginLoading}>
              {loginLoading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : <><LogIn size={14} /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-dim flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-text-1">Admin Dashboard</h1>
            <p className="text-text-3 text-xs">District Officer View</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="input text-sm py-1.5"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            aria-label="Select reporting period"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            className="btn-secondary flex items-center gap-1.5 text-sm"
            onClick={exportCSV}
            disabled={!data}
            aria-label="Export complaints as CSV"
          >
            <Download size={13} aria-hidden="true" /> Export CSV
          </button>
          <button className="btn-icon" onClick={loadDashboard} disabled={loading} aria-label="Refresh dashboard"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" /></button>
          <button className="btn-secondary flex items-center gap-1.5 text-sm" onClick={() => setToken(null)}><LogOut size={13} /> Logout</button>
        </div>
      </header>

      {loading ? (
        <SkeletonCard rows={5} />
      ) : !data ? (
        <EmptyState title="No data available" description="Admin data could not be loaded. Try signing in again." action={{ label: 'Refresh', onClick: loadDashboard }} />
      ) : (
        <>
          {lastUpdated && (
            <p className="text-text-3 text-xs text-right -mb-2">
              Last updated: {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Users, label: 'Total Farmers', value: data.total_farmers?.toLocaleString(), color: 'text-primary' },
              { icon: BarChart2, label: 'Total Scans', value: data.total_scans?.toLocaleString(), color: 'text-blue-400' },
              { icon: AlertTriangle, label: 'Active Outbreaks', value: data.active_outbreaks, color: 'text-amber-400' },
              { icon: Shield, label: 'Resolved Cases', value: data.resolved_cases?.toLocaleString(), color: 'text-primary' },
            ].map(s => (
              <div key={s.label} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={14} className={s.color} />
                  <span className="text-text-3 text-xs">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Farmers by State */}
            <div className="card p-5 lg:col-span-2">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <Users size={14} className="text-primary" /> Farmers by State
              </h3>
              {data.farmers_by_state?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.farmers_by_state} margin={{ top: 4, right: 4, left: -20, bottom: 44 }}>
                    <XAxis dataKey="state" tick={{ fill: '#94a3b8', fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                    <Tooltip contentStyle={CHART_TOOLTIP} />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-text-3 text-sm text-center py-10">No state data</p>
              )}
            </div>

            {/* Complaint Status PieChart */}
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" /> Complaint Status
              </h3>
              {data.complaint_stats?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.complaint_stats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      outerRadius={72}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {data.complaint_stats.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CHART_TOOLTIP} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-text-3 text-sm text-center py-10">No data</p>
              )}
            </div>
          </div>

          {/* Disease Reports Over Time */}
          <div className="card p-5">
            <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
              <BarChart2 size={14} className="text-blue-400" /> Disease Reports Over Time
            </h3>
            {data.disease_trends?.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.disease_trends} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                  <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP} />
                  <Line type="monotone" dataKey="cases" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3, fill: '#60a5fa' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-3 text-sm text-center py-8">No disease trend data for the selected period</p>
            )}
          </div>

          {(data.all_complaints?.length > 0 || data.recent_complaints?.length > 0) && (
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-text-1 font-semibold">
                  All Complaints
                  <span className="ml-2 text-text-3 text-xs font-normal">
                    ({(data.all_complaints || data.recent_complaints || []).length})
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-border">
                {(data.all_complaints || data.recent_complaints || []).map((c, i) => (
                  <div key={c.id ?? i} className="p-3 flex items-start gap-3">
                    <span className={`badge mt-0.5 shrink-0 ${
                      c.status === 'resolved' ? 'badge-green'
                      : c.status === 'in_progress' ? 'badge-blue'
                      : 'badge-yellow'
                    }`}>{c.status || 'open'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-1 text-sm font-medium truncate">{c.subject || 'No subject'}</p>
                      <p className="text-text-3 text-xs">{c.farmer_name} · {c.district} · {c.category}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-text-3 text-xs hidden sm:block">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
                      </span>
                      {c.status !== 'resolved' && (
                        <>
                          {c.status !== 'in_progress' && (
                            <button
                              className="btn-secondary text-xs py-0.5 px-2 flex items-center gap-1"
                              onClick={() => resolveComplaint(c.id, 'in_progress')}
                              disabled={resolvingId === c.id}
                            >
                              {resolvingId === c.id
                                ? <Loader2 size={10} className="animate-spin" />
                                : <Clock size={10} />}
                              In Progress
                            </button>
                          )}
                          <button
                            className="btn-primary text-xs py-0.5 px-2 flex items-center gap-1"
                            onClick={() => resolveComplaint(c.id, 'resolved')}
                            disabled={resolvingId === c.id}
                          >
                            {resolvingId === c.id
                              ? <Loader2 size={10} className="animate-spin" />
                              : <CheckCircle2 size={10} />}
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/Analytics.jsx`


```jsx
import { useState, useEffect, useRef } from 'react'
import { BarChart2, TrendingUp, AlertTriangle, RefreshCw, Map, Activity, Loader2, Users, Download, ChevronDown } from 'lucide-react'
import SkeletonCard from '../components/common/SkeletonCard'
import { analyticsApi } from '../api/client'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

function StatBox({ label, value, sub, color = 'text-text-1' }) {
  return (
    <div className="card p-4">
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      <p className="text-text-2 text-sm font-medium mt-0.5">{label}</p>
      {sub && <p className="text-text-3 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

function HeatRow({ district, count, max }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  const color = pct > 66 ? 'bg-red-400' : pct > 33 ? 'bg-amber-400' : 'bg-primary'
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-2 text-sm w-28 shrink-0">{district}</span>
      <div className="h-2 flex-1 bg-surface-2 rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-text-1 text-sm w-8 text-right shrink-0">{count}</span>
    </div>
  )
}

export default function Analytics() {
  const [heatmap, setHeatmap] = useState([])
  const [trends, setTrends] = useState([])
  const [byCrop, setByCrop] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState(30)
  const [toast,      setToast]      = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting,  setExporting]  = useState(false)
  const containerRef = useRef(null)
  const toastTimer   = useRef(null)

  function showToast(msg, duration = 3000) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), duration)
  }

  function downloadCSV() {
    setExportOpen(false)
    const dateStr = new Date().toISOString().slice(0, 10)
    const header  = ['District', 'State', 'Disease', 'Cases', 'Severity'].join(',')
    const rows    = heatmap.map(row => [
      JSON.stringify(row.district  || row.name     || ''),
      JSON.stringify(row.state     || ''),
      JSON.stringify(row.disease   || row.disease_name || ''),
      row.case_count ?? row.count ?? 0,
      JSON.stringify(row.severity  || ''),
    ].join(','))
    const csv  = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: `agri-analytics-${dateStr}.csv` })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('✅ Export ready!')
  }

  async function downloadPDF() {
    setExportOpen(false)
    if (!containerRef.current) return
    setExporting(true)
    showToast('Preparing export…', 30000)
    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#090f0c', logging: false,
      })
      const dateStr = new Date().toISOString().slice(0, 10)
      const doc     = new jsPDF('p', 'mm', 'a4')
      // Title page
      doc.setFontSize(20)
      doc.setTextColor(34, 197, 94)
      doc.text('AgriSahayak Analytics Report', 20, 30)
      doc.setFontSize(10)
      doc.setTextColor(160, 170, 165)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
      doc.text(`Period: Last ${period} days`, 20, 53)
      doc.text(`Hotspots: ${heatmap.length}  ·  Alerts: ${alerts.length}  ·  Crops: ${byCrop.length}`, 20, 61)
      // Chart image on page 2
      doc.addPage()
      const imgW   = 190
      const imgH   = (canvas.height / canvas.width) * imgW
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, Math.min(imgH, 270))
      doc.save(`agri-analytics-${dateStr}.pdf`)
      showToast('✅ Export ready!')
    } catch {
      showToast('⚠️ Export failed — try CSV instead')
    } finally {
      setExporting(false)
    }
  }

  async function load() {
    setLoading(true); setError(null)
    try {
      const [hm, tr, bc, al] = await Promise.all([
        analyticsApi.getDiseaseHeatmap(period),
        analyticsApi.getDiseaseTrends(period),
        analyticsApi.getDiseaseByCrop(period),
        analyticsApi.getOutbreakAlerts(10, Math.min(period, 30)),
      ])
      setHeatmap(hm?.heatmap || [])
      setTrends(tr?.trends || [])
      setByCrop(bc?.data || [])
      setAlerts(al?.alerts || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [period])

  const maxHeat = Math.max(...heatmap.map(d => d.case_count || d.count || 0), 1)
  const maxTrend = Math.max(...trends.map(t => t.total_cases || t.count || 0), 1)

  return (
    <div ref={containerRef} className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Analytics</h1>
          <p className="text-text-3 text-sm mt-0.5">Crop disease trends and outbreak intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-2 rounded-lg p-0.5 gap-0.5" role="group" aria-label="Time period">
            {[[7,'7d'],[30,'30d'],[90,'90d']].map(([d,l]) => (
              <button key={d} onClick={() => setPeriod(d)}
                aria-pressed={period === d}
                aria-label={`Show last ${d} days`}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${period === d ? 'bg-primary text-black' : 'text-text-3 hover:text-text-2'}`}>
                {l}
              </button>
            ))}
          </div>
          <button className="btn-icon" onClick={load} disabled={loading} aria-label="Refresh analytics data">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          </button>
          {/* Export dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
              onClick={() => setExportOpen(v => !v)}
              disabled={exporting}
              aria-label="Export data"
              aria-expanded={exportOpen}
              aria-haspopup="menu"
            >
              {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Export <ChevronDown size={12} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
            </button>
            {exportOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden z-50"
                style={{ background: '#111d16', border: '1px solid rgba(34,197,94,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
              >
                <button
                  role="menuitem"
                  className="w-full text-left px-4 py-2.5 text-sm text-text-2 hover:bg-surface-2 hover:text-text-1 transition-colors flex items-center gap-2"
                  onClick={downloadCSV}
                >
                  📄 Download CSV
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-4 py-2.5 text-sm text-text-2 hover:bg-surface-2 hover:text-text-1 transition-colors flex items-center gap-2"
                  onClick={downloadPDF}
                >
                  📈 Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-medium z-50 shadow-lg pointer-events-none"
          style={{ background: '#111d16', border: '1px solid rgba(34,197,94,0.2)', color: '#E8F0EA' }}
        >
          {toast}
        </div>
      )}
      {/* Close export dropdown when clicking outside */}
      {exportOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
      )}

      {loading ? (
        <SkeletonCard rows={5} />
      ) : error ? (
        <div className="card p-8 text-center">
          <AlertTriangle size={24} className="text-amber-400 mx-auto mb-2" />
          <p className="text-text-2 text-sm">{error}</p>
          <button className="btn-secondary mt-3 text-xs" onClick={load}>Retry</button>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Disease Hotspots" value={heatmap.length} sub={`Last ${period} days`} color="text-red-400" />
            <StatBox label="Trend Points" value={trends.length} sub="Weekly data" color="text-primary" />
            <StatBox label="Crops Affected" value={byCrop.length} color="text-amber-400" />
            <StatBox label="Active Alerts" value={alerts.length} sub="Outbreak alerts" color={alerts.length > 0 ? 'text-red-400' : 'text-text-2'} />
          </div>

          {/* Outbreak alerts */}
          {alerts.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-400" /> Outbreak Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-start justify-between p-3 bg-surface-2 rounded-lg">
                    <div>
                      <p className="text-text-1 text-sm font-medium">{a.disease || a.disease_name || 'Unknown'}</p>
                      <p className="text-text-3 text-xs">{a.district || a.location} · {a.case_count ?? a.count ?? 0} cases</p>
                    </div>
                    <span className="badge badge-red">Alert</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disease heatmap */}
          {heatmap.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <Map size={15} className="text-primary" /> District Disease Heatmap
              </h3>
              <div className="space-y-3">
                {heatmap.slice(0, 12).map((d, i) => (
                  <HeatRow key={i} district={d.district || d.name || `District ${i+1}`}
                    count={d.case_count || d.count || 0} max={maxHeat} />
                ))}
              </div>
            </div>
          )}

          {/* Trends bar chart */}
          {trends.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-primary" /> Disease Trends
              </h3>
              <div className="flex items-end gap-1" style={{ height: '96px' }}>
                {trends.slice(-14).map((t, i) => {
                  const val = t.total_cases || t.count || t.value || 0
                  const pct = maxTrend > 0 ? (val / maxTrend) * 100 : 0
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                        style={{ height: `${Math.max(pct, 2)}%` }} title={`${t.week || t.date || ''}: ${val} cases`} />
                    </div>
                  )
                })}
              </div>
              <p className="text-text-3 text-xs mt-2 text-center">Weekly disease detection counts</p>
            </div>
          )}

          {/* By crop */}
          {byCrop.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4 flex items-center gap-2">
                <Activity size={15} className="text-primary" /> Most Affected Crops
              </h3>
              <div className="space-y-2">
                {byCrop.slice(0, 8).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-surface-2 transition-colors">
                    <span className="text-text-2">{c.crop_type || c.crop || '—'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text-3 text-xs">{c.disease_name || c.disease || '—'}</span>
                      <span className="text-text-1 font-medium">{c.case_count ?? c.count ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!heatmap.length && !trends.length && !alerts.length && (
            <div className="card p-12 text-center text-text-3">
              <BarChart2 size={32} className="mx-auto mb-3 opacity-30" />
              <p>No analytics data yet. Use the app to create some records first!</p>
              <p className="text-xs mt-1">Admins can seed demo data via /analytics/sync/demo-data</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/Chatbot.jsx`


```jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Globe, Loader2, RotateCcw, Square, Check, Pause, Play } from 'lucide-react'
import { chatApi } from '../api/client'
import { useApp } from '../contexts/AppContext'

const LANGS = [
  { code: 'en', label: 'English', bcp: 'en-IN', apiName: 'english' },
  { code: 'hi', label: 'हिंदी', bcp: 'hi-IN', apiName: 'hindi' },
  { code: 'mr', label: 'मराठी', bcp: 'mr-IN', apiName: 'marathi' },
  { code: 'te', label: 'తెలుగు', bcp: 'te-IN', apiName: 'telugu' },
  { code: 'ta', label: 'தமிழ்', bcp: 'ta-IN', apiName: 'tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', bcp: 'kn-IN', apiName: 'kannada' },
  { code: 'bn', label: 'বাংলা', bcp: 'bn-IN', apiName: 'bengali' },
  { code: 'gu', label: 'ગુજરાતી', bcp: 'gu-IN', apiName: 'gujarati' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', bcp: 'pa-IN', apiName: 'punjabi' },
]

const QUICK_Q = [
  'What fertilizer for rice?',
  'Signs of leaf blight?',
  'Best time to sow wheat?',
  'How to manage aphids?',
  'Irrigation tips for summer?',
  'Organic pesticide recipe',
]

// ── Strip markdown for TTS ────────────────────────────
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')          // **bold**
    .replace(/\*(.+?)\*/g, '$1')              // *italic*
    .replace(/#{1,6}\s+/g, '')               // ## headers
    .replace(/`{1,3}[^`]*`{1,3}/g, '')       // `code`
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url)
    .replace(/^\s*[-*+]\s/gm, '')            // - bullet
    .replace(/\n{2,}/g, '\n')
    .trim()
}

// ── TTS ──────────────────────────────────────────────
function splitChunks(text, maxLen = 200) {
  const chunks = []
  let rem = text
  while (rem.length > maxLen) {
    let cut = Math.max(rem.lastIndexOf('. ', maxLen), rem.lastIndexOf(', ', maxLen))
    if (cut === -1) cut = maxLen
    else cut += 2
    chunks.push(rem.slice(0, cut).trim())
    rem = rem.slice(cut).trim()
  }
  if (rem) chunks.push(rem)
  return chunks
}

function useTTS() {
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  function speak(text, bcp, voice) {
    if (!window.speechSynthesis) return
    try {
      window.speechSynthesis.cancel()
      const chunks = splitChunks(text)
      if (!chunks.length) return
      setSpeaking(true)
      const speakChunk = (idx) => {
        if (idx >= chunks.length) { setSpeaking(false); setPaused(false); return }
        const utt = new SpeechSynthesisUtterance(chunks[idx])
        utt.lang = bcp || 'hi-IN'
        utt.rate = 0.88
        if (voice) utt.voice = voice
        utt.onend = () => speakChunk(idx + 1)
        utt.onerror = () => { setSpeaking(false); setPaused(false) }
        try { window.speechSynthesis.speak(utt) } catch { setSpeaking(false); setPaused(false) }
      }
      speakChunk(0)
    } catch { setSpeaking(false); setPaused(false) }
  }
  function stop() {
    try { window.speechSynthesis?.cancel() } catch {}
    setSpeaking(false)
    setPaused(false)
  }
  function pause() { try { window.speechSynthesis?.pause(); setPaused(true) } catch {} }
  function resume() { try { window.speechSynthesis?.resume(); setPaused(false) } catch {} }
  return { speak, stop, pause, resume, speaking, paused }
}

const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    const parts = []
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g
    let last = 0, m
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index))
      if (m[1] !== undefined) parts.push(<strong key={i + '-' + m.index}>{m[1]}</strong>)
      else if (m[2] !== undefined) parts.push(<em key={i + '-' + m.index}>{m[2]}</em>)
      last = m.index + m[0].length
    }
    if (last < line.length) parts.push(line.slice(last))
    return <span key={i}>{parts}{i < text.split('\n').length - 1 && <br />}</span>
  })
}

// ── Animated waveform for voice recording ────────────────────────────────────
const WAVE_HEIGHTS = [
  [4, 18, 10, 24, 8],
  [12, 8, 22, 6, 20],
  [20, 14, 6, 18, 10],
]

function WaveformVisualizer() {
  return (
    <div className="flex items-center gap-1 h-7 px-2">
      {[0, 1, 2, 3, 4].map(i => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full bg-primary"
          animate={{ height: WAVE_HEIGHTS.map(frame => frame[i]) }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: i * 0.08,
          }}
          style={{ height: 8, transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  )
}

// ── Bot avatar speaking wave (3 CSS-keyframe bars) ───────────────────────────
function BotSpeakingWave() {
  return (
    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex items-end gap-px pointer-events-none">
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display: 'block', width: 3, height: 9,
          background: '#22c55e', borderRadius: 2,
          transformOrigin: 'bottom',
          animation: `botBarPulse 0.65s ease-in-out infinite`,
          animationDelay: `${i * 0.14}s`,
        }} />
      ))}
    </div>
  )
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-7 h-7 rounded-full bg-primary-dim flex items-center justify-center shrink-0">
        <Bot size={14} className="text-primary" />
      </div>
      <div className="bg-surface-2 rounded-2xl rounded-tl-none px-4 py-3 border-l-2 border-primary/30">
        <div className="flex gap-1.5 items-end h-4">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="block w-1.5 h-1.5 bg-primary/60 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Message({ msg, onSpeak }) {
  const isBot = msg.role === 'assistant'
  return (
    <motion.div
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-primary-dim' : 'bg-primary/20'}`}>
        {isBot ? <Bot size={14} className="text-primary" /> : <User size={14} className="text-primary" />}
      </div>
      <div className={`relative group max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isBot
          ? 'bg-surface-2 text-text-1 rounded-tl-none border-l-2 border-primary/30'
          : 'bg-primary text-black rounded-tr-none font-medium'
      }`}>
        {isBot ? renderMarkdown(msg.content) : msg.content}
        {isBot && (
          <button onClick={() => onSpeak(msg.content)}
            className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 bg-surface-3 rounded-full flex items-center justify-center border border-border"
            aria-label="Read message aloud"
            title="Read aloud">
            <Volume2 size={9} className="text-primary" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function Chatbot() {
  const { state, dispatch } = useApp()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Namaste! 🌾 I'm AgriBot, your AI farming assistant. Ask me anything about crops, diseases, fertilizers, or farming techniques!` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState(state.language || 'hi')
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [listening, setListening] = useState(false)
  const [sent, setSent] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoiceName, setSelectedVoiceName] = useState(
    () => localStorage.getItem('agri_tts_voice') || ''
  )
  const bottomRef = useRef()
  const inputRef = useRef()
  const recRef = useRef(null)
  const { speak, stop, pause, resume, speaking, paused } = useTTS()
  const langObj = LANGS.find(l => l.code === lang) || LANGS[1]
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langObj.code))
  const displayVoices = langVoices.length > 0
    ? langVoices
    : voices.filter(v => v.lang.toLowerCase().startsWith('en')).slice(0, 6)
  const selectedVoice = displayVoices.find(v => v.name === selectedVoiceName) || displayVoices[0] || null

  function changeLang(code) {
    setLang(code)
    dispatch({ type: 'SET_LANGUAGE', payload: code })
  }

  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis?.getVoices() || []
      if (v.length) setVoices(v)
    }
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    setSent(true)
    setTimeout(() => setSent(false), 1200)
    setMessages(prev => [...prev, { role: 'user', content }])
    setLoading(true)
    try {
      const res = await chatApi.send(content, langObj.apiName)
      const answer = res.answer || 'Sorry, I did not understand that.'
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
      if (ttsEnabled) speak(stripMarkdown(answer), langObj.bcp, selectedVoice)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ I could not connect to the server. Please check your connection and try again.' }])
    }
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function toggleListen() {
    if (!SpeechRec) { alert('Voice input is not supported in this browser. Try Chrome.'); return }
    if (listening) { recRef.current?.stop(); setListening(false); return }
    const rec = new SpeechRec()
    recRef.current = rec
    rec.lang = langObj.bcp
    rec.interimResults = false
    rec.onresult = e => {
      const t = e.results[0][0].transcript
      setInput(prev => prev + (prev ? ' ' : '') + t)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.start()
    setListening(true)
  }

  return (
    <div className="page-content flex flex-col" style={{ height: 'calc(100vh - 2rem)' }}>
      <style>{`@keyframes botBarPulse { 0%,100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }`}</style>
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-primary-dim flex items-center justify-center overflow-hidden">
            <Bot size={18} className={`text-primary transition-opacity duration-300 ${speaking ? 'opacity-30' : ''}`} />
            {speaking && <BotSpeakingWave />}
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-text-1">AgriBot</h1>
            <p className="text-text-3 text-xs">
              AI Farm Assistant · {loading ? 'Typing…' : speaking ? '🔊 Speaking…' : listening ? '🎙 Listening…' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-2 px-2 py-1 rounded-lg overflow-x-auto max-w-[55vw] no-scrollbar">
            <Globe size={12} className="text-text-3 shrink-0" />
            {LANGS.map(l => (
              <button key={l.code} onClick={() => changeLang(l.code)}
                className={`shrink-0 text-xs px-2 py-0.5 rounded transition-colors ${lang === l.code ? 'bg-primary text-black font-medium' : 'text-text-3 hover:text-text-2'}`}>
                {l.label}
              </button>
            ))}
          </div>
          {displayVoices.length > 0 && ttsEnabled && (
            <select
              className="text-xs bg-surface-2 border border-border rounded-lg px-1.5 py-1 text-text-2 max-w-[8rem] truncate cursor-pointer"
              title="TTS Voice"
              value={selectedVoice?.name || ''}
              onChange={e => {
                setSelectedVoiceName(e.target.value)
                localStorage.setItem('agri_tts_voice', e.target.value)
              }}
            >
              {displayVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name.replace(/ \([^)]+\)/g, '').slice(0, 22)}
                </option>
              ))}
            </select>
          )}
          <button className="btn-icon" title={ttsEnabled ? 'Mute voice' : 'Enable voice'}
            aria-label={ttsEnabled ? 'Mute voice output' : 'Enable voice output'}
            aria-pressed={ttsEnabled}
            onClick={() => { setTtsEnabled(t => !t); stop() }}>
            {ttsEnabled ? <Volume2 size={14} className="text-primary" /> : <VolumeX size={14} />}
          </button>
          <button className="btn-icon" aria-label="Reset conversation" onClick={() => { stop(); setMessages([{ role: 'assistant', content: `Namaste! 🌾 Ask me anything about farming!` }]) }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Quick questions */}
      <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar" role="list" aria-label="Quick question shortcuts">
        {QUICK_Q.map(q => (
          <button key={q} onClick={() => send(q)}
            role="listitem"
            aria-label={`Quick question: ${q}`}
            className="shrink-0 text-xs bg-surface-2 hover:bg-surface-3 text-text-2 px-3 py-1.5 rounded-full border border-border transition-colors whitespace-nowrap">
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto space-y-4 py-2 pr-1"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Message key={i} msg={m} onSpeak={t => speak(stripMarkdown(t), langObj.bcp, selectedVoice)} />
          ))}
        </AnimatePresence>
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {loading ? 'AgriBot is typing…' : ''}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-border">
        <div className="flex gap-2 items-center">
          <button type="button" onClick={toggleListen}
            aria-label={listening ? 'Stop voice recording' : 'Start voice input'}
            aria-pressed={listening}
            title={SpeechRec ? (listening ? 'Stop recording' : 'Voice input') : 'Not supported in this browser'}
            className={`btn-icon shrink-0 ${listening ? 'bg-red-500/20 text-red-400 border-red-500/20' : ''} ${!SpeechRec ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {listening ? <MicOff size={15} className="text-red-400" /> : <Mic size={15} />}
          </button>

          {listening ? (
            <div className="flex-1 flex items-center bg-surface-2 border border-primary/40 rounded-lg px-2"
              style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.15)' }}>
              <WaveformVisualizer />
              <span className="text-xs text-primary ml-1 animate-pulse">Listening…</span>
            </div>
          ) : (
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                id="chatbot-input"
                aria-label="Type your farming question"
                className="input w-full transition-shadow duration-200"
                style={{ outline: 'none' }}
                placeholder={lang === 'hi' ? 'अपना सवाल लिखें…' : lang === 'mr' ? 'तुमचा प्रश्न लिहा…' : 'Ask about farming, crops, diseases…'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.20)'}
                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                disabled={loading}
              />
            </div>
          )}

          {speaking && (
            <>
              <button type="button" className="btn-icon shrink-0 text-primary"
                onClick={paused ? resume : pause}
                aria-label={paused ? 'Resume speaking' : 'Pause speaking'}
                title={paused ? 'Resume speaking' : 'Pause speaking'}>
                {paused ? <Play size={13} /> : <Pause size={13} />}
              </button>
              <button type="button" className="btn-icon shrink-0 text-primary" onClick={stop} aria-label="Stop speaking" title="Stop speaking">
                <Square size={12} className="fill-primary" />
              </button>
            </>
          )}

          <motion.button
            className="btn-primary px-4 shrink-0"
            onClick={() => send()}
            aria-label="Send message"
            disabled={loading || (!input.trim() && !sent)}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span key="loader" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                  <Loader2 size={15} className="animate-spin" />
                </motion.span>
              ) : sent ? (
                <motion.span key="check" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                  <Check size={15} />
                </motion.span>
              ) : (
                <motion.span key="send" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                  <Send size={15} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        <p className="text-text-3 text-xs mt-2 text-center">AgriBot may make mistakes. Verify important advice with experts.</p>
        <p className="text-text-3 mt-1 text-center" style={{ fontSize: 10, opacity: 0.45 }}>Powered by Ollama + Gemini</p>
      </div>
    </div>
  )
}

```


## `frontend-src/src/pages/Complaints.jsx`


```jsx
import { useState } from 'react'
import { MessageSquare, Loader2, CheckCircle2, AlertCircle, Phone, Lock } from 'lucide-react'
import { complaintsApi } from '../api/client'
import { useApp } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'

// Backend valid values
const CATEGORIES = [
  { value: 'water', label: 'Water / Irrigation Issue' },
  { value: 'seeds', label: 'Seeds Quality' },
  { value: 'fertilizer', label: 'Fertilizer / Pesticide Quality' },
  { value: 'pests', label: 'Pests / Crop Damage' },
  { value: 'market', label: 'Market Price Dispute' },
  { value: 'subsidy', label: 'Government Scheme / Subsidy' },
  { value: 'land', label: 'Land / Ownership Issue' },
  { value: 'equipment', label: 'Equipment / Machinery' },
  { value: 'other', label: 'Other' },
]

const URGENCIES = [
  { value: 'low', label: 'Low', color: 'text-text-3' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-400' },
]

export default function Complaints() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category: 'water', subject: '', description: '', urgency: 'medium',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [error, setError] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await complaintsApi.submit({
        category: form.category,
        subject: form.subject,
        description: form.description,
        urgency: form.urgency,
      })
      setSubmitted(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  // Require login
  if (!state.authToken) {
    return (
      <div className="page-content">
        <div className="card p-10 text-center max-w-sm mx-auto">
          <Lock size={36} className="text-text-3 mx-auto mb-3" />
          <h2 className="font-display text-text-1 text-lg font-semibold mb-2">Sign in Required</h2>
          <p className="text-text-3 text-sm mb-4">You need to be logged in to lodge a complaint.</p>
          <button className="btn-primary w-full" onClick={() => navigate('/profile')}>Go to Sign In</button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="page-content">
        <div className="card p-10 text-center max-w-md mx-auto">
          <CheckCircle2 size={44} className="text-primary mx-auto mb-3" />
          <h2 className="font-display text-text-1 text-xl font-bold mb-2">Complaint Submitted!</h2>
          <p className="text-text-2 text-sm mb-4">Your complaint has been registered. You will be notified once it is reviewed.</p>
          {(submitted.complaint?.id || submitted.id) && (
            <div className="bg-surface-2 rounded-lg p-3 mb-4">
              <p className="text-text-3 text-xs">Complaint ID</p>
              <p className="text-text-1 font-semibold text-lg">#{submitted.complaint?.id || submitted.id}</p>
            </div>
          )}
          <button className="btn-primary w-full" onClick={() => { setSubmitted(null); setForm({ category: 'water', subject: '', description: '', urgency: 'medium' }) }}>
            Submit Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Lodge Complaint</h1>
        <p className="text-text-3 text-sm mt-0.5">Report agricultural issues to the district authority</p>
      </header>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: Phone, label: 'Kisan Call Center', value: '1800-180-1551', sub: 'Toll free, 24x7' },
          { icon: MessageSquare, label: 'Response Time', value: '24–48 hrs', sub: 'Working days' },
          { icon: CheckCircle2, label: 'Resolution Rate', value: '87%', sub: 'Last quarter' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-dim flex items-center justify-center shrink-0">
              <s.icon size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-text-1 font-semibold">{s.value}</p>
              <p className="text-text-3 text-xs">{s.label} · {s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="comp-category">Category</label>
            <select id="comp-category" className="input w-full" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="comp-urgency">Urgency</label>
            <select id="comp-urgency" className="input w-full" value={form.urgency} onChange={set('urgency')}>
              {URGENCIES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="comp-subject">Subject</label>
          <input id="comp-subject" className="input w-full" required value={form.subject} onChange={set('subject')} placeholder="Brief subject of complaint" maxLength={120} />
        </div>

        <div>
          <label className="label" htmlFor="comp-description">Description</label>
          <textarea id="comp-description" className="input w-full h-32 resize-none" required value={form.description} onChange={set('description')} placeholder="Describe your issue in detail — what happened, when, extent of damage…" />
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : <><MessageSquare size={15} /> Submit Complaint</>}
        </button>
      </form>
    </div>
  )
}

```


## `frontend-src/src/pages/CropAdvisor.jsx`


```jsx
import { useState } from 'react'
import { Sprout, Loader2, ChevronDown, Star, Info, CheckCircle2 } from 'lucide-react'
import { cropApi } from '../api/client'

const SOIL_TYPES = ['Alluvial','Black','Red','Laterite','Sandy','Clay','Loamy']
const STATES = ['Maharashtra','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','Karnataka','Andhra Pradesh','Telangana','Bihar','West Bengal','Tamil Nadu']
const SEASONS = ['Kharif','Rabi','Zaid']

function CropCard({ crop, rank }) {
  const [open, setOpen] = useState(false)
  const colors = ['text-amber-400','text-text-2','text-amber-700']
  const bgColors = ['bg-amber-400/10','bg-surface-2','bg-amber-700/10']

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${bgColors[rank] || 'bg-surface-2'} flex items-center justify-center text-sm font-bold ${colors[rank] || 'text-text-3'} shrink-0`}>
          {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-text-1 font-semibold">{crop.crop_name || crop.name}</h3>
            {crop.confidence != null && (
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-text-2 text-sm">{(crop.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
          {crop.hindi_name && <p className="text-text-3 text-xs">{crop.hindi_name}</p>}
        </div>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-border space-y-2 animate-fadeIn">
          {crop.description && <p className="text-text-2 text-sm">{crop.description}</p>}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            {crop.water_requirement && <div><span className="text-text-3 text-xs">Water: </span><span className="text-text-2">{crop.water_requirement}</span></div>}
            {crop.duration_days && <div><span className="text-text-3 text-xs">Duration: </span><span className="text-text-2">{crop.duration_days} days</span></div>}
            {crop.expected_yield && <div><span className="text-text-3 text-xs">Yield: </span><span className="text-text-2">{crop.expected_yield}</span></div>}
            {crop.market_demand && <div><span className="text-text-3 text-xs">Demand: </span><span className={`font-medium ${crop.market_demand === 'High' ? 'text-primary' : crop.market_demand === 'Medium' ? 'text-amber-400' : 'text-text-2'}`}>{crop.market_demand}</span></div>}
          </div>
          {crop.pros?.length > 0 && (
            <ul className="space-y-1">
              {crop.pros.map((p, i) => <li key={i} className="text-text-2 text-xs flex gap-1.5"><CheckCircle2 size={11} className="text-primary mt-0.5 shrink-0" />{p}</li>)}
            </ul>
          )}
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={open ? `Collapse details for ${crop.crop_name || crop.name}` : `Expand details for ${crop.crop_name || crop.name}`} className="w-full mt-3 flex items-center justify-center gap-1 text-text-3 text-xs hover:text-text-2 transition-colors">
        {open ? 'Less' : 'Details'}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  )
}

export default function CropAdvisor() {
  const [form, setForm] = useState({
    soil_type: 'Alluvial', state: 'Maharashtra', season: 'Kharif',
    nitrogen: '', phosphorus: '', potassium: '',
    temperature: '', humidity: '', ph: '', rainfall: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const set = k => e => {
    const v = e.target.value
    setForm(f => ({ ...f, [k]: v }))
    setErrors(prev => { const next = { ...prev }; delete next[k]; return next })
  }

  function validate(form) {
    const errs = {}
    const rules = [
      ['nitrogen',    0, 500],
      ['phosphorus',  0, 500],
      ['potassium',   0, 500],
      ['temperature', 0,  60],
      ['humidity',    0, 100],
      ['ph',          0,  14],
      ['rainfall',    0, 5000],
    ]
    for (const [key, min, max] of rules) {
      if (form[key] === '' || form[key] == null) { errs[key] = 'This field is required'; continue }
      const v = parseFloat(form[key])
      if (isNaN(v)) { errs[key] = 'Enter a valid number'; continue }
      if (v < min || v > max) errs[key] = `Must be between ${min} and ${max}`
    }
    return errs
  }

  async function recommend(e) {
    e.preventDefault(); setError(null); setResult(null)
    const vErrs = validate(form)
    if (Object.keys(vErrs).length > 0) { setErrors(vErrs); return }
    setLoading(true)
    try {
      const payload = {
        nitrogen: parseFloat(form.nitrogen),
        phosphorus: parseFloat(form.phosphorus),
        potassium: parseFloat(form.potassium),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        ph: parseFloat(form.ph),
        rainfall: parseFloat(form.rainfall),
        state: form.state,
        district: '',
      }
      const res = await cropApi.recommend(payload)
      setResult(Array.isArray(res) ? { crops: res } : res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const crops = result?.crops || result?.recommendations || []

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Crop Advisor</h1>
        <p className="text-text-3 text-sm mt-0.5">AI-powered crop recommendations based on your soil and climate</p>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #0f2e1a 0%, #09100E 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #22c55e 0%, transparent 60%)' }} />
        <div className="relative px-5 py-4 flex items-center gap-4">
          <div className="text-4xl">🌾</div>
          <div>
            <p className="text-text-1 font-semibold text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>ML-Powered Prediction</p>
            <p className="text-text-3 text-xs mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Enter your exact soil lab values for best accuracy. All fields are required by the AI model.</p>
          </div>
        </div>
      </div>

      <form onSubmit={recommend} className="card p-5 space-y-4">
        {/* Location & season */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label" htmlFor="ca-soil-type">Soil Type</label>
            <select id="ca-soil-type" className="input w-full" value={form.soil_type} onChange={set('soil_type')}>
              {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ca-state">State</label>
            <select id="ca-state" className="input w-full" value={form.state} onChange={set('state')}>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ca-season">Season</label>
            <select id="ca-season" className="input w-full" value={form.season} onChange={set('season')}>
              {SEASONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* NPK */}
        <div>
          <p className="text-text-2 text-sm font-medium mb-2">Soil Nutrients (kg/ha) <span className="text-red-400 text-xs">* required</span></p>
          <div className="grid grid-cols-3 gap-3">
            {[['Nitrogen (N)', 'nitrogen', '0–200'], ['Phosphorus (P)', 'phosphorus', '0–150'], ['Potassium (K)', 'potassium', '0–300']].map(([l, k, h]) => (
              <div key={k}>
                <label className="label text-xs" htmlFor={`ca-${k}`}>{l}</label>
                <input id={`ca-${k}`} className={`input w-full ${errors[k] ? 'border-red-500' : ''}`} type="number" min="0" step="0.1" placeholder={h} value={form[k]} onChange={set(k)}
                  aria-describedby={errors[k] ? `ca-${k}-err` : undefined} />
                {errors[k] && <p id={`ca-${k}-err`} role="alert" className="text-red-400 text-xs mt-1">{errors[k]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Climate & soil params */}
        <div>
          <p className="text-text-2 text-sm font-medium mb-2">Climate & Soil Conditions <span className="text-red-400 text-xs">* required</span></p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ['Temperature (°C)', 'temperature', '5–50', '0–50'],
              ['Humidity (%)', 'humidity', '10–100', '0–100'],
              ['Soil pH', 'ph', '4.0–9.0', '0–14'],
              ['Rainfall (mm)', 'rainfall', '20–3000', '0–5000'],
            ].map(([l, k, ph, range]) => (
              <div key={k}>
                <label className="label text-xs" htmlFor={`ca-${k}`}>{l}</label>
                <input id={`ca-${k}`} className={`input w-full ${errors[k] ? 'border-red-500' : ''}`} type="number" step="0.1" placeholder={ph} value={form[k]} onChange={set(k)}
                  aria-describedby={errors[k] ? `ca-${k}-err` : undefined} />
                {errors[k] && <p id={`ca-${k}-err`} role="alert" className="text-red-400 text-xs mt-1">{errors[k]}</p>}
              </div>
            ))}
          </div>
        </div>

        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading || Object.keys(errors).length > 0}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Analyzing…</> : <><Sprout size={15} /> Get Crop Recommendations</>}
        </button>
      </form>

      {crops.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-primary" />
            <h3 className="font-display text-text-1 font-semibold">Top {crops.length} Recommended Crops</h3>
            <span className="text-text-3 text-sm">for {form.soil_type} soil · {form.season} · {form.state}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {crops.map((crop, i) => <CropCard key={i} crop={crop} rank={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/CropCycle.jsx`


```jsx
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

```


## `frontend-src/src/pages/Disease.jsx`


```jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Loader2, AlertCircle, CheckCircle2, RotateCcw, Share2, Video, Play, PauseCircle, VideoOff, Radio, Trash2, History, X, FlipHorizontal } from 'lucide-react'
import { diseaseApi } from '../api/client'
import SkeletonCard from '../components/common/SkeletonCard'
import gsap from 'gsap'

// ── Image validation helpers ────────────────────────────
function getImageDimensions(file) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.src = URL.createObjectURL(file)
  })
}

function compressImage(file, quality) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      canvas.toBlob(blob => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality)
    }
    img.src = URL.createObjectURL(file)
  })
}

// ── Circular confidence arc ────────────────────────────
function ConfidenceRing({ pct, color }) {
  const r = 28, circ = 2 * Math.PI * r
  const dash = circ - (pct / 100) * circ
  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <motion.circle
        cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  )
}

// ── Corner brackets for scan frame ───────────────────
function CornerBrackets({ active }) {
  const s = {
    position: 'absolute', width: 20, height: 20,
    boxShadow: active ? '0 0 10px rgba(34,197,94,0.8)' : 'none',
    transition: 'all 0.3s',
  }
  const b = `2px solid ${active ? '#22C55E' : 'rgba(34,197,94,0.3)'}`
  return (
    <>
      <div style={{ ...s, top: 8, left: 8, borderTop: b, borderLeft: b }} />
      <div style={{ ...s, top: 8, right: 8, borderTop: b, borderRight: b }} />
      <div style={{ ...s, bottom: 8, left: 8, borderBottom: b, borderLeft: b }} />
      <div style={{ ...s, bottom: 8, right: 8, borderBottom: b, borderRight: b }} />
    </>
  )
}

// ── Live Camera component ────────────────────────────────────
function LiveCamera() {
  const videoRef       = useRef(null)
  const canvasRef      = useRef(null)
  const intervalRef    = useRef(null)
  const prevAvgRef     = useRef(null)
  const analyzingRef   = useRef(false)
  const recordingRef   = useRef(false)
  const sessionRef     = useRef([])
  const recordTimerRef = useRef(null)
  const streamRef      = useRef(null)

  const [stream,         setStream]         = useState(null)
  const [scanning,       setScanning]       = useState(false)
  const [analyzing,      setAnalyzing]      = useState(false)
  const [detections,     setDetections]     = useState([])
  const [liveError,      setLiveError]      = useState(null)
  const [recording,      setRecording]      = useState(false)
  const [recordSecsLeft, setRecordSecsLeft] = useState(0)
  const [sessionSummary, setSessionSummary] = useState(null)
  const [facingMode,     setFacingMode]     = useState('environment')
  const [showFlash,      setShowFlash]      = useState(false)
  const [captureResult,  setCaptureResult]  = useState(null)
  const [captureLoading, setCaptureLoading] = useState(false)
  const isMobile = /Mobi/i.test(navigator.userAgent)

  // Stop everything on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    clearInterval(recordTimerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  // Assign srcObject after React renders the <video> element (it's conditional on stream being truthy)
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [stream])

  async function startCamera(facing) {
    const mode = facing ?? facingMode
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = s
      setStream(s)   // triggers re-render → video mounts → effect above fires
      setLiveError(null)
    } catch (err) {
      const msg = err?.name === 'NotAllowedError'
        ? 'Camera access denied. Please use file upload instead.'
        : err?.name === 'NotFoundError'
        ? 'No camera found on this device.'
        : 'Could not access camera. Please check permissions and try again.'
      setLiveError(msg)
    }
  }

  function stopCamera() {
    clearInterval(intervalRef.current)
    clearInterval(recordTimerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setStream(null)
    setScanning(false)
    setRecording(false)
    recordingRef.current = false
    prevAvgRef.current = null
  }

  async function flipCamera() {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    clearInterval(intervalRef.current)
    clearInterval(recordTimerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setStream(null)
    setScanning(false)
    setRecording(false)
    recordingRef.current = false
    prevAvgRef.current = null
    await startCamera(next)
  }

  async function capture() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.videoWidth === 0) return
    // Pause stream, draw frame
    video.pause()
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    // White flash animation
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 300)
    setCaptureLoading(true)
    setCaptureResult(null)
    try {
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9))
      if (!blob) return
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      const fd = new FormData()
      fd.append('file', file)
      const data = await diseaseApi.detect(fd)
      const top  = data.diseases?.[0] ?? {}
      setCaptureResult({
        disease:    data.is_healthy ? 'Healthy' : (top.disease_name || 'Unknown'),
        confidence: Math.round((top.confidence || 0) * 100),
        is_healthy: !!data.is_healthy,
        treatment:  top.treatment || [],
      })
    } catch (e) {
      setCaptureResult({ error: e.message || 'Detection failed' })
    } finally {
      setCaptureLoading(false)
      video.play().catch(() => {})
    }
  }

  async function analyzeFrame() {
    if (analyzingRef.current) return
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.videoWidth === 0) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    // Sample pixel brightness to skip unchanged frames
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let sum = 0, count = 0
    for (let i = 0; i < pixels.length; i += 40) { sum += pixels[i]; count++ }
    const avg  = count ? sum / count : 0
    const prev = prevAvgRef.current
    prevAvgRef.current = avg
    if (prev !== null && Math.abs(avg - prev) < 3) return
    analyzingRef.current = true
    setAnalyzing(true)
    try {
      const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.8))
      if (!blob) return
      const fd = new FormData()
      fd.append('file', blob, 'frame.jpg')
      const data = await diseaseApi.detect(fd)
      const top  = data.diseases?.[0] ?? {}
      const det  = {
        id:         Date.now(),
        timestamp:  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        disease:    data.is_healthy ? 'Healthy' : (top.disease_name || 'Unknown'),
        confidence: Math.round((top.confidence || 0) * 100),
        is_healthy: !!data.is_healthy,
      }
      setDetections(p => [det, ...p].slice(0, 5))
      if (recordingRef.current) sessionRef.current.push(det)
    } catch { /* silent — network errors handled gracefully */ }
    finally {
      analyzingRef.current = false
      setAnalyzing(false)
    }
  }

  function startScanning() {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(analyzeFrame, 3000)
    setScanning(true)
  }

  function toggleScanning() {
    if (scanning) { clearInterval(intervalRef.current); setScanning(false) }
    else startScanning()
  }

  function startRecord() {
    if (recordingRef.current) return
    sessionRef.current = []
    setSessionSummary(null)
    recordingRef.current = true
    setRecording(true)
    setRecordSecsLeft(30)
    startScanning()
    let secs = 30
    recordTimerRef.current = setInterval(() => {
      secs--
      setRecordSecsLeft(secs)
      if (secs <= 0) {
        clearInterval(recordTimerRef.current)
        recordingRef.current = false
        setRecording(false)
        const results = sessionRef.current
        if (!results.length) { setSessionSummary({ empty: true }); return }
        const counts = {}
        results.forEach(r => { counts[r.disease] = (counts[r.disease] || 0) + 1 })
        setSessionSummary({
          sorted:       Object.entries(counts).sort((a, b) => b[1] - a[1]),
          healthyCount: results.filter(r => r.is_healthy).length,
          total:        results.length,
          avgConf:      Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length),
        })
      }
    }, 1000)
  }

  return (
    <div className="space-y-4">
      {liveError && (
        <div className="card p-4 border-red-500/20 bg-red-500/5 flex items-start gap-3">
          <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-text-2 text-sm">{liveError}</p>
        </div>
      )}

      {/* Camera viewport */}
      <div className="card overflow-hidden">
        <div className="relative bg-black flex items-center justify-center" style={{ minHeight: 240 }}>
          {!stream ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Video size={28} className="text-primary" />
              </div>
              <p className="text-text-3 text-sm">Tap to activate your camera</p>
              <button className="btn-primary flex items-center gap-2" onClick={startCamera}>
                <Camera size={15} /> Start Camera
              </button>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-64 object-contain" />
              <canvas ref={canvasRef} className="hidden" />
              {/* White flash on capture */}
              <AnimatePresence>
                {showFlash && (
                  <motion.div
                    key="flash"
                    className="absolute inset-0 bg-white z-20 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <CornerBrackets active={scanning} />

              {scanning && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(10,21,16,0.9)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  AUTO-SCANNING
                </div>
              )}

              {analyzing && (
                <div className="absolute top-3 right-3 rounded-full bg-black/60 p-1">
                  <Loader2 size={14} className="text-primary animate-spin" />
                </div>
              )}

              {recording && (
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC — {recordSecsLeft}s left
                </div>
              )}
            </>
          )}
        </div>

        {stream && (
          <div className="p-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleScanning}
              aria-label={scanning ? 'Stop auto-scan' : 'Start auto-scan'}
              aria-pressed={scanning}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                scanning
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15'
                  : 'btn-primary'
              }`}
            >
              {scanning ? <><PauseCircle size={14} /> Stop</> : <><Play size={14} /> Auto-Scan</>}
            </button>
            <button
              onClick={startRecord} disabled={recording}
              aria-label={recording ? `Recording — ${recordSecsLeft} seconds left` : 'Start 30-second recording session'}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
              style={{
                background: recording ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.1)',
                color:      recording ? '#f87171' : '#22C55E',
                border:     `1px solid ${recording ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.2)'}`,
                cursor:     recording ? 'not-allowed' : 'pointer',
              }}
            >
              <Radio size={13} />
              {recording ? `Recording… ${recordSecsLeft}s` : 'Record 30s Session'}
            </button>
            {/* Capture single frame */}
            <button
              onClick={capture}
              disabled={captureLoading}
              aria-label="Capture current frame for disease analysis"
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all"
              style={{ background: 'rgba(250,204,21,0.12)', color: '#facc15', border: '1px solid rgba(250,204,21,0.25)', cursor: captureLoading ? 'not-allowed' : 'pointer' }}
            >
              {captureLoading
                ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
                : <>📸 Capture</>}
            </button>
            {/* Flip camera — mobile only */}
            {isMobile && (
              <button
                onClick={flipCamera}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all"
                style={{ background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
                title="Switch front / rear camera"
              >
                <FlipHorizontal size={13} /> Flip
              </button>
            )}
            <button className="btn-icon ml-auto" aria-label="Stop camera" onClick={stopCamera} title="Stop camera">
              <VideoOff size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Live detections */}
      <AnimatePresence>
        {detections.length > 0 && (
          <motion.div
            key="live-detections"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-3 flex items-center gap-2">
              Live Detections
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            </p>
            <div className="space-y-2">
              {detections.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                    d.is_healthy
                      ? 'bg-primary/5 border border-primary/15'
                      : 'bg-amber-500/5 border border-amber-500/15'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-primary animate-pulse' : 'bg-surface-3'}`} />
                    <p className="text-text-1 text-sm truncate">{d.disease}</p>
                    {!d.is_healthy && <span className="badge badge-yellow text-xs shrink-0">{d.confidence}%</span>}
                  </div>
                  <span className="text-text-3 text-[11px] shrink-0 font-mono">{d.timestamp}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session summary */}
      <AnimatePresence>
        {sessionSummary && !sessionSummary.empty && (
          <motion.div
            key="session-summary"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="card p-4 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-1 font-semibold">30-second Session Report</p>
              <span className="badge badge-green">{sessionSummary.total} scans</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-surface-2 rounded-lg p-3 text-center">
                <p className="text-primary font-bold text-2xl">{sessionSummary.healthyCount}</p>
                <p className="text-text-3 text-xs">Healthy frames</p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3 text-center">
                <p className="text-amber-400 font-bold text-2xl">{sessionSummary.total - sessionSummary.healthyCount}</p>
                <p className="text-text-3 text-xs">Disease detected</p>
              </div>
            </div>
            <p className="text-text-3 text-[11px] font-semibold uppercase tracking-wide mb-2">Breakdown</p>
            <div className="space-y-1.5">
              {sessionSummary.sorted.map(([disease, count]) => (
                <div key={disease} className="flex items-center gap-2">
                  <span className="text-text-2 text-xs flex-1 truncate">{disease}</span>
                  <div className="w-20 h-1 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(count / sessionSummary.total) * 100}%` }} />
                  </div>
                  <span className="text-text-3 text-xs w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
            <p className="text-text-3 text-xs mt-3">
              Avg confidence: <span className="text-text-1 font-medium">{sessionSummary.avgConf}%</span>
            </p>
          </motion.div>
        )}
        {sessionSummary?.empty && (
          <motion.p
            key="empty-session"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-text-3 text-sm text-center card p-4"
          >
            No detections captured during session.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Single-frame capture result */}
      <AnimatePresence>
        {captureResult && (
          <motion.div
            key="capture-result"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`card p-4 border ${
              captureResult.error
                ? 'border-red-500/20 bg-red-500/5'
                : captureResult.is_healthy
                ? 'border-primary/20 bg-primary/5'
                : 'border-amber-500/20 bg-amber-500/5'
            }`}
          >
            {captureResult.error ? (
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-text-2 text-sm">{captureResult.error}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-text-3 uppercase tracking-wide">📸 Capture Result</p>
                  <button
                    onClick={() => setCaptureResult(null)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-3 transition-colors"
                  >
                    <X size={12} className="text-text-3" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-text-1 font-semibold">{captureResult.disease}</p>
                    <p className="text-text-3 text-xs mt-0.5">{captureResult.confidence}% confidence</p>
                  </div>
                  <span className={`badge shrink-0 ${
                    captureResult.is_healthy ? 'badge-green' : 'badge-yellow'
                  }`}>
                    {captureResult.is_healthy ? '✓ Healthy' : '⚠ Disease'}
                  </span>
                </div>
                {captureResult.treatment?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-1.5">Top Treatment</p>
                    <p className="text-text-2 text-sm leading-relaxed">{captureResult.treatment[0]}</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Disease() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upload')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)
  const [displayConf, setDisplayConf] = useState(0)
  const [toast, setToast] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const inputRef = useRef()
  const scanRef = useRef()
  const imgContainerRef = useRef()
  const scanTweenRef = useRef()

  // Fetch history on mount
  useEffect(() => {
    diseaseApi.getHistory(10)
      .then(res => setHistory(Array.isArray(res?.detections) ? res.detections : []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false))
  }, [])

  function deleteHistoryItem(id) {
    setHistory(prev => prev.filter(item => (item.detection_id || item.id) !== id))
    diseaseApi.deleteHistory(id).catch(() => {})
  }

  function formatDate(isoStr) {
    if (!isoStr) return '—'
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // GSAP scan sweep while loading
  useEffect(() => {
    if (loading && scanRef.current && imgContainerRef.current) {
      const h = imgContainerRef.current.offsetHeight
      scanTweenRef.current = gsap.fromTo(
        scanRef.current,
        { y: 0 },
        { y: h - 4, duration: 1.5, repeat: -1, ease: 'none' }
      )
    } else {
      scanTweenRef.current?.kill()
      if (scanRef.current) gsap.set(scanRef.current, { y: 0 })
    }
    return () => { scanTweenRef.current?.kill() }
  }, [loading])

  // GSAP stagger result cards
  useEffect(() => {
    if (result) {
      gsap.from('.result-item', { opacity: 0, y: 20, stagger: 0.12, duration: 0.4, ease: 'power2.out' })
    }
  }, [result])

  // GSAP confidence count-up
  useEffect(() => {
    if (result?.confidence != null) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: result.confidence,
        duration: 1,
        ease: 'power1.out',
        onUpdate: () => setDisplayConf(Math.round(obj.val)),
      })
    }
  }, [result?.confidence])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500)
      return () => clearTimeout(t)
    }
  }, [toast])

  async function validateAndProcessImage(f) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, and WebP images are supported'); return null
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB'); return null
    }
    const dims = await getImageDimensions(f)
    if (dims.width < 224 || dims.height < 224) {
      setError('Image must be at least 224×224 pixels for accurate detection'); return null
    }
    if (f.size > 5 * 1024 * 1024) return await compressImage(f, 0.8)
    return f
  }

  async function handleFile(f) {
    if (!f) return
    setResult(null); setError(null); setImageInfo(null)
    const validated = await validateAndProcessImage(f)
    if (!validated) return
    const dims = await getImageDimensions(validated)
    setImageInfo({ width: dims.width, height: dims.height, size: validated.size, name: validated.name })
    setFile(validated)
    setPreview(URL.createObjectURL(validated))
  }

  async function detect() {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const data = await diseaseApi.detect(fd)
      const topDisease = data.diseases?.[0] ?? {}
      setResult({
        disease: data.is_healthy ? 'Healthy' : (topDisease.disease_name || 'Unknown'),
        confidence: Math.round((topDisease.confidence || 0) * 100),
        description: topDisease.description,
        treatment: topDisease.treatment || [],
        prevention: topDisease.prevention || [],
        is_healthy: data.is_healthy,
        top_3_predictions: data.top_3_predictions || [],
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setDisplayConf(0)
    setImageInfo(null)
  }

  function shareAlert() {
    if (!result) return
    const topTreatment = result.treatment[0] || 'Consult an agronomist'
    const text = [
      '🌿 AgriSahayak Disease Alert',
      '━━━━━━━━━━━━━━━━━━━━',
      `Disease : ${result.disease}`,
      `Confidence : ${result.confidence}%`,
      '━━━━━━━━━━━━━━━━━━━━',
      'Top Treatment:',
      topTreatment,
      '━━━━━━━━━━━━━━━━━━━━',
      'Detected via AgriSahayak AI',
    ].join('\n')
    navigator.clipboard.writeText(text)
      .then(() => setToast('✅ Alert copied to clipboard!'))
      .catch(() => setToast('⚠️ Copy failed — try manually'))
  }

  const severity = result?.is_healthy ? 'healthy'
    : result?.confidence > 70 ? 'high' : 'medium'

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Disease Detection</h1>
        <p className="text-text-3 text-sm mt-0.5">Upload a crop photo to identify diseases with AI</p>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(15,40,24,1) 50%, rgba(9,16,14,1) 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 text-7xl opacity-20 select-none">🌿</div>
        <div className="relative px-5 py-4 flex items-center gap-4">
          <div className="text-4xl">🔬</div>
          <div>
            <p className="text-primary font-semibold text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>AI-Powered Diagnosis</p>
            <p className="text-text-3 text-xs mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Our model is trained on 54,000+ crop disease images across 38 classes</p>
          </div>
          <div className="ml-auto hidden sm:flex gap-4 text-center">
            {[['38', 'Diseases'], ['95%', 'Accuracy'], ['2s', 'Speed']].map(([v, l]) => (
              <div key={l}>
                <p className="text-primary font-bold text-lg leading-tight">{v}</p>
                <p className="text-text-3 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mode tabs ── */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl" role="tablist" aria-label="Detection mode">
        {([['upload', Camera, 'Upload Image'], ['live', Video, 'Live Camera']] ).map(([tab, Icon, label]) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-surface-1 text-text-1 shadow' : 'text-text-3 hover:text-text-2'
            }`}
          >
            <Icon size={14} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'live' && <LiveCamera />}

      {activeTab === 'upload' && !preview && (
        /* ── Dropzone ── */
        <motion.div
          className="relative flex flex-col items-center justify-center gap-5 rounded-2xl cursor-pointer select-none"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
          initial={false}
          whileHover="hover"
          style={{ minHeight: 260, padding: '2.5rem 2rem' }}
          animate="idle"
          variants={{
            idle: { boxShadow: '0 0 0 2px rgba(255,255,255,0.06) inset', borderRadius: 16 },
            hover: { boxShadow: '0 0 0 2px rgba(34,197,94,0.55) inset, 0 0 32px rgba(34,197,94,0.12)', borderRadius: 16 },
          }}
        >
          {/* Dashed border layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ borderRadius: 16 }}>
            <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="15" ry="15"
              fill="rgba(15,24,19,0.8)"
              stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" strokeDasharray="8 5"
            />
          </svg>

          {/* Swaying leaf */}
          <motion.div
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'bottom center', display: 'flex' }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C12 22 3 16 3 9a9 9 0 0 1 18 0c0 7-9 13-9 13Z"
                fill="rgba(34,197,94,0.15)" stroke="#22C55E" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 22V9" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          <div className="relative text-center">
            <p className="text-text-1 font-semibold text-base">Drop an image or click to upload</p>
            <p className="text-text-3 text-sm mt-1">Supports JPG, PNG, WebP — max 10 MB</p>
          </div>

          <motion.div
            className="relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          >
            <Camera size={15} /> Choose Photo
          </motion.div>

          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleFile(e.target.files[0])} />
        </motion.div>
      )}

      {activeTab === 'upload' && preview && (
        /* ── Preview with scan ── */
        <div className="card overflow-hidden">
          <div
            ref={imgContainerRef}
            className="relative bg-black flex items-center justify-center overflow-hidden"
            style={{ minHeight: 220 }}
          >
            <img src={preview} alt="Preview"
              className="max-h-72 max-w-full object-contain"
              style={{ display: 'block' }}
            />

            {/* GSAP scanning line — always in DOM when preview exists */}
            <div
              ref={scanRef}
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: 4,
                top: 0,
                background: 'linear-gradient(90deg, transparent, #22C55E, transparent)',
                boxShadow: '0 0 14px rgba(34,197,94,0.9)',
                opacity: loading ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />

            {/* Corner brackets */}
            <CornerBrackets active={loading} />

            {/* Dark overlay + label while scanning */}
            {loading && (
              <>
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-primary"
                    style={{ background: 'rgba(10,21,16,0.85)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    Analyzing…
                  </span>
                </div>
              </>
            )}

            <button className="absolute top-3 right-3 btn-icon" aria-label="Remove image and reset" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={reset}>
              <RotateCcw size={15} />
            </button>
          </div>

          {imageInfo && (
            <div className="px-4 pt-3 pb-1 flex items-center gap-3 text-xs text-text-3">
              <span className="font-medium text-text-2 truncate flex-1 min-w-0">{imageInfo.name}</span>
              <span className="shrink-0">{imageInfo.width}×{imageInfo.height}px</span>
              <span className="shrink-0">{imageInfo.size > 1024 * 1024 ? (imageInfo.size / (1024 * 1024)).toFixed(1) + ' MB' : (imageInfo.size / 1024).toFixed(0) + ' KB'}</span>
            </div>
          )}
          <div className="p-4 flex gap-3">
            <button className="btn-primary flex-1" onClick={detect} disabled={loading}>
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Analyzing…</>
                : <><Camera size={15} /> Detect Disease</>}
            </button>
            <button className="btn-secondary" onClick={() => inputRef.current?.click()}>
              <Upload size={15} /> Change
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => handleFile(e.target.files[0])} />
          </div>
        </div>
      )}

      {/* Error */}
      {activeTab === 'upload' && error && (
        <div className="card p-4 border-red-500/20 bg-red-500/5 flex items-start gap-3">
          <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-text-1 text-sm font-medium">Detection failed</p>
            <p className="text-text-3 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
      {activeTab === 'upload' && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`card p-5 border ${
            severity === 'healthy' ? 'border-primary/20 bg-primary/5' : 'border-amber-500/20 bg-amber-500/5'
          }`}
        >
          {/* Header row with confidence ring */}
          <div className="result-item flex items-start gap-4 mb-4">
            <div className="relative shrink-0">
              <ConfidenceRing
                pct={displayConf}
                color={severity === 'healthy' ? '#22C55E' : '#F59E0B'}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-1">
                {displayConf}%
              </span>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-display text-text-1 font-semibold text-lg leading-tight">
                {result.disease || 'Unknown'}
              </h3>
              {result.hindi_name && <p className="text-text-3 text-sm mt-0.5">{result.hindi_name}</p>}
              <span className={`badge mt-1.5 ${
                severity === 'healthy' ? 'badge-green' : 'badge-yellow'
              }`}>
                {severity === 'healthy'
                  ? <><CheckCircle2 size={10}/> Healthy</>
                  : <><AlertCircle size={10}/> Disease Detected</>}
              </span>
            </div>
            {/* Share Alert */}
            <button
              onClick={shareAlert}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
              aria-label="Copy disease alert to clipboard"
              title="Copy alert to clipboard"
            >
              <Share2 size={13} aria-hidden="true" /> Share Alert
            </button>
          </div>

          {result.description && (
            <p className="result-item text-text-2 text-sm mb-4 leading-relaxed">
              {result.description}
            </p>
          )}

          <div className="result-item grid sm:grid-cols-2 gap-4">
            {result.treatment && result.treatment.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-2">Treatment</p>
                <ul className="space-y-1.5">
                  {result.treatment.map((t, i) => (
                    <li key={i} className="text-text-2 text-sm flex gap-2">
                      <span className="text-primary mt-0.5">•</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.prevention && result.prevention.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-2">Prevention</p>
                <ul className="space-y-1.5">
                  {result.prevention.map((p, i) => (
                    <li key={i} className="text-text-2 text-sm flex gap-2">
                      <span className="text-blue-400 mt-0.5">•</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.top_3_predictions?.length > 1 && (
            <div className="result-item mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-2">Other Possibilities</p>
              <div className="space-y-2">
                {result.top_3_predictions.slice(1).map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-text-2 text-sm">{p.disease || p.pest}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.confidence}%`, background: 'rgba(139,92,246,0.5)' }} />
                      </div>
                      <span className="text-text-3 text-xs w-8 text-right">{p.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xl"
            role="status"
            aria-live="polite"
            style={{
              background: 'rgba(10,21,16,0.95)',
              border: '1px solid rgba(34,197,94,0.4)',
              color: '#22C55E',
              backdropFilter: 'blur(12px)',
              whiteSpace: 'nowrap',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-3">Tips for Better Results</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { t: 'Good Lighting', d: 'Natural daylight gives the best detection accuracy' },
            { t: 'Close-up Shot', d: 'Focus on the affected leaf or stem clearly' },
            { t: 'Clean Background', d: 'Avoid shadows and cluttered backgrounds' },
          ].map(({ t, d }) => (
            <div key={t} className="bg-surface-2 rounded p-3">
              <p className="text-text-1 text-sm font-medium mb-1">{t}</p>
              <p className="text-text-3 text-xs leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Detections ── */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-3 uppercase tracking-wide flex items-center gap-1.5">
            <History size={13} /> Recent Detections
          </p>
          <button
            onClick={() => navigate('/disease/history')}
            className="text-xs text-primary hover:underline font-medium"
          >
            View All
          </button>
        </div>

        {historyLoading ? (
          <div role="status" aria-live="polite" aria-label="Loading detection history" className="space-y-2">
            {[0, 1, 2].map(i => <SkeletonCard key={i} rows={1} />)}
          </div>
        ) : history.length === 0 ? (
          <p className="text-text-3 text-sm text-center py-4">No detections yet.</p>
        ) : (
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 400 }}>
            {history.map(item => {
              const id = item.detection_id || item.id
              const conf = Math.round((item.confidence ?? 0) * 100)
              const isHealthy = item.disease_name?.toLowerCase() === 'healthy'
              return (
                <div key={id} className="flex items-center gap-3 rounded-lg bg-surface-2 px-3 py-2">
                  {/* Thumbnail */}
                  {item.image_path || item.image_base64 ? (
                    <img
                      src={item.image_base64 ? `data:image/jpeg;base64,${item.image_base64}` : `/uploads/${item.image_path?.split('/').pop()}`}
                      alt={item.disease_name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0 border border-border"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-surface-3 flex items-center justify-center shrink-0 text-base">
                      🔬
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-text-1 text-sm font-medium truncate capitalize">
                      {item.disease_name?.replace(/_/g, ' ') || 'Unknown'}
                    </p>
                    <p className="text-text-3 text-xs">{formatDate(item.detected_at)}</p>
                  </div>

                  {/* Confidence badge */}
                  <span className={`badge shrink-0 ${isHealthy ? 'badge-green' : 'badge-yellow'}`}>
                    {conf}%
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => deleteHistoryItem(id)}
                    aria-label={`Delete detection: ${item.disease_name?.replace(/_/g, ' ') || 'Unknown'}`}
                    className="shrink-0 p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

```


## `frontend-src/src/pages/Expense.jsx`


```jsx
import { useState } from 'react'
import { Calculator, Loader2, TrendingUp, TrendingDown, BadgeIndianRupee, Minus, ChevronDown } from 'lucide-react'
import { expenseApi } from '../api/client'

const CROPS = ['Rice','Wheat','Maize','Cotton','Sugarcane','Soybean','Groundnut','Potato','Tomato','Onion']

function Field({ label, children, error, id }) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      {children}
      {error && <p id={id ? `${id}-err` : undefined} role="alert" className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Expense() {
  const [form, setForm] = useState({
    crop: 'Rice', area_acres: '1', seed_cost: '', fertilizer_cost: '', pesticide_cost: '',
    irrigation_cost: '', labor_cost: '', other_cost: '', expected_yield_kg: '', market_price: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const set = k => e => {
    const v = e.target.value
    setForm(f => ({ ...f, [k]: v }))
    setErrors(prev => { const next = { ...prev }; delete next[k]; return next })
  }
  const num = v => parseFloat(v) || 0

  function validate(form) {
    const errs = {}
    if (!form.area_acres || form.area_acres === '') errs.area_acres = 'This field is required'
    else { const v = parseFloat(form.area_acres); if (isNaN(v) || v < 0.1 || v > 10000) errs.area_acres = 'Must be between 0.1 and 10,000' }
    if (form.expected_yield_kg === '' || form.expected_yield_kg == null) errs.expected_yield_kg = 'This field is required'
    else { const v = parseFloat(form.expected_yield_kg); if (isNaN(v) || v < 0) errs.expected_yield_kg = 'Must be 0 or greater' }
    if (form.market_price === '' || form.market_price == null) errs.market_price = 'This field is required'
    else { const v = parseFloat(form.market_price); if (isNaN(v) || v < 0) errs.market_price = 'Must be 0 or greater' }
    return errs
  }

  async function calculate(e) {
    e.preventDefault(); setError(null); setResult(null)
    const vErrs = validate(form)
    if (Object.keys(vErrs).length > 0) { setErrors(vErrs); return }
    setLoading(true)
    const totalCost = ['seed_cost','fertilizer_cost','pesticide_cost','irrigation_cost','labor_cost','other_cost'].reduce((s, k) => s + num(form[k]), 0)
    const revenue = num(form.expected_yield_kg) * num(form.market_price) / 100 // market price in ₹/quintal typically
    const profit = revenue - totalCost
    const roi = totalCost > 0 ? ((profit / totalCost) * 100) : 0

    // Try backend, fallback to local calculation
    try {
      const res = await expenseApi.estimate({
        crop_name: form.crop, area_acres: num(form.area_acres),
        seed_cost: num(form.seed_cost), fertilizer_cost: num(form.fertilizer_cost),
        pesticide_cost: num(form.pesticide_cost), irrigation_cost: num(form.irrigation_cost),
        labor_cost: num(form.labor_cost), other_cost: num(form.other_cost),
        expected_yield_kg: num(form.expected_yield_kg), market_price_per_quintal: num(form.market_price)
      })
      setResult(res)
    } catch {
      // Local calculation fallback
      const marketRevenue = num(form.expected_yield_kg) * (num(form.market_price) / 100)
      setResult({
        total_cost: totalCost,
        total_revenue: marketRevenue,
        net_profit: marketRevenue - totalCost,
        roi: totalCost > 0 ? ((marketRevenue - totalCost) / totalCost * 100) : 0,
        cost_per_acre: num(form.area_acres) > 0 ? totalCost / num(form.area_acres) : totalCost,
        breakdown: [
          { label: 'Seed', cost: num(form.seed_cost) },
          { label: 'Fertilizer', cost: num(form.fertilizer_cost) },
          { label: 'Pesticide', cost: num(form.pesticide_cost) },
          { label: 'Irrigation', cost: num(form.irrigation_cost) },
          { label: 'Labor', cost: num(form.labor_cost) },
          { label: 'Other', cost: num(form.other_cost) },
        ].filter(b => b.cost > 0)
      })
    }
    setLoading(false)
  }

  const profit = result?.net_profit ?? 0
  const isProfit = profit >= 0

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Cost & Profit Calculator</h1>
        <p className="text-text-3 text-sm mt-0.5">Estimate your farming expenses and expected returns</p>
      </header>

      <form onSubmit={calculate} className="card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Crop" id="exp-crop">
            <select id="exp-crop" className="input w-full" value={form.crop} onChange={set('crop')}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Area (acres)" error={errors.area_acres} id="exp-area">
            <input id="exp-area" className={`input w-full ${errors.area_acres ? 'border-red-500' : ''}`} type="number" min="0.1" step="0.1" value={form.area_acres} onChange={set('area_acres')}
              aria-describedby={errors.area_acres ? 'exp-area-err' : undefined} />
          </Field>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-text-2 text-sm font-medium mb-3">Investment Costs (₹)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[['Seed', 'seed_cost'], ['Fertilizer', 'fertilizer_cost'], ['Pesticide', 'pesticide_cost'],
              ['Irrigation', 'irrigation_cost'], ['Labor', 'labor_cost'], ['Other', 'other_cost']].map(([label, key]) => (
              <Field key={key} label={label} id={`exp-${key}`}>
                <input id={`exp-${key}`} className="input w-full" type="number" min="0" placeholder="₹0" value={form[key]} onChange={set(key)} />
              </Field>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-text-2 text-sm font-medium mb-3">Expected Returns</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expected Yield (kg)" error={errors.expected_yield_kg} id="exp-yield">
              <input id="exp-yield" className={`input w-full ${errors.expected_yield_kg ? 'border-red-500' : ''}`} type="number" min="0" placeholder="e.g. 4000" value={form.expected_yield_kg} onChange={set('expected_yield_kg')}
                aria-describedby={errors.expected_yield_kg ? 'exp-yield-err' : undefined} />
            </Field>
            <Field label="Market Price (₹/quintal)" error={errors.market_price} id="exp-price">
              <input id="exp-price" className={`input w-full ${errors.market_price ? 'border-red-500' : ''}`} type="number" min="0" placeholder="e.g. 2500" value={form.market_price} onChange={set('market_price')}
                aria-describedby={errors.market_price ? 'exp-price-err' : undefined} />
            </Field>
          </div>
        </div>

        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading || Object.keys(errors).length > 0}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Calculating…</> : <><Calculator size={15} /> Calculate</>}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Cost', value: `₹${(result.total_cost || 0).toLocaleString()}`, color: 'text-red-400' },
              { label: 'Revenue', value: `₹${(result.total_revenue || 0).toLocaleString()}`, color: 'text-blue-400' },
              { label: 'Net Profit', value: `₹${Math.abs(profit).toLocaleString()}`, color: isProfit ? 'text-primary' : 'text-red-400' },
              { label: 'ROI', value: `${(result.roi || 0).toFixed(1)}%`, color: (result.roi || 0) >= 0 ? 'text-primary' : 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-text-3 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Profit indicator */}
          <div className={`card p-4 flex items-center gap-3 ${isProfit ? 'border-primary/30 bg-primary/5' : 'border-red-500/30 bg-red-500/5'}`}>
            {isProfit ? <TrendingUp size={18} className="text-primary" /> : <TrendingDown size={18} className="text-red-400" />}
            <div>
              <p className={`font-semibold ${isProfit ? 'text-primary' : 'text-red-400'}`}>
                {isProfit ? `Profitable: ₹${profit.toLocaleString()} expected profit` : `Loss: ₹${Math.abs(profit).toLocaleString()} expected loss`}
              </p>
              {result.cost_per_acre != null && (
                <p className="text-text-3 text-sm">₹{result.cost_per_acre.toLocaleString()} cost per acre</p>
              )}
            </div>
          </div>

          {/* Cost breakdown */}
          {result.breakdown?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-text-1 font-semibold mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                {result.breakdown.map((b, i) => {
                  const pct = result.total_cost > 0 ? (b.cost / result.total_cost * 100) : 0
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-2">{b.label}</span>
                        <span className="text-text-1 font-medium">₹{b.cost.toLocaleString()} <span className="text-text-3 font-normal">({pct.toFixed(0)}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-surface-2 rounded-full">
                        <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/Fertilizer.jsx`


```jsx
import { useState } from 'react'
import { Beaker, Loader2, ChevronDown, Leaf, AlertCircle, CheckCircle2 } from 'lucide-react'
import { fertilizerApi } from '../api/client'

const CROPS = ['Rice','Wheat','Maize','Cotton','Sugarcane','Soybean','Groundnut','Potato','Tomato','Onion','Chickpea','Bajra','Jowar','Mustard','Banana']
const SOIL_TYPES = ['Alluvial','Black (Regur)','Red','Laterite','Desert','Loamy','Sandy','Clay']
const GROWTH_STAGES = ['Pre-sowing','Germination (0–14 days)','Vegetative (15–45 days)','Flowering (45–70 days)','Fruiting / Grain fill','Pre-harvest']

function NutrientBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-text-2">{label}</span>
        <span className="text-text-1 font-semibold">{value} kg/ha</span>
      </div>
      <div className="h-2 bg-surface-2 rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Fertilizer() {
  const [form, setForm] = useState({
    crop: 'Rice', soil_type: 'Alluvial', growth_stage: 'Vegetative (15–45 days)',
    area_acres: '1', soil_ph: '6.5', nitrogen: '', phosphorus: '', potassium: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const set = k => e => {
    const v = e.target.value
    setForm(f => ({ ...f, [k]: v }))
    setErrors(prev => { const next = { ...prev }; delete next[k]; return next })
  }

  function validate(form) {
    const errs = {}
    if (!form.area_acres || form.area_acres === '') errs.area_acres = 'This field is required'
    else { const v = parseFloat(form.area_acres); if (isNaN(v) || v < 0.1 || v > 10000) errs.area_acres = 'Must be between 0.1 and 10,000' }
    if (form.soil_ph !== '' && form.soil_ph != null) {
      const v = parseFloat(form.soil_ph); if (isNaN(v) || v < 0 || v > 14) errs.soil_ph = 'pH must be between 0 and 14'
    }
    for (const key of ['nitrogen', 'phosphorus', 'potassium']) {
      if (form[key] === '' || form[key] == null) { errs[key] = 'This field is required'; continue }
      const v = parseFloat(form[key]); if (isNaN(v)) { errs[key] = 'Enter a valid number'; continue }
      if (v < 0 || v > 500) errs[key] = 'Must be between 0 and 500'
    }
    return errs
  }

  async function recommend(e) {
    e.preventDefault(); setError(null); setResult(null)
    const vErrs = validate(form)
    if (Object.keys(vErrs).length > 0) { setErrors(vErrs); return }
    setLoading(true)
    const n = parseFloat(form.nitrogen)
    const p = parseFloat(form.phosphorus)
    const k = parseFloat(form.potassium)
    try {
      const soil = { nitrogen: n, phosphorus: p, potassium: k, ph: parseFloat(form.soil_ph) || 7.0 }
      const res = await fertilizerApi.recommend(form.crop, soil)
      setResult(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Fertilizer Advisor</h1>
        <p className="text-text-3 text-sm mt-0.5">Get customized nutrient recommendations for your crop</p>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #0a1f10 0%, #09100E 100%)' }}>
        <div className="absolute right-4 top-0 bottom-0 flex items-center text-6xl opacity-15 select-none">🌱</div>
        <div className="relative px-5 py-4 flex items-center gap-4">
          <div className="text-4xl">🧪</div>
          <div>
            <p className="text-primary font-semibold text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Precision Nutrition</p>
            <p className="text-text-3 text-xs mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Enter your soil NPK values from a soil test kit for best results</p>
          </div>
          <div className="ml-auto hidden sm:flex gap-4 text-center">
            {[['N', 'Nitrogen'], ['P', 'Phosphorus'], ['K', 'Potassium']].map(([e, l]) => (
              <div key={l} className="bg-white/5 px-3 py-1.5 rounded-lg text-center">
                <p className="text-primary font-bold text-lg leading-tight">{e}</p>
                <p className="text-text-3 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={recommend} className="card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="fert-crop">Crop</label>
            <select id="fert-crop" className="input w-full" value={form.crop} onChange={set('crop')}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="fert-soil-type">Soil Type</label>
            <select id="fert-soil-type" className="input w-full" value={form.soil_type} onChange={set('soil_type')}>
              {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="fert-growth-stage">Growth Stage</label>
            <select id="fert-growth-stage" className="input w-full" value={form.growth_stage} onChange={set('growth_stage')}>
              {GROWTH_STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="fert-area">Area (acres)</label>
            <input id="fert-area" className={`input w-full ${errors.area_acres ? 'border-red-500' : ''}`} type="number" min="0.1" step="0.1" value={form.area_acres} onChange={set('area_acres')}
              aria-describedby={errors.area_acres ? 'fert-area-err' : undefined} />
            {errors.area_acres && <p id="fert-area-err" role="alert" className="text-red-400 text-xs mt-1">{errors.area_acres}</p>}
          </div>
          <div>
            <label className="label" htmlFor="fert-ph">Soil pH <span className="text-text-3">(optional)</span></label>
            <input id="fert-ph" className={`input w-full ${errors.soil_ph ? 'border-red-500' : ''}`} type="number" step="0.1" min="0" max="14" placeholder="e.g. 6.5" value={form.soil_ph} onChange={set('soil_ph')}
              aria-describedby={errors.soil_ph ? 'fert-ph-err' : undefined} />
            {errors.soil_ph && <p id="fert-ph-err" role="alert" className="text-red-400 text-xs mt-1">{errors.soil_ph}</p>}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-text-2 text-sm font-medium mb-3">Current Soil NPK Levels <span className="text-red-400 text-xs">* required</span></p>
          <div className="grid grid-cols-3 gap-3">
            {[['N – Nitrogen', 'nitrogen', '0–200'], ['P – Phosphorus', 'phosphorus', '0–150'], ['K – Potassium', 'potassium', '0–300']].map(([label, key, hint]) => (
              <div key={key}>
                <label className="label text-xs" htmlFor={`fert-${key}`}>{label}</label>
                <input id={`fert-${key}`} className={`input w-full ${errors[key] ? 'border-red-500' : ''}`} type="number" min="0" placeholder={`kg/ha ${hint}`} value={form[key]} onChange={set(key)}
                  aria-describedby={errors[key] ? `fert-${key}-err` : undefined} />
                {errors[key] && <p id={`fert-${key}-err`} role="alert" className="text-red-400 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}
          </div>
          <p className="text-text-3 text-xs mt-2">Tip: Get NPK values from a soil test kit or your local agriculture office.</p>
        </div>

        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading || Object.keys(errors).length > 0}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Calculating…</> : <><Beaker size={15} /> Get Recommendation</>}
        </button>
      </form>

      {result && (
        <div className="card p-5 space-y-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-primary" />
            <h3 className="font-display text-text-1 font-semibold">Fertilizer Recommendations for {form.crop}</h3>
          </div>

          {result.npk && (
            <div className="space-y-3">
              <p className="text-text-2 text-xs uppercase tracking-wide font-medium">Recommended NPK (kg/ha)</p>
              <NutrientBar label="Nitrogen (N)" value={result.npk.n ?? 0} max={200} color="bg-emerald-400" />
              <NutrientBar label="Phosphorus (P)" value={result.npk.p ?? 0} max={150} color="bg-blue-400" />
              <NutrientBar label="Potassium (K)" value={result.npk.k ?? 0} max={150} color="bg-amber-400" />
            </div>
          )}

          {result.fertilizers?.length > 0 && (
            <div>
              <p className="text-text-2 text-xs uppercase tracking-wide font-medium mb-3">Recommended Fertilizers</p>
              <div className="space-y-2">
                {result.fertilizers.map((f, i) => (
                  <div key={i} className="flex items-start justify-between p-3 bg-surface-2 rounded-lg">
                    <div>
                      <p className="text-text-1 text-sm font-medium">{f.name}</p>
                      <p className="text-text-3 text-xs">{f.method || 'Broadcast application'}</p>
                    </div>
                    <span className="text-primary font-semibold text-sm">{f.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.notes && (
            <div className="flex items-start gap-2 p-3 bg-amber-400/5 border border-amber-400/20 rounded-lg">
              <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-text-2 text-sm">{result.notes}</p>
            </div>
          )}

          {(() => {
            const area = parseFloat(form.area_acres) || 1
            const nQty = +(((result.npk?.n ?? 0) * area)).toFixed(1)
            const pQty = +(((result.npk?.p ?? 0) * area)).toFixed(1)
            const kQty = +(((result.npk?.k ?? 0) * area)).toFixed(1)
            const RATES = { n: 18, p: 24, k: 15 }
            const breakdown = [
              { label: 'Nitrogen (N)',    qty: nQty, rate: RATES.n, sub: +(nQty * RATES.n).toFixed(0) },
              { label: 'Phosphorus (P)', qty: pQty, rate: RATES.p, sub: +(pQty * RATES.p).toFixed(0) },
              { label: 'Potassium (K)',  qty: kQty, rate: RATES.k, sub: +(kQty * RATES.k).toFixed(0) },
            ]
            const calcTotal = breakdown.reduce((s, r) => s + r.sub, 0)
            const total = (result.total_cost_estimate && result.total_cost_estimate > 0)
              ? result.total_cost_estimate
              : calcTotal
            return (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-surface-2">
                  <p className="text-text-2 text-sm font-semibold">Estimated Input Cost</p>
                  <p className="text-primary font-bold text-lg">₹{total.toLocaleString('en-IN')}</p>
                </div>
                <div className="px-4 py-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-text-3 border-b border-border">
                        <th className="text-left pb-1.5 font-medium">Nutrient</th>
                        <th className="text-right pb-1.5 font-medium">Qty (kg)</th>
                        <th className="text-right pb-1.5 font-medium">Rate (₹/kg)</th>
                        <th className="text-right pb-1.5 font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {breakdown.map(row => (
                        <tr key={row.label} className="text-text-2">
                          <td className="py-1.5">{row.label}</td>
                          <td className="py-1.5 text-right">{row.qty}</td>
                          <td className="py-1.5 text-right">₹{row.rate}</td>
                          <td className="py-1.5 text-right font-medium">₹{row.sub.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-text-3 text-[11px] mt-2.5 italic">
                    * Prices are indicative. Actual prices may vary by region.
                  </p>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/Home.jsx`


```jsx
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

```


## `frontend-src/src/pages/Login.jsx`


```jsx
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { User, Lock, Phone, KeyRound, Eye, EyeOff, Loader2, CheckCircle2, Wheat, ShieldCheck } from 'lucide-react'
import { authApi } from '../api/client'
import { useApp } from '../contexts/AppContext'

const STATES = [
  'Maharashtra','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan',
  'Gujarat','Karnataka','Andhra Pradesh','Telangana','Bihar','West Bengal',
  'Tamil Nadu','Odisha','other'
]

export default function Login() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  // Already logged in → straight to home
  if (state.authToken && state.farmer) return <Navigate to="/" replace />

  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', phone: '', username: '', password: '', district: '', state: '', language: 'hi' })
  const [otpPhone, setOtpPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [demoOtp, setDemoOtp] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleAuth(res) {
    dispatch({ type: 'SET_TOKEN', payload: res.access_token || res.token })
    dispatch({ type: 'SET_FARMER', payload: res.farmer || res.user })
    navigate('/', { replace: true })
  }

  async function submitLogin(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try { handleAuth(await authApi.login(form.username, form.password)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function submitRegister(e) {
    e.preventDefault(); setLoading(true); setError(null)
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
    try {
      handleAuth(await authApi.register({
        name: form.name, phone: form.phone, username: form.username,
        password: form.password, state: form.state, district: form.district,
        language: form.language,
      }))
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function requestOtp(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.requestOtp(otpPhone)
      setOtpSent(true)
      if (res.demo_otp) setDemoOtp(res.demo_otp)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function verifyOtp(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try { handleAuth(await authApi.verifyOtp(otpPhone, otp)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-10">
      {/* Brand header */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3">🌾</div>
        <h1 className="font-display text-2xl font-bold text-text-1">AgriSahayak</h1>
        <p className="text-text-3 text-sm mt-1">AI-Powered Smart Farming Assistant</p>
        <div className="flex justify-center gap-2 mt-3">
          {[['🌱','Free'], ['🤖','AI Powered'], ['📱','Multi-language']].map(([e, l]) => (
            <span key={l} className="text-xs bg-surface-2 text-text-3 px-2.5 py-1 rounded-full border border-border">{e} {l}</span>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="card p-6 w-full max-w-md">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-surface-2 p-1 rounded-lg mb-5" role="tablist" aria-label="Login method">
          {[['login','Sign In'], ['register','Register'], ['otp','OTP Login']].map(([t, l]) => (
            <button key={t} role="tab" aria-selected={tab === t} aria-controls={`tab-panel-${t}`} id={`tab-btn-${t}`}
              onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${tab === t ? 'bg-primary text-black' : 'text-text-3 hover:text-text-2'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* ── Sign In ── */}
        {tab === 'login' && (
          <form id="tab-panel-login" role="tabpanel" aria-labelledby="tab-btn-login" onSubmit={submitLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-username">Username</label>
              <div className="relative">
                <User size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input id="login-username" className="input w-full pl-9" required value={form.username} onChange={set('username')}
                  placeholder="Your username" autoComplete="username" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input id="login-password" className="input w-full pl-9 pr-10" required type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={set('password')} placeholder="Password" autoComplete="current-password"
                  aria-describedby={error ? 'login-error' : undefined} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                </button>
              </div>
            </div>
            {error && <p id="login-error" role="alert" className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><ShieldCheck size={15} /> Sign In</>}
            </button>
          </form>
        )}

        {/* ── Register ── */}
        {tab === 'register' && (
          <form id="tab-panel-register" role="tabpanel" aria-labelledby="tab-btn-register" onSubmit={submitRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="reg-name">Full Name</label>
                <input id="reg-name" className="input w-full" required value={form.name} onChange={set('name')} placeholder="Your full name" />
              </div>
              <div>
                <label className="label" htmlFor="reg-phone">Mobile Number</label>
                <input id="reg-phone" className="input w-full" required type="tel" pattern="[6-9][0-9]{9}"
                  value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="reg-username">Username</label>
              <div className="relative">
                <User size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input id="reg-username" className="input w-full pl-9" required minLength={4} value={form.username}
                  onChange={set('username')} placeholder="Choose a username (min 4 chars)" autoComplete="username" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input id="reg-password" className="input w-full pl-9 pr-10" required type={showPw ? 'text' : 'password'}
                  minLength={6} value={form.password} onChange={set('password')}
                  placeholder="Min 6 characters" autoComplete="new-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="reg-district">District</label>
                <input id="reg-district" className="input w-full" required value={form.district} onChange={set('district')} placeholder="Your district" />
              </div>
              <div>
                <label className="label" htmlFor="reg-state">State</label>
                <select id="reg-state" className="input w-full" required value={form.state} onChange={set('state')}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="reg-language">Preferred Language</label>
              <select id="reg-language" className="input w-full" value={form.language} onChange={set('language')}>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
            {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><Wheat size={15} /> Create Account</>}
            </button>
          </form>
        )}

        {/* ── OTP Login ── */}
        {tab === 'otp' && (
          <div id="tab-panel-otp" role="tabpanel" aria-labelledby="tab-btn-otp" className="space-y-4">
            {!otpSent ? (
              <form onSubmit={requestOtp} className="space-y-4">
                <div>
                  <label className="label" htmlFor="otp-phone">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                    <input id="otp-phone" className="input w-full pl-9" required type="tel" pattern="[6-9][0-9]{9}"
                      value={otpPhone} onChange={e => setOtpPhone(e.target.value)} placeholder="10-digit mobile number" />
                  </div>
                </div>
                {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <><Phone size={15} /> Send OTP</>}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                  <p className="text-text-2 text-sm">OTP sent to ****{otpPhone.slice(-4)}</p>
                  {demoOtp && <p className="text-primary font-bold text-lg mt-1">Demo OTP: {demoOtp}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="otp-code">Enter OTP</label>
                  <div className="relative">
                    <KeyRound size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                    <input id="otp-code" className="input w-full pl-9 text-center text-xl tracking-widest" required
                      type="text" maxLength={6} value={otp} aria-label="Enter 6-digit OTP"
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000" autoFocus />
                  </div>
                </div>
                {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <button type="button" className="btn-secondary flex-1"
                    onClick={() => { setOtpSent(false); setOtp(''); setDemoOtp(null); setError(null) }}>
                    Change Number
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading || otp.length < 4}>
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <><CheckCircle2 size={15} /> Verify</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

```


## `frontend-src/src/pages/LogisticsOptimizer.jsx`


```jsx
import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, Loader2, MapPinned, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

const CROP_ICON = {
  Tomato: '🍅',
  Onion: '🧅',
  Wheat: '🌾',
  Grapes: '🍇',
  Rice: '🌾',
  Cotton: '🌿',
}

function rupees(value) {
  return `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}`
}

export default function LogisticsOptimizer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [runAtMs, setRunAtMs] = useState(null)
  const [clockMs, setClockMs] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setClockMs(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])

  const elapsedHours = useMemo(() => {
    if (!runAtMs) return 0
    return (clockMs - runAtMs) / (1000 * 60 * 60)
  }, [clockMs, runAtMs])

  const routeData = result?.optimal_route || {}
  const routeNodes = routeData?.route || []
  const targetMandi = routeData?.target_mandi?.name || 'Target Mandi'
  const comparison = result?.all_mandi_comparison || []

  async function runDemoScenario() {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch('/api/v1/logistics/demo-scenario')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setResult(data)
      setRunAtMs(Date.now())
    } catch (e) {
      setError(e?.message || 'Failed to run demo scenario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="badge"
            style={{ background: 'rgba(167,139,250,0.16)', color: '#C4B5FD', border: '1px solid rgba(167,139,250,0.25)' }}
          >
            🔮 Quantum Algorithm
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-text-1">Quantum Fleet Optimizer</h1>
        <p className="text-text-3 text-sm mt-0.5">Simulated quantum annealing for harvest logistics</p>
      </header>

      <div className="card p-5">
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={runDemoScenario}
          disabled={loading}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Truck size={15} />}
          {loading ? 'Running simulation…' : '🚛 Run Demo: 10 Farms, 3 Mandis'}
        </button>
        {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid xl:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-text-1 font-semibold mb-3">Farm Pickup Queue</p>
              <div className="space-y-2.5">
                {routeNodes.map((farm) => {
                  const hoursLeft = Math.max(0, (farm.spoilage_hours ?? 72) - elapsedHours)
                  const urgencyClass = hoursLeft < 24 ? 'text-red-300' : hoursLeft < 48 ? 'text-amber-300' : 'text-emerald-300'
                  return (
                    <div key={farm.farm_id} className="rounded-lg p-3 bg-surface-2 border border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-text-1 text-sm font-medium truncate">
                            {(CROP_ICON[farm.crop] || '🌱')} {farm.farm_name}
                          </p>
                          <p className="text-text-3 text-xs mt-0.5">{farm.crop} · {Math.round(farm.qty_kg)} kg</p>
                        </div>
                        <p className={`text-xs font-semibold ${urgencyClass}`}>
                          {hoursLeft.toFixed(1)}h left
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card p-5">
              <p className="text-text-1 font-semibold mb-3">Optimal Route Plan</p>
              <div className="space-y-2">
                <div className="rounded-lg p-3 border border-emerald-500/30 bg-emerald-500/8">
                  <p className="text-emerald-300 text-sm font-medium flex items-center gap-2">
                    <MapPinned size={14} />
                    Start: {targetMandi}
                  </p>
                </div>
                {routeNodes.map((farm, idx) => (
                  <div key={`${farm.farm_id}-${idx}`} className="space-y-1">
                    <div className="flex justify-center">
                      <ArrowDown size={14} className="text-text-3" />
                    </div>
                    <div className="rounded-lg p-3 border border-border bg-surface-2">
                      <p className="text-text-2 text-sm">
                        {idx + 1}. {farm.farm_name} ({farm.crop})
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <ArrowDown size={14} className="text-text-3" />
                </div>
                <div className="rounded-lg p-3 border border-blue-500/30 bg-blue-500/8">
                  <p className="text-blue-300 text-sm font-medium">Return: {targetMandi}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-text-1 font-semibold mb-3">Financial Summary</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-3">Total distance</span>
                  <span className="text-text-1 font-medium">{routeData.total_km || 0} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-3">Fuel cost</span>
                  <span className="text-red-300 font-medium">{rupees(routeData.fuel_cost_inr)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-3">Revenue</span>
                  <span className="text-blue-300 font-medium">{rupees(routeData.total_revenue_inr)}</span>
                </div>
              </div>
              <div className="my-3 border-t border-border" />
              <p className="text-text-3 text-xs uppercase tracking-wide">Net Profit</p>
              <p className="text-3xl font-bold text-emerald-300 mt-1">{rupees(routeData.net_profit_inr)}</p>
              <p className="text-text-3 text-[11px] mt-3">
                Quantum iterations: {(routeData.annealing_iterations || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="card p-5">
            <p className="text-text-1 font-semibold mb-3">Mandi Comparison (Ranked by Net Profit)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-3 text-xs">
                    <th className="text-left font-medium py-2">Mandi</th>
                    <th className="text-right font-medium py-2">Net Profit</th>
                    <th className="text-right font-medium py-2">Distance</th>
                    <th className="text-right font-medium py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, idx) => (
                    <tr
                      key={`${row.mandi}-${idx}`}
                      className="border-t border-border"
                      style={idx === 0 ? { background: 'rgba(217,119,6,0.12)' } : undefined}
                    >
                      <td className="py-2.5 text-text-2">
                        {idx === 0 ? '🏆 ' : ''}{row.mandi}
                      </td>
                      <td className={`py-2.5 text-right font-semibold ${idx === 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                        {rupees(row.net_profit_inr)}
                      </td>
                      <td className="py-2.5 text-right text-text-3">{row.total_km} km</td>
                      <td className="py-2.5 text-right text-text-2">{rupees(row.total_revenue_inr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result?.pitch && (
            <div className="card p-5" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.22)' }}>
              <p className="text-text-2 text-sm">{result.pitch}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/Market.jsx`


```jsx
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
  const [navMaxDist, setNavMaxDist] = useState(50)
  const [results,    setResults]    = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [userState,  setUserState]  = useState(farmerState)
  const [gpsLabel,   setGpsLabel]   = useState(null)
  const [gpsCoords,  setGpsCoords]  = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)

  // Try to get GPS on mount for better state detection
  useEffect(() => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        setGpsCoords({ lat: latitude, lng: longitude })
        setGpsLoading(false)
        // Reverse geocode to show label
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const d = await r.json()
          const addr = d.address || {}
          const place = addr.village || addr.town || addr.city || addr.county || ''
          const state = addr.state || ''
          setGpsLabel(state ? `${place}, ${state}` : place)
          if (state) setUserState(state)
        } catch { /* ignore */ }
      },
      () => setGpsLoading(false),
      { timeout: 6000, enableHighAccuracy: false, maximumAge: 60000 }
    )
  }, [])

  async function findMandis(e) {
    e.preventDefault()
    setLoading(true); setError(null); setResults(null)
    try {
      let rows = []
      // Use gpsCoords state if available, else fall back to farmerState text
      const stateParam = userState || farmerState
      try {
        const params = new URLSearchParams({
          crop: navCrop,
          state: stateParam,
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
        const d = await marketApi.getPrices(navCrop, stateParam)
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
      {/* GPS location banner */}
      {(gpsLoading || gpsLabel) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#86efac' }}>
          {gpsLoading
            ? <><span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />Detecting your location…</>
            : <><span className="w-2 h-2 rounded-full bg-primary shrink-0" />📍 Using your GPS location: {gpsLabel}</>}
        </div>
      )}
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

      {/* Gemini AI Market Advisory */}
      {data?.advisory && (() => {
        // Strip any residual markdown from advisory text
        const cleanAdvisory = data.advisory
          .replace(/\*{1,3}([^*\n]+?)\*{1,3}/g, '$1')
          .replace(/_{1,2}([^_\n]+?)_{1,2}/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/^[\-\*]\s+/gm, '• ')
          .replace(/`([^`]+)`/g, '$1')
          .trim()
        return (
          <div className="card p-4" style={{ borderLeft: '3px solid #22C55E' }}>
            <p className="text-text-3 text-[10px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span>✨</span> AI Market Advisory
            </p>
            <p className="text-text-2 text-sm leading-relaxed whitespace-pre-line">{cleanAdvisory}</p>
          </div>
        )
      })()}

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



```


## `frontend-src/src/pages/OutbreakMap.jsx`


```jsx
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

```


## `frontend-src/src/pages/Pest.jsx`


```jsx
import { useState, useRef } from 'react'
import { Upload, Bug, Loader2, AlertCircle, CheckCircle2, RotateCcw, Camera } from 'lucide-react'
import { pestApi } from '../api/client'

// ── Image validation helpers ────────────────────────────
function getImageDimensions(file) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.src = URL.createObjectURL(file)
  })
}

function compressImage(file, quality) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      canvas.toBlob(blob => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality)
    }
    img.src = URL.createObjectURL(file)
  })
}

export default function Pest() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)
  const inputRef = useRef()

  async function validateAndProcessImage(f) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, and WebP images are supported'); return null
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB'); return null
    }
    const dims = await getImageDimensions(f)
    if (dims.width < 224 || dims.height < 224) {
      setError('Image must be at least 224×224 pixels for accurate detection'); return null
    }
    if (f.size > 5 * 1024 * 1024) return await compressImage(f, 0.8)
    return f
  }

  async function handleFile(f) {
    if (!f) return
    setResult(null); setError(null); setImageInfo(null)
    const validated = await validateAndProcessImage(f)
    if (!validated) return
    const dims = await getImageDimensions(validated)
    setImageInfo({ width: dims.width, height: dims.height, size: validated.size, name: validated.name })
    setFile(validated)
    setPreview(URL.createObjectURL(validated))
  }

  async function detect() {
    if (!file) return
    setLoading(true); setError(null)
    try {
      const fd = new FormData(); fd.append('file', file)
      const data = await pestApi.detect(fd)
      const topPred = data.top_prediction || {}
      setResult({
        pest: topPred.pest_name,
        hindi_name: topPred.hindi_name,
        confidence: Math.round((topPred.confidence || 0) * 100),
        description: topPred.description,
        treatment: topPred.treatment || [],
        prevention: topPred.prevention || [],
        immediate_action: topPred.immediate_action,
        is_pest: true,
        top_3_predictions: data.top_3_predictions || [],
      })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Pest Detection</h1>
        <p className="text-text-3 text-sm mt-0.5">Identify crop pests from photos using deep learning</p>
      </header>

      {!preview ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a pest image — click or drag and drop"
          className="card border-2 border-dashed border-border-strong p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-primary hover:bg-primary-dim transition-all duration-200"
          onClick={() => inputRef.current?.click()}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        >
          <div className="w-16 h-16 rounded-xl bg-surface-2 flex items-center justify-center">
            <Bug size={28} className="text-text-3" />
          </div>
          <div className="text-center">
            <p className="text-text-1 font-medium">Upload a pest image</p>
            <p className="text-text-3 text-sm mt-1">JPG, PNG, WebP — max 10 MB</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="relative bg-black flex items-center justify-center max-h-72">
            <img src={preview} alt="Preview" className="max-h-72 max-w-full object-contain" />
            <button className="absolute top-3 right-3 btn-icon bg-black/60" aria-label="Remove image and reset" onClick={() => { setFile(null); setPreview(null); setResult(null); setImageInfo(null) }}>
              <RotateCcw size={15} />
            </button>
          </div>
          {imageInfo && (
            <div className="px-4 pt-3 pb-1 flex items-center gap-3 text-xs text-text-3">
              <span className="font-medium text-text-2 truncate flex-1 min-w-0">{imageInfo.name}</span>
              <span className="shrink-0">{imageInfo.width}×{imageInfo.height}px</span>
              <span className="shrink-0">{imageInfo.size > 1024 * 1024 ? (imageInfo.size / (1024 * 1024)).toFixed(1) + ' MB' : (imageInfo.size / 1024).toFixed(0) + ' KB'}</span>
            </div>
          )}
          <div className="p-4 flex gap-3">
            <button className="btn-primary flex-1" aria-label={loading ? 'Identifying pest…' : 'Identify pest in image'} onClick={detect} disabled={loading}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Identifying…</> : <><Bug size={15} /> Identify Pest</>}
            </button>
            <button className="btn-secondary" aria-label="Choose a different image" onClick={() => inputRef.current?.click()}><Camera size={15} aria-hidden="true" /></button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        </div>
      )}

      {error && (
        <div className="card p-4 border-red-500/20 bg-red-500/5 flex items-start gap-3">
          <AlertCircle size={17} className="text-red-400 shrink-0" />
          <p className="text-text-2 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="card p-5">
          <div className="flex items-start gap-3 mb-4">
            {result.is_pest ? <AlertCircle size={22} className="text-amber-400 shrink-0" /> : <CheckCircle2 size={22} className="text-primary shrink-0" />}
            <div>
              <h3 className="font-display text-text-1 font-semibold text-lg capitalize">{result.pest || 'Unknown'}</h3>
              {result.hindi_name && <p className="text-text-3 text-sm">{result.hindi_name}</p>}
            </div>
            {result.confidence != null && (
              <span className="badge badge-yellow ml-auto">{Math.round(result.confidence)}% confident</span>
            )}
          </div>

          {result.description && <p className="text-text-2 text-sm mb-4 leading-relaxed">{result.description}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            {result.treatment?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-2">Treatment</p>
                <ul className="space-y-1.5">
                  {result.treatment.map((t, i) => (
                    <li key={i} className="text-text-2 text-sm flex gap-2"><span className="text-primary">•</span>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.prevention?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-2">Prevention</p>
                <ul className="space-y-1.5">
                  {result.prevention.map((p, i) => (
                    <li key={i} className="text-text-2 text-sm flex gap-2"><span className="text-blue-400">•</span>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/Profile.jsx`


```jsx
import { useState, useEffect, useRef } from 'react'
import { User, MapPin, Plus, LogOut, Eye, EyeOff, Loader2, CheckCircle2, X, Phone, Lock, KeyRound, Wheat, ShieldCheck, MoreVertical, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { authApi, farmerApi } from '../api/client'
import { useApp } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'

// ── Hero banner ────────────────────────────────────────
function AuthHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6"
      style={{ background: 'linear-gradient(135deg, #0f2e1a 0%, #0d1f11 50%, #091408 100%)' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 50%, #16a34a 0%, transparent 50%)' }} />
      <div className="relative px-6 py-8 flex items-center gap-5">
        <div className="text-5xl">🌾</div>
        <div>
          <h2 className="font-display text-text-1 text-xl font-bold">Welcome to AgriSahayak</h2>
          <p className="text-text-3 text-sm mt-1">Your AI-powered farming assistant</p>
          <div className="flex gap-3 mt-3">
            {[['🌱','Free'], ['🤖','AI Powered'], ['📱','Multi-language']].map(([e,l]) => (
              <span key={l} className="text-xs bg-white/10 text-text-2 px-2 py-0.5 rounded-full">{e} {l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthForms({ onSuccess }) {
  const [tab, setTab] = useState('login')       // login | register | otp
  const [authMode, setAuthMode] = useState('pw') // pw | otp (for login)
  const [form, setForm] = useState({ name: '', phone: '', username: '', password: '', district: '', state: '', language: 'hi' })
  const [otpPhone, setOtpPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [demoOtp, setDemoOtp] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submitLogin(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.login(form.username, form.password)
      onSuccess(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function submitRegister(e) {
    e.preventDefault(); setLoading(true); setError(null)
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
    try {
      const res = await authApi.register({
        name: form.name, phone: form.phone, username: form.username,
        password: form.password, state: form.state, district: form.district,
        language: form.language,
      })
      onSuccess(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function requestOtp(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.requestOtp(otpPhone)
      setOtpSent(true)
      if (res.demo_otp) setDemoOtp(res.demo_otp)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function verifyOtp(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.verifyOtp(otpPhone, otp)
      onSuccess(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const STATES = ['Maharashtra','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','Karnataka','Andhra Pradesh','Telangana','Bihar','West Bengal','Tamil Nadu','Odisha','other']

  return (
    <div className="max-w-md mx-auto">
      <AuthHero />
      <div className="card p-6">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-surface-2 p-1 rounded-lg mb-5">
          {[['login','Sign In'],['register','Register'],['otp','OTP Login']].map(([t, l]) => (
            <button key={t} onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${tab === t ? 'bg-primary text-black' : 'text-text-3 hover:text-text-2'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Login with username/password */}
        {tab === 'login' && (
          <form onSubmit={submitLogin} className="space-y-4">
            <div>
              <label htmlFor="prof-login-username" className="label">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                <input id="prof-login-username" className="input w-full pl-9" required value={form.username} onChange={set('username')} placeholder="Your username" autoComplete="username" />
              </div>
            </div>
            <div>
              <label htmlFor="prof-login-password" className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                <input id="prof-login-password" className="input w-full pl-9 pr-10" required type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Password" autoComplete="current-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><ShieldCheck size={15}/> Sign In</>}
            </button>
          </form>
        )}

        {/* Register */}
        {tab === 'register' && (
          <form onSubmit={submitRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                <input className="input w-full" required value={form.name} onChange={set('name')} placeholder="Your full name" />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input className="input w-full" required type="tel" pattern="[6-9][0-9]{9}" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" />
              </div>
            </div>
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input className="input w-full pl-9" required minLength={4} value={form.username} onChange={set('username')} placeholder="Choose a username (min 4 chars)" autoComplete="username" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input className="input w-full pl-9 pr-10" required type={showPw ? 'text' : 'password'} minLength={6} value={form.password} onChange={set('password')} placeholder="Min 6 characters" autoComplete="new-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">District</label>
                <input className="input w-full" required value={form.district} onChange={set('district')} placeholder="Your district" />
              </div>
              <div>
                <label className="label">State</label>
                <select className="input w-full" required value={form.state} onChange={set('state')}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Preferred Language</label>
              <select className="input w-full" value={form.language} onChange={set('language')}>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><Wheat size={15}/> Create Account</>}
            </button>
          </form>
        )}

        {/* OTP Login */}
        {tab === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={requestOtp} className="space-y-4">
                <div>
                  <label htmlFor="prof-otp-phone" className="label">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                    <input id="prof-otp-phone" className="input w-full pl-9" required type="tel" pattern="[6-9][0-9]{9}" value={otpPhone} onChange={e => setOtpPhone(e.target.value)} placeholder="10-digit mobile number" />
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <><Phone size={15}/> Send OTP</>}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                  <p className="text-text-2 text-sm">OTP sent to ****{otpPhone.slice(-4)}</p>
                  {demoOtp && <p className="text-primary font-bold text-lg mt-1">Demo OTP: {demoOtp}</p>}
                </div>
                <div>
                  <label htmlFor="prof-otp-code" className="label">Enter OTP</label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                    <input id="prof-otp-code" className="input w-full pl-9 text-center text-xl tracking-widest" required type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" aria-label="Enter 6-digit OTP" autoFocus />
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
                <div className="flex gap-2">
                  <button type="button" className="btn-secondary flex-1" onClick={() => { setOtpSent(false); setOtp(''); setDemoOtp(null); setError(null) }}>
                    Change Number
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading || otp.length < 4}>
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <><CheckCircle2 size={15}/> Verify OTP</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AddLandModal({ farmerId, onAdd, onClose, editLand }) {
  const isEdit = !!editLand
  const [form, setForm] = useState(
    isEdit
      ? { name: editLand.name || '', area: editLand.area_acres ?? '', soil_type: editLand.soil_type || 'loamy', irrigation_type: editLand.irrigation_type || 'rainfed' }
      : { name: '', area: '', soil_type: 'loamy', irrigation_type: 'rainfed' }
  )
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault(); setLoading(true); setErr('')
    try {
      if (isEdit) {
        const updated = await farmerApi.updateLand(editLand.id, {
          name: form.name,
          area: parseFloat(form.area),
          soil_type: form.soil_type,
          irrigation_type: form.irrigation_type,
        })
        onAdd(updated, true)
      } else {
        const land = await farmerApi.addLand({
          farmer_id: farmerId,
          name: form.name,
          area: parseFloat(form.area),
          soil_type: form.soil_type,
          irrigation_type: form.irrigation_type,
        })
        onAdd(land, false)
      }
    } catch (ex) { setErr(ex.message || (isEdit ? 'Failed to update land' : 'Failed to add land')) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-text-1">{isEdit ? 'Edit Land' : 'Add Land'}</h3>
          <button className="btn-icon" onClick={onClose}><X size={14}/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Land Name</label><input className="input w-full" required value={form.name} onChange={set('name')} placeholder="e.g. North Field" /></div>
          <div><label className="label">Area (acres)</label><input className="input w-full" required type="number" step="0.1" min="0.1" value={form.area} onChange={set('area')} /></div>
          <div><label className="label">Soil Type</label>
            <select className="input w-full" required value={form.soil_type} onChange={set('soil_type')}>
              {[['black','Black'],['red','Red'],['alluvial','Alluvial'],['sandy','Sandy'],['loamy','Loamy'],['clay','Clay'],['silt','Silt']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="label">Irrigation Type</label>
            <select className="input w-full" required value={form.irrigation_type} onChange={set('irrigation_type')}>
              {[['rainfed','Rainfed'],['canal','Canal'],['borewell','Borewell'],['drip','Drip'],['sprinkler','Sprinkler']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : (isEdit ? 'Save Changes' : 'Add Land')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Profile() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [showAddLand,   setShowAddLand]   = useState(false)
  const [editingLand,   setEditingLand]   = useState(null)   // land object to edit, or null
  const [confirmDelete, setConfirmDelete] = useState(null)   // land object to delete, or null
  const [openMenu,      setOpenMenu]      = useState(null)   // land id with open ⋮ menu
  const [toast,         setToast]         = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const toastTimer = useRef(null)

  function showToast(msg) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  // Close three-dot menu on outside click
  useEffect(() => {
    if (!openMenu) return
    function onDoc(e) {
      if (!e.target.closest('[data-land-menu]')) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [openMenu])

  function handleAuth(res) {
    dispatch({ type: 'SET_TOKEN', payload: res.access_token || res.token })
    dispatch({ type: 'SET_FARMER', payload: res.farmer || res.user })
    navigate('/')
  }

  function handleAddLand(land, isEdit) {
    const currentLands = state.farmer?.lands || []
    const newLands = isEdit
      ? currentLands.map(l => (l.id === land.id ? land : l))
      : [...currentLands, land]
    dispatch({ type: 'SET_FARMER', payload: { ...state.farmer, lands: newLands } })
    setShowAddLand(false)
    setEditingLand(null)
    showToast(isEdit ? '✅ Land updated' : '✅ Land added')
  }

  async function handleDelete(land) {
    if ((land.active_cycles ?? 0) > 0) {
      showToast('⚠️ Cannot delete — this land has an active crop cycle.')
      setConfirmDelete(null)
      return
    }
    setDeleteLoading(true)
    try {
      await farmerApi.deleteLand(land.id)
      const newLands = (state.farmer?.lands || []).filter(l => l.id !== land.id)
      dispatch({ type: 'SET_FARMER', payload: { ...state.farmer, lands: newLands } })
      showToast('🗑️ Land deleted')
    } catch (e) {
      showToast('⚠️ Delete failed: ' + (e.message || 'Unknown error'))
    } finally {
      setDeleteLoading(false)
      setConfirmDelete(null)
    }
  }

  function logout() {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  if (!state.farmer) {
    return (
      <div className="page-content space-y-6">
        <header className="pt-2">
          <h1 className="font-display text-2xl font-bold text-text-1">Profile</h1>
          <p className="text-text-3 text-sm mt-0.5">Sign in to access your farm profile</p>
        </header>
        <AuthForms onSuccess={handleAuth} />
      </div>
    )
  }

  const farmer = state.farmer
  const lands = farmer.lands || []

  return (
    <div className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Profile</h1>
          <p className="text-text-3 text-sm mt-0.5">Manage your account and lands</p>
        </div>
        {toast && (
          <span
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            {toast}
          </span>
        )}
      </header>

      {/* Farmer card */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-dim flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {(farmer.name || 'F')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-text-1 font-semibold text-lg">{farmer.name}</h2>
            <p className="text-text-3 text-sm">{farmer.phone}</p>
            {(farmer.village || farmer.district) && (
              <p className="text-text-2 text-sm flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-text-3" />
                {[farmer.village, farmer.district, farmer.state].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <span className="badge badge-green">{lands.length} {lands.length === 1 ? 'Land' : 'Lands'}</span>
          </div>
        </div>
      </div>

      {/* Lands */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-text-1 font-semibold">Your Lands</h3>
          <button className="btn-primary text-xs py-2 px-3 flex items-center gap-1" onClick={() => setShowAddLand(true)}>
            <Plus size={13} /> Add Land
          </button>
        </div>
        {lands.length === 0 ? (
          <div className="card p-8 text-center">
            <MapPin size={24} className="text-text-3 mx-auto mb-2" />
            <p className="text-text-2">No lands added yet</p>
            <p className="text-text-3 text-sm mt-1">Add your first land to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lands.map((land, i) => (
              <div key={land.id || i} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary-dim flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-1 font-medium truncate">{land.name || `Field ${i + 1}`}</p>
                  <p className="text-text-3 text-xs">{land.area_acres} acres • {land.soil_type || 'Unknown'} soil{land.location ? ` • ${land.location}` : ''}</p>
                </div>
                {/* Three-dot menu */}
                <div className="relative shrink-0" data-land-menu>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-3 transition-colors"
                    onClick={() => setOpenMenu(openMenu === (land.id || i) ? null : (land.id || i))}
                    aria-label="Land options"
                  >
                    <MoreVertical size={15} className="text-text-3" />
                  </button>
                  {openMenu === (land.id || i) && (
                    <div
                      className="absolute right-0 top-full mt-1 w-36 rounded-xl overflow-hidden z-30"
                      style={{ background: '#111d16', border: '1px solid rgba(34,197,94,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                    >
                      <button
                        className="w-full text-left px-3.5 py-2.5 text-sm text-text-2 hover:bg-surface-2 hover:text-text-1 transition-colors flex items-center gap-2"
                        onClick={() => { setEditingLand(land); setOpenMenu(null) }}
                      >
                        <Pencil size={13} className="text-primary" /> Edit
                      </button>
                      <button
                        className="w-full text-left px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        onClick={() => { setConfirmDelete(land); setOpenMenu(null) }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button onClick={logout} className="btn-secondary w-full flex items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10">
        <LogOut size={15} /> Sign Out
      </button>

      {showAddLand && <AddLandModal farmerId={state.farmer?.farmer_id} onAdd={handleAddLand} onClose={() => setShowAddLand(false)} />}
      {editingLand && <AddLandModal farmerId={state.farmer?.farmer_id} onAdd={handleAddLand} onClose={() => setEditingLand(null)} editLand={editingLand} />}

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div>
                {(confirmDelete.active_cycles ?? 0) > 0 ? (
                  <>
                    <p className="text-text-1 font-semibold">Cannot Delete Land</p>
                    <p className="text-text-2 text-sm mt-1">
                      “{confirmDelete.name}” has an active crop cycle. Complete or remove it first.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-text-1 font-semibold">Delete “{confirmDelete.name}”?</p>
                    <p className="text-text-2 text-sm mt-1">This cannot be undone.</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setConfirmDelete(null)}>Cancel</button>
              {(confirmDelete.active_cycles ?? 0) === 0 && (
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                  disabled={deleteLoading}
                  onClick={() => handleDelete(confirmDelete)}
                >
                  {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={14} /> Delete</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

```


## `frontend-src/src/pages/SatelliteOracle.jsx`


```jsx
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
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

  const markerPos = useMemo(() => {
    return {
      left: `${clamp(((coords.lng + 180) / 360) * 100, 0, 100)}%`,
      top: `${clamp(((90 - coords.lat) / 180) * 100, 0, 100)}%`,
    }
  }, [coords.lat, coords.lng])

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
    try {
      const result = await satelliteApi.analyzeLand(coords.lat, coords.lng, coords.acres, landId, coords.crop)
      setAnalysis(result)
      setActiveTab('analysis')
      await refreshHistory(landId)
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
      const result = await satelliteApi.getCarbonCredits(landId, coords.lat, coords.lng, coords.acres)
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
        ndviThreshold
      )
      setInsuranceData(result)
      setActiveTab('insurance')
    } catch (e) {
      setError(e?.message || 'Failed to check insurance status.')
    } finally {
      setLoading(false)
    }
  }

  function handleGlobePick(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const lat = clamp(90 - (y * 180), -85, 85)
    const lng = clamp((x * 360) - 180, -180, 180)
    setCoords((prev) => ({
      ...prev,
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
    }))
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
            <p className="text-text-1 font-semibold">Interactive Globe Picker</p>
            <span className="text-xs text-text-3">Click to set coordinates</span>
          </div>
          <div
            onClick={handleGlobePick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleGlobePick(e)
            }}
            className="relative rounded-xl overflow-hidden cursor-crosshair"
            style={{
              height: 260,
              border: '1px solid rgba(34,197,94,0.22)',
              background: 'radial-gradient(circle at 30% 20%, rgba(34,197,94,0.25), transparent 36%), radial-gradient(circle at 72% 75%, rgba(59,130,246,0.20), transparent 42%), linear-gradient(150deg, rgba(13,23,18,0.96), rgba(8,14,11,0.98))',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.23,
                background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 28px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: markerPos.left,
                top: markerPos.top,
                transform: 'translate(-50%, -50%)',
                width: 14,
                height: 14,
                borderRadius: 999,
                background: '#22c55e',
                boxShadow: '0 0 0 4px rgba(34,197,94,0.25), 0 0 22px rgba(34,197,94,0.65)',
              }}
            />
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
                onClick={() => setActiveTab('carbon')}
                type="button"
              >
                Carbon Credits
              </button>
              <button
                className={activeTab === 'insurance' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('insurance')}
                type="button"
              >
                Parametric Insurance
              </button>
            </div>
          </div>

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

```


## `frontend-src/src/pages/Schemes.jsx`


```jsx
﻿import { useState, useEffect, useMemo } from 'react'
import { schemesApi } from '../api/client'
import SkeletonCard from '../components/common/SkeletonCard'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  Star, ExternalLink, RefreshCw, MapPin, Leaf,
  IndianRupee, Users, Phone,
} from 'lucide-react'

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
]

const FARMING_TYPES = [
  { id: 'food_crops',       label: 'Food Crops',       icon: 'ðŸŒ¾', desc: 'Wheat, Rice, Pulses, Oilseeds' },
  { id: 'horticulture',     label: 'Horticulture',      icon: 'ðŸ¥­', desc: 'Fruits, Vegetables, Spices' },
  { id: 'organic',          label: 'Organic Farming',  icon: 'ðŸŒ¿', desc: 'Chemical-free, natural farming' },
  { id: 'animal_husbandry', label: 'Animal Husbandry', icon: 'ðŸ„', desc: 'Cows, Buffalo, Goats, Poultry' },
  { id: 'fisheries',        label: 'Fisheries',         icon: 'ðŸŸ', desc: 'Fish, Shrimp, Aquaculture' },
  { id: 'sericulture',      label: 'Sericulture',       icon: 'ðŸ›', desc: 'Silk worm farming' },
  { id: 'floriculture',     label: 'Floriculture',      icon: 'ðŸŒ¸', desc: 'Flowers, Ornamental plants' },
]

const NE_HILL_STATES = [
  'Himachal Pradesh','Uttarakhand','Jammu & Kashmir','Ladakh','Sikkim',
  'Arunachal Pradesh','Manipur','Meghalaya','Mizoram','Nagaland','Tripura','Assam',
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SCHEMES DATABASE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SCHEMES_DB = [
  {
    id: 'pm_kisan',
    name: 'PM-KISAN',
    full_name: 'Pradhan Mantri Kisan Samman Nidhi',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Direct Benefit',
    benefit_summary: 'â‚¹6,000/year in 3 direct bank installments',
    benefits: [
      'â‚¹2,000 every 4 months (3 installments/year)',
      'Direct Bank Transfer â€” no middlemen',
      'All farmer families who cultivate land are eligible',
    ],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Land Records (Khasra/Khatauni)', 'Mobile Number'],
    helpline: '155261 / 011-24300606',
    link: 'https://pmkisan.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must own or cultivate land'); return { score: 0, reasons, disqualifiers: disq } }
      if (!p.has_bank_account) { disq.push('Bank account is required for DBT'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 55
      reasons.push('You cultivate land â€” primary eligibility met')
      if (p.aadhaar_linked) { score += 25; reasons.push('Aadhaar linked to bank â€” mandatory requirement satisfied') }
      else disq.push('Aadhaar must be linked to your bank account')
      if (p.land_acres <= 5) { score += 20; reasons.push('Small or marginal farmer â€” priority category') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Crop Insurance)',
    full_name: 'Pradhan Mantri Fasal Bima Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Insurance',
    benefit_summary: 'Crop insurance at just 1.5â€“5% premium â€” govt pays the rest',
    benefits: [
      'Kharif crops: only 2% premium from farmer',
      'Rabi crops: only 1.5% premium from farmer',
      'Horticulture/Commercial crops: 5% premium',
      'Full sum insured paid on natural calamity crop loss',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Passbook', 'Sowing Certificate from Patwari'],
    helpline: '1800-200-7710',
    link: 'https://pmfby.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must grow crops on land'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 45
      if (p.farming_types.some(t => ['food_crops', 'horticulture', 'organic', 'floriculture'].includes(t))) {
        score += 35; reasons.push('You grow crops â€” crop insurance directly applies')
      }
      if (p.has_bank_account) { score += 10; reasons.push('Bank account for insurance payout') }
      if (p.land_acres <= 2) { score += 10; reasons.push('Marginal farmer â€” special relief provisions apply') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    full_name: 'Kisan Credit Card Scheme',
    ministry: 'Ministry of Finance / NABARD',
    category: 'Credit & Loans',
    benefit_summary: 'Crop loans up to â‚¹3 lakh at just 4% effective interest',
    benefits: [
      'Up to â‚¹3 lakh without collateral at 4% effective rate',
      'Covers crop production, post-harvest & allied activities',
      'Personal accident insurance â‚¹50,000 included free',
      'Now extended to animal husbandry & fisheries too',
    ],
    documents: ['Aadhaar', 'PAN Card', 'Land Records', 'Bank Account', '2 Passport Photos'],
    helpline: '1800-11-2515 (NABARD)',
    link: 'https://www.nabard.org/kcc',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.has_bank_account) { disq.push('Bank account required to get KCC'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 40
      reasons.push('Bank account holder â€” can apply for KCC')
      if (p.land_type !== 'landless') { score += 20; reasons.push('Land cultivator â€” crop credit available') }
      if (['animal_husbandry', 'fisheries'].some(t => p.farming_types.includes(t))) {
        score += 20; reasons.push('KCC also covers livestock & fisheries â€” you qualify')
      }
      if (p.land_acres <= 5) { score += 15; reasons.push('Small farmer priority category') }
      if (p.annual_income <= 2) { score += 5; reasons.push('Low-income farmer â€” credit access especially valuable') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pm_maandhan',
    name: 'PM Kisan MaanDhan (Pension)',
    full_name: 'Pradhan Mantri Kisan Maandhan Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Pension',
    benefit_summary: 'â‚¹3,000/month pension after age 60 â€” govt matches your contribution',
    benefits: [
      'â‚¹3,000/month guaranteed pension after age 60',
      'Government matches farmer contribution rupee-for-rupee',
      'Monthly contribution only â‚¹55â€“â‚¹200 based on entry age',
      'Spouse pension of â‚¹1,500/month on death',
    ],
    documents: ['Aadhaar', 'Bank Passbook (savings/Jan Dhan)', 'Land Records'],
    helpline: '1800-267-6888',
    link: 'https://pmkmy.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.age < 18 || p.age > 40) { disq.push(`Entry age must be 18â€“40 years (you entered ${p.age})`); return { score: 0, reasons, disqualifiers: disq } }
      if (p.land_acres * 0.4047 > 2) { disq.push('Only for small/marginal farmers â€” land â‰¤ 2 hectares (â‰ˆ5 acres)'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 65
      reasons.push(`Age ${p.age} is within the 18â€“40 entry window`)
      reasons.push('Land â‰¤ 5 acres â€” qualifies as small/marginal farmer')
      if (p.has_bank_account) { score += 20; reasons.push('Bank account needed for monthly contribution deduction') }
      if (p.annual_income <= 1.5) { score += 15; reasons.push('Lower income â€” pension will provide security after 60') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'midh',
    name: 'MIDH (Horticulture Mission)',
    full_name: 'Mission for Integrated Development of Horticulture',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Horticulture',
    benefit_summary: '50â€“100% subsidy on horticulture infrastructure, saplings & cold storage',
    benefits: [
      '50% subsidy on tissue culture saplings & hybrid seeds',
      'Protected cultivation (greenhouse/polyhouse) â€” 50% subsidy',
      'Cold storage & pack house â€” up to â‚¹10 lakh subsidy',
      'Enhanced support for North-East & hill states',
    ],
    documents: ['Land Records', 'Bank Account', 'Aadhaar', 'Project Report (for infrastructure)'],
    helpline: '011-23382480',
    link: 'https://midh.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('horticulture') && !p.farming_types.includes('floriculture')) {
        disq.push('Only for horticulture / floriculture farmers'); return { score: 0, reasons, disqualifiers: disq }
      }
      let score = 70
      reasons.push('Horticultural crop farmer â€” primary MIDH eligibility met')
      if (p.farming_types.includes('floriculture')) { score += 5; reasons.push('Floriculture also covered under MIDH') }
      if (NE_HILL_STATES.includes(p.state)) { score += 20; reasons.push(`${p.state} gets enhanced subsidy under MIDH NE/Hill component`) }
      if (p.land_acres <= 5) { score += 5; reasons.push('Small farmers get priority in subsidy allocation') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pkvy',
    name: 'PKVY (Organic Farming)',
    full_name: 'Paramparagat Krishi Vikas Yojana',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Organic',
    benefit_summary: 'â‚¹50,000/hectare over 3 years to adopt organic farming',
    benefits: [
      'â‚¹50,000/ha over 3 years â€” â‚¹31,000 goes directly to farmer',
      'Free PGS-India organic certification',
      'Training, capacity building and organic input support',
      'Branding & marketing help for organic produce',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Account', 'Group of â‰¥10 farmers needed'],
    helpline: '1800-180-1551',
    link: 'https://pgsindia-ncof.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('organic')) { disq.push('For farmers practicing or switching to organic farming'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 70
      reasons.push('Organic farmer â€” directly eligible for PKVY subsidy')
      reasons.push('Form a cluster of â‰¥10 farmers to apply together')
      if (p.land_acres >= 1) { score += 15; reasons.push('Minimum ~1 acre required â€” you meet this') }
      if (p.annual_income <= 2) { score += 15; reasons.push('Organic premium pricing will significantly boost your income') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'smam',
    name: 'SMAM (Farm Machinery Subsidy)',
    full_name: 'Sub-Mission on Agricultural Mechanization',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Equipment',
    benefit_summary: '40â€“50% subsidy on tractors, harvesters & tillers',
    benefits: [
      '50% subsidy for SC/ST/women/small farmers',
      '40% subsidy for general category farmers',
      'Custom Hiring Center setup: 40% subsidy up to â‚¹25 lakh',
      'Farm Machinery Bank (group): up to 80% subsidy',
    ],
    documents: ['Aadhaar', 'Land Records', 'Caste Certificate (SC/ST)', 'Bank Account', 'Equipment Quotation'],
    helpline: '1800-180-1551',
    link: 'https://agrimachinery.nic.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must cultivate land to claim machinery subsidy'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 45
      reasons.push('Land cultivator â€” eligible for farm machinery subsidy')
      if (['sc', 'st'].includes(p.community)) { score += 30; reasons.push(`${p.community.toUpperCase()} category â€” enhanced 50% subsidy applies`) }
      else if (p.community === 'obc') { score += 15; reasons.push('OBC farmer â€” standard 40% subsidy') }
      else { score += 10; reasons.push('40% subsidy available for general category') }
      if (p.land_acres <= 2) { score += 15; reasons.push('Marginal farmer â€” priority in machinery allocation') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pmksy',
    name: 'PMKSY (Irrigation Subsidy)',
    full_name: 'Pradhan Mantri Krishi Sinchayee Yojana',
    ministry: 'Ministry of Jal Shakti / Agriculture',
    category: 'Irrigation',
    benefit_summary: 'Drip & sprinkler irrigation at 55â€“90% subsidy',
    benefits: [
      'Small/marginal farmers: up to 90% subsidy on micro-irrigation',
      'Other farmers: up to 55% subsidy',
      'Per Drop More Crop â€” drip & sprinkler systems covered',
      'Watershed development and water conservation support',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Account', 'Application to District Agriculture Office'],
    helpline: '1800-180-1551',
    link: 'https://pmksy.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { disq.push('Must own or cultivate land'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 50
      reasons.push('Land cultivator â€” eligible for irrigation subsidy')
      if (p.land_acres <= 2) { score += 30; reasons.push('Marginal farmer (â‰¤2 acres) â€” up to 90% subsidy') }
      else if (p.land_acres <= 5) { score += 18; reasons.push('Small farmer (â‰¤5 acres) â€” enhanced subsidy rate') }
      if (['sc', 'st'].includes(p.community)) { score += 10; reasons.push(`${p.community.toUpperCase()} community â€” additional priority`) }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'pm_matsya',
    name: 'PM Matsya Sampada (Fisheries)',
    full_name: 'Pradhan Mantri Matsya Sampada Yojana',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Fisheries',
    benefit_summary: '40â€“60% subsidy for fish farming â€” ponds, cages, boats & nets',
    benefits: [
      '60% subsidy for SC/ST/women fish farmers',
      '40% subsidy for general category',
      'Pond construction, cage culture, biofloc systems covered',
      'Boat & fishing net subsidy for marine fishers',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Land/Water Body Records', 'Caste Certificate (if applicable)'],
    helpline: '1800-425-1660',
    link: 'https://pmmsy.dof.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('fisheries')) { disq.push('Only for fisheries / aquaculture farmers'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 65
      reasons.push('Fisheries farmer â€” directly eligible for PM Matsya Sampada')
      if (['sc', 'st'].includes(p.community)) { score += 25; reasons.push(`${p.community.toUpperCase()} fisher â€” enhanced 60% subsidy vs 40% for others`) }
      if (p.has_bank_account) { score += 10; reasons.push('Bank account for subsidy transfer ready') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'nlm',
    name: 'National Livestock Mission (NLM)',
    full_name: 'National Livestock Mission',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Animal Husbandry',
    benefit_summary: '50% subsidy (up to â‚¹25 lakh) for livestock enterprise development',
    benefits: [
      '50% subsidy for setting up livestock/poultry enterprise',
      'Fodder and feed development support',
      'Livestock insurance coverage',
      'Breed improvement and technical training',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Project Report', 'Land Documents'],
    helpline: '011-23389928',
    link: 'https://nlm.udyamimitra.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('animal_husbandry')) { disq.push('Only for livestock / animal husbandry farmers'); return { score: 0, reasons, disqualifiers: disq } }
      let score = 65
      reasons.push('Animal husbandry farmer â€” directly eligible for NLM')
      if (p.annual_income <= 1.5) { score += 15; reasons.push('Lower income group â€” priority in livestock subsidy') }
      if (['sc', 'st', 'obc'].includes(p.community)) { score += 20; reasons.push(`${p.community.toUpperCase()} community â€” priority allocation in NLM`) }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'rgm',
    name: 'Rashtriya Gokul Mission',
    full_name: 'Rashtriya Gokul Mission (Indigenous Cattle)',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    category: 'Animal Husbandry',
    benefit_summary: 'Free AI at doorstep + breed improvement for indigenous cows',
    benefits: [
      'Free Artificial Insemination (AI) at your doorstep',
      'Development & conservation of indigenous cattle breeds',
      'Gokul Gram integrated cattle development centers',
      'Milk production training and enhancement',
    ],
    documents: ['Aadhaar', 'Cattle Ownership Proof'],
    helpline: '011-23389928',
    link: 'https://dahd.nic.in/gokul',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('animal_husbandry')) { return { score: 0, reasons, disqualifiers: ['Only for cattle / dairy farmers'] } }
      let score = 60
      reasons.push('Cattle/dairy farmer â€” eligible for free AI & breed improvement')
      if (p.annual_income <= 2) { score += 20; reasons.push('Programme especially beneficial for small dairy farmers') }
      return { score, reasons, disqualifiers: disq }
    },
  },
  {
    id: 'enam',
    name: 'e-NAM (Online Market)',
    full_name: 'Electronic National Agriculture Market',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Market',
    benefit_summary: 'Sell produce online across India â€” better prices, no middlemen',
    benefits: [
      'Pan-India online platform for 200+ commodities',
      'Transparent price discovery via live e-auction',
      'Payment directly to bank within 24 hours',
      'Zero registration fee for farmers',
    ],
    documents: ['Aadhaar', 'Bank Account', 'Mobile Number'],
    helpline: '1800-270-0224',
    link: 'https://enam.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { return { score: 0, reasons, disqualifiers: ['Must have produce to sell'] } }
      let score = 55
      reasons.push('Farmer with produce â€” can register on e-NAM for free')
      if (p.has_bank_account) { score += 25; reasons.push('Bank account needed for payment â€” you have it') }
      if (p.farming_types.some(t => ['food_crops', 'horticulture', 'floriculture', 'organic'].includes(t))) {
        score += 20; reasons.push('Your crop types are actively traded on e-NAM')
      }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'soil_health_card',
    name: 'Soil Health Card Scheme',
    full_name: 'Soil Health Card Scheme',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Subsidy',
    benefit_summary: 'Free soil testing + personalised fertilizer advice every 2 years',
    benefits: [
      'Free testing of 12 soil parameters (pH, NPK, micronutrients)',
      'Customised fertilizer recommendations per crop',
      'Reduces over-fertilization â†’ saves money',
      'Issued every 2 years for all farm holdings',
    ],
    documents: ['Aadhaar', 'Land Records', 'Mobile Number'],
    helpline: '1800-180-1551',
    link: 'https://soilhealth.dac.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.land_type === 'landless') { return { score: 0, reasons, disqualifiers: ['Must cultivate land'] } }
      let score = 88
      reasons.push('Universal scheme â€” every land cultivator is eligible')
      if (p.farming_types.includes('organic')) { score = 100; reasons.push('Essential for organic transition â€” know exact soil status') }
      else if (p.land_acres <= 5) { score = Math.max(score, 90); reasons.push('Small farmer â€” soil card helps optimise limited inputs') }
      return { score, reasons, disqualifiers: disq }
    },
  },
  {
    id: 'miss',
    name: 'Interest Subvention (MISS)',
    full_name: 'Modified Interest Subvention Scheme',
    ministry: 'Ministry of Agriculture / RBI',
    category: 'Credit & Loans',
    benefit_summary: 'Crop loans at only 4% effective interest for timely repayment',
    benefits: [
      'Short-term crop loans at 7% (2% subvention from Govt)',
      'Extra 3% incentive for prompt repayment â†’ effective 4%',
      'Covers all food crops, horticulture, allied activities',
      'Auto-applied if you have a KCC at any bank',
    ],
    documents: ['KCC or Bank Account', 'Aadhaar', 'Land Records'],
    helpline: '1800-11-2515 (NABARD)',
    link: 'https://www.nabard.org',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.has_bank_account) { return { score: 0, reasons, disqualifiers: ['Bank account required'] } }
      if (p.land_type === 'landless') { return { score: 0, reasons, disqualifiers: ['Crop cultivation required'] } }
      let score = 60
      reasons.push('Active farmer with bank account â€” eligible for interest subvention')
      if (p.land_acres <= 5) { score += 25; reasons.push('Small farmer â€” effective 4% rate significantly cuts your borrow cost') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'nfsm',
    name: 'NFSM (Food Security Mission)',
    full_name: 'National Food Security Mission',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Subsidy',
    benefit_summary: 'Free/subsidized HYV seeds + demos for rice, wheat, pulses, oilseeds',
    benefits: [
      'Subsidized or free certified high-yielding variety seeds',
      'Farm machinery demonstration and subsidy',
      'On-farm cluster demonstrations for better practices',
      'Covers rice, wheat, pulses, coarse cereals, nutri-cereals',
    ],
    documents: ['Aadhaar', 'Land Records', 'Application to District Agriculture Officer'],
    helpline: '1800-180-1551',
    link: 'https://nfsm.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('food_crops')) { return { score: 0, reasons, disqualifiers: ['Only for food grain farmers (rice, wheat, pulses, oilseeds)'] } }
      let score = 65
      reasons.push('Food crop farmer â€” eligible for NFSM seeds and input subsidies')
      if (p.land_acres <= 5) { score += 25; reasons.push('Small & marginal farmers get priority in input distribution') }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'wadi_trifood',
    name: 'WADI / TRIFOOD (Tribal)',
    full_name: 'Tribal Sub-Plan / TRIFOOD Scheme',
    ministry: 'Ministry of Tribal Affairs / TRIFED',
    category: 'Horticulture',
    benefit_summary: 'Free horticulture inputs + MSP for minor forest produce (ST only)',
    benefits: [
      'Free horticulture inputs for ST farmers',
      'Minimum Support Price for Minor Forest Produce (MFP)',
      'TRIFOOD processing unit â€” value addition support',
      'Van Dhan Vikas Kendras â€” marketing and training help',
    ],
    documents: ['Tribal (ST) Certificate', 'Aadhaar', 'Bank Account'],
    helpline: '1800-425-3465 (TRIFED)',
    link: 'https://trifed.tribal.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (p.community !== 'st') { return { score: 0, reasons, disqualifiers: ['Exclusively for Scheduled Tribe (ST) farmers'] } }
      let score = 78
      reasons.push('ST community â€” directly eligible for tribal agricultural schemes')
      if (p.farming_types.some(t => ['horticulture', 'food_crops', 'organic'].includes(t))) {
        score += 22; reasons.push('Forest-based horticulture and food crops fully supported')
      }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
  {
    id: 'sericulture_scheme',
    name: 'Silk Samagra (Sericulture)',
    full_name: 'Silk Samagra â€” Central Silk Board',
    ministry: 'Ministry of Textiles â€” Central Silk Board',
    category: 'Subsidy',
    benefit_summary: '75â€“90% subsidy on mulberry plantation and silkworm equipment',
    benefits: [
      '90% subsidy for tribal / BPL sericulture farmers',
      '75% subsidy for other farmers',
      'Free silkworm layings (eggs) in some states',
      'Technical training and silk reeling equipment support',
    ],
    documents: ['Aadhaar', 'Land Records', 'Bank Account', 'Caste Certificate (if applicable)'],
    helpline: '080-26282059 (CSB)',
    link: 'https://csb.gov.in',
    matchFn: (p) => {
      const reasons = [], disq = []
      if (!p.farming_types.includes('sericulture')) { return { score: 0, reasons, disqualifiers: ['Only for silk worm / sericulture farmers'] } }
      let score = 70
      reasons.push('Sericulture farmer â€” directly eligible for Silk Samagra')
      if (['sc', 'st'].includes(p.community)) { score += 25; reasons.push(`${p.community.toUpperCase()} farmer gets higher 75â€“90% subsidy rate`) }
      return { score: Math.min(100, score), reasons, disqualifiers: disq }
    },
  },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ELIGIBILITY ENGINE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Match functions keyed by scheme ID — normalise hyphens to underscores for API IDs
const MATCH_FNS = Object.fromEntries(
  SCHEMES_DB.map(s => [s.id, s.matchFn])
)

function computeMatches(profile, schemesData) {
  return schemesData
    .map(s => {
      const fn = MATCH_FNS[s.id] || MATCH_FNS[s.id?.replace(/-/g, '_')]
      const r = fn
        ? fn(profile)
        : { score: 50, reasons: ['May be applicable to your profile'], disqualifiers: [] }
      return { ...s, score: r.score, reasons: r.reasons, disqualifiers: r.disqualifiers }
    })
    .sort((a, b) => b.score - a.score)
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STEP INDICATOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STEPS = ['Location & Land', 'Your Profile', 'Farming Type', 'Results']

function StepIndicator({ current }) {
  return (
    <div className="flex items-start">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-start flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 min-w-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
              i < current ? 'bg-primary text-black'
              : i === current ? 'bg-primary/15 border-2 border-primary text-primary'
              : 'bg-surface-2 text-text-3 border border-border'
            }`}>
              {i < current ? 'âœ“' : i + 1}
            </div>
            <span className={`text-[10px] font-medium text-center leading-tight ${i === current ? 'text-primary' : 'text-text-3'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 mt-3.5 transition-all ${i < current ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MATCH CARD
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const BADGE_COLORS = {
  'Direct Benefit':   'bg-primary/15 text-primary',
  'Insurance':        'bg-blue-500/15 text-blue-400',
  'Credit & Loans':   'bg-amber-500/15 text-amber-400',
  'Pension':          'bg-purple-500/15 text-purple-400',
  'Horticulture':     'bg-emerald-500/15 text-emerald-400',
  'Organic':          'bg-green-500/15 text-green-400',
  'Equipment':        'bg-orange-500/15 text-orange-400',
  'Irrigation':       'bg-cyan-500/15 text-cyan-400',
  'Fisheries':        'bg-sky-600/15 text-sky-300',
  'Animal Husbandry': 'bg-orange-600/15 text-orange-300',
  'Market':           'bg-yellow-500/15 text-yellow-400',
  'Subsidy':          'bg-teal-500/15 text-teal-400',
}

function scoreStyle(score) {
  if (score >= 80) return { ring: 'ring-primary/40', bg: 'bg-primary/10', text: 'text-primary', label: 'High Match', bar: 'bg-primary' }
  if (score >= 55) return { ring: 'ring-amber-400/40', bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'Good Match', bar: 'bg-amber-400' }
  return { ring: 'ring-slate-500/20', bg: 'bg-surface-2', text: 'text-text-3', label: 'Partial', bar: 'bg-slate-500' }
}

function MatchCard({ scheme, rank }) {
  const [open, setOpen] = useState(false)
  const sc = scoreStyle(scheme.score)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(rank * 0.05, 0.4) }}
      className={`card p-4 ring-1 ${sc.ring}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl ${sc.bg} flex flex-col items-center justify-center shrink-0 ring-1 ${sc.ring}`}>
          <span className={`text-base font-bold leading-none ${sc.text}`}>{scheme.score}%</span>
          <span className={`text-[9px] ${sc.text} leading-none mt-0.5`}>{sc.label}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[scheme.category] || 'bg-surface-2 text-text-3'}`}>
              {scheme.category}
            </span>
          </div>
          <h3 className="font-display text-text-1 font-bold text-sm leading-tight">{scheme.name}</h3>
          <p className="text-text-3 text-[11px] leading-tight">{scheme.full_name}</p>
        </div>
        <button onClick={() => setOpen(o => !o)} className="btn-icon shrink-0 text-text-3 text-xs">
          {open ? 'â–²' : 'â–¼'}
        </button>
      </div>

      <div className="mt-2.5 h-1 bg-surface-2 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${sc.bar}`}
          initial={{ width: 0 }} animate={{ width: `${scheme.score}%` }}
          transition={{ duration: 0.8, delay: rank * 0.05, ease: 'easeOut' }} />
      </div>

      <p className="text-text-2 text-sm mt-2 flex items-center gap-1.5">
        <IndianRupee size={11} className="text-primary shrink-0" />{scheme.benefit_summary}
      </p>

      {scheme.reasons?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {scheme.reasons.map((r, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] text-primary bg-primary/8 border border-primary/15 rounded-full px-2 py-0.5">
              <CheckCircle2 size={9} /> {r}
            </span>
          ))}
        </div>
      )}
      {scheme.disqualifiers?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {scheme.disqualifiers.map((d, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] text-red-400 bg-red-500/8 border border-red-500/15 rounded-full px-2 py-0.5">
              <XCircle size={9} /> {d}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-border space-y-3">
              <div>
                <p className="text-text-3 text-[10px] font-semibold uppercase tracking-wide mb-1.5">Key Benefits</p>
                <ul className="space-y-1">
                  {scheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-2 text-sm">
                      <span className="text-primary mt-0.5 shrink-0">â€¢</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-text-3 text-[10px] font-semibold uppercase tracking-wide mb-1.5">Documents Needed</p>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documents.map((d, i) => (
                    <span key={i} className="text-xs bg-surface-2 text-text-2 px-2 py-0.5 rounded-lg border border-border">{d}</span>
                  ))}
                </div>
              </div>
              <p className="text-text-3 text-[10px]">{scheme.ministry}</p>
              <div className="flex items-center gap-3 pt-0.5">
                {scheme.helpline && (
                  <span className="text-text-3 text-xs flex items-center gap-1">
                    <Phone size={11} className="text-emerald-400" /> {scheme.helpline}
                  </span>
                )}
                {scheme.link && (
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                    Apply Online <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CHECKBOX HELPER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CheckBox({ checked, onChange, label }) {
  return (
    <button type="button" onClick={onChange}
      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${checked ? 'border-primary bg-primary/8' : 'border-border bg-surface hover:border-border-strong'}`}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'bg-primary border-primary' : 'border-border'}`}>
        {checked && <span className="text-black text-[9px] font-bold">âœ“</span>}
      </div>
      <span className="text-text-2 text-xs">{label}</span>
    </button>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN PAGE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const defaultProfile = {
  state: '', land_acres: '', land_type: 'owned',
  community: 'general', annual_income: '', age: '',
  has_bank_account: true, aadhaar_linked: true,
  farming_types: [],
}


export default function Schemes() {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(defaultProfile)
  const [showAll, setShowAll] = useState(false)
  const [filterCat, setFilterCat] = useState('all')
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    schemesApi.list()
      .then(res => {
        const mapped = (res.schemes || []).map(s => ({
          ...s,
          full_name:       s.name_hindi         || '',
          benefit_summary: s.description        || '',
          documents:       s.documents_required || [],
          link:            s.apply_link          || '',
        }))
        setSchemes(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key, val) { setProfile(p => ({ ...p, [key]: val })) }
  function toggleFarming(id) {
    setProfile(p => ({
      ...p,
      farming_types: p.farming_types.includes(id)
        ? p.farming_types.filter(x => x !== id)
        : [...p.farming_types, id],
    }))
  }

  const canNext0 = profile.state && profile.land_acres !== '' && profile.land_type
  const canNext1 = profile.community && profile.annual_income !== '' && profile.age !== ''
  const canNext2 = profile.farming_types.length > 0

  const matches = useMemo(() => {
    if (step < 3) return []
    const p = {
      ...profile,
      land_acres: parseFloat(profile.land_acres) || 0,
      annual_income: parseFloat(profile.annual_income) || 0,
      age: parseInt(profile.age) || 30,
    }
    return computeMatches(p, schemes)
  }, [step, profile, schemes])

  const eligibleMatches = matches.filter(m => m.score >= 50)
  const partialMatches  = matches.filter(m => m.score > 0 && m.score < 50)
  const allCategories   = ['all', ...new Set(schemes.map(s => s.category))]
  const displayMatches  = (showAll ? matches : (eligibleMatches.length > 0 ? eligibleMatches : matches))
    .filter(m => filterCat === 'all' || m.category === filterCat)

  return (
    <div className="page-content space-y-5">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-text-1">Govt Scheme Finder</h1>
        <p className="text-text-3 text-sm mt-0.5">Answer a few questions — see every scheme you qualify for</p>
      </header>

      {step < 3 && (
        <div className="card p-4">
          <StepIndicator current={step} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 0 */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-5 space-y-4">
            <h2 className="font-display text-text-1 font-semibold flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Location &amp; Land
            </h2>
            <div>
              <label htmlFor="sc-state" className="text-text-3 text-xs font-medium block mb-1.5">State / UT *</label>
              <select id="sc-state" className="input w-full" value={profile.state} onChange={e => set('state', e.target.value)}>
                <option value="">Select your state...</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sc-land-acres" className="text-text-3 text-xs font-medium block mb-1.5">Land you farm (acres) *</label>
                <input id="sc-land-acres" className="input w-full" type="number" min="0" step="0.5" placeholder="e.g. 2.5"
                  value={profile.land_acres} onChange={e => set('land_acres', e.target.value)} />
                <p className="text-text-3 text-[10px] mt-1">Enter 0 if landless / labourer</p>
              </div>
              <div>
                <label htmlFor="sc-land-type" className="text-text-3 text-xs font-medium block mb-1.5">Land ownership *</label>
                <select id="sc-land-type" className="input w-full" value={profile.land_type} onChange={e => set('land_type', e.target.value)}>
                  <option value="owned">I own it</option>
                  <option value="tenant">Tenant / Lease</option>
                  <option value="sharecropper">Sharecropper</option>
                  <option value="landless">Landless labourer</option>
                </select>
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={!canNext0} onClick={() => setStep(1)}>
              Next <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-5 space-y-4">
            <h2 className="font-display text-text-1 font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary" /> Your Profile
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="sc-community" className="text-text-3 text-xs font-medium block mb-1.5">Community / Category *</label>
                <select id="sc-community" className="input w-full" value={profile.community} onChange={e => set('community', e.target.value)}>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                  <option value="minority">Minority</option>
                </select>
              </div>
              <div>
                <label htmlFor="sc-age" className="text-text-3 text-xs font-medium block mb-1.5">Your age *</label>
                <input id="sc-age" className="input w-full" type="number" min="18" max="80" placeholder="e.g. 34"
                  value={profile.age} onChange={e => set('age', e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="sc-income" className="text-text-3 text-xs font-medium block mb-1.5">Annual family income *</label>
              <select id="sc-income" className="input w-full" value={profile.annual_income} onChange={e => set('annual_income', e.target.value)}>
                <option value="">Select range...</option>
                <option value="0.5">Below Rs.50,000</option>
                <option value="1">Rs.50,000 to Rs.1 Lakh</option>
                <option value="1.5">Rs.1 to 1.5 Lakh</option>
                <option value="2">Rs.1.5 to 2 Lakh</option>
                <option value="3">Rs.2 to 3 Lakh</option>
                <option value="5">Rs.3 to 5 Lakh</option>
                <option value="10">Above Rs.5 Lakh</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className={'card p-3 flex items-center gap-2 cursor-pointer transition-all ' + (profile.has_bank_account ? 'border-primary bg-primary/5' : '')}
                onClick={() => set('has_bank_account', !profile.has_bank_account)}>
                <div className={'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ' + (profile.has_bank_account ? 'bg-primary border-primary' : 'border-border')}>
                  {profile.has_bank_account && <span className="text-black text-[9px] font-bold">v</span>}
                </div>
                <span className="text-text-2 text-xs">Have bank account</span>
              </label>
              <label className={'card p-3 flex items-center gap-2 cursor-pointer transition-all ' + (profile.aadhaar_linked ? 'border-primary bg-primary/5' : '')}
                onClick={() => set('aadhaar_linked', !profile.aadhaar_linked)}>
                <div className={'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ' + (profile.aadhaar_linked ? 'bg-primary border-primary' : 'border-border')}>
                  {profile.aadhaar_linked && <span className="text-black text-[9px] font-bold">v</span>}
                </div>
                <span className="text-text-2 text-xs">Aadhaar linked to bank</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2" onClick={() => setStep(0)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!canNext1} onClick={() => setStep(2)}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-5 space-y-4">
            <h2 className="font-display text-text-1 font-semibold flex items-center gap-2">
              <Leaf size={16} className="text-primary" /> What do you farm?
              <span className="text-text-3 text-xs font-normal">(select all that apply)</span>
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {FARMING_TYPES.map(ft => {
                const sel = profile.farming_types.includes(ft.id)
                return (
                  <button key={ft.id} onClick={() => toggleFarming(ft.id)}
                    className={'p-3 rounded-xl border text-left transition-all ' + (sel ? 'border-primary bg-primary/8' : 'border-border bg-surface hover:border-border-strong')}>
                    <span className="text-xl">{ft.icon}</span>
                    <p className={'text-sm font-semibold mt-1 ' + (sel ? 'text-primary' : 'text-text-1')}>{ft.label}</p>
                    <p className="text-text-3 text-[10px] leading-snug">{ft.desc}</p>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!canNext2} onClick={() => setStep(3)}>
                Find My Schemes <Star size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Results */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="card p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-text-1 font-semibold">
                  {eligibleMatches.length} scheme{eligibleMatches.length !== 1 ? 's' : ''} you likely qualify for
                </p>
                <p className="text-text-3 text-xs mt-0.5 truncate">
                  {profile.state} &middot; {profile.land_acres} acres &middot; {profile.community.toUpperCase()} &middot;{' '}
                  {profile.farming_types.map(f => FARMING_TYPES.find(x => x.id === f)?.label).join(', ')}
                </p>
              </div>
              <button className="btn-icon shrink-0"
                onClick={() => { setStep(0); setProfile(defaultProfile); setShowAll(false); setFilterCat('all') }}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {allCategories.map(c => (
                <button key={c} onClick={() => setFilterCat(c)}
                  className={'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' + (filterCat === c ? 'bg-primary text-black' : 'bg-surface-2 text-text-3 hover:text-text-2')}>
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map(i => <SkeletonCard key={i} rows={3} />)}
              </div>
            ) : displayMatches.length === 0 ? (
              <div className="card p-10 text-center text-text-3 text-sm">No schemes in this category match your profile</div>
            ) : (
              <div className="space-y-3">{displayMatches.map((s, i) => <MatchCard key={s.id} scheme={s} rank={i} />)}</div>
            )}

            {eligibleMatches.length > 0 && partialMatches.length > 0 && !showAll && (
              <button className="w-full text-sm text-text-3 py-3 hover:text-text-2 transition-colors border border-dashed border-border rounded-xl"
                onClick={() => setShowAll(true)}>
                + Show {partialMatches.length} partial matches too
              </button>
            )}

            <p className="text-text-3 text-xs text-center pb-4">
              Source: Ministry of Agriculture &amp; Farmers Welfare, GOI &middot; Updated 2025 &middot; Verify eligibility with your local agriculture office
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

```


## `frontend-src/src/pages/SoilPassport.jsx`


```jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import {
  Download, Share2, QrCode, MapPin, Leaf, FlaskConical,
  CalendarDays, ShieldCheck, RefreshCw, Edit3, CheckCircle2, AlertCircle
} from 'lucide-react'
import QRCode from 'qrcode'

// ── Grade calculator ────────────────────────────────────────────────────────
function calcSoilGrade(n, p, k, ph) {
  let score = 0
  // N: optimal 40-80 kg/ha
  if (n >= 40 && n <= 80) score += 33
  else if (n >= 20 && n < 40) score += 20
  else if (n > 80 && n <= 120) score += 22
  else score += 5
  // P: optimal 20-40 kg/ha
  if (p >= 20 && p <= 40) score += 33
  else if (p >= 10 && p < 20) score += 18
  else if (p > 40 && p <= 60) score += 22
  else score += 5
  // K: optimal 150-250 kg/ha
  if (k >= 150 && k <= 250) score += 34
  else if (k >= 80 && k < 150) score += 20
  else if (k > 250 && k <= 350) score += 22
  else score += 5

  // pH penalty (optimal 6.0–7.5)
  if (ph >= 6.0 && ph <= 7.5) { /* no penalty */ }
  else if ((ph >= 5.5 && ph < 6.0) || (ph > 7.5 && ph <= 8.5)) score = Math.max(0, score - 15)
  else score = Math.max(0, score - 30)

  if (score >= 75) return 'A'
  if (score >= 50) return 'B'
  return 'C'
}

const GRADE_META = {
  A: { color: '#22C55E', label: 'Excellent', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)' },
  B: { color: '#F59E0B', label: 'Good',      bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
  C: { color: '#EF4444', label: 'Needs Improvement', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' },
}

// ── Crop history badge ───────────────────────────────────────────────────────
const CROP_COLORS = {
  wheat: '#F59E0B', rice: '#22C55E', tomato: '#EF4444', cotton: '#8B5CF6',
  maize: '#F97316', potato: '#84CC16', onion: '#A78BFA', default: '#6B7280',
}
function CropBadge({ name }) {
  const color = CROP_COLORS[name?.toLowerCase()] || CROP_COLORS.default
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      🌱 {name}
    </span>
  )
}

// ── Passport card (the printable artifact) ───────────────────────────────────
function PassportCard({ passport, qrDataUrl, cardRef }) {
  const grade = passport.grade
  const gm = GRADE_META[grade]

  return (
    <div
      ref={cardRef}
      style={{
        width: 400,
        height: 253,
        background: 'linear-gradient(135deg, #0a1a10 0%, #0d2416 40%, #071410 100%)',
        borderRadius: 14,
        border: `1.5px solid ${gm.border}`,
        boxSizing: 'border-box',
        fontFamily: "'Space Grotesk', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Top stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${gm.color}, transparent)`,
      }} />

      {/* Background watermark */}
      <div style={{
        position: 'absolute', right: -10, top: -10,
        fontSize: 120, opacity: 0.04, userSelect: 'none', lineHeight: 1,
      }}>🌿</div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px 6px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>🌱</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#22C55E', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
            AgriSahayak — Soil Health Passport
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 7, margin: 0 }}>
            Government of India · Digital Agriculture Initiative
          </p>
        </div>
        {/* Grade badge */}
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: gm.bg, border: `1.5px solid ${gm.border}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: gm.color, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{grade}</span>
          <span style={{ color: gm.color, fontSize: 6, fontWeight: 600 }}>GRADE</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 14px' }} />

      {/* Body */}
      <div style={{ display: 'flex', padding: '8px 14px', gap: 10 }}>

        {/* Left column — farmer + land info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Farmer</p>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, margin: 0 }}>{passport.farmerName}</p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Land</p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 500, margin: 0 }}>{passport.landName}</p>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>📍</span>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8, margin: 0 }}>{passport.gps}</p>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
            {(passport.cropHistory || []).slice(0, 4).map((c, i) => (
              <span key={i} style={{
                fontSize: 7, padding: '1px 5px', borderRadius: 4,
                background: 'rgba(34,197,94,0.12)', color: '#22C55E',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>🌱 {c}</span>
            ))}
          </div>
        </div>

        {/* Middle column — NPK + pH */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 7, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Soil Analysis</p>
          {[
            { label: 'N (Nitrogen)', value: `${passport.n} kg/ha`, color: '#22C55E' },
            { label: 'P (Phosphorus)', value: `${passport.p} kg/ha`, color: '#60A5FA' },
            { label: 'K (Potassium)', value: `${passport.k} kg/ha`, color: '#F59E0B' },
            { label: 'pH', value: passport.ph, color: '#A78BFA' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8 }}>{label}</span>
              <span style={{ color, fontSize: 9, fontWeight: 700 }}>{value}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '2px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 7 }}>Status</span>
            <span style={{ color: gm.color, fontSize: 8, fontWeight: 700 }}>{gm.label}</span>
          </div>
        </div>

        {/* Right column — QR */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          {qrDataUrl
            ? <img src={qrDataUrl} width={64} height={64} alt="QR" style={{ borderRadius: 4, background: '#fff', padding: 2 }} />
            : <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.06)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>▓</div>
          }
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 6, textAlign: 'center', margin: 0 }}>Scan to verify</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '4px 14px', background: 'rgba(0,0,0,0.3)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 7, margin: 0 }}>
          Issued: {passport.issuedAt}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 7, margin: 0 }}>
          ID: {passport.passportId}
        </p>
        <p style={{ color: 'rgba(34,197,94,0.6)', fontSize: 7, margin: 0 }}>agrisahayak.local</p>
      </div>
    </div>
  )
}

// ── NPK Input form ────────────────────────────────────────────────────────────
function SoilInputForm({ initial, onSave }) {
  const [vals, setVals] = useState(initial)
  const set = (k) => (e) => setVals(v => ({ ...v, [k]: e.target.value }))

  const fields = [
    { key: 'n', label: 'Nitrogen (N)', unit: 'kg/ha', placeholder: '40–80', color: 'text-green-400' },
    { key: 'p', label: 'Phosphorus (P)', unit: 'kg/ha', placeholder: '20–40', color: 'text-blue-400' },
    { key: 'k', label: 'Potassium (K)', unit: 'kg/ha', placeholder: '150–250', color: 'text-amber-400' },
    { key: 'ph', label: 'pH', unit: '', placeholder: '6.0–7.5', color: 'text-violet-400' },
  ]

  return (
    <div className="card p-4 space-y-3">
      <p className="text-xs font-semibold text-text-3 uppercase tracking-wide flex items-center gap-2">
        <FlaskConical size={13} /> Latest Soil Test Results
      </p>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ key, label, unit, placeholder, color }) => (
          <div key={key}>
            <label htmlFor={`soil-${key}`} className={`text-xs font-medium ${color} block mb-1`}>{label}</label>
            <div className="relative">
              <input
                id={`soil-${key}`}
                type="number"
                step="0.1"
                min="0"
                className="input w-full pr-12 text-sm"
                placeholder={placeholder}
                value={vals[key]}
                onChange={set(key)}
              />
              {unit && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3 text-xs">{unit}</span>}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary w-full" onClick={() => onSave(vals)}>
        <CheckCircle2 size={14} /> Generate Passport
      </button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SoilPassport() {
  const { state } = useApp()
  const cardRef = useRef()

  const farmer = state.farmer || {}
  const cycles = state.cycles || []

  // ── Load / persist soil data in localStorage ────────────────────────────────
  function loadSoilData() {
    try { return JSON.parse(localStorage.getItem('soilTestData') || 'null') } catch { return null }
  }
  const [soilData, setSoilData_] = useState(loadSoilData)
  function saveSoilData(data) {
    const parsed = {
      n: parseFloat(data.n) || 52,
      p: parseFloat(data.p) || 28,
      k: parseFloat(data.k) || 195,
      ph: parseFloat(data.ph) || 6.8,
    }
    localStorage.setItem('soilTestData', JSON.stringify(parsed))
    setSoilData_(parsed)
  }

  const [showForm, setShowForm] = useState(!soilData)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [toast, setToast] = useState(null)

  // ── Stable passport ID — generated once on mount so generateQR never loops ──
  const [passportId] = useState(() => {
    const fId = (state.farmer?.id || 'DEMO').toString().slice(0, 4).toUpperCase()
    return `AS-${fId}-${Date.now().toString(36).toUpperCase().slice(-5)}`
  })

  // ── Build passport object (memoised — prevents infinite render loops) ────────
  const passport = useMemo(() => {
    const f = state.farmer || {}
    const c = state.cycles || []
    const sd = soilData || { n: 52, p: 28, k: 195, ph: 6.8 }
    const grade = calcSoilGrade(sd.n, sd.p, sd.k, sd.ph)

    const land = f.lands?.[0] || {}
    const landName = land.name || land.land_name || 'My Farm'
    const lat = land.latitude || land.lat || f.latitude || null
    const lon = land.longitude || land.lon || f.longitude || null
    const gps = lat && lon ? `${parseFloat(lat).toFixed(4)}°N, ${parseFloat(lon).toFixed(4)}°E` : 'GPS not set'

    const cropHistory = [...new Set(
      c.map(cy => cy.crop_name || cy.cropName).filter(Boolean)
    )].slice(0, 5)

    const diseaseCount = c.reduce((sum, cy) => sum + (cy.disease_reports?.length || 0), 0)
    const issuedAt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

    return {
      farmerName: f.full_name || f.name || 'Farmer',
      landName,
      gps,
      grade,
      n: sd.n,
      p: sd.p,
      k: sd.k,
      ph: sd.ph,
      cropHistory,
      diseaseCount,
      passportId,
      issuedAt,
      state: f.state || '',
      district: f.district || '',
      phone: f.phone || '',
      activeCycles: c.filter(cy => cy.status !== 'completed').length,
      totalCycles: c.length,
    }
  }, [state.farmer, state.cycles, soilData, passportId])

  // ── QR generation ────────────────────────────────────────────────────────────
  const generateQR = useCallback(async () => {
    const payload = JSON.stringify({
      id: passport.passportId,
      farmer: passport.farmerName,
      land: passport.landName,
      gps: passport.gps,
      grade: passport.grade,
      npk: `${passport.n}-${passport.p}-${passport.k}`,
      ph: passport.ph,
      issued: passport.issuedAt,
    })
    const url = `agrisahayak.local/passport/${encodeURIComponent(passport.passportId)}?data=${encodeURIComponent(payload)}`
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      })
      setQrDataUrl(dataUrl)
    } catch (e) {
      console.error('QR generation failed', e)
    }
  }, [passport])

  useEffect(() => {
    if (!showForm) generateQR()
  }, [showForm, generateQR])

  // ── SVG → canvas helper (for html2canvas compatibility) ─────────────────────
  async function svgToCanvas(svg) {
    const rect = svg.getBoundingClientRect()
    const w = Math.round(rect.width) || 24
    const h = Math.round(rect.height) || 24
    const svgStr = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const blobUrl = URL.createObjectURL(blob)
    try {
      const img = new Image()
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = blobUrl })
      const tmp = document.createElement('canvas')
      const dpr = window.devicePixelRatio || 1
      tmp.width = w * dpr
      tmp.height = h * dpr
      tmp.style.width = w + 'px'
      tmp.style.height = h + 'px'
      tmp.getContext('2d').drawImage(img, 0, 0, tmp.width, tmp.height)
      return tmp
    } finally {
      URL.revokeObjectURL(blobUrl)
    }
  }

  // ── PDF download ─────────────────────────────────────────────────────────────
  async function downloadPDF() {
    if (!cardRef.current) return
    setPdfLoading(true)
    setDownloadProgress(0)
    setToast(null)

    // Replace SVG elements with canvas equivalents so html2canvas captures them
    const svgEls = [...cardRef.current.querySelectorAll('svg')]
    const restores = []
    for (const svg of svgEls) {
      try {
        const tmp = await svgToCanvas(svg)
        svg.parentNode.replaceChild(tmp, svg)
        restores.push({ tmp, svg })
      } catch { /* leave SVG in place if conversion fails */ }
    }

    try {
      await document.fonts.ready
      setDownloadProgress(10)

      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0d1a13',
        logging: false,
        allowTaint: true,
      })
      setDownloadProgress(50)

      const dateStr = new Date().toISOString().slice(0, 10)
      const safeName = (passport.farmerName || 'Farmer').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')
      const filename = `soil-passport-${safeName}-${dateStr}.pdf`

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 54] })
      pdf.addImage(imgData, 'PNG', 0, 0, 85, 54)
      pdf.save(filename)
      setDownloadProgress(100)
      setToast('✅ PDF downloaded!')
    } catch {
      // PNG fallback
      try {
        const { default: html2canvas } = await import('html2canvas')
        const c = await html2canvas(cardRef.current, {
          scale: 3, useCORS: true, backgroundColor: '#0d1a13', logging: false, allowTaint: true,
        })
        await new Promise(res => c.toBlob(blob => {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'soil-passport.png'
          a.click()
          URL.revokeObjectURL(a.href)
          res()
        }, 'image/png'))
      } catch { /* nothing more to do */ }
      setToast('⚠️ PDF failed, downloaded as PNG instead')
    } finally {
      // Restore original SVG elements
      for (const { tmp, svg } of restores) {
        tmp.parentNode?.replaceChild(svg, tmp)
      }
      setPdfLoading(false)
      setTimeout(() => { setDownloadProgress(0); setToast(null) }, 4000)
    }
  }

  // ── WhatsApp share ────────────────────────────────────────────────────────────
  function shareWhatsApp() {
    const gm = GRADE_META[passport.grade]
    const text = [
      '🌱 *My Soil Health Passport — AgriSahayak*',
      '━━━━━━━━━━━━━━━━━━━━',
      `👨‍🌾 Farmer: ${passport.farmerName}`,
      `🏡 Land: ${passport.landName}`,
      `📍 GPS: ${passport.gps}`,
      '',
      `🏆 Soil Grade: *${passport.grade} (${gm.label})*`,
      '',
      '🔬 Soil Analysis:',
      `  • Nitrogen (N): ${passport.n} kg/ha`,
      `  • Phosphorus (P): ${passport.p} kg/ha`,
      `  • Potassium (K): ${passport.k} kg/ha`,
      `  • pH: ${passport.ph}`,
      '',
      passport.cropHistory.length > 0 ? `🌾 Crops grown: ${passport.cropHistory.join(', ')}` : '',
      '',
      `📅 Issued: ${passport.issuedAt}`,
      `🔖 Passport ID: ${passport.passportId}`,
      '━━━━━━━━━━━━━━━━━━━━',
      '_Generated by AgriSahayak AI Platform_',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  const gm = GRADE_META[passport.grade]

  return (
    <div className="page-content space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Soil Health Passport</h1>
          <p className="text-text-3 text-sm mt-0.5">
            Digital, QR-shareable proof of your land's soil quality
          </p>
        </div>
        <button
          className="btn-icon"
          onClick={() => setShowForm(s => !s)}
          title="Edit soil data"
          aria-label={showForm ? 'Hide soil data form' : 'Edit soil test data'}
          aria-expanded={showForm}
        >
          <Edit3 size={15} aria-hidden="true" />
        </button>
      </header>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(15,40,24,1) 50%, rgba(9,16,14,1) 100%)' }}>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl opacity-15 select-none">🌿</div>
        <div className="flex items-center gap-4">
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: gm.bg, border: `2px solid ${gm.border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: gm.color, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{passport.grade}</span>
            <span style={{ color: gm.color, fontSize: 8, fontWeight: 600 }}>GRADE</span>
          </div>
          <div>
            <p className="text-primary font-semibold">{passport.farmerName}</p>
            <p className="text-text-3 text-sm">{passport.landName} · {passport.gps}</p>
            <p className="text-xs mt-0.5" style={{ color: gm.color }}>
              <ShieldCheck size={10} className="inline mr-1" />
              {gm.label} Soil Health
            </p>
          </div>
        </div>
      </div>

      {/* Soil input form (collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <SoilInputForm
              initial={{ n: soilData?.n ?? 52, p: soilData?.p ?? 28, k: soilData?.k ?? 195, ph: soilData?.ph ?? 6.8 }}
              onSave={(vals) => { saveSoilData(vals); setShowForm(false) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Passport Card preview */}
      {!showForm && (
        <div className="card p-5 flex flex-col items-center gap-4">
          <p className="text-xs font-semibold text-text-3 uppercase tracking-wide self-start flex items-center gap-2">
            <QrCode size={13} /> Passport Card (85×54mm)
          </p>

          {/* Scaled preview wrapper */}
          <div style={{ overflow: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PassportCard passport={passport} qrDataUrl={qrDataUrl} cardRef={cardRef} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full flex-wrap">
            <button
              className="btn-primary flex-1 min-w-[140px]"
              onClick={downloadPDF}
              disabled={pdfLoading || !qrDataUrl}
            >
              {pdfLoading
                ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
                : <><Download size={13} /> Download PDF</>}
            </button>
            <button
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}
              onClick={shareWhatsApp}
            >
              <Share2 size={13} /> Share via WhatsApp
            </button>
          </div>
          {/* Download progress bar */}
          <AnimatePresence>
            {pdfLoading && (
              <motion.div
                className="w-full space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="h-1 bg-surface-2 rounded-full overflow-hidden w-full">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-text-3 text-center">
                  {downloadProgress < 20 ? 'Preparing fonts…' : downloadProgress < 60 ? 'Capturing card…' : 'Saving PDF…'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Detailed stats cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* NPK breakdown */}
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-3 flex items-center gap-2">
            <FlaskConical size={13} /> NPK + pH Breakdown
          </p>
          <div className="space-y-3">
            {[
              { label: 'Nitrogen (N)', value: passport.n, unit: 'kg/ha', max: 120, color: '#22C55E', range: '40–80' },
              { label: 'Phosphorus (P)', value: passport.p, unit: 'kg/ha', max: 80, color: '#60A5FA', range: '20–40' },
              { label: 'Potassium (K)', value: passport.k, unit: 'kg/ha', max: 400, color: '#F59E0B', range: '150–250' },
            ].map(({ label, value, unit, max, color, range }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-2">{label}</span>
                  <span className="font-semibold" style={{ color }}>
                    {value} {unit}
                    <span className="text-text-3 font-normal ml-1">(ideal: {range})</span>
                  </span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center bg-surface-2 rounded-lg p-2.5">
              <span className="text-text-2 text-sm">pH Level</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-violet-400">{passport.ph}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  passport.ph >= 6.0 && passport.ph <= 7.5
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {passport.ph >= 6.0 && passport.ph <= 7.5 ? 'Optimal' : 'Adjust needed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Farm intel */}
        <div className="card p-4 space-y-4">
          <p className="text-xs font-semibold text-text-3 uppercase tracking-wide flex items-center gap-2">
            <Leaf size={13} /> Farm Intelligence
          </p>

          {/* Crop history */}
          <div>
            <p className="text-xs text-text-3 mb-2 flex items-center gap-1.5">
              <CalendarDays size={11} /> Crop History ({cycles.length} seasons)
            </p>
            {passport.cropHistory.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {passport.cropHistory.map((c, i) => <CropBadge key={i} name={c} />)}
              </div>
            ) : (
              <p className="text-text-3 text-xs italic">No crop cycles recorded yet</p>
            )}
          </div>

          {/* Risk indicators */}
          <div className="space-y-2">
            {[
              {
                icon: passport.diseaseCount > 0 ? <AlertCircle size={12} className="text-amber-400" /> : <CheckCircle2 size={12} className="text-green-400" />,
                label: 'Disease Events',
                value: passport.diseaseCount > 0 ? `${passport.diseaseCount} detected` : 'None recorded',
                ok: passport.diseaseCount === 0,
              },
              {
                icon: <CheckCircle2 size={12} className="text-green-400" />,
                label: 'Active Cycles',
                value: `${passport.activeCycles} running`,
                ok: true,
              },
              {
                icon: passport.gps !== 'GPS not set'
                  ? <MapPin size={12} className="text-green-400" />
                  : <AlertCircle size={12} className="text-text-3" />,
                label: 'Location',
                value: passport.gps !== 'GPS not set' ? 'GPS verified' : 'Not set',
                ok: passport.gps !== 'GPS not set',
              },
            ].map(({ icon, label, value, ok }) => (
              <div key={label} className="flex items-center justify-between bg-surface-2 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-text-2 text-xs">{label}</span>
                </div>
                <span className={`text-xs font-medium ${ok ? 'text-green-400' : 'text-amber-400'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-text-3 uppercase tracking-wide mb-3">How to use your Passport</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: '🏦', title: 'Bank Loan Application', desc: 'Present the PDF as proof of land quality when applying for Kisan Credit Card or crop loans' },
            { icon: '🛒', title: 'Sell to Buyers', desc: 'Share via WhatsApp to prove crop quality. Buyers can scan the QR code to verify soil grade' },
            { icon: '🤝', title: 'Co-operative Membership', desc: 'Submit to FPO / PACS as documentation of your farm\'s soil health for membership or insurance' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-surface-2 rounded-lg p-3">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-text-1 text-sm font-medium mb-1">{title}</p>
              <p className="text-text-3 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xl"
            style={{
              background: 'rgba(10,21,16,0.95)',
              border: toast?.startsWith('⚠️') ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(34,197,94,0.4)',
              color: toast?.startsWith('⚠️') ? '#f87171' : '#22C55E',
              backdropFilter: 'blur(12px)',
              whiteSpace: 'nowrap',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

```


## `frontend-src/src/pages/Weather.jsx`


```jsx
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
function FarmingTip({ tip, t }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  // Strip any residual markdown bold/italic from the tip text
  function cleanTip(raw) {
    if (!raw) return ''
    return raw
      .replace(/\*{1,3}([^*\n]+?)\*{1,3}/g, '$1')
      .replace(/_{1,2}([^_\n]+?)_{1,2}/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[\-\*]\s+/gm, '• ')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
  }

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

```


## `frontend-src/src/store/useOutbreakMapStore.js`


```javascript
import { create } from 'zustand'

export const useOutbreakMapStore = create((set) => ({
  search: '',
  stateFilter: 'all',
  statusFilter: 'all',
  setSearch: (search) => set({ search }),
  setStateFilter: (stateFilter) => set({ stateFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  resetFilters: () => set({ search: '', stateFilter: 'all', statusFilter: 'all' }),
}))

```
