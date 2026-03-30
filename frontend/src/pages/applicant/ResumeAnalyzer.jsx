import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import FileUpload from '../../components/FileUpload'
import ScoreBar from '../../components/ScoreBar'
import api from '../../api'

function ScoreCircle({ score }) {
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const strokeDash = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444'

  return (
    <div className="score-circle-container">
      <div className="score-circle" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="90" cy="90" r={radius} fill="none"
            stroke={`url(#grad)`} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="score-text">
          <div className="score-number">{Math.round(score)}</div>
          <div className="score-label">/ 100</div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: color }}>
          {score >= 80 ? '🌟 Excellent!' : score >= 60 ? '👍 Good' : score >= 40 ? '⚡ Average' : '📈 Needs Work'}
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, items, color, bg }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15, flex: 1, textAlign: 'left' }}>{title}</span>
        <span style={{ color: '#64748b', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
              <span style={{ color, marginTop: 2, flexShrink: 0 }}>•</span>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ResumeAnalyzer() {
  const userId = localStorage.getItem('user_id')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get(`/resume/analysis/${userId}`).then(r => {
      if (r.data) setAnalysis(r.data)
    }).catch(() => {})
  }, [userId])

  const handleUpload = async () => {
    if (!file) { setError('Please select a PDF file first'); return }
    setLoading(true); setError(''); setSuccess('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setAnalysis({
        score: res.data.score,
        summary: res.data.summary,
        strengths: res.data.strengths,
        weaknesses: res.data.weaknesses,
        suggestions: res.data.suggestions,
        suggested_roles: res.data.suggested_roles,
        analyzed_at: new Date().toISOString(),
      })
      setSuccess('✨ Resume analyzed successfully!')
      setFile(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally { setLoading(false) }
  }

  const parseArr = (val) => {
    if (!val) return []
    if (Array.isArray(val)) return val
    try { return JSON.parse(val) } catch { return [] }
  }

  return (
    <div className="page-container">
      <Sidebar role="applicant" />
      <main className="main-content">
        <div className="page-header animate-in">
          <h1>🧠 Resume <span className="gradient-text">Analyzer</span></h1>
          <p>Upload your PDF resume and get instant AI-powered feedback</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr', gap: 24 }}>

          {/* Upload Panel */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 16, fontSize: 16 }}>📤 Upload Resume</h3>
              <FileUpload onFile={setFile} file={file} loading={loading} />
              {error && <div className="alert alert-error" style={{ marginTop: 12 }}>⚠️ {error}</div>}
              {success && <div className="alert alert-success" style={{ marginTop: 12 }}>{success}</div>}
              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: 16 }}
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? <><span className="spinner spinner-sm" /> Analyzing...</> : '🚀 Analyze Resume'}
              </button>
            </div>

            {/* Info box */}
            <div className="card" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <h4 style={{ marginBottom: 12, fontSize: 14 }}>🤖 AI Analysis Includes</h4>
              {['Resume Score (0-100)', 'Professional Summary', 'Key Strengths', 'Areas to Improve', 'Actionable Suggestions', 'Suitable Job Roles'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#94a3b8', marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ color: '#a855f7' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Results Panel */}
          {analysis && (
            <div className="animate-in">
              {/* Score */}
              <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
                <h3 style={{ marginBottom: 20, fontSize: 16 }}>Your Resume Score</h3>
                <ScoreCircle score={analysis.score} />
                <div style={{ marginTop: 20 }}>
                  <ScoreBar value={Math.round(analysis.score)} max={100} />
                </div>
              </div>

              {/* Summary */}
              <div className="card" style={{ marginBottom: 16, background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
                <h3 style={{ marginBottom: 10, fontSize: 15 }}>📝 Summary</h3>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7 }}>{analysis.summary}</p>
              </div>

              {/* Suggested Roles */}
              {parseArr(analysis.suggested_roles).length > 0 && (
                <div className="card" style={{ marginBottom: 16 }}>
                  <h3 style={{ marginBottom: 12, fontSize: 15 }}>🎯 Suggested Roles</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {parseArr(analysis.suggested_roles).map((r, i) => (
                      <span key={i} className="badge badge-cyan" style={{ fontSize: 13, padding: '6px 14px' }}>✨ {r}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Sections */}
              <Section icon="✅" title="Strengths" items={parseArr(analysis.strengths)} color="#10b981" bg="rgba(16,185,129,0.05)" />
              <Section icon="⚠️" title="Weaknesses & Gaps" items={parseArr(analysis.weaknesses)} color="#f59e0b" bg="rgba(245,158,11,0.05)" />
              <Section icon="💡" title="Improvement Suggestions" items={parseArr(analysis.suggestions)} color="#a855f7" bg="rgba(124,58,237,0.05)" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
