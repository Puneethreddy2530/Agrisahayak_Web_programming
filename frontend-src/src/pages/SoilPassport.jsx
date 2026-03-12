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
