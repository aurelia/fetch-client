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
