import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/admin/login', form)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', 'admin')
      localStorage.setItem('user_id', '0')
      localStorage.setItem('name', 'Admin')
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-back">← Back to Home</Link>
        <div style={{ fontSize: 56, marginBottom: 16, textAlign: 'center' }}>⚡</div>
        <h1 style={{ textAlign: 'center' }}>Admin Login</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>Secure access to the platform control panel</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input className="form-input" type="email" placeholder="admin@resume.ai" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" placeholder="••••••••" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : '⚡ Sign In to Admin Panel'}
          </button>
        </form>

        <div className="alert alert-info" style={{ marginTop: 20 }}>
          💡 <strong>Default credentials:</strong><br />
          Email: admin@resume.ai<br />
          Password: Admin@123
        </div>
      </div>
    </div>
  )
}
