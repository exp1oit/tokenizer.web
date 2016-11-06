(function (window) { 'use strict';

  function InputElement (element) {
    this.dirty = false;
    this.pristine = true;
    this.touched = false;
    this.focused = false;
    this.value = element.value;
    this.element = element;

    var self = this;
    element.addEventListener('keydown', function (e) {
      self.onKeydown(e);
    });
    element.addEventListener('keyup', function (e) {
      self.onKeyup(e);
    });
    element.addEventListener('focus', function (e) {
      self.onFocus(e);
    });
    element.addEventListener('blur', function (e) {
      self.onBlur(e);
    });
  }

  InputElement.prototype.onKeydown = function (e) {
    this.dirty = !!this.element.value;
  }
  InputElement.prototype.onKeyup = function (e) {
    this.value = this.getValue();
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

  function CardInputElement (element, options) {
    InputElement.call(this, element, options)
    var opts = options || {};
    this.name = opts.name;
    this.length = opts.length;
    this.element.setAttribute('name', opts.name || opts.autocomplete);
    this.element.setAttribute('type', 'text');
    this.element.setAttribute('pattern', '\d*');
    this.element.setAttribute('autocomplete', opts.autocomplete);
    this.element.setAttribute('x-autocompletetype', opts.autocomplete);
    this.element.setAttribute('inputmode', 'numeric');
    if (opts.length) {
      this.element.setAttribute('maxlength', opts.length);
      this.element.setAttribute('minlength', opts.length);
    }

  }
  CardInputElement.prototype = InputElement.prototype;
  CardInputElement.prototype.showError = function (text) {
    if (this.touched && this.error) {
      this.error.innerHTML = text;
    }
  }
  CardInputElement.prototype.clearError = function () {
    if (!this.error) return;
    this.error.innerHTML = '';
  }

  function CardInputMaskElement (element, options) {
    InputElement.call(this, element, options);
    this.mask = options.mask;
    this.$mask = new Nebo15Mask.MaskedInput(this.element, this.mask);
  }
  CardInputMaskElement.prototype = InputElement.prototype;

  function getTokenizerElement(root, name) {
    return root.querySelector('[data-tokenizer-element="'+ name +'"]');
  }
  function getTokenizerError(root, name) {
    return root.querySelector('[data-tokenizer-error="'+ name +'"]');
  }

  function CardForm (rootElement) {
    this.root = rootElement;
    this.inputs = {};
    this.inputs.pan = new CardInputMaskElement(getTokenizerElement(rootElement, 'pan'), {
      autocomplete: 'cc-pan',
      name: 'pan',
      length: 16,
      mask: '1111 1111 1111 1111'
    });
    this.inputs.expMonth = new CardInputElement(getTokenizerElement(rootElement, 'expMonth'), {
      autocomplete: 'cc-exp-month',
      name: 'expMonth',
      length: 2,
    });
    this.inputs.expYear = new CardInputElement(getTokenizerElement(rootElement, 'expYear'), {
      autocomplete: 'cc-exp-year',
      name: 'expYear',
      length: 2,
    });
    this.inputs.cvv = new CardInputElement(getTokenizerElement(rootElement, 'cvv'), {
      autocomplete: 'cc-exp-csc',
      name: 'cvv',
      length: 3,
    });

    if (!this.inputs.pan) throw new Error('Undefined `pan` element');
    if (!this.inputs.cvv) throw new Error('Undefined `cvv` element');
    if (!this.inputs.expMonth) throw new Error('Undefined `expMonth` element');
    if (!this.inputs.expYear) throw new Error('Undefined `expYear` element');

    this.errors = {};
    this.errors.pan = getTokenizerError(rootElement, 'pan');
    this.errors.expDate = getTokenizerError(rootElement, 'expDate');
    this.errors.cvv = getTokenizerError(rootElement, 'cvv');

    this.init();
  }

  CardForm.prototype.init = function () {
    [
      this.inputs.pan,
      this.inputs.expMonth,
      this.inputs.expYear,
      this.inputs.cvv
    ].forEach(this.initInput.bind(this));
  };
  CardForm.prototype.initInput = function (input) {
    var self = this;
    input.element.addEventListener('keyup', function (e) {
      self.onInputChange(e, input);
      if (!input.value && event.keyCode == 8) self.focusPrevInput(input);
    });
    input.element.addEventListener('blur', function (e) {
      self.onInputChange(e, input);
    });
  };
  CardForm.prototype.onInputChange = function (e, input) {
    var errors = this.validate(this.getValues()) || {};
    this.showErrors(errors);
    if (String(input.value).length >= input.length && !errors[input.name]) {
      this.focusNextInput(input);
    }
  };
  CardForm.prototype.focusNextInput = function (input) {
    var idx = CardForm.inputOrder.indexOf(input.name);
    if (idx === -1) return;

    var nextInputName = CardForm.inputOrder[idx+1];
    if (!this.inputs[nextInputName]) return;

    this.inputs[nextInputName].element.focus();
  };
  CardForm.prototype.focusPrevInput = function (input) {
    var idx = CardForm.inputOrder.indexOf(input.name);
    if (idx === -1) return;

    var nextInputName = CardForm.inputOrder[idx-1];
    if (!this.inputs[nextInputName]) return;

    this.inputs[nextInputName].element.focus();
  };

  CardForm.prototype.getValues = function () {
    return {
      pan: this.inputs.pan.$mask.model,
      expMonth: this.inputs.expMonth.value,
      expYear: this.inputs.expYear.value,
      cvv: this.inputs.cvv.value,
    };
  }
  CardForm.prototype.validate = function (values) {
    return validate(values, CardForm.validators);
  }
  CardForm.prototype.showErrors = function (errorObj) {
    errorObj = errorObj || {};
    if (errorObj.pan && this.inputs.pan.touched) this.errors.pan.innerHTML = errorObj.pan[0];
    else this.errors.pan.innerHTML = null;
    if (errorObj.cvv && this.inputs.cvv.touched) this.errors.cvv.innerHTML = errorObj.cvv[0];
    else this.errors.cvv.innerHTML = null;
    if (errorObj.expMonth && this.inputs.expMonth.touched) this.errors.expDate.innerHTML = errorObj.expMonth[0];
    else if (errorObj.expYear && this.inputs.expYear.touched) this.errors.expDate.innerHTML = errorObj.expYear[0];
    else this.errors.expDate.innerHTML = null;
  }
  CardForm.inputOrder = ['pan','expMonth','expYear','cvv'];
  CardForm.validators = {
    pan: {
      presence: true,
      length: {
        is: 16
      }
    },
    expMonth: {
      presence: true,
      length: {
        is: 2
      }
    },
    expYear: {
      presence: true,
      length: {
        is: 2
      }
    },
    cvv: {
      presence: true,
      length: {
        is: 3
      }
    },
  }

  // function onGetToken (event) {
  //   console.log('onGetToken', getValues());
  //   return event.source.postMessage({ action: 'getToken', payload: getValues() }, '*');
  // }
  // function listener(event) {
  //   console.log('iframe received::', event);
  //   switch (event.data.action) {
  //     case 'getToken':
  //     onGetToken(event);
  //     break;
  //   }
  // }
  //
  // if (window.addEventListener) {
  //   window.addEventListener("message", listener);
  // } else {
  //   // IE8
  //   window.attachEvent("onmessage", listener);
  // }

  window.CardForm = CardForm;

})(window);
