# js-common-decorator

[![npm package](https://img.shields.io/npm/v/@haixing_hu/common-decorator.svg)](https://npmjs.com/package/@haixing_hu/common-decorator)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![英文文档](https://img.shields.io/badge/文档-英文版-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-decorator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-decorator/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-common-decorator/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-decorator?branch=master)

[@haixing_hu/common-decorator] 是一个 JavaScript 通用装饰器库，提供装饰器用于为领域类添加常用方法。
该库支持 JavaScript 装饰器的最新 (截至2023年5月) [stage 3 提案]。

## <span id="content">目录</span>

- [使用方法](#usage)
    - [@Model 装饰器](#model)
        - [实例方法：Class.prototype.assign(obj, options = undefined)](#model-assign)
        - [实例方法：Class.prototype.clone()](#model-clone)
        - [实例方法：Class.prototype.isEmpty()](#model-isEmpty)
        - [实例方法：Class.prototype.clear()](#model-clear)
        - [实例方法：Class.prototype.equals(other)](#model-equals)
        - [实例方法：Class.prototype.generateId()](#model-generateId)
        - [实例方法：Class.prototype.normalizeField(field)](#model-normalizeField)
        - [实例方法：Class.prototype.normalize(fields)](#model-normalize)
        - [实例方法：Class.prototype.validateField(field)](#model-validateField)
        - [实例方法：Class.prototype.validate(fields)](#model-validate)
        - [实例方法：Class.prototype.toJSON(key, options = undefined)](#model-toJSON)
        - [实例方法：Class.prototype.toJsonString(options = undeinfed)](#model-toJsonString)
        - [类方法：Class.create(obj, options = undefined)](#model-create)
        - [类方法：Class.createArray(array, options = undefined)](#model-createArray)
        - [类方法：Class.createPage(page, options = undefined)](#model-createPage)
        - [类方法：Class.isNullishOrEmpty()](#model-isNullishOrEmpty)
        - [类方法：Class.parseJsonString(json, options=undefined)](#model-parseJsonString)
        - [使用示例](#model-usage-examples)
    - [@Enum 装饰器](#enum)
        - [枚举字段](#enum-fields)
        - [实例方法：Class.prototype.toString()](#enum-toString)
        - [实例方法：Class.prototype.toJSON()](#enum-toJSON)
        - [类方法：Class.values()](#enum-values)
        - [类方法：Class.ofValue(value)](#enum-ofValue)
        - [类方法：Class.hasValue(value)](#enum-hasValue)
        - [类方法：Class.ofName(name)](#enum-ofName)
        - [类方法：Class.hasName(name)](#enum-hasName)
        - [类方法：Class.ofCode(code)](#enum-ofCode)
        - [类方法：Class.hasCode(code)](#enum-hasCode)
        - [类方法：Class.of(expr)](#enum-of)
        - [类方法：Class.has(expr)](#enum-has)
        - [使用示例](#enum-usage-example)
    - [DefaultOptions 类](#default-options)
        - [类方法：DefaultOptions.get(name)](#default-options-get)
        - [类方法：DefaultOptions.set(name, options)](#default-options-set)
        - [类方法：DefaultOptions.merge(name, options)](#default-options-merge)
- [配置](#configuration)
    - [使用 webpack 打包](#webpack)
    - [使用 vite 打包](#vite)
- [贡献](#contributing)
- [许可证](#license)

## <span id="usage">使用方法</span>

### <span id="model">@Model 装饰器</span>

此装饰器用于装饰领域模型类，为被装饰的类添加以下实例方法和类方法。

**注意**：如果被装饰的类已经实现了以下任意方法，该装饰器将不会覆盖已经实现的方法。

#### <span id="model-assign">实例方法：Class.prototype.assign(obj, options = undefined)</span>

- 参数：
    - `obj: object`：将要复制其字段的对象，该对象可能与当前对象有不同的原型。
    - `options: null|undefined|object`：用于赋值的额外选项。如果该参数为 `undefined` 或 `null`，则使用默认选项。默认选项可通过调用 `DefaultOptions.get('assign')` 获取。可用选项包括：
        - `normalize: boolean`，指示在赋值后是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换目标对象的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即 `assign()` 方法的第一个参数。默认值为 `'LOWER_UNDERSCORE'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即调用 `assign()` 方法的对象。默认值为 `'LOWER_CAMEL'`。
- 返回值：
    - `object`：调用该方法的对象自身。

此函数将 `obj` 对象的字段复制到当前对象中，仅复制当前对象类中定义的字段。如果 `obj` 中的字段为 `undefined` 或 `null`，将其值设为默认值。注意，`obj` 可以与当前对象有不同的原型。

#### <span id="model-clone">实例方法：Class.prototype.clone()</span>

- 参数：无。
- 返回值：
    - `object`：从当前对象深度克隆的新实例，具有相同的属性值。

此函数深度克隆当前对象，返回一个与当前对象具有相同属性值的新实例。注意，返回的对象与当前对象具有相同的原型。

#### <span id="model-clear">实例方法：Class.prototype.clear()</span>

- 参数：无。
- 返回值：
    - `object`：调用该方法的对象自身。

此函数将当前对象的所有属性设置为默认值。字段的默认值是类的默认构造实例的字段值。

#### <span id="model-isEmpty">实例方法：Class.prototype.isEmpty()</span>

- 参数：无。
- 返回值：
    - `boolean`：当前对象是否为空。

此函数检查当前对象是否为空，空表示其所有字段都具有默认值。字段的默认值是类的默认构造实例的字段值。

#### <span id="model-equals">实例方法：Class.prototype.equals(other)</span>

- 参数：
    - `other: object`：与当前对象进行比较的对象。
- 返回值：
    - `boolean`：当前对象是否与 `other` 深度相等。

此函数检查当前对象是否与 `other` 深度相等。两个对象深度相等，当且仅当它们具有相同的原型，且它们的所有字段都深度相等。

#### <span id="model-generateId">实例方法：Class.prototype.generateId()</span>

- 参数：无。
- 返回值：
    - `string`：生成的全局唯一 ID 的字符串表示形式，并将其设置为调用该方法的对象的 `id` 字段。

如果被装饰的类定义了名为 `id` 的属性，则此方法会自动添加到被装饰的类中。

#### <span id="model-normalizeField">实例方法：Class.prototype.normalizeField(field)</span>

- 参数：
    - `field: string`：要规范化的指定字段名称。
- 返回值：
    - `boolean`：是否成功规范化指定字段。

此函数规范化当前对象的指定字段。

#### <span id="model-normalize">实例方法：Class.prototype.normalize(fields)</span>

- 参数：
    - `fields: undefined | null | string | string[]`：要规范化的字段，可以是以下值之一：
        - `undefined`：规范化当前对象的所有字段。
        - `null`：规范化当前对象的所有字段。
        - `"*"`：规范化当前对象的所有字段。
        - `string[]`：规范化指定字段的数组。
- 返回值：
    - `object`：规范化后的调用对象。

#### <span id="model-validateField">实例方法：Class.prototype.validateField(field)</span>

- 参数：
    - `field: string`：要验证的指定字段。
- 返回值：
    - `ValidationResult | null`：验证结果。

此函数验证当前对象的指定字段。

#### <span id="model-validate">实例方法：Class.prototype.validate(fields)</span>

- 参数：
    - `fields: undefined | null | string | string[]`：要验证的字段。
- 返回值：
    - `ValidationResult`：验证结果。

#### <span id="model-toJSON">实例方法：Class.prototype.toJSON(key, options = undefined)</span>

- 参数：
    - `key: string`：`JSON.stringify()` 调用 `toJSON()` 时传递的参数。
    - `options: null|undefined|object`：序列化的附加选项。
- 返回值：
    - `object`：要被 `JSON.stringify()` 序列化的对象。

#### <span id="model-toJsonString">实例方法：Class.prototype.toJsonString(options = undefined)</span>

- 参数：
    - `options: null|undefined|object`：序列化的附加选项。
- 返回值：
    - `string`：从当前对象序列化得到的 JSON 字符串。

#### <span id="model-create">类方法：Class.create(obj, options = undefined)</span>

- 参数：
    - `obj: object`：用于创建新实例的数据对象。
    - `options: null|undefined|object`：创建的附加选项。
- 返回值：
    - `object | null`：如果 `obj` 为 `undefined` 或 `null`，返回 `null`，否则返回使用数据对象初始化的新实例。

#### <span id="model-createArray">类方法：Class.createArray(array, options = undefined)</span>

- 参数：
    - `array: object[]`：用于创建新数组的数据对象数组。
    - `options: null|undefined|object`：创建的附加选项。
- 返回值：
    - `object[] | null`：如果 `array` 为 `undefined` 或 `null`，返回 `null`，否则返回使用数据对象初始化的实例数组。

#### <span id="model-createPage">类方法：Class.createPage(page, options = undefined)</span>

- 参数：
    - `page: object`：用于创建分页实例的分页数据对象。
    - `options: null|undefined|object`：创建的附加选项。
- 返回值：
    - `Page | null`：如果 `page` 为 `undefined` 或 `null`，返回 `null`，否则返回 `Page` 类的新实例。

#### <span id="model-isNullishOrEmpty">类方法：Class.isNullishOrEmpty(obj)</span>

- 参数：
    - `obj: object`：要检查的对象。
- 返回值：
    - `boolean`：对象是否为 `undefined`、`null` 或为空对象。

#### <span id="model-parseJsonString">类方法：Class.parseJsonString(json, options = undefined)</span>

- 参数：
    - `json: string`：要解析的 JSON 字符串。
    - `options: null|undefined|object`：解析的附加选项。
- 返回值：
    - `boolean`：指定对象是否为 `undefined`、`null` 或空对象。

#### <span id="model-usage-examples">使用示例</span>

以下是 `@Model` 装饰器的使用示例：

```js
@Model 
class Credential {

  @Normalizable
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

@Model 
class Person {

  @Normalizable(trimString)
  @Label('ID')
  id = null;

  @Normalizable(trimUppercaseString)
  @Validator(validatePersonNameField)
  @Label('姓名')
  name = '';

  @Normalizable
  @DefaultValidator
  @Type(Credential)
  @Label('证件')
  credential = null;

  @Normalizable
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
      return false;
    }
    return (this.credential.type === other.credential.type)
        && (this.credential.number === other.credential.number);
  }
}
```

应用 `@Model` 装饰器后，将自动添加以下方法：

- `Credential.prototype.assign(obj, normalized)`
- `Credential.prototype.clone()`
- `Credential.prototype.clear()`
- `Credential.prototype.isEmpty()`
- `Credential.prototype.equals(obj)`
- `Credential.prototype.normalizeField(field)`
- `Credential.prototype.normalize(fields)`
- `Credential.prototype.validateField(field, options)`
- `Credential.prototype.validate(fields, options)`
- `Credential.create(obj, normalized)`
- `Credential.createArray(array, normalized)`
- `Credential.createPage(page, normalized)`
- `Credential.isNullishOrEmpty(obj)`
- `Person.prototype.assign(obj, normalized)`
- `Person.prototype.clone()`
- `Person.prototype.clear()`
- `Person.prototype.isEmpty()`
- `Person.prototype.generateId()`
- `Person.prototype.normalizeField(field)`
- `Person.prototype.normalize(fields)`
- `Person.prototype.validateField(field, options)`
- `Person.prototype.validate(fields, options)`
- `Person.create(obj, normalized)`
- `Person.createArray(array, normalized)`
- `Person.createPage(page, normalized)`
- `Person.isNullishOrEmpty(obj)`

**注意：**

- 因为 `Credential` 类没有 `id` 属性，`@Model` 装饰器不会为其添加 `generateId()` 实例方法。
- 因为 `Person` 类已经实现了 `Person.prototype.equals()` 方法，`@Model` 装饰器不会覆盖该方法。

### <span id="enum">@Enum 装饰器</span>

此装饰器用于装饰枚举类。

#### <span id="enum-fields">枚举字段</span>

枚举类是一个类，其实例是枚举对象。枚举对象具有以下属性：
- `value`：枚举对象的值，正是对应枚举类的静态字段的名称。
- `name`：枚举对象的显示名称。
- `i18n`：枚举对象的 i18n 键。
- `code`：枚举对象的代码。
- 其他属性：可以通过枚举类的静态字段的默认值指定。

#### <span id="enum-toString">实例方法：Class.prototype.toString()</span>

- 参数：无。
- 返回值：
    - `string`：枚举对象的字符串表示形式。

#### <span id="enum-toJSON">实例方法：Class.prototype.toJSON()</span>

- 参数：无。
- 返回值：
    - `string`：枚举对象的 JSON 表示形式。

#### <span id="enum-values">类方法：Class.values()</span>

- 参数：无。
- 返回值：
    - `Class[]`：该枚举类的所有枚举对象数组。

#### <span id="enum-ofValue">类方法：Class.ofValue(value)</span>

- 参数：
    - `value: string`：枚举对象的值。
- 返回值：
    - `Class`：对应值的枚举对象，若不存在则返回 `undefined`。

#### <span id="enum-hasValue">类方法：Class.hasValue(value)</span>

- 参数：
    - `value: string`：要检查的枚举对象值。
- 返回值：
    - `boolean`：是否存在对应值的枚举对象。

#### <span id="enum-ofName">类方法：Class.ofName(name)</span>

- 参数：
    - `name: string`：枚举对象的名称。
- 返回值：
    - `Class`：对应名称的枚举对象。

#### <span id="enum-hasName">类方法：Class.hasName(name)</span>

- 参数：
    - `name: string`：要检查的枚举对象名称。
- 返回值：
    - `boolean`：是否存在对应名称的枚举对象。

#### <span id="enum-ofCode">类方法：Class.ofCode(code)</span>

- 参数：
    - `code: string`：枚举对象的代码。
- 返回值：
    - `Class`：对应代码的枚举对象。

#### <span id="enum-hasCode">类方法：Class.hasCode(code)</span>

- 参数：
    - `code: string`：要检查的枚举对象代码。
- 返回值：
    - `boolean`：是否存在对应代码的枚举对象。

#### <span id="enum-of">类方法：Class.of(expr)</span>

- 参数：
    - `expr: object | string`：表示枚举对象的表达式。
- 返回值：
    - `Class`：对应表达式的枚举对象。

#### <span id="enum-has">类方法：Class.has(expr)</span>

- 参数：
    - `expr: object | string`：表示枚举对象的表达式。
- 返回值：
    - `boolean`：是否存在对应表达式的枚举对象。

#### <span id="enum-usage-example">使用示例</span>

```js
@Enum
class Gender {
  static MALE = 'Male';
  static FEMALE = 'Female';
}
```

以上代码等同于：

```js
class Gender {
  static MALE = Object.freeze(new Gender('MALE', 'Male'));

  static FEMALE = Object.freeze(new Gender('FEMALE', 'Female'));

  static values() {
    return [Gender.MALE, Gender.FEMALE];
  }

  static ofValue(value) {
    switch (value) {
      case 'MALE':
        return Gender.MALE;
      case 'FEMALE':
        return Gender.FEMALE;
      default:
        return undefined;
    }
  }

  static hasValue(value) {
    return Gender.ofValue(value) !== undefined;
  }

  static ofName(name) {
    return Gender.values().find((e) => e.name === name);
  }

  static hasName(name) {
    return Gender.ofName(name) !== undefined;
  }

  static ofCode(code) {
    return Gender.values().find((e) => e.code === code);
  }

  static hasCode(code) {
    return Gender.ofCode(code) !== undefined;
  }

  constructor(value, name) {
    this.value = value;
    this.name = name;
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}
```

枚举类的静态字段还可以指定为对象。例如：

```js
@Enum
class Gender {
  static MALE = { name: 'Male', i18n: 'i18n.gender.male', code: '001', data: { value: 0 } };

  static FEMALE = { name: 'Female', i18n: 'i18n.gender.female', code: '002', data: { value: 1 } };
}
```

以上代码等同于：

```js
class Gender {
  static MALE = Object.freeze(new Gender('MALE', 'Male', { i18n: 'i18n.gender.male', code: '001', data: { value: 0 } }));

  static FEMALE = Object.freeze(new Gender('FEMALE', 'Female', { i18n: 'i18n.gender.female', code: '002', data: { value: 1 } }));

  constructor(value, name, payload) {
    this.value = value;
    this.name = name;
    Object.assign(this, payload);
  }
}
```

#### <span id="default-options">`DefaultOptions` 类</span>

`DefaultOptions` 类用于获取或设置此库的默认选项。

#### <span id="default-options-get">类方法：`DefaultOptions.get(aspect)`</span>

获取指定方面的默认选项。

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
opt1.convertNaming = true;
const opt2 = DefaultOptions.get('assign');
expect(opt2.convertNaming).toBe(false);
```

#### <span id="default-options-set">类方法：`DefaultOptions.set(aspect, options)`</span>

设置指定方面的默认选项。

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
DefaultOptions.set('assign', { convertNaming: true });
const opt2 = DefaultOptions.get('assign');
expect(opt2.convertNaming).toBe(true);
expect(opt1.convertNaming).toBe(false);
```

#### <span id="default-options-merge">类方法：`DefaultOptions.merge(aspect, options)`</span>

获取指定方面的默认选项，并将提供的选项合并到返回的对象中。

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
const opt2 = DefaultOptions.merge('assign', { convertNaming: true });
expect(opt2.convertNaming).toBe(true);
expect(opt1.convertNaming).toBe(false);
```

## <span id="configuration">配置</span>

此库使用 JavaScript 装饰器的最新 [stage 3 提案](截至2023年5月)。因此，必须使用 [Babel] 配置 [@babel/plugin-transform-class-properties] 和 [@babel/plugin-proposal-decorators] 插件。

### <span id="webpack">使用 [webpack] 打包</span>

1. 安装依赖：
   ```shell
   yarn add @haixing_hu/common-decorator
   yarn add --dev @babel/core @babel/runtime @babel/preset-env
   yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
   ```
2. 使用 [@babel/plugin-transform-class-properties] 和 [@babel/plugin-proposal-decorators] 插件配置 [Babel]：
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

### <span id="vite">使用 [vite] 打包</span>

1. 安装依赖：
   ```shell
   yarn add @haixing_hu/common-decorator
   yarn add --dev @babel/core @babel/runtime @babel/preset-env
   yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
   ```
2. 配置 [Babel]：
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
3. 修改 `vite.config.js` 文件，添加对 [Babel] 的支持：
   ```js
   import { fileURLToPath, URL } from 'node:url';
   import { defineConfig } from 'vite';
   import vue from '@vitejs/plugin-vue';
   import * as babel from '@babel/core';

   const babelPlugin = {
     name: 'plugin-babel',
     transform: (src, id) => {
       if (/\.(jsx?|vue)$/.test(id)) {
         return babel.transform(src, {
           filename: id,
           babelrc: true,
         });
       }
     },
   };

   export default defineConfig({
     plugins: [
       vue({
         script: {
           babelParserPlugins: ['decorators'],
         },
       }),
       babelPlugin,
     ],
     resolve: {
       alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
       },
     },
   });
   ```

## <span id="contributing">贡献</span>

如果你发现任何问题或有改进建议，请随时在 [GitHub 仓库] 上提交 issue 或 pull request。

## <span id="license">许可证</span>

[@haixing_hu/common-decorator] 根据 Apache 2.0 许可证分发。详情请参阅 [LICENSE](LICENSE) 文件。

[@haixing_hu/common-decorator]: https://npmjs.com/package/@haixing_hu/common-decorator
[Babel]: https://babeljs.io/
[@babel/plugin-transform-class-properties]: https://babeljs.io/docs/babel-plugin-transform-class-properties
[@babel/plugin-proposal-decorators]: https://babeljs.io/docs/babel-plugin-proposal-decorators
[stage 3 提案]: https://github.com/tc39/proposal-decorators
[GitHub 仓库]: https://github.com/Haixing-Hu/js-common-decorator
[webpack]: https://webpack.js.org/
[vite]: https://vitejs.dev/
