'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaFetchClient = require('./aurelia-fetch-client');

Object.keys(_aureliaFetchClient).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaFetchClient[key];
    }
  });
});