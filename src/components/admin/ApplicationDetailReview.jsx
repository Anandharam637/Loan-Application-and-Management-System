import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { StatusBadge } from '../common/Badge';
import { CreditScoreGauge } from '../common/CreditScoreGauge';
import { SanctionLetterModal } from '../customer/SanctionLetterModal';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  FileCheck2, 
  Building2, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Printer, 
  UserCheck, 
  AlertTriangle,
  FileText,
  Send,
  Coins
} from 'lucide-react';

export const ApplicationDetailReview = ({ application, onBack }) => {
  const { 
    userRole, 
    advanceApplicationStage, 
    updateDocumentStatus, 
    sanctionLoanApplication, 
    rejectLoanApplication, 
    disburseLoan 
  } = useLoanContext();

  const [showSanctionForm, setShowSanctionForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showSanctionLetterModal, setShowSanctionLetterModal] = useState(false);

  // Sanction Form State
  const [sanctionData, setSanctionData] = useState({
    sanctionedAmount: application.requestedAmount,
    sanctionedRate: application.interestRate,
    sanctionedTenureYears: application.requestedTenureYears,
    processingFee: Math.round(application.requestedAmount * 0.0035),
    remarks: 'Approved after verification of KYC, CIBIL credit track and income proof.',
    managerName: 'Vikramaditya Rao (Chief Lending Officer)'
  });

  // Department Note State
  const [customNote, setCustomNote] = useState('');
  const [rejectReason, setRejectReason] = useState('Insufficient income coverage / high debt-to-income ratio.');

  const isSanctioned = application.currentStage === 'SANCTIONED';
  const isDisbursed = application.currentStage === 'DISBURSED';
  const isRejected = application.currentStage === 'REJECTED';

  const handleAdvanceStage = (nextStage, dept, officer) => {
    advanceApplicationStage(
      application.id, 
      nextStage, 
      dept, 
      officer, 
      customNote || `Application approved and forwarded to ${dept}.`
    );
    setCustomNote('');
  };

  const handleSanctionSubmit = (e) => {
    e.preventDefault();
    sanctionLoanApplication(application.id, sanctionData);
    setShowSanctionForm(false);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    rejectLoanApplication(application.id, rejectReason, 'Credit Committee');
    setShowRejectForm(false);
  };

  const handleDisburse = () => {
    disburseLoan(application.id);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Back to Application Pipeline</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Status:</span>
          <StatusBadge status={application.currentStage} />
        </div>
      </div>

      {/* Main Application Header Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {application.loanType}
              </h2>
              <span className="mono" style={{ fontSize: '0.9rem', color: 'var(--cyan-400)', background: 'var(--navy-900)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-glass-border)' }}>
                {application.id}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Purpose: <strong>{application.purpose}</strong> • Applied on {application.appliedDate}
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {isSanctioned && !isDisbursed && (
              <>
                <button
                  onClick={() => setShowSanctionLetterModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Printer size={15} />
                  <span>Sanction Letter</span>
                </button>
                <button
                  onClick={handleDisburse}
                  className="btn btn-success btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Coins size={15} />
                  <span>Disburse Funds Now</span>
                </button>
              </>
            )}

            {isDisbursed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-400)', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> Disbursed into Borrower Account
              </div>
            )}

            {!isSanctioned && !isDisbursed && !isRejected && (
              <>
                <button
                  onClick={() => setShowSanctionForm(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Sparkles size={15} />
                  <span>Sanction Loan</span>
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="btn btn-danger btn-sm"
                  style={{ gap: '6px' }}
                >
                  <XCircle size={15} />
                  <span>Reject</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Applicant Key Financials Strip */}
        <div style={{
          background: 'var(--navy-900)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-md)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          border: '1px solid var(--surface-glass-border)'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applicant Name</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {application.customerName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{application.customerPhone}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requested Loan</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--blue-400)' }}>
              ₹{Number(application.requestedAmount).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{application.requestedTenureYears} Years @ {application.interestRate}%</div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly In-Hand</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald-400)' }}>
              ₹{Number(application.monthlyIncome).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DTI: <strong>{application.dtiRatio}%</strong></div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Desk</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-400)' }}>
              {application.assignedDepartment}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (CIBIL & Verification Pipeline) / Right Column (Documents & Notes) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left: CIBIL Score & Stage Advancement Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CIBIL Score Gauge */}
          <CreditScoreGauge
            score={application.cibilScore || 782}
            rating={application.cibilRating || 'Excellent'}
          />

          {/* Department Progression Action Card */}
          {!isSanctioned && !isDisbursed && !isRejected && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} style={{ color: 'var(--cyan-400)' }} />
                Department Workflow Controls
              </h4>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Verification Note / Remarks</label>
                <input
                  type="text"
                  className="form-input"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Identity verified via NSDL / Property documents approved"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {application.currentStage === 'SUBMITTED' && (
                  <button
                    onClick={() => handleAdvanceStage('KYC_VERIFIED', 'KYC & Identity Cell', 'Ananya Roy (KYC Desk)')}
                    className="btn btn-primary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>Approve e-KYC & Forward to Credit Desk</span>
                    <ShieldCheck size={18} />
                  </button>
                )}

                {application.currentStage === 'KYC_VERIFIED' && (
                  <button
                    onClick={() => handleAdvanceStage('CREDIT_APPRAISED', 'Credit Appraisal & Underwriting', 'Suresh Menon (Credit Analyst)')}
                    className="btn btn-primary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>Approve Credit Appraisal & Forward to Dept Review</span>
                    <FileCheck2 size={18} />
                  </button>
                )}

                {application.currentStage === 'CREDIT_APPRAISED' && (
                  <button
                    onClick={() => handleAdvanceStage('DEPT_REVIEWED', 'Branch Sanctioning Authority', 'Technical Appraisal Team')}
                    className="btn btn-primary"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>Complete Dept Review & Forward to Branch Manager</span>
                    <Building2 size={18} />
                  </button>
                )}

                {application.currentStage === 'DEPT_REVIEWED' && (
                  <button
                    onClick={() => setShowSanctionForm(true)}
                    className="btn btn-success"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>Ready for Final Sanction (Issue Sanction Letter)</span>
                    <Sparkles size={18} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Submitted Documents & Verification Activity Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Document Verification Checklist */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck2 size={18} style={{ color: 'var(--emerald-400)' }} />
              Digital Documents Verification Checklist
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {application.documents?.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--navy-900)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-glass-border)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {doc.type} • {doc.fileUrl}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge status={doc.status} />
                    {doc.status !== 'VERIFIED' && !isSanctioned && (
                      <button
                        onClick={() => updateDocumentStatus(application.id, doc.id, 'VERIFIED')}
                        className="btn btn-success btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Activity Timeline */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Department Audit Trail
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
              {application.verificationNotes?.map((n, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--navy-900)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-glass-border)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ color: 'var(--cyan-400)' }}>{n.author}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{n.timestamp}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>{n.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sanction Form Modal */}
      {showSanctionForm && (
        <div className="modal-overlay" onClick={() => setShowSanctionForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-glass-border)', background: 'var(--navy-900)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sanction Loan Facility
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Configure final approved loan amount, interest rate and fees for {application.customerName}.
              </p>
            </div>

            <form onSubmit={handleSanctionSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sanctioned Principal Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={sanctionData.sanctionedAmount}
                  onChange={(e) => setSanctionData({ ...sanctionData, sanctionedAmount: Number(e.target.value) })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Approved Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.05"
                    className="form-input"
                    value={sanctionData.sanctionedRate}
                    onChange={(e) => setSanctionData({ ...sanctionData, sanctionedRate: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Approved Tenure (Years)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={sanctionData.sanctionedTenureYears}
                    onChange={(e) => setSanctionData({ ...sanctionData, sanctionedTenureYears: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Processing Fee (+ GST)</label>
                <input
                  type="number"
                  className="form-input"
                  value={sanctionData.processingFee}
                  onChange={(e) => setSanctionData({ ...sanctionData, processingFee: Number(e.target.value) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sanction Remarks</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={sanctionData.remarks}
                  onChange={(e) => setSanctionData({ ...sanctionData, remarks: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowSanctionForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" style={{ gap: '6px' }}>
                  <Sparkles size={16} />
                  <span>Issue Sanction Letter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Form Modal */}
      {showRejectForm && (
        <div className="modal-overlay" onClick={() => setShowRejectForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-glass-border)', background: 'var(--navy-900)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rose-400)' }}>
                Reject Loan Application
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                State official regulatory reason for declining the credit request.
              </p>
            </div>

            <form onSubmit={handleRejectSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Rejection Reason</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowRejectForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sanction Letter Modal View */}
      {showSanctionLetterModal && (
        <SanctionLetterModal
          isOpen={true}
          onClose={() => setShowSanctionLetterModal(false)}
          application={application}
        />
      )}
    </div>
  );
};
