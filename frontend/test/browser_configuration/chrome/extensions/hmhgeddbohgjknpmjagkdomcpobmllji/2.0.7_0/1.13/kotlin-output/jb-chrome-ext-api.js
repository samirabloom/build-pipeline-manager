Kotlin.defineModule('jb-chrome-ext-api', ['browser-ext-platform'], function () {
  'use strict';
  var _ = {
  };
  /** @name _.org_jetbrains_chrome */ 
  Kotlin.p(_, 'org_jetbrains_chrome', function () {
    Object.defineProperty(this, 'successfully', {value: function () {
      var lastError = chrome.runtime.lastError;
      if (lastError === null || lastError === undefined) {
        return true;
      }
      _.org_jetbrains_chrome.LOG.error(lastError.message);
      return false;
    }});
    function $f0(callback, it) {
      callback(!_.org_jetbrains_chrome.successfully() || isObjectEmpty(it) ? null : it);
    }
    Object.defineProperty(this, 'get', {value: function ($receiver, key, callback) {
      if (key === undefined)
        key = null;
      $receiver.get(key, $f0.bind(null, callback));
    }});
    Object.defineProperty(this, 'addListener', {value: function (event, listener, disposable, filter, extraInfoSpec) {
      if (disposable === undefined)
        disposable = null;
      if (filter === undefined)
        filter = null;
      if (extraInfoSpec === undefined)
        extraInfoSpec = null;
      if (extraInfoSpec === null || extraInfoSpec === undefined) {
        event.addListener(listener, filter);
      }
       else {
        event.addListener(listener, filter, extraInfoSpec);
      }
      if (disposable !== null && disposable !== undefined) {
        disposable.register$0(_.org_jetbrains_chrome.DisposableChromeEvent(event, listener));
      }
    }});
    Object.defineProperty(this, 'updated', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onUpdated, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'removed', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onRemoved, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'detached', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onDetach, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'eventEmitted', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onEvent, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'connected', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onConnect, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'message', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onMessage, listener !== null && listener !== undefined ? listener : Kotlin.throwNPE(), disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'disconnected', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onDisconnect, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'changed', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onChanged, listener, disposable, undefined, undefined);
    }});
    function $f1(listener, changes, areaName) {
      if (Kotlin.equals(areaName, "local")) {
        listener(changes);
      }
    }
    Object.defineProperty(this, 'localChanged', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.changed($receiver, disposable, $f1.bind(null, listener));
    }});
    Object.defineProperty(this, 'clicked', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onClicked, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'setIcon', {value: function ($receiver, path19, path38) {
      $receiver.setIcon({path: {19: chrome.runtime.getURL(path19), 38: chrome.runtime.getURL(path38)}});
    }});
    Object.defineProperty(this, 'beforeRequested', {value: function ($receiver, disposable, filter, blocking, listener) {
      if (blocking === undefined)
        blocking = false;
      _.org_jetbrains_chrome.addListener($receiver.onBeforeRequest, listener, disposable, filter, blocking ? ["blocking"] : null);
    }});
    Object.defineProperty(this, 'headersReceived', {value: function ($receiver, disposable, filter, blocking, listener) {
      if (blocking === undefined)
        blocking = false;
      _.org_jetbrains_chrome.addListener($receiver.onHeadersReceived, listener, disposable, filter, blocking ? ["blocking"] : null);
    }});
    Object.defineProperty(this, 'beforeSendHeaders', {value: function ($receiver, disposable, filter, blocking, listener) {
      if (blocking === undefined)
        blocking = false;
      _.org_jetbrains_chrome.addListener($receiver.onBeforeSendHeaders, listener, disposable, filter, blocking ? ["blocking"] : null);
    }});
    Object.defineProperty(this, 'completed', {value: function ($receiver, disposable, filter, listener) {
      _.org_jetbrains_chrome.addListener($receiver.onCompleted, listener, disposable, filter, undefined);
    }});
    Object.defineProperty(this, 'errorOccurred', {value: function ($receiver, disposable, filter, listener) {
      _.org_jetbrains_chrome.addListener($receiver.onErrorOccurred, listener, disposable, filter, undefined);
    }});
    Object.defineProperty(this, 'launched', {value: function ($receiver, disposable, listener) {
      if (disposable === undefined)
        disposable = null;
      _.org_jetbrains_chrome.addListener($receiver.onLaunched, listener, disposable, undefined, undefined);
    }});
    Object.defineProperty(this, 'focusWindow', {value: function (id) {
      chrome.windows.update(id, {focused: true});
    }});
    Object.defineProperty(this, 'LOG', {value: Kotlin.modules['browser-ext-platform'].org_jetbrains_logging.getLogger("org.jetbrains.chrome")});
  }, /** @lends _.org_jetbrains_chrome */ {
    get_isNormal: {value: function ($receiver) {
      return Kotlin.equals($receiver.type, "normal");
    }},
    DisposableChromeEvent: {get: function () {
      var r = (function () {
        return Kotlin.createClass(Kotlin.modules['browser-ext-platform'].org_jetbrains_util.Disposable, function (event, listener) {
          Object.defineProperty(this, 'event', {value: event});
          Object.defineProperty(this, 'listener', {value: listener});
        }, /** @lends _.org_jetbrains_chrome.DisposableChromeEvent.prototype */ {
          dispose: {value: function () {
            this.event.removeListener(this.listener);
          }, writable: true}
        });
      })();
      Object.defineProperty(this, 'DisposableChromeEvent', r);
      return r;
    }}
  });
  /** @name _.org_jetbrains_chromium_debug */ 
  Kotlin.p(_, 'org_jetbrains_chromium_debug', function () {
    function $f0(callback, resultPropertyName, it) {
      callback(it[resultPropertyName]);
    }
    Object.defineProperty(this, 'sendCommand', {value: function (debuggee, method, params, resultPropertyName, callback, errorCallback) {
      if (errorCallback === undefined)
        errorCallback = null;
      _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, method, params, errorCallback, $f0.bind(null, callback, resultPropertyName));
    }});
    function $f1(debuggee, method, callback, errorCallback, it) {
      if (_.org_jetbrains_chrome.successfully()) {
        if (_.org_jetbrains_chromium_debug.LOG.debugEnabled) {
          var m = "DR " + debuggee.tabId + " " + method;
          if (method === "DOM.getDocument")
            _.org_jetbrains_chromium_debug.LOG.debug([m, it["root"].nodeId]);
          else if (method === "CSS.setStyleSheetText")
            _.org_jetbrains_chromium_debug.LOG.debug([m]);
          else
            _.org_jetbrains_chromium_debug.LOG.debug([m, it]);
        }
        callback !== null && callback !== undefined ? callback(it) : null;
      }
       else {
        errorCallback !== null && errorCallback !== undefined ? errorCallback() : null;
      }
    }
    Object.defineProperty(this, 'sendCommand$0', {value: function (debuggee, method, params, errorCallback, callback) {
      if (params === undefined)
        params = null;
      if (errorCallback === undefined)
        errorCallback = null;
      if (callback === undefined)
        callback = null;
      if (_.org_jetbrains_chromium_debug.LOG.debugEnabled) {
        _.org_jetbrains_chromium_debug.LOG.debug(["DC " + debuggee.tabId + " " + method + (params === null || params === undefined ? '' : JSON.stringify(params))]);
      }
      chrome.debugger.sendCommand(debuggee, method, params, $f1.bind(this, debuggee, method, callback, errorCallback));
    }});
    Object.defineProperty(this, 'LOG', {value: Kotlin.modules['browser-ext-platform'].org_jetbrains_logging.getLogger("org.jetbrains.chromium.debug")});
  }, /** @lends _.org_jetbrains_chromium_debug */ {
    RemoteCommandDomain: {value: (function () {
      function $f0(callback, it) {
        this.enabled = true;
        callback !== null && callback !== undefined ? callback() : null;
      }
      function $f1(callback, it) {
        this.enabled = false;
        callback !== null && callback !== undefined ? callback() : null;
      }
      return Kotlin.createClass(null, function (debuggee) {
        Object.defineProperty(this, 'debuggee', {value: debuggee});
        Object.defineProperty(this, '$enabled', {value: false, writable: true});
      }, /** @lends _.org_jetbrains_chromium_debug.RemoteCommandDomain.prototype */ {
        enabled: {
          get: function () {
            return this.$enabled;
          },
          set: function (value) {
            this.$enabled = value;
          }
        },
        callWhenEnabled: {value: function (callback) {
          if (this.enabled)
            callback();
          else
            this.enable(callback, undefined);
        }},
        enable: {value: function (errorCallback, callback) {
          if (errorCallback === undefined)
            errorCallback = null;
          if (callback === undefined)
            callback = null;
          if (this.enabled) {
            callback !== null && callback !== undefined ? callback() : null;
            return;
          }
          _.org_jetbrains_chromium_debug.sendCommand$0(this.debuggee, this.domain + ".enable", null, errorCallback, $f0.bind(this, callback));
        }},
        disable: {value: function (callback) {
          if (callback === undefined)
            callback = null;
          if (this.enabled) {
            _.org_jetbrains_chromium_debug.sendCommand$0(this.debuggee, this.domain + ".disable", null, callback, $f1.bind(this, callback));
          }
        }}
      });
    })()},
    RemotePage: {get: function () {
      var r = (function () {
        return Kotlin.createClass(_.org_jetbrains_chromium_debug.RemoteCommandDomain, function $fun(debuggee) {
          $fun.baseInitializer.call(this, debuggee);
        }, /** @lends _.org_jetbrains_chromium_debug.RemotePage.prototype */ {
          domain: {
            get: function () {
              return "Page";
            }
          },
          reload: {value: function () {
            _.org_jetbrains_chromium_debug.sendCommand$0(this.debuggee, this.domain + ".reload", {ignoreCache: true}, undefined, undefined);
          }}
        });
      })();
      Object.defineProperty(this, 'RemotePage', r);
      return r;
    }}
  });
  /** @name _.org_jetbrains_chromium_debug */ 
  Kotlin.p(_, 'org_jetbrains_chromium_debug', function () {
    Object.defineProperty(this, 'StyleSheetOrigin', {value: (function () {
      return Kotlin.createObject(null, function () {
        Object.defineProperty(this, 'REGULAR', {value: "regular"});
      });
    })()});
  }, /** @lends _.org_jetbrains_chromium_debug */ {
    RemoteCss: {get: function () {
      var r = (function () {
        function $f0(callback, it) {
          callback(it["inlineStyle"], it["attributesStyle"]);
        }
        function $f1(nodeId, callback) {
          _.org_jetbrains_chromium_debug.sendCommand$0(this.debuggee, "CSS.getInlineStylesForNode", {nodeId: nodeId}, undefined, $f0.bind(null, callback));
        }
        function $f2(callback) {
          _.org_jetbrains_chromium_debug.sendCommand(this.debuggee, "CSS.getAllStyleSheets", null, "headers", callback, undefined);
        }
        function $f3(propertyIndex, name, value, it) {
          var property = it.cssProperties[propertyIndex];
          var parsedOk = property.parsedOk;
          if (parsedOk !== null && parsedOk !== undefined && !parsedOk) {
            _.org_jetbrains_chromium_debug.LOG.error("parsedOk false for set css property, actual text: " + Kotlin.stringify(property.text) + " passed name: " + name + ", actual name: " + property.name + ", passed value: " + Kotlin.stringify(value) + ", actual value: " + property.value);
          }
        }
        return Kotlin.createClass(_.org_jetbrains_chromium_debug.RemoteCommandDomain, function $fun(debuggee) {
          $fun.baseInitializer.call(this, debuggee);
        }, /** @lends _.org_jetbrains_chromium_debug.RemoteCss.prototype */ {
          domain: {
            get: function () {
              return "CSS";
            }
          },
          getInlineStylesForNode: {value: function (nodeId, callback) {
            this.callWhenEnabled($f1.bind(this, nodeId, callback));
          }},
          getStyleSheets: {value: function (callback) {
            this.callWhenEnabled($f2.bind(this, callback));
          }},
          getStyleSheet: {value: function (id, callback) {
            _.org_jetbrains_chromium_debug.sendCommand(this.debuggee, "CSS.getStyleSheet", {styleSheetId: id}, "styleSheet", callback, undefined);
          }},
          setStyleSheetText: {value: function (id, text) {
            _.org_jetbrains_chromium_debug.sendCommand$0(this.debuggee, "CSS.setStyleSheetText", {styleSheetId: id, text: text}, undefined, undefined);
          }},
          setProperty: {value: function (style, name, value, onlyExisting) {
            var overwrite = false;
            var index = 0;
            for (var tmp$0 = style.cssProperties, tmp$2 = 0, tmp$1 = tmp$0.length; tmp$2 !== tmp$1; tmp$2++) {
              var property = tmp$0[tmp$2];
              if (Kotlin.equals(property.name, name)) {
                overwrite = true;
                break;
              }
              index++;
            }
            if (!overwrite && onlyExisting) {
              return false;
            }
            this.setProperty$0(style.styleId, index, name, value, overwrite);
            return true;
          }},
          setProperty$0: {value: function (styleId, propertyIndex, name, value, overwrite) {
            var v = value === null || value === undefined ? '' : value;
            _.org_jetbrains_chromium_debug.sendCommand(this.debuggee, "CSS.setPropertyText", {styleId: styleId, propertyIndex: propertyIndex, text: name + ": " + Kotlin.stringify(v) + ";", overwrite: overwrite}, "style", $f3.bind(null, propertyIndex, name, value), null);
          }}
        });
      })();
      Object.defineProperty(this, 'RemoteCss', r);
      return r;
    }}
  });
  /** @name _.org_jetbrains_chromium_debug */ 
  Kotlin.p(_, 'org_jetbrains_chromium_debug', function () {
    Object.defineProperty(this, 'escapeQuotes', {value: function ($receiver) {
      return $receiver.replace(new RegExp("('|" + "\"" + ")", "g"), "\\" + "$" + "1");
    }});
    Object.defineProperty(this, 'RemoteDom', {value: (function () {
      function $f0(disposer, callback, remoteObject) {
        disposer.add(remoteObject);
        callback(remoteObject, disposer);
      }
      function $f1(debuggee, functionDeclaration, callback, remoteObject) {
        var disposer = _.org_jetbrains_chromium_debug.Disposer(debuggee);
        disposer.add(remoteObject);
        var tmp$0;
        _.org_jetbrains_chromium_debug.RemoteRuntime.callFunctionOn(debuggee, (tmp$0 = remoteObject.objectId) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), functionDeclaration, $f0.bind(null, disposer, callback), disposer.releaseCallback, undefined, undefined);
      }
      function $f2(callback, remoteObject, disposer) {
        disposer.release();
        if (callback !== null && callback !== undefined) {
          var tmp$0;
          callback((tmp$0 = remoteObject.value) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE());
        }
      }
      function $f3(disposer, callback, nodeId) {
        disposer.release();
        callback(nodeId);
      }
      function $f4(debuggee, callback, remoteObject, disposer) {
        var tmp$0;
        this.requestNode(debuggee, (tmp$0 = remoteObject.objectId) !== null && tmp$0 !== undefined ? tmp$0 : Kotlin.throwNPE(), $f3.bind(null, disposer, callback), disposer.releaseCallback);
      }
      function $f5(callback, nodeId) {
        callback(nodeId === null || nodeId === undefined || nodeId === 0 ? -1 : nodeId);
      }
      return Kotlin.createObject(null, function () {
        Object.defineProperty(this, 'highlightConfig', {value: _.org_jetbrains_chromium_debug.HighlightConfig()});
      }, {
        resolveNode: {value: function (debuggee, nodeId, callback) {
          _.org_jetbrains_chromium_debug.sendCommand(debuggee, "DOM.resolveNode", {nodeId: nodeId}, "object", callback, undefined);
        }},
        callFunctionOn: {value: function (debuggee, nodeId, functionDeclaration, callback) {
          this.resolveNode(debuggee, nodeId, $f1.bind(this, debuggee, functionDeclaration, callback));
        }},
        computeObject: {value: function (debuggee, nodeId, functionDeclaration, callback) {
          if (callback === undefined)
            callback = null;
          this.callFunctionOn(debuggee, nodeId, functionDeclaration, $f2.bind(null, callback));
        }},
        computeNode: {value: function (debuggee, nodeId, functionDeclaration, callback) {
          this.callFunctionOn(debuggee, nodeId, functionDeclaration, $f4.bind(this, debuggee, callback));
        }},
        requestNode: {value: function (debuggee, objectId, callback, errorCallback) {
          if (errorCallback === undefined)
            errorCallback = null;
          _.org_jetbrains_chromium_debug.sendCommand(debuggee, "DOM.requestNode", {objectId: objectId}, "nodeId", callback, errorCallback);
        }},
        getDocument: {value: function (debuggee, callback) {
          _.org_jetbrains_chromium_debug.sendCommand(debuggee, "DOM.getDocument", null, "root", callback, undefined);
        }},
        querySelector: {value: function (debuggee, nodeId, selector, callback) {
          _.org_jetbrains_chromium_debug.sendCommand(debuggee, "DOM.querySelector", {nodeId: nodeId, selector: selector}, "nodeId", $f5.bind(null, callback), undefined);
        }},
        setAttributeValue: {value: function (debuggee, nodeId, name, value) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "DOM.setAttributeValue", {nodeId: nodeId, name: name, value: value}, undefined, undefined);
        }},
        setNodeValue: {value: function (debuggee, nodeId, value) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "DOM.setNodeValue", {nodeId: nodeId, value: value}, undefined, undefined);
        }},
        setOuterHtml: {value: function (debuggee, nodeId, outerHtml) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "DOM.setOuterHTML", {nodeId: nodeId, outerHTML: outerHtml}, undefined, undefined);
        }},
        requestChildNodes: {value: function (debuggee, nodeId) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "DOM.requestChildNodes", {nodeId: nodeId}, undefined, undefined);
        }},
        highlightNode: {value: function (debuggee, nodeId) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "DOM.highlightNode", {nodeId: nodeId, highlightConfig: this.highlightConfig}, undefined, undefined);
        }},
        hideHighlight: {value: function (debuggee) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "DOM.hideHighlight", undefined, undefined, undefined);
        }}
      });
    })()});
  }, /** @lends _.org_jetbrains_chromium_debug */ {
    HighlightConfig: {value: (function () {
      return Kotlin.createClass(null, function () {
        Object.defineProperty(this, 'contentColor', {value: {r: 111, g: 168, b: 220, a: 0.66}, enumerable: true});
        Object.defineProperty(this, 'paddingColor', {value: {r: 147, g: 196, b: 125, a: 0.55}, enumerable: true});
        Object.defineProperty(this, 'borderColor', {value: {r: 255, g: 229, b: 153, a: 0.66}, enumerable: true});
        Object.defineProperty(this, 'marginColor', {value: {r: 246, g: 178, b: 107, a: 0.66}, enumerable: true});
        Object.defineProperty(this, 'showInfo', {value: true, enumerable: true});
      });
    })()}
  });
  /** @name _.org_jetbrains_chromium_debug */ 
  Kotlin.p(_, 'org_jetbrains_chromium_debug', null, /** @lends _.org_jetbrains_chromium_debug */ {
    RemoteConsole: {get: function () {
      var r = (function () {
        return Kotlin.createClass(_.org_jetbrains_chromium_debug.RemoteCommandDomain, function $fun(debuggee) {
          $fun.baseInitializer.call(this, debuggee);
        }, /** @lends _.org_jetbrains_chromium_debug.RemoteConsole.prototype */ {
          domain: {
            get: function () {
              return "Console";
            }
          }
        });
      })();
      Object.defineProperty(this, 'RemoteConsole', r);
      return r;
    }}
  });
  /** @name _.org_jetbrains_chromium_debug */ 
  Kotlin.p(_, 'org_jetbrains_chromium_debug', function () {
    Object.defineProperty(this, 'SCRIPT_PARSED', {value: "Debugger.scriptParsed"});
  }, /** @lends _.org_jetbrains_chromium_debug */ {
    RemoteDebugger: {get: function () {
      var r = (function () {
        function $f0(callback) {
          callback(this.scripts.values());
        }
        function $f1(callback) {
          Kotlin.modules['browser-ext-platform'].org_jetbrains_util.setTimeout(1000, $f0.bind(this, callback));
        }
        function $f2(scriptId, source) {
          _.org_jetbrains_chromium_debug.sendCommand$0(this.debuggee, "Debugger.setScriptSource", {scriptId: scriptId, scriptSource: source}, undefined, undefined);
        }
        return Kotlin.createClass(_.org_jetbrains_chromium_debug.RemoteCommandDomain, function $fun(debuggee) {
          $fun.baseInitializer.call(this, debuggee);
          Object.defineProperty(this, 'scripts', {value: Kotlin.PrimitiveHashMap()});
        }, /** @lends _.org_jetbrains_chromium_debug.RemoteDebugger.prototype */ {
          domain: {
            get: function () {
              return "Debugger";
            }
          },
          getScripts: {value: function (callback) {
            if (this.enabled) {
              callback(this.scripts.values());
            }
             else {
              this.callWhenEnabled($f1.bind(this, callback));
            }
          }},
          reset: {value: function () {
            this.scripts.clear();
          }},
          scriptParsed: {value: function (info) {
            this.scripts.put(info.url, info);
          }},
          setScriptSource: {value: function (scriptId, source) {
            this.callWhenEnabled($f2.bind(this, scriptId, source));
          }}
        });
      })();
      Object.defineProperty(this, 'RemoteDebugger', r);
      return r;
    }}
  });
  /** @name _.org_jetbrains_chromium_debug */ 
  Kotlin.p(_, 'org_jetbrains_chromium_debug', function () {
    Object.defineProperty(this, 'RemoteRuntime', {value: (function () {
      return Kotlin.createObject(null, null, {
        callFunctionOn: {value: function (debuggee, objectId, functionDeclaration, callback, errorCallback, args, returnByValue) {
          if (errorCallback === undefined)
            errorCallback = null;
          if (args === undefined)
            args = null;
          if (returnByValue === undefined)
            returnByValue = false;
          _.org_jetbrains_chromium_debug.sendCommand(debuggee, "Runtime.callFunctionOn", {objectId: objectId, functionDeclaration: functionDeclaration, returnByValue: returnByValue}, "result", callback, errorCallback);
        }},
        releaseObject: {value: function (debuggee, objectId) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "Runtime.releaseObject", {objectId: objectId}, undefined, undefined);
        }},
        releaseObjectGroup: {value: function (debuggee, objectGroup) {
          _.org_jetbrains_chromium_debug.sendCommand$0(debuggee, "Runtime.releaseObjectGroup", {objectGroup: objectGroup}, undefined, undefined);
        }}
      });
    })()});
  }, /** @lends _.org_jetbrains_chromium_debug */ {
    Disposer: {value: (function () {
      return Kotlin.createClass(null, function (debuggee) {
        Object.defineProperty(this, 'debuggee', {value: debuggee});
        Object.defineProperty(this, 'ids', {value: []});
        Object.defineProperty(this, 'released', {value: false, writable: true});
        Object.defineProperty(this, 'releaseCallback', {value: Kotlin.assignOwner(function $fun() {
          if ($fun.o.released) {
            throw Kotlin.newException(null, 'Exception');
          }
          $fun.o.released = true;
          {
            var tmp$0 = Kotlin.arrayIterator($fun.o.ids);
            while (tmp$0.hasNext()) {
              var id = tmp$0.next();
              _.org_jetbrains_chromium_debug.RemoteRuntime.releaseObject($fun.o.debuggee, id);
            }
          }
        }, this)});
      }, /** @lends _.org_jetbrains_chromium_debug.Disposer.prototype */ {
        add: {value: function (remoteObject) {
          if (this.released) {
            throw Kotlin.newException(null, 'Exception');
          }
          var objectId = remoteObject.objectId;
          if (objectId !== null && objectId !== undefined) {
            this.ids.push(objectId);
          }
        }},
        release: {value: function () {
          this.releaseCallback();
        }}
      });
    })()}
  });
  Kotlin.finalize(_);
  return _;
});

//# sourceMappingURL=jb-chrome-ext-api.js.map