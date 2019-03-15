# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.8.2 (2019-03-15)


### Bug Fixes

* **all:** change es2015 back to native-modules ([14245e8](https://github.com/aurelia/fetch-client/commit/14245e8))
* **build:** adjust build script, add umd es2015, fix unpkg field ([b62089f](https://github.com/aurelia/fetch-client/commit/b62089f))
* **ci:** adjust test scripts, separate single/watch mode ([0309253](https://github.com/aurelia/fetch-client/commit/0309253))
* **retry-interceptor:** conform to Interceptor interface ([daae14b](https://github.com/aurelia/fetch-client/commit/daae14b))



# 1.8.0 (2019-01-18)


### Bug Fixes

* **http-client:** call trackRequestEnd when fetch fails ([cf64989](https://github.com/aurelia/fetch-client/commit/cf64989))



# 1.7.0 (2018-12-01)



# 1.6.0 (2018-09-25)


### Bug Fixes

* **doc:** fix polyfill example with whatwg-fetch ([df50f6d](https://github.com/aurelia/fetch-client/commit/df50f6d))



# 1.5.0 (2018-09-11)



# 1.4.0 (2018-06-14)


### Features

* **fetch-client:** add retry functionality ([d16447a](https://github.com/aurelia/fetch-client/commit/d16447a))
* **http-client:** Expose buildRequest helper API ([33d364d](https://github.com/aurelia/fetch-client/commit/33d364d))
* **http-client:** Expose HttpClient to interceptors ([36518bc](https://github.com/aurelia/fetch-client/commit/36518bc))
* **http-client:** Forward Request from response interceptor ([cc91034](https://github.com/aurelia/fetch-client/commit/cc91034))
* **interface:** add signal to RequestInit interface ([7a056c0](https://github.com/aurelia/fetch-client/commit/7a056c0))



## 1.3.1 (2018-01-30)


### Bug Fixes

* **http-client:** Rework application/json header ([946273a](https://github.com/aurelia/fetch-client/commit/946273a)), closes [#90](https://github.com/aurelia/fetch-client/issues/90)



# 1.3.0 (2018-01-24)


### Bug Fixes

* **util:** Discontinue using Blob for JSON ([03ae35f](https://github.com/aurelia/fetch-client/commit/03ae35f)), closes [#90](https://github.com/aurelia/fetch-client/issues/90)



# 1.2.0 (2017-12-20)


### Features

* **HttpClient:** add JSON.stringify replacer ([2fc49a9](https://github.com/aurelia/fetch-client/commit/2fc49a9))



## 1.1.3 (2017-08-22)



## 1.1.2 (2017-03-23)



## 1.1.1 (2017-02-21)



# 1.1.0 (2016-12-03)


### Features

* passing current config to configure(function(config)) ([124c28b](https://github.com/aurelia/fetch-client/commit/124c28b)), closes [#74](https://github.com/aurelia/fetch-client/issues/74)



## 1.0.1 (2016-08-26)



# 1.0.0 (2016-07-27)



# 1.0.0-rc.1.0.1 (2016-07-12)



# 1.0.0-rc.1.0.0 (2016-06-22)



# 1.0.0-beta.2.0.1 (2016-06-16)



# 1.0.0-beta.2.0.0 (2016-06-13)


### Bug Fixes

* **http-client:** silence bluebird warning ([#62](https://github.com/aurelia/fetch-client/issues/62)) ([608b133](https://github.com/aurelia/fetch-client/commit/608b133))



# 1.0.0-beta.1.2.5 (2016-05-10)



# 1.0.0-beta.1.2.4 (2016-05-10)



# 1.0.0-beta.1.2.2 (2016-04-29)



# 1.0.0-beta.1.2.1 (2016-04-08)



# 1.0.0-beta.1.2.0 (2016-03-22)



# 1.0.0-beta.1.1.1 (2016-03-01)


### Bug Fixes

* **all:** remove core-js dependency ([f91bd74](https://github.com/aurelia/fetch-client/commit/f91bd74))
* **http-client:** don't combine request url with base url when request url is absolute ([d1be3b4](https://github.com/aurelia/fetch-client/commit/d1be3b4))
* **http-client:** handle last null param in fetch method ([5b5d133](https://github.com/aurelia/fetch-client/commit/5b5d133))



# 1.0.0-beta.1.1.0 (2016-01-29)


### Bug Fixes

* **http-client:** ensure default content-type is respected ([f001eba](https://github.com/aurelia/fetch-client/commit/f001eba)), closes [#32](https://github.com/aurelia/fetch-client/issues/32)


### Features

* **all:** update jspm meta; core-js ([dd62f23](https://github.com/aurelia/fetch-client/commit/dd62f23))
* **interceptors:** provide Request to response interceptors ([2d24bea](https://github.com/aurelia/fetch-client/commit/2d24bea)), closes [#33](https://github.com/aurelia/fetch-client/issues/33)



# 1.0.0-beta.1.0.2 (2015-12-17)


### Bug Fixes

* **http-client:** correct type check ([d38d1b3](https://github.com/aurelia/fetch-client/commit/d38d1b3))
* **http-client:** work around bug in IE/Edge where Blob types are ignored ([36407e2](https://github.com/aurelia/fetch-client/commit/36407e2))



# 1.0.0-beta.1.0.1 (2015-12-03)


### Bug Fixes

* **build:** fix duplicate type definition error when building docs ([15d7213](https://github.com/aurelia/fetch-client/commit/15d7213))
* **build:** include fetch API typings with this library's typings ([b2869d5](https://github.com/aurelia/fetch-client/commit/b2869d5)), closes [#15](https://github.com/aurelia/fetch-client/issues/15) [#23](https://github.com/aurelia/fetch-client/issues/23)



# 1.0.0-beta.1 (2015-11-16)


### Features

* **http-client:** throw an error with a helpful message when used in an environment with no fetch support ([843451d](https://github.com/aurelia/fetch-client/commit/843451d)), closes [#21](https://github.com/aurelia/fetch-client/issues/21)



# 0.4.0 (2015-11-10)


### Features

* **http-client:** clean up configuration ([48c8204](https://github.com/aurelia/fetch-client/commit/48c8204))



# 0.3.0 (2015-10-13)


### Bug Fixes

* **http-client:** fix bug where default headers were sometimes not applied correctly ([c3ed06c](https://github.com/aurelia/fetch-client/commit/c3ed06c))
* **http-client:** fix firefox crash ([939f1a9](https://github.com/aurelia/fetch-client/commit/939f1a9))
* **request-init:** adjust type annotation on headers to allow objects ([aeffb65](https://github.com/aurelia/fetch-client/commit/aeffb65)), closes [#16](https://github.com/aurelia/fetch-client/issues/16)


### Features

* **HttpClient:** allow functions as default header values ([4f9153a](https://github.com/aurelia/fetch-client/commit/4f9153a)), closes [#17](https://github.com/aurelia/fetch-client/issues/17)



# 0.2.0 (2015-09-04)


### Bug Fixes

* **build:** update linting, testing and tools ([12f0cd9](https://github.com/aurelia/fetch-client/commit/12f0cd9))


### Features

* **docs:** generate api.json from .d.ts file ([80ccb0c](https://github.com/aurelia/fetch-client/commit/80ccb0c))
* **docs:** generate api.json from .d.ts file ([6d1cf4c](https://github.com/aurelia/fetch-client/commit/6d1cf4c))



## 0.1.2 (2015-08-14)


### Bug Fixes

* **http-client:** inline ConfigOrCallback type definition ([6a06260](https://github.com/aurelia/fetch-client/commit/6a06260))



## 0.1.1 (2015-07-29)


### Bug Fixes

* **all:** add corejs ([abc6fcf](https://github.com/aurelia/fetch-client/commit/abc6fcf))
* **http-client:** wrap request creation in a Promise so requestError interceptors will see errors ([522212b](https://github.com/aurelia/fetch-client/commit/522212b))
* **HttpClient:** fix crash in FF caused by attempting to iterate over Headers ([f45dd86](https://github.com/aurelia/fetch-client/commit/f45dd86))


### Features

* **all:** add type annotations ([15fbbbd](https://github.com/aurelia/fetch-client/commit/15fbbbd))
* **http-client:** make configure chainable ([946ba2c](https://github.com/aurelia/fetch-client/commit/946ba2c))



# 0.1.0 (2015-07-02)


### Features

* **all:** add initial implementation ([dd63fb8](https://github.com/aurelia/fetch-client/commit/dd63fb8))
* **http-client-configuration:** add chainable helpers for all configuration properties ([26aa9df](https://github.com/aurelia/fetch-client/commit/26aa9df))
