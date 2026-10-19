import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/Badge';
import { CreditScoreGauge } from '../common/CreditScoreGauge';
import { 
  CreditCard, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { EmiPaymentModal } from './EmiPaymentModal';

export const CustomerDashboard = ({ onNavigate }) => {
  const { currentCustomer, applications, activeLoans } = useLoanContext();

  const customerApps = applications.filter(a => a.customerId === currentCustomer?.id);
  const customerLoans = activeLoans.filter(l => l.customerId === currentCustomer?.id);

  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState(null);

  const activeLoansCount = customerLoans.filter(l => l.status === 'ACTIVE').length;
  const totalDebt = customerLoans.reduce((sum, l) => sum + (l.status === 'ACTIVE' || l.status === 'OVERDUE' ? (l.remainingPrincipal || 0) : 0), 0);
  
  // Find nearest due EMI
  const overdueLoan = customerLoans.find(l => l.status === 'OVERDUE');
  const nextEmiLoan = overdueLoan || customerLoans.find(l => l.status === 'ACTIVE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(6, 182, 212, 0.1))',
        border: '1px solid rgba(37, 99, 235, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={currentCustomer?.avatar}
            alt={currentCustomer?.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--blue-500)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Welcome back, {currentCustomer?.name}!
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {currentCustomer?.employmentType} • Account: <strong className="mono" style={{ color: 'var(--cyan-400)' }}>{currentCustomer?.accountNo}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('apply')}
            className="btn btn-primary"
            style={{ gap: '8px' }}
          >
            <Sparkles size={16} />
            <span>Apply for New Loan</span>
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="btn btn-secondary"
            style={{ gap: '8px' }}
          >
            <span>Explore Schemes</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        <StatCard
          title="Active Loan Balance"
          value={`₹${(totalDebt / 100000).toFixed(2)} Lakhs`}
          subtext={`Across ${activeLoansCount} active borrowing accounts`}
          icon={CreditCard}
          color="blue"
        />

        <StatCard
          title="Applications in Progress"
          value={customerApps.filter(a => a.currentStage !== 'DISBURSED' && a.currentStage !== 'REJECTED').length}
          subtext="Under multi-department verification"
          icon={Clock}
          color="cyan"
        />

        <StatCard
          title="Next EMI Due Amount"
          value={nextEmiLoan ? `₹${Number(nextEmiLoan.calculatedMonthlyEmi).toLocaleString('en-IN')}` : '₹0'}
          subtext={nextEmiLoan ? `${nextEmiLoan.loanType}` : 'All dues cleared'}
          icon={CreditCard}
          color={overdueLoan ? 'rose' : 'emerald'}
        />

        <StatCard
          title="CIBIL Rating"
          value={`${currentCustomer?.cibilScore} / 900`}
          subtext={currentCustomer?.cibilRating}
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Quick Action Alert if EMI Due */}
      {nextEmiLoan && (
        <div style={{
          background: overdueLoan ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.1)',
          border: overdueLoan ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: overdueLoan ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: overdueLoan ? 'var(--rose-400)' : 'var(--emerald-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {overdueLoan ? <AlertCircle size={22} /> : <CheckCircle2 size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {overdueLoan ? 'Immediate Action Required: Overdue EMI Pending' : `Upcoming EMI: ${nextEmiLoan.loanType}`}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Amount: <strong>₹{Number(nextEmiLoan.calculatedMonthlyEmi).toLocaleString('en-IN')}</strong> • Linked Facility: {nextEmiLoan.id}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedLoanForPayment(nextEmiLoan)}
            className={`btn ${overdueLoan ? 'btn-danger' : 'btn-success'}`}
            style={{ gap: '6px' }}
          >
            <span>Pay EMI Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Two Column Section: Recent Applications & Active Loans Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Recent Applications Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Applications
              </h3>
              <button
                onClick={() => onNavigate('tracker')}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Track All
              </button>
            </div>

            {customerApps.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                No applications submitted yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customerApps.slice(0, 3).map(app => (
                  <div
                    key={app.id}
                    onClick={() => onNavigate('tracker')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'var(--navy-900)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--surface-glass-border)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--navy-900)'}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {app.loanType}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ₹{(app.requestedAmount / 100000).toFixed(1)} Lakhs • Ref: {app.id}
                      </div>
                    </div>
                    <StatusBadge status={app.currentStage} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CIBIL Score & Financial Health */}
        <CreditScoreGauge
          score={currentCustomer?.cibilScore || 782}
          rating={currentCustomer?.cibilRating || 'Excellent'}
        />
      </div>

      {/* Payment Modal */}
      {selectedLoanForPayment && (
        <EmiPaymentModal
          isOpen={true}
          onClose={() => setSelectedLoanForPayment(null)}
          loan={selectedLoanForPayment}
        />
      )}
    </div>
  );
};
