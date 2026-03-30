import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import ScoreBar from '../../components/ScoreBar'
import api from '../../api'

const TABS = ['Overview', 'Recruiters', 'Applicants', 'Jobs']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [recruiters, setRecruiters] = useState([])
  const [applicants, setApplicants] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (tab === 'Recruiters') api.get('/admin/recruiters').then(r => setRecruiters(r.data)).catch(console.error)
    if (tab === 'Applicants') api.get('/admin/applicants').then(r => setApplicants(r.data)).catch(console.error)
    if (tab === 'Jobs') api.get('/admin/jobs').then(r => setJobs(r.data)).catch(console.error)
  }, [tab])

  const approveRecruiter = async (id) => {
    await api.patch(`/admin/recruiters/${id}/approve`)
    setRecruiters(r => r.map(x => x.id === id ? { ...x, status: 'approved' } : x))
    flash('✅ Recruiter approved!')
  }

  const rejectRecruiter = async (id) => {
    await api.patch(`/admin/recruiters/${id}/reject`)
    setRecruiters(r => r.map(x => x.id === id ? { ...x, status: 'rejected' } : x))
    flash('❌ Recruiter rejected.')
  }

  const deleteRecruiter = async (id) => {
    if (!window.confirm('Delete this recruiter and all their jobs?')) return
    await api.delete(`/admin/recruiters/${id}`)
    setRecruiters(r => r.filter(x => x.id !== id))
    flash('🗑️ Recruiter deleted.')
  }

  const deleteApplicant = async (id) => {
    if (!window.confirm('Delete this applicant?')) return
    await api.delete(`/admin/applicants/${id}`)
    setApplicants(a => a.filter(x => x.id !== id))
    flash('🗑️ Applicant deleted.')
  }

  const toggleJob = async (id) => {
    const res = await api.patch(`/admin/jobs/${id}/toggle`)
    setJobs(j => j.map(x => x.id === id ? { ...x, is_active: res.data.is_active } : x))
    flash('Job status updated.')
  }

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return
    await api.delete(`/admin/jobs/${id}`)
    setJobs(j => j.filter(x => x.id !== id))
    flash('🗑️ Job deleted.')
  }

  return (
    <div className="page-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <div className="page-header animate-in">
          <h1>⚡ Admin <span className="gradient-text">Control Panel</span></h1>
          <p>Manage the entire platform from one place</p>
        </div>

        {msg && <div className="alert alert-success animate-in">{msg}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                background: tab === t ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                color: tab === t ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.2s',
              }}
            >{t}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'Overview' && stats && (
          <div>
            <div className="stats-grid stagger">
              {[
                { icon: '🎓', value: stats.total_applicants, label: 'Total Applicants', color: '#7c3aed' },
                { icon: '🏢', value: stats.total_recruiters, label: 'Total Recruiters', color: '#06b6d4' },
                { icon: '⏳', value: stats.pending_recruiters, label: 'Pending Approvals', color: '#f59e0b' },
                { icon: '✅', value: stats.approved_recruiters, label: 'Approved Recruiters', color: '#10b981' },
                { icon: '💼', value: stats.total_jobs, label: 'Job Listings', color: '#ec4899' },
                { icon: '📄', value: stats.total_resumes, label: 'Resumes Uploaded', color: '#a855f7' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {stats.pending_recruiters > 0 && (
              <div className="alert alert-warning">
                ⚠️ <strong>{stats.pending_recruiters} recruiter(s)</strong> awaiting approval. Go to the <strong>Recruiters</strong> tab to review.
              </div>
            )}
          </div>
        )}

        {/* Recruiters Tab */}
        {tab === 'Recruiters' && (
          <div>
            <h3 style={{ marginBottom: 16 }}>All Recruiters ({recruiters.length})</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Recruiter</th>
                    <th>Email</th>
                    <th>Jobs</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.company_name}</td>
                      <td>{r.recruiter_name}</td>
                      <td style={{ color: '#94a3b8', fontSize: 13 }}>{r.email}</td>
                      <td><span className="badge badge-cyan">{r.job_count} jobs</span></td>
                      <td>
                        <span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {r.status === 'approved' ? '✅' : r.status === 'rejected' ? '❌' : '⏳'} {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {r.status === 'pending' && <>
                            <button className="btn btn-success btn-sm" onClick={() => approveRecruiter(r.id)}>✓ Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => rejectRecruiter(r.id)}>✕ Reject</button>
                          </>}
                          <button className="btn btn-danger btn-sm" onClick={() => deleteRecruiter(r.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applicants Tab */}
        {tab === 'Applicants' && (
          <div>
            <h3 style={{ marginBottom: 16 }}>All Applicants ({applicants.length})</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Degree</th>
                    <th>Skills</th>
                    <th>Resume Score</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td style={{ color: '#94a3b8', fontSize: 13 }}>{a.email}</td>
                      <td style={{ fontSize: 13 }}>{a.degree} · {a.year_of_study}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(a.skills || '').split(',').slice(0, 2).map((s, i) => (
                            <span key={i} className="badge badge-purple" style={{ fontSize: 11 }}>{s.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {a.resume_score !== null ? (
                          <div>
                            <strong style={{ color: a.resume_score >= 70 ? '#10b981' : a.resume_score >= 45 ? '#f59e0b' : '#ef4444' }}>
                              {Math.round(a.resume_score)}
                            </strong>
                            <div style={{ marginTop: 4, width: 80 }}>
                              <ScoreBar value={Math.round(a.resume_score)} max={100} />
                            </div>
                          </div>
                        ) : <span style={{ color: '#64748b' }}>—</span>}
                      </td>
                      <td>
                        {a.has_resume ? (
                          <a
                            href={`http://localhost:8000/${a.resume_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                          >📄 View</a>
                        ) : <span style={{ color: '#64748b', fontSize: 13 }}>None</span>}
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteApplicant(a.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {tab === 'Jobs' && (
          <div>
            <h3 style={{ marginBottom: 16 }}>All Job Listings ({jobs.length})</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Skills</th>
                    <th>Min CGPA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td style={{ fontWeight: 600 }}>{j.title}</td>
                      <td style={{ color: '#06b6d4' }}>{j.company_name}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {j.skills_required.slice(0, 3).map((s, i) => (
                            <span key={i} className="badge badge-purple" style={{ fontSize: 11 }}>{s}</span>
                          ))}
                        </div>
                      </td>
                      <td>{j.min_cgpa || '—'}</td>
                      <td>
                        <span className={`badge ${j.is_active ? 'badge-success' : 'badge-muted'}`}>
                          {j.is_active ? '✅ Active' : '⏸️ Paused'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => toggleJob(j.id)}>
                            {j.is_active ? '⏸️ Pause' : '▶️ Activate'}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteJob(j.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
