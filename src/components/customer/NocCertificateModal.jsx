import React from 'react';
import { Modal } from '../common/Modal';
import { Landmark, Printer, CheckCircle2, Award } from 'lucide-react';

export const NocCertificateModal = ({ isOpen, onClose, loan }) => {
  if (!loan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="No Objection Certificate (NOC)"
      subtitle={`Loan Clearance Certificate - ${loan.id}`}
      maxWidth="760px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="printable-document" style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '36px 40px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #059669', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Landmark size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                  APEX TRUST BANK
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Loan Settlement & NOC Issuance Desk
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#475569' }}>
              <div><strong>NOC Ref:</strong> NOC/{new Date().getFullYear()}/{loan.id.replace('LOAN-ACT-', '')}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</div>
              <div style={{ color: '#059669', fontWeight: 700 }}>● 100% PAID & CLEARED</div>
            </div>
          </div>

          {/* Certificate Title */}
          <div style={{ textAlign: 'center', margin: '20px 0 28px 0' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 18px',
              background: '#ecfdf5',
              color: '#065f46',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0'
            }}>
              <Award size={18} /> NO OBJECTION CERTIFICATE / LOAN CLEARANCE
            </span>
          </div>

          {/* Certificate Statement */}
          <div style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, marginBottom: '24px' }}>
            <p style={{ marginBottom: '14px' }}>
              This is to certify that <strong>{loan.customerName}</strong> holding Account Number <strong>{loan.accountNo}</strong> has availed a <strong>{loan.loanType}</strong> (Facility Ref: <strong>{loan.id}</strong>) for a principal amount of <strong>₹{Number(loan.principalSanctioned).toLocaleString('en-IN')}</strong> from Apex Trust Bank.
            </p>
            <p style={{ marginBottom: '14px' }}>
              We confirm that the entire outstanding loan balance along with applicable interest and charges has been <strong>fully paid and settled in full</strong> as of today. There are no remaining dues or liabilities against the borrower with respect to this loan facility.
            </p>
            <p>
              The Bank hereby releases all liens/hypothecations and raises <strong>NO OBJECTION</strong> towards the borrower for all legal and regulatory intents.
            </p>
          </div>

          {/* Summary Table */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Paid</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#065f46' }}>₹{Number(loan.totalRepaidAmount).toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tenure Completed</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{loan.paidEmisCount} / {loan.totalEmis} EMIs</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Outstanding Balance</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#059669' }}>₹ 0.00 (NIL)</div>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>
              <CheckCircle2 size={18} /> Official System Generated NOC
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '1.4rem', color: '#065f46' }}>
                Authorized Signatory
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                Chief Recovery & Clearance Manager
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Apex Trust Bank
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }} className="no-print">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-success" style={{ gap: '8px' }}>
            <Printer size={18} />
            <span>Print NOC Certificate</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
