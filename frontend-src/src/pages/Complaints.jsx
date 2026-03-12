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
