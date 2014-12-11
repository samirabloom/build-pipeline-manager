function kt_invoke(o, m, args) {
  o[m].apply(o, args);
}

function createRequestMatcher() {
  return new chrome.declarativeWebRequest.RequestMatcher(createObjectFromArguments(arguments));
}

function createRedirectRequest(url) {
  return new chrome.declarativeWebRequest.RedirectRequest({redirectUrl: url});
}

function createObjectFromArguments(list) {
  var r = {};
  for (var i = 0, n = list.length; i < n; i += 2) {
    var value = list[i + 1];
    if (value !== null) {
      r[list[i]] = value;
    }
  }
  return r;
}

function isObjectEmpty(o) {
  for (var p in o) {
    if (o.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUrl(spec) {
  var url = {};
  var m = spec.match(/^([^:\/?#]+):\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/);
  if (m === null) {
    return null;
  }

  var i = 14;
  while (i--) {
    url[parseUrl.keys[i]] = m[i] || null;
  }
  return url;
}

parseUrl.keys = ["source", "scheme", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"];