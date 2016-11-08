
const defaultFormat = /(\d{1,4})/g;
const types = [
  {
    type: 'maestro',
    pattern: /^(5018|5020|5038|6304|6759|676[1-3]|6768|5612|5893|6304|6759|0604|6390)/,
    format: defaultFormat,
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'diners_club',
    pattern: /^(36|38|30[0-5])/,
    format: defaultFormat,
    length: [14],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'laser',
    pattern: /^(6706|6771|6709)/,
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'jcb',
    pattern: /^35/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'china_union',
    pattern: /^62/,
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: false,
  },
  {
    type: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true,
  },
  {
    type: 'mastercard',
    pattern: /^5[1-5]/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true,
    image: '/public/images/svg/mc_small.svg',
  },
  {
    type: 'amex',
    pattern: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: [15],
    cvcLength: [3, 4],
    luhn: true,
  },
  {
    type: 'visa',
    pattern: /^4/,
    format: defaultFormat,
    length: [13, 14, 15, 16],
    cvcLength: [3],
    luhn: true,
    image: '/public/images/svg/visa_small.svg',
  },
];

export default class CardTypeElement {
  constructor(el) {
    if (!el) return;
    this.element = el;
    this.img = document.createElement('img');
    this.element.appendChild(this.img);
  }
  __find(number) {
    let i = 0;
    for (; i < types.length; i += 1) {
      if (types[i].pattern.test(String(number))) break;
    }
    return types[i];
  }
  update(number) {
    const config = this.__find(number);
    if (config && config.image) this.img.src = config.image;
  }
}
