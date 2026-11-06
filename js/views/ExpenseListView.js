import View from './View.js';

class ExpenseListView extends View {
  get _parentElement() {
    return document.querySelector('#expense-list-container');
  }

  _generateMarkup() {
    const { expenses = [], lastDeleted = null } = this._data || {};

    // Undo Banner sa kulay berde at purong Ingles
    const undoMarkup = lastDeleted
      ? `
        <div class="undo-banner">
          <span>Deleted <strong>"${lastDeleted.name}"</strong>.</span>
          <button type="button" class="btn btn-undo">Undo Delete</button>
        </div>
      `
      : '';

    if (expenses.length === 0) {
      return `
        <h2>Planned Outing Expenses</h2>
        ${undoMarkup}
        <div class="empty-state">
          <p>No expenses listed yet. Add an expense using the form to compute the group share!</p>
        </div>
      `;
    }

    const rowsMarkup = expenses
      .map(item => {
        const subtotal = item.unitCost * item.quantity;
        return `
          <tr>
            <td><strong>${item.name}</strong></td>
            <td><span class="category-tag">${item.category}</span></td>
            <td>₱${item.unitCost.toLocaleString()} × ${item.quantity}</td>
            <td><strong>₱${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            <td>
              <button type="button" class="btn btn-edit" data-id="${item.id}">Edit</button>
              <button type="button" class="btn btn-delete" data-id="${item.id}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <h2>Planned Outing Expenses (${expenses.length})</h2>
      ${undoMarkup}
      <table class="expense-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Unit × Qty</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rowsMarkup}
        </tbody>
      </table>
    `;
  }

  addHandlerItemActions(onEdit, onDelete, onUndo) {
    this._parentElement.addEventListener('click', e => {
      const editBtn = e.target.closest('.btn-edit');
      if (editBtn) {
        onEdit(editBtn.dataset.id);
        return;
      }

      const deleteBtn = e.target.closest('.btn-delete');
      if (deleteBtn) {
        onDelete(deleteBtn.dataset.id);
        return;
      }

      const undoBtn = e.target.closest('.btn-undo');
      if (undoBtn) {
        onUndo();
      }
    });
  }
}

export default new ExpenseListView();