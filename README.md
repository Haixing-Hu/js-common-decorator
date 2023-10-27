# js-common-decorator

[![npm package](https://img.shields.io/npm/v/@haixing_hu/common-decorator.svg)](https://npmjs.com/package/@haixing_hu/common-decorator)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-decorator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-decorator/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-common-decorator/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-decorator?branch=master)

[@haixing_hu/common-decorator] is a JavaScript library of common decorators,
supporting the most recent (currently May 2023) 
[stage 3 proposal of JavaScript decorators].

## <span id="configuration">Configuration</span>

This library uses the most recent (currently May 2023)
[stage 3 proposal of JavaScript decorators]. Therefore, you must configure
[Babel] with [@babel/plugin-transform-class-properties] and the
[@babel/plugin-proposal-decorators] plugins.

**NOTE:** To support the [stage 3 proposal of JavaScript decorator metadata],
the version of the [Babel] plugin [@babel/plugin-proposal-decorators] must be
at least `7.23.0`.

### <span id="webpack">Bundling with [webpack]</span>

1.  Install the required dependencies:
    ```shell
    yarn add @haixing_hu/common-decorator
    yarn add --dev @babel/core @babel/runtime @babel/preset-env
    yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
    ```
2.  Configure [Babel] by using the [@babel/plugin-transform-class-properties]
    and [@babel/plugin-proposal-decorators] plugins. A possible [Babel]
    configuration file `babelrc.json` is as follows:
    ```json
    {
      "presets": [
        "@babel/preset-env"
      ],
      "plugins": [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
        "@babel/plugin-transform-class-properties"
      ]
    }
    ```

### <span id="vite">Bundling with [vite]</span>

1.  Install the required dependencies:
    ```shell
    yarn add @haixing_hu/common-decorator
    yarn add --dev @babel/core @babel/runtime @babel/preset-env
    yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
    ```
2.  Configure [Babel] by using [@babel/plugin-transform-class-properties] and
    [@babel/plugin-proposal-decorators] plugins. A possible [Babel] configuration
    file `babelrc.json` is as follows:
    ```json
    {
      "presets": [
        ["@babel/preset-env", { "modules": false }]
      ],
      "plugins": [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
        "@babel/plugin-transform-class-properties"
      ]
    }
    ```
    **Note:** When bundling with [vite], make sure to set the `modules` parameter
    of `@babel/preset-env` to `false`.
3.  Configure [vite] by modifying the `vite.config.js` file to add support for
    [Babel]. A possible `vite.config.js` file is as follows:
    ```js
    import { fileURLToPath, URL } from 'node:url';
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import * as babel from '@babel/core';

    // A very simple Vite plugin support babel transpilation
    const babelPlugin = {
      name: 'plugin-babel',
      transform: (src, id) => {
        if (/\.(jsx?|vue)$/.test(id)) {              // the pattern of the file to handle
          return babel.transform(src, {
            filename: id,
            babelrc: true,
          });
        }
      },
    };
    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        vue({
          script: {
            babelParserPlugins: ['decorators'],     // must enable decorators support
          },
        }),
        babelPlugin,                                // must be after the vue plugin
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    });
    ```
    **Note:** In the above configuration file, we've implemented a simple [vite]
    plugin to transpile the code processed by the [vite-plugin-vue] plugin using
    [Babel]. Although there's a [vite-plugin-babel] plugin that claims to add
    [Babel] support to [vite], we found it doesn't correctly handle [vue] Single
    File Components (SFCs). After closely examining its source code, we
    determined that to achieve correct transpilation, we need to apply [Babel]
    after [vite-plugin-vue] processes the source code. Therefore, the very
    simple plugin function above suffices for our needs. As an alternative,
    you can use [our version of vite-plugin-babel], and the following is an 
    example configuration:
    ```js
    import { fileURLToPath, URL } from 'node:url';
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import babel from '@haixing_hu/vite-plugin-babel';

    export default defineConfig({
      plugins: [
        vue({
          script: {
            babelParserPlugins: ['decorators'],     // must enable decorators support
          },
        }),
        babel(),
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    });
    ```

For detailed configuration instructions, you can refer to:
- A sample project created with [create-vue] and [vite]: [vue3-class-component-demo-vite]

## <span id="contributing">Contributing</span>

If you find any issues or have suggestions for improvements, please feel free
to open an issue or submit a pull request to the [GitHub repository].

## <span id="license">License</span>

[@haixing_hu/common-decorator] is distributed under the Apache 2.0 license.
See the [LICENSE](LICENSE) file for more details.

[@haixing_hu/common-decorator]: https://npmjs.com/package/@haixing_hu/common-decorator
[Babel]: https://babeljs.io/
[@babel/plugin-transform-class-properties]: https://babeljs.io/docs/babel-plugin-transform-class-properties
[@babel/plugin-proposal-decorators]: https://babeljs.io/docs/babel-plugin-proposal-decorators
[stage 3 proposal of JavaScript decorators]: https://github.com/tc39/proposal-decorators
[stage 3 proposal of JavaScript decorator metadata]: https://github.com/tc39/proposal-decorator-metadata
[GitHub repository]: https://github.com/Haixing-Hu/js-common-decorator
[webpack]: https://webpack.js.org/
[vite]: https://vitejs.dev/
[vite-plugin-vue]: https://www.npmjs.com/package/@vitejs/plugin-vue
[vite-plugin-babel]: https://www.npmjs.com/package/vite-plugin-babel
[our version of vite-plugin-babel]: https://npmjs.com/package/@haixing_hu/vite-plugin-babel
