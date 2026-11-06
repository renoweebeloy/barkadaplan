const STORAGE_KEY = 'barkadafund_state_v1';

const INITIAL_EXPENSES = [
  { id: '1730610001', name: 'Van Rental (Roundtrip)', category: 'Transport / Van', unitCost: 3500, quantity: 1 },
  { id: '1730610002', name: 'Beach Open Cottage', category: 'Accommodation / Cottage', unitCost: 1200, quantity: 1 },
  { id: '1730610003', name: 'Food & Inom Provision', category: 'Food & Drinks', unitCost: 2000, quantity: 1 }
];

export const state = {
  expenses: [],
  editingId: null,
  lastDeleted: null, 
  settings: {
    headcount: 6,
    targetBudget: 8000
  },
  summary: {
    totalCost: 0,
    remainingBudget: 0,
    ambaganPerPerson: 0,
    isOverBudget: false
  }
};

function _recomputeSummary() {
  const totalCost = state.expenses.reduce(
    (sum, item) => sum + item.unitCost * item.quantity,
    0
  );

  const headcount = state.settings.headcount > 0 ? state.settings.headcount : 1;
  const remainingBudget = state.settings.targetBudget - totalCost;
  const ambaganPerPerson = totalCost / headcount;

  state.summary = {
    totalCost: Number(totalCost.toFixed(2)),
    remainingBudget: Number(remainingBudget.toFixed(2)),
    ambaganPerPerson: Number(ambaganPerPerson.toFixed(2)),
    isOverBudget: remainingBudget < 0
  };
}

function _saveToLocalStorage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      expenses: state.expenses,
      settings: state.settings
    })
  );
}

export function initModel() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : INITIAL_EXPENSES;
      if (parsed.settings) {
        state.settings.headcount = Number(parsed.settings.headcount) || 6;
        state.settings.targetBudget = Number(parsed.settings.targetBudget) || 8000;
      }
    } catch {
      state.expenses = INITIAL_EXPENSES;
    }
  } else {
    state.expenses = INITIAL_EXPENSES;
  }
  _recomputeSummary();
}

export function addExpense({ name, category, unitCost, quantity }) {
  const newExpense = {
    id: Date.now().toString(),
    name: name.trim(),
    category: category.trim(),
    unitCost: Number(unitCost),
    quantity: Number(quantity)
  };
  state.expenses.push(newExpense);
  state.lastDeleted = null; // I-reset ang undo kapag nagdagdag ng bago
  _recomputeSummary();
  _saveToLocalStorage();
}

export function setEditingExpense(id) {
  state.editingId = id;
}

export function clearEditingExpense() {
  state.editingId = null;
}

export function getEditingExpense() {
  return state.expenses.find(item => item.id === state.editingId) || null;
}

export function updateExpense({ name, category, unitCost, quantity }) {
  const index = state.expenses.findIndex(item => item.id === state.editingId);
  if (index === -1) return;

  state.expenses[index] = {
    ...state.expenses[index],
    name: name.trim(),
    category: category.trim(),
    unitCost: Number(unitCost),
    quantity: Number(quantity)
  };

  state.editingId = null;
  _recomputeSummary();
  _saveToLocalStorage();
}

export function deleteExpense(id) {
  // Itago ang binura para magamit sa Undo bago i-filter palabas
  const itemToDelete = state.expenses.find(item => item.id === id);
  if (itemToDelete) {
    state.lastDeleted = { ...itemToDelete };
  }

  state.expenses = state.expenses.filter(item => item.id !== id);
  if (state.editingId === id) {
    state.editingId = null;
  }
  _recomputeSummary();
  _saveToLocalStorage();
}

export function undoDeleteExpense() {
  if (!state.lastDeleted) return;

  // Ibalik ang binurang plano sa listahan
  state.expenses.push(state.lastDeleted);
  state.lastDeleted = null; // Linisin matapos mai-undo
  _recomputeSummary();
  _saveToLocalStorage();
}

export function updateTripSettings({ headcount, targetBudget }) {
  state.settings.headcount = Number(headcount);
  state.settings.targetBudget = Number(targetBudget);
  _recomputeSummary();
  _saveToLocalStorage();
}