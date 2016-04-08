import 'aurelia-polyfills';
import {json} from '../src/util';

describe('util', () => {
  describe('json', () => {
    it('creates JSON blobs', (done) => {
      let data = { test: 'data' };
      let blob = json(data);

      expect(blob.type).toEqual('application/json');

      let reader = new FileReader();
      reader.addEventListener('loadend', () => {
        expect(JSON.parse(reader.result)).toEqual(data);
        done();
      });

      reader.readAsText(blob);
    });
  });
});
