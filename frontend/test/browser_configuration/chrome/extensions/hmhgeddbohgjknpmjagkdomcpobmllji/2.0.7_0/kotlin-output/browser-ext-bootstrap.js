Kotlin.defineModule('browser-ext-bootstrap', ['jb-chrome-ext-api', 'chrome-ext-options', 'browser-ext-platform'], function () {
  'use strict';
  var _ = {
  };
  /** @name _.com_jetbrains_browserConnection_bootstrap */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_bootstrap', function () {
    Object.defineProperty(this, 'main', {value: function (args) {
      chrome.browserAction.disable();
      _.com_jetbrains_browserConnection_bootstrap.loadSettingsAndConnect();
    }});
    function $f0(connectDisposable, it) {
      connectDisposable.disposeTree();
    }
    function $f1(it) {
      _.com_jetbrains_browserConnection_bootstrap.loadSettingsAndConnect();
    }
    function $f2(it) {
      if (!Kotlin.equals(it.host, _.com_jetbrains_browserConnection_bootstrap.lastHost) || !Kotlin.equals(it.port, _.com_jetbrains_browserConnection_bootstrap.lastPort)) {
        _.com_jetbrains_browserConnection_bootstrap.lastHost = it.host;
        _.com_jetbrains_browserConnection_bootstrap.lastPort = it.port;
        _.com_jetbrains_browserConnection_bootstrap.lastAppendSourceUrl = it.appendSourceUrl === null || it.appendSourceUrl === undefined || it.appendSourceUrl;
        var tmp$0;
        (tmp$0 = _.com_jetbrains_browserConnection_bootstrap.connectedDisposable) !== null && tmp$0 !== undefined ? tmp$0.disposeTree() : null;
        var connectDisposable = Kotlin.modules['browser-ext-platform'].org_jetbrains_util.newDisposable();
        _.com_jetbrains_browserConnection_bootstrap.connect(Kotlin.equals(it.host, "localhost") ? "127.0.0.1" : it.host, it.port, connectDisposable, _.com_jetbrains_browserConnection_bootstrap.lastAppendSourceUrl);
        Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.localChanged(chrome.storage, connectDisposable, $f0.bind(null, connectDisposable));
        if (!_.com_jetbrains_browserConnection_bootstrap.localChangedListenerRegistered) {
          _.com_jetbrains_browserConnection_bootstrap.localChangedListenerRegistered = true;
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.localChanged(chrome.storage, undefined, $f1);
        }
      }
      _.com_jetbrains_browserConnection_bootstrap.applyCors(it);
    }
    Object.defineProperty(this, 'loadSettingsAndConnect', {value: function () {
      Kotlin.modules['chrome-ext-options'].com_jetbrains_browserConnection_chrome_options.getSettings($f2.bind(this));
    }});
    function $f3(request) {
      request.abort();
    }
    function $f4(send$ref) {
      send$ref.r();
    }
    function $f5(reconnectTimer) {
      if (reconnectTimer.v !== null && reconnectTimer.v !== undefined) {
        var tmp$0;
        ((tmp$0 = reconnectTimer.v) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).stop();
        reconnectTimer.v = null;
      }
    }
    function $f6(request, reconnectTimer, send$ref, disposable, attemptsCount) {
      request.abort();
      if (reconnectTimer.v === null || reconnectTimer.v === undefined) {
        reconnectTimer.v = Kotlin.modules['browser-ext-platform'].org_jetbrains_util.setTimeout(5000, $f4.bind(null, send$ref));
        disposable.register($f5.bind(null, reconnectTimer));
      }
       else {
        if (attemptsCount.v === 50) {
          var tmp$0;
          ((tmp$0 = reconnectTimer.v) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).delay = 10000;
        }
         else if (attemptsCount.v < 100) {
          attemptsCount.v++;
        }
        var tmp$1;
        ((tmp$1 = reconnectTimer.v) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE()).start();
      }
    }
    function $f7(version, ideLogName) {
      _.com_jetbrains_browserConnection_bootstrap.LOG.info("System " + version + " disconnected from " + ideLogName);
      _.com_jetbrains_browserConnection_bootstrap.lastHost = null;
      _.com_jetbrains_browserConnection_bootstrap.lastPort = null;
      _.com_jetbrains_browserConnection_bootstrap.loadSettingsAndConnect();
    }
    function $f8(version, ideLogName, currentConnectedDisposable) {
      _.com_jetbrains_browserConnection_bootstrap.LOG.info("System " + version + " connected to " + ideLogName);
      currentConnectedDisposable.register($f7.bind(null, version, ideLogName));
    }
    function $f9(buildInfo, host, port, version, ideLogName, currentConnectedDisposable, appendSourceUrl, it) {
      var tmp$0;
      ((tmp$0 = it.contentWindow) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).connect(buildInfo, host, port, $f8.bind(null, version, ideLogName, currentConnectedDisposable), currentConnectedDisposable, appendSourceUrl);
    }
    function $fa(request, reconnectTimer, send$ref, disposable, attemptsCount, url, tryIdea120x, host, port, appendSourceUrl) {
      var scheduleSendAttempt = $f6.bind(this, request, reconnectTimer, send$ref, disposable, attemptsCount);
      try {
        request.open("GET", url.v, false);
        request.send();
      }
      catch (e) {
        scheduleSendAttempt();
        return;
      }
      if (request.status === 200) {
        attemptsCount.v = 0;
        var tmp$0, tmp$1;
        var responseText = (tmp$0 = request.responseText) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
        disposable.disposeTree();
        var currentConnectedDisposable = Kotlin.modules['browser-ext-platform'].org_jetbrains_util.newDisposable();
        _.com_jetbrains_browserConnection_bootstrap.connectedDisposable = currentConnectedDisposable;
        var buildInfo = tryIdea120x.v ? Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.BuildInfo("123.0", null, 0, -1) : JSON.parse(responseText);
        var ideLogName = buildInfo.name + " (" + host + ":" + port + ")";
        if (buildInfo.baselineVersion > 132 || (buildInfo.baselineVersion === 131 && Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(buildInfo, 131, 432)) || (buildInfo.baselineVersion === 132 && Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(buildInfo, 132, 840)))
          tmp$1 = "latest";
        else if (Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(buildInfo, 130, 1620))
          tmp$1 = "1.22";
        else
          tmp$1 = "1.13";
        var version = tmp$1;
        _.com_jetbrains_browserConnection_bootstrap.getFrame(version, ideLogName, $f9.bind(null, buildInfo, host, port, version, ideLogName, currentConnectedDisposable, appendSourceUrl));
      }
       else if (request.status === 404) {
        attemptsCount.v = 0;
        if (tryIdea120x.v) {
          _.com_jetbrains_browserConnection_bootstrap.LOG.info(host + ":" + port + " returns 404, JavaScript Debugger plugin is not installed, skip host");
        }
         else {
          _.com_jetbrains_browserConnection_bootstrap.LOG.info(host + ":" + port + " returns 404, may be it is IntelliJ Idea 12.0.x?");
          url.v = "http://" + host + ":" + port + "/startTime";
          tryIdea120x.v = true;
          scheduleSendAttempt();
        }
      }
       else {
        _.com_jetbrains_browserConnection_bootstrap.LOG.info(host + ":" + port + " returns " + request.status);
        scheduleSendAttempt();
      }
    }
    Object.defineProperty(this, 'connect', {value: function (host, port, disposable, appendSourceUrl) {
      var request = new XMLHttpRequest();
      disposable.register($f3.bind(null, request));
      var url = {v: "http://" + host + ":" + port + "/browserConnection/buildInfo"};
      var attemptsCount = {v: 0};
      var tryIdea120x = {v: false};
      var reconnectTimer = {v: null};
      var send$ref, send = $fa.bind(this, request, reconnectTimer, send$ref = {r: null}, disposable, attemptsCount, url, tryIdea120x, host, port, appendSourceUrl);
      send$ref.r = send;
      send();
    }});
    function $fb(version, callback, it) {
      _.com_jetbrains_browserConnection_bootstrap.systemCache.put(version, it);
      callback(it);
    }
    Object.defineProperty(this, 'getFrame', {value: function (version, ideLogName, callback) {
      var systemId = "systemV" + version;
      var frame = document.getElementById(systemId);
      if (frame === null || frame === undefined) {
        _.com_jetbrains_browserConnection_bootstrap.loadFrame(systemId, version, ideLogName, $fb.bind(null, version, callback));
      }
       else {
        _.com_jetbrains_browserConnection_bootstrap.LOG.info("System " + version + " retrieved from cache for " + ideLogName);
        callback(frame !== null && frame !== undefined ? frame : Kotlin.throwNPE());
      }
    }});
    function $fc(frame, version, ideLogName, callback) {
      (frame !== null && frame !== undefined ? frame : Kotlin.throwNPE()).onload = _.com_jetbrains_browserConnection_bootstrap.emptyFun;
      _.com_jetbrains_browserConnection_bootstrap.LOG.info("System " + version + " loaded for " + ideLogName);
      callback(frame);
    }
    Object.defineProperty(this, 'loadFrame', {value: function (systemId, version, ideLogName, callback) {
      _.com_jetbrains_browserConnection_bootstrap.LOG.info("Ready to load system " + version + " for " + ideLogName);
      var tmp$0;
      var frame = (tmp$0 = document.createElement("iframe")) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
      frame.id = systemId;
      frame.src = version + "/main.html";
      (frame !== null && frame !== undefined ? frame : Kotlin.throwNPE()).onload = $fc.bind(null, frame, version, ideLogName, callback);
      document.body.appendChild(frame);
    }});
    Object.defineProperty(this, 'LOG', {value: Kotlin.modules['browser-ext-platform'].org_jetbrains_logging.getLogger("com.jetbrains.browserConnection.bootstrap")});
    Object.defineProperty(this, 'lastHost', {value: null, writable: true});
    Object.defineProperty(this, 'lastPort', {value: null, writable: true});
    Object.defineProperty(this, 'lastAppendSourceUrl', {value: true, writable: true});
    Object.defineProperty(this, 'localChangedListenerRegistered', {value: false, writable: true});
    Object.defineProperty(this, 'connectedDisposable', {value: null, writable: true});
    Object.defineProperty(this, 'emptyFun', {value: function () {
    }});
    Object.defineProperty(this, 'systemCache', {value: Kotlin.PrimitiveHashMap()});
  }, /** @lends _.com_jetbrains_browserConnection_bootstrap */ {
    System: {value: (function () {
      return Kotlin.createClass(null, null, /** @lends _.com_jetbrains_browserConnection_bootstrap.System.prototype */ {
        connect: {value: function (buildInfo, host, port, connected, disposable, appendSourceUrl) {
        }}
      });
    })()}
  });
  /** @name _.com_jetbrains_browserConnection_bootstrap */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_bootstrap', function () {
    function $f0(requestId, it) {
      var url = Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_asParsedUrl(it.url);
      if (url !== null && url !== undefined) {
        _.com_jetbrains_browserConnection_bootstrap.requestIdToOriginUrl.put(requestId, url.scheme + "://" + url.authority);
      }
    }
    function $f1(it) {
      if (it.tabId !== -1) {
        var requestId = it.requestId;
        chrome.tabs.get(it.tabId, $f0.bind(null, requestId));
      }
    }
    function $f2(it) {
      return _.com_jetbrains_browserConnection_bootstrap.addAllowAnyOrigin(it, it.tabId === -1 ? null : _.com_jetbrains_browserConnection_bootstrap.requestIdToOriginUrl.get(it.requestId));
    }
    function $f3(it) {
      if (it.tabId !== -1) {
        _.com_jetbrains_browserConnection_bootstrap.requestIdToOriginUrl.remove(it.requestId);
      }
    }
    Object.defineProperty(this, 'applyCors', {value: function (settings) {
      var corsUrls = settings.corsUrl;
      if (corsUrls !== null && corsUrls !== undefined) {
        var urlPatterns = corsUrls.split(_.com_jetbrains_browserConnection_bootstrap.corsPatternsSeparator);
        var changed = false;
        var last = _.com_jetbrains_browserConnection_bootstrap.lastCorsUrlPatterns;
        if (last !== null && last !== undefined) {
          if (Kotlin.equals(last, urlPatterns)) {
            return;
          }
          changed = true;
          _.com_jetbrains_browserConnection_bootstrap.lastCorsUrlPatterns = urlPatterns;
          var tmp$0;
          (tmp$0 = _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable) !== null && tmp$0 !== undefined ? tmp$0.disposeTree() : null;
          _.com_jetbrains_browserConnection_bootstrap.requestIdToOriginUrl.clear();
        }
        _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable = Kotlin.modules['browser-ext-platform'].org_jetbrains_util.newDisposable();
        var filter = {urls: urlPatterns, types: ["xmlhttprequest"]};
        Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.beforeSendHeaders(chrome.webRequest, _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable, filter, undefined, $f1);
        Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.headersReceived(chrome.webRequest, _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable, filter, true, $f2);
        var clearRequestToOriginUrlEntry = $f3;
        Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.completed(chrome.webRequest, _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable, filter, clearRequestToOriginUrlEntry);
        Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.errorOccurred(chrome.webRequest, _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable, filter, clearRequestToOriginUrlEntry);
        if (changed) {
          chrome.webRequest.handlerBehaviorChanged();
        }
      }
       else if (_.com_jetbrains_browserConnection_bootstrap.lastCorsUrlPatterns !== null && _.com_jetbrains_browserConnection_bootstrap.lastCorsUrlPatterns !== undefined) {
        _.com_jetbrains_browserConnection_bootstrap.lastCorsUrlPatterns = null;
        var tmp$1;
        (tmp$1 = _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable) !== null && tmp$1 !== undefined ? tmp$1.disposeTree() : null;
        _.com_jetbrains_browserConnection_bootstrap.corsFilterDisposable = null;
        _.com_jetbrains_browserConnection_bootstrap.requestIdToOriginUrl.clear();
        chrome.webRequest.handlerBehaviorChanged();
      }
    }});
    Object.defineProperty(this, 'addAllowAnyOrigin', {value: function (data, requestorUrlWithoutPath) {
      var allowValue = requestorUrlWithoutPath === null || requestorUrlWithoutPath === undefined ? "*" : requestorUrlWithoutPath;
      if (requestorUrlWithoutPath !== null && requestorUrlWithoutPath !== undefined && data.url.indexOf(requestorUrlWithoutPath) === 0 && (data.url.length === requestorUrlWithoutPath.length || data.url.charAt(requestorUrlWithoutPath.length) === '/')) {
        return null;
      }
      var responseHeaders = data.responseHeaders;
      if (responseHeaders === null || responseHeaders === undefined) {
        return {responseHeaders: [{name: "Access-Control-Allow-Origin", value: allowValue}, _.com_jetbrains_browserConnection_bootstrap.allowHeaders, _.com_jetbrains_browserConnection_bootstrap.allowCredentials, _.com_jetbrains_browserConnection_bootstrap.allowMethods, _.com_jetbrains_browserConnection_bootstrap.allowMaxAge]};
      }
      {
        var tmp$0 = Kotlin.arrayIterator(responseHeaders);
        while (tmp$0.hasNext()) {
          var header = tmp$0.next();
          if (Kotlin.equals(header.name, "Access-Control-Allow-Origin")) {
            var tmp$1;
            if (header.value === null || header.value === undefined || (!Kotlin.equals(header.value, "*") && !(((tmp$1 = header.value) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE()).indexOf(allowValue) !== -1))) {
              header.value = allowValue;
              return {responseHeaders: responseHeaders !== null && responseHeaders !== undefined ? responseHeaders : Kotlin.throwNPE()};
            }
             else {
              return null;
            }
          }
        }
      }
      responseHeaders.push({name: "Access-Control-Allow-Origin", value: allowValue});
      responseHeaders.push(_.com_jetbrains_browserConnection_bootstrap.allowCredentials);
      responseHeaders.push(_.com_jetbrains_browserConnection_bootstrap.allowHeaders);
      responseHeaders.push(_.com_jetbrains_browserConnection_bootstrap.allowMethods);
      responseHeaders.push(_.com_jetbrains_browserConnection_bootstrap.allowMaxAge);
      return {responseHeaders: responseHeaders !== null && responseHeaders !== undefined ? responseHeaders : Kotlin.throwNPE()};
    }});
    Object.defineProperty(this, 'corsPatternsSeparator', {value: new RegExp("[" + "\\" + "s,]+")});
    Object.defineProperty(this, 'allowMaxAge', {value: {name: "Access-Control-Max-Age", value: "1998000"}});
    Object.defineProperty(this, 'allowMethods', {value: {name: "Access-Control-Allow-Methods", value: "POST, GET, OPTIONS"}});
    Object.defineProperty(this, 'allowCredentials', {value: {name: "Access-Control-Allow-Credentials", value: "true"}});
    Object.defineProperty(this, 'allowHeaders', {value: {name: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept, Cookie"}});
    Object.defineProperty(this, 'lastCorsUrlPatterns', {value: null, writable: true});
    Object.defineProperty(this, 'corsFilterDisposable', {value: null, writable: true});
    Object.defineProperty(this, 'requestIdToOriginUrl', {value: Kotlin.PrimitiveHashMap()});
  }, /** @lends _.com_jetbrains_browserConnection_bootstrap */ {
  });
  Kotlin.finalize(_);
  _.com_jetbrains_browserConnection_bootstrap.main([]);
  return _;
});

//# sourceMappingURL=browser-ext-bootstrap.js.map