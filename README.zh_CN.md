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
    - `options: null|undefined|object`：用于赋值的额外选项。如果该参数为 `undefined` 或 `null`，则使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('assign')` 获取。可用选项包括：
        - `normalize: boolean`，指示在赋值后是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换目标对象的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即 `assign()` 方法的第一个参数。默认值为 `'LOWER_UNDERSCORE'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即调用 `assign()` 方法的对象。默认值为 `'LOWER_CAMEL'`。
- 返回值：
    - `object`：调用该方法的对象自身。

此函数将 `obj` 对象的字段复制到当前对象中，仅复制当前对象类中定义的字段。
如果 `obj` 中的字段为 `undefined` 或 `null`，将其值设为默认值。
注意，`obj` 可以与当前对象有不同的原型。

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

此函数检查当前对象是否与 `other` 深度相等。
两个对象在以下情况下被认为是深度相等的：它们具有相同的原型，并且它们的所有字段都深度相等。
两个字段在以下情况下深度相等：它们具有相同的值，或者它们都为 `undefined` 或 `null`。
如果字段是数组， 则它仅在与另一个数组具有相同长度并且其所有元素都深度相等时才被认为深度相等。
如果字段是对象，则它仅在与另一个对象具有相同的原型并且其所有字段都深度相等时才被认为深度相等。

#### <span id="model-generateId">实例方法：Class.prototype.generateId()</span>

- 参数：无。
- 返回值：
    - `string`：生成的全局唯一 ID 的字符串表示形式，并将其设置为调用该方法的对象的 `id` 字段。

如果被装饰的类定义了名为 `id` 的属性，则此实例方法 `generateId()` 会自动添加到该类中。
每次调用此方法时，都会为当前调用对象生成一个全局唯一的 ID（以整数的字符串形式表示），
将生成的 ID 设置为调用对象的 `id` 字段，并返回该 ID。注意，如果父类 `A` 定义了 `id` 字段，
而子类 `B` 继承了该 `id` 字段但没有定义自己的 `id` 字段，则 `generateId()` 方法只会添加到类 `A`，而不会添加到类 `B`。

#### <span id="model-normalizeField">实例方法：Class.prototype.normalizeField(field)</span>

- 参数：
    - `field: string`：要规范化的指定字段名称。
- 返回值：
    - `boolean`：是否成功规范化指定字段。

此函数会规范化当前对象的指定字段。如果对象具有该字段并且该字段是可规范化的，函数将规范化该字段并返回 `true`；
否则，函数不执行任何操作并返回 `false`。请注意，字段只有在被 `@Normalizable` 装饰器装饰时才是可规范化的。

#### <span id="model-normalize">实例方法：Class.prototype.normalize(fields)</span>

- 参数：
    - `fields: undefined | null | string | string[]`：要规范化的字段，可以是以下值之一：
        - `undefined`：规范化当前对象的所有可规范化字段。
        - `null`：规范化当前对象的所有可规范化字段。
        - `"*"`：规范化当前对象的所有可规范化字段。
        - `string[]`：规范化数组中指定名称的所有可规范化字段。
- 返回值：
    - `object`：规范化后的调用对象。

此函数规范化当前对象的指定字段。`fields` 参数指定要规范化的字段名称。
如果 `fields` 为 `undefined`、`null` 或字符串 `"*"`, 则规范化当前对象的所有可规范化字段。
如果 `fields` 是一个字符串数组，则规范化数组中指定名称的所有可规范化字段。
请注意，字段只有在被 `@Normalizable` 装饰器装饰时才是可规范化的。

#### <span id="model-validateField">实例方法：Class.prototype.validateField(field)</span>

- 参数：
    - `field: string`：要验证的指定字段的名称。
- 返回值：
    - `ValidationResult | null`：验证结果。

此函数验证当前对象的指定字段。如果对象具有该字段并且该字段是可验证的，函数将验证该字段并返回验证结果；
否则，函数不执行任何操作并返回 `null`。请注意，字段只有在被 `@Validatable` 装饰器装饰时才是可验证的。

