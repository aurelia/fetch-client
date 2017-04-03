import {RequestInit, Interceptor} from './interfaces';

/**
* A class for configuring HttpClients.
*/
export class HttpClientConfiguration {
  /**
  * The base URL to be prepended to each Request's url before sending.
  */
  get baseUrl(): string {
    return this._options.baseUrl;
  }

  /**
  * Default values to apply to init objects when creating Requests. Note that
  * defaults cannot be applied when Request objects are manually created because
  * Request provides its own defaults and discards the original init object.
  * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
  */
  get defaults(): RequestInit {
    return this._options.defaults;
  } 

  /**
  * Interceptors to be added to the HttpClient.
  */
  get interceptors(): Interceptor[] {
    return this._options.interceptors;
  }
  
  constructor(options: any = {}) {
    this.options = {
      baseUrl: '',
      defaults: {},
      interceptors: [],
      ...options
    };
  }

  /**
  * Sets the baseUrl.
  *
  * @param baseUrl The base URL.
  * @returns The chainable instance of this configuration object.
  * @chainable
  */
  withBaseUrl(baseUrl: string): HttpClientConfiguration {
    return new HttpClientConfiguration({
      baseUrl: baseUrl,
      ...this._options
    });
  }

  /**
  * Sets the defaults.
  *
  * @param defaults The defaults.
  * @returns The chainable instance of this configuration object.
  * @chainable
  */
  withDefaults(defaults: RequestInit): HttpClientConfiguration {
    return new HttpClientConfiguration({
      defaults: { ...defaults, ...this._options.defaults },
      ...this._options
    });
  }

  /**
  * Adds an interceptor to be run on all requests or responses.
  *
  * @param interceptor An object with request, requestError,
  * response, or responseError methods. request and requestError act as
  * resolve and reject handlers for the Request before it is sent.
  * response and responseError act as resolve and reject handlers for
  * the Response after it has been received.
  * @returns The chainable instance of this configuration object.
  * @chainable
  */
  addInterceptor(interceptor: Interceptor): HttpClientConfiguration {
    return new HttpClientConfiguration({
      interceptors: this._options.interceptors.concat(interceptor),
      ...this._options
    });
  }

  /**
  * Applies a configuration that addresses common application needs, including
  * configuring same-origin credentials, and using rejectErrorResponses.
  * @returns The chainable instance of this configuration object.
  * @chainable
  */
  useStandardConfiguration(): HttpClientConfiguration {
    const standardConfig = { credentials: 'same-origin' };
    return this.withDefaults(standardConfig)
      .rejectErrorResponses();
  }

  /**
  * Causes Responses whose status codes fall outside the range 200-299 to reject.
  * The fetch API only rejects on network errors or other conditions that prevent
  * the request from completing, meaning consumers must inspect Response.ok in the
  * Promise continuation to determine if the server responded with a success code.
  * This method adds a response interceptor that causes Responses with error codes
  * to be rejected, which is common behavior in HTTP client libraries.
  * @returns The chainable instance of this configuration object.
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
