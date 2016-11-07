import CardInputElement from './CardInputElement';

class CardPanElement extends CardInputElement {
  constructor (element, error) {
    super(element, {
      autocomplete: 'cc-pan',
      name: 'pan',
      length: 16,
      mask: '1111 1111 1111 1111',
      error: error,
    });
  }
}

export default CardPanElement;
