import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import JobCard from '../../components/JobCard'
import api from '../../api'

export default function RelatedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <Sidebar role="applicant" />
      <main className="main-content">
        <div className="page-header animate-in">
          <h1>💼 Related <span className="gradient-text">Jobs</span></h1>
          <p>Discover opportunities matched to your skills and resume score</p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            className="form-input"
            placeholder="🔍  Search by role or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 480 }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner" />
            <p style={{ color: '#94a3b8', marginTop: 16 }}>Loading opportunities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3>No Jobs Found</h3>
            <p style={{ color: '#94a3b8', marginTop: 8 }}>
              {jobs.length === 0 ? 'No job listings yet. Check back later!' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>{filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'} found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }} className="stagger">
              {filtered.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
