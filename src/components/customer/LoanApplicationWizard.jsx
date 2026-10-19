import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { calculateEMI } from '../../data/initialData';
import { CreditScoreGauge } from '../common/CreditScoreGauge';
import confetti from 'canvas-confetti';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  FileCheck2, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  CheckCircle2,
  Building2,
  Briefcase,
  DollarSign
} from 'lucide-react';

export const LoanApplicationWizard = ({ preselectedScheme, onApplicationSuccess }) => {
  const { currentCustomer, schemes, submitLoanApplication } = useLoanContext();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Financial
    fullName: currentCustomer?.name || '',
    email: currentCustomer?.email || '',
    phone: currentCustomer?.phone || '',
    pan: currentCustomer?.pan || '',
    aadhaar: currentCustomer?.aadhaar || '',
    employmentType: currentCustomer?.employmentType || 'Salaried - Senior Software Engineer',
    employer: currentCustomer?.employer || 'Infosys Technologies Ltd',
    monthlyIncome: currentCustomer?.monthlyIncome || 150000,
    existingEmi: currentCustomer?.existingEmi || 0,
    city: currentCustomer?.city || 'Bengaluru, Karnataka',

    // Step 2: Loan Requirements
    schemeId: preselectedScheme?.id || schemes[0]?.id || 'scheme-home',
    requestedAmount: preselectedScheme ? Math.min(2500000, preselectedScheme.maxAmount) : 2500000,
    requestedTenureYears: preselectedScheme ? Math.min(15, preselectedScheme.maxTenureYears) : 15,
    purpose: '',

    // Step 3: Documents
    documents: [
      { id: 'doc-1', name: 'Identity Proof (PAN Card)', type: 'KYC', file: 'pan_card_doc.pdf', uploaded: true, size: '1.2 MB' },
      { id: 'doc-2', name: 'Address Proof (Aadhaar / Passport)', type: 'KYC', file: 'aadhaar_front_back.pdf', uploaded: true, size: '2.4 MB' },
      { id: 'doc-3', name: 'Last 3 Months Salary Slips', type: 'Income Proof', file: 'salary_slips_q2.pdf', uploaded: true, size: '3.1 MB' },
      { id: 'doc-4', name: 'Last 6 Months Bank Statement', type: 'Financial Record', file: 'bank_statement_sbi.pdf', uploaded: true, size: '4.8 MB' }
    ]
  });

  const selectedScheme = schemes.find(s => s.id === formData.schemeId) || schemes[0];

  // Calculated estimates
  const estimatedEmi = calculateEMI(
    formData.requestedAmount,
    selectedScheme.baseInterestRate,
    formData.requestedTenureYears
  );

  const totalMonthlyObligations = Number(formData.existingEmi || 0) + estimatedEmi;
  const dtiRatio = Number(((totalMonthlyObligations / (formData.monthlyIncome || 1)) * 100).toFixed(1));

  const steps = [
    { number: 1, title: 'Applicant Details' },
    { number: 2, title: 'Loan Requirements' },
    { number: 3, title: 'Paperless Docs' },
    { number: 4, title: 'Review & Pre-Qualify' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const app = submitLoanApplication({
      ...formData,
      documents: formData.documents.map(d => ({
        id: d.id,
        name: d.name,
        type: d.type,
        status: 'PENDING',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: d.file
      }))
    });

    // Confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (onApplicationSuccess) {
      onApplicationSuccess(app);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stepper Header */}
      <div className="stepper-progress">
        <div className="stepper-line">
          <div
            className="stepper-line-fill"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          return (
            <div
              key={step.number}
              className={`step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="step-circle">
                {isCompleted ? <Check size={18} /> : step.number}
              </div>
              <span className="step-label">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Main Wizard Form Card */}
      <div className="glass-card" style={{ padding: '32px' }}>
        {/* STEP 1: Applicant Profile & Financials */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--surface-glass-border)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Personal & Employment Details
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Verify your identity credentials and monthly cash inflow for eligibility appraisal.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">PAN Number <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Aadhaar (Virtual ID) <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  placeholder="XXXX-XXXX-1234"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current City / Location <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Bengaluru, Karnataka"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', paddingTop: '8px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Employment Nature <span className="req">*</span></label>
                <select
                  className="form-select"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                >
                  <option value="Salaried - Private Sector">Salaried - Private Sector</option>
                  <option value="Salaried - Public / Govt Sector">Salaried - Public / Govt Sector</option>
                  <option value="Self-Employed - Business Owner">Self-Employed - Business Owner</option>
                  <option value="Self-Employed - Professional (Doctor/CA/Lawyer)">Self-Employed - Professional (Doctor/CA/Lawyer)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Employer / Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                  placeholder="e.g. Infosys, TCS, Hospital"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Net Monthly In-Hand Income (₹) <span className="req">*</span></label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                  min="15000"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Existing Monthly EMIs / Obligations (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.existingEmi}
                  onChange={(e) => setFormData({ ...formData, existingEmi: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Loan Requirements */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ borderBottom: '1px solid var(--surface-glass-border)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Loan Requirements & Tenure
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Select your loan category, desired principal amount, and repayment tenure.
              </p>
            </div>

            {/* Scheme Picker */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Loan Scheme <span className="req">*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {schemes.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setFormData({
                      ...formData,
                      schemeId: s.id,
                      requestedAmount: Math.min(formData.requestedAmount, s.maxAmount),
                      requestedTenureYears: Math.min(formData.requestedTenureYears, s.maxTenureYears)
                    })}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.schemeId === s.id ? '2px solid var(--blue-500)' : '1px solid var(--surface-glass-border)',
                      background: formData.schemeId === s.id ? 'rgba(37, 99, 235, 0.15)' : 'var(--navy-900)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: formData.schemeId === s.id ? '#ffffff' : 'var(--text-primary)' }}>
                        {s.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                        {s.baseInterestRate}%
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Max: ₹{(s.maxAmount / 100000).toFixed(0)}L • Up to {s.maxTenureYears} Yrs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Requested Loan Amount (₹)
                </label>
                <div style={{ background: 'var(--navy-900)', padding: '4px 14px', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--blue-400)', fontSize: '1.1rem' }}>
                  ₹ {Number(formData.requestedAmount).toLocaleString('en-IN')}
                </div>
              </div>
              <input
                type="range"
                min={selectedScheme.minAmount}
                max={selectedScheme.maxAmount}
                step="50000"
                value={formData.requestedAmount}
                onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>₹{(selectedScheme.minAmount / 100000).toFixed(1)} Lakhs</span>
                <span>₹{(selectedScheme.maxAmount / 100000).toFixed(1)} Lakhs</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Repayment Tenure (Years)
                </label>
                <div style={{ background: 'var(--navy-900)', padding: '4px 14px', borderRadius: 'var(--radius-md)', fontWeight: 800, color: 'var(--emerald-400)', fontSize: '1.1rem' }}>
                  {formData.requestedTenureYears} Years ({formData.requestedTenureYears * 12} Months)
                </div>
              </div>
              <input
                type="range"
                min={selectedScheme.minTenureYears}
                max={selectedScheme.maxTenureYears}
                step="1"
                value={formData.requestedTenureYears}
                onChange={(e) => setFormData({ ...formData, requestedTenureYears: Number(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{selectedScheme.minTenureYears} Year</span>
                <span>{selectedScheme.maxTenureYears} Years</span>
              </div>
            </div>

            {/* Purpose */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Loan Purpose / Remarks <span className="req">*</span></label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="e.g. Purchase of flat / Equipment upgrade / Higher education tuition fees"
                required
              />
            </div>

            {/* Live Estimated EMI Card */}
            <div style={{
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--blue-300)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Estimated Monthly Installment
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  ₹ {Number(estimatedEmi).toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div>Interest: <strong>{selectedScheme.baseInterestRate}% p.a.</strong></div>
                <div>Processing Fee: <strong>{selectedScheme.processingFeePct}%</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Paperless Documents Upload Simulator */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--surface-glass-border)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                100% Digital Document Submission
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Securely attached encrypted documents for instant automated OCR & KYC checks.
              </p>
            </div>

            {/* Uploaded Documents List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.documents.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: 'var(--navy-900)',
                    border: '1px solid var(--surface-glass-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--emerald-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileCheck2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.file} • {doc.size} • <span style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>Attached & Encrypted</span>
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> Ready
                  </span>
                </div>
              ))}
            </div>

            {/* Dropzone Simulation */}
            <div style={{
              border: '2px dashed var(--navy-700)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <UploadCloud size={32} style={{ color: 'var(--blue-400)' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Drag & Drop additional documents or <span style={{ color: 'var(--blue-400)', textDecoration: 'underline', cursor: 'pointer' }}>browse file</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Supported: PDF, JPG, PNG up to 10MB (Property Agreement, ITR Returns, Guarantor Consent)
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Credit Pre-Qualification */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ borderBottom: '1px solid var(--surface-glass-border)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Application Review & Pre-Qualification Check
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Instant algorithmic eligibility score before final submission to loan department.
              </p>
            </div>

            {/* CIBIL & DTI Risk Evaluation Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <CreditScoreGauge
                score={currentCustomer?.cibilScore || 782}
                rating={currentCustomer?.cibilRating || 'Excellent'}
              />

              <div style={{
                background: 'var(--navy-900)',
                border: '1px solid var(--surface-glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Debt-to-Income (DTI) Ratio
                  </span>
                  <span className={`badge ${dtiRatio <= 40 ? 'badge-success' : dtiRatio <= 50 ? 'badge-warning' : 'badge-danger'}`}>
                    {dtiRatio <= 40 ? 'Low Risk' : dtiRatio <= 50 ? 'Moderate Risk' : 'High Obligation'}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: dtiRatio <= 40 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                    {dtiRatio}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Total Debt Burden: ₹{totalMonthlyObligations.toLocaleString('en-IN')} / ₹{formData.monthlyIncome.toLocaleString('en-IN')} Income
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {dtiRatio <= 40
                    ? '✅ Excellent financial health. Highest probability of sanction at competitive rates.'
                    : '⚠️ Debt ratio within acceptable banking thresholds under standard terms.'}
                </div>
              </div>
            </div>

            {/* Application Summary Box */}
            <div style={{
              background: 'var(--navy-900)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--surface-glass-border)',
              padding: '20px'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
                Application Summary
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Applicant Name:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formData.fullName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Loan Product:</span>
                  <div style={{ fontWeight: 700, color: 'var(--blue-400)' }}>{selectedScheme.name}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Requested Principal:</span>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                    ₹ {Number(formData.requestedAmount).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Tenure:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formData.requestedTenureYears} Years</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Interest Rate:</span>
                  <div style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>{selectedScheme.baseInterestRate}% p.a.</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Monthly EMI:</span>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹ {Number(estimatedEmi).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" defaultChecked style={{ marginTop: '3px' }} id="declare" />
              <label htmlFor="declare">
                I hereby declare that all submitted information and documents are true and complete. I authorize Apex Trust Bank to retrieve my credit report from CIBIL/Experian and process this application as per RBI guidelines.
              </label>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--surface-glass-border)'
        }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="btn btn-secondary"
              style={{ gap: '8px' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              style={{ gap: '8px' }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-success btn-lg"
              style={{ gap: '10px' }}
            >
              <Sparkles size={18} />
              <span>Submit Application Online</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
