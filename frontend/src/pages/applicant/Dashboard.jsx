import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import ScoreBar from '../../components/ScoreBar'
import api from '../../api'

export default function ApplicantDashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'Applicant'
  const userId = localStorage.getItem('user_id')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/resume/analysis/${userId}`).then(r => setAnalysis(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [userId])

  const quickActions = [
    { icon: '🧠', title: 'Resume Analyzer', desc: 'Upload & get AI analysis', path: '/applicant/resume', color: '#7c3aed' },
    { icon: '💼', title: 'Related Jobs', desc: 'Find matching opportunities', path: '/applicant/jobs', color: '#06b6d4' },
    { icon: '✅', title: 'Eligibility Checker', desc: 'Check job requirements', path: '/applicant/eligibility', color: '#10b981' },
  ]

  return (
    <div className="page-container">
      <Sidebar role="applicant" />
      <main className="main-content">
        <div className="page-header animate-in">
          <h1>Welcome back, <span className="gradient-text">{name}</span> 👋</h1>
          <p>Your AI-powered career dashboard — let's find your next opportunity</p>
        </div>

        {/* Score Overview */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : analysis ? (
          <div className="card stagger" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, marginBottom: 4 }}>📊 Your Resume Score</h2>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>Last analyzed · {new Date(analysis.analyzed_at).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, fontWeight: 900, background: 'linear-gradient(135deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                  {Math.round(analysis.score)}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>out of 100</div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <ScoreBar value={Math.round(analysis.score)} max={100} />
            </div>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{analysis.summary}</p>
            </div>
            {analysis.suggested_roles && (
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {JSON.parse(analysis.suggested_roles).map((r, i) => (
                  <span key={i} className="badge badge-cyan">✨ {r}</span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card stagger" style={{ marginBottom: 24, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
            <h3 style={{ marginBottom: 8 }}>No Resume Analyzed Yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: 20 }}>Upload your resume to get an AI-powered analysis and score</p>
            <button className="btn btn-primary" onClick={() => navigate('/applicant/resume')}>
              🚀 Analyze My Resume
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <h2 style={{ fontSize: 18, marginBottom: 16, color: '#94a3b8' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }} className="stagger">
          {quickActions.map(action => (
            <div key={action.path} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(action.path)}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{action.icon}</div>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{action.title}</h3>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{action.desc}</p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: action.color, fontSize: 13, fontWeight: 600 }}>
                Open <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="card" style={{ marginTop: 24, background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
          <h3 style={{ marginBottom: 12, fontSize: 16 }}>💡 Pro Tips</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {['Upload a PDF resume for best results', 'Include quantified achievements', 'List both technical and soft skills', 'Keep your resume under 2 pages'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#94a3b8', alignItems: 'flex-start' }}>
                <span style={{ color: '#06b6d4', marginTop: 2 }}>•</span> {tip}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
