
export function json(body) {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}

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
      throw new Error('HttpClient requires a Fetch API implementation, but the current environment doesn\'t support it. You may need to load a polyfill such as https://github.com/github/fetch.');
    }
  }

  configure(config) {
    let normalizedConfig;

    if (typeof config === 'object') {
      normalizedConfig = { defaults: config };
    } else if (typeof config === 'function') {
      normalizedConfig = new HttpClientConfiguration();
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

    this.baseUrl = normalizedConfig.baseUrl;
    this.defaults = defaults;
    this.interceptors.push(...(normalizedConfig.interceptors || []));
    this.isConfigured = true;

    return this;
  }

  fetch(input, init) {
    trackRequestStart.call(this);

    let request = Promise.resolve().then(() => buildRequest.call(this, input, init, this.defaults));
    let promise = processRequest(request, this.interceptors).then(result => {
      let response = null;

      if (Response.prototype.isPrototypeOf(result)) {
        response = result;
      } else if (Request.prototype.isPrototypeOf(result)) {
        request = Promise.resolve(result);
        response = fetch(result);
      } else {
        throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${ result }]`);
      }

      return request.then(_request => processResponse(response, this.interceptors, _request));
    });

    return trackRequestEndWith.call(this, promise);
  }
};

const absoluteUrlRegexp = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

function trackRequestStart() {
  this.isRequesting = !! ++this.activeRequestCount;
}

function trackRequestEnd() {
  this.isRequesting = !! --this.activeRequestCount;
}

function trackRequestEndWith(promise) {
  let handle = trackRequestEnd.bind(this);
  promise.then(handle, handle);
  return promise;
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

function buildRequest(input, init) {
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
  for (let name in defaultHeaders || {}) {
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

function applyInterceptors(input, interceptors, successName, errorName, ...interceptorArgs) {
  return (interceptors || []).reduce((chain, interceptor) => {
    let successHandler = interceptor[successName];
    let errorHandler = interceptor[errorName];

    return chain.then(successHandler && (value => successHandler.call(interceptor, value, ...interceptorArgs)) || identity, errorHandler && (reason => errorHandler.call(interceptor, reason, ...interceptorArgs)) || thrower);
  }, Promise.resolve(input));
}

function identity(x) {
  return x;
}

function thrower(x) {
  throw x;
}