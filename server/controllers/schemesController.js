import { db } from '../db.js';

export const getSchemes = (req, res) => {
  const schemes = db.get('schemes');
  return res.json({ success: true, data: schemes });
};

export const getSchemeById = (req, res) => {
  const scheme = db.findById('schemes', req.params.id);
  if (!scheme) {
    return res.status(404).json({ success: false, error: 'Scheme not found' });
  }
  return res.json({ success: true, data: scheme });
};

export const createScheme = (req, res) => {
  const schemeData = req.body;
  if (!schemeData.name || !schemeData.baseInterestRate) {
    return res.status(400).json({ success: false, error: 'Scheme name and base rate are required.' });
  }

  const id = `scheme-${(schemeData.category || 'custom').toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
  const newScheme = {
    ...schemeData,
    id,
    features: schemeData.features || ['Instant digital approval', 'Flexible tenure'],
    requiredDocs: schemeData.requiredDocs || ['PAN & Aadhaar', '6 Months Bank Statement']
  };

  db.insert('schemes', newScheme);
  return res.status(201).json({ success: true, data: newScheme });
};

export const updateScheme = (req, res) => {
  const updated = db.update('schemes', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Scheme not found' });
  }
  return res.json({ success: true, data: updated });
};
