import MaskedInputElement from './MaskedInputElement';

class CardInputElement extends MaskedInputElement {
  constructor (element, options) {
    super(element, options);
    var opts = options || {};

    this.name = opts.name;
    this.length = opts.length;

    this.element.setAttribute('name', opts.name || opts.autocomplete);
    this.element.setAttribute('type', opts.type || 'text');
    this.element.setAttribute('pattern', '[0-9]*');
    this.element.setAttribute('autocomplete', opts.autocomplete);
    this.element.setAttribute('x-autocompletetype', opts.autocomplete);
    this.element.setAttribute('inputmode', 'numeric');
  }
}

export default CardInputElement;
