Kotlin.defineModule('chrome-ext-options', ['jb-chrome-ext-api', 'browser-ext-platform'], function () {
  'use strict';
  var _ = {
  };
  /** @name _.com_jetbrains_browserConnection_chrome_options */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome_options', function () {
    function $f0(callback, it) {
      callback(it !== null && it !== undefined ? it : _.com_jetbrains_browserConnection_chrome_options.Settings(Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DEFAULT_JB_HOST, Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DEFAULT_JB_PORT, null));
    }
    Object.defineProperty(this, 'getSettings', {value: function (callback) {
      Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.get(chrome.storage.local, undefined, $f0.bind(null, callback));
    }});
  }, /** @lends _.com_jetbrains_browserConnection_chrome_options */ {
    Settings: {value: (function () {
      return Kotlin.createClass(null, function (host, port, corsUrl) {
        Object.defineProperty(this, 'host', {value: host, enumerable: true});
        Object.defineProperty(this, 'port', {value: port, enumerable: true});
        Object.defineProperty(this, 'corsUrl', {value: corsUrl, enumerable: true});
      });
    })()}
  });
  Kotlin.finalize(_);
  return _;
});

//# sourceMappingURL=chrome-ext-options.js.map