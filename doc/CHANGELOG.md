## [1.8.1](https://github.com/aurelia/fetch-client/compare/1.8.0...1.8.1) (2019-03-15)


### Bug Fixes

* **all:** change es2015 back to native-modules ([14245e8](https://github.com/aurelia/fetch-client/commit/14245e8))
* **build:** adjust build script, add umd es2015, fix unpkg field ([b62089f](https://github.com/aurelia/fetch-client/commit/b62089f))
* **ci:** adjust test scripts, separate single/watch mode ([0309253](https://github.com/aurelia/fetch-client/commit/0309253))
* **retry-interceptor:** conform to Interceptor interface ([daae14b](https://github.com/aurelia/fetch-client/commit/daae14b))



# [1.8.0](https://github.com/aurelia/fetch-client/compare/1.7.0...1.8.0) (2019-01-18)

### Bug Fixes

* **http-client:** call trackRequestEnd when fetch fails ([cf64989](https://github.com/aurelia/fetch-client/commit/cf64989))
* Conversion to TypeScript

<a name="1.7.0"></a>
# [1.7.0](https://github.com/aurelia/fetch-client/compare/1.6.0...1.7.0) (2018-12-01)

### Features

* added 'aurelia-fetch-client-request-started' event

<a name="1.6.0"></a>
# [1.6.0](https://github.com/aurelia/fetch-client/compare/1.5.0...1.6.0) (2018-09-25)


### Bug Fixes

* **doc:** fix polyfill example with whatwg-fetch ([df50f6d](https://github.com/aurelia/fetch-client/commit/df50f6d))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/aurelia/fetch-client/compare/1.4.0...1.5.0) (2018-09-11)

### Features

* add an aurelia-fetch-client-requests-drained event
* add get/post/put/delete helpder methods

<a name="1.4.0"></a>
# [1.4.0](https://github.com/aurelia/fetch-client/compare/1.3.1...1.4.0) (2018-06-14)


### Features

* **fetch-client:** add retry functionality ([d16447a](https://github.com/aurelia/fetch-client/commit/d16447a))
* **http-client:** Expose buildRequest helper API ([33d364d](https://github.com/aurelia/fetch-client/commit/33d364d))
* **http-client:** Expose HttpClient to interceptors ([36518bc](https://github.com/aurelia/fetch-client/commit/36518bc))
* **http-client:** Forward Request from response interceptor ([cc91034](https://github.com/aurelia/fetch-client/commit/cc91034))
* **interface:** add signal to RequestInit interface ([7a056c0](https://github.com/aurelia/fetch-client/commit/7a056c0))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/aurelia/fetch-client/compare/1.3.0...v1.3.1) (2018-01-30)


### Bug Fixes

* **http-client:** Rework application/json header ([946273a](https://github.com/aurelia/fetch-client/commit/946273a)), closes [#90](https://github.com/aurelia/fetch-client/issues/90)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/fetch-client/compare/1.2.0...v1.3.0) (2018-01-24)


### Bug Fixes

* **util:** Discontinue using Blob for JSON ([03ae35f](https://github.com/aurelia/fetch-client/commit/03ae35f)), closes [#90](https://github.com/aurelia/fetch-client/issues/90)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/fetch-client/compare/1.1.3...v1.2.0) (2017-12-20)


### Features

* **HttpClient:** add JSON.stringify replacer ([2fc49a9](https://github.com/aurelia/fetch-client/commit/2fc49a9))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/aurelia/fetch-client/compare/1.1.2...v1.1.3) (2017-08-22)

### Bug Fixes

* fix style typo in error message that affected links displayed in editors

<a name="1.1.2"></a>
## [1.1.2](https://github.com/aurelia/fetch-client/compare/1.1.1...v1.1.2) (2017-03-23)

### Bug Fixes

* Fix blob serialization for undefined body.

<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/fetch-client/compare/1.1.0...v1.1.1) (2017-02-21)

* Documentation update.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/fetch-client/compare/1.0.1...v1.1.0) (2016-12-03)


### Features

* passing current config to configure(function(config)) ([124c28b](https://github.com/aurelia/fetch-client/commit/124c28b)), closes [#74](https://github.com/aurelia/fetch-client/issues/74)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/aurelia/fetch-client/compare/1.0.0...v1.0.1) (2016-08-26)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/fetch-client/compare/1.0.0-rc.1.0.1...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.1"></a>
# [1.0.0-rc.1.0.1](https://github.com/aurelia/fetch-client/compare/1.0.0-rc.1.0.0...v1.0.0-rc.1.0.1) (2016-07-12)



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/fetch-client/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.5 (2016-05-10)


### 1.0.0-beta.1.2.4 (2016-05-10)


### 1.0.0-beta.1.2.3 (2016-04-29)


### 1.0.0-beta.1.2.2 (2016-04-29)

* documentation update

### 1.0.0-beta.1.2.1 (2016-04-08)

#### Bug Fixes
* **http-client:** Don't create a new request when one is passed to fetch but do apply any default headers

### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.1 (2016-03-01)


#### Bug Fixes

* **all:** remove core-js dependency ([f91bd742](http://github.com/aurelia/fetch-client/commit/f91bd742ebb9377904d202e689af3df6fe1a2a7d))
* **http-client:**
  * don't combine request url with base url when request url is absolute ([d1be3b4e](http://github.com/aurelia/fetch-client/commit/d1be3b4e75fd9d65efac2b2b29bb52f5b4959e01))
  * handle last null param in fetch method ([5b5d1333](http://github.com/aurelia/fetch-client/commit/5b5d13331d425c8988fd28d3b7245734bffa6188))


### 1.0.0-beta.1.1.0 (2016-01-29)


#### Bug Fixes

* **http-client:** ensure default content-type is respected ([f001ebaf](http://github.com/aurelia/fetch-client/commit/f001ebafe47ecc0ebbc74f597ac7ee904194b734), closes [#32](http://github.com/aurelia/fetch-client/issues/32))


#### Features

* **all:** update jspm meta; core-js ([dd62f230](http://github.com/aurelia/fetch-client/commit/dd62f23099f3e6851eb394b57de6d4da121a241c))
* **interceptors:** provide Request to response interceptors ([2d24beaa](http://github.com/aurelia/fetch-client/commit/2d24beaa39104074a3c094f5544afc3d7d8ace75), closes [#33](http://github.com/aurelia/fetch-client/issues/33))


### 1.0.0-beta.1.0.2 (2015-12-17)


#### Bug Fixes

* **http-client:**
  * work around bug in IE/Edge where Blob types are ignored ([36407e27](http://github.com/aurelia/fetch-client/commit/36407e27c5b1881473151126fed53f74299ad296))
  * correct type check ([d38d1b34](http://github.com/aurelia/fetch-client/commit/d38d1b34373c50907e7c7673def8ba0ebc5a5427))


## 1.0.0-beta.1.0.1 (2015-12-03)


#### Bug Fixes

* **build:**
  * fix duplicate type definition error when building docs ([15d7213c](http://github.com/aurelia/fetch-client/commit/15d7213cd2173b3cdb03c9267fb64112d7d978c9))
  * include fetch API typings with this library's typings ([b2869d57](http://github.com/aurelia/fetch-client/commit/b2869d5741bccbea1e12a8d40e19d5f1fa1aedfa), closes [#15](http://github.com/aurelia/fetch-client/issues/15), [#23](http://github.com/aurelia/fetch-client/issues/23))


### 1.0.0-beta.1 (2015-11-16)


#### Features

* **http-client:** throw an error with a helpful message when used in an environment with no fetch  ([843451da](http://github.com/aurelia/fetch-client/commit/843451da2aeb166dc25258738351b71c925eeca6), closes [#21](http://github.com/aurelia/fetch-client/issues/21))


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
