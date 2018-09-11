import { PLATFORM, DOM } from 'aurelia-pal';

export function json(body, replacer) {
  return JSON.stringify(body !== undefined ? body : {}, replacer);
}

export const retryStrategy = {
  fixed: 0,
  incremental: 1,
  exponential: 2,
  random: 3
};

const defaultRetryConfig = {
  maxRetries: 3,
  interval: 1000,
  strategy: retryStrategy.fixed
};

export let RetryInterceptor = class RetryInterceptor {

  constructor(retryConfig) {
    this.retryConfig = Object.assign({}, defaultRetryConfig, retryConfig || {});

    if (this.retryConfig.strategy === retryStrategy.exponential && this.retryConfig.interval <= 1000) {
      throw new Error('An interval less than or equal to 1 second is not allowed when using the exponential retry strategy');
    }
  }

  request(request) {
    if (!request.retryConfig) {
      request.retryConfig = Object.assign({}, this.retryConfig);
      request.retryConfig.counter = 0;
    }

    request.retryConfig.requestClone = request.clone();

    return request;
  }

  response(response, request) {
    delete request.retryConfig;
    return response;
  }

  responseError(error, request, httpClient) {
    const { retryConfig } = request;
    const { requestClone } = retryConfig;
    return Promise.resolve().then(() => {
      if (retryConfig.counter < retryConfig.maxRetries) {
        const result = retryConfig.doRetry ? retryConfig.doRetry(error, request) : true;

        return Promise.resolve(result).then(doRetry => {
          if (doRetry) {
            retryConfig.counter++;
            return new Promise(resolve => PLATFORM.global.setTimeout(resolve, calculateDelay(retryConfig) || 0)).then(() => {
              let newRequest = requestClone.clone();
              if (typeof retryConfig.beforeRetry === 'function') {
                return retryConfig.beforeRetry(newRequest, httpClient);
              }
              return newRequest;
            }).then(newRequest => {
              return httpClient.fetch(Object.assign(newRequest, { retryConfig }));
            });
          }

          delete request.retryConfig;
          throw error;
        });
      }

      delete request.retryConfig;
      throw error;
    });
  }
};

function calculateDelay(retryConfig) {
  const { interval, strategy, minRandomInterval, maxRandomInterval, counter } = retryConfig;

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

const retryStrategies = [interval => interval, (retryCount, interval) => interval * retryCount, (retryCount, interval) => retryCount === 1 ? interval : Math.pow(interval, retryCount) / 1000, (retryCount, interval, minRandomInterval = 0, maxRandomInterval = 60000) => {
  return Math.random() * (maxRandomInterval - minRandomInterval) + minRandomInterval;
}];

export let HttpClientConfiguration = class HttpClientConfiguration {
  constructor() {
    this.baseUrl = '';
    this.defaults = {};
    this.interceptors = [];
  }

  withBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }

  withDefaults(defaults) {
    this.defaults = defaults;
    return this;
  }

  withInterceptor(interceptor) {
    this.interceptors.push(interceptor);
    return this;
  }

  useStandardConfiguration() {
    let standardConfig = { credentials: 'same-origin' };
    Object.assign(this.defaults, standardConfig, this.defaults);
    return this.rejectErrorResponses();
  }

  rejectErrorResponses() {
    return this.withInterceptor({ response: rejectOnError });
  }

  withRetry(config) {
    const interceptor = new RetryInterceptor(config);

    return this.withInterceptor(interceptor);
  }
};

function rejectOnError(response) {
  if (!response.ok) {
    throw response;
  }

  return response;
}

