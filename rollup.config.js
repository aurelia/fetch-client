import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/aurelia-fetch-client.ts',
    output: [
      {
        file: 'dist/es2015/aurelia-fetch-client.js',
        format: 'esm'
      },
      {
        file: 'dist/umd/aurelia-fetch-client.js',
        format: 'umd',
        name: 'au.fetchClient',
        globals: {
          'aurelia-binding': 'au',
          'aurelia-dependency-injection': 'au',
          'aurelia-pal': 'au',
          'aurelia-templating': 'au',
          'aurelia-templating-resources': 'au',
        }
      }
    ],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
          }
        }
      })
    ]
  },
  {
    input: 'src/aurelia-fetch-client.ts',
    output: {
      file: 'dist/es2017/aurelia-fetch-client.js',
      format: 'esm'
    },
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2017'
          }
        }
      })
    ]
  },
  {
    input: 'src/aurelia-fetch-client.ts',
    output: [
      { file: 'dist/amd/aurelia-fetch-client.js', format: 'amd', id: 'aurelia-fetch-client' },
      { file: 'dist/commonjs/aurelia-fetch-client.js', format: 'cjs' },
      { file: 'dist/system/aurelia-fetch-client.js', format: 'system' },
      { file: 'dist/native-modules/aurelia-fetch-client.js', format: 'esm' },
    ],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5'
          }
        }
      })
    ]
  }
].map(config => {
  config.external = [
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-pal',
    'aurelia-templating',
    'aurelia-templating-resources'
  ];
  return config;
});
