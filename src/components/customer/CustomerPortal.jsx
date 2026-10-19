import React, { useState } from 'react';
import { CustomerDashboard } from './CustomerDashboard';
import { LoanProductCatalog } from './LoanProductCatalog';
import { LoanApplicationWizard } from './LoanApplicationWizard';
import { ApplicationTracker } from './ApplicationTracker';
import { MyLoansView } from './MyLoansView';
import { EmiCalculator } from '../calculator/EmiCalculator';
import { 
  LayoutDashboard, 
  Grid, 
  Send, 
  Clock, 
  CreditCard, 
  Calculator 
} from 'lucide-react';

export const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);

  const handleApplyScheme = (scheme) => {
    setSelectedSchemeForApply(scheme);
    setActiveTab('apply');
  };

  const handleApplicationSuccess = (app) => {
    setActiveTab('tracker');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Customer Navigation Bar */}
      <div className="tab-nav-container">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
        >
          <Grid size={18} />
          <span>Loan Products</span>
        </button>

        <button
          onClick={() => setActiveTab('apply')}
          className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
        >
          <Send size={18} />
          <span>Apply Online</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
        >
          <Clock size={18} />
          <span>Track Application</span>
        </button>

        <button
          onClick={() => setActiveTab('my-loans')}
          className={`tab-btn ${activeTab === 'my-loans' ? 'active' : ''}`}
        >
          <CreditCard size={18} />
          <span>My Loans & EMIs</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
        >
          <Calculator size={18} />
          <span>EMI Calculator</span>
        </button>
      </div>

      {/* Main View Display */}
      {activeTab === 'dashboard' && (
        <CustomerDashboard onNavigate={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'catalog' && (
        <LoanProductCatalog onSelectSchemeForApply={handleApplyScheme} />
      )}

      {activeTab === 'apply' && (
        <LoanApplicationWizard
          preselectedScheme={selectedSchemeForApply}
          onApplicationSuccess={handleApplicationSuccess}
        />
      )}

      {activeTab === 'tracker' && (
        <ApplicationTracker onNavigateToLoans={() => setActiveTab('my-loans')} />
      )}

      {activeTab === 'my-loans' && (
        <MyLoansView onNavigateToApply={() => setActiveTab('apply')} />
      )}

      {activeTab === 'calculator' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Interactive EMI & Prepayment Calculator
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Plan your borrowing with customized loan amounts, interest rates, and see how extra monthly payments can shave years off your debt.
          </p>
          <EmiCalculator />
        </div>
      )}
    </div>
  );
};
