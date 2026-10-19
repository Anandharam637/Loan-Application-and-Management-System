import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatusBadge } from '../common/Badge';
import { SanctionLetterModal } from './SanctionLetterModal';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  AlertCircle,
  FileCheck2,
  Calendar,
  Layers,
  Printer
} from 'lucide-react';

export const ApplicationTracker = ({ onNavigateToLoans }) => {
  const { applications, currentCustomerId } = useLoanContext();

  // Filter applications for the active customer
  const customerApps = applications.filter(a => a.customerId === currentCustomerId);

  const [selectedAppId, setSelectedAppId] = useState(customerApps[0]?.id || null);
  const [showSanctionModal, setShowSanctionModal] = useState(false);

  // Sync selectedAppId if not set
  const activeApp = customerApps.find(a => a.id === selectedAppId) || customerApps[0];

  const STAGES_ORDER = [
    { key: 'SUBMITTED', label: 'Application Submitted', desc: 'Received & Queued for Processing' },
    { key: 'KYC_VERIFIED', label: 'KYC & Identity Check', desc: 'UIDAI e-KYC & PAN Verified' },
    { key: 'CREDIT_APPRAISED', label: 'Credit & CIBIL Check', desc: 'Underwriting & Risk Score Assessment' },
    { key: 'DEPT_REVIEWED', label: 'Dept & Legal Review', desc: 'Technical Valuation & Compliance Review' },
    { key: 'SANCTIONED', label: 'Sanction Letter Issued', desc: 'Approved by Branch Sanctioning Desk' },
    { key: 'DISBURSED', label: 'Funds Disbursed', desc: 'Credited to Bank Account' }
  ];

  const getStageIndex = (stageKey) => {
    if (stageKey === 'REJECTED') return -1;
    return STAGES_ORDER.findIndex(s => s.key === stageKey);
  };

  const currentStageIndex = activeApp ? getStageIndex(activeApp.currentStage) : 0;

  if (customerApps.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--blue-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <FileText size={32} />
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          No Active Applications Found
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '8px auto 20px auto' }}>
          You have not submitted any loan applications under this customer profile yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Application Selector Tabs (if customer has multiple) */}
      {customerApps.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {customerApps.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`btn btn-sm ${app.id === (activeApp?.id) ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', gap: '8px' }}
            >
              <span>{app.loanType} ({app.id})</span>
              <StatusBadge status={app.currentStage} />
            </button>
          ))}
        </div>
      )}

      {activeApp && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Left Column: Progress Pipeline & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Card */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {activeApp.loanType}
                    </h3>
                    <StatusBadge status={activeApp.currentStage} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Application Ref: <strong className="mono" style={{ color: 'var(--cyan-400)' }}>{activeApp.id}</strong> • Applied on {activeApp.appliedDate}
                  </span>
                </div>

                {activeApp.currentStage === 'SANCTIONED' && (
                  <button
                    onClick={() => setShowSanctionModal(true)}
                    className="btn btn-success btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <Printer size={15} />
                    <span>View Sanction Letter</span>
                  </button>
                )}

                {activeApp.currentStage === 'DISBURSED' && (
                  <button
                    onClick={() => onNavigateToLoans && onNavigateToLoans()}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <span>View Active Loan</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              {/* Financial Summary Strip */}
              <div style={{
                background: 'var(--navy-900)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                border: '1px solid var(--surface-glass-border)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requested Amount</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{Number(activeApp.requestedAmount).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interest Rate</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                    {activeApp.interestRate}% p.a.
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tenure</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cyan-400)' }}>
                    {activeApp.requestedTenureYears} Years
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Dept</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {activeApp.assignedDepartment}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Step-by-Step Pipeline Tracker */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
                Application Processing Pipeline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                {STAGES_ORDER.map((stage, idx) => {
                  const isDone = currentStageIndex > idx || activeApp.currentStage === 'DISBURSED';
                  const isCurrent = currentStageIndex === idx && activeApp.currentStage !== 'DISBURSED';
                  const isPending = currentStageIndex < idx;

                  return (
                    <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                      {/* Vertical line connecting nodes */}
                      {idx < STAGES_ORDER.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '17px',
                          top: '36px',
                          bottom: '-20px',
                          width: '2px',
                          background: isDone ? 'var(--emerald-500)' : 'var(--navy-800)',
                          zIndex: 1
                        }} />
                      )}

                      {/* Icon Circle */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isDone ? 'var(--emerald-600)' : isCurrent ? 'var(--blue-600)' : 'var(--navy-900)',
                        border: isDone ? '2px solid var(--emerald-400)' : isCurrent ? '2px solid var(--blue-400)' : '2px solid var(--navy-700)',
                        color: isDone || isCurrent ? '#ffffff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        zIndex: 2,
                        boxShadow: isCurrent ? '0 0 14px rgba(37, 99, 235, 0.6)' : isDone ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
                      }}>
                        {isDone ? <CheckCircle2 size={18} /> : isCurrent ? <Clock size={18} /> : (idx + 1)}
                      </div>

                      {/* Stage details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '0.92rem',
                            fontWeight: isCurrent ? 800 : isDone ? 700 : 500,
                            color: isCurrent ? 'var(--blue-300)' : isDone ? '#ffffff' : 'var(--text-muted)'
                          }}>
                            {stage.label}
                          </span>
                          {isCurrent && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(37, 99, 235, 0.3)', color: 'var(--cyan-400)', fontWeight: 700 }}>
                              IN PROGRESS
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Verification Audit Trail & Documents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Verification Activity Log */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} style={{ color: 'var(--cyan-400)' }} />
                Department Verification Logs
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '340px', overflowY: 'auto' }}>
                {activeApp.verificationNotes?.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--navy-900)',
                      border: '1px solid var(--surface-glass-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--blue-400)' }}>
                        {note.author}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {note.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {note.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Documents Status */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck2 size={18} style={{ color: 'var(--emerald-400)' }} />
                Submitted Documents Checklist
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeApp.documents?.map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--navy-900)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--surface-glass-border)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {doc.type} • {doc.fileUrl}
                      </div>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sanction Letter Modal */}
      {activeApp && activeApp.sanctionDetails && (
        <SanctionLetterModal
          isOpen={showSanctionModal}
          onClose={() => setShowSanctionModal(false)}
          application={activeApp}
        />
      )}
    </div>
  );
};