#### <span id="model-validate">实例方法：Class.prototype.validate(fields)</span>

- 参数：
    - `fields: undefined | null | string | string[]`：要验证的字段，可以是以下值之一：
        - `undefined`：验证当前对象的所有可验证字段。
        - `null`：验证当前对象的所有可验证字段。
        - `"*"`：验证当前对象的所有可验证字段。
        - `string[]`：验证数组中指定名称的所有可验证字段。
- 返回值：
    - `ValidationResult`：验证结果。

此函数验证当前对象的指定字段。`fields` 参数指定要验证的字段名称。
如果 `fields` 为 `undefined`、`null` 或字符串 `"*"`, 则验证当前对象的所有可验证字段。
如果 `fields` 是一个字符串数组，则验证数组中指定名称的所有可验证字段。
请注意，字段只有在被 `@Validatable` 装饰器装饰时才是可验证的。

#### <span id="model-toJSON">实例方法：Class.prototype.toJSON(key, options = undefined)</span>

- 参数：
    - `key: string`：`JSON.stringify()` 调用 `toJSON()` 时传递的参数，取以下值：
        - 如果此对象是属性值，此参数为属性名称；
        - 如果此对象在数组中，此参数为字符串形式的数组索引；
        - 如果 `JSON.stringify()` 直接调用此对象，此参数为空字符串。
    - `options: null|undefined|object`：序列化的附加选项。如果该参数为 `undefined` 或 `null`，将使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('toJSON')` 获取。可用选项包括：
        - `normalize: boolean`，指示在序列化之前是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换结果 JSON 字符串中对象属性的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即调用 `toJSON()` 方法的对象。默认值为 `'LOWER_CAMEL'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即 `toJSON()` 方法返回的 JSON 字符串中对象的命名风格。
          默认值为 `'LOWER_UNDERSCORE'`。
        - `space: string | number`，用于在输出的 JSON 字符串中插入空白（包括缩进、换行符等）。
          如果是数字，表示使用的空格字符数，最多为 10（任何大于 10 的值都视为 10）。值小于 1 表示不使用空白。
          如果是字符串，则字符串（或前 10 个字符，如果字符串长度超过 10 个字符）将插入到每个嵌套对象或数组之前。
          如果此参数不是字符串或数字（可以是原始类型或包装对象）——例如 `null` 或未提供——则不使用任何空白。
          此选项的默认值为 `null`。
- 返回值：
    - `object`：将被 `JSON.stringify()` 序列化的对象，可能是该对象的修改副本。

此函数获取要由 `JSON.stringify()` 序列化的对象。如果值有 `toJSON()` 方法，则该方法负责定义哪些数据将被序列化。
不会序列化对象本身，而是序列化调用 `toJSON()` 方法时返回的值。

**注意**：此函数返回一个将被 `JSON.stringify()` 序列化的对象，而不是 JSON 字符串。使用 `JSON.stringify()` 
或 `this.toJsonString()` 方法将此对象序列化为 JSON 字符串。

#### <span id="model-toJsonString">实例方法：Class.prototype.toJsonString(options = undefined)</span>

- 参数：
    - `options: null|undefined|object`：用于序列化的附加选项。如果该参数为 `undefined` 或 `null`，将使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('toJSON')` 获取。可用选项包括：
        - `normalize: boolean`，指示在序列化之前是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换结果 JSON 字符串中对象属性的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即调用 `toJSON()` 方法的对象。默认值为 `'LOWER_CAMEL'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即 `toJSON()` 方法返回的 JSON 字符串中对象的命名风格。
          默认值为 `'LOWER_UNDERSCORE'`。
        - `space: string | number`，用于在输出的 JSON 字符串中插入空白（包括缩进、换行符等）。
          如果是数字，表示使用的空格字符数，最多为 10（任何大于 10 的值都视为 10）。值小于 1 表示不使用空白。
          如果是字符串，则字符串（或前 10 个字符，如果字符串长度超过 10 个字符）将插入到每个嵌套对象或数组之前。
          如果此参数不是字符串或数字（可以是原始类型或包装对象）——例如 `null` 或未提供——则不使用任何空白。
          此选项的默认值为 `null`。
