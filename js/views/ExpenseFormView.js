import View from './View.js';

class ExpenseFormView extends View {
  get _parentElement() {
    return document.querySelector('#expense-form-container');
  }

  _errorMessage = 'Please provide a valid item name, cost, and quantity.';

  _generateMarkup() {
    const editing = this._data?.editingExpense;
    const isEditing = Boolean(editing);
    const categories = [
      'Transport / Van',
      'Accommodation / Cottage',
      'Food & Drinks',
      'Activities & Entrance',
      'Misc & Emergency'
    ];

    const optionsMarkup = categories
      .map(
        cat => `
        <option value="${cat}" ${isEditing && editing.category === cat ? 'selected' : ''}>
          ${cat}
        </option>
      `
      )
      .join('');

    return `
      <h2>${isEditing ? 'Edit Planned Expense' : 'Add Planned Expense'}</h2>
      <div class="error-slot"></div>
      <form id="expense-form" novalidate>
        <div class="form-group">
          <label for="name-input">Expense Item</label>
          <input
            type="text"
            id="name-input"
            name="name"
            placeholder="e.g. Van Rental, Beach Cottage, Lechon"
            value="${isEditing ? editing.name : ''}"
          />
        </div>

        <div class="form-group">
          <label for="category-input">Category</label>
          <select id="category-input" name="category">
            ${optionsMarkup}
          </select>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label for="cost-input">Unit Cost (₱)</label>
            <input
              type="number"
              id="cost-input"
              name="unitCost"
              step="1"
              min="1"
              placeholder="e.g. 1500"
              value="${isEditing ? editing.unitCost : ''}"
            />
          </div>

          <div class="form-group">
            <label for="qty-input">Quantity</label>
            <input
              type="number"
              id="qty-input"
              name="quantity"
              step="1"
              min="1"
              placeholder="e.g. 1"
              value="${isEditing ? editing.quantity : '1'}"
            />
          </div>
        </div>

        <div class="btn-row">
          <button type="submit" class="btn btn-primary">
            ${isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          ${
            isEditing
              ? '<button type="button" class="btn btn-secondary btn-cancel-edit">Cancel</button>'
              : ''
          }
        </div>
      </form>
    `;
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      const form = e.target.closest('#expense-form');
      if (!form) return;
      e.preventDefault();

      const formData = new FormData(form);
      handler({
        name: formData.get('name'),
        category: formData.get('category'),
        unitCost: formData.get('unitCost'),
        quantity: formData.get('quantity')
      });
    });
  }

  addHandlerCancelEdit(handler) {
    this._parentElement.addEventListener('click', e => {
      const cancelBtn = e.target.closest('.btn-cancel-edit');
      if (!cancelBtn) return;
      handler();
    });
  }
}

export default new ExpenseFormView();