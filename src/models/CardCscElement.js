import CardInputElement from './CardInputElement';

class CardCscElement extends CardInputElement {
  constructor (element, error) {
    super(element, {
      autocomplete: 'cc-exp-csc',
      name: 'cvv',
      type: 'tel',
      length: 3,
      mask: '111',
    });

    element.setAttribute('style', '-webkit-text-security: disc;');
  }
}

export default CardCscElement;
