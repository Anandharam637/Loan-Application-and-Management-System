import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatusBadge } from '../common/Badge';
import { ApplicationDetailReview } from './ApplicationDetailReview';
import { 
  Search, 
  Filter, 
  Clock, 
  ShieldCheck, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Eye,
  Building2,
  ArrowRight
} from 'lucide-react';

export const ApplicationPipeline = () => {
  const { applications, schemes } = useLoanContext();

  const [selectedApp, setSelectedApp] = useState(null);
  const [stageFilter, setStageFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // If viewing details of a specific application
  if (selectedApp) {
    const freshApp = applications.find(a => a.id === selectedApp.id) || selectedApp;
    return (
      <ApplicationDetailReview
        application={freshApp}
        onBack={() => setSelectedApp(null)}
      />
    );
  }

  const filteredApps = applications.filter(app => {
    // Stage Filter
    if (stageFilter !== 'ALL' && app.currentStage !== stageFilter) {
      return false;
    }
    // Scheme Filter
    if (schemeFilter !== 'ALL' && app.schemeId !== schemeFilter) {
      return false;
    }
    // Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchName = app.customerName.toLowerCase().includes(term);
      const matchId = app.id.toLowerCase().includes(term);
      const matchPhone = app.customerPhone.toLowerCase().includes(term);
      const matchType = app.loanType.toLowerCase().includes(term);
      if (!matchName && !matchId && !matchPhone && !matchType) return false;
    }
    return true;
  });

  const stageCounts = {
    ALL: applications.length,
    SUBMITTED: applications.filter(a => a.currentStage === 'SUBMITTED').length,
    KYC_VERIFIED: applications.filter(a => a.currentStage === 'KYC_VERIFIED').length,
    CREDIT_APPRAISED: applications.filter(a => a.currentStage === 'CREDIT_APPRAISED').length,
    DEPT_REVIEWED: applications.filter(a => a.currentStage === 'DEPT_REVIEWED').length,
    SANCTIONED: applications.filter(a => a.currentStage === 'SANCTIONED').length,
    DISBURSED: applications.filter(a => a.currentStage === 'DISBURSED').length,
    REJECTED: applications.filter(a => a.currentStage === 'REJECTED').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Loan Application & Verification Pipeline
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Manage incoming retail loan requests, verify documents, and advance through underwriting stages.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px', paddingRight: '12px' }}
            placeholder="Search by name, ID or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'ALL', label: 'All Inboxes' },
          { key: 'SUBMITTED', label: '1. Ingestion' },
          { key: 'KYC_VERIFIED', label: '2. KYC Passed' },
          { key: 'CREDIT_APPRAISED', label: '3. Credit Appraisal' },
          { key: 'DEPT_REVIEWED', label: '4. Legal / Valuation' },
          { key: 'SANCTIONED', label: '5. Sanctioned' },
          { key: 'DISBURSED', label: '6. Disbursed' },
          { key: 'REJECTED', label: 'Rejected' }
        ].map(st => (
          <button
            key={st.key}
            onClick={() => setStageFilter(st.key)}
            className={`btn btn-sm ${stageFilter === st.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', gap: '6px' }}
          >
            <span>{st.label}</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              background: stageFilter === st.key ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              {stageCounts[st.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant</th>
              <th>Loan Scheme</th>
              <th>Amount (₹)</th>
              <th>CIBIL & DTI</th>
              <th>Current Stage</th>
              <th>Assigned Desk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No applications match the selected stage and search filters.
                </td>
              </tr>
            ) : (
              filteredApps.map(app => (
                <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedApp(app)}>
                  <td style={{ fontWeight: 800 }}>
                    <span className="mono" style={{ color: 'var(--cyan-400)', fontSize: '0.85rem' }}>
                      {app.id}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {app.appliedDate}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {app.customerName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.customerPhone}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {app.loanType}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {app.requestedTenureYears} Yrs @ {app.interestRate}%
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{Number(app.requestedAmount).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: app.cibilScore >= 750 ? 'var(--emerald-400)' : app.cibilScore >= 680 ? 'var(--cyan-400)' : 'var(--amber-400)' }}>
                        {app.cibilScore}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        (DTI: {app.dtiRatio}%)
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={app.currentStage} />
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {app.assignedDepartment}
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', gap: '4px', fontSize: '0.78rem' }}
                    >
                      <Eye size={14} />
                      <span>Review</span>
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
