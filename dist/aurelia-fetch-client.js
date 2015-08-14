import 'core-js';

/**
* Create a Blob containing JSON-serialized data.
* Useful for easily creating JSON fetch request bodies.
*
* @param {*} body - [description]
* @return {Blob} - A blob containing the JSON-serialized body.
*/
export function json(body: any): Blob {
  return new Blob([JSON.stringify(body)], { type: 'application/json' });
}


/* eslint-disable */

interface Interceptor {
  request?: (request: Request) => Request|Response|Promise<Request|Response>;

  requestError?: (error: any) => Request|Response|Promise<Request|Response>;

  response?: (response: Response) => Response|Promise<Response>;

  responseError?: (error: any) => Response|Promise<Response>;
}

interface RequestInit {
  method?: string;

  headers?: Headers;

  body?: Blob|BufferSource|FormData|URLSearchParams|string;

  mode?: string;

  credentials?: string;

  cache?: string;
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
  baseUrl: string = '';

  /**
  * Default values to apply to init objects when creating Requests. Note that
  * defaults cannot be applied when Request objects are manually created because
  * Request provides its own defaults and discards the original init object.
  * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
  * @type {Object}
  */
  defaults: RequestInit = {};

  /**
  * Interceptors to be added to the HttpClient.
  * @type {Array}
  */
  interceptors: Interceptor[] = [];

  /**
  * Sets the baseUrl.
  *
  * @param {String} baseUrl - The base URL.
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  withBaseUrl(baseUrl: string): HttpClientConfiguration {
    this.baseUrl = baseUrl;
    return this;
  }

  /**
  * Sets the defaults.
  *
  * @param {Object} defaults - The defaults.
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  withDefaults(defaults: RequestInit): HttpClientConfiguration {
    this.defaults = defaults;
    return this;
  }

  /**
  * Adds an interceptor to be run on all requests or responses.
  *
  * @param {Object} interceptor - An object with request, requestError,
  * response, or responseError methods. request and requestError act as
  * resolve and reject handlers for the Request before it is sent.
  * response and responseError act as resolve and reject handlers for
  * the Response after it has been received.
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  withInterceptor(interceptor: Interceptor): HttpClientConfiguration {
    this.interceptors.push(interceptor);
    return this;
  }

  /**
  * Applies a configuration that addresses common application needs, including
  * configuring same-origin credentials, and using rejectErrorResponses.
  *
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  useStandardConfiguration(): HttpClientConfiguration {
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
  * @returns {HttpClientConfiguration}
  * @chainable
  */
  rejectErrorResponses(): HttpClientConfiguration {
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
  activeRequestCount: number = 0;

  isRequesting: boolean = false;

  interceptors: Interceptor[] = [];

  isConfigured: boolean = false;

  baseUrl: string = '';

  defaults: RequestInit = null;

  /**
  * Configure this client with default settings to be used by all requests.
  *
  * @param {Function|Object|String} config - A function that takes a config argument,
  * or a config object, or a string to use as the client's baseUrl.
  * @returns {HttpClient}
  * @chainable
  */
  configure(config: string|RequestInit|(config: HttpClientConfiguration) => void): HttpClient {
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

    let defaults = normalizedConfig.defaults;
    if (defaults && defaults.headers instanceof Headers) {
      // Headers instances are not iterable in all browsers. Require a plain
      // object here to allow default headers to be merged into request headers.
      throw new Error('Default headers must be a plain object.');
    }

    this.baseUrl = normalizedConfig.baseUrl;
    this.defaults = defaults;
    this.interceptors.push(...normalizedConfig.interceptors || []);
    this.isConfigured = true;

    return this;
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
  fetch(input: Request|string, init?: RequestInit): Promise<Response> {
    this::trackRequestStart();

    let request = Promise.resolve().then(() => this::buildRequest(input, init, this.defaults));
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

function trackRequestEnd() {
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

  let requestInit = Object.assign({}, defaults, source, { body });
  let request = new Request((this.baseUrl || '') + url, requestInit);
  setDefaultHeaders(request.headers, defaults.headers);

  return request;
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
