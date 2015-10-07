import {HttpClient} from '../src/http-client';
import {json} from '../src/util';

describe('util', () => {
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

  describe('json', () => {
    it('sets JSON body and Content-Type header on Requests', (done) => {
      fetch.and.returnValue(emptyResponse(200));
      const data = { test: 'data' };

      client.fetch('path', {
        method: 'POST',
        body: json(data)
      }).then(() => {
        let [request] = fetch.calls.first().args;
        expect(request).toEqual(jasmine.any(Request));
        expect(request.headers.get('Content-Type')).toBe('application/json');
        return request.json();
      }).then(bodyContent => {
        expect(bodyContent).toEqual(data);
        done();
      });
    });
  });
});

function emptyResponse(status) {
  return Promise.resolve(new Response(null, { status }));
}
