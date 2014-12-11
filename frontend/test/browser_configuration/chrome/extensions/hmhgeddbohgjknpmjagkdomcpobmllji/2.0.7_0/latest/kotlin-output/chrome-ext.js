Kotlin.defineModule('chrome-ext', ['browser-ext-platform', 'jb-chrome-ext-api', 'chrome-ext-options'], function () {
  'use strict';
  var _ = {
  };
  /** @name _.com_jetbrains_browserConnection_chrome */ 
  Kotlin.p(_, 'com_jetbrains_browserConnection_chrome', function () {
    Object.defineProperty(this, 'enableContextMenuItems', {value: function (enabled) {
      {
        var tmp$0 = Kotlin.arrayIterator(_.com_jetbrains_browserConnection_chrome.registeredContextMenuItems);
        while (tmp$0.hasNext()) {
          var id = tmp$0.next();
          chrome.contextMenus.update(id, {enabled: enabled});
        }
      }
    }});
    function $f0(socket) {
      socket.disconnect();
    }
    function $f1(rpcServer, it) {
      rpcServer.send("Ide", "focusProjectWindow", JSON.stringify(it.url));
    }
    function $f2() {
      chrome.browserAction.disable();
      chrome.browserAction.setTitle({title: "Not connected"});
    }
    function $f3(rpcServer, tab, it) {
      rpcServer.send("Debugger", "inspect", JSON.stringify(tab.url) + ", " + it);
    }
    function $f4(it) {
    }
    function $f5(pageManager, rpcServer, data, tab) {
      var tmp$0;
      if (Kotlin.equals((tmp$0 = data.menuItemId) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), "inspect")) {
        var tmp$1;
        if (pageManager.v !== null && pageManager.v !== undefined && !((tmp$1 = pageManager.v) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE()).devToolInspectedTabs.containsKey((tab !== null && tab !== undefined ? tab : Kotlin.throwNPE()).id)) {
          var tmp$2;
          var dom = ((tmp$2 = pageManager.v) !== null && tmp$2 !== undefined ? tmp$2 : Kotlin.throwNPE()).findDom((tab !== null && tab !== undefined ? tab : Kotlin.throwNPE()).id);
          if (dom === null || dom === undefined || !dom.externalUsed) {
            var tmp$3;
            (tmp$3 = pageManager.v) !== null && tmp$3 !== undefined ? tmp$3.attachDebugger(tab, true, $f3.bind(null, rpcServer, tab), $f4) : null;
          }
        }
      }
    }
    function $f6() {
      Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.successfully();
    }
    function $f7() {
      _.com_jetbrains_browserConnection_chrome.enableContextMenuItems(false);
    }
    function $f8(disposable, socket, pageManager, buildInfo, rpcServer, appendSourceUrl, host, port, connected) {
      try {
        disposable.register($f0.bind(null, socket));
        pageManager.v = _.com_jetbrains_browserConnection_chrome.ChromePageManager(buildInfo, rpcServer, appendSourceUrl);
        var tmp$0, tmp$1;
        Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.registerDomService((tmp$0 = pageManager.v) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), rpcServer);
        rpcServer.registerDomain("Debugger", _.com_jetbrains_browserConnection_chrome.ChromeDebugService((tmp$1 = pageManager.v) !== null && tmp$1 !== undefined ? tmp$1 : Kotlin.throwNPE(), rpcServer, host, port));
        connected();
      }
      finally {
        chrome.browserAction.enable();
        chrome.browserAction.setTitle({title: "Connected to " + buildInfo.name});
        Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.clicked(chrome.browserAction, disposable, $f1.bind(null, rpcServer));
        disposable.register($f2);
        if (Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(buildInfo, 134, 312)) {
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.clicked$0(chrome.contextMenus, disposable, $f5.bind(this, pageManager, rpcServer));
          if (_.com_jetbrains_browserConnection_chrome.registeredContextMenuItems.length === 0) {
            var tmp$2;
            _.com_jetbrains_browserConnection_chrome.registeredContextMenuItems.push(chrome.contextMenus.create({id: "inspect", title: "Inspect in " + ((tmp$2 = buildInfo.productName) !== null && tmp$2 !== undefined ? tmp$2 : buildInfo.name), contexts: ["all"], documentUrlPatterns: ["http://*/*", "https://*/*"]}, $f6));
          }
           else {
            _.com_jetbrains_browserConnection_chrome.enableContextMenuItems(true);
          }
          disposable.register($f7);
        }
      }
    }
    function $f9(pageManager, disposable) {
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
    function $fa(disposable, pageManager, buildInfo, appendSourceUrl, host, port, connected, socket, rpcServer) {
      socket.opened = $f8.bind(this, disposable, socket, pageManager, buildInfo, rpcServer, appendSourceUrl, host, port, connected);
      socket.closed = $f9.bind(null, pageManager, disposable);
    }
    Object.defineProperty(this, 'connect', {value: function (buildInfo, host, port, connected, disposable, appendSourceUrl) {
      var pageManager = {v: null};
      var tmp$0;
      if (Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.greaterOrEquals(buildInfo, 138, 1410))
        tmp$0 = encodeURIComponent(window.navigator.userAgent);
      else if (window.navigator.userAgent.indexOf("(Dart)") !== -1)
        tmp$0 = "DARTIUM";
      else
        tmp$0 = "CHROME";
      Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.connect(chrome.app.getDetails().version, tmp$0, host, port, -1, $fa.bind(this, disposable, pageManager, buildInfo, appendSourceUrl, host, port, connected));
    }});
    Object.defineProperty(this, 'LOG', {value: Kotlin.modules['browser-ext-platform'].org_jetbrains_logging.getLogger("com.jetbrains.browserConnection.chrome")});
    Object.defineProperty(this, 'registeredContextMenuItems', {value: []});
  }, /** @lends _.com_jetbrains_browserConnection_chrome */ {
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
        function $f7() {
          chrome.webRequest.handlerBehaviorChanged();
        }
        function $f8(it) {
          return this.transformWithAppendedSourceUrl(it);
        }
        function $f9() {
          chrome.webRequest.handlerBehaviorChanged();
        }
        function $fa(done, it) {
          done();
        }
        function $fb(tabId, url, dom, done) {
          this.addTransformWithAppendedSourceUrl(tabId, dom);
          chrome.tabs.update(tabId, {url: url, active: true}, $fa.bind(null, done));
          return true;
        }
        function $fc(dom, done) {
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
          createPreliminaryPageUrl: {value: function (url) {
            return chrome.runtime.getURL("loading.html?url=") + encodeURIComponent(url);
          }, writable: true},
          sendCommand: {value: function (tabId, command) {
            var dom = this.pageManager.getDom(tabId);
            var tmp$0 = command.method, tmp$1;
            if (tmp$0 === "Debugger.enable")
              tmp$1 = dom.debugger;
            else if (tmp$0 === "Page.enable")
              tmp$1 = dom.page;
            else
              tmp$1 = null;
            var domainToEnable = tmp$1;
            if (domainToEnable !== null && domainToEnable !== undefined) {
              this.queueProcessor.add($f2.bind(this, domainToEnable, tabId, command));
            }
             else if (dom.debugSessionInitialized) {
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
          initialized: {value: function (tabId) {
            var dom = this.pageManager.getDom(tabId);
            dom.debugSessionInitialized = true;
            dom.initialUrl = dom.tabUrl;
            _.com_jetbrains_browserConnection_chrome.LOG.debug(["Save " + Kotlin.stringify(dom.tabUrl) + " as initial tab url"]);
            this.addTransformWithAppendedSourceUrl(tabId, dom);
            dom.register($f7);
          }},
          addTransformWithAppendedSourceUrl: {value: function (tabId, dom) {
            if (this.pageManager.appendSourceUrl) {
              Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.beforeRequested(chrome.webRequest, dom, {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId}, true, $f8.bind(this));
              dom.register($f9);
            }
          }},
          navigate: {value: function (tabId, url) {
            this.queue(tabId, $fb.bind(this, tabId, url));
          }},
          transformWithAppendedSourceUrl: {value: function (it) {
            if (!(!Kotlin.equals(it.method, "GET") || !Kotlin.equals(it.method, "get")) || it.url.indexOf("FDFA6052-1C12-4655-B658-0DBF2414422D") !== -1) {
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
              return {redirectUrl: "http://" + Kotlin.stringify(tabUrl.authority) + "/" + (this.pageManager.buildInfo.baselineVersion > 131 ? "FDFA6052-1C12-4655-B658-0DBF2414422D" : "__corsProxy__") + "/" + it.tabId + "/" + window.btoa(it.url)};
            }
            return null;
          }},
          detach: {value: function (tabId) {
            var dom = this.pageManager.getDom(tabId);
            dom.externalUsed = false;
            if (dom.detachIsAllowed) {
              this.queue(tabId, $fc.bind(this));
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
    InitDevToolMessage: {value: (function () {
      return Kotlin.createClass(null, function (tabId) {
        Object.defineProperty(this, 'tabId', {value: tabId});
      });
    })()},
    ChromePageManager: {get: function () {
      var r = (function () {
        function $f0(message, it) {
          this.devToolInspectedTabs.remove(message.tabId);
        }
        function $f1(port, message) {
          this.devToolInspectedTabs.put(message.tabId, _.com_jetbrains_browserConnection_chrome.DevToolsBackedDom(port));
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.disconnected(port, undefined, $f0.bind(this, message));
        }
        function $f2(processor, postponed, it) {
          for (var tmp$1 = 0, tmp$0 = it.length; tmp$1 !== tmp$0; tmp$1++) {
            var index = it[tmp$1];
            processor(Kotlin.arrayGet(postponed, index));
          }
        }
        function $f3(processor, projectId, it) {
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
              if (!Kotlin.equals(parsedUrl.host, chrome.runtime.id)) {
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
               else {
                processor(tab);
              }
            }
          }
          if (!(postponed.length === 0)) {
            this.filterInspectable(projectId, hostAndPathPairs, $f2.bind(null, processor, postponed));
          }
        }
        function $f4(callback, dom, tabId, errorCallback) {
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
        function $f5(url, urlToOpen, focusWindow, errorCallback, callback, it) {
          var candidate = null;
          var newTab = null;
          var existingTab = null;
          var memorizedTabUsed = false;
          if (!this.tabToInitialUrl.isEmpty()) {
            {
              var tmp$0 = it;
              while (tmp$0.hasNext()) {
                var tab = tmp$0.next();
                if (Kotlin.equals(this.tabToInitialUrl.get(tab.id), url)) {
                  this.tabToInitialUrl.remove(tab.id);
                  this.tabService.load(url, urlToOpen, tab, null, focusWindow, errorCallback, callback);
                  memorizedTabUsed = true;
                  break;
                }
              }
            }
          }
          if (!memorizedTabUsed) {
            {
              var tmp$1 = it;
              while (tmp$1.hasNext()) {
                var tab_0 = tmp$1.next();
                if (!Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.compareUrls(tab_0.url, url)) {
                  if ((newTab === null || newTab === undefined) && Kotlin.equals(tab_0.url, "chrome://newtab/")) {
                    newTab = tab_0;
                  }
                  continue;
                }
                if (this.devToolInspectedTabs.containsKey(tab_0.id)) {
                  continue;
                }
                if (this.attachedTabs.isEmpty()) {
                  existingTab = tab_0;
                  break;
                }
                var dom = this.attachedTabs.get(tab_0.id);
                if (dom !== null && dom !== undefined) {
                  if (dom.externalUsed) {
                    continue;
                  }
                   else {
                    existingTab = tab_0;
                    break;
                  }
                }
                if (candidate === null || candidate === undefined) {
                  candidate = tab_0;
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
        }
        function $f6(tab, callback, it) {
          it.tabUrl = tab.url;
          it.detachIsAllowed = true;
          it.externalUsed = true;
          _.com_jetbrains_browserConnection_chrome.LOG.debug(["attachDebugger: attached to " + tab.id]);
          callback(tab.id);
        }
        function $f7(dom, callback) {
          _.com_jetbrains_browserConnection_chrome.LOG.debug(["attempt to detachDebugger, " + dom.debuggee.tabId]);
          chrome.debugger.detach(dom.debuggee, callback);
        }
        return Kotlin.createClass([Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.PageManager, Kotlin.modules['browser-ext-platform'].org_jetbrains_util.Disposable], function $fun(buildInfo, rpcServer, appendSourceUrl) {
          $fun.baseInitializer.call(this, _.com_jetbrains_browserConnection_chrome.ChromeTabService(), rpcServer);
          Object.defineProperty(this, 'buildInfo', {value: buildInfo});
          Object.defineProperty(this, 'appendSourceUrl', {value: appendSourceUrl});
          Object.defineProperty(this, 'attachedTabs', {value: Kotlin.PrimitiveHashMap()});
          Object.defineProperty(this, 'devToolInspectedTabs', {value: Kotlin.PrimitiveHashMap()});
          Object.defineProperty(this, 'tabToInitialUrl', {value: Kotlin.PrimitiveHashMap()});
          {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.updated(chrome.tabs, this, Kotlin.assignOwner(function $fun(tabId, changeInfo, tab) {
              var newUrl = changeInfo.url;
              if (newUrl !== null && newUrl !== undefined) {
                var dom = $fun.o.attachedTabs.get(tabId);
                if (dom !== null && dom !== undefined) {
                  dom.tabUrl = changeInfo.url;
                  _.com_jetbrains_browserConnection_chrome.LOG.info("new url " + Kotlin.stringify(newUrl));
                  if (!dom.externalUsed && !Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_isDataUri(newUrl)) {
                    var tmp$0;
                    var parsedUrl = (tmp$0 = Kotlin.modules['browser-ext-platform'].org_jetbrains_io.get_asParsedUrl(newUrl)) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE();
                    if (!Kotlin.equals(parsedUrl.host, chrome.runtime.id) && Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.isInspectableBackedByPattern(parsedUrl.scheme, parsedUrl.host) === Kotlin.modules['browser-ext-platform'].org_jetbrains_util.ThreeState.NO) {
                      _.com_jetbrains_browserConnection_chrome.LOG.info("detach tab " + dom.debuggee + ", new url " + Kotlin.stringify(newUrl) + " is not inspectable");
                      $fun.o.detachDebugger(dom, undefined);
                    }
                  }
                }
              }
            }, this));
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.removed(chrome.tabs, this, Kotlin.assignOwner(function $fun(tabId, removeInfo) {
              $fun.o.devToolInspectedTabs.remove(tabId);
              var url = $fun.o.tabToInitialUrl.remove(tabId);
              if (url !== null && url !== undefined) {
                _.com_jetbrains_browserConnection_chrome.LOG.debug(["url " + Kotlin.stringify(url) + " removed from tabToInitialUrl map, tab removed"]);
              }
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
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chrome.eventEmitted(chrome.debugger, this, Kotlin.assignOwner(function $fun(debuggee, method, data) {
              if (_.com_jetbrains_browserConnection_chrome.LOG.debugEnabled && !(method.indexOf("DOM.") === 0 || method.indexOf("Network.") === 0 || method.indexOf("Console.") === 0)) {
                var message = "EV " + debuggee.tabId + " " + method;
                if (Kotlin.equals(method, "Debugger.scriptParsed")) {
                  var scriptParsedData = data !== null && data !== undefined ? data : Kotlin.throwNPE();
                  message += " " + data.url + " " + data.scriptId;
                }
                _.com_jetbrains_browserConnection_chrome.LOG.debug([message]);
              }
              var dom = $fun.o.attachedTabs.get(debuggee.tabId);
              if (dom !== null && dom !== undefined) {
                if (method === "DOM.documentUpdated")
                  dom.documentUpdated();
                else {
                }
                if (dom.externalUsed && !(method.indexOf("Profiler.") === 0)) {
                  rpcServer.send("Debugger", "handleEvent", debuggee.tabId.toString() + ", " + "\"" + method + "\"" + ", " + JSON.stringify(data));
                }
              }
            }, this));
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
            this.tabService.query(undefined, $f3.bind(this, processor, projectId));
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
            chrome.debugger.attach(debuggee, "1.0", $f4.bind(this, callback, dom, tabId, errorCallback));
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
            this.tabService.query(errorCallback, $f5.bind(this, url, urlToOpen, focusWindow, errorCallback, callback));
          }, writable: true},
          attachDebugger: {value: function (tab, externalEventEnabled, callback, errorCallback) {
            var dom = this.attachedTabs.get(tab.id);
            this.tabToInitialUrl.remove(tab.id);
            if (dom !== null && dom !== undefined) {
              _.com_jetbrains_browserConnection_chrome.LOG.debug(["attachDebugger: existing dom " + Kotlin.stringify(dom)]);
              dom.externalUsed = true;
              callback(tab.id);
            }
             else {
              _.com_jetbrains_browserConnection_chrome.LOG.debug(["attachDebugger: existing dom not found"]);
              this.attachDebugger$0(tab.id, errorCallback, $f6.bind(this, tab, callback));
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
            var initialUrl = dom.initialUrl;
            if (initialUrl !== null && initialUrl !== undefined) {
              _.com_jetbrains_browserConnection_chrome.LOG.debug(["add " + Kotlin.stringify(initialUrl) + " to tabToInitialUrl map, " + dom.debuggee.tabId]);
              this.tabToInitialUrl.put(dom.debuggee.tabId, initialUrl !== null && initialUrl !== undefined ? initialUrl : Kotlin.throwNPE());
            }
            if (dom.debugger.enabled) {
              dom.debugger.disable($f7.bind(this, dom, callback));
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
            callback(tab, true);
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
        function $fa(callback, uri, it) {
          callback(it, uri !== null && uri !== undefined);
        }
        function $fb(callback, focusWindow, doneCallback, it) {
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
              var tmp$0;
              if (callback === null || callback === undefined)
                tmp$0 = null;
              else {
                tmp$0 = $fa.bind(null, callback, uri);
              }
              doneCallback = tmp$0;
            }
            chrome.tabs.update(tab.id, {url: uri, active: true}, $fb.bind(null, callback, focusWindow, doneCallback));
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'ChromeTabService', r);
      return r;
    }}
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
        function $f7(it) {
          this.hasAngular = it;
        }
        function $f8(nodeId, it) {
          if (this.hasAngular) {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.computeObject(this.debuggee, nodeId, "function(){if (typeof angular === 'undefined') { return false; }" + ("try {var node = this; angular.element(node).injector().invoke(function(" + "$") + "compile) {" + "var scope = angular.element(node).scope();" + "$" + "compile(node)(scope);" + ("scope." + "$") + "digest();" + "});" + "return true;} catch (e) { console.log(e); return false; }}", $f7.bind(this));
          }
        }
        function $f9(outerHtml, nodeId) {
          this.setOuterHtml$0(nodeId, outerHtml, $f8.bind(this, nodeId));
        }
        function $fa(value, it) {
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.computeObject(this.debuggee, it, "function(){this.title='" + Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.escapeQuotes(value !== null && value !== undefined ? value : Kotlin.throwNPE()) + "'}", undefined);
        }
        function $fb(name, value, inlineStyle, attributesStyle) {
          if (inlineStyle !== null && inlineStyle !== undefined) {
            this.css.setProperty(inlineStyle, name, value, false);
          }
        }
        function $fc(isStyle, name, value, it) {
          if (isStyle) {
            this.css.getInlineStylesForNode(it, $fb.bind(this, name, value));
          }
           else {
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.setAttributeValue(this.debuggee, it, name, value !== null && value !== undefined ? value : Kotlin.throwNPE());
          }
        }
        function $fd(it) {
          this.page.reload();
        }
        function $fe(it) {
          Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.highlightNode(this.debuggee, it);
          this.lastHighlightedNodeId = it;
        }
        return Kotlin.createClass([Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.Dom, Kotlin.modules['browser-ext-platform'].org_jetbrains_util.Disposable], function (debuggee) {
          Object.defineProperty(this, 'debuggee', {value: debuggee});
          Object.defineProperty(this, 'css', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteCss(this.debuggee)});
          Object.defineProperty(this, 'page', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemotePage(this.debuggee)});
          Object.defineProperty(this, 'debugger', {value: Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDebugger(this.debuggee)});
          Object.defineProperty(this, 'detachIsAllowed', {value: false, writable: true});
          Object.defineProperty(this, 'externalUsed', {value: false, writable: true});
          Object.defineProperty(this, 'debugSessionInitialized', {value: false, writable: true});
          Object.defineProperty(this, 'tabUrl', {value: null, writable: true});
          Object.defineProperty(this, 'initialUrl', {value: null, writable: true});
          Object.defineProperty(this, 'documentNodeId', {value: -1, writable: true});
          Object.defineProperty(this, 'lastHighlightedNodeId', {value: -1, writable: true});
          Object.defineProperty(this, 'hasAngular', {value: true, writable: true});
        }, /** @lends _.com_jetbrains_browserConnection_chrome.DebuggerProtocolBackedDom.prototype */ {
          documentUpdated: {value: function () {
            this.documentNodeId = -1;
            this.lastHighlightedNodeId = -1;
            this.hasAngular = true;
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
            this.findNode(selector, selectorSubject, $f9.bind(this, outerHtml));
          }, writable: true},
          setOuterHtml$0: {value: function (nodeId, outerHtml, callback) {
            if (callback === undefined)
              callback = null;
            Kotlin.modules['jb-chrome-ext-api'].org_jetbrains_chromium_debug.RemoteDom.setOuterHtml(this.debuggee, nodeId, outerHtml, callback);
          }},
          setProperty: {value: function (selector, selectorSubject, name, value, isStyle) {
            if (Kotlin.equals(selector, "@title")) {
              this.forDocumentNode($fa.bind(this, value));
              return;
            }
            this.findNode(selector, selectorSubject, $fc.bind(this, isStyle, name, value));
          }, writable: true},
          reloadPageIfContains: {value: function (selector) {
            this.findNode(selector, Kotlin.modules['browser-ext-platform'].com_jetbrains_browserConnection.SelectorSubjects.AS_IS, $fd.bind(this));
          }, writable: true},
          highlightElement: {value: function (selector, selectorSubject) {
            if (this.lastHighlightedNodeId !== -1) {
              this.hideHighlight();
            }
            this.findNode(selector, selectorSubject, $fe.bind(this));
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
  Kotlin.finalize(_);
  return _;
});

//# sourceMappingURL=chrome-ext.js.map