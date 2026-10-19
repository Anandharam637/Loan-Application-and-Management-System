import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_LOAN_SCHEMES,
  INITIAL_CUSTOMERS,
  INITIAL_APPLICATIONS,
  INITIAL_ACTIVE_LOANS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  calculateEMI,
  generateAmortizationSchedule
} from '../data/initialData';
import {
  authApi,
  schemesApi,
  customersApi,
  applicationsApi,
  loansApi,
  analyticsApi
} from '../services/api';

const LoanContext = createContext();

const STORAGE_KEYS = {
  USERS: 'apex_lms_users',
  CURRENT_USER: 'apex_lms_current_user',
  SCHEMES: 'apex_lms_schemes',
  CUSTOMERS: 'apex_lms_customers',
  APPLICATIONS: 'apex_lms_applications',
  ACTIVE_LOANS: 'apex_lms_active_loans',
  TRANSACTIONS: 'apex_lms_transactions'
};

export const LoanProvider = ({ children }) => {
  // 1. Users & Auth State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Financial Entities
  const [schemes, setSchemes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    return saved ? JSON.parse(saved) : INITIAL_LOAN_SCHEMES;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [activeLoans, setActiveLoans] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOANS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_LOANS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // 3. UI States
  const [activeView, setActiveView] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);

  // Sync state from Backend API on mount
  useEffect(() => {
    const syncFromBackend = async () => {
      try {
        const [usersRes, schemesRes, customersRes, appsRes, loansRes, txnsRes] = await Promise.all([
          authApi.getUsers().catch(() => null),
          schemesApi.getAll().catch(() => null),
          customersApi.getAll().catch(() => null),
          applicationsApi.getAll().catch(() => null),
          loansApi.getAll().catch(() => null),
          loansApi.getTransactions().catch(() => null)
        ]);

        if (usersRes?.success && usersRes.data?.length) setUsers(usersRes.data);
        if (schemesRes?.success && schemesRes.data?.length) setSchemes(schemesRes.data);
        if (customersRes?.success && customersRes.data?.length) setCustomers(customersRes.data);
        if (appsRes?.success && appsRes.data?.length) setApplications(appsRes.data);
        if (loansRes?.success && loansRes.data?.length) setActiveLoans(loansRes.data);
        if (txnsRes?.success && txnsRes.data?.length) setTransactions(txnsRes.data);

        setBackendOnline(true);
      } catch (err) {
        console.warn('Syncing with local cache fallback');
      }
    };
    syncFromBackend();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LOANS, JSON.stringify(activeLoans));
  }, [activeLoans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Toast Helper
  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const userRole = currentUser?.role || 'customer';
  const currentCustomerId = currentUser?.customerId || 'CUST-1001';
  const currentCustomer = customers.find(c => c.id === currentCustomerId) || customers[0];

  // ==================== AUTH ACTIONS ====================

  const login = async (emailOrUsername, password) => {
    try {
      const res = await authApi.login(emailOrUsername, password);
      if (res.success) {
        setCurrentUser(res.user);
        addToast('Login Successful', `Welcome, ${res.user.name} (${res.user.role.toUpperCase()})`, 'success');
        return { success: true, user: res.user };
      }
    } catch (err) {
      // Fallback local check
      const foundUser = users.find(u => 
        (u.username.toLowerCase() === emailOrUsername.toLowerCase() || u.email.toLowerCase() === emailOrUsername.toLowerCase()) && 
        u.password === password
      );
      if (foundUser) {
        setCurrentUser(foundUser);
        addToast('Login Successful', `Welcome, ${foundUser.name} (${foundUser.role.toUpperCase()})`, 'success');
        return { success: true, user: foundUser };
      }
    }
    addToast('Login Failed', 'Invalid email or password.', 'error');
    return { success: false, error: 'Invalid email/username or password.' };
  };

  const logout = () => {
    const userName = currentUser?.name || 'User';
    setCurrentUser(null);
    addToast('Logged Out', `Session ended for ${userName}.`, 'info');
  };

  const switchAccountDirectly = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addToast('Profile Switched', `Logged in as ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  const registerCustomer = async (regData) => {
    try {
      const res = await authApi.register(regData);
      if (res.success) {
        setCustomers(prev => [res.customer, ...prev]);
        setUsers(prev => [...prev, res.user]);
        setCurrentUser(res.user);
        addToast('Account Created!', `Welcome to Apex Trust Bank, ${regData.name}!`, 'success');
        return res.user;
      }
    } catch (err) {
      console.warn('Falling back to local registration');
    }

    // Local fallback
    const newCustId = `CUST-${Math.floor(1005 + Math.random() * 8000)}`;
    const newUserId = `USR-CUST-${Math.floor(1005 + Math.random() * 8000)}`;

    const newCustomerObj = {
      id: newCustId,
      name: regData.name,
      email: regData.email,
      phone: regData.phone || '+91 98000 12345',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      pan: (regData.pan || 'ABCDE1234F').toUpperCase(),
      aadhaar: 'XXXX-XXXX-9921',
      cibilScore: Number(regData.cibilScore || 750),
      cibilRating: Number(regData.cibilScore || 750) >= 750 ? 'Excellent' : 'Good',
      employmentType: regData.employmentType || 'Salaried - Professional',
      employer: regData.employer || 'Private Enterprise',
      monthlyIncome: Number(regData.monthlyIncome || 120000),
      existingEmi: 0,
      city: regData.city || 'Bengaluru, Karnataka',
      accountNo: `SBIN00${Math.floor(10000000 + Math.random() * 90000000)}`,
      kycVerified: true,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const newUserObj = {
      id: newUserId,
      username: regData.email,
      email: regData.email,
      password: regData.password || 'password123',
      role: 'customer',
      customerId: newCustId,
      name: regData.name,
      designation: 'New Retail Customer',
      avatar: newCustomerObj.avatar
    };

    setCustomers(prev => [...prev, newCustomerObj]);
    setUsers(prev => [...prev, newUserObj]);
    setCurrentUser(newUserObj);

    addToast('Account Created!', `Welcome to Apex Trust Bank, ${regData.name}!`, 'success');
    return newUserObj;
  };

  // ==================== LOAN ACTIONS ====================

  const submitLoanApplication = async (formData) => {
    try {
      const res = await applicationsApi.submit({
        ...formData,
        customerId: currentCustomerId
      });
      if (res.success && res.data) {
        setApplications(prev => [res.data, ...prev]);
        addToast('Application Submitted!', `Application #${res.data.id} registered on server.`, 'success');
        return res.data;
      }
    } catch (err) {
      console.warn('Using local fallback for application submit');
    }

    const scheme = schemes.find(s => s.id === formData.schemeId);
    const applicant = currentCustomer;
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
      purpose: formData.purpose || 'Personal / General requirements',
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
          author: 'Customer Portal',
          note: `Application submitted online for ₹${Number(formData.requestedAmount).toLocaleString('en-IN')}. Awaiting KYC verification.`
        }
      ],
      documents: formData.documents || [
        { id: 'doc-1', name: 'Identity & Address Proof', type: 'KYC', status: 'PENDING', uploadDate: new Date().toISOString().split('T')[0], fileUrl: 'kyc_proof.pdf' },
        { id: 'doc-2', name: 'Income / Bank Statements', type: 'Financial', status: 'PENDING', uploadDate: new Date().toISOString().split('T')[0], fileUrl: 'income_statement.pdf' }
      ],
      sanctionDetails: null
    };

    setApplications(prev => [newApplication, ...prev]);
    addToast('Application Submitted!', `Application #${newAppId} created successfully.`, 'success');
    return newApplication;
  };

  const advanceApplicationStage = async (appId, nextStage, departmentName, officerName, noteText) => {
    try {
      const res = await applicationsApi.advanceStage(appId, {
        nextStage,
        departmentName,
        officerName,
        noteText
      });
      if (res.success && res.data) {
        setApplications(prev => prev.map(a => a.id === appId ? res.data : a));
        addToast('Stage Updated', `Application moved to ${nextStage.replace('_', ' ')}.`, 'info');
        return;
      }
    } catch (err) {
      console.warn('Using local fallback for stage advancement');
    }

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const newNote = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
        author: officerName || 'Loan Officer',
        note: noteText || `Stage progressed to ${nextStage.replace('_', ' ')}.`
      };
      return {
        ...app,
        currentStage: nextStage,
        assignedDepartment: departmentName || app.assignedDepartment,
        verificationNotes: [...app.verificationNotes, newNote]
      };
    }));

    addToast('Stage Updated', `Application moved to ${nextStage.replace('_', ' ')}.`, 'info');
  };

  const updateDocumentStatus = async (appId, docId, status) => {
    try {
      await applicationsApi.updateDocStatus(appId, docId, status);
    } catch (err) {
      console.warn('Local fallback for doc status update');
    }
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const updatedDocs = app.documents.map(d => d.id === docId ? { ...d, status } : d);
      return { ...app, documents: updatedDocs };
    }));
    addToast('Document Updated', `Document marked as ${status}.`, 'info');
  };

  const sanctionLoanApplication = async (appId, sanctionData) => {
    try {
      const res = await applicationsApi.sanction(appId, sanctionData);
      if (res.success && res.data) {
        setApplications(prev => prev.map(a => a.id === appId ? res.data : a));
        addToast('Loan Sanctioned!', `Application ${appId} approved & Sanction Letter generated!`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Local fallback for sanctioning');
    }

    const { sanctionedAmount, sanctionedRate, sanctionedTenureYears, processingFee, remarks, managerName } = sanctionData;
    const calculatedEmi = calculateEMI(sanctionedAmount, sanctionedRate, sanctionedTenureYears);

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const newNote = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
        author: managerName || 'Branch Manager',
        note: `Loan Sanctioned: ₹${Number(sanctionedAmount).toLocaleString('en-IN')} @ ${sanctionedRate}% for ${sanctionedTenureYears} Years.`
      };
      return {
        ...app,
        currentStage: 'SANCTIONED',
        assignedDepartment: 'Branch Sanctioning Desk',
        verificationNotes: [...app.verificationNotes, newNote],
        sanctionDetails: {
          sanctionedAmount: Number(sanctionedAmount),
          sanctionedRate: Number(sanctionedRate),
          sanctionedTenureYears: Number(sanctionedTenureYears),
          sanctionDate: new Date().toISOString().split('T')[0],
          sanctionRefNo: `SANCTION/${new Date().getFullYear()}/BL-${Math.floor(1000 + Math.random() * 9000)}`,
          sanctionedBy: 'Apex Trust Bank - Central Lending Division',
          processingFee: Number(processingFee || 0),
          calculatedEmi,
          disbursementStatus: 'PENDING_DISBURSAL'
        }
      };
    }));

    addToast('Loan Sanctioned!', `Application ${appId} approved & Sanction Letter generated!`, 'success');
  };

  const rejectLoanApplication = async (appId, reason, officerName) => {
    try {
      const res = await applicationsApi.reject(appId, { reason, officerName });
      if (res.success && res.data) {
        setApplications(prev => prev.map(a => a.id === appId ? res.data : a));
        addToast('Application Rejected', `Application ${appId} has been marked as Rejected.`, 'error');
        return;
      }
    } catch (err) {
      console.warn('Local fallback for rejection');
    }

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const newNote = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
        author: officerName || 'Credit Committee',
        note: `Loan Application Rejected. Reason: ${reason}`
      };
      return {
        ...app,
        currentStage: 'REJECTED',
        rejectionReason: reason,
        verificationNotes: [...app.verificationNotes, newNote]
      };
    }));

    addToast('Application Rejected', `Application ${appId} has been marked as Rejected.`, 'error');
  };

  const disburseLoan = async (appId) => {
    try {
      const res = await applicationsApi.disburse(appId);
      if (res.success && res.data) {
        setApplications(prev => prev.map(a => a.id === appId ? res.data.application : a));
        setActiveLoans(prev => [res.data.activeLoan, ...prev]);
        setTransactions(prev => [res.data.transaction, ...prev]);
        addToast('Funds Disbursed!', `₹${Number(res.data.activeLoan.principalSanctioned).toLocaleString('en-IN')} credited to customer account (${res.data.activeLoan.id}).`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Local fallback for disbursal');
    }

    const app = applications.find(a => a.id === appId);
    if (!app || !app.sanctionDetails) return;

    const sanction = app.sanctionDetails;
    const applicant = currentCustomer;
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

    setApplications(prev => prev.map(a => a.id === appId ? {
      ...a,
      currentStage: 'DISBURSED',
      sanctionDetails: { ...a.sanctionDetails, disbursementStatus: 'DISBURSED', disbursedLoanId: newLoanId, disbursalDate }
    } : a));

    setActiveLoans(prev => [newActiveLoan, ...prev]);

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
    setTransactions(prev => [disbursalTxn, ...prev]);

    addToast('Funds Disbursed!', `₹${Number(sanction.sanctionedAmount).toLocaleString('en-IN')} credited to ${app.customerName}'s account (${newLoanId}).`, 'success');
  };

  const payLoanEMI = async (loanId, paymentMethod = 'UPI / NetBanking') => {
    try {
      const res = await loansApi.payEmi(loanId, { paymentMethod });
      if (res.success && res.data) {
        setActiveLoans(prev => prev.map(l => l.id === loanId ? res.data.loan : l));
        setTransactions(prev => [res.data.transaction, ...prev]);
        addToast('EMI Payment Successful!', `₹${Number(res.data.transaction.amount).toLocaleString('en-IN')} paid for Loan ${loanId}.`, 'success');
        return res.data.transaction;
      }
    } catch (err) {
      console.warn('Local fallback for EMI payment');
    }

    let paidAmount = 0;
    let customerName = '';

    setActiveLoans(prev => prev.map(loan => {
      if (loan.id !== loanId) return loan;
      const currentSchedule = [...loan.schedule];
      const nextDueIndex = currentSchedule.findIndex(item => item.status === 'DUE' || item.status === 'UPCOMING');
      if (nextDueIndex === -1) return loan;

      const dueItem = currentSchedule[nextDueIndex];
      paidAmount = dueItem.emiAmount;
      customerName = loan.customerName;
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

      return {
        ...loan,
        paidEmisCount: newPaidCount,
        remainingPrincipal: newRemainingPrincipal,
        totalRepaidAmount: newTotalRepaid,
        status: isCompleted ? 'CLOSED' : 'ACTIVE',
        overdueMonths: 0,
        overdueAmount: 0,
        lateFee: 0,
        schedule: currentSchedule
      };
    }));

    const newTxn = {
      id: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      loanId: loanId,
      customerName: customerName || currentCustomer.name,
      amount: paidAmount,
      date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'EMI Payment',
      method: paymentMethod,
      status: 'SUCCESS',
      reference: `UPI/PAY/${Math.floor(1000000000 + Math.random() * 9000000000)}`
    };

    setTransactions(prev => [newTxn, ...prev]);
    addToast('EMI Payment Successful!', `₹${Number(paidAmount).toLocaleString('en-IN')} paid for Loan ${loanId}. Receipt generated.`, 'success');
    return newTxn;
  };

  const updateScheme = async (schemeId, updatedFields) => {
    try {
      await schemesApi.update(schemeId, updatedFields);
    } catch (err) {
      console.warn('Local fallback for scheme update');
    }
    setSchemes(prev => prev.map(s => s.id === schemeId ? { ...s, ...updatedFields } : s));
    addToast('Scheme Updated', 'Loan product interest rate & terms updated.', 'success');
  };

  const addScheme = async (newScheme) => {
    try {
      const res = await schemesApi.create(newScheme);
      if (res.success && res.data) {
        setSchemes(prev => [...prev, res.data]);
        addToast('New Scheme Added', `${newScheme.name} added to bank catalog.`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Local fallback for scheme add');
    }
    const id = `scheme-${newScheme.category.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
    setSchemes(prev => [...prev, { ...newScheme, id }]);
    addToast('New Scheme Added', `${newScheme.name} added to bank catalog.`, 'success');
  };

  const resetDemoData = async () => {
    try {
      await analyticsApi.resetDatabase();
    } catch (err) {
      console.warn('Local reset fallback');
    }

    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SCHEMES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_LOANS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);

    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[2]);
    setSchemes(INITIAL_LOAN_SCHEMES);
    setCustomers(INITIAL_CUSTOMERS);
    setApplications(INITIAL_APPLICATIONS);
    setActiveLoans(INITIAL_ACTIVE_LOANS);
    setTransactions(INITIAL_TRANSACTIONS);

    addToast('Database Reset', 'All backend database records and user accounts restored to defaults.', 'info');
  };

  return (
    <LoanContext.Provider
      value={{
        // Authentication & Users
        users,
        currentUser,
        userRole,
        currentCustomerId,
        currentCustomer,
        customers,
        login,
        logout,
        registerCustomer,
        switchAccountDirectly,

        // Backend Status
        backendOnline,

        // Core Entities
        schemes,
        applications,
        activeLoans,
        transactions,

        // UI State
        activeView,
        setActiveView,
        toasts,
        addToast,
        removeToast,

        // Actions
        submitLoanApplication,
        advanceApplicationStage,
        updateDocumentStatus,
        sanctionLoanApplication,
        rejectLoanApplication,
        disburseLoan,
        payLoanEMI,
        updateScheme,
        addScheme,
        resetDemoData
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoanContext = () => useContext(LoanContext);
