// Frontend REST API Service for Apex Trust Bank Backend

const API_BASE = '/api';

const fetchJson = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`Backend request to ${endpoint} failed:`, err.message);
    throw err;
  }
};

export const authApi = {
  login: (username, password) => fetchJson('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (userData) => fetchJson('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getUsers: () => fetchJson('/auth/users')
};

export const schemesApi = {
  getAll: () => fetchJson('/schemes'),
  getById: (id) => fetchJson(`/schemes/${id}`),
  create: (schemeData) => fetchJson('/schemes', { method: 'POST', body: JSON.stringify(schemeData) }),
  update: (id, schemeData) => fetchJson(`/schemes/${id}`, { method: 'PUT', body: JSON.stringify(schemeData) })
};

export const customersApi = {
  getAll: (search = '') => fetchJson(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => fetchJson(`/customers/${id}`),
  update: (id, data) => fetchJson(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
};

export const applicationsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/applications${query ? `?${query}` : ''}`);
  },
  getById: (id) => fetchJson(`/applications/${id}`),
  submit: (appData) => fetchJson('/applications', { method: 'POST', body: JSON.stringify(appData) }),
  advanceStage: (id, stageData) => fetchJson(`/applications/${id}/stage`, { method: 'PATCH', body: JSON.stringify(stageData) }),
  updateDocStatus: (id, docId, status) => fetchJson(`/applications/${id}/documents/${docId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  sanction: (id, sanctionData) => fetchJson(`/applications/${id}/sanction`, { method: 'POST', body: JSON.stringify(sanctionData) }),
  reject: (id, rejectData) => fetchJson(`/applications/${id}/reject`, { method: 'POST', body: JSON.stringify(rejectData) }),
  disburse: (id) => fetchJson(`/applications/${id}/disburse`, { method: 'POST' })
};

export const loansApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/loans${query ? `?${query}` : ''}`);
  },
  getById: (id) => fetchJson(`/loans/${id}`),
  payEmi: (id, paymentData) => fetchJson(`/loans/${id}/pay-emi`, { method: 'POST', body: JSON.stringify(paymentData) }),
  getTransactions: (loanId = '') => fetchJson(`/transactions${loanId ? `?loanId=${loanId}` : ''}`)
};

export const analyticsApi = {
  getDashboard: () => fetchJson('/analytics/dashboard'),
  resetDatabase: () => fetchJson('/system/reset', { method: 'POST' })
};
