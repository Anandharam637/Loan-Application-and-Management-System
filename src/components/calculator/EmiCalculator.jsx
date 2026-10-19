import React, { useState } from 'react';
import { calculateEMI, generateAmortizationSchedule } from '../../data/initialData';
import { DonutChart } from '../charts/DonutChart';
import { Calculator, Sparkles, TrendingDown, Clock, IndianRupee, ShieldCheck } from 'lucide-react';

export const EmiCalculator = ({ initialAmount = 2500000, initialRate = 8.5, initialTenure = 15 }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [rate, setRate] = useState(initialRate);
  const [tenureYears, setTenureYears] = useState(initialTenure);
  const [extraPrepayment, setExtraPrepayment] = useState(0); // extra per month

  const emi = calculateEMI(amount, rate, tenureYears);
  const totalMonths = tenureYears * 12;
  const totalRepayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - amount);

  // Prepayment impact calculation
  const effectiveMonthlyPay = emi + extraPrepayment;
  let savedInterest = 0;
  let savedMonths = 0;

  if (extraPrepayment > 0) {
    const monthlyRate = (rate / 12) / 100;
    let balance = amount;
    let m = 0;
    let totalPaidWithPrepay = 0;

    while (balance > 0 && m < totalMonths) {
      m++;
      const interest = balance * monthlyRate;
      const principalPaid = Math.min(balance, effectiveMonthlyPay - interest);
      balance -= principalPaid;
      totalPaidWithPrepay += (interest + principalPaid);
      if (balance <= 0) break;
    }

    savedMonths = Math.max(0, totalMonths - m);
    savedInterest = Math.max(0, totalRepayment - totalPaidWithPrepay);
  }

  const chartData = [
    { label: 'Principal Loan Amount', value: amount, color: 'var(--blue-500)' },
    { label: 'Total Interest Amount', value: totalInterest, color: 'var(--cyan-400)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px'
      }}>
        {/* Left: Input Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Loan Amount */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Loan Amount (₹)
              </label>
              <div style={{
                background: 'var(--navy-900)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-glass-border)',
                fontWeight: 700,
                color: 'var(--blue-400)',
                fontSize: '1rem'
              }}>
                ₹ {Number(amount).toLocaleString('en-IN')}
              </div>
            </div>
            <input
              type="range"
              min="50000"
              max="20000000"
              step="50000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>₹50,000</span>
              <span>₹1 Crore</span>
              <span>₹2 Crores</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Annual Interest Rate (% p.a.)
              </label>
              <div style={{
                background: 'var(--navy-900)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-glass-border)',
                fontWeight: 700,
                color: 'var(--cyan-400)',
                fontSize: '1rem'
              }}>
                {rate}%
              </div>
            </div>
            <input
              type="range"
              min="6.5"
              max="18.0"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>6.5% (Home/Gold)</span>
              <span>12.0% (Business)</span>
              <span>18.0% (Personal)</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Loan Tenure (Years / Months)
              </label>
              <div style={{
                background: 'var(--navy-900)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-glass-border)',
                fontWeight: 700,
                color: 'var(--emerald-400)',
                fontSize: '1rem'
              }}>
                {tenureYears} Years ({tenureYears * 12} Mos)
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Extra Monthly Prepayment Simulator */}
          <div style={{
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px dashed rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-300)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} /> Optional Extra Monthly Prepayment
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                +₹{Number(extraPrepayment).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25000"
              step="1000"
              value={extraPrepayment}
              onChange={(e) => setExtraPrepayment(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Right: Results & Chart */}
        <div style={{
          background: 'var(--navy-900)',
          border: '1px solid var(--surface-glass-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Main EMI Highlight */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(37, 99, 235, 0.12)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(37, 99, 235, 0.25)'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monthly EMI Amount
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '4px' }}>
              ₹ {Number(emi).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Principal + Interest per month
            </div>
          </div>

          {/* Donut Chart */}
          <DonutChart
            data={chartData}
            size={160}
            strokeWidth={20}
            centerLabel={`₹${(totalRepayment / 100000).toFixed(1)}L`}
            centerSub="Total Cost"
          />

          {/* Breakdown summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--surface-glass-border)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Interest</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cyan-400)' }}>
                ₹ {Number(totalInterest).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Repayment</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹ {Number(totalRepayment).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Prepayment Impact Banner */}
          {extraPrepayment > 0 && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <TrendingDown size={22} style={{ color: 'var(--emerald-400)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--emerald-100)', lineHeight: 1.3 }}>
                By paying <strong>+₹{extraPrepayment.toLocaleString('en-IN')}/mo</strong>, you save <strong>₹{Math.round(savedInterest).toLocaleString('en-IN')}</strong> in interest and finish your loan <strong>{Math.floor(savedMonths / 12)} years {savedMonths % 12} months earlier!</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
