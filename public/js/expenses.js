// ============================================
// EXPENSES.JS - All expense CRUD operations
// ============================================
import { expensesAPI } from './api.js';
import { renderChart } from './chart.js';

// Store all expenses in memory
let allExpenses = [];

// Track which expense is being deleted
let deleteTargetId = null;

// ── GET PAGE ELEMENTS ─────────────────────────────────────
const expenseList      = document.getElementById('expenseList');
const expenseForm      = document.getElementById('expenseForm');
const formTitle        = document.getElementById('formTitle');
const submitBtn        = document.getElementById('submitExpenseBtn');
const cancelEditBtn    = document.getElementById('cancelEditBtn');
const editIdInput      = document.getElementById('editId');
const deleteModal      = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn  = document.getElementById('cancelDeleteBtn');

// Summary card elements
const totalSpentEl   = document.getElementById('totalSpent');
const monthSpentEl   = document.getElementById('monthSpent');
const expenseCountEl = document.getElementById('expenseCount');

// Filter elements
const searchInput     = document.getElementById('searchInput');
const filterCategory  = document.getElementById('filterCategory');
const filterStart     = document.getElementById('filterStart');
const filterEnd       = document.getElementById('filterEnd');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// ── FORMAT MONEY ──────────────────────────────────────────
// Turns 45.5 into "D 45.50"
const formatMoney = (amount) =>
  new Intl.NumberFormat('en-GM', {
    style: 'currency',
    currency: 'GMD',
  }).format(amount);

// ── FORMAT DATE ───────────────────────────────────────────
// Turns "2024-01-15" into "Jan 15, 2024"
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

// ── CATEGORY EMOJIS ───────────────────────────────────────
const categoryEmoji = {
  Food:          '🍔',
  Transport:     '🚗',
  Housing:       '🏠',
  Entertainment: '🎬',
  Health:        '💊',
  Shopping:      '🛍️',
  Education:     '📚',
  Other:         '📦',
};

// ── PREVENT XSS (Security) ────────────────────────────────
// This stops hackers from injecting HTML/JavaScript
const safe = (str) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
};

// ── RENDER EXPENSE LIST ───────────────────────────────────
const renderExpenses = (expenses) => {
  if (expenses.length === 0) {
    expenseList.innerHTML = `
      <div class="empty-state">
        <p>😊 No expenses found.</p>
        <p>Add your first expense above!</p>
      </div>`;
    return;
  }

  // Build HTML for each expense
  expenseList.innerHTML = expenses
    .map(({ _id, title, amount, category, date, notes }) => `
      <div class="expense-item">
        <div class="expense-item__icon">
          ${categoryEmoji[category] || '📦'}
        </div>
        <div class="expense-item__info">
          <p class="expense-item__title">${safe(title)}</p>
          <p class="expense-item__meta">${safe(category)} · ${formatDate(date)}</p>
          ${notes ? `<p class="expense-item__notes">${safe(notes)}</p>` : ''}
        </div>
        <div class="expense-item__right">
          <p class="expense-item__amount">${formatMoney(amount)}</p>
          <div class="expense-item__actions">
            <button 
              class="btn btn--sm btn--outline" 
              onclick="startEdit('${_id}')">
              ✏️ Edit
            </button>
            <button 
              class="btn btn--sm btn--danger" 
              onclick="showDeleteModal('${_id}')">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    `)
    .join('');
};

// ── UPDATE SUMMARY CARDS ──────────────────────────────────
const updateSummaryCards = (expenses) => {
  // Add up all expenses
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Add up only this month's expenses
  const now = new Date();
  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
  const monthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Update the display
  totalSpentEl.textContent   = formatMoney(total);
  monthSpentEl.textContent   = formatMoney(monthTotal);
  expenseCountEl.textContent = expenses.length;
};

// ── LOAD ALL EXPENSES FROM BACKEND ────────────────────────
export const loadExpenses = async () => {
  try {
    expenseList.innerHTML = '<p class="empty-state">Loading...</p>';
    const { data } = await expensesAPI.getAll();
    allExpenses = data;
    applyFilters();
    updateSummaryCards(data);
    await renderChart();  // Refresh chart too
  } catch (error) {
    expenseList.innerHTML = `
      <p class="empty-state" style="color: #e74c3c;">
        ❌ Failed to load expenses. Please refresh.
      </p>`;
  }
};

