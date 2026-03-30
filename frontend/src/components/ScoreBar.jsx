export default function ScoreBar({ label, value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const color = pct >= 70 ? '#10b981' : pct >= 45 ? '#f59e0b' : '#ef4444'

  return (
    <div className="score-bar-wrapper">
      {label && (
        <div className="score-bar-label">
          <span>{label}</span>
          <span style={{ color }}>{value}/{max}</span>
        </div>
      )}
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}
