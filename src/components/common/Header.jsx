import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { 
  Landmark, 
  UserCheck, 
  ShieldCheck, 
  Briefcase, 
  Calculator, 
  RotateCcw, 
  ChevronDown,
  Building2,
  Users,
  LogOut,
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { EmiCalculator } from '../calculator/EmiCalculator';
import { Modal } from './Modal';

export const Header = () => {
  const { 
    currentUser, 
    userRole, 
    users, 
    logout, 
    switchAccountDirectly, 
    resetDemoData, 
    applications 
  } = useLoanContext();

  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const pendingCount = applications.filter(a => a.currentStage !== 'DISBURSED' && a.currentStage !== 'REJECTED').length;

  return (
    <>
      <header className="app-header" style={{
        background: 'rgba(11, 21, 45, 0.88)',
        borderBottom: '1px solid var(--surface-glass-border)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 28px'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Brand Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--blue-600), #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 16px rgba(37, 99, 235, 0.45)'
            }}>
              <Landmark size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  APEX TRUST BANK
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(37, 99, 235, 0.25)',
                  color: 'var(--cyan-400)',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}>
                  LMS v2.0
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '-2px' }}>
                Loan Application, Verification & Repayment System
              </p>
            </div>
          </div>

          {/* Center: Current Role Badge Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--navy-950)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--surface-glass-border)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: userRole === 'admin' ? 'var(--emerald-400)' : userRole === 'officer' ? 'var(--purple-400)' : 'var(--blue-400)',
              boxShadow: `0 0 8px ${userRole === 'admin' ? '#10b981' : userRole === 'officer' ? '#a855f7' : '#3b82f6'}`
            }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {userRole === 'admin' && 'Bank Admin & Branch Manager Portal'}
              {userRole === 'officer' && `Verification & Underwriting Desk (${pendingCount} Pending)`}
              {userRole === 'customer' && 'Customer Self-Service Portal'}
            </span>
          </div>

          {/* Right Tools & User Profile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick EMI Calculator */}
            <button
              onClick={() => setIsCalcOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
              title="Open EMI Calculator"
            >
              <Calculator size={16} style={{ color: 'var(--cyan-400)' }} />
              <span>EMI Calc</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px' }}
              title="Reset Demo Data"
            >
              <RotateCcw size={15} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* User Profile & Switcher Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="btn btn-secondary btn-sm"
                style={{
                  background: 'var(--navy-850)',
                  padding: '5px 12px',
                  gap: '10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--surface-glass-border)'
                }}
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: userRole === 'admin' ? 'var(--emerald-400)' : userRole === 'officer' ? 'var(--purple-400)' : 'var(--cyan-400)', fontWeight: 700 }}>
                    {currentUser?.role?.toUpperCase()}
                  </div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              {showUserDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '300px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--surface-glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200
                }}>
                  <div style={{ borderBottom: '1px solid var(--surface-glass-border)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {currentUser?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentUser?.email}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {currentUser?.designation}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 6px', letterSpacing: '0.05em' }}>
                    Quick Switch Role / Account
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '240px', overflowY: 'auto' }}>
                    {users.map(u => {
                      const isActive = u.id === currentUser?.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            switchAccountDirectly(u.id);
                            setShowUserDropdown(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {u.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              {u.role.toUpperCase()} • {u.username}
                            </div>
                          </div>
                          {isActive && <CheckCircle2 size={14} style={{ color: 'var(--emerald-400)' }} />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Log Out Button */}
                  <div style={{ borderTop: '1px solid var(--surface-glass-border)', paddingTop: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="btn btn-danger btn-sm"
                      style={{ width: '100%', gap: '8px' }}
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global EMI Calculator Modal */}
      <Modal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        title="Interactive Loan EMI & Prepayment Calculator"
        subtitle="Estimate monthly installments, amortization schedule, and interest savings"
        maxWidth="840px"
      >
        <EmiCalculator />
      </Modal>

      {/* Reset Demo Data Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset Demo Data"
        subtitle="Restore all user credentials, loans, applications, and customer profiles to default initial state?"
        maxWidth="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            This will reset all your test loan submissions, document approvals, user accounts, and simulated EMI payments back to the original demo scenario.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetDemoData();
                setShowResetConfirm(false);
              }}
              className="btn btn-danger"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
