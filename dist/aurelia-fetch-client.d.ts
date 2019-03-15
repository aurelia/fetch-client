/**
 * A class for configuring HttpClients.
 */
export declare class HttpClientConfiguration {
	/**
	 * The base URL to be prepended to each Request's url before sending.
	 */
	baseUrl: string;
	/**
	 * Default values to apply to init objects when creating Requests. Note that
	 * defaults cannot be applied when Request objects are manually created because
	 * Request provides its own defaults and discards the original init object.
	 * See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
	 */
	defaults: RequestInit;
	/**
	 * Interceptors to be added to the HttpClient.
	 */
	interceptors: Interceptor[];
	/**
	 * Sets the baseUrl.
	 *
	 * @param baseUrl The base URL.
	 * @returns The chainable instance of this configuration object.
	 * @chainable
	 */
	withBaseUrl(baseUrl: string): HttpClientConfiguration;
	/**
	 * Sets the defaults.
	 *
	 * @param defaults The defaults.
	 * @returns The chainable instance of this configuration object.
	 * @chainable
	 */
	withDefaults(defaults: RequestInit): HttpClientConfiguration;
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
	withInterceptor(interceptor: Interceptor): HttpClientConfiguration;
	/**
	 * Applies a configuration that addresses common application needs, including
	 * configuring same-origin credentials, and using rejectErrorResponses.
	 * @returns The chainable instance of this configuration object.
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
	 * @returns The chainable instance of this configuration object.
	 * @chainable
	 */
	rejectErrorResponses(): HttpClientConfiguration;
	withRetry(config?: RetryConfiguration): HttpClientConfiguration;
}
/**
 * An HTTP client based on the Fetch API.
 */
export declare class HttpClient {
	/**
	 * The current number of active requests.
	 * Requests being processed by interceptors are considered active.
	 */
	activeRequestCount: number;
	/**
	 * Indicates whether or not the client is currently making one or more requests.
	 */
	isRequesting: boolean;
	/**
	 * Indicates whether or not the client has been configured.
	 */
	isConfigured: boolean;
	/**
	 * The base URL set by the config.
	 */
	baseUrl: string;
	/**
	 * The default request init to merge with values specified at request time.
	 */
	defaults: RequestInit;
	/**
	 * The interceptors to be run during requests.
	 */
	interceptors: Interceptor[];
	/**
	 * Creates an instance of HttpClient.
	 */
	constructor();
	/**
	 * Configure this client with default settings to be used by all requests.
	 *
	 * @param config A configuration object, or a function that takes a config
	 * object and configures it.
	 * @returns The chainable instance of this HttpClient.
	 * @chainable
	 */
	configure(config: RequestInit | ((config: HttpClientConfiguration) => void) | HttpClientConfiguration): HttpClient;
	/**
	 * Starts the process of fetching a resource. Default configuration parameters
	 * will be applied to the Request. The constructed Request will be passed to
	 * registered request interceptors before being sent. The Response will be passed
	 * to registered Response interceptors before it is returned.
	 *
	 * See also https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
	 *
	 * @param input The resource that you wish to fetch. Either a
	 * Request object, or a string containing the URL of the resource.
	 * @param init An options object containing settings to be applied to
	 * the Request.
	 * @returns A Promise for the Response from the fetch request.
	 */
	fetch(input: Request | string, init?: RequestInit): Promise<Response>;
	buildRequest(input: string | Request, init: RequestInit): Request;
	/**
	 * Calls fetch as a GET request.
	 *
	 * @param input The resource that you wish to fetch. Either a
	 * Request object, or a string containing the URL of the resource.
	 * @param init An options object containing settings to be applied to
	 * the Request.
	 * @returns A Promise for the Response from the fetch request.
	 */
	get(input: Request | string, init?: RequestInit): Promise<Response>;
	/**
	 * Calls fetch with request method set to POST.
	 *
	 * @param input The resource that you wish to fetch. Either a
	 * Request object, or a string containing the URL of the resource.
	 * @param body The body of the request.
	 * @param init An options object containing settings to be applied to
	 * the Request.
	 * @returns A Promise for the Response from the fetch request.
	 */
	post(input: Request | string, body?: any, init?: RequestInit): Promise<Response>;
	/**
	 * Calls fetch with request method set to PUT.
	 *
	 * @param input The resource that you wish to fetch. Either a
	 * Request object, or a string containing the URL of the resource.
	 * @param body The body of the request.
	 * @param init An options object containing settings to be applied to
	 * the Request.
	 * @returns A Promise for the Response from the fetch request.
	 */
	put(input: Request | string, body?: any, init?: RequestInit): Promise<Response>;
	/**
	 * Calls fetch with request method set to PATCH.
	 *
	 * @param input The resource that you wish to fetch. Either a
	 * Request object, or a string containing the URL of the resource.
	 * @param body The body of the request.
	 * @param init An options object containing settings to be applied to
	 * the Request.
	 * @returns A Promise for the Response from the fetch request.
	 */
	patch(input: Request | string, body?: any, init?: RequestInit): Promise<Response>;
	/**
	 * Calls fetch with request method set to DELETE.
	 *
	 * @param input The resource that you wish to fetch. Either a
	 * Request object, or a string containing the URL of the resource.
	 * @param body The body of the request.
	 * @param init An options object containing settings to be applied to
	 * the Request.
	 * @returns A Promise for the Response from the fetch request.
	 */
	delete(input: Request | string, body?: any, init?: RequestInit): Promise<Response>;
}
/**
 * Interceptors can process requests before they are sent, and responses
 * before they are returned to callers.
 */