- 返回值：
    - `string`：从该对象序列化得到的 JSON 字符串，类似于 `JSON.stringify()`，但此函数提供了额外的字符串化选项。

此函数将该对象序列化为 JSON 字符串。

**注意**：此方法支持原生 `bigint` 值。例如，`bigint` 值 `9223372036854775807n` 将被序列化为 `9223372036854775807`。

#### <span id="model-create">类方法：Class.create(obj, options = undefined)</span>

- 参数：
    - `obj: object`：用于创建新实例的数据对象。
    - `options: null|undefined|object`：用于创建的附加选项。如果该参数为 `undefined` 或 `null`，则使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('assign')` 获取。可用选项包括：
        - `normalize: boolean`，指示在赋值后是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换目标对象的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即 `create()` 方法的第一个参数。默认值为 `'LOWER_UNDERSCORE'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即 `create()` 方法返回的对象。默认值为 `'LOWER_CAMEL'`。
- 返回值：
    - `object | null`：如果 `obj` 为 `undefined` 或 `null`，则返回 `null`；否则，返回一个新实例，
      实例的字段使用 `obj` 中的数据初始化。

此函数根据数据对象创建指定类的实例，其字段会递归地使用 `obj` 中的属性进行初始化。注意，`obj` 可以与指定类有不同的原型。

#### <span id="model-createArray">类方法：Class.createArray(array, options = undefined)</span>

- 参数：
    - `array: object[]`：用于创建新数组的数据对象数组。
    - `options: null|undefined|object`：用于创建的附加选项。如果该参数为 `undefined` 或 `null`，则使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('assign')` 获取。可用选项包括：
        - `normalize: boolean`，指示在赋值后是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换目标对象的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即 `createArray()` 方法的第一个参数的元素的命名风格。
          默认值为 `'LOWER_UNDERSCORE'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即 `createArray()` 方法返回的数组中的元素的命名风格。
          默认值为 `'LOWER_CAMEL'`。
- 返回值：
    - `object[] | null`：如果 `array` 为 `undefined` 或 `null`，则返回 `null`；否则，返回一个包含指定类实例的新数组，
      这些实例的字段由数组中的对应数据对象初始化。

此函数从数据对象数组创建指定类的实例数组。返回数组中的实例字段会递归地使用数组中对应数据对象的属性进行初始化。
注意，`array` 中的数据对象可以与指定类有不同的原型。

#### <span id="model-createPage">类方法：Class.createPage(page, options = undefined)</span>

- 参数：
    - `page: object`：用于创建新的 `Page` 实例的分页数据对象。
    - `options: null|undefined|object`：用于创建的附加选项。如果该参数为 `undefined` 或 `null`，则使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('assign')` 获取。可用选项包括：
        - `normalize: boolean`，指示在赋值后是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换目标对象的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即 `createPage()` 方法第一个参数 `content` 
          数组中的元素的命名风格。默认值为 `'LOWER_UNDERSCORE'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即 `createPage()` 方法返回的 `Page` 对象中 
          `content` 数组中的元素的命名风格。默认值为 `'LOWER_CAMEL'`。
- 返回值：
    - `Page | null`：如果 `page` 为 `undefined` 或 `null`，则返回 `null`；否则返回一个新的 `Page` 类实例，
      其内容由分页数据对象 `page` 的内容初始化。

此函数创建一个 `Page` 对象，其内容由指定的分页数据对象初始化。通常，`page` 是通过 `GET` 方法从服务器获取的领域对象列表，
且对象应符合 `Page` 类的定义。此类方法返回一个新的 `Page` 对象，其中 `content` 属性是 
`createArray(page.content, options)` 的结果，其他属性与 `page` 对象的属性一致。
如果 `page` 不是有效的 `Page` 对象，则返回 `null`。

