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
