export default function JobCard({ job }) {
  const skills = Array.isArray(job.skills_required)
    ? job.skills_required
    : JSON.parse(job.skills_required || '[]')

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{job.title}</h3>
          <p style={{ color: '#06b6d4', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{job.company_name}</p>
        </div>
        <div style={{ background: 'rgba(124,58,237,0.15)', padding: '6px 12px', borderRadius: 20, fontSize: 12, color: '#a855f7', fontWeight: 600, border: '1px solid rgba(124,58,237,0.3)', whiteSpace: 'nowrap' }}>
          🏢 Hiring
        </div>
      </div>

      {job.description && (
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{job.description}</p>
      )}

      <div>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Skills Required</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {skills.length > 0 ? skills.map((s, i) => (
            <span key={i} className="badge badge-purple">{s}</span>
          )) : <span style={{ color: '#64748b', fontSize: 13 }}>Not specified</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: '#94a3b8' }}>
          <span>🎓</span>
          <span>Min CGPA: <strong style={{ color: '#f1f5f9' }}>{job.min_cgpa || 'Any'}</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, color: '#94a3b8' }}>
          <span>💼</span>
          <span>Exp: <strong style={{ color: '#f1f5f9' }}>{job.experience_years || 0}+ yrs</strong></span>
        </div>
      </div>
    </div>
  )
}
