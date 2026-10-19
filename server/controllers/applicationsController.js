import { db } from '../db.js';
import { calculateEMI, generateAmortizationSchedule } from '../../src/data/initialData.js';

export const getApplications = (req, res) => {
  let apps = db.get('applications');
  const { customerId, stage, schemeId, search } = req.query;

  if (customerId) {
    apps = apps.filter(a => a.customerId === customerId);
  }
  if (stage && stage !== 'ALL') {
    apps = apps.filter(a => a.currentStage === stage);
  }
  if (schemeId && schemeId !== 'ALL') {
    apps = apps.filter(a => a.schemeId === schemeId);
  }
  if (search) {
    const term = search.toLowerCase();
    apps = apps.filter(a =>
      a.customerName.toLowerCase().includes(term) ||
      a.id.toLowerCase().includes(term) ||
      a.customerPhone.toLowerCase().includes(term) ||
      a.loanType.toLowerCase().includes(term)
    );
  }

  return res.json({ success: true, data: apps });
};

export const getApplicationById = (req, res) => {
  const app = db.findById('applications', req.params.id);
  if (!app) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }
  return res.json({ success: true, data: app });
};

export const submitApplication = (req, res) => {
  const formData = req.body;
  const customers = db.get('customers');
  const schemes = db.get('schemes');

  const applicant = customers.find(c => c.id === formData.customerId) || customers[0];
  const scheme = schemes.find(s => s.id === formData.schemeId);

  const monthlyIncome = applicant.monthlyIncome || 100000;
  const estEmi = calculateEMI(formData.requestedAmount, scheme ? scheme.baseInterestRate : 9.5, formData.requestedTenureYears);
  const totalMonthlyDebt = (applicant.existingEmi || 0) + estEmi;
  const dtiRatio = Number(((totalMonthlyDebt / monthlyIncome) * 100).toFixed(1));

  const newAppId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newApplication = {
    id: newAppId,
    customerId: applicant.id,
    customerName: applicant.name,
    customerEmail: applicant.email,
    customerPhone: applicant.phone,
    schemeId: formData.schemeId,
    loanType: scheme ? scheme.name : 'Custom Loan',
    requestedAmount: Number(formData.requestedAmount),
    requestedTenureYears: Number(formData.requestedTenureYears),
    interestRate: scheme ? scheme.baseInterestRate : 9.5,
    purpose: formData.purpose || 'Personal / Business capital',
    monthlyIncome: applicant.monthlyIncome,
    cibilScore: applicant.cibilScore,
    cibilRating: applicant.cibilRating,
    dtiRatio: dtiRatio,
    appliedDate: new Date().toISOString().split('T')[0],
    currentStage: 'SUBMITTED',
    assignedDepartment: 'Initial Document Ingestion Desk',
    verificationNotes: [
      {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
        author: 'Customer Web Portal',
        note: `Application submitted for ₹${Number(formData.requestedAmount).toLocaleString('en-IN')}. Ingestion queue initialized.`
      }
    ],
    documents: formData.documents || [
      { id: 'doc-1', name: 'Identity & Address Proof', type: 'KYC', status: 'PENDING', uploadDate: new Date().toISOString().split('T')[0], fileUrl: 'kyc_proof.pdf' },
      { id: 'doc-2', name: 'Income / Bank Statements', type: 'Financial', status: 'PENDING', uploadDate: new Date().toISOString().split('T')[0], fileUrl: 'income_statement.pdf' }
    ],
    sanctionDetails: null
  };

  db.insert('applications', newApplication);
  return res.status(201).json({ success: true, data: newApplication });
};

