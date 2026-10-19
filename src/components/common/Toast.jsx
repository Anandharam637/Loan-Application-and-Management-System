import React from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useLoanContext();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-400" style={{ color: 'var(--emerald-400)' }} />;
      case 'error':
        return <XCircle size={20} className="text-rose-400" style={{ color: 'var(--rose-400)' }} />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-400" style={{ color: 'var(--amber-400)' }} />;
      default:
        return <Info size={20} className="text-blue-400" style={{ color: 'var(--blue-400)' }} />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            {getIcon(toast.type)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
              {toast.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
