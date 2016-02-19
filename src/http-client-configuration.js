import {RequestInit, Interceptor} from './interfaces';

/**
* A class for configuring HttpClients.
*/
export class HttpClientConfiguration {
  /**
  * The base URL to be prepended to each Request's url before sending.
  */
  baseUrl: string = '';

  /**
  * Default values to apply to init objects when creating Requests. Note that
  * defaults cannot be applied when Request objects are manually created because
  * Request provides its own defaults and discards the original init object.
  * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
  */
  defaults: RequestInit = {};

  /**
  * Interceptors to be added to the HttpClient.
  */
  interceptors: Interceptor[] = [];

  /**
  * Sets the baseUrl.
  *
  * @param baseUrl - The base URL.
  * @chainable
  */
  withBaseUrl(baseUrl: string): HttpClientConfiguration {
    this.baseUrl = baseUrl;
    return this;
  }

  /**
  * Sets the defaults.
  *
  * @param defaults - The defaults.
  * @chainable
  */
  withDefaults(defaults: RequestInit): HttpClientConfiguration {
    this.defaults = defaults;
    return this;
  }

  /**
  * Adds an interceptor to be run on all requests or responses.
  *
  * @param interceptor - An object with request, requestError,
  * response, or responseError methods. request and requestError act as
  * resolve and reject handlers for the Request before it is sent.
  * response and responseError act as resolve and reject handlers for
  * the Response after it has been received.
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