// ── APPLY FILTERS LOCALLY ─────────────────────────────────
const applyFilters = () => {
  const search   = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  const start    = filterStart.value ? new Date(filterStart.value) : null;
  const end      = filterEnd.value   ? new Date(filterEnd.value)   : null;

  const filtered = allExpenses.filter((expense) => {
    const matchSearch   = expense.title.toLowerCase().includes(search);
    const matchCategory = !category || expense.category === category;
    const expDate       = new Date(expense.date);
    const matchStart    = !start || expDate >= start;
    const matchEnd      = !end   || expDate <= end;

    return matchSearch && matchCategory && matchStart && matchEnd;
  });

  renderExpenses(filtered);
};

// Listen for filter changes
searchInput.addEventListener('input', applyFilters);
filterCategory.addEventListener('change', applyFilters);
filterStart.addEventListener('change', applyFilters);
filterEnd.addEventListener('change', applyFilters);

// Clear all filters
clearFiltersBtn.addEventListener('click', () => {
  searchInput.value    = '';
  filterCategory.value = '';
  filterStart.value    = '';
  filterEnd.value      = '';
  applyFilters();
});

// ── ADD / EDIT EXPENSE FORM SUBMIT ────────────────────────
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  // Collect form data
  const expenseData = {
    title:    document.getElementById('expTitle').value.trim(),
    amount:   parseFloat(document.getElementById('expAmount').value),
    category: document.getElementById('expCategory').value,
    date:     document.getElementById('expDate').value,
    notes:    document.getElementById('expNotes').value.trim(),
  };

  const editId = editIdInput.value;

  try {
    if (editId) {
      // We're editing an existing expense
      await expensesAPI.update(editId, expenseData);
    } else {
      // We're creating a new expense
      await expensesAPI.create(expenseData);
    }

    // Reset form and reload list
    expenseForm.reset();
    resetFormState();
    await loadExpenses();

  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editId ? 'Update Expense' : 'Add Expense';
  }
});

// ── START EDITING AN EXPENSE ──────────────────────────────
// This is called when user clicks the Edit button
window.startEdit = (id) => {
  // Find the expense in our local data
  const expense = allExpenses.find((e) => e._id === id);
  if (!expense) return;

  // Fill in the form with current values
  editIdInput.value = id;
  document.getElementById('expTitle').value    = expense.title;
  document.getElementById('expAmount').value   = expense.amount;
  document.getElementById('expCategory').value = expense.category;
  document.getElementById('expNotes').value    = expense.notes || '';
  
  // Format date correctly for input (YYYY-MM-DD)
  document.getElementById('expDate').value = 
    expense.date.split('T')[0];

  // Change form to "Edit" mode
  formTitle.textContent    = '✏️ Edit Expense';
  submitBtn.textContent    = 'Update Expense';
  cancelEditBtn.classList.remove('hidden');

  // Scroll to the form smoothly
  expenseForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ── CANCEL EDITING ────────────────────────────────────────
cancelEditBtn.addEventListener('click', () => {
  expenseForm.reset();
  resetFormState();
});

// Reset form back to "Add" mode
const resetFormState = () => {
  editIdInput.value        = '';
  formTitle.textContent    = '➕ Add Expense';
  submitBtn.textContent    = 'Add Expense';
  cancelEditBtn.classList.add('hidden');
};

// ── DELETE MODAL ──────────────────────────────────────────
// Show confirmation dialog
window.showDeleteModal = (id) => {
  deleteTargetId = id;
  deleteModal.classList.remove('hidden');
};

// Cancel deletion
cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.classList.add('hidden');
  deleteTargetId = null;
});

// Confirm deletion
confirmDeleteBtn.addEventListener('click', async () => {
  if (!deleteTargetId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';

  try {
    await expensesAPI.delete(deleteTargetId);
    deleteModal.classList.add('hidden');
    deleteTargetId = null;
    await loadExpenses();
  } catch (error) {
    alert('Could not delete: ' + error.message);
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Delete';
  }
});

// Set default date to today when page loads
export const setTodayAsDefault = () => {
  const dateInput = document.getElementById('expDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
};