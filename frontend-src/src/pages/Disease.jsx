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
