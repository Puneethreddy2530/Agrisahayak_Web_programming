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
