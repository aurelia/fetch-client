import {HttpClient} from '../src/http-client';

describe('HttpClient', () => {
  let originalFetch = window.fetch;
  let client;
  let fetch;

  function setUpTests() {
    beforeEach(() => {
      client = new HttpClient();
      fetch = window.fetch = jasmine.createSpy('fetch');
    });

    afterEach(() => {
      fetch = window.fetch = originalFetch;
    });
  }

  setUpTests();

  it('makes requests', (done) => {
    fetch.and.returnValue(emptyResponse(200));

    client
      .fetch('http://example.com/some/cool/path')
      .then(result => {
        expect(result.ok).toBe(true);
      })
      .catch(result => {
        expect(result).not.toBe(result);
      })
      .then(() => {
        expect(fetch).toHaveBeenCalled();
        done();
      });
  });

  describe('interceptors', () => {
    setUpTests();

    it('run on request', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let interceptor = { request(r) { return r; }, requestError(r) { throw r; } };
      spyOn(interceptor, 'request').and.callThrough();
      spyOn(interceptor, 'requestError').and.callThrough();

      client.interceptors.push(interceptor);

      client.fetch('path')
        .then(() => {
          expect(interceptor.request).toHaveBeenCalledWith(jasmine.any(Request));
          expect(interceptor.requestError).not.toHaveBeenCalled();
          done();
        });
    });

    it('run on request error', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let interceptor = { request(r) { return r; }, requestError(r) { throw r; } };
      spyOn(interceptor, 'request').and.callThrough();
      spyOn(interceptor, 'requestError').and.callThrough();

      client.interceptors.push({ request() { return Promise.reject(new Error('test')); }});
      client.interceptors.push(interceptor);

      client.fetch()
        .catch(() => {
          expect(interceptor.request).not.toHaveBeenCalled();
          expect(interceptor.requestError).toHaveBeenCalledWith(jasmine.any(Error));
          done();
        });
    });

    it('run on response', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let interceptor = { response(r) { return r; }, responseError(r) { throw r; } };
      spyOn(interceptor, 'response').and.callThrough();
      spyOn(interceptor, 'responseError').and.callThrough();

      client.interceptors.push(interceptor);

      client.fetch('path')
        .then(() => {
          expect(interceptor.response).toHaveBeenCalledWith(jasmine.any(Response));
          expect(interceptor.responseError).not.toHaveBeenCalled();
          done();
        });
    });

    it('run on response error', (done) => {
      fetch.and.returnValue(Promise.reject(Response.error()));
      let interceptor = { response(r) { return r; }, responseError(r) { throw r; } };
      spyOn(interceptor, 'response').and.callThrough();
      spyOn(interceptor, 'responseError').and.callThrough();

      client.interceptors.push(interceptor);

      client.fetch('path')
        .catch(() => {
          expect(interceptor.response).not.toHaveBeenCalled();
          expect(interceptor.responseError).toHaveBeenCalledWith(jasmine.any(Response));
          done();
        });
    });

    it('normalizes input for interceptors', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let request;
      client.interceptors.push({ request(r) { request = r; return r; } });

      client
        .fetch('http://example.com/some/cool/path')
        .then(() => {
          expect(request instanceof Request).toBe(true);
          done();
        });
    });

    it('runs multiple interceptors', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let first = { request(r) { return r; } };
      let second = { request(r) { return r; } };
      spyOn(first, 'request').and.callThrough();
      spyOn(second, 'request').and.callThrough();

      client.interceptors.push(first);
      client.interceptors.push(second);

      client.fetch('path')
        .then(() => {
          expect(first.request).toHaveBeenCalledWith(jasmine.any(Request));
          expect(second.request).toHaveBeenCalledWith(jasmine.any(Request));
          done();
        });
    });

    it('request interceptors can modify request', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let interceptor = { request() { return new Request('http://aurelia.io/'); } };

      client.interceptors.push(interceptor);

      client.fetch('first')
        .then(() => {
          expect(fetch.calls.mostRecent().args[0].url).toBe('http://aurelia.io/');
          done();
        });
    });

    it('request interceptors can short circuit request', (done) => {
      let response = new Response();
      let interceptor = { request() { return response; } };

      client.interceptors.push(interceptor);

      client.fetch('path')
        .then((response) => {
          expect(response).toBe(response);
          expect(fetch).not.toHaveBeenCalled();
          done();
        });
    });
  });

  describe('default request parameters', () => {
    setUpTests();

    it('applies baseUrl to requests', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.baseUrl = 'http://aurelia.io/';

      client.fetch('path')
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.url).toBe('http://aurelia.io/path');
          done();
        });
    });

    it('applies default headers to requests with no headers', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.defaults = { headers: { 'x-foo': 'bar' } };

      client.fetch('path')
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('x-foo')).toBe(true);
          expect(request.headers.get('x-foo')).toBe('bar');
          done();
        });
    });

    it('applies default headers to requests with other headers', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.defaults = { headers: { 'x-foo': 'bar' } };

      client.fetch('path', { headers: { 'x-baz': 'bat' } })
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('x-foo')).toBe(true);
          expect(request.headers.has('x-baz')).toBe(true);
          expect(request.headers.get('x-foo')).toBe('bar');
          expect(request.headers.get('x-baz')).toBe('bat');
          done();
        });
    });

    it('applies default headers to requests using Headers instance', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.defaults = { headers: { 'x-foo': 'bar' } };

      client.fetch('path', { headers: new Headers({ 'x-baz': 'bat' }) })
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('x-foo')).toBe(true);
          expect(request.headers.has('x-baz')).toBe(true);
          expect(request.headers.get('x-foo')).toBe('bar');
          expect(request.headers.get('x-baz')).toBe('bat');
          done();
        });
    });

    it('does not overwrite request headers with default headers', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.defaults = { headers: { 'x-foo': 'bar' } };

      client.fetch('path', { headers: { 'x-foo': 'baz' } })
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('x-foo')).toBe(true);
          expect(request.headers.get('x-foo')).toBe('baz');
          expect(request.headers.getAll('x-foo').length).toBe(1);
          done();
        });
    });

    it('evaluates default header function values with no headers', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.defaults = { headers: { 'x-foo': () => 'bar' } };

      client.fetch('path')
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('x-foo')).toBe(true);
          expect(request.headers.get('x-foo')).toBe('bar');
          done();
        });
    });

    it('evaluates default header function values with other headers', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.defaults = { headers: { 'x-foo': () => 'bar' } };

      client.fetch('path', { headers: { 'x-baz': 'bat' } })
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('x-foo')).toBe(true);
          expect(request.headers.has('x-baz')).toBe(true);
          expect(request.headers.get('x-foo')).toBe('bar');
          expect(request.headers.get('x-baz')).toBe('bat');
          done();
        });
    });

    it('evaluates default header function values on each request', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let value = 0;
      client.defaults = {
        headers: {
          'x-foo': () => {
            value++;
            return value;
          }
        }
      };

      let promises = [];
      promises.push(client.fetch('path1'));
      promises.push(client.fetch('path2'));

      Promise.all(promises)
        .then(() => {
          let [request1] = fetch.calls.first().args;
          let [request2] = fetch.calls.mostRecent().args;
          expect(request1.headers.has('x-foo')).toBe(true);
          expect(request1.headers.get('x-foo')).toBe('1');
          expect(request2.headers.has('x-foo')).toBe(true);
          expect(request2.headers.get('x-foo')).toBe('2');
          done();
        });
    });
  });
});

function emptyResponse(status) {
  return Promise.resolve(new Response(null, { status }));
}
