import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function FloatingParticle({ style }) {
  return <div className="particle" style={style} />
}

export default function Landing() {
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const roles = [
    {
      id: 'applicant',
      icon: '🎓',
      title: 'Applicant',
      subtitle: 'Find your dream role',
      description: 'Upload your resume, get AI-powered analysis, match with top jobs and check your eligibility.',
      features: ['Resume Score & Feedback', 'AI-Suggested Roles', 'Job Matching Engine'],
      color: '#7c3aed',
      glow: 'rgba(124,58,237,0.4)',
      action: () => navigate('/applicant/register'),
    },
    {
      id: 'recruiter',
      icon: '🏢',
      title: 'Recruiter',
      subtitle: 'Find top talent',
      description: 'Post jobs, review AI-ranked applicants, filter by skills and resume scores automatically.',
      features: ['Smart Applicant Ranking', 'Skill-Based Filtering', 'Resume Score Insights'],
      color: '#06b6d4',
      glow: 'rgba(6,182,212,0.4)',
      action: () => navigate('/recruiter/register'),
    },
    {
      id: 'admin',
      icon: '⚡',
      title: 'Admin',
      subtitle: 'Manage the platform',
      description: 'Approve recruiters, oversee all applicants, manage job listings and platform health.',
      features: ['Recruiter Approvals', 'Full Platform Access', 'Data Management'],
      color: '#ec4899',
      glow: 'rgba(236,72,153,0.4)',
      action: () => navigate('/admin/login'),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* Animated background orbs */}
      <div style={{ position: 'fixed', top: '10%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', top: '60%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite reverse' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '30%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', animation: 'float 7s ease-in-out infinite 2s' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 60, animation: 'fadeInUp 0.7s ease both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', marginBottom: 24 }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <span style={{ fontSize: 13, color: '#a855f7', fontWeight: 600 }}>Powered by Gemini AI + Pinecone</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          <span className="gradient-text">AI-powered</span><br />
          <span style={{ color: '#f1f5f9' }}>Resume Intelligence</span><br />
          <span style={{ color: '#f1f5f9' }}>Platform</span>
        </h1>

        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 520, margin: '0 auto 12px', lineHeight: 1.7 }}>
          Analyze resumes with cutting-edge AI, get personalized feedback, and connect talent with opportunities.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20, fontSize: 13, color: '#64748b' }}>
          <span>✨ Resume Scoring</span>
          <span>🧠 LLM Analysis</span>
          <span>🎯 Job Matching</span>
        </div>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, width: '100%', maxWidth: 1000, animation: 'fadeInUp 0.7s 0.2s ease both' }}>
        {roles.map((role, i) => (
          <div
            key={role.id}
            onClick={role.action}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 24,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              animationDelay: `${i * 0.15}s`,
              animation: 'fadeInUp 0.6s ease both',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)'
              e.currentTarget.style.border = `1px solid ${role.color}50`
              e.currentTarget.style.boxShadow = `0 20px 60px ${role.glow}, 0 0 0 1px ${role.color}20`
              e.currentTarget.style.background = `rgba(255,255,255,0.05)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            {/* Glow blob in top-right */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: `radial-gradient(circle, ${role.color}30 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ fontSize: 56, marginBottom: 20, display: 'block' }}>{role.icon}</div>

            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{role.title}</h2>
            <p style={{ fontSize: 13, color: role.color, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{role.subtitle}</p>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>{role.description}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {role.features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cbd5e1' }}>
                  <span style={{ color: role.color, fontSize: 16 }}>✓</span> {f}
                </div>
              ))}
            </div>

            <button style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: `linear-gradient(135deg, ${role.color}, ${role.color}99)`,
              color: 'white',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              boxShadow: `0 4px 20px ${role.glow}`,
            }}>
              Get Started →
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p style={{ marginTop: 60, fontSize: 13, color: '#475569', animation: 'fadeIn 1s 0.5s ease both' }}>
        Built with FastAPI · React · Gemini AI · Pinecone · LangChain
      </p>
    </div>
  )
}
