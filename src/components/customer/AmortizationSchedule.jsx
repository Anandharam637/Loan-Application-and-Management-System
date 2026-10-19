import React, { useState } from 'react';
import { StatusBadge } from '../common/Badge';
import { Calendar, CheckCircle2, Clock, FileText, Filter } from 'lucide-react';

export const AmortizationSchedule = ({ loan, onPayEmi }) => {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'UPCOMING'

  if (!loan || !loan.schedule) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No amortization schedule available for this loan.
      </div>
    );
  }

  const filteredSchedule = loan.schedule.filter(item => {
    if (filter === 'PAID') return item.status === 'PAID';
    if (filter === 'UPCOMING') return item.status === 'UPCOMING' || item.status === 'DUE';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Month-by-Month Repayment Schedule
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {loan.paidEmisCount} of {loan.totalEmis} installments completed • ₹{Number(loan.totalRepaidAmount).toLocaleString('en-IN')} repaid
          </span>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--navy-900)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-glass-border)' }}>
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            All ({loan.schedule.length})
          </button>
          <button
            onClick={() => setFilter('PAID')}
            className={`btn btn-sm ${filter === 'PAID' ? 'btn-success' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            Paid ({loan.paidEmisCount})
          </button>
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`btn btn-sm ${filter === 'UPCOMING' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            Pending ({loan.totalEmis - loan.paidEmisCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Inst. #</th>
              <th>Due Date</th>
              <th>EMI Amount</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance Left</th>
              <th>Status</th>
              <th>Action / Ref</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((row) => (
              <tr key={row.monthNumber} style={{ background: row.status === 'DUE' ? 'rgba(245, 158, 11, 0.08)' : 'transparent' }}>
                <td style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                  #{row.monthNumber}
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  {new Date(row.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{Number(row.emiAmount).toLocaleString('en-IN')}
                </td>
                <td style={{ color: 'var(--blue-400)', fontSize: '0.85rem' }}>
                  ₹{Number(row.principalPaid).toLocaleString('en-IN')}
                </td>
                <td style={{ color: 'var(--cyan-400)', fontSize: '0.85rem' }}>
                  ₹{Number(row.interestPaid).toLocaleString('en-IN')}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  ₹{Number(row.closingBalance).toLocaleString('en-IN')}
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  {row.status === 'PAID' ? (
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {row.paymentRef || 'Paid Online'}
                    </span>
                  ) : row.status === 'DUE' ? (
                    <button
                      onClick={() => onPayEmi && onPayEmi(loan)}
                      className="btn btn-success btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Scheduled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
