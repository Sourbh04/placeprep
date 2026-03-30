import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import ScoreBar from '../../components/ScoreBar'
import api from '../../api'

export default function RecruiterApplicants() {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ skills: '', min_score: '' })
  const [applied, setApplied] = useState(false)

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.skills) params.skills = filters.skills
      if (filters.min_score) params.min_score = parseFloat(filters.min_score)
      const res = await api.get('/recruiters/applicants', { params })
      setApplicants(res.data)
      setApplied(true)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchApplicants() }, [])

  return (
    <div className="page-container">
      <Sidebar role="recruiter" />
      <main className="main-content">
        <div className="page-header animate-in">
          <h1>👥 Ranked <span className="gradient-text">Applicants</span></h1>
          <p>AI-ranked candidates sorted by eligibility and resume score</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
            <label>Filter by Skills (comma-separated)</label>
            <input className="form-input" placeholder="e.g. Python, React, SQL" value={filters.skills}
              onChange={e => setFilters({ ...filters, skills: e.target.value })} />
          </div>
          <div className="form-group" style={{ width: 180, marginBottom: 0 }}>
            <label>Min Resume Score</label>
            <input className="form-input" type="number" min="0" max="100" placeholder="e.g. 60" value={filters.min_score}
              onChange={e => setFilters({ ...filters, min_score: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={fetchApplicants}>🔍 Apply Filters</button>
          <button className="btn btn-secondary" onClick={() => { setFilters({ skills: '', min_score: '' }); setTimeout(fetchApplicants, 100) }}>Reset</button>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>No applicants match the current filters.</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>
              {applicants.length} candidate(s) · sorted by combined score
            </p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Degree</th>
                    <th>Skills</th>
                    <th>Resume Score</th>
                    <th>Skill Match</th>
                    <th>Combined Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color: '#64748b', fontWeight: 700 }}>#{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{a.email}</div>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: 13 }}>{a.degree} · {a.year_of_study}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(a.skills || '').split(',').slice(0, 3).map((s, j) => (
                            <span key={j} className="badge badge-purple" style={{ fontSize: 11 }}>{s.trim()}</span>
                          ))}
                          {(a.skills || '').split(',').length > 3 && <span className="badge badge-muted" style={{ fontSize: 11 }}>+{(a.skills || '').split(',').length - 3}</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ minWidth: 120 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: a.resume_score >= 70 ? '#10b981' : a.resume_score >= 45 ? '#f59e0b' : '#ef4444', marginBottom: 4 }}>
                            {a.resume_score !== null ? Math.round(a.resume_score) : '—'}
                          </div>
                          {a.resume_score !== null && <ScoreBar value={Math.round(a.resume_score)} max={100} />}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: '#06b6d4', fontWeight: 700 }}>{a.skill_match_score}%</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {a.combined_score}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${a.has_resume ? 'badge-success' : 'badge-muted'}`}>
                          {a.has_resume ? '📄 Resume' : '❌ No Resume'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
