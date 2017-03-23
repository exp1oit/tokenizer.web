import CardInputElement from './CardInputElement';

class CardExpYearElement extends CardInputElement {
  constructor (element) {
    element.addEventListener('input', (e) => { this.onChange(e); }, true);
    element.addEventListener('change', (e) => { this.onChange(e); }, true);

    super(element, {
      autocomplete: 'cc-exp-year',
      name: 'expYear',
      length: 2,
      mask: '11',
    });
  }

  onChange(e) {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;
    if (!value) return;

    if (String(value).length > 2) {
      this.setValue(String(value).slice(-2));
    }
  }
}



export default CardExpYearElement;
