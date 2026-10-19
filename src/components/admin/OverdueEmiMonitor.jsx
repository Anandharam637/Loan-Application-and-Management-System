import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatusBadge } from '../common/Badge';
import { 
  AlertCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert,
  CreditCard,
  DollarSign
} from 'lucide-react';

export const OverdueEmiMonitor = () => {
  const { activeLoans, addToast } = useLoanContext();

  const [reminderSentMap, setReminderSentMap] = useState({});

  const handleSendReminder = (loanId, borrowerName) => {
    setReminderSentMap(prev => ({ ...prev, [loanId]: true }));
    addToast(
      'Payment Notice Sent',
      `Automated SMS & Email repayment reminder dispatched to ${borrowerName}.`,
      'info'
    );
  };

  const overdueLoans = activeLoans.filter(l => l.status === 'OVERDUE');
  const activeDueLoans = activeLoans.filter(l => l.status === 'ACTIVE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Overdue EMI & Collections Monitor
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Track missed installments, compute automated late penalty charges, and trigger compliance notices.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Overdue Loans (SMA-1)
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-400)', marginTop: '4px' }}>
            {overdueLoans.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Requires recovery intervention
          </span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Default Capital at Risk
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--rose-400)', marginTop: '4px' }}>
            ₹{Number(overdueLoans.reduce((sum, l) => sum + (l.overdueAmount || 0), 0)).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Overdue installments + penalty
          </span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Gross NPA Ratio
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
            0.00%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-300)' }}>
            Zero 90+ DPD defaults
          </span>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Loan Facility</th>
              <th>Borrower</th>
              <th>Due Amount</th>
              <th>Overdue Period</th>
              <th>Late Charges</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {overdueLoans.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  ✅ No delinquent or overdue loans found in the current collection cycle.
                </td>
              </tr>
            ) : (
              overdueLoans.map(loan => (
                <tr key={loan.id} style={{ background: 'rgba(244, 63, 94, 0.05)' }}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {loan.loanType}
                    </div>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--cyan-400)' }}>
                      {loan.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{loan.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>A/C: {loan.accountNo}</div>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--rose-400)' }}>
                    ₹{Number(loan.overdueAmount || loan.calculatedMonthlyEmi).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--amber-400)' }}>
                      {loan.overdueMonths || 1} Month Overdue
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DPD: 28 Days</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    ₹{loan.lateFee || 500}
                  </td>
                  <td>
                    <StatusBadge status="OVERDUE" />
                  </td>
                  <td>
                    <button
                      onClick={() => handleSendReminder(loan.id, loan.customerName)}
                      className={`btn btn-sm ${reminderSentMap[loan.id] ? 'btn-secondary' : 'btn-danger'}`}
                      style={{ padding: '4px 10px', gap: '4px', fontSize: '0.75rem' }}
                      disabled={reminderSentMap[loan.id]}
                    >
                      {reminderSentMap[loan.id] ? (
                        <>
                          <CheckCircle2 size={13} style={{ color: 'var(--emerald-400)' }} />
                          <span>Notice Sent</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Send Notice</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
