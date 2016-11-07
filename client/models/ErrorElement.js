
class ErrorElement {
  constructor (element) {
    this.__element = element;
  }
  show (errors) {
    if (!this.__element) return false;
    var arr = [].concat(errors);
    this.__element.innerHTML = arr[0];
    return true;
  }
  clear () {
    if (!this.__element) return false;
    this.__element.innerHTML = '';
    return true;
  }
}

export default ErrorElement;
