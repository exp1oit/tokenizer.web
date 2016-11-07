import CardInputElement from './CardInputElement';

class CardCscElement extends CardInputElement {
  constructor (element, error) {
    super(element, {
      autocomplete: 'cc-exp-csc',
      name: 'cvv',
      length: 3,
      mask: '111',
    });
  }
}

export default CardCscElement;
