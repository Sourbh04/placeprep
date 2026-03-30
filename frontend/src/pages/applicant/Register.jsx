import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'

const ALL_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL',
  'Machine Learning', 'Data Science', 'Django', 'FastAPI', 'Docker',
  'Kubernetes', 'AWS', 'TypeScript', 'Go', 'Rust', 'MongoDB', 'PostgreSQL',
  'Git', 'Linux', 'REST APIs', 'GraphQL', 'TensorFlow', 'PyTorch',
]

const DEGREES = ['B.Tech', 'B.Sc', 'B.E', 'M.Tech', 'M.Sc', 'MBA', 'BCA', 'MCA', 'PhD', 'Other']
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated', 'Post Graduate']

export default function ApplicantRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', degree: '', year_of_study: '', other_info: '',
  })
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleSkill = (skill) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!skills.length) { setError('Please select at least one skill'); return }
    setLoading(true); setError('')
    try {
      const res = await api.post('/applicants/register', { ...form, skills })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', 'applicant')
      localStorage.setItem('user_id', res.data.user_id)
      localStorage.setItem('name', res.data.name)
      navigate('/applicant/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <Link to="/" className="auth-back">← Back to Home</Link>
        <h1>🎓 Applicant Registration</h1>
        <p className="subtitle">Create your account and start your AI-powered job search journey</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" placeholder="John Doe" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input className="form-input" placeholder="+91 9876543210" required value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" type="email" placeholder="john@example.com" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" placeholder="Min 8 characters" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Degree</label>
              <select className="form-select" required value={form.degree}
                onChange={e => setForm({ ...form, degree: e.target.value })}>
                <option value="">Select Degree</option>
                {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year of Study</label>
              <select className="form-select" required value={form.year_of_study}
                onChange={e => setForm({ ...form, year_of_study: e.target.value })}>
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Skills (select all that apply)</label>
            <div className="chips-container" tabIndex={0}>
              {ALL_SKILLS.map(s => (
                <span key={s} className={`chip ${skills.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>
                  {skills.includes(s) ? '✓ ' : ''}{s}
                </span>
              ))}
            </div>
            {skills.length > 0 && <p style={{ fontSize: 12, color: '#a855f7', marginTop: 6 }}>{skills.length} skill(s) selected</p>}
          </div>

          <div className="form-group">
            <label>Additional Info (Optional)</label>
            <textarea className="form-textarea" placeholder="Certifications, projects, achievements..." value={form.other_info}
              onChange={e => setForm({ ...form, other_info: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Creating Account...</> : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748b' }}>
          Already have an account? Contact admin or{' '}
          <Link to="/" style={{ color: '#a855f7' }}>go back</Link>
        </p>
      </div>
    </div>
  )
}
