declare module 'aurelia-fetch-client' {
  import  from 'core-js';
  import  from 'core-js';
  
  /* eslint-disable */
  export interface IInterceptor {
    request(request: Request): undefined;
    requestError(error: any): undefined;
    response(response: Response): undefined;
    responseError(error: any): undefined;
  }
  export interface IRequestInit {
    method?: string;
    headers?: Headers;
    body?: Blob | BufferSource | FormData | URLSearchParams | string;
    mode?: string;
    credentials?: string;
    cache?: string;
  }
  
  /**
  * Create a Blob containing JSON-serialized data.
  * Useful for easily creating JSON fetch request bodies.
  *
  * @param {*} body - [description]
  * @return {Blob} - A blob containing the JSON-serialized body.
  */
  export function json(body: any): Blob;
  
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
    baseUrl: string;
    
    /**
      * Default values to apply to init objects when creating Requests. Note that
      * defaults cannot be applied when Request objects are manually created because
      * Request provides its own defaults and discards the original init object.
      * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
      * @type {Object}
      */
    defaults: IRequestInit;
    
    /**
      * Interceptors to be added to the HttpClient.
      * @type {Array}
      */
    interceptors: IInterceptor[];
    
    /**
      * Sets the baseUrl.
      *
      * @param {String} baseUrl - The base URL.
      * @returns {HttpClientConfiguration}
      * @chainable
      */
    withBaseUrl(baseUrl: string): HttpClientConfiguration;
    
    /**
      * Sets the defaults.
      *
      * @param {Object} defaults - The defaults.
      * @returns {HttpClientConfiguration}
      * @chainable
      */
    withDefaults(defaults: IRequestInit): HttpClientConfiguration;
    
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
    withInterceptor(interceptor: IInterceptor): HttpClientConfiguration;
    
    /**
      * Applies a configuration that addresses common application needs, including
      * configuring same-origin credentials, and using rejectErrorResponses.
      *
      * @returns {HttpClientConfiguration}
      * @chainable
      */
    useStandardConfiguration(): HttpClientConfiguration;
    
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
    rejectErrorResponses(): HttpClientConfiguration;
  }
  
  /**
  * An HTTP client based on the Fetch API.
  *
  * @class HttpClient
  * @constructor
  */
  export class HttpClient {
    activeRequestCount: number;
    isRequesting: boolean;
    interceptors: IInterceptor[];
    isConfigured: boolean;
    baseUrl: string;
    defaults: IRequestInit;
    
    /**
      * Configure this client with default settings to be used by all requests.
      *
      * @param {Function|Object|String} config - A function that takes a config argument,
      * or a config object, or a string to use as the client's baseUrl.
      * @returns {HttpClient}
      * @chainable
      */
    configure(config: ConfigOrCallback): HttpClient;
    
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
    fetch(input: Request | string, init?: IRequestInit): Promise<Response>;
  }
}