export interface Interceptor {
	/**
	 * Called with the request before it is sent. Request interceptors can modify and
	 * return the request, or return a new one to be sent. If desired, the interceptor
	 * may return a Response in order to short-circuit the HTTP request itself.
	 *
	 * @param request The request to be sent.
	 * @returns The existing request, a new request or a response; or a Promise for any of these.
	 */
	request?: (request: Request) => Request | Response | Promise<Request | Response>;
	/**
	 * Handles errors generated by previous request interceptors. This function acts
	 * as a Promise rejection handler. It may rethrow the error to propagate the
	 * failure, or return a new Request or Response to recover.
	 *
	 * @param error The rejection value from the previous interceptor.
	 * @returns The existing request, a new request or a response; or a Promise for any of these.
	 */
	requestError?: (error: any) => Request | Response | Promise<Request | Response>;
	/**
	 * Called with the response after it is received. Response interceptors can modify
	 * and return the Response, or create a new one to be returned to the caller.
	 *
	 * @param response The response.
	 * @returns The response; or a Promise for one.
	 */
	response?: (response: Response, request?: Request) => Response | Promise<Response>;
	/**
	 * Handles fetch errors and errors generated by previous interceptors. This
	 * function acts as a Promise rejection handler. It may rethrow the error
	 * to propagate the failure, or return a new Response to recover.
	 *
	 * @param error The rejection value from the fetch request or from a
	 * previous interceptor.
	 * @returns The response; or a Promise for one.
	 */
	responseError?: (error: any, request?: Request, httpClient?: HttpClient) => Response | Promise<Response>;
}
export declare type ValidInterceptorMethodName = keyof Interceptor;
/**
 * The init object used to initialize a fetch Request.
 * See https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
 */
export interface RequestInit {
	/**
	 * The request method, e.g., GET, POST.
	 */
	method?: string;
	/**
	 * Any headers you want to add to your request, contained within a Headers object or an object literal with ByteString values.
	 */
	headers?: Headers | Object;
	/**
	 * Any body that you want to add to your request: this can be a Blob, BufferSource, FormData,
	 * URLSearchParams, ReadableStream, or USVString object.
	 *
	 * Note that a request using the GET or HEAD method cannot have a body.
	 */
	body?: Blob | BufferSource | FormData | URLSearchParams | ReadableStream | string | null;
	/**
	 * The mode you want to use for the request, e.g., cors, no-cors, same-origin, or navigate.
	 * The default is cors.
	 *
	 * In Chrome the default is no-cors before Chrome 47 and same-origin starting with Chrome 47.
	 */
	mode?: string;
	/**
	 * The request credentials you want to use for the request: omit, same-origin, or include.
	 * The default is omit.
	 *
	 * In Chrome the default is same-origin before Chrome 47 and include starting with Chrome 47.
	 */
	credentials?: string;
	/**
	 * The cache mode you want to use for the request: default, no-store, reload, no-cache, or force-cache.
	 */
	cache?: string;
	/**
	 * The redirect mode to use: follow, error, or manual.
	 *
	 * In Chrome the default is follow before Chrome 47 and manual starting with Chrome 47.
	 */
	redirect?: string;
	/**
	 * A USVString specifying no-referrer, client, or a URL. The default is client.
	 */
	referrer?: string;
	/**
	 * Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
	 */
	integrity?: string;
	/**
	 * An AbortSignal to set request’s signal.
	 */
	signal?: AbortSignal | null;
}
export interface RetryConfiguration {
	maxRetries: number;
	interval?: number;
	strategy?: number | ((retryCount: number) => number);
	minRandomInterval?: number;
	maxRandomInterval?: number;
	counter?: number;
	requestClone?: Request;
	doRetry?: (response: Response, request: Request) => boolean | Promise<boolean>;
	beforeRetry?: (request: Request, client: HttpClient) => Request | Promise<Request>;
}
/**
* Serialize an object to JSON. Useful for easily creating JSON fetch request bodies.
*
* @param body The object to be serialized to JSON.
* @param replacer The JSON.stringify replacer used when serializing.
* @returns A JSON string.
*/
export declare function json(body: any, replacer?: any): string;
export declare const retryStrategy: {
	fixed: 0;
	incremental: 1;
	exponential: 2;
	random: 3;
};
export declare class RetryInterceptor implements Interceptor {
	retryConfig: RetryConfiguration;
	constructor(retryConfig?: RetryConfiguration);
	request(request: Request): Request;
	response(response: Response, request?: Request): Response;
	responseError(error: Response, request?: Request, httpClient?: HttpClient): Promise<Response>;
}