#### <span id="model-isNullishOrEmpty">类方法：Class.isNullishOrEmpty(obj)</span>

- 参数：
    - `obj: object`：要检查的对象。
- 返回值：
    - `boolean`：指定对象是否为 `undefined`、`null` 或由默认值构造的空对象。

此函数检查指定对象是否为 `undefined`、`null` 或是由默认值构造的空对象。当且仅当对象的所有字段都具有默认值时，
该对象才被认为是空的。字段的默认值是类的默认构造实例中的字段值。此函数是一个便捷的方法，用于在处理空值时调用 
`Class.prototype.isEmpty()`。

#### <span id="model-parseJsonString">类方法：Class.parseJsonString(json, options = undefined)</span>
- 
- 参数：
    - `json: string`：要解析的 JSON 字符串。
    - `options: null|undefined|object`：解析的附加选项。如果该参数为 `undefined` 或 `null`，则使用默认选项。
      默认选项可通过调用 `DefaultOptions.get('assign')` 获取。可用选项包括：
        - `normalize: boolean`，指示在赋值后是否对该对象进行规范化。默认值为 `true`。
        - `convertNaming: boolean`，指示是否转换 JSON 字符串中对象属性的命名风格。默认值为 `false`。
        - `sourceNamingStyle: string`，源对象的命名风格，即 JSON 字符串中对象的命名风格。默认值为 `'LOWER_UNDERSCORE'`。
        - `targetNamingStyle: string`，目标对象的命名风格，即 `parseJsonString()` 方法返回的对象的命名风格。
          默认值为 `'LOWER_CAMEL'`。
- 返回值：
    - `boolean`：指定对象是否为 `undefined`、`null`，或是由默认值构造的空对象。

此函数从 JSON 字符串中解析出当前类的对象。

**注意**：此方法支持超出 IEEE 754 整数精度的整数值。例如，整数值 `9223372036854775807` 将被解析为原生的 
`bigint` 值 `9223372036854775807n`。

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

- `Credential.prototype.assign(obj, options = undefined)`
- `Credential.prototype.clear()`
- `Credential.prototype.clone()`
- `Credential.prototype.isEmpty()`
- `Credential.prototype.equals(obj)`
- `Credential.prototype.normalize(fields)`
- `Credential.prototype.validate(fields, options)`
- `Credential.prototype.toJSON(key, options = undefined)`
- `Credential.prototype.toJsonString(options = undefined)`
- `Credential.create(obj, options = undefined)`
- `Credential.createArray(array, options = undefined)`
- `Credential.createPage(page, options = undefined)`
- `Credential.isNullishOrEmpty(obj)`
- `Credential.parseJsonString(json, options = undefined)`
- `Person.prototype.assign(obj, normalized)`
- `Person.prototype.clear()`
- `Person.prototype.clone()`
- `Person.prototype.isEmpty()`
- `Person.prototype.normalize(fields)`
- `Person.prototype.validate(fields, options)`
- `Person.prototype.generateId()`
- `Person.prototype.toJSON(key, options = undefined)`
- `Person.prototype.toJsonString(options = undefined)`
- `Person.create(obj, options = undefined)`
- `Person.createArray(array, options = undefined)`
- `Person.createPage(page, options = undefined)`
- `Person.isNullishOrEmpty(obj)`
- `Person.parseJsonString(json, options = undefined)`

**注意：**

- 因为 `Credential` 类没有 `id` 属性，`@Model` 装饰器不会为其添加 `generateId()` 实例方法。
- 因为 `Person` 类已经实现了 `Person.prototype.equals()` 方法，`@Model` 装饰器不会覆盖该方法。

### <span id="enum">@Enum 装饰器</span>

此装饰器用于装饰枚举类。

#### <span id="enum-fields">枚举字段</span>

枚举类是一个类，其实例为枚举对象。枚举对象具有以下属性：