export const advanceStage = (req, res) => {
  const { nextStage, departmentName, officerName, noteText } = req.body;
  const app = db.findById('applications', req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  const newNote = {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
    author: officerName || 'Loan Officer',
    note: noteText || `Stage progressed to ${nextStage.replace('_', ' ')}.`
  };

  const updated = db.update('applications', req.params.id, {
    currentStage: nextStage,
    assignedDepartment: departmentName || app.assignedDepartment,
    verificationNotes: [...app.verificationNotes, newNote]
  });

  return res.json({ success: true, data: updated });
};

export const updateDocStatus = (req, res) => {
  const { docId } = req.params;
  const { status } = req.body;
  const app = db.findById('applications', req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  const updatedDocs = app.documents.map(d => d.id === docId ? { ...d, status } : d);
  const updated = db.update('applications', req.params.id, { documents: updatedDocs });

  return res.json({ success: true, data: updated });
};

export const sanctionApplication = (req, res) => {
  const { sanctionedAmount, sanctionedRate, sanctionedTenureYears, processingFee, remarks, managerName } = req.body;
  const app = db.findById('applications', req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  const calculatedEmi = calculateEMI(sanctionedAmount, sanctionedRate, sanctionedTenureYears);

  const newNote = {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
    author: managerName || 'Branch Manager',
    note: `Loan Sanctioned: ₹${Number(sanctionedAmount).toLocaleString('en-IN')} @ ${sanctionedRate}% for ${sanctionedTenureYears} Years. Remarks: ${remarks || 'Approved after complete verification.'}`
  };

  const sanctionDetails = {
    sanctionedAmount: Number(sanctionedAmount),
    sanctionedRate: Number(sanctionedRate),
    sanctionedTenureYears: Number(sanctionedTenureYears),
    sanctionDate: new Date().toISOString().split('T')[0],
    sanctionRefNo: `SANCTION/${new Date().getFullYear()}/BL-${Math.floor(1000 + Math.random() * 9000)}`,
    sanctionedBy: 'Apex Trust Bank - Central Lending Division',
    processingFee: Number(processingFee || 0),
    calculatedEmi,
    disbursementStatus: 'PENDING_DISBURSAL'
  };

  const updated = db.update('applications', req.params.id, {
    currentStage: 'SANCTIONED',
    assignedDepartment: 'Branch Sanctioning Desk',
    verificationNotes: [...app.verificationNotes, newNote],
    sanctionDetails
  });

  return res.json({ success: true, data: updated });
};

export const rejectApplication = (req, res) => {
  const { reason, officerName } = req.body;
  const app = db.findById('applications', req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  const newNote = {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
    author: officerName || 'Credit Committee',
    note: `Loan Application Rejected. Reason: ${reason || 'Criteria mismatch'}`
  };

  const updated = db.update('applications', req.params.id, {
    currentStage: 'REJECTED',
    rejectionReason: reason,
    verificationNotes: [...app.verificationNotes, newNote]
  });

  return res.json({ success: true, data: updated });
};

export const disburseApplication = (req, res) => {
  const app = db.findById('applications', req.params.id);

  if (!app || !app.sanctionDetails) {
    return res.status(400).json({ success: false, error: 'Application is not sanctioned yet.' });
  }

  const customers = db.get('customers');
  const sanction = app.sanctionDetails;
  const applicant = customers.find(c => c.id === app.customerId) || customers[0];
  const newLoanId = `LOAN-ACT-${Math.floor(7000 + Math.random() * 2000)}`;
  const disbursalDate = new Date().toISOString().split('T')[0];

  const amort = generateAmortizationSchedule(
    sanction.sanctionedAmount,
    sanction.sanctionedRate,
    sanction.sanctionedTenureYears,
    new Date(),
    0
  );

  const newActiveLoan = {
    id: newLoanId,
    applicationId: app.id,
    customerId: app.customerId,
    customerName: app.customerName,
    accountNo: applicant.accountNo || 'SBIN0048921849',
    loanType: app.loanType,
    schemeId: app.schemeId,
    principalSanctioned: sanction.sanctionedAmount,
    interestRate: sanction.sanctionedRate,
    tenureYears: sanction.sanctionedTenureYears,
    disbursalDate: disbursalDate,
    firstEmiDate: amort.schedule[0]?.dueDate || disbursalDate,
    status: 'ACTIVE',
    totalEmis: amort.totalMonths,
    paidEmisCount: 0,
    calculatedMonthlyEmi: amort.emi,
    totalRepaidAmount: 0,
    remainingPrincipal: sanction.sanctionedAmount,
    overdueMonths: 0,
    overdueAmount: 0,
    ...amort
  };

  db.insert('activeLoans', newActiveLoan);

  const updatedApp = db.update('applications', req.params.id, {
    currentStage: 'DISBURSED',
    sanctionDetails: {
      ...app.sanctionDetails,
      disbursementStatus: 'DISBURSED',
      disbursedLoanId: newLoanId,
      disbursalDate
    },
    verificationNotes: [
      ...app.verificationNotes,
      {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
        author: 'Treasury Disbursal Dept',
        note: `₹${Number(sanction.sanctionedAmount).toLocaleString('en-IN')} disbursed into account ${applicant.accountNo || 'SBIN0048921849'}. Facility ID: ${newLoanId}.`
      }
    ]
  });

  const disbursalTxn = {
    id: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
    loanId: newLoanId,
    customerName: app.customerName,
    amount: sanction.sanctionedAmount,
    date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'Disbursal Credit',
    method: 'Direct Bank NEFT / RTGS',
    status: 'SUCCESS',
    reference: `DISB/RTGS/${Math.floor(1000000000 + Math.random() * 9000000000)}`
  };

  db.insert('transactions', disbursalTxn);

  return res.json({
    success: true,
    data: {
      application: updatedApp,
      activeLoan: newActiveLoan,
      transaction: disbursalTxn
    }
  });
};
