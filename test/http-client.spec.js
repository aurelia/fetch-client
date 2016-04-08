import 'aurelia-polyfills';
import {HttpClient} from '../src/http-client';
import {HttpClientConfiguration} from '../src/http-client-configuration';

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

  it('errors on missing fetch implementation', () => {
    window.fetch = undefined;
    expect(() => new HttpClient()).toThrow();
  });

  describe('configure', () => {
    it('accepts plain objects', () => {
      let defaults = {};
      client.configure(defaults);

      expect(client.isConfigured).toBe(true);
      expect(client.defaults).toBe(defaults);
    });

    it('accepts configuration callbacks', () => {
      let defaults = { foo: true };
      let baseUrl = '/test';
      let interceptor = {};

      client.configure(config => {
        expect(config).toEqual(jasmine.any(HttpClientConfiguration));

        return config
          .withDefaults(defaults)
          .withBaseUrl(baseUrl)
          .withInterceptor(interceptor);
      });

      expect(client.isConfigured).toBe(true);
      expect(client.defaults.foo).toBe(true);
      expect(client.baseUrl).toBe(baseUrl);
      expect(client.interceptors.indexOf(interceptor)).toBe(0);
    });

    it('rejects invalid configs', () => {
      expect(() => client.configure(1)).toThrow();
    });

    it('applies standard configuration', () => {
      client.configure(config => config.useStandardConfiguration());

      expect(client.defaults.credentials).toBe('same-origin');
      expect(client.interceptors.length).toBe(1);
    });

    it('rejects error responses', () => {
      client.configure(config => config.rejectErrorResponses());

      expect(client.interceptors.length).toBe(1);
    });
  });

  describe('fetch', () => {
    it('makes requests with string inputs', (done) => {
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

    it('makes requests with null RequestInit', (done) => {
      fetch.and.returnValue(emptyResponse(200));

      client
        .fetch('http://example.com/some/cool/path', null)
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

    it('makes requests with Request inputs', (done) => {
      fetch.and.returnValue(emptyResponse(200));

      client
        .fetch(new Request('http://example.com/some/cool/path'))
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

    it('makes requests with Request inputs when configured', (done) => {
      fetch.and.returnValue(emptyResponse(200));

      client.configure(config => config.withBaseUrl('http://example.com/'));

      client
        .fetch(new Request('some/cool/path'))
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
          expect(interceptor.response).toHaveBeenCalledWith(jasmine.any(Response), jasmine.any(Request));
          expect(interceptor.responseError).not.toHaveBeenCalled();
          done();
        });
    });

    it('run on response error', (done) => {
      fetch.and.returnValue(Promise.reject(new Response(null, { status: 500 })));
      let interceptor = { response(r) { return r; }, responseError(r) { throw r; } };
      spyOn(interceptor, 'response').and.callThrough();
      spyOn(interceptor, 'responseError').and.callThrough();

      client.interceptors.push(interceptor);

      client.fetch('path')
        .catch(() => {
          expect(interceptor.response).not.toHaveBeenCalled();
          expect(interceptor.responseError).toHaveBeenCalledWith(jasmine.any(Response), jasmine.any(Request));
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
        .then((r) => {
          expect(r).toBe(response);
          expect(fetch).not.toHaveBeenCalled();
          done();
        });
    });

    it('doesn\'t reject unsuccessful responses', (done) => {
      let response = new Response(null, { status: 500 });
      fetch.and.returnValue(Promise.resolve(response));

      client.fetch('path')
        .catch((r) => {
          expect(r).not.toBe(response);
        })
        .then((r) => {
          expect(r.ok).toBe(false);
          done();
        });
    });

    describe('rejectErrorResponses', () => {
      it('can reject error responses', (done) => {
        let response = new Response(null, { status: 500 });
        fetch.and.returnValue(Promise.resolve(response));

        client.configure(config => config.rejectErrorResponses());
        client.fetch('path')
          .then((r) => {
            expect(r).not.toBe(r);
          })
          .catch((r) => {
            expect(r).toBe(response);
            done();
          });
      });

      it('resolves successful requests', (done) => {
        fetch.and.returnValue(emptyResponse(200));

        client.configure(config => config.rejectErrorResponses());
        client.fetch('path')
          .catch((r) => {
            expect(r).not.toBe(r);
          })
          .then((r) => {
            expect(r.ok).toBe(true);
            done();
          });
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

    it('doesn\'t apply baseUrl to absolute URLs', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      client.baseUrl = 'http://aurelia.io/';

      client.fetch('https://example.com/test')
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.url).toBe('https://example.com/test');
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

    it('uses default content-type header', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      let contentType = 'application/json;charset=UTF-8';
      client.defaults = { method: 'post', body: '{}', headers: { 'content-type': contentType } };

      client.fetch('path')
        .then(() => {
          let [request] = fetch.calls.first().args;
          expect(request.headers.has('content-type')).toBe(true);
          expect(request.headers.get('content-type')).toBe(contentType);
          done();
        });
    });
  });
});

function emptyResponse(status) {
  return Promise.resolve(new Response(null, { status }));
}
