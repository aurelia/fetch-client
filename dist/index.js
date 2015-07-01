
/**
 * Create a Blob containing JSON-serialized data.
 * Useful for easily creating JSON fetch request bodies.
 * 
 * @param {*} body - [description]
 * @return {Blob} - A blob containing the JSON-serialized body.
 */
export function json(body) {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}

/**
 * Merges two Headers collections to create a third Headers object.
 * 
 * @param {Headers|Object} first - The first Headers object, or an
 * object whose key/value pairs correspond to header names and values.
 * @param {Headers|Object} second - The second Headers object, or an
 * object whose key/value pairs correspond to header names and values.
 * Headers in the second collection will take priority.
 * @return {Headers} - A Headers instance containing the headers from
 * both objects.
 */
export function mergeHeaders(first, second) {
  let headers = new Headers(first || {});
  (new Headers(second || {})).forEach((value, name) => {
    headers.set(name, value);
  });

  return headers;
}

/**
 * A class for configuring HttpClients.
 *
 * @class HttpClientConfiguration
 * @constructor
 */
export class HttpClientConfiguration {
  /**
   * The base URL to be prepended to each Request's url before sending.
   * @type {String}
   */
  baseUrl = '';

  /**
   * Default values to apply to init objects when creating Requests. Note that
   * defaults cannot be applied when Request objects are manually created because
   * Request provides its own defaults and discards the original init object.
   * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
   * @type {Object}
   */
  defaults = {};

  /**
   * Interceptors to be added to the HttpClient.
   * @type {Array}
   */
  interceptors = [];

  /**
   * Sets the baseUrl.
   * 
   * @param {String} baseUrl - The base URL.
   * @chainable
   */
  withBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }

  /**
   * Sets the defaults.
   * 
   * @param {Object} defaults - The defaults.
   * @chainable
   */
  withDefaults(defaults) {
    this.defaults = defaults;
    return this;
  }

  /**
   * Add an interceptor to be used by the HttpClient.
   * 
   * @param {Object} interceptor - The interceptor.
   * @chainable
   */
  withInterceptor(interceptor) {
    this.interceptors.push(interceptor);
    return this;
  }

  /**
   * Applies a configuration that addresses common application needs, including
   * configuring same-origin credentials, and using rejectErrorResponses.
   * 
   * @chainable
   */
  useStandardConfiguration() {
    let standardConfig = { credentials: 'same-origin' };
    Object.assign(this.defaults, standardConfig, this.defaults);
    return this.rejectErrorResponses();
  }

  /**
   * Causes Responses whose status codes fall outside the range 200-299 to reject.
   * The fetch API only rejects on network errors or other conditions that prevent
   * the request from completing, meaning consumers must inspect Response.ok in the
   * Promise continuation to determine if the server responded with a success code.
   * This method adds a response interceptor that causes Responses with error codes
   * to be rejected, which is common behavior in HTTP client libraries.
   * 
   * @chainable
   */
  rejectErrorResponses() {
    return this.withInterceptor({ response: rejectOnError });
  }
}

function rejectOnError(response) {
  if (!response.ok) {
    throw response;
  }

  return response;
}

/**
 * An HTTP client based on the Fetch API.
 * 
 * @class HttpClient
 * @constructor
 */
export class HttpClient {
  activeRequestCount = 0;
  isRequesting = false;
  interceptors = [];
  isConfigured = false;
  baseUrl = '';
  defaults = null;

  /**
   * Configure this client with default settings to be used by all requests.
   * 
   * @param {Function|Object|String} config - A function that takes a config argument,
   * or a config object, or a string to use as the client's baseUrl.
   */
  configure(config) {
    let normalizedConfig;

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
    (normalizedConfig.interceptors || []).forEach(::this.addInterceptor);
    this.isConfigured = true;
  }

  /**
   * Adds an interceptor to be run on all requests or responses.
   * 
   * @param {object} interceptor - An object with request, requestError,
   * response, or responseError methods. request and requestError act as
   * resolve and reject handlers for the Request before it is sent.
   * response and responseError act as resolve and reject handlers for
   * the Response after it has been received.
   */
  addInterceptor(interceptor) {
    this.interceptors.push(interceptor);
  }

  /**
   * Starts the process of fetching a resource. Default configuration parameters
   * will be applied to the Request. The constructed Request will be passed to
   * registered request interceptors before being sent. The Response will be passed
   * to registered Response interceptors before it is returned.
   * 
   * See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * 
   * @param {Request|String} input - The resource that you wish to fetch. Either a
   * Request object, or a string containing the URL of the resource.
   * @param {Object} [init] - An options object containing settings to be applied to
   * the Request.
   * @return {Promise} - A Promise that resolves with the Response.
   */
  fetch(input, init) {
    let request = this::buildRequest(input, init, this.defaults);
    this::trackRequestStart();

    let promise = processRequest(request, this.interceptors)
      .then(result => {
        let response = null;

        if (result instanceof Response) {
          response = result;
        } else if (result instanceof Request) {
          response = fetch(result);
        } else {
          throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${result}]`);
        }

        return processResponse(response, this.interceptors);
      });

    return this::trackRequestEndWith(promise);
  }
}

function trackRequestStart() {
  this.isRequesting = !!(++this.activeRequestCount);
}

function trackRequestEnd(client) {
  this.isRequesting = !!(--this.activeRequestCount);
}

function trackRequestEndWith(promise) {
  let handle = this::trackRequestEnd;
  promise.then(handle, handle);
  return promise;
}

function buildRequest(input, init = {}) {
  let defaults = this.defaults || {};
  let source;
  let url;
  let body;

  if (input instanceof Request) {
    if (!this.isConfigured) {
      // don't copy the request if there are no defaults configured
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

  let headers = mergeHeaders(defaults.headers, source.headers);
  let requestInit = Object.assign({}, defaults, source, { body, headers });

  return new Request((this.baseUrl || '') + url, requestInit);
}

function processRequest(request, interceptors) {
  return applyInterceptors(request, interceptors, 'request', 'requestError');
}

function processResponse(response, interceptors) {
  return applyInterceptors(response, interceptors, 'response', 'responseError');
}

function applyInterceptors(input, interceptors, successName, errorName) {
  return (interceptors || [])
    .reduce((chain, interceptor) => {
      let successHandler = interceptor[successName];
      let errorHandler = interceptor[errorName];

      return chain.then(
        successHandler && interceptor::successHandler,
        errorHandler && interceptor::errorHandler);
    }, Promise.resolve(input));
}
