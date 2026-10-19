import { db } from '../db.js';

export const getLoans = (req, res) => {
  let loans = db.get('activeLoans');
  const { customerId, status } = req.query;

  if (customerId) {
    loans = loans.filter(l => l.customerId === customerId);
  }
  if (status && status !== 'ALL') {
    loans = loans.filter(l => l.status === status);
  }

  return res.json({ success: true, data: loans });
};

export const getLoanById = (req, res) => {
  const loan = db.findById('activeLoans', req.params.id);
  if (!loan) {
    return res.status(404).json({ success: false, error: 'Loan facility not found' });
  }
  return res.json({ success: true, data: loan });
};

export const payEmi = (req, res) => {
  const { paymentMethod = 'UPI / NetBanking' } = req.body;
  const loan = db.findById('activeLoans', req.params.id);

  if (!loan) {
    return res.status(404).json({ success: false, error: 'Loan facility not found' });
  }

  const currentSchedule = [...loan.schedule];
  const nextDueIndex = currentSchedule.findIndex(item => item.status === 'DUE' || item.status === 'UPCOMING');

  if (nextDueIndex === -1) {
    return res.status(400).json({ success: false, error: 'All installments for this loan have already been paid in full.' });
  }

  const dueItem = currentSchedule[nextDueIndex];
  const paidAmount = dueItem.emiAmount;
  const paymentRef = `TXN-EMI-${Math.floor(100000 + Math.random() * 900000)}`;

  currentSchedule[nextDueIndex] = {
    ...dueItem,
    status: 'PAID',
    paidDate: new Date().toISOString().split('T')[0],
    paymentRef
  };

  if (nextDueIndex + 1 < currentSchedule.length) {
    currentSchedule[nextDueIndex + 1] = {
      ...currentSchedule[nextDueIndex + 1],
      status: 'DUE'
    };
  }

  const newPaidCount = loan.paidEmisCount + 1;
  const isCompleted = newPaidCount >= loan.totalEmis;
  const newRemainingPrincipal = dueItem.closingBalance;
  const newTotalRepaid = (loan.totalRepaidAmount || 0) + dueItem.emiAmount;

  const updatedLoan = db.update('activeLoans', req.params.id, {
    paidEmisCount: newPaidCount,
    remainingPrincipal: newRemainingPrincipal,
    totalRepaidAmount: newTotalRepaid,
    status: isCompleted ? 'CLOSED' : 'ACTIVE',
    overdueMonths: 0,
    overdueAmount: 0,
    lateFee: 0,
    schedule: currentSchedule
  });

  const newTxn = {
    id: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
    loanId: loan.id,
    customerName: loan.customerName,
    amount: paidAmount,
    date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'EMI Payment',
    method: paymentMethod,
    status: 'SUCCESS',
    reference: `UPI/PAY/${Math.floor(1000000000 + Math.random() * 9000000000)}`
  };

  db.insert('transactions', newTxn);

  return res.json({
    success: true,
    data: {
      loan: updatedLoan,
      transaction: newTxn
    }
  });
};

export const getTransactions = (req, res) => {
  const txns = db.get('transactions');
  const { loanId } = req.query;
  if (loanId) {
    return res.json({ success: true, data: txns.filter(t => t.loanId === loanId) });
  }
  return res.json({ success: true, data: txns });
};
