import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export const CreditScoreGauge = ({ score = 750, rating = 'Good' }) => {
  // Score range 300 to 900
  const minScore = 300;
  const maxScore = 900;
  const percentage = Math.min(100, Math.max(0, ((score - minScore) / (maxScore - minScore)) * 100));

  // Determine color based on score
  let scoreColor = 'var(--blue-400)';
  let bgGradient = 'linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6, #10b981)';
  
  if (score >= 780) {
    scoreColor = 'var(--emerald-400)';
  } else if (score >= 700) {
    scoreColor = 'var(--cyan-400)';
  } else if (score >= 650) {
    scoreColor = 'var(--amber-400)';
  } else {
    scoreColor = 'var(--rose-400)';
  }

  return (
    <div style={{
      background: 'var(--navy-900)',
      border: '1px solid var(--surface-glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} style={{ color: scoreColor }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            CIBIL Credit Score
          </span>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.08)',
          color: scoreColor
        }}>
          {rating || (score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : 'Fair')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: scoreColor, letterSpacing: '-0.03em' }}>
            {score}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
            / 900
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {score >= 750 ? 'Low Risk • Instant Approval' : score >= 680 ? 'Standard Risk • Eligible' : 'Higher Risk • Additional Review'}
        </span>
      </div>

      {/* Progress Track */}
      <div>
        <div style={{
          height: '8px',
          borderRadius: 'var(--radius-full)',
          background: bgGradient,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `3px solid ${scoreColor}`,
            boxShadow: '0 0 10px rgba(0,0,0,0.6)'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          <span>300 (Poor)</span>
          <span>650 (Fair)</span>
          <span>750 (Good)</span>
          <span>900 (Exceptional)</span>
        </div>
      </div>
    </div>
  );
};
