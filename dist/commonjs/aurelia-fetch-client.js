'use strict';

exports.__esModule = true;
exports.json = json;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js');

function json(body) {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}

var HttpClientConfiguration = (function () {
  function HttpClientConfiguration() {
    _classCallCheck(this, HttpClientConfiguration);

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
})();

exports.HttpClientConfiguration = HttpClientConfiguration;

function rejectOnError(response) {
  if (!response.ok) {
    throw response;
  }

  return response;
}

var HttpClient = (function () {
  function HttpClient() {
    _classCallCheck(this, HttpClient);

    this.activeRequestCount = 0;
    this.isRequesting = false;
    this.isConfigured = false;
    this.baseUrl = '';
    this.defaults = null;
    this.interceptors = [];
  }

  HttpClient.prototype.configure = function configure(config) {
    var _interceptors;

    var normalizedConfig = undefined;

    if (typeof config === 'object') {
      normalizedConfig = { defaults: config };
    } else if (typeof config === 'function') {
      normalizedConfig = new HttpClientConfiguration();
      var c = config(normalizedConfig);
      if (typeof c === HttpClientConfiguration) {
        normalizedConfig = c;
      }
    } else {
      throw new Error('invalid config');
    }

    var defaults = normalizedConfig.defaults;
    if (defaults && defaults.headers instanceof Headers) {
      throw new Error('Default headers must be a plain object.');
    }

    this.baseUrl = normalizedConfig.baseUrl;
    this.defaults = defaults;
    (_interceptors = this.interceptors).push.apply(_interceptors, normalizedConfig.interceptors || []);
    this.isConfigured = true;

    return this;
  };

  HttpClient.prototype.fetch = (function (_fetch) {
    function fetch(_x, _x2) {
      return _fetch.apply(this, arguments);
    }

    fetch.toString = function () {
      return _fetch.toString();
    };

    return fetch;
  })(function (input, init) {
    var _this = this;

    trackRequestStart.call(this);

    var request = Promise.resolve().then(function () {
      return buildRequest.call(_this, input, init, _this.defaults);
    });
    var promise = processRequest(request, this.interceptors).then(function (result) {
      var response = null;

      if (result instanceof Response) {
        response = result;
      } else if (result instanceof Request) {
        response = fetch(result);
      } else {
        throw new Error('An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [' + result + ']');
      }

      return processResponse(response, _this.interceptors);
    });

    return trackRequestEndWith.call(this, promise);
  });

  return HttpClient;
})();

exports.HttpClient = HttpClient;

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
  for (var _name in headers || {}) {
    if (headers.hasOwnProperty(_name)) {
      parsedHeaders[_name] = typeof headers[_name] === 'function' ? headers[_name]() : headers[_name];
    }
  }
  return parsedHeaders;
}

function buildRequest(input) {
  var init = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var defaults = this.defaults || {};
  var source = undefined;
  var url = undefined;
  var body = undefined;

  if (input instanceof Request) {
    if (!this.isConfigured) {
      return input;
    }

    source = input;
    url = input.url;
    body = input.blob();
  } else {
    source = init;
    url = input;
    body = init.body;
  }

  var parsedDefaultHeaders = parseHeaderValues(defaults.headers);
  var requestInit = Object.assign({}, defaults, { headers: {} }, source, { body: body });
  var request = new Request((this.baseUrl || '') + url, requestInit);
  setDefaultHeaders(request.headers, parsedDefaultHeaders);

  return request;
}

function setDefaultHeaders(headers, defaultHeaders) {
  for (var _name2 in defaultHeaders || {}) {
    if (defaultHeaders.hasOwnProperty(_name2) && !headers.has(_name2)) {
      headers.set(_name2, defaultHeaders[_name2]);
    }
  }
}

function processRequest(request, interceptors) {
  return applyInterceptors(request, interceptors, 'request', 'requestError');
}

function processResponse(response, interceptors) {
  return applyInterceptors(response, interceptors, 'response', 'responseError');
}

function applyInterceptors(input, interceptors, successName, errorName) {
  return (interceptors || []).reduce(function (chain, interceptor) {
    var successHandler = interceptor[successName];
    var errorHandler = interceptor[errorName];

    return chain.then(successHandler && successHandler.bind(interceptor), errorHandler && errorHandler.bind(interceptor));
  }, Promise.resolve(input));
}