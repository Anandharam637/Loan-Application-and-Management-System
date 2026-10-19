import React from 'react';
import { LoanProvider, useLoanContext } from './context/LoanContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { LoginPage } from './components/auth/LoginPage';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ShieldCheck, Landmark } from 'lucide-react';

const MainLayout = () => {
  const { currentUser, userRole } = useLoanContext();

  // If not logged in, display the Login & Registration Page
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {userRole === 'customer' ? (
          <CustomerPortal />
        ) : (
          <AdminPortal />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--navy-950)',
        borderTop: '1px solid var(--surface-glass-border)',
        padding: '28px 24px',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, var(--blue-600), #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Landmark size={16} />
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Apex Trust Bank</strong> — Automated Loan Application & Management System
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                School of Computing - Department of Computer Science & Engineering (CSE)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--emerald-400)' }}>
              <ShieldCheck size={15} /> 100% Paperless Digital Lending
            </span>
            <span>Project: Anandharam M & Akshaya R</span>
            <span>Guide: Dr. D. Deepa</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LoanProvider>
      <MainLayout />
    </LoanProvider>
  );
}
