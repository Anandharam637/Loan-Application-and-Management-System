import React, { useState } from 'react';
import { useLoanContext } from '../../context/LoanContext';
import { Modal } from '../common/Modal';
import { 
  Percent, 
  Plus, 
  Edit3, 
  Check, 
  Sparkles, 
  Home, 
  UserCheck, 
  Car, 
  GraduationCap, 
  Building2, 
  Coins 
} from 'lucide-react';

export const LoanSchemesManager = () => {
  const { schemes, updateScheme, addScheme } = useLoanContext();

  const [editingScheme, setEditingScheme] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Scheme Form
  const [newScheme, setNewScheme] = useState({
    name: '',
    category: 'Commercial',
    tagline: '',
    baseInterestRate: 9.50,
    minAmount: 100000,
    maxAmount: 10000000,
    minTenureYears: 1,
    maxTenureYears: 10,
    processingFeePct: 0.50,
    minCibilScore: 680,
    icon: 'Building2',
    color: '#3b82f6',
    features: ['Instant digital sanctioning', 'Flexible repayment structures'],
    requiredDocs: ['Identity Proof (PAN/Aadhaar)', 'Latest 6 Months Bank Statement']
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateScheme(editingScheme.id, editingScheme);
    setEditingScheme(null);
  };

  const handleCreateScheme = (e) => {
    e.preventDefault();
    addScheme(newScheme);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Loan Schemes & Interest Rates Master
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Configure live interest rates, eligibility criteria, tenure limits and processing fees.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <Plus size={16} />
          <span>Add New Loan Scheme</span>
        </button>
      </div>

      {/* Schemes Cards / Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Scheme Name</th>
              <th>Category</th>
              <th>Base Rate (% p.a.)</th>
              <th>Amount Limits</th>
              <th>Max Tenure</th>
              <th>Fee %</th>
              <th>Min CIBIL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map(scheme => (
              <tr key={scheme.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {scheme.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {scheme.tagline}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--navy-900)', border: '1px solid var(--surface-glass-border)' }}>
                    {scheme.category}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald-400)' }}>
                    {scheme.baseInterestRate}%
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  ₹{(scheme.minAmount / 100000).toFixed(1)}L - ₹{(scheme.maxAmount / 100000).toFixed(1)}L
                </td>
                <td style={{ fontWeight: 600 }}>
                  {scheme.maxTenureYears} Years
                </td>
                <td style={{ color: 'var(--cyan-400)' }}>
                  {scheme.processingFeePct}%
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: scheme.minCibilScore >= 700 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                    {scheme.minCibilScore}+
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setEditingScheme(scheme)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', gap: '4px', fontSize: '0.75rem' }}
                  >
                    <Edit3 size={13} />
                    <span>Edit Rate</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Scheme Rate Modal */}
      {editingScheme && (
        <Modal
          isOpen={true}
          onClose={() => setEditingScheme(null)}
          title={`Edit Rates - ${editingScheme.name}`}
          subtitle="Update base interest rate, limits and processing charges"
          maxWidth="560px"
        >
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Base Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                className="form-input"
                value={editingScheme.baseInterestRate}
                onChange={(e) => setEditingScheme({ ...editingScheme, baseInterestRate: Number(e.target.value) })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Min Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingScheme.minAmount}
                  onChange={(e) => setEditingScheme({ ...editingScheme, minAmount: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingScheme.maxAmount}
                  onChange={(e) => setEditingScheme({ ...editingScheme, maxAmount: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Tenure (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingScheme.maxTenureYears}
                  onChange={(e) => setEditingScheme({ ...editingScheme, maxTenureYears: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Processing Fee (%)</label>
                <input
                  type="number"
                  step="0.05"
                  className="form-input"
                  value={editingScheme.processingFeePct}
                  onChange={(e) => setEditingScheme({ ...editingScheme, processingFeePct: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button type="button" onClick={() => setEditingScheme(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save Rate Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add New Scheme Modal */}
      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Add New Loan Scheme"
          subtitle="Configure terms for new retail or commercial credit product"
          maxWidth="600px"
        >
          <form onSubmit={handleCreateScheme} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Scheme Name</label>
              <input
                type="text"
                className="form-input"
                value={newScheme.name}
                onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                placeholder="e.g. Green Solar Equipment Loan"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={newScheme.category}
                  onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                  placeholder="Green / Commercial / Retail"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Base Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.05"
                  className="form-input"
                  value={newScheme.baseInterestRate}
                  onChange={(e) => setNewScheme({ ...newScheme, baseInterestRate: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Marketing Tagline</label>
              <input
                type="text"
                className="form-input"
                value={newScheme.tagline}
                onChange={(e) => setNewScheme({ ...newScheme, tagline: e.target.value })}
                placeholder="Low interest financing for solar rooftop installations"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newScheme.maxAmount}
                  onChange={(e) => setNewScheme({ ...newScheme, maxAmount: Number(e.target.value) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Tenure (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newScheme.maxTenureYears}
                  onChange={(e) => setNewScheme({ ...newScheme, maxTenureYears: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Loan Scheme
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
