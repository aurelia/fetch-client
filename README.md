# aurelia-fetch-client

[![npm Version](https://img.shields.io/npm/v/aurelia-fetch-client.svg)](https://www.npmjs.com/package/aurelia-fetch-client)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/aurelia/fetch-client.svg?style=shield)](https://circleci.com/gh/aurelia/fetch-client)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a simple client based on the Fetch standard.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions look around our [Discourse forums](https://discourse.aurelia.io/), chat in our [community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/docs). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Documentation

You can read documentation on the fetch client [here](http://aurelia.io/docs/plugins/http-services#aurelia-fetch-client). If you would like to help improve this documentation, the source for the above can be found in the doc folder within this repository.

## Platform Support

This library can be used in the browser or on the server. A Fetch API polyfill may be needed.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. To build the code, you can now run:

  ```shell
  npm run build
  ```
4. You will find the compiled code in the `dist` folder, available in module formats: ESM, AMD, CommonJS and UMD.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. You can now run the tests with this command:

  ```shell
  npm run test
  ```
