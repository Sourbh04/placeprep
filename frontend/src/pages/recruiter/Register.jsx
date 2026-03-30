import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'

export default function RecruiterRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    company_name: '', recruiter_name: '', email: '', phone: '', password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/recruiters/register', form)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', 'recruiter')
      localStorage.setItem('user_id', res.data.user_id)
      localStorage.setItem('name', res.data.name)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>⏳</div>
          <h1 style={{ marginBottom: 12 }}>Request Submitted!</h1>
          <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.7 }}>
            Your recruiter account request has been sent to the admin for approval.
            You'll be able to access the dashboard once approved.
          </p>
          <div className="alert alert-info" style={{ textAlign: 'left' }}>
            💡 <strong>Next Step:</strong> Ask the admin to log into the Admin Panel and approve your account.
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/recruiter/dashboard')}>
              🏠 Go to Dashboard
            </button>
            <Link to="/" className="btn btn-secondary">← Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <Link to="/" className="auth-back">← Back to Home</Link>
        <h1>🏢 Recruiter Registration</h1>
        <p className="subtitle">Register your company and start finding top talent</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          📋 Your account will be reviewed by admin before activation.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input className="form-input" placeholder="Acme Corp" required value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input className="form-input" placeholder="Jane Smith" required value={form.recruiter_name}
              onChange={e => setForm({ ...form, recruiter_name: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Work Email</label>
              <input className="form-input" type="email" placeholder="jane@acme.com" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-input" placeholder="+91 9876543210" required value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" placeholder="Create a strong password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Submitting...</> : 'Submit Request →'}
          </button>
        </form>
      </div>
    </div>
  )
}
