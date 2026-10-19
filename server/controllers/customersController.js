import { db } from '../db.js';

export const getCustomers = (req, res) => {
  const customers = db.get('customers');
  const { search } = req.query;

  if (search) {
    const term = search.toLowerCase();
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.pan.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term)
    );
    return res.json({ success: true, data: filtered });
  }

  return res.json({ success: true, data: customers });
};

export const getCustomerById = (req, res) => {
  const customer = db.findById('customers', req.params.id);
  if (!customer) {
    return res.status(404).json({ success: false, error: 'Customer not found' });
  }
  return res.json({ success: true, data: customer });
};

export const updateCustomer = (req, res) => {
  const updated = db.update('customers', req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Customer not found' });
  }
  return res.json({ success: true, data: updated });
};
