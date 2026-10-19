import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { 
  Home, 
  UserCheck, 
  Car, 
  GraduationCap, 
  Building2, 
  Coins, 
  Check, 
  ArrowRight, 
  Percent, 
  Clock, 
  ShieldAlert,
  Sparkles,
  Calculator
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { EmiCalculator } from '../calculator/EmiCalculator';

export const LoanProductCatalog = ({ onSelectSchemeForApply }) => {
  const { schemes } = useLoanContext();
  const [selectedSchemeForCalc, setSelectedSchemeForCalc] = useState(null);

  const getSchemeIcon = (iconName) => {
    switch (iconName) {
      case 'Home': return <Home size={22} />;
      case 'UserCheck': return <UserCheck size={22} />;
      case 'Car': return <Car size={22} />;
      case 'GraduationCap': return <GraduationCap size={22} />;
      case 'Building2': return <Building2 size={22} />;
      case 'Coins': return <Coins size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Catalog Title Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.08))',
        border: '1px solid rgba(37, 99, 235, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Instant Pre-Approved Offers Available
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px', letterSpacing: '-0.02em' }}>
            Explore Retail & Commercial Loan Schemes
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '6px' }}>
            Competitive interest rates from 7.80% p.a., 100% paperless digital verification, zero hidden charges, and transparent instant sanctioning.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            background: 'var(--navy-900)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-glass-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lowest Rate</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-400)' }}>7.80%*</div>
          </div>
          <div style={{
            background: 'var(--navy-900)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-glass-border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Tenure</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cyan-400)' }}>30 Years</div>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {schemes.map(scheme => (
          <div
            key={scheme.id}
            className="glass-card glow-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: `rgba(37, 99, 235, 0.15)`,
                    color: scheme.color || 'var(--blue-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${scheme.color || 'var(--blue-400)'}33`
                  }}>
                    {getSchemeIcon(scheme.icon)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {scheme.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Category: {scheme.category}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                {scheme.tagline}
              </p>

              {/* Rate & Tenure Key Metrics */}
              <div style={{
                background: 'var(--navy-900)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
                border: '1px solid var(--surface-glass-border)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interest Rate</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                    {scheme.baseInterestRate}% <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>p.a.</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Tenure</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {scheme.maxTenureYears} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Years</span>
                  </div>
                </div>
              </div>

              {/* Amount Range & Fee */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Loan Amount Range:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    ₹{(scheme.minAmount / 100000).toFixed(1)}L - ₹{(scheme.maxAmount / 100000).toFixed(1)}L
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Processing Fee:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{scheme.processingFeePct}% (+GST)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Min CIBIL Required:</span>
                  <strong style={{ color: 'var(--cyan-400)' }}>{scheme.minCibilScore}+</strong>
                </div>
              </div>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scheme.features?.slice(0, 3).map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Check size={14} style={{ color: 'var(--emerald-400)', flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--surface-glass-border)' }}>
              <button
                onClick={() => setSelectedSchemeForCalc(scheme)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, gap: '6px' }}
              >
                <Calculator size={15} />
                <span>Estimate EMI</span>
              </button>
              <button
                onClick={() => onSelectSchemeForApply && onSelectSchemeForApply(scheme)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, gap: '6px' }}
              >
                <span>Apply Now</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Calculator Modal for Selected Scheme */}
      {selectedSchemeForCalc && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSchemeForCalc(null)}
          title={`EMI Estimator - ${selectedSchemeForCalc.name}`}
          subtitle={`Base Rate: ${selectedSchemeForCalc.baseInterestRate}% p.a. | Max Tenure: ${selectedSchemeForCalc.maxTenureYears} Years`}
          maxWidth="840px"
        >
          <EmiCalculator
            initialAmount={Math.min(2500000, selectedSchemeForCalc.maxAmount)}
            initialRate={selectedSchemeForCalc.baseInterestRate}
            initialTenure={Math.min(10, selectedSchemeForCalc.maxTenureYears)}
          />
        </Modal>
      )}
    </div>
  );
};
