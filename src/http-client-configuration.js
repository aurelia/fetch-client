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
