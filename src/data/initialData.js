// Initial Seed Data for Apex Trust Bank - Loan Management System

export const INITIAL_LOAN_SCHEMES = [
  {
    id: 'scheme-home',
    name: 'Home Loan',
    category: 'Home',
    tagline: 'Turn your dream home into reality with low rates',
    baseInterestRate: 8.50, // per annum
    minInterestRate: 8.25,
    maxInterestRate: 9.50,
    minAmount: 500000,
    maxAmount: 50000000,
    minTenureYears: 5,
    maxTenureYears: 30,
    processingFeePct: 0.35,
    minCibilScore: 700,
    icon: 'Home',
    color: '#2563eb',
    features: [
      'Zero prepayment penalties on floating rates',
      'PMAY subsidy assistance eligible',
      'Up to 90% property value financing',
      'Flexible tenure up to 30 years'
    ],
    requiredDocs: [
      'Identity Proof (Aadhaar/Passport)',
      'Address Proof (Electricity/Passport)',
      'Latest 6 Months Bank Statement',
      '3 Months Salary Slips or 2 Yrs ITR',
      'Property Title Deed & NOC from Builder'
    ]
  },
  {
    id: 'scheme-personal',
    name: 'Personal Express Loan',
    category: 'Personal',
    tagline: 'Instant funds for medical, travel, wedding or emergencies',
    baseInterestRate: 10.75,
    minInterestRate: 10.25,
    maxInterestRate: 14.50,
    minAmount: 50000,
    maxAmount: 2500000,
    minTenureYears: 1,
    maxTenureYears: 5,
    processingFeePct: 1.00,
    minCibilScore: 680,
    icon: 'UserCheck',
    color: '#0ea5e9',
    features: [
      'No collateral or security needed',
      'Disbursal within 24 hours of approval',
      'Minimal digital documentation',
      'Flexible repayment from 12 to 60 months'
    ],
    requiredDocs: [
      'Identity Proof (Aadhaar/PAN)',
      'Current Address Proof',
      'Latest 3 Months Salary Slips',
      'Latest 6 Months Bank Statement'
    ]
  },
  {
    id: 'scheme-vehicle',
    name: 'Auto / Vehicle Loan',
    category: 'Vehicle',
    tagline: 'Drive your dream car or two-wheeler home today',
    baseInterestRate: 8.85,
    minInterestRate: 8.60,
    maxInterestRate: 10.50,
    minAmount: 100000,
    maxAmount: 7500000,
    minTenureYears: 1,
    maxTenureYears: 7,
    processingFeePct: 0.50,
    minCibilScore: 690,
    icon: 'Car',
    color: '#10b981',
    features: [
      'Up to 100% on-road price financing for select cars',
      'Fast-track approval with e-KYC',
      'Attractive terms for Electric Vehicles (EVs)',
      'Tenures up to 84 months'
    ],
    requiredDocs: [
      'Aadhaar & PAN Card',
      'Income Proof / 3 Months Salary Slips',
      'Dealer Proforma Invoice / Quotation',
      '6 Months Bank Account Statement'
    ]
  },
  {
    id: 'scheme-education',
    name: 'Global Education Loan',
    category: 'Education',
    tagline: 'Fund your higher education in India or top universities abroad',
    baseInterestRate: 9.15,
    minInterestRate: 8.95,
    maxInterestRate: 11.25,
    minAmount: 200000,
    maxAmount: 15000000,
    minTenureYears: 3,
    maxTenureYears: 15,
    processingFeePct: 0.50,
    minCibilScore: 650,
    icon: 'GraduationCap',
    color: '#8b5cf6',
    features: [
      'Moratorium period: Course duration + 1 year',
      'Tax benefit under Section 80E',
      'Covers tuition, living expenses, travel & laptop',
      'Collateral-free loans up to ₹40 Lakhs for premier institutes'
    ],
    requiredDocs: [
      'Admission Letter & Fee Structure',
      'Academic Marksheets (10th, 12th, Degree)',
      'Co-borrower KYC & Income Proof',
      'Collateral Documents (if loan > ₹7.5 Lakhs)'
    ]
  },
  {
    id: 'scheme-business',
    name: 'SME / Business Growth Loan',
    category: 'Business',
    tagline: 'Expand operations, purchase machinery, or working capital',
    baseInterestRate: 11.50,
    minInterestRate: 11.00,
    maxInterestRate: 15.00,
    minAmount: 500000,
    maxAmount: 20000000,
    minTenureYears: 1,
    maxTenureYears: 10,
    processingFeePct: 1.25,
    minCibilScore: 710,
    icon: 'Building2',
    color: '#f59e0b',
    features: [
      'Collateral and non-collateral options available',
      'Working capital & Term loan options',
      'Structured repayment linked to cash flows',
      'CGTMSE scheme coverage eligible'
    ],
    requiredDocs: [
      'Business Registration / GST Certificate',
      'Last 3 Years Audited Financials & ITR',
      '12 Months Bank Account Statement',
      'Promoter KYC & PAN Details'
    ]
  },
  {
    id: 'scheme-gold',
    name: 'Smart Gold Loan',
    category: 'Gold',
    tagline: 'Instant liquidity against 22K/24K gold jewellery',
    baseInterestRate: 7.80,
    minInterestRate: 7.50,
    maxInterestRate: 9.20,
    minAmount: 25000,
    maxAmount: 5000000,
    minTenureYears: 0.5,
    maxTenureYears: 3,
    processingFeePct: 0.25,
    minCibilScore: 600,
    icon: 'Coins',
    color: '#eab308',
    features: [
      'Lowest interest rates in the market',
      'Instant appraisal & disbursal in 30 minutes',
      'Safe locker storage with full insurance',
      'Multiple repayment modes: Bullet or Monthly EMI'
    ],
    requiredDocs: [
      'Aadhaar & PAN Card',
      'Customer Passport Size Photo',
      'Physical Gold Ornaments for Valuation'
    ]
  }
];

