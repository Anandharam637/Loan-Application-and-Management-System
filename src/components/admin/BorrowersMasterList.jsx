import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { Search, UserCheck, ShieldCheck, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

export const BorrowersMasterList = () => {
  const { customers, activeLoans } = useLoanContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.pan.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Borrowers & Customers Master Directory
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Centralized database of customer KYC records, CIBIL scores, and active banking facilities.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by name, PAN, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Grid of Customer Profiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {filteredCustomers.map(cust => {
          const custLoans = activeLoans.filter(l => l.customerId === cust.id);
          const totalCustDebt = custLoans.reduce((sum, l) => sum + (l.remainingPrincipal || 0), 0);

          return (
            <div key={cust.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={cust.avatar}
                  alt={cust.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--blue-500)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {cust.name}
                    </h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--emerald-400)', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                      KYC Verified
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ID: {cust.id} • PAN: {cust.pan}
                  </div>
                </div>
              </div>

              {/* Employment & City */}
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Profession:</strong> {cust.employmentType}</div>
                <div><strong>Employer:</strong> {cust.employer}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> {cust.city}
                </div>
              </div>

              {/* Financial Strip */}
              <div style={{
                background: 'var(--navy-900)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                border: '1px solid var(--surface-glass-border)'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CIBIL Score</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: cust.cibilScore >= 750 ? 'var(--emerald-400)' : 'var(--cyan-400)' }}>
                    {cust.cibilScore} ({cust.cibilRating})
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly In-Hand</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{(cust.monthlyIncome / 100000).toFixed(2)}L
                  </div>
                </div>
              </div>

              {/* Active Debt Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', paddingTop: '8px', borderTop: '1px solid var(--surface-glass-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Facilities ({custLoans.length})</span>
                <strong style={{ color: totalCustDebt > 0 ? 'var(--blue-400)' : 'var(--text-secondary)' }}>
                  ₹{Number(totalCustDebt).toLocaleString('en-IN')} Outstanding
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
