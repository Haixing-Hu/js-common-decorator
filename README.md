# js-common-decorator

[![npm package](https://img.shields.io/npm/v/@haixing_hu/common-decorator.svg)](https://npmjs.com/package/@haixing_hu/common-decorator)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-decorator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-decorator/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-common-decorator/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-decorator?branch=master)

[@haixing_hu/common-decorator] is a JavaScript library of common decorators,
provides decorators to add common methods to domain classes. The library 
supports the most recent (currently May 2023) 
[stage 3 proposal of JavaScript decorators].

## <span id="content">Table of Contents</span>

- [Usage](#usage)
  - [`@Model` Decorator](#model)
- [Usage Example](#example)
- [Configuration](#configuration)
  - [Bundling with webpack](#webpack)
  - [Bundling with vite](#vite)
- [Contributing](#contributing)
- [License](#license)

## <span id="usage">Usage</span>

### <span id="@Model">`@Model` Decorator</span>

This decorator is used to decorate a domain model class. It adds the following 
methods to the decorated class:

- Instance method `assign(obj, normalized)`: Copies the properties of the object 
  `obj` to this object, only copying properties defined in this object's class. 
  If a property in the `obj` object is `undefined` or `null`, it sets the 
  property's value to the default value. The function returns the object itself. 
  Note that `obj` can have a different prototype than this object. 
  The `normalized` parameter indicates whether to normalize this object after 
  copying properties, with a default value of `true`.
- Instance method `clear()`: Sets all the properties of this object to their 
  default values.
- Instance method `clone()`: Returns a deep clone of this object.
- Instance method `isEmpty()`: Checks if this object is empty, meaning that all 
  of its properties have default values.
- Instance method `equals(obj)`: Determines if this object is deeply equal 
  to `obj`.
- Instance method `normalize(fields)`: Normalizes a specified field of this 
  object. The `fields` parameter specifies the names of fields to be normalized. 
  If `fields` is `undefined`, `null`, or the string `"*"`, it normalizes all 
  the fields that can be normalized for this object. If `fields` is an array of 
  strings, it normalizes all the fields specified in the array. Note that a 
  field must be specified as normalized using the `@{@link Normalizable}` 
  decorator.
- Instance method `validate(fields, options)`: Validates the specified fields of
  this object. The `fields` parameter is the names of the fields to be validated. 
  If `fields` is `undefined`, `null`, or the string `"*"`, it validates all the 
  fields that can be validated for this object. If `fields` is an array of 
  strings, it validates all the fields specified in the array. Note that a field
  must be specified as validatable using the `@{@link Validatable}` decorator. 
  The `options` parameter is an object comprising additional parameters, and its 
  property values are passed as the second argument to the validation function. 
  Refer to the documentation of `@{@link Validatable}` for more details.
- Instance method `generateId()`: If the decorated class defines a property 
  named `id`, this decorator automatically adds a `generateId()` instance method. 
  Each call to this method generates a globally unique ID for the current 
  calling object (represented as a string of an integer) and returns it. Note 
  that if a parent class `A` defines the `id` field, and a subclass `B` inherits 
  the `id` field but does not define its own `id` field, the `generateId()` 
  method is added only to class `A`, not to class `B`.
- Static class method `create(obj, normalized)`: Creates a new instance object
  based on the `obj` object. It copies the property values from the corresponding 
  properties of `obj`, maintaining the same prototype and class definition. This 
  method is used to transform a plain JSON object into the specified domain 
  object. The `normalized` parameter indicates whether to normalize the returned 
  object, with a default value of `true`.
- Static class method `createArray(array, normalized)`: Creates a new instance 
  array based on an object array `array`, where each element's property values 
  are copied from the corresponding elements in `array`, maintaining the same 
  prototype and class definition. This method is used to transform an array of
  plain JSON objects into an array of specified domain objects. The `normalized`
  parameter indicates whether to normalize each object in the returned array, 
  with a default value of `true`.
- Static class method `createPage(page)`: Creates a new page object based on a
  `page` pagination object. Typically, `page` is a list of domain objects 
  obtained from a server using the GET method, and the object should conform to 
  the `Page` class definition. This static class method returns a new `Page` 
  object, with the `content` property being the result of 
  `createArray(page.content, true)`, and the other properties matching those of 
  the `page` object. If the input is not a valid `Page` object, it 
  returns `null`.
- Static class method `isNullishOrEmpty(obj)`: Determines if the given instance 
  is `undefined`, `null`, or an empty object constructed with default values.

**NOTE:** If the decorated class already implements any of the above methods, 
this decorator will not override the methods already implemented by the 
decorated class.

## <span id="example">Usage Example</span>

```js
@Model class Credential {

  @EnumNormalizer
  @Validator(validateCredentialTypeField)
  @Type(CredentialType)
  @Label('证件类型')
  type = 'IDENTITY_CARD';

  @Normalizable(trimUppercaseString)
  @Validator(validateCredentialNumberField)
  @Label('证件号码')
  number = '';

  constructor(type = CredentialType.DEFAULT.value, number = '') {
    this.type = type;
    this.number = number;
  }

  isIdentityCard() {
    return (this.type === 'IDENTITY_CARD');
  }
}

@Model class Person {

  @Normalizable(trimString)
  @Label('ID')
  id = null;

  @Normalizable(trimUppercaseString)
  @Validator(validatePersonNameField)
  @Label('姓名')
  name = '';

  @DefaultNormalizer
  @DefaultValidator
  @Type(Credential)
  @Label('证件')
  credential = null;

  @EnumNormalizer
  @Validator(validatePersonGenderField)
  @Type(Gender)
  @Label('性别')
  gender = '';

  @Normalizable(trimString)
  @Validator(validatePersonBirthdayField)
  @Label('出生日期')
  birthday = '';

  @Normalizable(trimUppercaseString)
  @Validator(validateMobileField)
  @Label('手机号码')
  mobile = '';

  @Normalizable(trimString)
  @Validator(validateEmailField)
  @Label('电子邮件地址')
  @Nullable
  email = '';

  equals(other) {
    if (!(other instanceof PersonWithEquals)) {
      return false;
    }
    if ((this.credential === null) || (other.credential === null)) {
      // If one of the two people does not have ID information, it is impossible
      // to compare whether they are the same person thus they will be considered 
      // different.
      return false;
    }
    // Two persons are logically equals if and only if they have the same 
    // credential.
    return (this.credential.type === other.credential.type)
        && (this.credential.number === other.credential.number);
  }
}
```

After applying the `@Model` decorator, the following methods will be automatically 
added:

- `Credential.prototype.assign(obj, normalized)`
- `Credential.prototype.clear()`
- `Credential.prototype.clone()`
- `Credential.prototype.isEmpty()`
- `Credential.prototype.equals(obj)`
- `Credential.prototype.normalize(fields)`
- `Credential.prototype.validate(fields, options)`
- `Credential.create(obj)`
- `Credential.createArray(array)`
- `Credential.createPage(page)`
- `Credential.isNullishOrEmpty(obj)`
- `Person.prototype.assign(obj, normalized)`
- `Person.prototype.clear()`
- `Person.prototype.clone()`
- `Person.prototype.isEmpty()`
- `Person.prototype.normalize(fields)`
- `Person.prototype.validate(fields, options)`
- `Person.prototype.generateId()`
- `Person.create(obj, normalized)`
- `Person.createArray(array, normalized)`
- `Person.createPage(page)`
- `Person.isNullishOrEmpty(obj)`

**NOTE:**

- Because the `Credential` class does not have an `id` attribute, the `@Model` 
  decorator does not add a `generateId()` instance method to it.
- Because `Person` already implements the `Person.prototype.equals()` method, 
  the `@Model` decorator will **not** override its own implementation of 
  the `Person.prototype.equals()` method.

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
