import * as model from './model.js';
import expenseFormView from './views/ExpenseFormView.js';
import expenseListView from './views/ExpenseListView.js';
import budgetCalculatorView from './views/BudgetCalculatorView.js';

function renderAllViews() {
  expenseFormView.render({
    editingExpense: model.getEditingExpense()
  });

  expenseListView.render({
    expenses: model.state.expenses,
    lastDeleted: model.state.lastDeleted
  });

  budgetCalculatorView.render({
    settings: model.state.settings,
    summary: model.state.summary
  });
}

function controlSaveExpense(formData) {
  const { name, category, unitCost, quantity } = formData;
  const costNum = Number(unitCost);
  const qtyNum = Number(quantity);

  if (!name || !name.trim()) {
    expenseFormView.renderError('Please enter an expense item name (e.g., Van Rental).');
    return;
  }

  if (!Number.isFinite(costNum) || costNum <= 0) {
    expenseFormView.renderError('Unit cost must be a valid number greater than ₱0.');
    return;
  }

  if (!Number.isFinite(qtyNum) || qtyNum < 1 || !Number.isInteger(qtyNum)) {
    expenseFormView.renderError('Quantity must be a whole number of at least 1.');
    return;
  }

  if (model.state.editingId) {
    model.updateExpense({ name, category, unitCost: costNum, quantity: qtyNum });
  } else {
    model.addExpense({ name, category, unitCost: costNum, quantity: qtyNum });
  }

  renderAllViews();
}

function controlStartEdit(id) {
  model.setEditingExpense(id);
  renderAllViews();
}

function controlCancelEdit() {
  model.clearEditingExpense();
  renderAllViews();
}

function controlDeleteExpense(id) {
  model.deleteExpense(id);
  renderAllViews();
}

function controlUndoDelete() {
  model.undoDeleteExpense();
  renderAllViews();
}

function controlUpdateTripSettings({ headcount, targetBudget }) {
  const countNum = Number(headcount);
  const budgetNum = Number(targetBudget);

  if (!Number.isInteger(countNum) || countNum < 1) {
    budgetCalculatorView.renderError('Group headcount must be at least 1 person.');
    return;
  }

  if (!Number.isFinite(budgetNum) || budgetNum < 0) {
    budgetCalculatorView.renderError('Target budget cannot be negative.');
    return;
  }

  model.updateTripSettings({ headcount: countNum, targetBudget: budgetNum });
  budgetCalculatorView.render({
    settings: model.state.settings,
    summary: model.state.summary
  });
}

function init() {
  model.initModel();
  renderAllViews();

  expenseFormView.addHandlerSubmit(controlSaveExpense);
  expenseFormView.addHandlerCancelEdit(controlCancelEdit);
  expenseListView.addHandlerItemActions(
    controlStartEdit,
    controlDeleteExpense,
    controlUndoDelete
  );
  budgetCalculatorView.addHandlerSettingsChange(controlUpdateTripSettings);
}

init();