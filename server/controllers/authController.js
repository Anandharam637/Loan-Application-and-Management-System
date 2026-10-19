import { db } from '../db.js';

export const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username/Email and password are required.' });
  }

  const users = db.get('users');
  const user = users.find(u => 
    (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) &&
    u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials. Please verify username and password.' });
  }

  // Generate simulated auth token
  const token = `APEX-TOKEN-${Buffer.from(`${user.id}:${Date.now()}`).toString('base64')}`;

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      designation: user.designation,
      avatar: user.avatar,
      customerId: user.customerId,
      department: user.department,
      employeeId: user.employeeId
    }
  });
};

export const registerCustomer = (req, res) => {
  const { name, email, password, phone, pan, monthlyIncome, employmentType, employer, city, cibilScore } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  const users = db.get('users');
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
  }

  const newCustId = `CUST-${Math.floor(1005 + Math.random() * 8000)}`;
  const newUserId = `USR-CUST-${Math.floor(1005 + Math.random() * 8000)}`;

  const newCustomerObj = {
    id: newCustId,
    name,
    email,
    phone: phone || '+91 98000 12345',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    pan: (pan || 'ABCDE1234F').toUpperCase(),
    aadhaar: 'XXXX-XXXX-9921',
    cibilScore: Number(cibilScore || 750),
    cibilRating: Number(cibilScore || 750) >= 750 ? 'Excellent' : 'Good',
    employmentType: employmentType || 'Salaried - Professional',
    employer: employer || 'Private Enterprise',
    monthlyIncome: Number(monthlyIncome || 120000),
    existingEmi: 0,
    city: city || 'Bengaluru, Karnataka',
    accountNo: `SBIN00${Math.floor(10000000 + Math.random() * 90000000)}`,
    kycVerified: true,
    joinedDate: new Date().toISOString().split('T')[0]
  };

  const newUserObj = {
    id: newUserId,
    username: email,
    email,
    password,
    role: 'customer',
    customerId: newCustId,
    name,
    designation: 'New Retail Customer',
    avatar: newCustomerObj.avatar
  };

  db.insert('customers', newCustomerObj);
  db.insert('users', newUserObj);

  const token = `APEX-TOKEN-${Buffer.from(`${newUserObj.id}:${Date.now()}`).toString('base64')}`;

  return res.status(201).json({
    success: true,
    token,
    user: newUserObj,
    customer: newCustomerObj
  });
};

export const getUsers = (req, res) => {
  const users = db.get('users');
  return res.json({ success: true, data: users });
};