- `value`：枚举对象的值，正是对应枚举类的静态字段的名称。
- `name`：枚举对象的显示名称，可以通过对应枚举类静态字段的默认字符串或对象值指定。如果未指定默认值，枚举对象的名称与其值相同。
- `i18n`：枚举对象的国际化（i18n）键，这是一个可选属性。可以通过对应枚举类静态字段的默认对象值指定。如果指定了该属性，
  `name` 属性将会被转换为 `getter`，用于从 i18n 资源包中获取枚举对象的国际化值。
- `code`：枚举对象的代码，这是一个可选属性。可以通过对应枚举类静态字段的默认对象值指定。
- 其他属性：可以通过对应枚举类静态字段的默认对象值指定枚举对象的其他属性。

#### <span id="enum-toString">实例方法：Class.prototype.toString()</span>

- 参数：无。
- 返回值：
    - `string`：该枚举对象的字符串表示形式，即枚举对象的 `value`。

此函数返回该枚举对象的字符串表示形式，即该枚举对象的 `value`。

#### <span id="enum-toJSON">实例方法：Class.prototype.toJSON()</span>

- 参数：无。
- 返回值：
    - `string`：该枚举对象的 JSON 表示形式，即枚举对象 `value` 的 JSON 字符串表示形式，即 `value` 的双引号字符串。

此函数返回该枚举对象的 JSON 表示形式。

#### <span id="enum-values">类方法：Class.values()</span>

- 参数：无。
- 返回值：
    - `Class[]`：该枚举类中所有枚举对象的数组。

此函数返回该枚举类中所有枚举对象的数组。

#### <span id="enum-ofValue">类方法：Class.ofValue(value)</span>

- 参数：
    - `value: string`：要返回的枚举对象的值。请注意，此参数将被去除空格并转换为大写以获取实际的枚举对象值。
- 返回值：
    - `Class`：该枚举类中具有指定值的枚举对象，如果不存在这样的枚举对象，则返回 `undefined`。

此函数返回具有指定值的枚举对象。

#### <span id="enum-hasValue">类方法：Class.hasValue(value)</span>

- 参数：
    - `value: string`：要测试的枚举对象的值。请注意，此参数将被去除空格并转换为大写以获取实际的枚举对象值。
- 返回值：
    - `boolean`：如果该枚举类中存在具有指定值的枚举对象，返回 `true`；否则返回 `false`。

此函数用于测试是否存在具有指定值的枚举对象。

#### <span id="enum-ofName">类方法：Class.ofName(name)</span>

- 参数：
    - `name: string`：要返回的枚举对象的名称。
- 返回值：
    - `Class`：该枚举类中具有指定名称的枚举对象，如果不存在这样的枚举对象，则返回 `undefined`。

此函数返回具有指定名称的枚举对象。

#### <span id="enum-hasName">类方法：Class.hasName(name)</span>

- 参数：
    - `name: string`：要测试的枚举对象的名称。
- 返回值：
    - `boolean`：如果该枚举类中存在具有指定名称的枚举对象，返回 `true`；否则返回 `false`。

此函数用于测试是否存在具有指定名称的枚举对象。

#### <span id="enum-ofCode">类方法：Class.ofCode(code)</span>

- 参数：
    - `code: string`：要返回的枚举对象的代码。
- 返回值：
    - `Class`：该枚举类中具有指定代码的枚举对象，如果不存在这样的枚举对象，则返回 `undefined`。

此函数返回具有指定代码的枚举对象。

#### <span id="enum-hasCode">类方法：Class.hasCode(code)</span>

- 参数：
    - `code: string`：要测试的枚举对象的代码。
- 返回值：
    - `boolean`：如果该枚举类中存在具有指定代码的枚举对象，返回 `true`；否则返回 `false`。

此函数用于测试是否存在具有指定代码的枚举对象。

#### <span id="enum-of">类方法：Class.of(expr)</span>

