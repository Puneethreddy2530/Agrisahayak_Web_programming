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
