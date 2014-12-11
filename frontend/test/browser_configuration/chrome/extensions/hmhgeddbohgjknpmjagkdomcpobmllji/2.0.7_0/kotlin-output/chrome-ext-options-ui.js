Kotlin.defineModule('chrome-ext-options-ui', ['jb-chrome-ext-api', 'browser-ext-platform', 'chrome-ext-options'], function () {
  'use strict';
  var _ = {
  };
  /** @name _.com_jetbrains_browserConnection_chrome_options */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome_options', function () {
    function $f0() {
      _.com_jetbrains_browserConnection_chrome_options.saveOptions();
      return false;
    }
    function $f1() {
      _.com_jetbrains_browserConnection_chrome_options.restoreOptions();
      var tmp$0;
      ((tmp$0 = document.getElementById("apply")) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).onclick = $f0;
    }
    Object.defineProperty(this, 'main', {value: function (args) {
      document.addEventListener("DOMContentLoaded", $f1);
    }});
    Object.defineProperty(this, 'getInput', {value: function (id) {
      var tmp$0;
      return (tmp$0 = document.getElementById(id)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
    }});
    Object.defineProperty(this, 'getTextArea', {value: function (id) {
      var tmp$0;
      return (tmp$0 = document.getElementById(id)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
    }});
    Object.defineProperty(this, 'nullifyValue', {value: function (id, nullValue) {
      var value = _.com_jetbrains_browserConnection_chrome_options.getInput(id).value;
      var tmp$0;
      return (tmp$0 = _.com_jetbrains_browserConnection_chrome_options.nullify(value, nullValue)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
    }});
    Object.defineProperty(this, 'nullify', {value: function (value, nullValue) {
      var trimmed = value.trim();
      return trimmed.length === 0 ? nullValue : trimmed;
    }});
    Object.defineProperty(this, 'saveOptions', {value: function () {
      chrome.storage.local.set(Kotlin.modules['chrome-ext-options'].com_jetbrains_browserConnection_chrome_options.Settings(_.com_jetbrains_browserConnection_chrome_options.nullifyValue("host", Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DEFAULT_JB_HOST), _.com_jetbrains_browserConnection_chrome_options.nullifyValue("port", Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DEFAULT_JB_PORT), _.com_jetbrains_browserConnection_chrome_options.nullify(_.com_jetbrains_browserConnection_chrome_options.getTextArea("corsUrls").value, null), _.com_jetbrains_browserConnection_chrome_options.getInput("appendSourceUrl").checked));
    }});
    function $f2(it) {
      var tmp$0, tmp$1, tmp$2, tmp$3;
      _.com_jetbrains_browserConnection_chrome_options.getInput("host").value = (tmp$0 = it !== null && it !== undefined ? it.host : null) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DEFAULT_JB_HOST;
      _.com_jetbrains_browserConnection_chrome_options.getInput("port").value = (tmp$1 = it !== null && it !== undefined ? it.port : null) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DEFAULT_JB_PORT;
      _.com_jetbrains_browserConnection_chrome_options.getTextArea("corsUrls").value = (tmp$2 = it !== null && it !== undefined ? it.corsUrl : null) !== null && tmp$2 !== undefined ? tmp$2 : '';
      _.com_jetbrains_browserConnection_chrome_options.getInput("appendSourceUrl").checked = (tmp$3 = it !== null && it !== undefined ? it.appendSourceUrl : null) !== null && tmp$3 !== undefined ? tmp$3 : true;
    }
    Object.defineProperty(this, 'restoreOptions', {value: function () {
      Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.get(chrome.storage.local, undefined, $f2.bind(this));
    }});
  }, /** @lends _.com_jetbrains_browserConnection_chrome_options */ {
  });
  Kotlin.finalize(_);
  _.com_jetbrains_browserConnection_chrome_options.main([]);
  return _;
});

//# sourceMappingURL=chrome-ext-options-ui.js.map