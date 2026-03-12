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
