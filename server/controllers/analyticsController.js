import { db } from '../db.js';

export const getDashboardAnalytics = (req, res) => {
  const activeLoans = db.get('activeLoans');
  const applications = db.get('applications');
  const schemes = db.get('schemes');
  const customers = db.get('customers');

  const totalDisbursed = activeLoans.reduce((sum, l) => sum + (l.principalSanctioned || 0), 0);
  const totalRepaid = activeLoans.reduce((sum, l) => sum + (l.totalRepaidAmount || 0), 0);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);
  const pendingApps = applications.filter(a => a.currentStage !== 'DISBURSED' && a.currentStage !== 'REJECTED').length;
  const overdueCount = activeLoans.filter(l => l.status === 'OVERDUE').length;

  // Schemes breakdown
  const schemeBreakdown = schemes.map(sch => {
    const loans = activeLoans.filter(l => l.schemeId === sch.id || l.loanType.toLowerCase().includes(sch.category.toLowerCase()));
    const disbursed = loans.reduce((sum, l) => sum + l.principalSanctioned, 0);
    const balance = loans.reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);
    return {
      schemeId: sch.id,
      name: sch.name,
      category: sch.category,
      baseRate: sch.baseInterestRate,
      activeLoansCount: loans.length,
      disbursedAmount: disbursed,
      remainingBalance: balance
    };
  });

  return res.json({
    success: true,
    data: {
      metrics: {
        totalDisbursed,
        totalRepaid,
        totalOutstanding,
        pendingApplications: pendingApps,
        overdueLoansCount: overdueCount,
        activeBorrowersCount: customers.length,
        grossNpaRatio: '0.00%'
      },
      schemeBreakdown
    }
  });
};

export const resetSystemDatabase = (req, res) => {
  db.reset();
  return res.json({ success: true, message: 'Database reset to initial demo state.' });
};
