import CardInputElement from './CardInputElement';

class CardExpYearElement extends CardInputElement {
  constructor (element) {
    super(element, {
      autocomplete: 'cc-exp-year',
      name: 'expYear',
      length: 2,
      mask: '11',
    });
  }
}

export default CardExpYearElement;
