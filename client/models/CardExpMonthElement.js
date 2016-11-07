import CardInputElement from './CardInputElement';

class CardExpMonthElement extends CardInputElement {
  constructor (element) {
    super(element, {
      autocomplete: 'cc-exp-month',
      name: 'expMonth',
      length: 2,
      mask: '11',
    });

    this.element.addEventListener('keydown', function (e) {
      var keyCode = e.which || e.keyCode;
      var number = Number(String.fromCharCode(keyCode));
      if (isNaN(number) || number < 2 || element.value.length > 1) return;
      e.preventDefault();
      e.stopPropagation();
      element.value = '0'+number;
    })
  }
}

export default CardExpMonthElement;
