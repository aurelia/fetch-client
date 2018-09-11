'use strict';

System.register(['aurelia-pal'], function (_export, _context) {
  "use strict";

  var PLATFORM, DOM, _typeof, retryStrategy, defaultRetryConfig, RetryInterceptor, retryStrategies, HttpClientConfiguration, HttpClient, absoluteUrlRegexp;

  

  function json(body, replacer) {
    return JSON.stringify(body !== undefined ? body : {}, replacer);
  }

  _export('json', json);

  function calculateDelay(retryConfig) {
    var interval = retryConfig.interval,
        strategy = retryConfig.strategy,
        minRandomInterval = retryConfig.minRandomInterval,
        maxRandomInterval = retryConfig.maxRandomInterval,
        counter = retryConfig.counter;


    if (typeof strategy === 'function') {
      return retryConfig.strategy(counter);
    }

    switch (strategy) {
      case retryStrategy.fixed:
        return retryStrategies[retryStrategy.fixed](interval);
      case retryStrategy.incremental:
        return retryStrategies[retryStrategy.incremental](counter, interval);
      case retryStrategy.exponential:
        return retryStrategies[retryStrategy.exponential](counter, interval);
      case retryStrategy.random:
        return retryStrategies[retryStrategy.random](counter, interval, minRandomInterval, maxRandomInterval);
      default:
        throw new Error('Unrecognized retry strategy');
    }
  }

  function rejectOnError(response) {
    if (!response.ok) {
      throw response;
    }

    return response;
  }

  function trackRequestStart() {
    this.isRequesting = !!++this.activeRequestCount;
  }

  function trackRequestEnd() {
    this.isRequesting = !! --this.activeRequestCount;
    if (!this.isRequesting) {
      var evt = DOM.createCustomEvent('aurelia-fetch-client-requests-drained', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return DOM.dispatchEvent(evt);
      }, 1);
    }
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

  function processRequest(request, interceptors, http) {
    return applyInterceptors(request, interceptors, 'request', 'requestError', http);
  }

  function processResponse(response, interceptors, request, http) {
    return applyInterceptors(response, interceptors, 'response', 'responseError', request, http);
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

  function isJSON(str) {
    try {
      JSON.parse(str);
    } catch (err) {
      return false;
    }

    return true;
  }

  function identity(x) {
    return x;
  }

  function thrower(x) {
    throw x;
  }

  function callFetch(input, body, init, method) {
    if (!init) {
      init = {};
    }
    init.method = method;
    if (body) {
      init.body = body;
    }
    return this.fetch(input, init);
  }
  return {
    setters: [function (_aureliaPal) {
      PLATFORM = _aureliaPal.PLATFORM;
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      _export('retryStrategy', retryStrategy = {
        fixed: 0,
        incremental: 1,
        exponential: 2,
        random: 3
      });

      _export('retryStrategy', retryStrategy);

      defaultRetryConfig = {
        maxRetries: 3,
        interval: 1000,
        strategy: retryStrategy.fixed
      };

      _export('RetryInterceptor', RetryInterceptor = function () {
        function RetryInterceptor(retryConfig) {
          

          this.retryConfig = Object.assign({}, defaultRetryConfig, retryConfig || {});

          if (this.retryConfig.strategy === retryStrategy.exponential && this.retryConfig.interval <= 1000) {
            throw new Error('An interval less than or equal to 1 second is not allowed when using the exponential retry strategy');
          }
        }

        RetryInterceptor.prototype.request = function (_request) {
          function request(_x) {
            return _request.apply(this, arguments);
          }

          request.toString = function () {
            return _request.toString();
          };

          return request;
        }(function (request) {
          if (!request.retryConfig) {
            request.retryConfig = Object.assign({}, this.retryConfig);
            request.retryConfig.counter = 0;
          }

          request.retryConfig.requestClone = request.clone();

          return request;
        });

        RetryInterceptor.prototype.response = function (_response) {
          function response(_x2, _x3) {
            return _response.apply(this, arguments);
          }

          response.toString = function () {
            return _response.toString();
          };

          return response;
        }(function (response, request) {
          delete request.retryConfig;
          return response;
        });

        RetryInterceptor.prototype.responseError = function responseError(error, request, httpClient) {
          var retryConfig = request.retryConfig;
          var requestClone = retryConfig.requestClone;

          return Promise.resolve().then(function () {
            if (retryConfig.counter < retryConfig.maxRetries) {
              var result = retryConfig.doRetry ? retryConfig.doRetry(error, request) : true;

              return Promise.resolve(result).then(function (doRetry) {
                if (doRetry) {
                  retryConfig.counter++;
                  return new Promise(function (resolve) {
                    return PLATFORM.global.setTimeout(resolve, calculateDelay(retryConfig) || 0);
                  }).then(function () {
                    var newRequest = requestClone.clone();
                    if (typeof retryConfig.beforeRetry === 'function') {
                      return retryConfig.beforeRetry(newRequest, httpClient);
                    }
                    return newRequest;
                  }).then(function (newRequest) {
                    return httpClient.fetch(Object.assign(newRequest, { retryConfig: retryConfig }));
                  });
                }

                delete request.retryConfig;
                throw error;
              });
            }

            delete request.retryConfig;
            throw error;
          });
        };

        return RetryInterceptor;
      }());

      _export('RetryInterceptor', RetryInterceptor);

      retryStrategies = [function (interval) {
        return interval;
      }, function (retryCount, interval) {
        return interval * retryCount;
      }, function (retryCount, interval) {
        return retryCount === 1 ? interval : Math.pow(interval, retryCount) / 1000;
      }, function (retryCount, interval) {
        var minRandomInterval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var maxRandomInterval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 60000;

        return Math.random() * (maxRandomInterval - minRandomInterval) + minRandomInterval;
      }];

      _export('HttpClientConfiguration', HttpClientConfiguration = function () {
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

        HttpClientConfiguration.prototype.withRetry = function withRetry(config) {
          var interceptor = new RetryInterceptor(config);

          return this.withInterceptor(interceptor);
        };

        return HttpClientConfiguration;
      }());

      _export('HttpClientConfiguration', HttpClientConfiguration);

      _export('HttpClient', HttpClient = function () {
        function HttpClient() {
          

          this.activeRequestCount = 0;
          this.isRequesting = false;
          this.isConfigured = false;
          this.baseUrl = '';
          this.defaults = null;
          this.interceptors = [];

          if (typeof fetch === 'undefined') {
            throw new Error('HttpClient requires a Fetch API implementation, but the current environment doesn\'t support it. You may need to load a polyfill such as https://github.com/github/fetch');
          }
        }

        HttpClient.prototype.configure = function configure(config) {
          var normalizedConfig = void 0;

          if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
            normalizedConfig = { defaults: config };
          } else if (typeof config === 'function') {
            normalizedConfig = new HttpClientConfiguration();
            normalizedConfig.baseUrl = this.baseUrl;
            normalizedConfig.defaults = Object.assign({}, this.defaults);
            normalizedConfig.interceptors = this.interceptors;

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

          var interceptors = normalizedConfig.interceptors;

          if (interceptors && interceptors.length) {
            if (interceptors.filter(function (x) {
              return RetryInterceptor.prototype.isPrototypeOf(x);
            }).length > 1) {
              throw new Error('Only one RetryInterceptor is allowed.');
            }

            var retryInterceptorIndex = interceptors.findIndex(function (x) {
              return RetryInterceptor.prototype.isPrototypeOf(x);
            });

            if (retryInterceptorIndex >= 0 && retryInterceptorIndex !== interceptors.length - 1) {
              throw new Error('The retry interceptor must be the last interceptor defined.');
            }
          }

          this.baseUrl = normalizedConfig.baseUrl;
          this.defaults = defaults;
          this.interceptors = normalizedConfig.interceptors || [];
          this.isConfigured = true;

          return this;
        };

        HttpClient.prototype.fetch = function (_fetch) {
          function fetch(_x6, _x7) {
            return _fetch.apply(this, arguments);
          }

          fetch.toString = function () {
            return _fetch.toString();
          };

          return fetch;
        }(function (input, init) {
          var _this = this;

          trackRequestStart.call(this);

          var request = this.buildRequest(input, init);
          return processRequest(request, this.interceptors, this).then(function (result) {
            var response = null;

            if (Response.prototype.isPrototypeOf(result)) {
              response = Promise.resolve(result);
            } else if (Request.prototype.isPrototypeOf(result)) {
              request = result;
              response = fetch(result);
            } else {
              throw new Error('An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [' + result + ']');
            }

            return processResponse(response, _this.interceptors, request, _this);
          }).then(function (result) {
            if (Request.prototype.isPrototypeOf(result)) {
              return _this.fetch(result);
            }
            trackRequestEnd.call(_this);
            return result;
          });
        });

        HttpClient.prototype.buildRequest = function buildRequest(input, init) {
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
          if (!requestContentType) {
            if (new Headers(parsedDefaultHeaders).has('content-type')) {
              request.headers.set('Content-Type', new Headers(parsedDefaultHeaders).get('content-type'));
            } else if (body && isJSON(body)) {
              request.headers.set('Content-Type', 'application/json');
            }
          }
          setDefaultHeaders(request.headers, parsedDefaultHeaders);
          if (body && Blob.prototype.isPrototypeOf(body) && body.type) {
            request.headers.set('Content-Type', body.type);
          }
          return request;
        };

        HttpClient.prototype.get = function get(input, init) {
          return this.fetch(input, init);
        };

        HttpClient.prototype.post = function post(input, body, init) {
          return callFetch.call(this, input, body, init, 'post');
        };

        HttpClient.prototype.put = function put(input, body, init) {
          return callFetch.call(this, input, body, init, 'put');
        };

        HttpClient.prototype.patch = function patch(input, body, init) {
          return callFetch.call(this, input, body, init, 'patch');
        };

        HttpClient.prototype.delete = function _delete(input, body, init) {
          return callFetch.call(this, input, body, init, 'delete');
        };

        return HttpClient;
      }());

      _export('HttpClient', HttpClient);

      absoluteUrlRegexp = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
    }
  };
});