export let HttpClient = class HttpClient {
  constructor() {
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

  configure(config) {
    let normalizedConfig;

    if (typeof config === 'object') {
      normalizedConfig = { defaults: config };
    } else if (typeof config === 'function') {
      normalizedConfig = new HttpClientConfiguration();
      normalizedConfig.baseUrl = this.baseUrl;
      normalizedConfig.defaults = Object.assign({}, this.defaults);
      normalizedConfig.interceptors = this.interceptors;

      let c = config(normalizedConfig);
      if (HttpClientConfiguration.prototype.isPrototypeOf(c)) {
        normalizedConfig = c;
      }
    } else {
      throw new Error('invalid config');
    }

    let defaults = normalizedConfig.defaults;
    if (defaults && Headers.prototype.isPrototypeOf(defaults.headers)) {
      throw new Error('Default headers must be a plain object.');
    }

    let interceptors = normalizedConfig.interceptors;

    if (interceptors && interceptors.length) {
      if (interceptors.filter(x => RetryInterceptor.prototype.isPrototypeOf(x)).length > 1) {
        throw new Error('Only one RetryInterceptor is allowed.');
      }

      const retryInterceptorIndex = interceptors.findIndex(x => RetryInterceptor.prototype.isPrototypeOf(x));

      if (retryInterceptorIndex >= 0 && retryInterceptorIndex !== interceptors.length - 1) {
        throw new Error('The retry interceptor must be the last interceptor defined.');
      }
    }

    this.baseUrl = normalizedConfig.baseUrl;
    this.defaults = defaults;
    this.interceptors = normalizedConfig.interceptors || [];
    this.isConfigured = true;

    return this;
  }

  fetch(input, init) {
    trackRequestStart.call(this);

    let request = this.buildRequest(input, init);
    return processRequest(request, this.interceptors, this).then(result => {
      let response = null;

      if (Response.prototype.isPrototypeOf(result)) {
        response = Promise.resolve(result);
      } else if (Request.prototype.isPrototypeOf(result)) {
        request = result;
        response = fetch(result);
      } else {
        throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${result}]`);
      }

      return processResponse(response, this.interceptors, request, this);
    }).then(result => {
      if (Request.prototype.isPrototypeOf(result)) {
        return this.fetch(result);
      }
      trackRequestEnd.call(this);
      return result;
    });
  }

  buildRequest(input, init) {
    let defaults = this.defaults || {};
    let request;
    let body;
    let requestContentType;

    let parsedDefaultHeaders = parseHeaderValues(defaults.headers);
    if (Request.prototype.isPrototypeOf(input)) {
      request = input;
      requestContentType = new Headers(request.headers).get('Content-Type');
    } else {
      init || (init = {});
      body = init.body;
      let bodyObj = body ? { body } : null;
      let requestInit = Object.assign({}, defaults, { headers: {} }, init, bodyObj);
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
  }

  get(input, init) {
    return this.fetch(input, init);
  }

  post(input, body, init) {
    return callFetch.call(this, input, body, init, 'post');
  }

  put(input, body, init) {
    return callFetch.call(this, input, body, init, 'put');
  }

  patch(input, body, init) {
    return callFetch.call(this, input, body, init, 'patch');
  }

  delete(input, body, init) {
    return callFetch.call(this, input, body, init, 'delete');
  }
};

const absoluteUrlRegexp = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

function trackRequestStart() {
  this.isRequesting = !!++this.activeRequestCount;
}

function trackRequestEnd() {
  this.isRequesting = !! --this.activeRequestCount;
  if (!this.isRequesting) {
    let evt = DOM.createCustomEvent('aurelia-fetch-client-requests-drained', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}

function parseHeaderValues(headers) {
  let parsedHeaders = {};
  for (let name in headers || {}) {
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
  for (let name in defaultHeaders || {}) {
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

function applyInterceptors(input, interceptors, successName, errorName, ...interceptorArgs) {
  return (interceptors || []).reduce((chain, interceptor) => {
    let successHandler = interceptor[successName];
    let errorHandler = interceptor[errorName];

    return chain.then(successHandler && (value => successHandler.call(interceptor, value, ...interceptorArgs)) || identity, errorHandler && (reason => errorHandler.call(interceptor, reason, ...interceptorArgs)) || thrower);
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