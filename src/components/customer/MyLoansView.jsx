import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatusBadge } from '../common/Badge';
import { AmortizationSchedule } from './AmortizationSchedule';
import { EmiPaymentModal } from './EmiPaymentModal';
import { NocCertificateModal } from './NocCertificateModal';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Award,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const MyLoansView = ({ onNavigateToApply }) => {
  const { activeLoans, currentCustomerId } = useLoanContext();

  const customerLoans = activeLoans.filter(l => l.customerId === currentCustomerId);

  const [expandedLoanId, setExpandedLoanId] = useState(customerLoans[0]?.id || null);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState(null);
  const [selectedLoanForNoc, setSelectedLoanForNoc] = useState(null);

  const totalOutstanding = customerLoans.reduce((sum, l) => sum + (l.status === 'ACTIVE' || l.status === 'OVERDUE' ? (l.remainingPrincipal || 0) : 0), 0);
  const totalRepaid = customerLoans.reduce((sum, l) => sum + (l.totalRepaidAmount || 0), 0);

  if (customerLoans.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '56px 24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--blue-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <CreditCard size={32} />
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          No Active Loan Accounts
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '8px auto 24px auto' }}>
          You currently have no disbursed loans in your portfolio. Explore our loan products and apply online in minutes.
        </p>
        <button
          onClick={() => onNavigateToApply && onNavigateToApply()}
          className="btn btn-primary"
          style={{ gap: '8px' }}
        >
          <span>Explore Loan Products</span>
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Portfolio Quick Summary Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Outstanding Debt
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            ₹ {Number(totalOutstanding).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--cyan-400)' }}>
            Across {customerLoans.filter(l => l.status === 'ACTIVE').length} active loan accounts
          </span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Principal Repaid
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
            ₹ {Number(totalRepaid).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-300)' }}>
            On-time repayments track
          </span>
        </div>
      </div>

      {/* List of Loans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {customerLoans.map(loan => {
          const isExpanded = expandedLoanId === loan.id;
          const isClosed = loan.status === 'CLOSED';
          const progressPercent = Math.min(100, Math.round(((loan.paidEmisCount || 0) / (loan.totalEmis || 1)) * 100));

          return (
            <div key={loan.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Loan Header Card Bar */}
              <div
                style={{
                  padding: '24px',
                  background: 'var(--navy-900)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedLoanId(isExpanded ? null : loan.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: isClosed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                    color: isClosed ? 'var(--emerald-400)' : 'var(--blue-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isClosed ? <Award size={24} /> : <CreditCard size={24} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {loan.loanType}
                      </h3>
                      <StatusBadge status={loan.status} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Facility ID: <strong className="mono" style={{ color: 'var(--cyan-400)' }}>{loan.id}</strong> • Linked A/C: {loan.accountNo}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Monthly EMI pill */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly EMI</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{Number(loan.calculatedMonthlyEmi).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Actions */}
                  {!isClosed ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLoanForPayment(loan);
                      }}
                      className="btn btn-success btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <span>Pay EMI</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLoanForNoc(loan);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <Award size={15} />
                      <span>Download NOC</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedLoanId(isExpanded ? null : loan.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '4px', background: 'var(--navy-950)', position: 'relative' }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: isClosed ? 'var(--emerald-500)' : 'linear-gradient(90deg, var(--blue-600), var(--cyan-400))'
                }} />
              </div>

              {/* Key Highlights Sub-strip */}
              <div style={{
                padding: '16px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.01)',
                borderBottom: isExpanded ? '1px solid var(--surface-glass-border)' : 'none'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sanctioned Principal</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{Number(loan.principalSanctioned).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Remaining Principal</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isClosed ? 'var(--emerald-400)' : 'var(--blue-400)' }}>
                    ₹{Number(loan.remainingPrincipal || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Interest Rate</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
                    {loan.interestRate}% p.a.
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tenure Progress</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {loan.paidEmisCount} / {loan.totalEmis} EMIs ({progressPercent}%)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Disbursal Date</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {loan.disbursalDate}
                  </div>
                </div>
              </div>

              {/* Expanded Amortization Schedule Table */}
              {isExpanded && (
                <div style={{ padding: '24px' }}>
                  <AmortizationSchedule
                    loan={loan}
                    onPayEmi={(l) => setSelectedLoanForPayment(l)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedLoanForPayment && (
        <EmiPaymentModal
          isOpen={true}
          onClose={() => setSelectedLoanForPayment(null)}
          loan={selectedLoanForPayment}
        />
      )}

      {/* NOC Certificate Modal */}
      {selectedLoanForNoc && (
        <NocCertificateModal
          isOpen={true}
          onClose={() => setSelectedLoanForNoc(null)}
          loan={selectedLoanForNoc}
        />
      )}
    </div>
  );
};
