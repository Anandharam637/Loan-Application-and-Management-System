import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const getColorStyles = () => {
    switch (color) {
      case 'emerald':
        return {
          iconBg: 'rgba(16, 185, 129, 0.12)',
          iconColor: 'var(--emerald-400)',
          borderHover: 'rgba(16, 185, 129, 0.3)'
        };
      case 'cyan':
        return {
          iconBg: 'rgba(6, 182, 212, 0.12)',
          iconColor: 'var(--cyan-400)',
          borderHover: 'rgba(6, 182, 212, 0.3)'
        };
      case 'amber':
        return {
          iconBg: 'rgba(245, 158, 11, 0.12)',
          iconColor: 'var(--amber-400)',
          borderHover: 'rgba(245, 158, 11, 0.3)'
        };
      case 'rose':
        return {
          iconBg: 'rgba(244, 63, 94, 0.12)',
          iconColor: 'var(--rose-400)',
          borderHover: 'rgba(244, 63, 94, 0.3)'
        };
      case 'purple':
        return {
          iconBg: 'rgba(139, 92, 246, 0.12)',
          iconColor: 'var(--purple-400)',
          borderHover: 'rgba(139, 92, 246, 0.3)'
        };
      default:
        return {
          iconBg: 'rgba(37, 99, 235, 0.12)',
          iconColor: 'var(--blue-400)',
          borderHover: 'rgba(37, 99, 235, 0.3)'
        };
    }
  };

  const style = getColorStyles();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: style.iconBg,
            color: style.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          {value}
        </span>
      </div>

      {(subtext || trendValue) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {trend && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 700,
              color: trend === 'up' ? 'var(--emerald-400)' : 'var(--rose-400)'
            }}>
              {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trendValue}
            </span>
          )}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
};
