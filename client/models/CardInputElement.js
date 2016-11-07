import MaskedInputElement from './MaskedInputElement';

class CardInputElement extends MaskedInputElement {
  constructor (element, options) {
    super(element, options);
    var opts = options || {};

    this.name = opts.name;
    this.length = opts.length;

    this.element.setAttribute('name', opts.name || opts.autocomplete);
    this.element.setAttribute('type', 'text');
    this.element.setAttribute('pattern', '\d*');
    this.element.setAttribute('autocomplete', opts.autocomplete);
    this.element.setAttribute('x-autocompletetype', opts.autocomplete);
    this.element.setAttribute('inputmode', 'numeric');
  }
}

export default CardInputElement;
