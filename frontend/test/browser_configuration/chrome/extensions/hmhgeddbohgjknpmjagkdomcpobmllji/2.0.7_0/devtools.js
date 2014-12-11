"use strict";

function log(m) {
  chrome.devtools.inspectedWindow.eval("console.log('jb devtool: ', '" + JSON.stringify(m) + "')")
}

function log2(m) {
  m = m.replace(/'|"/g, "\\'");
  chrome.devtools.inspectedWindow.eval("console.log('" + m + "')")
}

function escapeQuotes(s) {
  return s.replace(/('|")/g, "\\$1");
}

function reloadPageCallback(result, isException) {
  if (!isException) {
    if (result > 0) {
      chrome.devtools.inspectedWindow.reload({ignoreCache: true});
    }
  }
}

// we cannot use simple messaging because there is no way to send request from background page to devtools (develar – neither chrome.extension.sendRequest nor chrome.tabs.sendRequest)
(function () {
  var tabId = chrome.devtools.inspectedWindow.tabId;
  // it is funny, but it can occurs
  if (tabId === undefined) {
    console.log("cannot get inspected window tab id")
    return;
  }

  var port = chrome.runtime.connect();
  port.postMessage({tabId: tabId})
  port.onMessage.addListener(function (message) {
    var expression = "$$('" + message.selector + "')";
    if (!message.hasOwnProperty("value")) {
      chrome.devtools.inspectedWindow.eval(expression + ".length", reloadPageCallback);
      return;
    }

    // Function is not working.
    // Variable declaration is not working.
    // This backend is not reliable.
    expression += "[0].";
    //log2(expression)
    if (message.hasOwnProperty("name")) {
      var value = escapeQuotes(message.value);
      expression += "setAttribute('" + message.name + "', '" + value + "')";
    }
    else {
      expression += "childNodes[0].nodeValue = '" + message.value + "'";
    }

    //log2(expression)
    chrome.devtools.inspectedWindow.eval(expression)
  })
}())
