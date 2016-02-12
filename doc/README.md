# [aurelia-fetch-client](https://github.com/aurelia/fetch-client)

An HTTP client based on the Fetch API. This library aims to embrace and expose the new [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), while providing features important in web applications: default configuration of request parameters, interceptors, and centralized request tracking. The main method, `HttpClient.fetch()`, has the same signature as `window.fetch()`. The difference is that `HttpClient` will apply default configuration values, execute any registered interceptors, and track the number of active requests.

* [MDN documentation on the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
* [Jake Archibald's intro to the Fetch API](http://jakearchibald.com/2015/thats-so-fetch/)

## Bring Your Own Polyfill
This library relies on the Fetch API, which is not yet supported by all popular browsers. This library does not include a polyfill for Fetch. If you need to support [browsers that haven't implemented Fetch](http://caniuse.com/#feat=fetch), you will need to install a polyfill like [GitHub's Fetch polyfill](https://github.com/github/fetch)

```
jspm install fetch
```

```js
import 'fetch'; // load the polyfill before using aurelia-fetch-client
import {HttpClient} from 'aurelia-fetch-client';
```

## Basic Use

```js
import {HttpClient} from 'aurelia-fetch-client';

let httpClient = new HttpClient();

// send a GET request to package.json, and then log the description
httpClient.fetch('package.json')
  .then(response => response.json())
    .then(data => {
      console.log(data.description);
    });
```

## Configuration
An `HttpClient` instance can be configured with several options, such as default headers and interceptors to be run on requests or responses.

```js
httpClient.configure(config => {
  config
    .withBaseUrl('api/')
    .withDefaults({
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'Fetch'
      }
    })
    .withInterceptor({
      request(request) {
        console.log(`Requesting ${request.method} ${request.url}`);
        return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
      },
      response(response) {
        console.log(`Received ${response.status} ${response.url}`);
        return response; // you can return a modified Response
      }
    });
});
```

* The `defaults` object can include any properties described in the optional `init` parameter to the [Request constructor](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request), and will be merged into the new [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) before it is passed to the first request interceptor.

* Interceptors can be any object providing any of the four optional methods: `request`, `requestError`, `response`, and `responseError`.
  * `request` takes the [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) that will be passed to `window.fetch()` after interceptors run. It should return the same Request, or create a new one. It can also return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) to short-circuit the call to `fetch()` and complete the request immediately. Errors thrown in request interceptors will be handled by `requestError` interceptors.
  * `requestError` acts as a Promise rejection handler during Request creation and request interceptor execution. It will receive the rejection reason, and can either re-throw, or recover by returning a valid Request.
  * `response` will be run after `fetch()` completes, and will receive the resulting [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). As with `request`, it can either pass the Response along, return a modified response, or throw.
  * `responseError` is similar to `requestError`, and acts as a Promise rejection handler for response rejections.

## Helpers
The Fetch API has a couple gotchas, documented by the [GitHub Fetch polyfill](https://github.com/github/fetch#caveats) docs. aurelia-fetch-client provides configuration helpers to apply the changes suggested by the polyfill docs.

* `config.rejectErrorResponses()` will add a response interceptor that causes responses with unsuccessful status codes to result in a rejected Promise.

* `config.useStandardConfiguration()` will apply `rejectErrorResponses()`, and also configure `credentials: 'same-origin'` as a default on all requests.

* The Fetch API has no convenient way to sending JSON in the body of a request. Objects must be manually serialized to JSON, and the `Content-Type` header set appropriately. aurelia-fetch-client includes a helper called `json` for this.

```js
import {HttpClient, json} from 'aurelia-fetch-client';

let comment = { title: 'Awesome!', content: 'This Fetch client is pretty rad.' };
httpClient.fetch('comments', {
  method: 'post',
  body: json(comment)
});
```

## Complete Example
This example creates a new `HttpClient` and configures it for use with an imaginary JSON API for managing comments at `api/`. The client is then used to POST a new comment to the API and display an alert dialog with the assigned comment ID.

```js
import {HttpClient, json} from 'aurelia-fetch-client';

let httpClient = new HttpClient();
httpClient.configure(config => {
  config
    .useStandardConfiguration()
    .withBaseUrl('api/')
    .withDefaults({
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'Fetch'
      }
    })
    .withInterceptor({
      request(request) {
        let authHeader = fakeAuthService.getAuthHeaderValue(request.url);
        request.headers.append('Authorization', authHeader);
        return request;
      }
    });
});

let comment = { title: 'Awesome!', content: 'This Fetch client is pretty rad.' };
httpClient
  .fetch('comments', {
    method: 'post',
    body: json(comment)
  })
  .then(response => response.json())
  .then(savedComment => {
    alert(`Saved comment! ID: ${savedComment.id}`);
  })
  .catch(error => {
    alert('Error saving comment!');
  });
```

## Limitations

* This library does not include a polyfill for Fetch. If you need to support [browsers that haven't implemented Fetch](http://caniuse.com/#feat=fetch), you will need to install a polyfill like [GitHub's Fetch polyfill](https://github.com/github/fetch).
* This library does not work around any of the existing limitations in the Fetch API, including:
  * Fetch does not currently support aborting requests or specifying request timeouts.
  * Fetch does not currently support progress reporting.
* JSONP support is not currently provided by this library.
* The [Request constructor](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) provides its own default values, so if a Request is created before invoking `HttpClient.fetch` (eg, the `HttpClient.fetch(request)` signature is used instead of the `HttpClient.fetch(url, params)` signature), there is no way for the client to know which default values to merge into the Request. The base URL and headers can be merged, but currently no other defaults will be applied in this case.
