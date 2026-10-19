import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { 
  Landmark, 
  ShieldCheck, 
  Users, 
  Building2, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2,
  Briefcase,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const LoginPage = () => {
  const { users, login, registerCustomer } = useLoanContext();

  const [activeRoleTab, setActiveRoleTab] = useState('customer'); // 'customer' | 'officer' | 'admin' | 'register'
  const [emailOrUser, setEmailOrUser] = useState('rajesh@apexbank.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    pan: '',
    monthlyIncome: 120000,
    employmentType: 'Salaried - IT / Software',
    employer: '',
    city: 'Bengaluru, Karnataka',
    cibilScore: 760
  });

  const handleRoleTabChange = (role) => {
    setActiveRoleTab(role);
    setErrorMessage('');
    if (role === 'customer') {
      setEmailOrUser('rajesh@apexbank.com');
      setPassword('password123');
    } else if (role === 'officer') {
      setEmailOrUser('officer@apexbank.com');
      setPassword('officer@123');
    } else if (role === 'admin') {
      setEmailOrUser('admin@apexbank.com');
      setPassword('admin@123');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const result = login(emailOrUser, password);
    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    registerCustomer(registerData);
  };

  const handleQuickLogin = (user) => {
    setEmailOrUser(user.username);
    setPassword(user.password);
    login(user.username, user.password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(circle at 15% 15%, rgba(37, 99, 235, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(6, 182, 212, 0.12) 0%, transparent 45%), #070d1e',
      color: 'var(--text-primary)',
      padding: '24px 16px'
    }}>
      {/* Top Bank Branding Header */}
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto 32px auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--blue-600), #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)'
          }}>
            <Landmark size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                APEX TRUST BANK
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(37, 99, 235, 0.3)', color: 'var(--cyan-400)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                SECURE AUTH
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Loan Management & Automated Verification Portal
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.12)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <ShieldCheck size={16} /> 256-Bit TLS Bank Grade Security
        </div>
      </div>

      {/* Main Grid: Left Login Box / Right Credentials Cheat Sheet */}
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left: Login Card */}
        <div className="glass-card glow-card" style={{ padding: '36px' }}>
          {/* Role Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'var(--navy-950)', padding: '6px', borderRadius: 'var(--radius-lg)', marginBottom: '28px', border: '1px solid var(--surface-glass-border)' }}>
            <button
              onClick={() => handleRoleTabChange('customer')}
              className="btn btn-sm"
              style={{
                background: activeRoleTab === 'customer' ? 'var(--blue-600)' : 'transparent',
                color: activeRoleTab === 'customer' ? '#ffffff' : 'var(--text-secondary)',
                padding: '8px 6px',
                fontSize: '0.78rem',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <Users size={16} />
              <span>Customer</span>
            </button>

            <button
              onClick={() => handleRoleTabChange('officer')}
              className="btn btn-sm"
              style={{
                background: activeRoleTab === 'officer' ? 'var(--purple-500)' : 'transparent',
                color: activeRoleTab === 'officer' ? '#ffffff' : 'var(--text-secondary)',
                padding: '8px 6px',
                fontSize: '0.78rem',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <ShieldCheck size={16} />
              <span>Officer</span>
            </button>

            <button
              onClick={() => handleRoleTabChange('admin')}
              className="btn btn-sm"
              style={{
                background: activeRoleTab === 'admin' ? 'var(--emerald-600)' : 'transparent',
                color: activeRoleTab === 'admin' ? '#ffffff' : 'var(--text-secondary)',
                padding: '8px 6px',
                fontSize: '0.78rem',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <Building2 size={16} />
              <span>Manager</span>
            </button>

            <button
              onClick={() => handleRoleTabChange('register')}
              className="btn btn-sm"
              style={{
                background: activeRoleTab === 'register' ? 'var(--cyan-500)' : 'transparent',
                color: activeRoleTab === 'register' ? '#ffffff' : 'var(--text-secondary)',
                padding: '8px 6px',
                fontSize: '0.78rem',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <UserPlus size={16} />
              <span>Register</span>
            </button>
          </div>

          {/* Form Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {activeRoleTab === 'customer' && 'Customer Portal Sign In'}
              {activeRoleTab === 'officer' && 'Loan Verification Desk Sign In'}
              {activeRoleTab === 'admin' && 'Branch Manager & Admin Sign In'}
              {activeRoleTab === 'register' && 'New Borrower Registration'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {activeRoleTab === 'customer' && 'Access your loan applications, EMI schedules, and online payments.'}
              {activeRoleTab === 'officer' && 'Review incoming applications, inspect KYC records and CIBIL risk scores.'}
              {activeRoleTab === 'admin' && 'Full branch lending authority: Sanctions, disbursals, and interest rate management.'}
              {activeRoleTab === 'register' && 'Create your customer profile to apply for instant retail loans.'}
            </p>
          </div>

          {errorMessage && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--rose-400)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Standard Login Form */}
          {activeRoleTab !== 'register' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>Email Address / User ID</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>e.g. {emailOrUser}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    placeholder="Enter email or user ID"
                    required
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span>Password</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Demo: {password}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    required
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-lg ${activeRoleTab === 'admin' ? 'btn-success' : activeRoleTab === 'officer' ? 'btn-primary' : 'btn-primary'}`}
                style={{
                  marginTop: '8px',
                  background: activeRoleTab === 'officer' ? 'linear-gradient(135deg, var(--purple-500), #7c3aed)' : undefined,
                  gap: '8px'
                }}
              >
                <span>Sign In to LMS</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name <span className="req">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Siddharth Rao"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address <span className="req">*</span></label>
                  <input
                    type="email"
                    className="form-input"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="siddharth@example.com"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Create Password <span className="req">*</span></label>
                  <input
                    type="password"
                    className="form-input"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="+91 98450 11223"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">PAN Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={registerData.pan}
                    onChange={(e) => setRegisterData({ ...registerData, pan: e.target.value })}
                    placeholder="ABCDE9999F"
                    maxLength={10}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Monthly Income (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={registerData.monthlyIncome}
                    onChange={(e) => setRegisterData({ ...registerData, monthlyIncome: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px', gap: '8px' }}>
                <Sparkles size={18} />
                <span>Create Customer Account</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: 1-Click Demo Profiles & Credentials Cheat Sheet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick 1-Click Cards */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <KeyRound size={20} style={{ color: 'var(--cyan-400)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                1-Click Quick Demo Sign In
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Click any profile below to instantly log in and test specific banking features and workflows:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map(u => {
                const isCust = u.role === 'customer';
                const isOff = u.role === 'officer';
                const isAdm = u.role === 'admin';

                return (
                  <div
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'var(--navy-900)',
                      border: '1px solid var(--surface-glass-border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = isAdm ? 'var(--emerald-500)' : isOff ? 'var(--purple-400)' : 'var(--blue-500)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--surface-glass-border)';
                      e.currentTarget.style.background = 'var(--navy-900)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {u.name}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            background: isAdm ? 'rgba(16, 185, 129, 0.2)' : isOff ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                            color: isAdm ? 'var(--emerald-400)' : isOff ? 'var(--purple-400)' : 'var(--blue-400)'
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: <strong className="mono" style={{ color: 'var(--text-secondary)' }}>{u.username}</strong> • Pass: <strong className="mono" style={{ color: 'var(--cyan-400)' }}>{u.password}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Sign In
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credentials Reference Table */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Credentials Reference Directory
            </h4>
            <div className="table-responsive">
              <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>User ID / Email</th>
                    <th>Password</th>
                    <th>Context</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-sanctioned">Admin</span></td>
                    <td className="mono" style={{ color: 'var(--cyan-400)' }}>admin@apexbank.com</td>
                    <td className="mono" style={{ color: 'var(--emerald-400)' }}>admin@123</td>
                    <td>Branch Manager (Full Sanctions)</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-kyc">Officer</span></td>
                    <td className="mono" style={{ color: 'var(--cyan-400)' }}>officer@apexbank.com</td>
                    <td className="mono" style={{ color: 'var(--emerald-400)' }}>officer@123</td>
                    <td>KYC & Credit Underwriter</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-submitted">Customer</span></td>
                    <td className="mono" style={{ color: 'var(--cyan-400)' }}>rajesh@apexbank.com</td>
                    <td className="mono" style={{ color: 'var(--emerald-400)' }}>password123</td>
                    <td>Active Personal Loan</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-submitted">Customer</span></td>
                    <td className="mono" style={{ color: 'var(--cyan-400)' }}>priya@apexbank.com</td>
                    <td className="mono" style={{ color: 'var(--emerald-400)' }}>password123</td>
                    <td>Active Education Loan</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-overdue">Customer</span></td>
                    <td className="mono" style={{ color: 'var(--cyan-400)' }}>vikram@apexbank.com</td>
                    <td className="mono" style={{ color: 'var(--emerald-400)' }}>password123</td>
                    <td>Overdue Auto Loan Demo</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-submitted">Customer</span></td>
                    <td className="mono" style={{ color: 'var(--cyan-400)' }}>anita@apexbank.com</td>
                    <td className="mono" style={{ color: 'var(--emerald-400)' }}>password123</td>
                    <td>Doctor (810 CIBIL Score)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
