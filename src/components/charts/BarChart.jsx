import React from 'react';

export const BarChart = ({ data = [], height = 200 }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: `${height}px`,
        gap: '12px',
        paddingTop: '20px',
        borderBottom: '1px solid var(--surface-glass-border)'
      }}>
        {data.map((item, idx) => {
          const heightPct = Math.round((item.value / maxValue) * 100);
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                group: 'bar'
              }}
            >
              {/* Tooltip value */}
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--cyan-400)',
                marginBottom: '6px'
              }}>
                {item.formattedValue || `₹${(item.value / 100000).toFixed(1)}L`}
              </span>
              
              {/* Bar bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPct}%`,
                  background: item.color || 'linear-gradient(180deg, var(--blue-500), var(--blue-600))',
                  borderRadius: '6px 6px 2px 2px',
                  boxShadow: '0 0 12px rgba(37, 99, 235, 0.25)',
                  transition: 'height 0.5s ease',
                  cursor: 'pointer'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X Axis Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '10px' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
