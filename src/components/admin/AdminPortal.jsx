import React, { useState } from 'react';
import { AdminDashboard } from './AdminDashboard';
import { ApplicationPipeline } from './ApplicationPipeline';
import { LoanSchemesManager } from './LoanSchemesManager';
import { BorrowersMasterList } from './BorrowersMasterList';
import { OverdueEmiMonitor } from './OverdueEmiMonitor';
import { ReportsAnalytics } from './ReportsAnalytics';
import { useLoanContext } from '../../context/LoanContext';
import { 
  LayoutDashboard, 
  GitPullRequest, 
  Percent, 
  Users, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { applications, activeLoans } = useLoanContext();

  const pendingAppsCount = applications.filter(a => a.currentStage !== 'DISBURSED' && a.currentStage !== 'REJECTED').length;
  const overdueCount = activeLoans.filter(l => l.status === 'OVERDUE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Tabs */}
      <div className="tab-nav-container">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>LMS Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
        >
          <GitPullRequest size={18} />
          <span>Verification & Pipeline</span>
          {pendingAppsCount > 0 && (
            <span style={{
              fontSize: '0.7rem',
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
        >
          <Percent size={18} />
          <span>Interest Rates & Schemes</span>
        </button>

        <button
          onClick={() => setActiveTab('borrowers')}
          className={`tab-btn ${activeTab === 'borrowers' ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Borrowers Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
        >
          <ShieldAlert size={18} />
          <span>Overdue & Collections</span>
          {overdueCount > 0 && (
            <span style={{
              fontSize: '0.7rem',
              background: 'rgba(244, 63, 94, 0.4)',
              color: '#ffffff',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              {overdueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
        >
          <FileText size={18} />
          <span>Financial Reports</span>
        </button>
      </div>

      {/* Views */}
      {activeTab === 'dashboard' && (
        <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'pipeline' && (
        <ApplicationPipeline />
      )}

      {activeTab === 'schemes' && (
        <LoanSchemesManager />
      )}

      {activeTab === 'borrowers' && (
        <BorrowersMasterList />
      )}

      {activeTab === 'overdue' && (
        <OverdueEmiMonitor />
      )}

      {activeTab === 'reports' && (
        <ReportsAnalytics />
      )}
    </div>
  );
};
