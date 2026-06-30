// ============================================
// DASHBOARD.JS - Controls the dashboard page
// ============================================
import { authAPI } from './api.js';
import { loadExpenses, setTodayAsDefault } from './expenses.js';

// ── SECURITY CHECK ────────────────────────────────────────
// If no token in storage, user is not logged in → send to login page
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/index.html';
}

// ── LOAD USER INFO ────────────────────────────────────────
const initUser = async () => {
  try {
    const { user } = await authAPI.getMe();
    // Show "Hi, Jane" in the navbar
    document.getElementById('navUserName').textContent = `Hi, ${user.name} 👋`;
  } catch (error) {
    // Token is invalid or expired - force logout
    console.error('Could not get user info:', error);
    logout();
  }
};

// ── LOGOUT ────────────────────────────────────────────────
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
};

// Connect logout button
document.getElementById('logoutBtn').addEventListener('click', logout);

// ── START EVERYTHING ──────────────────────────────────────
const init = async () => {
  await initUser();        // Show user name
  setTodayAsDefault();     // Set date to today
  await loadExpenses();    // Load and display expenses
};

// Run when page loads
init();