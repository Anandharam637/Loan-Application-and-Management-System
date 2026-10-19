import React from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/Badge';
import { DonutChart } from '../charts/DonutChart';
import { BarChart } from '../charts/BarChart';
import { 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  CreditCard, 
  ShieldAlert, 
  ArrowRight,
  Eye
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const { applications, activeLoans, schemes, customers } = useLoanContext();

  const totalDisbursed = activeLoans.reduce((sum, l) => sum + (l.principalSanctioned || 0), 0);
  const totalRepaid = activeLoans.reduce((sum, l) => sum + (l.totalRepaidAmount || 0), 0);
  const pendingApps = applications.filter(a => a.currentStage !== 'DISBURSED' && a.currentStage !== 'REJECTED');
  const overdueCount = activeLoans.filter(l => l.status === 'OVERDUE').length;

  // Chart Data: Category distribution
  const categoryData = schemes.map(sch => {
    const sum = activeLoans
      .filter(l => l.schemeId === sch.id || l.loanType.toLowerCase().includes(sch.category.toLowerCase()))
      .reduce((acc, l) => acc + l.principalSanctioned, 0);
    return {
      label: sch.category,
      value: sum || (sch.minAmount / 2),
      color: sch.color || 'var(--blue-500)'
    };
  });

  // Chart Data: Monthly collection trend
  const monthlyDisbursementData = [
    { label: 'Apr 2026', value: 3800000, formattedValue: '₹38L', color: 'rgba(37, 99, 235, 0.7)' },
    { label: 'May 2026', value: 5200000, formattedValue: '₹52L', color: 'rgba(37, 99, 235, 0.8)' },
    { label: 'Jun 2026', value: 4400000, formattedValue: '₹44L', color: 'rgba(37, 99, 235, 0.75)' },
    { label: 'Jul 2026', value: 6800000, formattedValue: '₹68L', color: 'rgba(37, 99, 235, 0.85)' },
    { label: 'Aug 2026', value: 5900000, formattedValue: '₹59L', color: 'rgba(37, 99, 235, 0.8)' },
    { label: 'Sep 2026 (MTD)', value: 7200000, formattedValue: '₹72L', color: 'var(--blue-500)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome & System Status Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(37, 99, 235, 0.15))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Core Lending Operations Console
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', letterSpacing: '-0.02em' }}>
            Branch Loan Management & Verification Center
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Managing <strong>₹{(totalDisbursed / 100000).toFixed(2)} Lakhs</strong> active retail loan portfolio with 100% paperless digital workflow.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('pipeline')}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <span>Review Applications ({pendingApps.length})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <StatCard
          title="Total Disbursed Capital"
          value={`₹${(totalDisbursed / 100000).toFixed(1)}L`}
          subtext="Active & settled facilities"
          icon={Building2}
          color="blue"
        />

        <StatCard
          title="Applications in Pipeline"
          value={pendingApps.length}
          subtext={`${applications.filter(a => a.currentStage === 'SUBMITTED').length} awaiting initial KYC`}
          icon={Clock}
          color="cyan"
        />

        <StatCard
          title="Total Repaid Capital"
          value={`₹${(totalRepaid / 100000).toFixed(1)}L`}
          subtext="Principal + Interest recovered"
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          title="Delinquent Accounts"
          value={overdueCount}
          subtext={overdueCount > 0 ? "1 account requires notice" : "Clean recovery cycle"}
          icon={ShieldAlert}
          color={overdueCount > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Chart: Monthly Lending Volume */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Monthly Loan Disbursal Trends (₹ Lakhs)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
                +18.4% MoM Growth
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Disbursement velocity across FY 2026-27 quarters
            </p>
          </div>

          <BarChart data={monthlyDisbursementData} height={190} />
        </div>

        {/* Right Chart: Portfolio Category Donut */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Portfolio Scheme Distribution
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Allocation by Home, Vehicle, Education, Business & Personal credit
            </p>
          </div>

          <DonutChart
            data={categoryData}
            size={170}
            strokeWidth={22}
            centerLabel={`₹${(totalDisbursed / 100000).toFixed(1)}L`}
            centerSub="Portfolio"
          />
        </div>
      </div>

      {/* Pending Applications Ingestion Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Pending Ingestion & Review Queue
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Recent applications requiring departmental verification & underwriting
            </span>
          </div>

          <button
            onClick={() => onNavigate('pipeline')}
            className="btn btn-outline btn-sm"
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          >
            View All ({applications.length})
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Applicant</th>
                <th>Loan Product</th>
                <th>Requested Amount</th>
                <th>CIBIL Score</th>
                <th>Stage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 4).map(app => (
                <tr key={app.id}>
                  <td className="mono" style={{ color: 'var(--cyan-400)', fontWeight: 700, fontSize: '0.82rem' }}>
                    {app.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{app.customerPhone}</div>
                  </td>
                  <td>{app.loanType}</td>
                  <td style={{ fontWeight: 800 }}>₹{Number(app.requestedAmount).toLocaleString('en-IN')}</td>
                  <td>
                    <strong style={{ color: app.cibilScore >= 750 ? 'var(--emerald-400)' : 'var(--cyan-400)' }}>
                      {app.cibilScore}
                    </strong>
                  </td>
                  <td>
                    <StatusBadge status={app.currentStage} />
                  </td>
                  <td>
                    <button
                      onClick={() => onNavigate('pipeline')}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', gap: '4px' }}
                    >
                      <Eye size={12} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
