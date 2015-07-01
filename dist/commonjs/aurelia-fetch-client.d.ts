declare module 'aurelia-fetch-client' {
  
  /**
   * Create a Blob containing JSON-serialized data.
   * Useful for easily creating JSON fetch request bodies.
   * 
   * @param {*} body - [description]
   * @return {Blob} - A blob containing the JSON-serialized body.
   */
  export function json(body: any): any;
  
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
  export function mergeHeaders(first: any, second: any): any;
  
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
    baseUrl: any;
    
    /**
       * Default values to apply to init objects when creating Requests. Note that
       * defaults cannot be applied when Request objects are manually created because
       * Request provides its own defaults and discards the original init object.
       * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
       * @type {Object}
       */
    defaults: any;
    
    /**
       * Interceptors to be added to the HttpClient.
       * @type {Array}
       */
    interceptors: any;
    
    /**
       * Sets the baseUrl.
       * 
       * @param {String} baseUrl - The base URL.
       * @chainable
       */
    withBaseUrl(baseUrl: any): any;
    
    /**
       * Sets the defaults.
       * 
       * @param {Object} defaults - The defaults.
       * @chainable
       */
    withDefaults(defaults: any): any;
    
    /**
       * Add an interceptor to be used by the HttpClient.
       * 
       * @param {Object} interceptor - The interceptor.
       * @chainable
       */
    withInterceptor(interceptor: any): any;
    
    /**
       * Applies a configuration that addresses common application needs, including
       * configuring same-origin credentials, and using rejectErrorResponses.
       * 
       * @chainable
       */
    useStandardConfiguration(): any;
    
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
    rejectErrorResponses(): any;
  }
  
  /**
   * An HTTP client based on the Fetch API.
   * 
   * @class HttpClient
   * @constructor
   */
  export class HttpClient {
    activeRequestCount: any;
    isRequesting: any;
    interceptors: any;
    isConfigured: any;
    baseUrl: any;
    defaults: any;
    
    /**
       * Configure this client with default settings to be used by all requests.
       * 
       * @param {Function|Object|String} config - A function that takes a config argument,
       * or a config object, or a string to use as the client's baseUrl.
       */
    configure(config: any): any;
    
    /**
       * Adds an interceptor to be run on all requests or responses.
       * 
       * @param {object} interceptor - An object with request, requestError,
       * response, or responseError methods. request and requestError act as
       * resolve and reject handlers for the Request before it is sent.
       * response and responseError act as resolve and reject handlers for
       * the Response after it has been received.
       */
    addInterceptor(interceptor: any): any;
    
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
    fetch(input: any, init: any): any;
  }
}