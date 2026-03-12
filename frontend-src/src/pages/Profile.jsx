import { useState, useEffect, useRef } from 'react'
import { User, MapPin, Plus, LogOut, Eye, EyeOff, Loader2, CheckCircle2, X, Phone, Lock, KeyRound, Wheat, ShieldCheck, MoreVertical, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { authApi, farmerApi } from '../api/client'
import { useApp } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'

// ── Hero banner ────────────────────────────────────────
function AuthHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6"
      style={{ background: 'linear-gradient(135deg, #0f2e1a 0%, #0d1f11 50%, #091408 100%)' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 50%, #16a34a 0%, transparent 50%)' }} />
      <div className="relative px-6 py-8 flex items-center gap-5">
        <div className="text-5xl">🌾</div>
        <div>
          <h2 className="font-display text-text-1 text-xl font-bold">Welcome to AgriSahayak</h2>
          <p className="text-text-3 text-sm mt-1">Your AI-powered farming assistant</p>
          <div className="flex gap-3 mt-3">
            {[['🌱','Free'], ['🤖','AI Powered'], ['📱','Multi-language']].map(([e,l]) => (
              <span key={l} className="text-xs bg-white/10 text-text-2 px-2 py-0.5 rounded-full">{e} {l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthForms({ onSuccess }) {
  const [tab, setTab] = useState('login')       // login | register | otp
  const [authMode, setAuthMode] = useState('pw') // pw | otp (for login)
  const [form, setForm] = useState({ name: '', phone: '', username: '', password: '', district: '', state: '', language: 'hi' })
  const [otpPhone, setOtpPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [demoOtp, setDemoOtp] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submitLogin(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.login(form.username, form.password)
      onSuccess(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function submitRegister(e) {
    e.preventDefault(); setLoading(true); setError(null)
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
    try {
      const res = await authApi.register({
        name: form.name, phone: form.phone, username: form.username,
        password: form.password, state: form.state, district: form.district,
        language: form.language,
      })
      onSuccess(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function requestOtp(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.requestOtp(otpPhone)
      setOtpSent(true)
      if (res.demo_otp) setDemoOtp(res.demo_otp)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function verifyOtp(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await authApi.verifyOtp(otpPhone, otp)
      onSuccess(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const STATES = ['Maharashtra','Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan','Gujarat','Karnataka','Andhra Pradesh','Telangana','Bihar','West Bengal','Tamil Nadu','Odisha','other']

  return (
    <div className="max-w-md mx-auto">
      <AuthHero />
      <div className="card p-6">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-surface-2 p-1 rounded-lg mb-5">
          {[['login','Sign In'],['register','Register'],['otp','OTP Login']].map(([t, l]) => (
            <button key={t} onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${tab === t ? 'bg-primary text-black' : 'text-text-3 hover:text-text-2'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Login with username/password */}
        {tab === 'login' && (
          <form onSubmit={submitLogin} className="space-y-4">
            <div>
              <label htmlFor="prof-login-username" className="label">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                <input id="prof-login-username" className="input w-full pl-9" required value={form.username} onChange={set('username')} placeholder="Your username" autoComplete="username" />
              </div>
            </div>
            <div>
              <label htmlFor="prof-login-password" className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                <input id="prof-login-password" className="input w-full pl-9 pr-10" required type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Password" autoComplete="current-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><ShieldCheck size={15}/> Sign In</>}
            </button>
          </form>
        )}

        {/* Register */}
        {tab === 'register' && (
          <form onSubmit={submitRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                <input className="input w-full" required value={form.name} onChange={set('name')} placeholder="Your full name" />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input className="input w-full" required type="tel" pattern="[6-9][0-9]{9}" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" />
              </div>
            </div>
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input className="input w-full pl-9" required minLength={4} value={form.username} onChange={set('username')} placeholder="Choose a username (min 4 chars)" autoComplete="username" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input className="input w-full pl-9 pr-10" required type={showPw ? 'text' : 'password'} minLength={6} value={form.password} onChange={set('password')} placeholder="Min 6 characters" autoComplete="new-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">District</label>
                <input className="input w-full" required value={form.district} onChange={set('district')} placeholder="Your district" />
              </div>
              <div>
                <label className="label">State</label>
                <select className="input w-full" required value={form.state} onChange={set('state')}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Preferred Language</label>
              <select className="input w-full" value={form.language} onChange={set('language')}>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><Wheat size={15}/> Create Account</>}
            </button>
          </form>
        )}

        {/* OTP Login */}
        {tab === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={requestOtp} className="space-y-4">
                <div>
                  <label htmlFor="prof-otp-phone" className="label">Mobile Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                    <input id="prof-otp-phone" className="input w-full pl-9" required type="tel" pattern="[6-9][0-9]{9}" value={otpPhone} onChange={e => setOtpPhone(e.target.value)} placeholder="10-digit mobile number" />
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <><Phone size={15}/> Send OTP</>}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                  <p className="text-text-2 text-sm">OTP sent to ****{otpPhone.slice(-4)}</p>
                  {demoOtp && <p className="text-primary font-bold text-lg mt-1">Demo OTP: {demoOtp}</p>}
                </div>
                <div>
                  <label htmlFor="prof-otp-code" className="label">Enter OTP</label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" aria-hidden="true" />
                    <input id="prof-otp-code" className="input w-full pl-9 text-center text-xl tracking-widest" required type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" aria-label="Enter 6-digit OTP" autoFocus />
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
                <div className="flex gap-2">
                  <button type="button" className="btn-secondary flex-1" onClick={() => { setOtpSent(false); setOtp(''); setDemoOtp(null); setError(null) }}>
                    Change Number
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading || otp.length < 4}>
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <><CheckCircle2 size={15}/> Verify OTP</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AddLandModal({ farmerId, onAdd, onClose, editLand }) {
  const isEdit = !!editLand
  const [form, setForm] = useState(
    isEdit
      ? { name: editLand.name || '', area: editLand.area_acres ?? '', soil_type: editLand.soil_type || 'loamy', irrigation_type: editLand.irrigation_type || 'rainfed' }
      : { name: '', area: '', soil_type: 'loamy', irrigation_type: 'rainfed' }
  )
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault(); setLoading(true); setErr('')
    try {
      if (isEdit) {
        const updated = await farmerApi.updateLand(editLand.id, {
          name: form.name,
          area: parseFloat(form.area),
          soil_type: form.soil_type,
          irrigation_type: form.irrigation_type,
        })
        onAdd(updated, true)
      } else {
        const land = await farmerApi.addLand({
          farmer_id: farmerId,
          name: form.name,
          area: parseFloat(form.area),
          soil_type: form.soil_type,
          irrigation_type: form.irrigation_type,
        })
        onAdd(land, false)
      }
    } catch (ex) { setErr(ex.message || (isEdit ? 'Failed to update land' : 'Failed to add land')) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-text-1">{isEdit ? 'Edit Land' : 'Add Land'}</h3>
          <button className="btn-icon" onClick={onClose}><X size={14}/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Land Name</label><input className="input w-full" required value={form.name} onChange={set('name')} placeholder="e.g. North Field" /></div>
          <div><label className="label">Area (acres)</label><input className="input w-full" required type="number" step="0.1" min="0.1" value={form.area} onChange={set('area')} /></div>
          <div><label className="label">Soil Type</label>
            <select className="input w-full" required value={form.soil_type} onChange={set('soil_type')}>
              {[['black','Black'],['red','Red'],['alluvial','Alluvial'],['sandy','Sandy'],['loamy','Loamy'],['clay','Clay'],['silt','Silt']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><label className="label">Irrigation Type</label>
            <select className="input w-full" required value={form.irrigation_type} onChange={set('irrigation_type')}>
              {[['rainfed','Rainfed'],['canal','Canal'],['borewell','Borewell'],['drip','Drip'],['sprinkler','Sprinkler']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : (isEdit ? 'Save Changes' : 'Add Land')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Profile() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [showAddLand,   setShowAddLand]   = useState(false)
  const [editingLand,   setEditingLand]   = useState(null)   // land object to edit, or null
  const [confirmDelete, setConfirmDelete] = useState(null)   // land object to delete, or null
  const [openMenu,      setOpenMenu]      = useState(null)   // land id with open ⋮ menu
  const [toast,         setToast]         = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const toastTimer = useRef(null)

  function showToast(msg) {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  // Close three-dot menu on outside click
  useEffect(() => {
    if (!openMenu) return
    function onDoc(e) {
      if (!e.target.closest('[data-land-menu]')) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [openMenu])

  function handleAuth(res) {
    dispatch({ type: 'SET_TOKEN', payload: res.access_token || res.token })
    dispatch({ type: 'SET_FARMER', payload: res.farmer || res.user })
    navigate('/')
  }

  function handleAddLand(land, isEdit) {
    const currentLands = state.farmer?.lands || []
    const newLands = isEdit
      ? currentLands.map(l => (l.id === land.id ? land : l))
      : [...currentLands, land]
    dispatch({ type: 'SET_FARMER', payload: { ...state.farmer, lands: newLands } })
    setShowAddLand(false)
    setEditingLand(null)
    showToast(isEdit ? '✅ Land updated' : '✅ Land added')
  }

  async function handleDelete(land) {
    if ((land.active_cycles ?? 0) > 0) {
      showToast('⚠️ Cannot delete — this land has an active crop cycle.')
      setConfirmDelete(null)
      return
    }
    setDeleteLoading(true)
    try {
      await farmerApi.deleteLand(land.id)
      const newLands = (state.farmer?.lands || []).filter(l => l.id !== land.id)
      dispatch({ type: 'SET_FARMER', payload: { ...state.farmer, lands: newLands } })
      showToast('🗑️ Land deleted')
    } catch (e) {
      showToast('⚠️ Delete failed: ' + (e.message || 'Unknown error'))
    } finally {
      setDeleteLoading(false)
      setConfirmDelete(null)
    }
  }

  function logout() {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  if (!state.farmer) {
    return (
      <div className="page-content space-y-6">
        <header className="pt-2">
          <h1 className="font-display text-2xl font-bold text-text-1">Profile</h1>
          <p className="text-text-3 text-sm mt-0.5">Sign in to access your farm profile</p>
        </header>
        <AuthForms onSuccess={handleAuth} />
      </div>
    )
  }

  const farmer = state.farmer
  const lands = farmer.lands || []

  return (
    <div className="page-content space-y-5">
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Profile</h1>
          <p className="text-text-3 text-sm mt-0.5">Manage your account and lands</p>
        </div>
        {toast && (
          <span
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            {toast}
          </span>
        )}
      </header>

      {/* Farmer card */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-dim flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {(farmer.name || 'F')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-text-1 font-semibold text-lg">{farmer.name}</h2>
            <p className="text-text-3 text-sm">{farmer.phone}</p>
            {(farmer.village || farmer.district) && (
              <p className="text-text-2 text-sm flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-text-3" />
                {[farmer.village, farmer.district, farmer.state].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <span className="badge badge-green">{lands.length} {lands.length === 1 ? 'Land' : 'Lands'}</span>
          </div>
        </div>
      </div>

      {/* Lands */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-text-1 font-semibold">Your Lands</h3>
          <button className="btn-primary text-xs py-2 px-3 flex items-center gap-1" onClick={() => setShowAddLand(true)}>
            <Plus size={13} /> Add Land
          </button>
        </div>
        {lands.length === 0 ? (
          <div className="card p-8 text-center">
            <MapPin size={24} className="text-text-3 mx-auto mb-2" />
            <p className="text-text-2">No lands added yet</p>
            <p className="text-text-3 text-sm mt-1">Add your first land to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lands.map((land, i) => (
              <div key={land.id || i} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary-dim flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-1 font-medium truncate">{land.name || `Field ${i + 1}`}</p>
                  <p className="text-text-3 text-xs">{land.area_acres} acres • {land.soil_type || 'Unknown'} soil{land.location ? ` • ${land.location}` : ''}</p>
                </div>
                {/* Three-dot menu */}
                <div className="relative shrink-0" data-land-menu>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-3 transition-colors"
                    onClick={() => setOpenMenu(openMenu === (land.id || i) ? null : (land.id || i))}
                    aria-label="Land options"
                  >
                    <MoreVertical size={15} className="text-text-3" />
                  </button>
                  {openMenu === (land.id || i) && (
                    <div
                      className="absolute right-0 top-full mt-1 w-36 rounded-xl overflow-hidden z-30"
                      style={{ background: '#111d16', border: '1px solid rgba(34,197,94,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                    >
                      <button
                        className="w-full text-left px-3.5 py-2.5 text-sm text-text-2 hover:bg-surface-2 hover:text-text-1 transition-colors flex items-center gap-2"
                        onClick={() => { setEditingLand(land); setOpenMenu(null) }}
                      >
                        <Pencil size={13} className="text-primary" /> Edit
                      </button>
                      <button
                        className="w-full text-left px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        onClick={() => { setConfirmDelete(land); setOpenMenu(null) }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button onClick={logout} className="btn-secondary w-full flex items-center justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10">
        <LogOut size={15} /> Sign Out
      </button>

      {showAddLand && <AddLandModal farmerId={state.farmer?.farmer_id} onAdd={handleAddLand} onClose={() => setShowAddLand(false)} />}
      {editingLand && <AddLandModal farmerId={state.farmer?.farmer_id} onAdd={handleAddLand} onClose={() => setEditingLand(null)} editLand={editingLand} />}

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="card p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div>
                {(confirmDelete.active_cycles ?? 0) > 0 ? (
                  <>
                    <p className="text-text-1 font-semibold">Cannot Delete Land</p>
                    <p className="text-text-2 text-sm mt-1">
                      “{confirmDelete.name}” has an active crop cycle. Complete or remove it first.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-text-1 font-semibold">Delete “{confirmDelete.name}”?</p>
                    <p className="text-text-2 text-sm mt-1">This cannot be undone.</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setConfirmDelete(null)}>Cancel</button>
              {(confirmDelete.active_cycles ?? 0) === 0 && (
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                  disabled={deleteLoading}
                  onClick={() => handleDelete(confirmDelete)}
                >
                  {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={14} /> Delete</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
