(function (window) {'use strict';

  function App (el) {
    this.form = new CardForm(el);
    this.onMessage = this.onMessage.bind(this);
    this.subscribe();
  }

  App.prototype.onMessage = function (event) {
    console.log('app', event, this);
    switch (event.data.action) {
      case 'getToken':
        this.onGetToken(event);
      break;
    }
  }
  App.prototype.subscribe = function () {
    if (window.addEventListener) window.addEventListener("message", this.onMessage);
    else window.attachEvent("onmessage", this.onMessage); // IE8
  }
  App.prototype.unsubscribe = function () {
    if (window.addEventListener) window.removeEventListener("message", this.onMessage);
    else window.detachEvent("onmessage", this.onMessage); // IE8
  }

  App.prototype.onGetToken = function (event) {
    var values = this.form.getValues();
    this.$$request('/tokens', {
      method: 'POST',
      body: {
        type: "card",
        number: values.pan,
        expiration_month: values.expMonth,
        expiration_year: '20' + values.expYear,
        cvv: values.cvv,
      }
    }).then(function (resp) {
      return event.source.postMessage({ action: 'getToken', payload: resp.data }, '*');
    })
  }
  App.prototype.$$request = function (url, options) {
    return fetch('https://tokenizer-api.herokuapp.com' + url, {
      method: options.method,
      headers: Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic REdSc01wWERDajoK',
      }, options.headers),
      body: options.body ? JSON.stringify(options.body) : null,
    }).then(function (payload) {
      return payload.json().then(function (resp) {
        if (payload.status >= 400) {
          return Promise.reject(resp);
        }
        return resp;
      });
    });

  }

  window.app = new App(document.getElementById('root'));

})(window);
