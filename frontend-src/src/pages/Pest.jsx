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
