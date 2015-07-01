'use strict';

exports.__esModule = true;
exports.json = json;
exports.mergeHeaders = mergeHeaders;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function json(body) {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}

function mergeHeaders(first, second) {
  var headers = new Headers(first || {});
  new Headers(second || {}).forEach(function (value, name) {
    headers.set(name, value);
  });

  return headers;
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
    this.interceptors = [];
    this.isConfigured = false;
    this.baseUrl = '';
    this.defaults = null;
  }

  HttpClient.prototype.configure = function configure(config) {
    var normalizedConfig = undefined;

    if (typeof config === 'string') {
      normalizedConfig = { baseUrl: config };
    } else if (typeof config === 'object') {
      normalizedConfig = { defaults: config };
    } else if (typeof config === 'function') {
      normalizedConfig = new HttpClientConfiguration();
      config(normalizedConfig);
    } else {
      throw new Error('invalid config');
    }

    this.baseUrl = normalizedConfig.baseUrl;
    this.defaults = normalizedConfig.defaults;
    (normalizedConfig.interceptors || []).forEach(this.addInterceptor.bind(this));
    this.isConfigured = true;
  };

  HttpClient.prototype.addInterceptor = function addInterceptor(interceptor) {
    this.interceptors.push(interceptor);
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

    var request = buildRequest.call(this, input, init, this.defaults);
    trackRequestStart.call(this);

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

function trackRequestEnd(client) {
  this.isRequesting = !! --this.activeRequestCount;
}

function trackRequestEndWith(promise) {
  var handle = trackRequestEnd.bind(this);
  promise.then(handle, handle);
  return promise;
}

function buildRequest(input) {
  var init = arguments[1] === undefined ? {} : arguments[1];

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

  var headers = mergeHeaders(defaults.headers, source.headers);
  var requestInit = Object.assign({}, defaults, source, { body: body, headers: headers });

  return new Request((this.baseUrl || '') + url, requestInit);
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