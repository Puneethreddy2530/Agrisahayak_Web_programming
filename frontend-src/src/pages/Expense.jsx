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
