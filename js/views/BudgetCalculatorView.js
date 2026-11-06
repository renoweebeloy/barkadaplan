import View from './View.js';

class BudgetCalculatorView extends View {
  get _parentElement() {
    return document.querySelector('#budget-calculator-container');
  }

  _errorMessage = 'Headcount must be at least 1 person and Target Budget cannot be negative.';

  _generateMarkup() {
    const { settings, summary } = this._data;

    const statusText = summary.isOverBudget
      ? `Over Budget by ₱${Math.abs(summary.remainingBudget).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : `Within Budget (₱${summary.remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })} remaining)`;

    return `
      <h2>Group Contribution & Budget Summary</h2>
      <div class="error-slot"></div>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">Contribution / Person</div>
          <div class="stat-value">₱${summary.ambaganPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Total Outing Cost</div>
          <div class="stat-value">₱${summary.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      <span class="status-pill ${summary.isOverBudget ? 'status-over' : 'status-ok'}">
        ${statusText}
      </span>

      <div class="form-row-2">
        <div class="form-group">
          <label for="headcount-input">Group Headcount</label>
          <input
            type="number"
            id="headcount-input"
            min="1"
            step="1"
            value="${settings.headcount}"
          />
        </div>

        <div class="form-group">
          <label for="target-budget-input">Target Budget (₱)</label>
          <input
            type="number"
            id="target-budget-input"
            min="0"
            step="100"
            value="${settings.targetBudget}"
          />
        </div>
      </div>
    `;
  }

  addHandlerSettingsChange(handler) {
    this._parentElement.addEventListener('change', e => {
      if (
        !e.target.matches('#headcount-input') &&
        !e.target.matches('#target-budget-input')
      ) {
        return;
      }

      const headcountEl = this._parentElement.querySelector('#headcount-input');
      const budgetEl = this._parentElement.querySelector('#target-budget-input');

      handler({
        headcount: headcountEl.value,
        targetBudget: budgetEl.value
      });
    });
  }
}

export default new BudgetCalculatorView();