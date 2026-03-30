import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../api'

export default function EligibilityChecker() {
  const [jobs, setJobs] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data)).catch(() => {})
    api.get(`/resume/analysis/${userId}`).then(r => { if (r.data) setAnalysis(r.data) }).catch(() => {})
  }, [userId])

  const score = analysis?.score || 0

  const checkEligibility = (job) => {
    const jobSkills = Array.isArray(job.skills_required)
      ? job.skills_required
      : JSON.parse(job.skills_required || '[]')

    const passed = score >= (job.min_cgpa || 0) * 10
    return {
      eligible: passed,
      reason: passed
        ? `Your resume score (${Math.round(score)}) meets requirements`
        : `Resume score ${Math.round(score)} below suggested threshold`,
    }
  }

  return (
    <div className="page-container">
      <Sidebar role="applicant" />
      <main className="main-content">
        <div className="page-header animate-in">
          <h1>✅ Eligibility <span className="gradient-text">Checker</span></h1>
          <p>See which jobs you're eligible for based on your profile</p>
        </div>

        {/* Score Summary */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 48, fontWeight: 900, background: 'linear-gradient(135deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                {analysis ? Math.round(score) : '—'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Score</div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: 6 }}>Your Eligibility Profile</h3>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>
                {!analysis
                  ? '⚠️ Upload your resume first to see eligibility insights.'
                  : score >= 70
                  ? '🌟 Excellent! You\'re eligible for most senior positions.'
                  : score >= 50
                  ? '👍 Good profile — you qualify for many roles.'
                  : '📈 Improve your score by uploading a stronger resume.'}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="card" style={{ marginBottom: 24, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔮</div>
          <h2 style={{ marginBottom: 10 }}>Advanced Eligibility Engine</h2>
          <p style={{ color: '#94a3b8', maxWidth: 400, margin: '0 auto 20px', fontSize: 14, lineHeight: 1.7 }}>
            Coming soon: Compare your profile against CGPA, skills, and experience requirements for each job with detailed match breakdowns.
          </p>
          <span className="badge badge-purple" style={{ fontSize: 14, padding: '6px 16px' }}>🚧 Coming Soon</span>
        </div>

        {/* Basic Check Grid */}
        {jobs.length > 0 && analysis && (
          <>
            <h3 style={{ marginBottom: 16 }}>Quick Eligibility Check</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }} className="stagger">
              {jobs.map(job => {
                const { eligible, reason } = checkEligibility(job)
                return (
                  <div key={job.id} className="card" style={{ borderColor: eligible ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 28 }}>{eligible ? '✅' : '❌'}</div>
                      <div>
                        <h4 style={{ fontSize: 15, marginBottom: 4 }}>{job.title}</h4>
                        <p style={{ fontSize: 12, color: '#06b6d4', marginBottom: 8 }}>{job.company_name}</p>
                        <p style={{ fontSize: 13, color: eligible ? '#6ee7b7' : '#fca5a5' }}>{reason}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
