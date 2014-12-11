Kotlin.defineModule('chrome-ext', ['browser-ext-platform', 'jb-chrome-ext-api', 'chrome-ext-options'], function () {
  'use strict';
  var _ = {
  };
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', function () {
    function $f0(it) {
      it.disconnect();
    }
    function $f1() {
      chrome.browserAction.disable();
      chrome.browserAction.setTitle({title: "Not connected"});
    }
    function $f2(disposable, it, connected, buildInfo) {
      try {
        disposable.register($f0.bind(null, it));
        connected();
      }
      finally {
        chrome.browserAction.enable();
        chrome.browserAction.setTitle({title: "Connected to " + buildInfo.name});
        disposable.register($f1);
      }
    }
    function $f3(pageManager, disposable) {
      try {
        if (pageManager.v !== null && pageManager.v !== undefined) {
          var tmp$0;
          ((tmp$0 = pageManager.v) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).disposeTree();
          pageManager.v = null;
        }
      }
      finally {
        disposable.disposeTree();
      }
    }
    function $f4(disposable, connected, buildInfo, pageManager, it) {
      it.opened = $f2.bind(this, disposable, it, connected, buildInfo);
      it.closed = $f3.bind(null, pageManager, disposable);
    }
    function $f5(pageManager, buildInfo, host, port, it) {
      pageManager.v = _.com_jetbrains_browserConnection_chrome.ChromePageManager(buildInfo, it);
      var tmp$0, tmp$1;
      Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.registerDomService((tmp$0 = pageManager.v) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), it);
      it.registerDomain("Debugger", _.com_jetbrains_browserConnection_chrome.ChromeDebugService((tmp$1 = pageManager.v) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE(), it, host, port));
    }
    Object.defineProperty(this, 'connect', {value: function (buildInfo, host, port, connected, disposable) {
      var pageManager = {v: null};
      Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.connect(chrome.app.getDetails().version, window.navigator.userAgent.indexOf("(Dart)") !== -1 ? "DARTIUM" : "CHROME", host, port, $f4.bind(this, disposable, connected, buildInfo, pageManager), $f5.bind(null, pageManager, buildInfo, host, port), -1);
    }});
    Object.defineProperty(this, 'LOG', {value: Kotlin.modules['browser-ext-platform'].org_jetbrains_logging.getLogger("com.jetbrains.browserConnection.chrome")});
    Object.defineProperty(this, 'wfoiqwefqw', {value: [Kotlin.createObject(null, function () {
      Object.defineProperty(this, 'color', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'label', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'xaxis', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'yaxis', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'clickable', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'hoverable', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'shadowSize', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'highlightColor', {value: null, writable: true, enumerable: true});
      Object.defineProperty(this, 'data', {value: [''], writable: true, enumerable: true});
    })], writable: true});
  }, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    InitDevToolMessage: {value: (function () {
      return Kotlin.createClass(null, function (tabId) {
        Object.defineProperty(this, 'tabId', {value: tabId});
      });
    })()},
    WebKitDebugEventRouter: {value: (function () {
      return Kotlin.createClass(null, function (rpcServer, buildInfo) {
        Object.defineProperty(this, 'rpcServer', {value: rpcServer});
        Object.defineProperty(this, 'buildInfo', {value: buildInfo});
      }, /** @lends _.com_jetbrains_browserConnection_chrome.WebKitDebugEventRouter.prototype */ {
        sourceMapFound: {value: function (tabId, scriptId, sourceMapUrl, sourceMapData) {
          this.rpcServer.send("Debugger", "sourceMapFound", tabId.toString() + ", " + "\"" + scriptId + "\"" + ", " + JSON.stringify(sourceMapUrl) + ", " + JSON.stringify(sourceMapData));
        }}
      });
    })()},
    EventHandlers: {value: (function () {
      return Kotlin.createClass(null, function () {
        Object.defineProperty(this, 'methodToHandler', {value: Kotlin.PrimitiveHashMap()});
      }, /** @lends _.com_jetbrains_browserConnection_chrome.EventHandlers.prototype */ {
        add: {value: function (method, handler) {
          this.add$0(method, handler !== null && handler !== undefined ? handler : Kotlin.throwNPE());
        }},
        add$0: {value: function (method, handler) {
          this.methodToHandler.put(method, handler);
        }},
        get: {value: function (method) {
          return this.methodToHandler.get(method);
        }}
      });
    })()}
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    ChromeDebugService: {get: function () {
      var r = (function () {
        function $f0(tabId, command) {
          var tmp$0;
          this.sendError(tabId, command, (tmp$0 = chrome.runtime.lastError) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE());
        }
        function $f1(tabId, command, done) {
          try {
            this.sendResult(tabId, command, undefined);
          }
          finally {
            done();
          }
        }
        function $f2(domainToEnable, tabId, command, done) {
          domainToEnable.enable($f0.bind(this, tabId, command), $f1.bind(this, tabId, command, done));
        }
        function $f3(tabId, command, it) {
          this.handleChromeCommandResult(tabId, command, it);
        }
        function $f4(tabId, command, done, it) {
          try {
            this.handleChromeCommandResult(tabId, command, it);
          }
          finally {
            done();
          }
        }
        function $f5(command, dom, tabId, done) {
          _.com_jetbrains_browserConnection_chrome.LOG.debug(["DC " + command.method]);
          chrome.debugger.sendCommand(dom.debuggee, command.method, command.params, $f4.bind(this, tabId, command, done));
        }
        function $f6(task, tabId, it) {
          var doneAsync = false;
          try {
            doneAsync = task(this.pageManager.getDom(tabId), it);
          }
          finally {
            if (!doneAsync) {
              it();
            }
          }
        }
        function $f7(done) {
          done();
        }
        function $f8(dom, done) {
          dom.console.enable(undefined, $f7.bind(null, done));
          return true;
        }
        function $f9(it) {
          return this.transformToDataUriWithAppendedSourceUrl(it);
        }
        function $fa() {
          chrome.webRequest.handlerBehaviorChanged();
        }
        function $fb(done, it) {
          done();
        }
        function $fc(enablePageNotifications, tabId, url, dom, done) {
          if (enablePageNotifications) {
            dom.externalEventEnabled = true;
            if (Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(this.pageManager.buildInfo, 130, 614)) {
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.beforeRequested(chrome.webRequest, dom, {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId}, true, $f9.bind(this));
              dom.register($fa);
            }
          }
          chrome.tabs.update(tabId, {url: url, active: true}, $fb.bind(null, done));
          return true;
        }
        function $fd(request, result, error) {
          if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200 || request.status === 0) {
              var tmp$0, tmp$1, tmp$2;
              result([(tmp$0 = request.responseText) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), (tmp$1 = request.getResponseHeader("content-type")) !== null && tmp$1 !== undefined ? tmp$1 : "application/javascript", (tmp$2 = request.getResponseHeader("SourceMap")) !== null && tmp$2 !== undefined ? tmp$2 : request.getResponseHeader("X-SourceMap")]);
            }
             else {
              error(request.statusText);
            }
          }
        }
        function $fe(dom, done) {
          this.pageManager.detachDebugger(dom, done);
          return true;
        }
        return Kotlin.createClass(Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.DebuggerService, function $fun(pageManager, rpcServer, host, port) {
          $fun.baseInitializer.call(this, pageManager);
          Object.defineProperty(this, 'rpcServer', {value: rpcServer});
          Object.defineProperty(this, 'host', {value: host});
          Object.defineProperty(this, 'port', {value: port});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.ChromeDebugService.prototype */ {
          sendError: {value: function (tabId, command, error) {
            this.rpcServer.send("Debugger", "handleError", tabId.toString() + ", " + command.id + ", " + JSON.stringify(error.message));
          }},
          sendResult: {value: function (tabId, command, result) {
            if (result === undefined)
              result = null;
            var message = tabId.toString() + ", " + command.id;
            if (result !== null && result !== undefined) {
              message += ", " + JSON.stringify(result);
            }
            this.rpcServer.send("Debugger", "handleResult", message);
          }},
          sendCommand: {value: function (tabId, command) {
            var dom = this.pageManager.getDom(tabId);
            var tmp$0 = command.method, tmp$1;
            if (tmp$0 === "Debugger.enable")
              tmp$1 = dom.debugger;
            else if (tmp$0 === "Page.enable")
              tmp$1 = dom.page;
            else if (tmp$0 === "Console.enable")
              tmp$1 = dom.console;
            else
              tmp$1 = null;
            var domainToEnable = tmp$1;
            if (domainToEnable !== null && domainToEnable !== undefined) {
              this.queueProcessor.add($f2.bind(this, domainToEnable, tabId, command));
            }
             else if (!Kotlin.equals(command.method, "DOM.getDocument") && (command.method.indexOf("DOM.") === 0 || command.method.indexOf("Runtime.") === 0)) {
              chrome.debugger.sendCommand(dom.debuggee, command.method, command.params, $f3.bind(this, tabId, command));
            }
             else {
              this.queueProcessor.add($f5.bind(this, command, dom, tabId));
            }
          }, writable: true},
          handleChromeCommandResult: {value: function (tabId, command, result) {
            var lastError = chrome.runtime.lastError;
            if (lastError === null || lastError === undefined) {
              if (result !== null && result !== undefined && Kotlin.equals(command.method, "DOM.getDocument")) {
                var dom = this.pageManager.findDom(tabId);
                if (dom !== null && dom !== undefined) {
                  dom.documentNodeId = (result !== null && result !== undefined ? result : Kotlin.throwNPE())["root"].nodeId;
                }
              }
              this.sendResult(tabId, command, result);
            }
             else {
              this.sendError(tabId, command, lastError);
              _.com_jetbrains_browserConnection_chrome.LOG.error("Error while " + command.method + ": " + lastError.message);
            }
          }},
          queue: {value: function (tabId, task) {
            this.queueProcessor.add($f6.bind(this, task, tabId));
          }},
          enableConsole: {value: function (tabId) {
            this.queue(tabId, $f8.bind(this));
          }},
          navigate: {value: function (tabId, url, enablePageNotifications) {
            if (enablePageNotifications === undefined)
              enablePageNotifications = false;
            this.queue(tabId, $fc.bind(this, enablePageNotifications, tabId, url));
          }},
          loadData: {value: function (tabId, url, result, error) {
            var request = new XMLHttpRequest();
            request.open("GET", url);
            request.onreadystatechange = $fd.bind(null, request, result, error);
            request.send();
          }},
          transformToDataUriWithAppendedSourceUrl: {value: function (it) {
            if (!(!Kotlin.equals(it.method, "GET") || !Kotlin.equals(it.method, "get"))) {
              return null;
            }
            var url = Kotlin.modules['browser-ext-platform'].org_jetbrains_io.trimQueryOrFragment(it.url);
            if (!(url.indexOf(".js", url.length - ".js".length) !== -1 || url.indexOf(".dart", url.length - ".dart".length) !== -1) || url.indexOf(".map.js", url.length - ".map.js".length) !== -1) {
              return null;
            }
            var tmp$0, tmp$1;
            var tabUrl = (tmp$1 = (tmp$0 = this.pageManager.findDom(it.tabId)) !== null && tmp$0 !== undefined ? tmp$0.tabUrl : null) !== null && tmp$1 !== undefined ? Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_asParsedUrl(tmp$1) : null;
            if (tabUrl === null || tabUrl === undefined) {
              return null;
            }
            if (Kotlin.equals(tabUrl.port, this.port)) {
              return {redirectUrl: "http://" + Kotlin.stringify(tabUrl.authority) + "/__corsProxy__/" + it.tabId + "/" + window.btoa(it.url)};
            }
            return null;
          }},
          detach: {value: function (tabId) {
            var dom = this.pageManager.getDom(tabId);
            dom.externalEventEnabled = false;
            dom.externalUsed = false;
            if (dom.detachIsAllowed) {
              this.queue(tabId, $fe.bind(this));
            }
          }}
        });
      })();
      Object.defineProperty(this, 'ChromeDebugService', r);
      return r;
    }}
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    ChromePageManager: {get: function () {
      var r = (function () {
        function $f0(message, it) {
          this.devToolInspectedTabs.remove(message.tabId);
        }
        function $f1(port, message) {
          this.devToolInspectedTabs.put(message.tabId, _.com_jetbrains_browserConnection_chrome.DevToolsBackedDom(port));
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.disconnected(port, undefined, $f0.bind(this, message));
        }
        function $f2(it) {
          var tmp$0;
          return !Kotlin.equals(it.getResponseHeader("Content-Type"), "text/html") && (it.responseText !== null && it.responseText !== undefined) && !(((tmp$0 = it.responseText) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).length === 0);
        }
        function $f3(tabId, data, url, it) {
          this.webKitDebugEventRouter.sourceMapFound(tabId, data.scriptId, url, it);
        }
        function $f4(tabId, data, url) {
          if (Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_isInLocalFileSystem(url) || Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_isDataUri(url)) {
            this.webKitDebugEventRouter.sourceMapFound(tabId, data.scriptId, url, null);
          }
           else {
            Kotlin.modules['browser-ext-platform'].org_jetbrains_io.loadResource$0(url, undefined, $f2, undefined, $f3.bind(this, tabId, data, url));
          }
        }
        function $f5(callFrames, it) {
          var callFrame = callFrames[it];
          return [callFrame.url, callFrame.lineNumber - 1, callFrame.columnNumber, callFrame.functionName];
        }
        function $f6(processor, postponed, it) {
          for (var tmp$1 = 0, tmp$0 = it.length; tmp$1 !== tmp$0; tmp$1++) {
            var index = it[tmp$1];
            processor(Kotlin.arrayGet(postponed, index));
          }
        }
        function $f7(processor, projectId, it) {
          var postponed = [];
          var hostAndPathPairs = [];
          {
            var tmp$0 = it;
            while (tmp$0.hasNext()) {
              var tab = tmp$0.next();
              var parsedUrl = Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_asParsedUrl(tab.url);
              if (parsedUrl === null || parsedUrl === undefined) {
                _.com_jetbrains_browserConnection_chrome.LOG.debug(["Cannot parse tab url " + tab + ".url"]);
                continue;
              }
              var tmp$1 = Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.isInspectableBackedByPattern(parsedUrl.scheme, parsedUrl.host);
              if (tmp$1 === Kotlin.modules['browser-ext-platform'].org_jetbrains_util.ThreeState.NO) {
              }
               else if (tmp$1 === Kotlin.modules['browser-ext-platform'].org_jetbrains_util.ThreeState.UNSURE) {
                postponed.push(tab);
                hostAndPathPairs.push(parsedUrl.host);
                hostAndPathPairs.push(Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.normalizeTabUriPath(parsedUrl.path));
              }
               else if (tmp$1 === Kotlin.modules['browser-ext-platform'].org_jetbrains_util.ThreeState.YES)
                processor(tab);
              else
                throw Kotlin.newException(null, 'Exception');
            }
          }
          if (!(postponed.length === 0)) {
            this.filterInspectable(projectId, hostAndPathPairs, $f6.bind(null, processor, postponed));
          }
        }
        function $f8(callback, dom, tabId, errorCallback) {
          var tmp$0;
          var lastError = (tmp$0 = chrome.runtime.lastError) !== null && tmp$0 !== undefined ? tmp$0.message : null;
          if (lastError === null || lastError === undefined) {
            callback(dom);
          }
           else {
            this.attachedTabs.remove(tabId);
            _.com_jetbrains_browserConnection_chrome.LOG.error(lastError);
            if (errorCallback !== null && errorCallback !== undefined) {
              errorCallback(lastError);
            }
          }
        }
        function $f9(url, urlToOpen, focusWindow, errorCallback, callback, it) {
          var candidate = null;
          var newTab = null;
          var existingTab = null;
          {
            var tmp$0 = it;
            while (tmp$0.hasNext()) {
              var tab = tmp$0.next();
              if (!Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.compareUrls(tab.url, url)) {
                if ((newTab === null || newTab === undefined) && Kotlin.equals(tab.url, "chrome://newtab/")) {
                  newTab = tab;
                }
                continue;
              }
              if (this.devToolInspectedTabs.containsKey(tab.id)) {
                continue;
              }
              if (this.attachedTabs.isEmpty()) {
                existingTab = tab;
                break;
              }
              var dom = this.attachedTabs.get(tab.id);
              if (dom !== null && dom !== undefined) {
                if (dom.externalUsed) {
                  continue;
                }
                 else {
                  existingTab = tab;
                  break;
                }
              }
              if (candidate === null || candidate === undefined) {
                candidate = tab;
              }
            }
          }
          if (existingTab === null || existingTab === undefined) {
            _.com_jetbrains_browserConnection_chrome.LOG.debug([url + ": existing attached tab not found, candidate " + (candidate === null || candidate === undefined ? "not exists" : "exists")]);
            existingTab = candidate;
          }
           else {
            _.com_jetbrains_browserConnection_chrome.LOG.debug([url + ": existing attached tab found, old url: " + (existingTab !== null && existingTab !== undefined ? existingTab : Kotlin.throwNPE()).url]);
          }
          this.tabService.load(url, urlToOpen, existingTab, newTab, focusWindow, errorCallback, callback);
        }
        function $fa(tab, externalEventEnabled, callback, it) {
          it.tabUrl = tab.url;
          it.detachIsAllowed = true;
          this.setExternalUsedDomState(it, externalEventEnabled);
          _.com_jetbrains_browserConnection_chrome.LOG.debug(["attachDebugger: attached to " + tab.id]);
          callback(tab.id);
        }
        function $fb(dom, callback) {
          _.com_jetbrains_browserConnection_chrome.LOG.debug(["attempt to detachDebugger"]);
          chrome.debugger.detach(dom.debuggee, callback);
        }
        return Kotlin.createClass([Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.PageManager, Kotlin.modules['browser-ext-platform'].org_jetbrains_util.Disposable], function $fun(buildInfo, rpcServer) {
          $fun.baseInitializer.call(this, _.com_jetbrains_browserConnection_chrome.ChromeTabService(), rpcServer);
          Object.defineProperty(this, 'buildInfo', {value: buildInfo});
          Object.defineProperty(this, 'attachedTabs', {value: Kotlin.PrimitiveHashMap()});
          Object.defineProperty(this, 'devToolInspectedTabs', {value: Kotlin.PrimitiveHashMap()});
          Object.defineProperty(this, 'webKitDebugEventRouter', {value: _.com_jetbrains_browserConnection_chrome.WebKitDebugEventRouter(rpcServer, this.buildInfo)});
          {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.updated(chrome.tabs, this, Kotlin.assignOwner(function $fun(tabId, changeInfo, tab) {
              var newUrl = changeInfo.url;
              if (newUrl !== null && newUrl !== undefined) {
                var dom = $fun.o.attachedTabs.get(tabId);
                if (dom !== null && dom !== undefined) {
                  dom.tabUrl = changeInfo.url;
                  if (!dom.externalUsed && !Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_isDataUri(newUrl)) {
                    var tmp$0;
                    var parsedUrl = (tmp$0 = Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_asParsedUrl(newUrl)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
                    if (Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.isInspectableBackedByPattern(parsedUrl.scheme, parsedUrl.host) === Kotlin.modules['browser-ext-platform'].org_jetbrains_util.ThreeState.NO) {
                      _.com_jetbrains_browserConnection_chrome.LOG.info("detach tab " + dom.debuggee + ", new url " + Kotlin.stringify(newUrl) + " is not inspectable");
                      $fun.o.detachDebugger(dom, undefined);
                    }
                  }
                }
              }
            }, this));
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.removed(chrome.tabs, this, Kotlin.assignOwner(function $fun(tabId, removeInfo) {
              $fun.o.devToolInspectedTabs.remove(tabId);
            }, this));
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.detached(chrome.debugger, this, Kotlin.assignOwner(function $fun(debuggee, reason) {
              var dom = $fun.o.removeAndDisposeDom(debuggee);
              _.com_jetbrains_browserConnection_chrome.LOG.info("tab detached " + debuggee.tabId + ", reason " + Kotlin.stringify(reason) + ", dom " + (dom !== null && dom !== undefined ? "exists and externalUsed " + dom.externalUsed : "not exists"));
              if (dom !== null && dom !== undefined && dom.externalUsed) {
                rpcServer.send("Debugger", "detached", debuggee.tabId.toString());
              }
            }, this));
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.connected(chrome.runtime, this, Kotlin.assignOwner(function $fun(port) {
              _.com_jetbrains_browserConnection_chrome.LOG.debug(["connected from devtools page", port]);
              if (port.sender.tab !== null && port.sender.tab !== undefined) {
                Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.message(port, undefined, $f1.bind($fun.o, port));
              }
            }, this));
            var debuggerEventHandlers = _.com_jetbrains_browserConnection_chrome.EventHandlers();
            if (this.buildInfo.baselineVersion < 133 && (this.buildInfo.baselineVersion === 131 ? !Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(this.buildInfo, 131, 350) : !Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(this.buildInfo, 132, 669))) {
              debuggerEventHandlers.add(Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.SCRIPT_PARSED, Kotlin.assignOwner(function $fun(data, dom, tabId) {
                if (!Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_isDataUri(data.url)) {
                  var loadSourceMap = $f4.bind($fun.o, tabId, data);
                  if (data.sourceMapURL === null || data.sourceMapURL === undefined) {
                    var tmp$0;
                    var path = data.isContentScript !== null && data.isContentScript !== undefined && ((tmp$0 = data.isContentScript) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()) ? null : Kotlin.modules['browser-ext-platform'].org_jetbrains_io.trimQueryOrFragment(data.url);
                    if (path !== null && path !== undefined && (path.indexOf(".js", path.length - ".js".length) !== -1 || path.indexOf(".dart", path.length - ".dart".length) !== -1)) {
                      var tmp$1;
                      loadSourceMap(Kotlin.modules['browser-ext-platform'].org_jetbrains_io.canonicalizeUri(path + ".map", (tmp$1 = dom.tabUrl) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE()));
                    }
                  }
                   else {
                    var tmp$2;
                    loadSourceMap(Kotlin.modules['browser-ext-platform'].org_jetbrains_io.canonicalizeUri((tmp$2 = data.sourceMapURL) !== null && tmp$2 !== undefined ? tmp$2 : Kotlin.throwNPE(), data.url));
                  }
                }
              }, this));
            }
            if (this.buildInfo.baselineVersion < 133 && (this.buildInfo.baselineVersion === 131 ? !Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(this.buildInfo, 131, 397) : !Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(this.buildInfo, 132, 766))) {
              debuggerEventHandlers.add$0("Console.messageAdded", function (data, dom, tabId) {
                var consoleMessage = data["message"];
                var messageType = consoleMessage.type;
                if (messageType === "startGroupCollapsed" || (messageType === "startGroup" || messageType === "endGroup")) {
                  var message = _.com_jetbrains_browserConnection_chrome.ConsoleMessageGroupChanged(tabId, Kotlin.equals(messageType, "endGroup"));
                  if (consoleMessage.parameters !== null && consoleMessage.parameters !== undefined) {
                    var tmp$0;
                    for (var tmp$1 = (tmp$0 = consoleMessage.parameters) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), tmp$3 = 0, tmp$2 = tmp$1.length; tmp$3 !== tmp$2; tmp$3++) {
                      var p = tmp$1[tmp$3];
                      if (p.value !== null && p.value !== undefined) {
                        message.addParameter(Kotlin.stringify(p.value));
                      }
                    }
                  }
                  rpcServer.send$1("Debugger", message);
                }
                 else if (messageType === "dir" || messageType === "dirxml") {
                }
                 else {
                  var message_0 = _.com_jetbrains_browserConnection_chrome.ConsoleMessageAdded(tabId, consoleMessage.text);
                  var tmp$4 = consoleMessage.level;
                  if (tmp$4 === "error") {
                    message_0.kind = 2;
                    var callFrames = consoleMessage.stackTrace;
                    message_0.callFrames = callFrames === null || callFrames === undefined ? null : Kotlin.arrayFromFun(callFrames.length, $f5.bind(null, callFrames));
                  }
                   else if (tmp$4 === "warning")
                    message_0.kind = 1;
                  else
                    message_0.kind = 0;
                  if (consoleMessage.url !== null && consoleMessage.url !== undefined) {
                    var tmp$5, tmp$6;
                    message_0.url = (tmp$5 = consoleMessage.url) !== null && tmp$5 !== undefined ? tmp$5 : Kotlin.throwNPE();
                    message_0.line = ((tmp$6 = consoleMessage.line) !== null && tmp$6 !== undefined ? tmp$6 : Kotlin.throwNPE()) - 1;
                  }
                  rpcServer.send$1("Debugger", message_0);
                }
              });
              debuggerEventHandlers.add$0("Console.messageRepeatCountUpdated", function (data, dom, tabId) {
                rpcServer.send("Debugger", "messageRepeated", tabId.toString());
              });
            }
            debuggerEventHandlers.add$0("Debugger.globalObjectCleared", function (data, dom, tabId) {
              if (dom.skipFirstGlobalObjectClearedEvent) {
                dom.skipFirstGlobalObjectClearedEvent = false;
              }
            });
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.eventEmitted(chrome.debugger, this, Kotlin.assignOwner(function $fun(debuggee, method, data) {
              if (_.com_jetbrains_browserConnection_chrome.LOG.debugEnabled && !(method.indexOf("DOM.") === 0)) {
                var message = "EV " + debuggee.tabId + " " + method;
                if (Kotlin.equals(method, Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.SCRIPT_PARSED)) {
                  var scriptParsedData = data !== null && data !== undefined ? data : Kotlin.throwNPE();
                  message += " " + data.url + " " + data.scriptId;
                }
                _.com_jetbrains_browserConnection_chrome.LOG.debug([message]);
              }
              var dom = $fun.o.attachedTabs.get(debuggee.tabId);
              if (dom !== null && dom !== undefined) {
                if (method === "DOM.documentUpdated")
                  dom.documentUpdated();
                else if (method === Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.SCRIPT_PARSED)
                  dom.debugger.scriptParsed(data !== null && data !== undefined ? data : Kotlin.throwNPE());
                else if (method === "Debugger.globalObjectCleared")
                  dom.debugger.reset();
                else {
                }
                if (dom.externalEventEnabled) {
                  var handler = debuggerEventHandlers.get(method);
                  var delayedScriptParsed = handler !== null && handler !== undefined && $fun.o.buildInfo.baselineVersion >= 130 && Kotlin.equals(method, Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.SCRIPT_PARSED);
                  var tmp$0;
                  if (method === "Console.messagesCleared")
                    tmp$0 = false;
                  else
                    tmp$0 = !(method.indexOf("Profiler.") === 0);
                  if (handler !== null && handler !== undefined && !delayedScriptParsed) {
                    handler(data, dom, debuggee.tabId);
                  }
                   else if (tmp$0) {
                    rpcServer.send("Debugger", "handleEvent", debuggee.tabId.toString() + ", " + "\"" + method + "\"" + ", " + JSON.stringify(data));
                  }
                  if (delayedScriptParsed) {
                    (handler !== null && handler !== undefined ? handler : Kotlin.throwNPE())(data, dom, debuggee.tabId);
                  }
                }
              }
            }, this));
            if (this.buildInfo.baselineVersion >= 127) {
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.clicked(chrome.browserAction, this, function (it) {
                rpcServer.send("Ide", "focusProjectWindow", JSON.stringify(it.url));
              });
            }
          }
        }, /** @lends _.com_jetbrains_browserConnection_chrome.ChromePageManager.prototype */ {
          getDom: {value: function (tabId) {
            var tmp$0;
            return (tmp$0 = this.findDom(tabId)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
          }},
          findDom: {value: function (tabId) {
            return this.attachedTabs.get(tabId);
          }},
          dispose: {value: function () {
            try {
              {
                var tmp$0 = Kotlin.collectionIterator(this.attachedTabs.values());
                while (tmp$0.hasNext()) {
                  var dom = tmp$0.next();
                  try {
                    dom.disposeTree();
                  }
                  finally {
                    chrome.debugger.detach(dom.debuggee);
                  }
                }
              }
            }
            finally {
              this.attachedTabs.clear();
              this.devToolInspectedTabs.clear();
            }
          }, writable: true},
          process: {value: function (projectId, processor) {
            this.tabService.query(undefined, $f7.bind(this, processor, projectId));
          }, writable: true},
          executeForTabById: {value: function (tabId, onlyIfAttached, handler) {
            var dom = this.attachedTabs.get(tabId);
            if (dom !== null && dom !== undefined) {
              dom.detachIsAllowed = false;
              handler(dom);
            }
             else {
              var devToolsBackedDom = this.devToolInspectedTabs.get(tabId);
              if (devToolsBackedDom === null || devToolsBackedDom === undefined) {
                if (!onlyIfAttached) {
                  this.attachDebugger$0(tabId, null, handler);
                }
              }
               else {
                handler(devToolsBackedDom);
              }
            }
          }, writable: true},
          executeForTab: {value: function (tab, onlyIfAttached, handler) {
            this.executeForTabById(tab.id, onlyIfAttached, handler);
          }, writable: true},
          attachDebugger$0: {value: function (tabId, errorCallback, callback) {
            if (errorCallback === undefined)
              errorCallback = null;
            var debuggee = {tabId: tabId};
            var dom = _.com_jetbrains_browserConnection_chrome.DebuggerProtocolBackedDom(debuggee);
            this.attachedTabs.put(tabId, dom);
            chrome.debugger.attach(debuggee, "1.0", $f8.bind(this, callback, dom, tabId, errorCallback));
          }},
          getOrCreateTab: {value: function (url, urlToOpen, focusWindow, errorCallback, callback) {
            if (urlToOpen === undefined)
              urlToOpen = this.$dv$urlToOpen_getOrCreateTab();
            if (focusWindow === undefined)
              focusWindow = this.$dv$focusWindow_getOrCreateTab();
            if (errorCallback === undefined)
              errorCallback = this.$dv$errorCallback_getOrCreateTab();
            if (callback === undefined)
              callback = this.$dv$callback_getOrCreateTab();
            this.tabService.query(errorCallback, $f9.bind(this, url, urlToOpen, focusWindow, errorCallback, callback));
          }, writable: true},
          setExternalUsedDomState: {value: function (dom, externalEventEnabled) {
            dom.externalUsed = true;
            dom.externalEventEnabled = externalEventEnabled;
            dom.skipFirstGlobalObjectClearedEvent = !externalEventEnabled;
          }},
          attachDebugger: {value: function (tab, externalEventEnabled, callback, errorCallback) {
            var dom = this.attachedTabs.get(tab.id);
            if (dom !== null && dom !== undefined) {
              _.com_jetbrains_browserConnection_chrome.LOG.debug(["attachDebugger: existing dom " + Kotlin.stringify(dom)]);
              this.setExternalUsedDomState(dom, externalEventEnabled);
              callback(tab.id);
            }
             else {
              _.com_jetbrains_browserConnection_chrome.LOG.debug(["attachDebugger: existing dom not found"]);
              this.attachDebugger$0(tab.id, errorCallback, $fa.bind(this, tab, externalEventEnabled, callback));
            }
          }, writable: true},
          removeAndDisposeDom: {value: function (debuggee) {
            var dom = this.attachedTabs.remove(debuggee.tabId);
            dom !== null && dom !== undefined ? dom.disposeTree() : null;
            return dom;
          }},
          detachDebugger: {value: function (dom, callback) {
            if (callback === undefined)
              callback = null;
            this.removeAndDisposeDom(dom.debuggee);
            if (dom.debugger.enabled) {
              dom.debugger.disable($fb.bind(this, dom, callback));
            }
             else {
              chrome.debugger.detach(dom.debuggee, callback);
            }
          }}
        });
      })();
      Object.defineProperty(this, 'ChromePageManager', r);
      return r;
    }}
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    ChromeTabService: {get: function () {
      var r = (function () {
        function $f0() {
          return Kotlin.createObject(null, function () {
            Object.defineProperty(this, 'status', {value: "complete", enumerable: true});
            Object.defineProperty(this, 'windowType', {value: "normal", enumerable: true});
          });
        }
        function $f1(callback, errorCallback, it) {
          var tmp$0;
          var lastError = (tmp$0 = chrome.runtime.lastError) !== null && tmp$0 !== undefined ? tmp$0.message : null;
          if (lastError === null || lastError === undefined) {
            try {
              callback(Kotlin.arrayIterator(it));
            }
            catch (e) {
              try {
                _.com_jetbrains_browserConnection_chrome.LOG.error$0(e);
              }
              finally {
                var tmp$1;
                errorCallback !== null && errorCallback !== undefined ? errorCallback((tmp$1 = e.getMessage()) !== null && tmp$1 !== undefined ? tmp$1 : "Internal error") : null;
              }
            }
          }
           else {
            errorCallback !== null && errorCallback !== undefined ? errorCallback(lastError) : null;
          }
        }
        function $f2(focusWindow, callback, it) {
          var tmp$0;
          this.postProcessCreatedTab(((tmp$0 = it.tabs) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE())[0], it, focusWindow, callback);
        }
        function $f3(proposedWindow, focusWindow, callback, it) {
          this.postProcessCreatedTab(it, proposedWindow, focusWindow, callback);
        }
        function $f4(uri, focusWindow, callback, proposedWindow) {
          if (proposedWindow === null || proposedWindow === undefined) {
            chrome.windows.create({url: uri, focused: focusWindow}, $f2.bind(this, focusWindow, callback));
          }
           else {
            chrome.tabs.create({url: uri, windowId: proposedWindow.id}, $f3.bind(this, proposedWindow, focusWindow, callback));
          }
        }
        function $f5(createTab, it) {
          var found = false;
          for (var tmp$1 = 0, tmp$0 = it.length; tmp$1 !== tmp$0; tmp$1++) {
            var window = it[tmp$1];
            if (Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.get_isNormal(window)) {
              createTab(window);
              found = true;
              break;
            }
          }
          if (!found) {
            createTab(null);
          }
        }
        function $f6(uri, focusWindow, callback, lastFocusedWindow) {
          var createTab = $f4.bind(this, uri, focusWindow, callback);
          if (lastFocusedWindow === null || lastFocusedWindow === undefined) {
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["lastFocusedWindow not found"]);
            createTab(null);
          }
           else if (!Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.get_isNormal(lastFocusedWindow)) {
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["lastFocusedWindow is not normal"]);
            chrome.windows.getAll($f5.bind(null, createTab));
          }
           else {
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["lastFocusedWindow found"]);
            createTab(lastFocusedWindow);
          }
        }
        function $f7(done, disposable, callback, tab) {
          if (done.v) {
            throw Kotlin.newException("'completed' was called already", 'Exception');
          }
          done.v = true;
          try {
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["remove 'updateTab' onUpdated listener"]);
            disposable.disposeTree();
          }
          finally {
            callback(tab);
          }
        }
        function $f8(done, completed, tabId, changeInfo, tab) {
          if (tabId === tab.id) {
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["'updateTab' onUpdated, done " + done.v + ", changeInfo", changeInfo]);
            if (!done.v && !Kotlin.equals(changeInfo.status, "loading")) {
              completed(tab);
            }
          }
        }
        function $f9(done, completed, tab) {
          if (!done.v && !Kotlin.equals(tab.status, "loading")) {
            completed(tab);
          }
        }
        function $fa(callback, focusWindow, doneCallback, it) {
          _.com_jetbrains_browserConnection_chrome.LOG.debug(["tab updated: " + it.id + " " + it.url + " " + Kotlin.stringify(it.status) + ", callback " + (callback === null || callback === undefined ? "not exists" : "exists")]);
          if (focusWindow) {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.focusWindow(it.windowId);
          }
          if (doneCallback !== null && doneCallback !== undefined) {
            doneCallback(it);
          }
        }
        return Kotlin.createClass(Kotlin.modules['browser-ext-platform'].org_jetbrains_browserConnection.TabService, function () {
          Object.defineProperty(this, 'TABS_QUERY', {value: $f0()});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.ChromeTabService.prototype */ {
          query: {value: function (errorCallback, callback) {
            if (errorCallback === undefined)
              errorCallback = this.$dv$errorCallback_query();
            chrome.tabs.query(this.TABS_QUERY, $f1.bind(null, callback, errorCallback));
          }, writable: true},
          reload: {value: function (tab, bypassCache) {
            if (bypassCache === undefined)
              bypassCache = this.$dv$bypassCache_reload();
            chrome.tabs.reload(tab.id, {bypassCache: bypassCache});
          }, writable: true},
          createTab: {value: function (uri, focusWindow, callback) {
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["create tab: " + uri]);
            chrome.windows.getLastFocused($f6.bind(this, uri, focusWindow, callback));
          }, writable: true},
          postProcessCreatedTab: {value: function (tab, window, isFocusWindow, callback) {
            if (isFocusWindow && !window.focused) {
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.focusWindow(window.id);
            }
            if (callback !== null && callback !== undefined) {
              callback(tab);
            }
          }},
          updateTab: {value: function (tab, uri, focusWindow, errorCallback, callback) {
            if (errorCallback === undefined)
              errorCallback = this.$dv$errorCallback_updateTab();
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["update tab: " + tab.id + " " + tab.url + ", new url: " + Kotlin.stringify(uri)]);
            var doneCallback;
            if (uri !== null && uri !== undefined && (callback !== null && callback !== undefined) && Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_isDataUri(uri)) {
              var done = {v: false};
              var disposable = Kotlin.modules['browser-ext-platform'].org_jetbrains_util.newDisposable();
              var completed = $f7.bind(null, done, disposable, callback);
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.updated(chrome.tabs, disposable, $f8.bind(null, done, completed));
              doneCallback = $f9.bind(null, done, completed);
            }
             else {
              doneCallback = callback;
            }
            chrome.tabs.update(tab.id, {url: uri, active: true}, $fa.bind(null, callback, focusWindow, doneCallback));
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'ChromeTabService', r);
      return r;
    }},
    CompletedTabCallbackCaller: {value: (function () {
      return Kotlin.createClass(null, null);
    })()}
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    DebuggerProtocolBackedDom: {get: function () {
      var r = (function () {
        function $f0(callback, nodeId, it) {
          if (it) {
            callback(nodeId);
          }
        }
        function $f1(callback, it) {
          callback(it);
        }
        function $f2(findEmptyBody, callback, selectorSubject, nodeId) {
          if (nodeId !== -1) {
            if (findEmptyBody) {
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.computeObject(this.debuggee, nodeId, "function(){return this.children.length == 0}", $f0.bind(null, callback, nodeId));
            }
             else {
              if (selectorSubject === Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.SelectorSubjects.AS_IS)
                callback(nodeId);
              else if (selectorSubject === Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.SelectorSubjects.PARENT)
                Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.computeNode(this.debuggee, nodeId, "function(){return this.parentNode}", $f1.bind(null, callback));
              else if (selectorSubject === Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.SelectorSubjects.HTML)
                this.findNode("html", Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.SelectorSubjects.AS_IS, callback);
              else
                throw Kotlin.newException(null, 'Exception');
            }
          }
        }
        function $f3(selector, callback, selectorSubject, it) {
          var findEmptyBody = Kotlin.equals(selector, "$" + "0");
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.querySelector(this.debuggee, it, findEmptyBody ? "html > body" : selector, $f2.bind(this, findEmptyBody, callback, selectorSubject));
        }
        function $f4(callback, it) {
          this.documentNodeId = it.nodeId;
          callback(this.documentNodeId);
        }
        function $f5(result, it) {
          for (var tmp$1 = 0, tmp$0 = it.length; tmp$1 !== tmp$0; tmp$1++) {
            var header = it[tmp$1];
            if (!header.disabled && Kotlin.equals(header.origin, Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.StyleSheetOrigin.REGULAR)) {
              Kotlin.collectionAdd(result, header.sourceURL);
            }
          }
        }
        function $f6(sourceUrls, callback, it) {
          for (var tmp$1 = 0, tmp$0 = it.length; tmp$1 !== tmp$0; tmp$1++) {
            var header = it[tmp$1];
            for (var tmp$3 = 0, tmp$2 = sourceUrls.length; tmp$3 !== tmp$2; tmp$3++) {
              var sourceUrl = sourceUrls[tmp$3];
              if (Kotlin.equals(header.origin, Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.StyleSheetOrigin.REGULAR) && this.compareBrowserUrlWithIdeUrl(header.sourceURL, sourceUrl)) {
                callback(header);
              }
            }
          }
        }
        function $f7(outerHtml, it) {
          this.setOuterHtml$0(it, outerHtml);
        }
        function $f8(value, it) {
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.computeObject(this.debuggee, it, "function(){this.title='" + Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.escapeQuotes(value !== null && value !== undefined ? value : Kotlin.throwNPE()) + "'}", undefined);
        }
        function $f9(name, value, inlineStyle, attributesStyle) {
          if (inlineStyle !== null && inlineStyle !== undefined) {
            this.css.setProperty(inlineStyle, name, value, false);
          }
        }
        function $fa(isStyle, name, value, it) {
          if (isStyle) {
            this.css.getInlineStylesForNode(it, $f9.bind(this, name, value));
          }
           else {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.setAttributeValue(this.debuggee, it, name, value !== null && value !== undefined ? value : Kotlin.throwNPE());
          }
        }
        function $fb(it) {
          this.page.reload();
        }
        function $fc(it) {
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.highlightNode(this.debuggee, it);
          this.lastHighlightedNodeId = it;
        }
        return Kotlin.createClass([Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.Dom, Kotlin.modules['browser-ext-platform'].org_jetbrains_util.Disposable], function (debuggee) {
          Object.defineProperty(this, 'debuggee', {value: debuggee});
          Object.defineProperty(this, 'css', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteCss(this.debuggee)});
          Object.defineProperty(this, 'page', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemotePage(this.debuggee)});
          Object.defineProperty(this, 'debugger', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDebugger(this.debuggee)});
          Object.defineProperty(this, 'console', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteConsole(this.debuggee)});
          Object.defineProperty(this, 'detachIsAllowed', {value: false, writable: true});
          Object.defineProperty(this, 'externalUsed', {value: false, writable: true});
          Object.defineProperty(this, 'externalEventEnabled', {value: false, writable: true});
          Object.defineProperty(this, 'skipFirstGlobalObjectClearedEvent', {value: false, writable: true});
          Object.defineProperty(this, 'tabUrl', {value: null, writable: true});
          Object.defineProperty(this, 'documentNodeId', {value: -1, writable: true});
          Object.defineProperty(this, 'lastHighlightedNodeId', {value: -1, writable: true});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.DebuggerProtocolBackedDom.prototype */ {
          documentUpdated: {value: function () {
            this.documentNodeId = -1;
            this.lastHighlightedNodeId = -1;
          }},
          dispose: {value: function () {
          }, writable: true},
          findNode: {value: function (selector, selectorSubject, callback) {
            this.forDocumentNode($f3.bind(this, selector, callback, selectorSubject));
          }},
          forDocumentNode: {value: function (callback) {
            if (this.documentNodeId !== -1) {
              callback(this.documentNodeId);
            }
             else {
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.getDocument(this.debuggee, $f4.bind(this, callback));
            }
          }},
          collectStyleSheets: {value: function (result) {
            this.css.getStyleSheets($f5.bind(this, result));
          }, writable: true},
          compareUrlWithIdeFilename: {value: function (url, filename) {
            var filenameIndex = url.lastIndexOf("/") + 1;
            return url.indexOf(filename, filenameIndex) === filenameIndex;
          }},
          compareBrowserUrlWithIdeUrl: {value: function (browserUrl, ideUrl) {
            if (Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.normalizeFileUrl(browserUrl).indexOf(ideUrl) === 0) {
              return true;
            }
            var browserUrlFilenameIndex = browserUrl.lastIndexOf("/") + 1;
            var ideUrlFilenameIndex = ideUrl.lastIndexOf("/") + 1;
            return browserUrlFilenameIndex !== -1 && ideUrlFilenameIndex !== -1 && browserUrl.indexOf(ideUrl.substring(ideUrlFilenameIndex), browserUrlFilenameIndex) === browserUrlFilenameIndex;
          }},
          findStyleSheet: {value: function (sourceUrls, callback) {
            this.css.getStyleSheets($f6.bind(this, sourceUrls, callback));
          }},
          setOuterHtml: {value: function (selector, selectorSubject, outerHtml) {
            this.findNode(selector, selectorSubject, $f7.bind(this, outerHtml));
          }, writable: true},
          setOuterHtml$0: {value: function (nodeId, outerHtml) {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.setOuterHtml(this.debuggee, nodeId, outerHtml);
          }},
          setProperty: {value: function (selector, selectorSubject, name, value, isStyle) {
            if (Kotlin.equals(selector, "@title")) {
              this.forDocumentNode($f8.bind(this, value));
              return;
            }
            this.findNode(selector, selectorSubject, $fa.bind(this, isStyle, name, value));
          }, writable: true},
          reloadPageIfContains: {value: function (selector) {
            this.findNode(selector, Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.SelectorSubjects.AS_IS, $fb.bind(this));
          }, writable: true},
          highlightElement: {value: function (selector, selectorSubject) {
            if (this.lastHighlightedNodeId !== -1) {
              this.hideHighlight();
            }
            this.findNode(selector, selectorSubject, $fc.bind(this));
          }, writable: true},
          hideHighlight: {value: function () {
            if (this.documentNodeId === -1) {
              return;
            }
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.hideHighlight(this.debuggee);
            this.lastHighlightedNodeId = -1;
          }, writable: true},
          toString: {value: function () {
            return Kotlin.stringify(this.debuggee.tabId);
          }}
        });
      })();
      Object.defineProperty(this, 'DebuggerProtocolBackedDom', r);
      return r;
    }}
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    DevToolsBackedDom: {get: function () {
      var r = (function () {
        return Kotlin.createClass(Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.Dom, function (port) {
          Object.defineProperty(this, 'port', {value: port});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.DevToolsBackedDom.prototype */ {
          collectStyleSheets: {value: function (result) {
          }, writable: true},
          setOuterHtml: {value: function (selector, selectorSubject, outerHtml) {
            this.port.postMessage({selector: selector});
          }, writable: true},
          reloadPageIfContains: {value: function (selector) {
            this.port.postMessage({selector: selector});
          }, writable: true},
          setProperty: {value: function (selector, selectorSubject, name, value, isStyle) {
            if (isStyle) {
              return;
            }
            this.port.postMessage({selector: selector, name: name, value: value});
          }, writable: true},
          highlightElement: {value: function (selector, selectorSubject) {
          }, writable: true},
          hideHighlight: {value: function () {
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'DevToolsBackedDom', r);
      return r;
    }}
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
  });
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', null, /** @lends _.com_jetbrains_browserConnection_chrome */ {
    ConsoleMessageAdded: {get: function () {
      var r = (function () {
        return Kotlin.createClass(Kotlin.modules['browser-ext-platform'].org_jetbrains_io_jsonRpc.Message, function (tabId, text) {
          Object.defineProperty(this, 'tabId', {value: tabId});
          Object.defineProperty(this, 'text', {value: text});
          Object.defineProperty(this, 'kind', {value: -1, writable: true});
          Object.defineProperty(this, 'url', {value: null, writable: true});
          Object.defineProperty(this, 'line', {value: null, writable: true});
          Object.defineProperty(this, 'callFrames', {value: null, writable: true});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.ConsoleMessageAdded.prototype */ {
          method: {
            get: function () {
              return "messageAdded";
            }
          },
          toString: {value: function () {
            var out = this.tabId.toString() + ", " + this.kind + ", " + JSON.stringify(this.text);
            if (this.url !== null && this.url !== undefined) {
              var tmp$0, tmp$1;
              out += ", " + JSON.stringify((tmp$0 = this.url) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()) + ", " + ((tmp$1 = this.line) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE());
            }
            if (this.callFrames !== null && this.callFrames !== undefined) {
              var tmp$2;
              out += ", " + JSON.stringify((tmp$2 = this.callFrames) !== null && tmp$2 !== undefined ? tmp$2 : Kotlin.throwNPE());
            }
            return out;
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'ConsoleMessageAdded', r);
      return r;
    }},
    ConsoleMessageGroupChanged: {get: function () {
      var r = (function () {
        return Kotlin.createClass(Kotlin.modules['browser-ext-platform'].org_jetbrains_io_jsonRpc.Message, function (tabId, ended) {
          Object.defineProperty(this, 'tabId', {value: tabId});
          Object.defineProperty(this, 'ended', {value: ended});
          Object.defineProperty(this, 'parameters', {value: null, writable: true});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.ConsoleMessageGroupChanged.prototype */ {
          method: {
            get: function () {
              return "messageGroupChanged";
            }
          },
          addParameter: {value: function (parameter) {
            if (this.parameters === null || this.parameters === undefined) {
              this.parameters = [];
            }
            var tmp$0;
            ((tmp$0 = this.parameters) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()).push(parameter);
          }},
          toString: {value: function () {
            var tmp$0;
            return this.tabId.toString() + ", " + this.ended + ", " + (this.parameters === null || this.parameters === undefined ? "[]" : JSON.stringify((tmp$0 = this.parameters) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE()));
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'ConsoleMessageGroupChanged', r);
      return r;
    }}
  });
  Kotlin.finalize(_);
  return _;
});

//# sourceMappingURL=chrome-ext.js.map