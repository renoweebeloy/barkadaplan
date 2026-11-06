export default class View {
  _data;
  _errorMessage = 'Invalid input. Please check your entries.';

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error-banner" role="alert">
        <strong>Error:</strong> ${message}
      </div>
    `;
    const errorSlot = this._parentElement.querySelector('.error-slot');
    if (errorSlot) {
      errorSlot.innerHTML = markup;
    } else {
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
  }
}