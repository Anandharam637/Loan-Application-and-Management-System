import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useLoanContext } from '../../context/LoanContext';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';

export const EmiPaymentModal = ({ isOpen, onClose, loan }) => {
  const { payLoanEMI } = useLoanContext();

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [upiId, setUpiId] = useState('rajesh@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('432');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState(null);

  if (!loan) return null;

  // Find next due EMI item
  const nextDueEmi = loan.schedule?.find(s => s.status === 'DUE' || s.status === 'UPCOMING') || {
    monthNumber: loan.paidEmisCount + 1,
    emiAmount: loan.calculatedMonthlyEmi,
    principalPaid: Math.round(loan.calculatedMonthlyEmi * 0.7),
    interestPaid: Math.round(loan.calculatedMonthlyEmi * 0.3)
  };

  const lateFee = loan.status === 'OVERDUE' ? (loan.lateFee || 500) : 0;
  const totalPayable = nextDueEmi.emiAmount + lateFee;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const methodName = paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod === 'CARD' ? 'Debit Card (••8912)' : `NetBanking (${selectedBank})`;
      const txn = payLoanEMI(loan.id, methodName);
      setIsProcessing(false);
      setCompletedTxn(txn);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const handleClose = () => {
    setCompletedTxn(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={completedTxn ? "Payment Successful!" : `Pay EMI Installment #${nextDueEmi.monthNumber}`}
      subtitle={completedTxn ? `Transaction ID: ${completedTxn.id}` : `${loan.loanType} - ${loan.id}`}
      maxWidth="580px"
    >
      {completedTxn ? (
        /* Payment Receipt View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="printable-document" style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '24px 28px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto' }}>
                <CheckCircle2 size={30} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>
                ₹{Number(completedTxn.amount).toLocaleString('en-IN')} Received
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Apex Trust Bank EMI Repayment e-Receipt
              </p>
            </div>

            <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '14px 0', margin: '14px 0', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Loan Facility ID</span>
                <strong>{loan.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Borrower Name</span>
                <strong>{loan.customerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Installment Month</span>
                <strong>Month #{nextDueEmi.monthNumber} of {loan.totalEmis}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Mode</span>
                <strong>{completedTxn.method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Bank Reference</span>
                <strong className="mono" style={{ fontSize: '0.8rem' }}>{completedTxn.reference}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Timestamp</span>
                <strong>{completedTxn.date}</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Instant ledger updated. Remaining loan balance reduced.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }} className="no-print">
            <button onClick={() => window.print()} className="btn btn-secondary" style={{ gap: '6px' }}>
              <Printer size={16} /> Print Receipt
            </button>
            <button onClick={handleClose} className="btn btn-primary">
              Done
            </button>
          </div>
        </div>
      ) : (
        /* Payment Checkout View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Amount Due Card */}
          <div style={{
            background: 'var(--navy-900)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Payable Amount
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                ₹ {Number(totalPayable).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Principal: ₹{Number(nextDueEmi.principalPaid).toLocaleString('en-IN')} + Interest: ₹{Number(nextDueEmi.interestPaid).toLocaleString('en-IN')}
                {lateFee > 0 && <span style={{ color: 'var(--rose-400)' }}> + Late Fee: ₹{lateFee}</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-warning">
                Due Inst. #{nextDueEmi.monthNumber}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block' }}>
              Choose Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'UPI' ? '2px solid var(--blue-500)' : '1px solid var(--surface-glass-border)',
                  background: paymentMethod === 'UPI' ? 'rgba(37, 99, 235, 0.15)' : 'var(--navy-900)',
                  color: paymentMethod === 'UPI' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={20} style={{ color: 'var(--cyan-400)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>UPI App</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'CARD' ? '2px solid var(--blue-500)' : '1px solid var(--surface-glass-border)',
                  background: paymentMethod === 'CARD' ? 'rgba(37, 99, 235, 0.15)' : 'var(--navy-900)',
                  color: paymentMethod === 'CARD' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={20} style={{ color: 'var(--emerald-400)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'NETBANKING' ? '2px solid var(--blue-500)' : '1px solid var(--surface-glass-border)',
                  background: paymentMethod === 'NETBANKING' ? 'rgba(37, 99, 235, 0.15)' : 'var(--navy-900)',
                  color: paymentMethod === 'NETBANKING' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={20} style={{ color: 'var(--amber-400)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>NetBanking</span>
              </button>
            </div>
          </div>

          {/* Method Details */}
          {paymentMethod === 'UPI' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Enter UPI ID / VPA</label>
              <input
                type="text"
                className="form-input"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okbank"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supported: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
              </span>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    className="form-input"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'NETBANKING' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Bank</label>
              <select
                className="form-select"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="State Bank of India">State Bank of India</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
              </select>
            </div>
          )}

          {/* Trust Guarantee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--emerald-400)' }} />
            256-Bit Bank Grade Encryption • NPCI / RBI Certified Payment Gateway
          </div>

          {/* Pay Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={handleClose} className="btn btn-secondary" disabled={isProcessing}>
              Cancel
            </button>
            <button
              onClick={handlePay}
              className="btn btn-success"
              style={{ minWidth: '160px' }}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${Number(totalPayable).toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
