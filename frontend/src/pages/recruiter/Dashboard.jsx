import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../api'

const ALL_SKILLS = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'Machine Learning', 'Data Science', 'Docker', 'AWS', 'TypeScript', 'Go', 'MongoDB']

export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingStatus, setPendingStatus] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', skills_required: [], min_cgpa: '', experience_years: '' })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const res = await api.get('/recruiters/jobs')
      setJobs(res.data)
    } catch (err) {
      if (err.response?.status === 403) setPendingStatus(true)
    }
  }

  const toggleSkill = (skill) => {
    setForm(f => ({ ...f, skills_required: f.skills_required.includes(skill) ? f.skills_required.filter(s => s !== skill) : [...f.skills_required, skill] }))
  }

  const handlePost = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      await api.post('/recruiters/jobs', { ...form, min_cgpa: parseFloat(form.min_cgpa) || 0, experience_years: parseInt(form.experience_years) || 0 })
      setSuccess('Job posted successfully!')
      setShowForm(false)
      setForm({ title: '', description: '', skills_required: [], min_cgpa: '', experience_years: '' })
      await loadJobs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job.')
    } finally { setLoading(false) }
  }

  if (pendingStatus) {
    return (
      <div className="page-container">
        <Sidebar role="recruiter" />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>⏳</div>
            <h2 style={{ marginBottom: 12 }}>Pending Admin Approval</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
              Your recruiter account is still pending approval from the admin. You'll gain access to all features once approved.
            </p>
            <div className="alert alert-warning">
              💡 Contact the platform admin to expedite approval.
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Sidebar role="recruiter" />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>Welcome, <span className="gradient-text">{name}</span> 🏢</h1>
            <p>Manage your job listings and find the best candidates</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '+ Post New Job'}
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid stagger">
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Active Job Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Active</div>
            <div className="stat-label">Account Status</div>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Post Job Form */}
        {showForm && (
          <div className="card animate-in" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>📝 Post a New Job</h3>
            <form onSubmit={handlePost}>
              <div className="form-group">
                <label>Job Title</label>
                <input className="form-input" placeholder="e.g. Senior React Developer" required value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-textarea" placeholder="Job description and responsibilities..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Min CGPA</label>
                  <input className="form-input" type="number" step="0.1" min="0" max="10" placeholder="e.g. 7.5" value={form.min_cgpa}
                    onChange={e => setForm({ ...form, min_cgpa: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input className="form-input" type="number" min="0" placeholder="e.g. 2" value={form.experience_years}
                    onChange={e => setForm({ ...form, experience_years: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Required Skills</label>
                <div className="chips-container" tabIndex={0}>
                  {ALL_SKILLS.map(s => (
                    <span key={s} className={`chip ${form.skills_required.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>
                      {form.skills_required.includes(s) ? '✓ ' : ''}{s}
                    </span>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner spinner-sm" /> Posting...</> : '🚀 Post Job'}
              </button>
            </form>
          </div>
        )}

        {/* Jobs List */}
        <h3 style={{ marginBottom: 16 }}>📋 Your Job Listings</h3>
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>No jobs posted yet. Post your first listing above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }} className="stagger">
            {jobs.map(job => (
              <div key={job.id} className="card">
                <h4 style={{ marginBottom: 6 }}>{job.title}</h4>
                <p style={{ color: '#06b6d4', fontSize: 13, marginBottom: 12 }}>{job.company_name}</p>
                {job.description && <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>{job.description}</p>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {(Array.isArray(job.skills_required) ? job.skills_required : JSON.parse(job.skills_required || '[]')).map((s, i) => (
                    <span key={i} className="badge badge-purple">{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b' }}>
                  <span>CGPA: {job.min_cgpa || 'Any'}</span>
                  <span>Exp: {job.experience_years}+ yrs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
