import React from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { 
  FileText, 
  Download, 
  Printer, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  PieChart, 
  Landmark 
} from 'lucide-react';

export const ReportsAnalytics = () => {
  const { activeLoans, applications, transactions, schemes } = useLoanContext();

  const totalDisbursed = activeLoans.reduce((sum, l) => sum + (l.principalSanctioned || 0), 0);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);
  const totalRepaid = activeLoans.reduce((sum, l) => sum + (l.totalRepaidAmount || 0), 0);

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Loan ID', 'Borrower Name', 'Loan Type', 'Sanctioned Principal', 'Interest Rate %', 'Tenure Years', 'Remaining Balance', 'Status'];
    const rows = activeLoans.map(l => [
      l.id,
      `"${l.customerName}"`,
      `"${l.loanType}"`,
      l.principalSanctioned,
      l.interestRate,
      l.tenureYears,
      l.remainingPrincipal || 0,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_bank_loan_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Financial Audit Reports & Portfolio Analytics
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Consolidated credit disbursement, recovery rate, and transactional audit ledger.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }} className="no-print">
          <button onClick={exportToCSV} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <Printer size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Portfolio Breakdown Summary Card */}
      <div className="glass-card printable-document" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-glass-border)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Apex Trust Bank - Lending Portfolio Summary
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Generated on: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
            RBI Audited & Reconciled
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--navy-900)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-glass-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Disbursed</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--blue-400)', marginTop: '4px' }}>
              ₹{(totalDisbursed / 100000).toFixed(2)} Lakhs
            </div>
          </div>

          <div style={{ background: 'var(--navy-900)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-glass-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Capital Repaid</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '4px' }}>
              ₹{(totalRepaid / 100000).toFixed(2)} Lakhs
            </div>
          </div>

          <div style={{ background: 'var(--navy-900)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-glass-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Outstanding</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: '4px' }}>
              ₹{(totalOutstanding / 100000).toFixed(2)} Lakhs
            </div>
          </div>

          <div style={{ background: 'var(--navy-900)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-glass-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applications Converted</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {activeLoans.length} / {applications.length}
            </div>
          </div>
        </div>

        {/* Schemes Breakdown Table */}
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Portfolio Distribution by Scheme Category
        </h4>
        <div className="table-responsive" style={{ marginBottom: '24px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Base Rate</th>
                <th>Active Accounts</th>
                <th>Disbursed Principal</th>
                <th>Current Balance</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map(sch => {
                const schemeLoans = activeLoans.filter(l => l.schemeId === sch.id || l.loanType.toLowerCase().includes(sch.category.toLowerCase()));
                const schemeDisbursed = schemeLoans.reduce((sum, l) => sum + l.principalSanctioned, 0);
                const schemeBal = schemeLoans.reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);

                return (
                  <tr key={sch.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sch.name}</td>
                    <td style={{ color: 'var(--emerald-400)', fontWeight: 700 }}>{sch.baseInterestRate}%</td>
                    <td>{schemeLoans.length}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(schemeDisbursed).toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--cyan-400)', fontWeight: 700 }}>₹{Number(schemeBal).toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge badge-success">Standard</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Transactions Audit Trail */}
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Recent Financial Transactions Audit
        </h4>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Txn Ref</th>
                <th>Facility ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Method</th>
                <th>Timestamp</th>
                <th>Amount (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--cyan-400)' }}>{t.id}</td>
                  <td style={{ fontSize: '0.82rem' }}>{t.loanId}</td>
                  <td style={{ fontWeight: 600 }}>{t.customerName}</td>
                  <td>{t.type}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.method}</td>
                  <td style={{ fontSize: '0.82rem' }}>{t.date}</td>
                  <td style={{ fontWeight: 800, color: 'var(--emerald-400)' }}>₹{Number(t.amount).toLocaleString('en-IN')}</td>
                  <td>
                    <span className="badge badge-success">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
