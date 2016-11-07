
import InputElement from './InputElement';
import { MaskedInput } from 'nebo15-mask/src/index';

class MaskedInputElement extends InputElement {
  constructor (element, options) {
    super(element, options);
    this.__mask = new MaskedInput(this.element, options.mask);
  }
  getValue () {
    return this.__mask.model;
  }
}

export default MaskedInputElement;
