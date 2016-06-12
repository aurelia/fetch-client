var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };



export function json(body) {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}

export var HttpClientConfiguration = function () {
  function HttpClientConfiguration() {
    

    this.baseUrl = '';
    this.defaults = {};
    this.interceptors = [];
  }

  HttpClientConfiguration.prototype.withBaseUrl = function withBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  };

  HttpClientConfiguration.prototype.withDefaults = function withDefaults(defaults) {
    this.defaults = defaults;
    return this;
  };

  HttpClientConfiguration.prototype.withInterceptor = function withInterceptor(interceptor) {
    this.interceptors.push(interceptor);
    return this;
  };

  HttpClientConfiguration.prototype.useStandardConfiguration = function useStandardConfiguration() {
    var standardConfig = { credentials: 'same-origin' };
    Object.assign(this.defaults, standardConfig, this.defaults);
    return this.rejectErrorResponses();
  };

  HttpClientConfiguration.prototype.rejectErrorResponses = function rejectErrorResponses() {
    return this.withInterceptor({ response: rejectOnError });
  };

  return HttpClientConfiguration;
}();

function rejectOnError(response) {
  if (!response.ok) {
    throw response;
  }

  return response;
}

export var HttpClient = function () {
  function HttpClient() {
    

    this.activeRequestCount = 0;
    this.isRequesting = false;
    this.isConfigured = false;
    this.baseUrl = '';
    this.defaults = null;
    this.interceptors = [];

    if (typeof fetch === 'undefined') {
      throw new Error('HttpClient requires a Fetch API implementation, but the current environment doesn\'t support it. You may need to load a polyfill such as https://github.com/github/fetch.');
    }
  }

  HttpClient.prototype.configure = function configure(config) {
    var _interceptors;

    var normalizedConfig = void 0;

    if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
      normalizedConfig = { defaults: config };
    } else if (typeof config === 'function') {
      normalizedConfig = new HttpClientConfiguration();
      var c = config(normalizedConfig);
      if (HttpClientConfiguration.prototype.isPrototypeOf(c)) {
        normalizedConfig = c;
      }
    } else {
      throw new Error('invalid config');
    }

    var defaults = normalizedConfig.defaults;
    if (defaults && Headers.prototype.isPrototypeOf(defaults.headers)) {
      throw new Error('Default headers must be a plain object.');
    }

    this.baseUrl = normalizedConfig.baseUrl;
    this.defaults = defaults;
    (_interceptors = this.interceptors).push.apply(_interceptors, normalizedConfig.interceptors || []);
    this.isConfigured = true;

    return this;
  };

  HttpClient.prototype.fetch = function (_fetch) {
    function fetch(_x, _x2) {
      return _fetch.apply(this, arguments);
    }

    fetch.toString = function () {
      return _fetch.toString();
    };

    return fetch;
  }(function (input, init) {
    var _this = this;

    trackRequestStart.call(this);

    var request = Promise.resolve().then(function () {
      return buildRequest.call(_this, input, init, _this.defaults);
    });
    var promise = processRequest(request, this.interceptors).then(function (result) {
      var response = null;

      if (Response.prototype.isPrototypeOf(result)) {
        response = result;
      } else if (Request.prototype.isPrototypeOf(result)) {
        request = Promise.resolve(result);
        response = fetch(result);
      } else {
        throw new Error('An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [' + result + ']');
      }

      return request.then(function (_request) {
        return processResponse(response, _this.interceptors, _request);
      });
    });

    return trackRequestEndWith.call(this, promise);
  });

  return HttpClient;
}();

var absoluteUrlRegexp = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

function trackRequestStart() {
  this.isRequesting = !! ++this.activeRequestCount;
}

function trackRequestEnd() {
  this.isRequesting = !! --this.activeRequestCount;
}

function trackRequestEndWith(promise) {
  var handle = trackRequestEnd.bind(this);
  promise.then(handle, handle);
  return promise;
}

function parseHeaderValues(headers) {
  var parsedHeaders = {};
  for (var name in headers || {}) {
    if (headers.hasOwnProperty(name)) {
      parsedHeaders[name] = typeof headers[name] === 'function' ? headers[name]() : headers[name];
    }
  }
  return parsedHeaders;
}

function buildRequest(input, init) {
  var defaults = this.defaults || {};
  var request = void 0;
  var body = void 0;
  var requestContentType = void 0;

  var parsedDefaultHeaders = parseHeaderValues(defaults.headers);
  if (Request.prototype.isPrototypeOf(input)) {
    request = input;
    requestContentType = new Headers(request.headers).get('Content-Type');
  } else {
    init || (init = {});
    body = init.body;
    var bodyObj = body ? { body: body } : null;
    var requestInit = Object.assign({}, defaults, { headers: {} }, init, bodyObj);
    requestContentType = new Headers(requestInit.headers).get('Content-Type');
    request = new Request(getRequestUrl(this.baseUrl, input), requestInit);
  }
  if (!requestContentType && new Headers(parsedDefaultHeaders).has('content-type')) {
    request.headers.set('Content-Type', new Headers(parsedDefaultHeaders).get('content-type'));
  }
  setDefaultHeaders(request.headers, parsedDefaultHeaders);
  if (body && Blob.prototype.isPrototypeOf(body) && body.type) {
    request.headers.set('Content-Type', body.type);
  }
  return request;
}

function getRequestUrl(baseUrl, url) {
  if (absoluteUrlRegexp.test(url)) {
    return url;
  }

  return (baseUrl || '') + url;
}

function setDefaultHeaders(headers, defaultHeaders) {
  for (var name in defaultHeaders || {}) {
    if (defaultHeaders.hasOwnProperty(name) && !headers.has(name)) {
      headers.set(name, defaultHeaders[name]);
    }
  }
}

function processRequest(request, interceptors) {
  return applyInterceptors(request, interceptors, 'request', 'requestError');
}

function processResponse(response, interceptors, request) {
  return applyInterceptors(response, interceptors, 'response', 'responseError', request);
}

function applyInterceptors(input, interceptors, successName, errorName) {
  for (var _len = arguments.length, interceptorArgs = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
    interceptorArgs[_key - 4] = arguments[_key];
  }

  return (interceptors || []).reduce(function (chain, interceptor) {
    var successHandler = interceptor[successName];
    var errorHandler = interceptor[errorName];

    return chain.then(successHandler && function (value) {
      return successHandler.call.apply(successHandler, [interceptor, value].concat(interceptorArgs));
    } || identity, errorHandler && function (reason) {
      return errorHandler.call.apply(errorHandler, [interceptor, reason].concat(interceptorArgs));
    } || thrower);
  }, Promise.resolve(input));
}

function identity(x) {
  return x;
}

function thrower(x) {
  throw x;
}