- 参数：
    - `expr: object | string`：与要返回的枚举对象对应的表达式。该表达式可以是以下之一：
        - 该枚举类的一个枚举对象；
        - 或该枚举类的一个枚举对象的值；
        - 或该枚举类的一个枚举对象的名称；
        - 或该枚举类的一个枚举对象的代码。
- 返回值：
    - `Class`：该枚举类中与指定表达式对应的枚举对象，如果不存在这样的枚举对象，则返回 `undefined`。

此函数返回与指定表达式对应的枚举对象。

#### <span id="enum-has">类方法：Class.has(expr)</span>

- 参数：
    - `expr: object | string`：与要返回的枚举对象对应的表达式。该表达式可以是以下之一：
        - 该枚举类的一个枚举对象；
        - 或该枚举类的一个枚举对象的值；
        - 或该枚举类的一个枚举对象的名称；
        - 或该枚举类的一个枚举对象的代码。
- 返回值：
    - `boolean`：如果该枚举类中存在与指定表达式对应的枚举对象，返回 `true`；否则返回 `false`。

此函数用于测试是否存在与指定表达式对应的枚举对象。

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

  static of(expr) {
    if (expr instanceof Gender) {
      return expr;
    } else {
      return Gender.ofValue(expr) ?? Gender.ofName(expr) ?? Gender.ofCode(expr);
    }
  }

  static has(expr) {
    return Gender.of(expr) !== undefined;
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
  static MALE = Object.freeze(new Gender('MALE', 'Male', 
    { i18n: 'i18n.gender.male', code: '001', data: { value: 0 } }));

  static FEMALE = Object.freeze(new Gender('FEMALE', 'Female',
    { i18n: 'i18n.gender.female', code: '002', data: { value: 1 } }));

  constructor(value, name, payload) {
    this.value = value;
    this.name = name;
    Object.assign(this, payload);
  }
}
```

请注意，上述 `Gender` 类中的枚举对象具有 `code`、`i18n` 和 `data` 属性。由于它具有指定枚举对象在资源包中的 i18n 
键的 `i18n` 属性，因此枚举对象的 `name` 属性将会被转换为一个 `getter`，用于从 i18n 资源包中获取与 i18n 键对应的
i18n 值。

枚举对象也可以在没有默认值的情况下定义，例如：

```js
@Enum
class Gender {
  static MALE;
  static FEMALE;
}
```

以上代码等同于下述代码：

```js
class Gender {
  static MALE = Object.freeze(new Gender('MALE'));

  static FEMALE = Object.freeze(new Gender('FEMALE'));

  ...

  constructor(value) {
    this.value = value;
    this.name = value;
  }

  ...
}
```

也就是说，枚举对象的名称与其值完全相同。

#### <span id="default-options">`DefaultOptions` 类</span>

`DefaultOptions` 类用于获取或设置此库中不同方面的默认选项。

该类访问一个内部的 `Map` 对象。该 `Map` 的键是各方面的名称，值是代表这些方面的默认选项的对象。

例如，使用 `@Model` 装饰的类的 `assign()` 方法的默认选项存储在键 `assign` 中。也就是说，
调用 `DefaultOption.get('assign')` 会返回 `assign()` 方法的默认选项对象。

程序可以通过 `DefaultOptions.set('key', options)` 方法更改默认选项。

当前支持以下方面：
- `assign`：用于 `Class.prototype.assign()`、`Class.create()`、`Class.createArray()`、
  `Class.createPage()` 和 `Class.parseJsonString()` 方法的默认选项。
- `toJSON`：用于 `Class.prototype.toJSON()` 和 `Class.prototype.toJsonString()` 方法的默认选项。

#### <span id="default-options-get">类方法：`DefaultOptions.get(aspect)`</span>

获取指定方面的默认选项。

该函数返回表示该方面默认选项的对象，如果该方面不存在，则返回 `undefined`。请注意，返回的对象是存储在内部 `Map` 
中对象的深度克隆副本，因此对返回对象的修改 **不会** 影响内部 `Map` 中存储的默认选项。

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

此函数会将新选项合并到该方面的旧默认选项中。如果新选项中具有与内部 `Map` 中存储的旧默认选项相同的属性，
新选项的值将覆盖旧默认选项的值；否则，新属性将被添加到旧默认选项中。

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

获取指定方面的默认选项，并将提供的默认选项合并到返回的对象中。

**注意：** 此函数**不会**更改存储在内部 `Map` 中的默认选项，而是返回一个表示合并选项的新对象。

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
const opt2 = DefaultOptions.merge('assign', { convertNaming: true });
expect(opt2.convertNaming).toBe(true);
expect(opt1.convertNaming).toBe(false);
```

