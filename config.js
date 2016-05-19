System.config({
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.2.2",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0-beta.1.1.4",
    "npm:aurelia-polyfills@1.0.0-beta.1.1.4": {
      "aurelia-pal": "npm:aurelia-pal@1.0.0-beta.1.2.2"
    }
  }
});
