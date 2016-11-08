
import { addClass, removeClass } from '../services/utils';

class ErrorElement {
  constructor (element, wrapper) {
    this.__element = element;
    this.__wrapper = wrapper;
  }
  show (errors) {
    if (!this.__element) return false;
    var arr = [].concat(errors);
    this.__element.innerHTML = arr[0];
    this.__wrapper && addClass(this.__wrapper, 'is-error');
    return true;
  }
  clear () {
    if (!this.__element) return false;
    this.__element.innerHTML = '';
    this.__wrapper && removeClass(this.__wrapper, 'is-error');
    return true;
  }
}

export default ErrorElement;
