// ============================================
// API.JS - All communication with the backend
// ============================================

// ⚠️ IMPORTANT: Change this URL after you deploy!
// For now, use localhost for local development
const BASE_URL = 'https://expensewise-1-9gg9.onrender.com/api';

/**
 * This is our main fetch function.
 * Instead of writing fetch() everywhere, we use this.
 * It automatically adds the login token to every request.
 */
const request = async (endpoint, options = {}) => {
  // Get the saved token from browser storage
  const token = localStorage.getItem('token');

  // Build the request settings
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // If we have a token, add it to the headers
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // Make the actual request
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  // Convert response to JSON
  const data = await response.json();

  // If the response is an error (4xx or 5xx), throw an error
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ── AUTH API ──────────────────────────────────────────────
export const authAPI = {
  // Register new user
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Login existing user
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Get current logged-in user info
  getMe: () => request('/auth/me'),
};

// ── EXPENSES API ──────────────────────────────────────────
export const expensesAPI = {
  // Get all expenses (with optional filters)
  getAll: (params = {}) => {
    // Build query string like ?category=Food
    const query = new URLSearchParams(params).toString();
    return request(`/expenses${query ? '?' + query : ''}`);
  },

  // Create a new expense
  create: (expenseData) =>
    request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    }),

  // Update an expense by ID
  update: (id, expenseData) =>
    request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    }),

  // Delete an expense by ID
  delete: (id) =>
    request(`/expenses/${id}`, {
      method: 'DELETE',
    }),

  // Get spending totals by category (for chart)
  getSummary: () => request('/expenses/summary'),
};