## <span id="configuration">配置</span>

此库使用了最新的（截至2023年5月的）[JavaScript 装饰器 stage 3 提案]。因此，必须使用 
[@babel/plugin-transform-class-properties] 和 [@babel/plugin-proposal-decorators] 
插件配置 [Babel]。

**注意：** 为了支持 [JavaScript 装饰器元数据 stage 3 提案]，[Babel] 插件 [@babel/plugin-proposal-decorators]
的版本必须至少为 `7.23.0`。

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
2. 使用 [@babel/plugin-transform-class-properties] 和 [@babel/plugin-proposal-decorators] 插件配置 [Babel]。
   一个可能的 [Babel] 配置文件 `babelrc.json` 如下：
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
   **注意：** 使用 [vite] 打包时，确保将 `@babel/preset-env` 的 `modules` 参数设置为 `false`。
3. 通过修改 `vite.config.js` 文件为 [Babel] 添加支持。一个可能的 `vite.config.js` 文件如下：
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
   **注意：** 在上面的配置文件中，我们实现了一个简单的 [vite] 插件，使用 [Babel] 对 [vite-plugin-vue] 插件处理的代码进行转译。
   虽然有一个 [vite-plugin-babel] 插件声称为 [vite] 添加 [Babel] 支持，但我们发现它未能正确处理 [vue] 单文件组件 (SFCs)。
   经过仔细研究其源代码，我们确定为了实现正确的转译，需要在 [vite-plugin-vue] 处理代码之后应用 [Babel]。
   因此，上述简单的插件功能足以满足我们的需求。作为替代方案，你也可以使用 [我们的 vite-plugin-babel]，以下是一个示例配置：
    ```js
    import { fileURLToPath, URL } from 'node:url';
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import babel from '@haixing_hu/vite-plugin-babel';
    
    export default defineConfig({
      plugins: [
        vue({
          script: {
            babelParserPlugins: ['decorators'], // 必须启用 decorators 支持
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

## <span id="contributing">贡献</span>

如果你发现任何问题或有改进建议，请随时在 [GitHub 仓库] 上提交 issue 或 pull request。

## <span id="license">许可证</span>

[@haixing_hu/common-decorator] 根据 Apache 2.0 许可证分发。详情请参阅 [LICENSE](LICENSE) 文件。

[@haixing_hu/common-decorator]: https://npmjs.com/package/@haixing_hu/common-decorator
[Babel]: https://babeljs.io/
[@babel/plugin-transform-class-properties]: https://babeljs.io/docs/babel-plugin-transform-class-properties
[@babel/plugin-proposal-decorators]: https://babeljs.io/docs/babel-plugin-proposal-decorators
[JavaScript 装饰器 stage 3 提案]: https://github.com/tc39/proposal-decorators
[JavaScript 装饰器元数据 stage 3 提案]: https://github.com/tc39/proposal-decorator-metadata
[GitHub 仓库]: https://github.com/Haixing-Hu/js-common-decorator
[webpack]: https://webpack.js.org/
[vite]: https://vitejs.dev/
[vite-plugin-vue]: https://www.npmjs.com/package/@vitejs/plugin-vue
[vite-plugin-babel]: https://www.npmjs.com/package/vite-plugin-babel
[我们的 vite-plugin-babel]: https://npmjs.com/package/@haixing_hu/vite-plugin-babel
