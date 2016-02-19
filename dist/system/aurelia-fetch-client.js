System.register(['core-js'], function (_export) {
  'use strict';

  var HttpClientConfiguration, HttpClient;

  _export('json', json);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function json(body) {
    return new Blob([JSON.stringify(body)], { type: 'application/json' });
  }

  function rejectOnError(response) {
    if (!response.ok) {
      throw response;
    }

    return response;
  }

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

    if (Request.prototype.isPrototypeOf(input)) {
      if (!this.isConfigured) {
        return input;
      }

      source = input;
      url = input.url;
      if (input.method !== 'GET' && input.method !== 'HEAD') {
        body = input.blob();
      }
    } else {
      source = init;
      url = input;
      body = init.body;
    }

    var bodyObj = body ? { body: body } : null;
    var parsedDefaultHeaders = parseHeaderValues(defaults.headers);
    var requestInit = Object.assign({}, defaults, { headers: {} }, source, bodyObj);
    var requestContentType = new Headers(requestInit.headers).get('Content-Type');
    var request = new Request((this.baseUrl || '') + url, requestInit);
    if (!requestContentType && new Headers(parsedDefaultHeaders).has('content-type')) {
      request.headers.set('Content-Type', new Headers(parsedDefaultHeaders).get('content-type'));
    }
    setDefaultHeaders(request.headers, parsedDefaultHeaders);

    if (body && Blob.prototype.isPrototypeOf(body) && body.type) {
      request.headers.set('Content-Type', body.type);
    }

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
      }, errorHandler && function (reason) {
        return errorHandler.call.apply(errorHandler, [interceptor, reason].concat(interceptorArgs));
      });
    }, Promise.resolve(input));
  }
  return {
    setters: [function (_coreJs) {}],
    execute: function () {
      HttpClientConfiguration = (function () {
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

      _export('HttpClientConfiguration', HttpClientConfiguration);

      HttpClient = (function () {
        function HttpClient() {
          _classCallCheck(this, HttpClient);

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

          var normalizedConfig = undefined;

          if (typeof config === 'object') {
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
      })();

      _export('HttpClient', HttpClient);
    }
  };
});