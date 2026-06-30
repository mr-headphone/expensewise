// ============================================
// AUTH.JS - Handles Login and Register
// ============================================
import { authAPI } from './api.js';

// If user is already logged in, send them to dashboard
if (localStorage.getItem('token')) {
  window.location.href = '/dashboard.html';
}

// ── GET ELEMENTS FROM THE PAGE ────────────────────────────
const loginForm    = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authAlert    = document.getElementById('authAlert');
const tabBtns      = document.querySelectorAll('.tab-btn');

// ── TAB SWITCHING (Login ↔ Register) ─────────────────────
tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Which tab was clicked?
    const tab = btn.dataset.tab;

    // Remove 'active' from all tabs, add to clicked one
    tabBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    // Hide all forms, show the right one
    document.querySelectorAll('.auth-form').forEach((form) => {
      form.classList.remove('active');
    });
    document.getElementById(`${tab}Form`).classList.add('active');

    // Clear any error messages
    hideAlert();
  });
});

// ── SHOW / HIDE ALERT MESSAGES ────────────────────────────
const showAlert = (message, type = 'error') => {
  authAlert.textContent = message;
  authAlert.className = `alert alert--${type} show`;
};

const hideAlert = () => {
  authAlert.className = 'alert';
  authAlert.textContent = '';
};

// ── SAVE LOGIN DATA AND GO TO DASHBOARD ──────────────────
const handleAuthSuccess = ({ token, user }) => {
  // Save token and user info to browser storage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  // Go to dashboard page
  window.location.href = '/dashboard.html';
};

// ── LOGIN FORM SUBMIT ─────────────────────────────────────
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();  // Don't refresh the page
  hideAlert();

  // Get the button and disable it while loading
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Logging in...';

  // Get values from the form
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    // Send login request to backend
    const data = await authAPI.login({ email, password });
    handleAuthSuccess(data);
  } catch (error) {
    // Show error message
    showAlert(error.message);
  } finally {
    // Re-enable button no matter what
    btn.disabled = false;
    btn.textContent = 'Login';
  }
});

// ── REGISTER FORM SUBMIT ──────────────────────────────────
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();

  const btn = document.getElementById('registerBtn');
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  // Get values from the form
  const name     = document.getElementById('registerName').value.trim();
  const email    = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;

  // Check password length before sending
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters.');
    btn.disabled = false;
    btn.textContent = 'Create Account';
    return;
  }

  try {
    const data = await authAPI.register({ name, email, password });
    handleAuthSuccess(data);
  } catch (error) {
    showAlert(error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
});