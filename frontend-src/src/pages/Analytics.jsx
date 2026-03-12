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
