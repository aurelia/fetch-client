## 0.4.0 (2015-11-09)


#### Features

* **http-client:** clean up configuration ([48c82048](http://github.com/aurelia/fetch-client/commit/48c8204888a0bdcadffd82a42a3a338549fee1d3))


## 0.3.0 (2015-10-13)


#### Bug Fixes

* **HttpClient:** fix crash in FF caused by attempting to iterate over Headers ([f45dd86e](http://github.com/aurelia/fetch-client/commit/f45dd86ecea4373b40391c0a87078e39af3b15ff))
* **all:** add corejs ([abc6fcf8](http://github.com/aurelia/fetch-client/commit/abc6fcf8e96fb2336ca156d7c4f0dddba8676f87))
* **build:** update linting, testing and tools ([12f0cd93](http://github.com/aurelia/fetch-client/commit/12f0cd93a3c31f3076f2e2c1a1ca1f1f87956d2e))
* **http-client:**
  * fix firefox crash ([939f1a95](http://github.com/aurelia/fetch-client/commit/939f1a9583a290ffb4fd9eac9e747f75c3943b07))
  * fix bug where default headers were sometimes not applied correctly ([c3ed06ce](http://github.com/aurelia/fetch-client/commit/c3ed06ce5fb9a814b9320e40499eea99358a8a0b))
  * inline ConfigOrCallback type definition ([6a062601](http://github.com/aurelia/fetch-client/commit/6a062601904d66b12d02290ee7ca7bfb3892bf8a))
  * wrap request creation in a Promise so requestError interceptors will see errors ([522212b6](http://github.com/aurelia/fetch-client/commit/522212b6595af2d7724ad25b2477b4fbfd42bc82))
* **request-init:** adjust type annotation on headers to allow objects ([aeffb65f](http://github.com/aurelia/fetch-client/commit/aeffb65fa498a78842fb2060cf8e9d0f03fa3024), closes [#16](http://github.com/aurelia/fetch-client/issues/16))


#### Features

* **HttpClient:** allow functions as default header values ([4f9153a4](http://github.com/aurelia/fetch-client/commit/4f9153a407a8b0c8c13c10b9d06409f57a72985d), closes [#17](http://github.com/aurelia/fetch-client/issues/17))
* **all:**
  * add type annotations ([15fbbbde](http://github.com/aurelia/fetch-client/commit/15fbbbde2be466a4558a87f7e72211ebc739d936))
  * add initial implementation ([dd63fb8d](http://github.com/aurelia/fetch-client/commit/dd63fb8dc1a4261c325a7a5f82c1b9b54fb8f000))
* **docs:**
  * generate api.json from .d.ts file ([80ccb0c2](http://github.com/aurelia/fetch-client/commit/80ccb0c24c6be7f955958a292bef1ca2a8604374))
  * generate api.json from .d.ts file ([6d1cf4cc](http://github.com/aurelia/fetch-client/commit/6d1cf4cc415f24b4385888107bdc63ff093a1ede))
* **http-client:** make configure chainable ([946ba2c1](http://github.com/aurelia/fetch-client/commit/946ba2c1f3d29870bdfd34ead5998c29e143bae0))
* **http-client-configuration:** add chainable helpers for all configuration properties ([26aa9df8](http://github.com/aurelia/fetch-client/commit/26aa9df81ad24cfb9f05abdbe3341463833478f0))


## 0.2.0 (2015-09-04)


#### Bug Fixes

* **build:** update linting, testing and tools ([12f0cd93](http://github.com/aurelia/fetch-client/commit/12f0cd93a3c31f3076f2e2c1a1ca1f1f87956d2e))


#### Features

* **docs:**
  * generate api.json from .d.ts file ([80ccb0c2](http://github.com/aurelia/fetch-client/commit/80ccb0c24c6be7f955958a292bef1ca2a8604374))
  * generate api.json from .d.ts file ([6d1cf4cc](http://github.com/aurelia/fetch-client/commit/6d1cf4cc415f24b4385888107bdc63ff093a1ede))


### 0.1.2 (2015-08-14)


#### Bug Fixes

* **http-client:** inline ConfigOrCallback type definition ([6a062601](http://github.com/aurelia/fetch-client/commit/6a062601904d66b12d02290ee7ca7bfb3892bf8a))


### 0.1.1 (2015-07-29)


#### Bug Fixes

* **HttpClient:** fix crash in FF caused by attempting to iterate over Headers ([f45dd86e](http://github.com/aurelia/fetch-client/commit/f45dd86ecea4373b40391c0a87078e39af3b15ff))
* **all:** add corejs ([abc6fcf8](http://github.com/aurelia/fetch-client/commit/abc6fcf8e96fb2336ca156d7c4f0dddba8676f87))
* **http-client:** wrap request creation in a Promise so requestError interceptors will see errors ([522212b6](http://github.com/aurelia/fetch-client/commit/522212b6595af2d7724ad25b2477b4fbfd42bc82))


#### Features

* **all:** add type annotations ([15fbbbde](http://github.com/aurelia/fetch-client/commit/15fbbbde2be466a4558a87f7e72211ebc739d936))
* **http-client:** make configure chainable ([946ba2c1](http://github.com/aurelia/fetch-client/commit/946ba2c1f3d29870bdfd34ead5998c29e143bae0))


## 0.1.0 (2015-07-01)


#### Features

* **all:** add initial implementation ([dd63fb8d](http://github.com/aurelia/fetch-client/commit/dd63fb8dc1a4261c325a7a5f82c1b9b54fb8f000))
* **http-client-configuration:** add chainable helpers for all configuration properties ([26aa9df8](http://github.com/aurelia/fetch-client/commit/26aa9df81ad24cfb9f05abdbe3341463833478f0))