// Initial Pre-configured User Accounts for Multi-Role Login
export const INITIAL_USERS = [
  // 1. Bank Admin / Branch Manager
  {
    id: 'USR-ADMIN-01',
    username: 'admin@apexbank.com',
    email: 'admin@apexbank.com',
    password: 'admin@123',
    role: 'admin',
    name: 'Vikramaditya Rao',
    designation: 'Chief Lending Officer & Branch Manager',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    department: 'Central Lending & Sanctions Division',
    employeeId: 'EMP-BLR-001'
  },
  // 2. Loan Verification & Credit Officer
  {
    id: 'USR-OFFICER-01',
    username: 'officer@apexbank.com',
    email: 'officer@apexbank.com',
    password: 'officer@123',
    role: 'officer',
    name: 'Ananya Roy',
    designation: 'Senior Credit Underwriter & KYC Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Verification & Appraisal Cell',
    employeeId: 'EMP-BLR-042'
  },
  // 3. Customer 1: Rajesh Kumar
  {
    id: 'USR-CUST-1001',
    username: 'rajesh@apexbank.com',
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    role: 'customer',
    customerId: 'CUST-1001',
    name: 'Rajesh Kumar',
    designation: 'Retail Borrower',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  // 4. Customer 2: Priya Sharma
  {
    id: 'USR-CUST-1002',
    username: 'priya@apexbank.com',
    email: 'priya.sharma@example.com',
    password: 'password123',
    role: 'customer',
    customerId: 'CUST-1002',
    name: 'Priya Sharma',
    designation: 'Education Loan Borrower',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  // 5. Customer 3: Vikram Patel
  {
    id: 'USR-CUST-1003',
    username: 'vikram@apexbank.com',
    email: 'vikram.patel@example.com',
    password: 'password123',
    role: 'customer',
    customerId: 'CUST-1003',
    name: 'Vikram Patel',
    designation: 'SME / Business Borrower',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  // 6. Customer 4: Dr. Anita Desai
  {
    id: 'USR-CUST-1004',
    username: 'anita@apexbank.com',
    email: 'dr.anita.desai@example.com',
    password: 'password123',
    role: 'customer',
    customerId: 'CUST-1004',
    name: 'Dr. Anita Desai',
    designation: 'Professional Borrower',
    avatar: 'https://images.unsplash.com/photo-1594824813594-5b77c595085e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-1001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pan: 'ABCDE1234F',
    aadhaar: 'XXXX-XXXX-4921',
    cibilScore: 782,
    cibilRating: 'Excellent',
    employmentType: 'Salaried - Senior Software Architect',
    employer: 'Infosys Technologies Ltd',
    monthlyIncome: 185000,
    existingEmi: 15000,
    city: 'Bengaluru, Karnataka',
    accountNo: 'SBIN0048921849',
    kycVerified: true,
    joinedDate: '2023-04-15'
  },
  {
    id: 'CUST-1002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98112 34567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    pan: 'FGHIJ5678K',
    aadhaar: 'XXXX-XXXX-8823',
    cibilScore: 745,
    cibilRating: 'Good',
    employmentType: 'Salaried - Product Marketing Manager',
    employer: 'Flipkart India Pvt Ltd',
    monthlyIncome: 140000,
    existingEmi: 0,
    city: 'Mumbai, Maharashtra',
    accountNo: 'SBIN0091823741',
    kycVerified: true,
    joinedDate: '2024-01-10'
  },
  {
    id: 'CUST-1003',
    name: 'Vikram Patel',
    email: 'vikram.patel@example.com',
    phone: '+91 97234 56789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    pan: 'KLMNO9012P',
    aadhaar: 'XXXX-XXXX-3190',
    cibilScore: 672,
    cibilRating: 'Fair',
    employmentType: 'Self-Employed - Manufacturing Business Owner',
    employer: 'Patel Precision Components',
    monthlyIncome: 260000,
    existingEmi: 42000,
    city: 'Ahmedabad, Gujarat',
    accountNo: 'SBIN0012938472',
    kycVerified: true,
    joinedDate: '2023-11-20'
  },
  {
    id: 'CUST-1004',
    name: 'Dr. Anita Desai',
    email: 'dr.anita.desai@example.com',
    phone: '+91 99401 23456',
    avatar: 'https://images.unsplash.com/photo-1594824813594-5b77c595085e?w=150&auto=format&fit=crop&q=80',
    pan: 'PQRST3456U',
    aadhaar: 'XXXX-XXXX-7712',
    cibilScore: 810,
    cibilRating: 'Exceptional',
    employmentType: 'Professional - Senior Cardiologist',
    employer: 'Apollo Hospitals',
    monthlyIncome: 350000,
    existingEmi: 20000,
    city: 'Chennai, Tamil Nadu',
    accountNo: 'SBIN0038472910',
    kycVerified: true,
    joinedDate: '2022-08-05'
  }
];

// Helper to calculate EMI
export const calculateEMI = (principal, annualRate, tenureYears) => {
  const p = Number(principal);
  const r = (Number(annualRate) / 12) / 100;
  const n = Math.round(Number(tenureYears) * 12);
  if (!p || !r || !n) return 0;
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
};

// Helper to generate full month-by-month amortization schedule
export const generateAmortizationSchedule = (principal, annualRate, tenureYears, startDate = new Date(), paidMonths = 0) => {
  const p = Number(principal);
  const monthlyRate = (Number(annualRate) / 12) / 100;
  const totalMonths = Math.round(Number(tenureYears) * 12);
  const emi = calculateEMI(p, annualRate, tenureYears);
  
  let currentBalance = p;
  const schedule = [];
  const start = new Date(startDate);

  for (let month = 1; month <= totalMonths; month++) {
    const interest = Math.round(currentBalance * monthlyRate);
    const principalPaid = Math.min(currentBalance, emi - interest);
    const closingBalance = Math.max(0, currentBalance - principalPaid);
    
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + month);

    let status = 'UPCOMING';
    let paidDate = null;
    let paymentRef = null;

    if (month <= paidMonths) {
      status = 'PAID';
      const pDate = new Date(dueDate);
      pDate.setDate(dueDate.getDate() - 2);
      paidDate = pDate.toISOString().split('T')[0];
      paymentRef = `TXN-EMI-${100000 + month}`;
    } else if (month === paidMonths + 1) {
      status = 'DUE';
    }

    schedule.push({
      monthNumber: month,
      dueDate: dueDate.toISOString().split('T')[0],
      emiAmount: emi,
      principalPaid,
      interestPaid: interest,
      openingBalance: currentBalance,
      closingBalance,
      status,
      paidDate,
      paymentRef
    });

    currentBalance = closingBalance;
    if (currentBalance <= 0) break;
  }

  return { emi, totalMonths, schedule };
};

export const INITIAL_APPLICATIONS = [
  {
    id: 'APP-2026-8901',
    customerId: 'CUST-1001',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh.kumar@example.com',
    customerPhone: '+91 98765 43210',
    schemeId: 'scheme-home',
    loanType: 'Home Loan',
    requestedAmount: 4500000,
    requestedTenureYears: 20,
    interestRate: 8.50,
    purpose: 'Purchase of 3BHK Apartment in Whitefield, Bangalore',
    monthlyIncome: 185000,
    cibilScore: 782,
    cibilRating: 'Excellent',
    dtiRatio: 28.5, // Debt to Income %
    appliedDate: '2026-09-10',
    currentStage: 'SANCTIONED', // SUBMITTED -> KYC_VERIFIED -> CREDIT_APPRAISED -> DEPT_REVIEWED -> SANCTIONED -> DISBURSED (or REJECTED)
    assignedDepartment: 'Branch Sanctioning Desk',
    verificationNotes: [
      { timestamp: '2026-09-10 11:30 AM', author: 'System Bot', note: 'Application received and initial validation successful.' },
      { timestamp: '2026-09-11 02:15 PM', author: 'Ananya Roy (KYC Officer)', note: 'Aadhaar e-KYC and PAN NSDL cross-verification completed with 100% match.' },
      { timestamp: '2026-09-12 04:45 PM', author: 'Suresh Menon (Credit Analyst)', note: 'CIBIL Score verified at 782. Clean repayment track record with zero past defaults. Approved credit risk profile.' },
      { timestamp: '2026-09-14 10:20 AM', author: 'Legal & Technical Dept', note: 'Property title verified clear of encumbrances. Property valuation assessed at ₹62.5 Lakhs. LTV is well within 72% limits.' },
      { timestamp: '2026-09-15 05:10 PM', author: 'Vikramaditya (Branch Manager)', note: 'Sanction letter issued for ₹45,00,000 @ 8.50% p.a. for 20 Years. Ready for Disbursal upon agreement signing.' }
    ],
    documents: [
      { id: 'doc-1', name: 'PAN Card Copy', type: 'Identity Proof', status: 'VERIFIED', uploadDate: '2026-09-10', fileUrl: 'pan_card_rk.pdf' },
      { id: 'doc-2', name: 'Aadhaar Card', type: 'Address Proof', status: 'VERIFIED', uploadDate: '2026-09-10', fileUrl: 'aadhaar_rk.pdf' },
      { id: 'doc-3', name: 'Salary Slips (Last 3 Months)', type: 'Income Proof', status: 'VERIFIED', uploadDate: '2026-09-10', fileUrl: 'salary_slips_jun_aug_2026.pdf' },
      { id: 'doc-4', name: 'Bank Statement (6 Months)', type: 'Financial Record', status: 'VERIFIED', uploadDate: '2026-09-10', fileUrl: 'sbi_statement_6m.pdf' },
      { id: 'doc-5', name: 'Property Sale Agreement & NOC', type: 'Property Document', status: 'VERIFIED', uploadDate: '2026-09-10', fileUrl: 'builder_sale_agreement.pdf' }
    ],
    sanctionDetails: {
      sanctionedAmount: 4500000,
      sanctionedRate: 8.50,
      sanctionedTenureYears: 20,
      sanctionDate: '2026-09-15',
      sanctionRefNo: 'SANCTION/2026/BL-8901',
      sanctionedBy: 'Apex Trust Bank - Bengaluru Main Branch',
      processingFee: 15750,
      calculatedEmi: 39054,
      disbursementStatus: 'PENDING_DISBURSAL'
    }
  },
  {
    id: 'APP-2026-9142',
    customerId: 'CUST-1002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98112 34567',
    schemeId: 'scheme-vehicle',
    loanType: 'Auto / Vehicle Loan',
    requestedAmount: 1200000,
    requestedTenureYears: 5,
    interestRate: 8.85,
    purpose: 'Purchase of Hyundai Creta EV SX',
    monthlyIncome: 140000,
    cibilScore: 745,
    cibilRating: 'Good',
    dtiRatio: 17.8,
    appliedDate: '2026-09-13',
    currentStage: 'CREDIT_APPRAISED',
    assignedDepartment: 'Credit Verification Cell',
    verificationNotes: [
      { timestamp: '2026-09-13 03:20 PM', author: 'System Bot', note: 'Vehicle loan application created.' },
      { timestamp: '2026-09-14 11:00 AM', author: 'Sunil Verma (KYC Desk)', note: 'Identity and employer credentials verified with Flipkart HR portal.' },
      { timestamp: '2026-09-15 02:40 PM', author: 'Meera Nair (Credit Analyst)', note: 'DTI healthy at 17.8%. Proforma invoice from Hyundai authorized dealer verified.' }
    ],
    documents: [
      { id: 'doc-1', name: 'PAN & Aadhaar', type: 'KYC', status: 'VERIFIED', uploadDate: '2026-09-13', fileUrl: 'priya_kyc.pdf' },
      { id: 'doc-2', name: 'Salary Certificate', type: 'Income', status: 'VERIFIED', uploadDate: '2026-09-13', fileUrl: 'salary_cert_flipkart.pdf' },
      { id: 'doc-3', name: 'Dealer Proforma Invoice', type: 'Asset Proof', status: 'VERIFIED', uploadDate: '2026-09-13', fileUrl: 'hyundai_proforma.pdf' }
    ],
    sanctionDetails: null
  },
  {
    id: 'APP-2026-9285',
    customerId: 'CUST-1003',
    customerName: 'Vikram Patel',
    customerEmail: 'vikram.patel@example.com',
    customerPhone: '+91 97234 56789',
    schemeId: 'scheme-business',
    loanType: 'SME / Business Growth Loan',
    requestedAmount: 3500000,
    requestedTenureYears: 4,
    interestRate: 11.50,
    purpose: 'CNC Machining equipment purchase and workshop expansion',
    monthlyIncome: 260000,
    cibilScore: 672,
    cibilRating: 'Fair',
    dtiRatio: 41.2,
    appliedDate: '2026-09-15',
    currentStage: 'KYC_VERIFIED',
    assignedDepartment: 'Technical & Financial Appraisal Cell',
    verificationNotes: [
      { timestamp: '2026-09-15 10:15 AM', author: 'System Bot', note: 'Business loan submission received with GSTIN 24AAACP1234F1Z5.' },
      { timestamp: '2026-09-16 09:30 AM', author: 'Rahul Gupta (KYC Desk)', note: 'GST active and filing status compliant for past 24 months.' }
    ],
    documents: [
      { id: 'doc-1', name: 'GST Certificate & Udyam Aadhar', type: 'Business KYC', status: 'VERIFIED', uploadDate: '2026-09-15', fileUrl: 'gst_certificate.pdf' },
      { id: 'doc-2', name: '3 Years Audited Balance Sheet & P&L', type: 'Financials', status: 'PENDING', uploadDate: '2026-09-15', fileUrl: 'audited_pnl_2024_2026.pdf' },
      { id: 'doc-3', name: 'Machinery Quotation from Supplier', type: 'Asset Proof', status: 'VERIFIED', uploadDate: '2026-09-15', fileUrl: 'cnc_quotation.pdf' }
    ],
    sanctionDetails: null
  },
  {
    id: 'APP-2026-9401',
    customerId: 'CUST-1004',
    customerName: 'Dr. Anita Desai',
    customerEmail: 'dr.anita.desai@example.com',
    customerPhone: '+91 99401 23456',
    schemeId: 'scheme-personal',
    loanType: 'Personal Express Loan',
    requestedAmount: 1500000,
    requestedTenureYears: 3,
    interestRate: 10.75,
    purpose: 'Clinic interior renovation and medical diagnostic gear',
    monthlyIncome: 350000,
    cibilScore: 810,
    cibilRating: 'Exceptional',
    dtiRatio: 12.5,
    appliedDate: '2026-09-16',
    currentStage: 'SUBMITTED',
    assignedDepartment: 'Initial Document Ingestion Desk',
    verificationNotes: [
      { timestamp: '2026-09-16 11:45 AM', author: 'System Bot', note: 'Online express application received. CIBIL score pre-screened at 810.' }
    ],
    documents: [
      { id: 'doc-1', name: 'Medical Registration & PAN', type: 'KYC', status: 'VERIFIED', uploadDate: '2026-09-16', fileUrl: 'doctor_reg_pan.pdf' },
      { id: 'doc-2', name: 'ITR Returns AY 2025-26', type: 'Income Proof', status: 'PENDING', uploadDate: '2026-09-16', fileUrl: 'itr_v_ay2526.pdf' }
    ],
    sanctionDetails: null
  }
];

// Pre-existing Active Loans in the system with amortization schedules and payments
export const INITIAL_ACTIVE_LOANS = [
  {
    id: 'LOAN-ACT-7001',
    applicationId: 'APP-2025-5021',
    customerId: 'CUST-1001',
    customerName: 'Rajesh Kumar',
    accountNo: 'SBIN0048921849',
    loanType: 'Personal Express Loan',
    schemeId: 'scheme-personal',
    principalSanctioned: 500000,
    interestRate: 10.75,
    tenureYears: 3,
    disbursalDate: '2025-03-15',
    firstEmiDate: '2025-04-15',
    status: 'ACTIVE', // ACTIVE, CLOSED, OVERDUE, NPA
    totalEmis: 36,
    paidEmisCount: 17,
    calculatedMonthlyEmi: 16315,
    totalRepaidAmount: 277355,
    remainingPrincipal: 284120,
    ...generateAmortizationSchedule(500000, 10.75, 3, new Date('2025-03-15'), 17)
  },
  {
    id: 'LOAN-ACT-7002',
    applicationId: 'APP-2024-3109',
    customerId: 'CUST-1002',
    customerName: 'Priya Sharma',
    accountNo: 'SBIN0091823741',
    loanType: 'Education Loan',
    schemeId: 'scheme-education',
    principalSanctioned: 1500000,
    interestRate: 9.15,
    tenureYears: 7,
    disbursalDate: '2024-06-01',
    firstEmiDate: '2024-07-01',
    status: 'ACTIVE',
    totalEmis: 84,
    paidEmisCount: 26,
    calculatedMonthlyEmi: 24268,
    totalRepaidAmount: 630968,
    remainingPrincipal: 1115840,
    ...generateAmortizationSchedule(1500000, 9.15, 7, new Date('2024-06-01'), 26)
  },
  {
    id: 'LOAN-ACT-7003',
    applicationId: 'APP-2023-1188',
    customerId: 'CUST-1003',
    customerName: 'Vikram Patel',
    accountNo: 'SBIN0012938472',
    loanType: 'Auto / Vehicle Loan',
    schemeId: 'scheme-vehicle',
    principalSanctioned: 800000,
    interestRate: 8.85,
    tenureYears: 4,
    disbursalDate: '2023-08-10',
    firstEmiDate: '2023-09-10',
    status: 'OVERDUE', // Has 1 overdue installment
    totalEmis: 48,
    paidEmisCount: 35,
    calculatedMonthlyEmi: 19853,
    totalRepaidAmount: 694855,
    remainingPrincipal: 245100,
    overdueMonths: 1,
    overdueAmount: 19853,
    lateFee: 500,
    ...generateAmortizationSchedule(800000, 8.85, 4, new Date('2023-08-10'), 35)
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-90214',
    loanId: 'LOAN-ACT-7001',
    customerName: 'Rajesh Kumar',
    amount: 16315,
    date: '2026-08-14 10:45 AM',
    type: 'EMI Payment',
    method: 'UPI / NetBanking',
    status: 'SUCCESS',
    reference: 'SBI/UPI/62819203819'
  },
  {
    id: 'TXN-90188',
    loanId: 'LOAN-ACT-7002',
    customerName: 'Priya Sharma',
    amount: 24268,
    date: '2026-08-29 04:12 PM',
    type: 'EMI Payment',
    method: 'Auto-Debit (NACH)',
    status: 'SUCCESS',
    reference: 'NACH/ACH/9918237410'
  },
  {
    id: 'TXN-90050',
    loanId: 'LOAN-ACT-7001',
    customerName: 'Rajesh Kumar',
    amount: 16315,
    date: '2026-07-13 11:20 AM',
    type: 'EMI Payment',
    method: 'Debit Card',
    status: 'SUCCESS',
    reference: 'PG/CARD/5548910293'
  }
];
