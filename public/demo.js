(function () {'use strict';

  var preview = document.getElementById('preview');
  window.addEventListener('message', function (e) {
    switch (e.data.action) {
      case 'getToken':
        preview.innerHTML = JSON.stringify(e.data.payload, null, 4);
      break;
    }
  })
  
  window.sendToken = function () {
    window.frames.card_frame.postMessage({ action: 'getToken' }, location.origin)
  }
})();
