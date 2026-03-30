import { useNavigate, useLocation } from 'react-router-dom'

const navItems = {
  applicant: [
    { icon: '🏠', label: 'Dashboard', path: '/applicant/dashboard' },
    { icon: '🧠', label: 'Resume Analyzer', path: '/applicant/resume' },
    { icon: '💼', label: 'Related Jobs', path: '/applicant/jobs' },
    { icon: '✅', label: 'Eligibility Checker', path: '/applicant/eligibility' },
  ],
  recruiter: [
    { icon: '🏠', label: 'Dashboard', path: '/recruiter/dashboard' },
    { icon: '👥', label: 'Applicants', path: '/recruiter/applicants' },
  ],
  admin: [
    { icon: '⚡', label: 'Dashboard', path: '/admin/dashboard' },
  ],
}

export default function Sidebar({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const name = localStorage.getItem('name') || 'User'
  const items = navItems[role] || []

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>⚡ ResumeAI</h2>
        <p>{role.charAt(0).toUpperCase() + role.slice(1)} Portal</p>
      </div>

      <div style={{ padding: '12px', marginBottom: 8, background: 'rgba(124,58,237,0.08)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.15)' }}>
        <div style={{ fontSize: 13, color: '#94a3b8' }}>Signed in as</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
      </div>

      {items.map((item) => (
        <button
          key={item.path}
          className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div style={{ marginTop: 'auto' }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
        <button className="sidebar-nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
          <span className="nav-icon">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
