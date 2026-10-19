import React from 'react';
import { Modal } from '../common/Modal';
import { Landmark, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const SanctionLetterModal = ({ isOpen, onClose, application }) => {
  if (!application || !application.sanctionDetails) return null;

  const { sanctionDetails } = application;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Bank Loan Sanction Letter"
      subtitle={`Reference: ${sanctionDetails.sanctionRefNo}`}
      maxWidth="800px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Printable Document Box */}
        <div className="printable-document" style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '36px 40px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #2563eb', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Landmark size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a', margin: 0, letterSpacing: '-0.02em' }}>
                  APEX TRUST BANK
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Retail Lending & Credit Sanctions Division • Central Office
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#475569' }}>
              <div><strong>Sanction Ref:</strong> {sanctionDetails.sanctionRefNo}</div>
              <div><strong>Date of Issue:</strong> {sanctionDetails.sanctionDate}</div>
              <div style={{ color: '#059669', fontWeight: 700 }}>● IN-PRINCIPLE SANCTIONED</div>
            </div>
          </div>

          {/* Recipient Details */}
          <div style={{ marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>To,</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{application.customerName}</div>
            <div style={{ color: '#334155' }}>Email: {application.customerEmail} | Phone: {application.customerPhone}</div>
            <div style={{ color: '#334155' }}>Application ID: <strong>{application.id}</strong></div>
          </div>

          {/* Letter Body */}
          <div style={{ marginBottom: '24px', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '12px' }}>
              Dear <strong>{application.customerName}</strong>,
            </p>
            <p>
              We are pleased to inform you that with reference to your loan application for <strong>{application.loanType}</strong> ({application.purpose}), Apex Trust Bank has in-principle sanctioned your credit facility based on the terms and conditions outlined below:
            </p>
          </div>

          {/* Sanction Terms Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569', width: '45%' }}>Sanctioned Loan Amount</td>
                <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1e40af', fontSize: '1.1rem' }}>
                  ₹ {Number(sanctionDetails.sanctionedAmount).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Loan Scheme / Product</td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{application.loanType}</td>
              </tr>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Sanctioned Interest Rate</td>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#059669' }}>
                  {sanctionDetails.sanctionedRate}% p.a. (Floating / Reducing Balance)
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Loan Tenure</td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                  {sanctionDetails.sanctionedTenureYears} Years ({sanctionDetails.sanctionedTenureYears * 12} Monthly Installments)
                </td>
              </tr>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Equated Monthly Installment (EMI)</td>
                <td style={{ padding: '10px 14px', fontWeight: 800, color: '#0f172a' }}>
                  ₹ {Number(sanctionDetails.calculatedEmi).toLocaleString('en-IN')} / month
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Processing Fee (+ GST)</td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                  ₹ {Number(sanctionDetails.processingFee).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#475569' }}>Prepayment / Foreclosure Charges</td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#059669' }}>NIL (Zero Penalty on Individual Floating Loans)</td>
              </tr>
            </tbody>
          </table>

          {/* Verification & Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>
                <ShieldCheck size={18} /> Digitally Signed & System Verified
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Apex Trust Bank Core Lending Engine • RBI Reg. No: B-991204
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '1.4rem', color: '#1e3a8a' }}>
                Vikramaditya Rao
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                Chief Lending Officer & Branch Sanctioning Desk
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
          <button onClick={handlePrint} className="btn btn-primary" style={{ gap: '8px' }}>
            <Printer size={18} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
