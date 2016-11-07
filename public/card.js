(function (window) { 'use strict';

  var KEYS = {
    backspace: 8,
  };

  function isNumber(e) {
    var keyCode = e.which || e.keyCode;
    return keyCode >= 48 && keyCode <= 57;
  }

  function validateCardNumber(value) {
    // accept only digits, dashes or spaces
  	if (/[^0-9-\s]+/.test(value)) return false;

  	// The Luhn Algorithm. It's so pretty.
  	var nCheck = 0, nDigit = 0, bEven = false;
  	value = value.replace(/\D/g, "");

  	for (var n = value.length - 1; n >= 0; n--) {
  		var cDigit = value.charAt(n),
  			  nDigit = parseInt(cDigit, 10);

  		if (bEven) {
  			if ((nDigit *= 2) > 9) nDigit -= 9;
  		}

  		nCheck += nDigit;
  		bEven = !bEven;
  	}

  	return (nCheck % 10) == 0;
  }

  validate.validators.cardNumber = function(value, options, key, attributes) {
    return validateCardNumber(value) ? null : 'invalid card number';
  };

  // InputElement

  function InputElement (element) {
    this.dirty = false;
    this.pristine = true;
    this.touched = false;
    this.focused = false;
    this.__value = element.value;
    this.element = element;

    this.onKeydown = this.onKeydown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    element.addEventListener('keydown', this.onKeydown);
    element.addEventListener('focus', this.onFocus);
    element.addEventListener('blur', this.onBlur);
  }

  InputElement.prototype.onKeydown = function (e) {
    this.dirty = !!this.getValue();
  }
  InputElement.prototype.onFocus = function (e) {
    this.focused = true;
  }
  InputElement.prototype.onBlur = function (e) {
    this.focused = false;
    this.touched = true;
  }
  InputElement.prototype.getValue = function () {
    return this.element.value;
  }
  InputElement.prototype.destroy = function () {
    this.element.removeEventListener('keydown', this.onKeydown);
    this.element.removeEventListener('keyup', this.onKeyup);
    this.element.removeEventListener('focus', this.onFocus);
    this.element.removeEventListener('blur', this.onBlur);
  }

  InputElement.prototype.focus = function () {
    this.element.focus();
  }
  InputElement.prototype.select = function () {
    this.element.select();
  }
  InputElement.prototype.getSelection = function () {
    var start, end, rangeEl, clone;

    if (this.element.selectionStart !== undefined) {
      start = this.element.selectionStart;
      end = this.element.selectionEnd;
    } else {
      try {
        this.element.focus();
        rangeEl = this.element.createTextRange();
        clone = rangeEl.duplicate();

        rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
        clone.setEndPoint('EndToStart', rangeEl);

        start = clone.text.length;
        end = start + rangeEl.text.length;
      } catch (e) { /* not focused or not visible */ }
    }

    return { start, end };
  }
  InputElement.prototype.isCursorInTheEnd = function () {
    var selection = this.getSelection();
    return selection.start == selection.end && selection.start == this.element.value.length;
  }

  // MaskedInputElement

  function MaskedInputElement (element, options) {
    InputElement.call(this, element, options);
    this.__mask = new Nebo15Mask.MaskedInput(this.element, options.mask);
  }
  MaskedInputElement.prototype = InputElement.prototype;
  MaskedInputElement.prototype.getValue = function () {
    return this.__mask.model;
  };

  // CardInputElement

  function CardInputElement (element, options) {
    MaskedInputElement.call(this, element, options);
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
  CardInputElement.prototype = MaskedInputElement.prototype;

  function CardPanElement (element, error) {
    CardInputElement.call(this, element, {
      autocomplete: 'cc-pan',
      name: 'pan',
      length: 16,
      mask: '1111 1111 1111 1111',
      error: error,
    });
  }
  CardPanElement.prototype = CardInputElement.prototype;

  function CardExpMonthElement (element, error) {
    CardInputElement.call(this, element, {
      autocomplete: 'cc-exp-month',
      name: 'expMonth',
      length: 2,
      mask: '11',
    });
  }
  CardExpMonthElement.prototype = CardInputElement.prototype;

  function CardExpYearElement (element, error) {
    CardInputElement.call(this, element, {
      autocomplete: 'cc-exp-year',
      name: 'expYear',
      length: 2,
      mask: '11',
    });
  }
  CardExpYearElement.prototype = CardInputElement.prototype;

  function CardCscElement (element, error) {
    CardInputElement.call(this, element, {
      autocomplete: 'cc-exp-csc',
      name: 'cvv',
      length: 3,
      mask: '111',
    });
  }
  CardCscElement.prototype = CardInputElement.prototype;

  function ErrorElement(element) {
    this.__element = element;
  }
  ErrorElement.prototype.show = function (errors) {
    if (!this.__element) return false;
    var arr = [].concat(errors);
    this.__element.innerHTML = arr[0];
    return true;
  }
  ErrorElement.prototype.clear = function () {
    if (!this.__element) return false;
    this.__element.innerHTML = '';
    return true;
  }

  function getTokenizerElement(root, name) {
    return root.querySelector('[data-tokenizer-element="'+ name +'"]');
  }
  function getTokenizerError(root, name) {
    return root.querySelector('[data-tokenizer-error="'+ name +'"]');
  }

  function CardForm (rootElement) {
    this.root = rootElement;
    this.inputs = {};
    this.inputs.pan = new CardPanElement(getTokenizerElement(rootElement, 'pan'));
    this.inputs.expMonth = new CardExpMonthElement(getTokenizerElement(rootElement, 'expMonth'));
    this.inputs.expYear = new CardExpYearElement(getTokenizerElement(rootElement, 'expYear'));
    this.inputs.cvv = new CardCscElement(getTokenizerElement(rootElement, 'cvv'));

    if (!this.inputs.pan) throw new Error('Undefined `pan` element');
    if (!this.inputs.cvv) throw new Error('Undefined `cvv` element');
    if (!this.inputs.expMonth) throw new Error('Undefined `expMonth` element');
    if (!this.inputs.expYear) throw new Error('Undefined `expYear` element');

    this.errors = {};
    this.errors.pan = new ErrorElement(getTokenizerError(rootElement, 'pan'));
    this.errors.expDate = new ErrorElement(getTokenizerError(rootElement, 'expDate'));
    this.errors.cvv = new ErrorElement(getTokenizerError(rootElement, 'cvv'));

    this.init();
  }
  CardForm.prototype.init = function () {
    var self = this;

    this.onInputChange = this.onInputChange.bind(this);
    Object.keys(this.inputs).forEach(function (key) {
      self.inputs[key].element.addEventListener('keyup', function (e) {
        self.onInputChange(self.inputs[key], e);
      });
    });
  };

  CardForm.prototype.onInputChange = function (input, e) {
    var keyCode = e.which || e.keyCode;
    if (e.ctrlKey || e.altKey || e.metaKey ||
      (keyCode > 90 || keyCode < 46 && [KEYS.backspace].indexOf(keyCode) === -1)
    ) return false;

    var errors = this.validate(this.getValues()) || {};
    var value = input.getValue();
    var selection = input.getSelection();
    this.showErrors(errors);

    if (keyCode == KEYS.backspace) {
      if (!value.length) return this.focusPrevInput(input);
      return true;
    }
    if (value.length === input.length && !errors[input.name] && input.isCursorInTheEnd()) this.focusNextInput(input);
  };
  CardForm.prototype.focusNextInput = function (input) {
    var idx = CardForm.inputOrder.indexOf(input.name);
    if (idx === -1) return;

    var nextInputName = CardForm.inputOrder[idx+1];
    if (!this.inputs[nextInputName]) return;

    this.inputs[nextInputName].focus();
  };
  CardForm.prototype.focusPrevInput = function (input) {
    var idx = CardForm.inputOrder.indexOf(input.name);
    if (idx === -1) return;

    var nextInputName = CardForm.inputOrder[idx-1];
    if (!this.inputs[nextInputName]) return;

    this.inputs[nextInputName].focus();
    this.inputs[nextInputName].select();
  };

  CardForm.prototype.getValues = function () {
    return {
      pan: this.inputs.pan.getValue(),
      expMonth: this.inputs.expMonth.getValue(),
      expYear: this.inputs.expYear.getValue(),
      cvv: this.inputs.cvv.getValue(),
    };
  }
  CardForm.prototype.validate = function (values) {
    return validate(values, CardForm.validators, { fullMessages: false });
  }
  CardForm.prototype.showErrors = function (errorObj) {
    errorObj = errorObj || {};
    var self = this;
    Object.keys(CardForm.mapErrorsToInputs).forEach(function (errorKey) {
      CardForm.mapErrorsToInputs[errorKey].reduce(function (added, inputKey) {
        if (added) return added;
        if (errorObj[inputKey]) {
          self.errors[errorKey].show(errorObj[inputKey]);
          return true;
        } else {
          self.errors[errorKey].clear();
        }
        return added;
      }, false);
    })
  }

  CardForm.inputOrder = ['pan','expMonth','expYear','cvv'];
  CardForm.mapErrorsToInputs = {
    'expDate': ['expMonth', 'expYear'],
    'pan': ['pan'],
    'cvv': ['cvv'],
  };
  CardForm.validators = {
    pan: {
      presence: {
        message: 'is required',
      },
      length: {
        is: 16,
        wrongLength: 'need to have %{count} digits',
      },
      cardNumber: true
    },
    expMonth: {
      presence: true,
      length: {
        is: 2
      },
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 12,
      }
    },
    expYear: {
      presence: true,
      length: {
        is: 2
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: Number(String((new Date()).getFullYear()).slice(-2))
      }
    },
    cvv: {
      presence: true,
      length: {
        is: 3
      }
    },
  };

  window.CardForm = CardForm;

})(window);
