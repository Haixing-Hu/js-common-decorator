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
  - [@Model Decorator](#model)
    - [Instance method: Class.prototype.assign(obj, options = undefined)](#model-assign)
    - [Instance method: Class.prototype.clone()](#model-clone)
    - [Instance method: Class.prototype.isEmpty()](#model-isEmpty)
    - [Instance method: Class.prototype.clear()](#model-clear)
    - [Instance method: Class.prototype.equals(other)](#model-equals)
    - [Instance method: Class.prototype.generateId()](#model-generateId)
    - [Instance method: Class.prototype.normalizeField(field)](#model-normalizeField)
    - [Instance method: Class.prototype.normalize(fields)](#model-normalize)
    - [Instance method: Class.prototype.validateField(field)](#model-validateField)
    - [Instance method: Class.prototype.validate(fields)](#model-validate)
    - [Instance method: Class.prototype.toJSON(key, options = undefined)](#model-toJSON)
    - [Instance method: Class.prototype.toJsonString(options = undeinfed)](#model-toJsonString)
    - [Class method: Class.create(obj, options = undefined)](#model-create)
    - [Class method: Class.createArray(array, options = undefined)](#model-createArray)
    - [Class method: Class.createPage(page, options = undefined)](#model-createPage)
    - [Class method: Class.isNullishOrEmpty()](#model-isNullishOrEmpty)
    - [Class method: Class.parseJsonString(json, options=undefined)](#model-parseJsonString)
    - [Usage Examples](#model-usage-examples)
  - [@Enum Decorator](#enum)
    - [Enumerator Fields](#enum-fields)
    - [Instance method: Class.prototype.toString()](#enum-toString)
    - [Instance method: Class.prototype.toJSON()](#enum-toJSON)
    - [Class method: Class.values()](#enum-values)
    - [Class method: Class.ofValue(value)](#enum-ofValue)
    - [Class method: Class.hasValue(value)](#enum-hasValue)
    - [Class method: Class.ofName(name)](#enum-ofName)
    - [Class method: Class.hasName(name)](#enum-hasName)
    - [Class method: Class.ofCode(code)](#enum-ofCode)
    - [Class method: Class.hasCode(code)](#enum-hasCode)
    - [Class method: Class.of(expr)](#enum-of)
    - [Class method: Class.has(expr)](#enum-has)
    - [Usage Example](#enum-usage-example)
  - [DefaultOptions Class](#default-options)
    - [Class method: DefaultOptions.get(name)](#default-options-get)
    - [Class method: DefaultOptions.set(name, options)](#default-options-set)
    - [Class method: DefaultOptions.merge(name, options)](#default-options-merge)
- [Configuration](#configuration)
  - [Bundling with webpack](#webpack)
  - [Bundling with vite](#vite)
- [Contributing](#contributing)
- [License](#license)

## <span id="usage">Usage</span>

### <span id="model">@Model Decorator</span>

This decorator is used to decorate a domain model class, which adds the 
following instance and class methods to the decorated class.

**NOTE:** If the decorated class already implements any of the following methods,
this decorator will not override the methods already implemented by the decorated 
class.

#### <span id="model-assign">Instance method: Class.prototype.assign(obj, options = undefined)</span>

- Parameters:
  - `obj: object`: the object whose fields will be copied to this object,
     which may have a different prototype to this object.
  - `options: null|undefined|object`: the additional options for the assignment. 
    If this argument is `undefined` or `null`, the default options will be used. 
    The default options can be retrieved by calling `DefaultOptions.get('assign')`.
    Available options are:
      - `normalize: boolean`, indicates whether to normalize this object
        after the assignment. The default value is `true`.
      - `convertNaming: boolean`, indicates whether to convert the naming
        style of the target object. The default value is `false`.
      - `sourceNamingStyle: string`, the naming style of the source object,
        i.e., the first argument of the `assign()` method. The default value
        of this argument is `'LOWER_UNDERSCORE'`.
      - `targetNamingStyle: string`, the naming style of the target object,
        i.e., the object calling the `assign()` method. The default value
        of this argument is `'LOWER_CAMEL'`.
- Returns: 
  - `object`: the calling object itself.

This function copies the fields of the object `obj` to this object, only copying 
fields defined in this object's class. If a field in the `obj` object is 
`undefined` or `null`, it sets the field's value to the default value. Note that 
`obj` can have a different prototype to this object.

#### <span id="model-clone">Instance method: Class.prototype.clone()</span>

- Parameters: none.
- Returns: 
  - `object`: a instance of the specified class deep cloned from the calling 
    object.

This function deep clones the calling object, returning a new instance of the
specified class with the same property values as the calling object. Note that
the returned object has the same prototype as the calling object.

#### <span id="model-clear">Instance method: Class.prototype.clear()</span>

- Parameters: none.
- Returns: 
  - `object`: the calling object itself.

This function sets all the properties of this object to their default values.
The default value of a field is the value of the field of the default
constructed instance of the class.

#### <span id="model-isEmpty">Instance method: Class.prototype.isEmpty()</span>

- Parameters: none.
- Returns: 
  - `boolean`: whether this object is empty.

This function checks if this object is empty, meaning that all of its fields
have default values. The default value of a field is the value of the field of 
the default constructed instance of the class.

#### <span id="model-equals">Instance method: Class.prototype.equals(other)</span>

- Parameters: 
  - `other: object`: the object to be compared with this object.
- Returns: 
  - `boolean`: whether this object is deeply equal to `other`.

This function checks whether this object is deeply equal to `other`. Two objects 
are deeply equal if and only if they have the same prototype, and all of their
fields are deeply equal. Two fields are deeply equal if and only if they have
the same value, or they are both `undefined` or `null`. If a field is an array,
it is deeply equal to another array if and only if they have the same length,
and all of their elements are deeply equal. If a field is an object, it is
deeply equal to another object if and only if they have the same prototype,
and all of their fields are deeply equal. 

#### <span id="model-generateId">Instance method: Class.prototype.generateId()</span>

- Parameters: none.
- Returns: 
  - `string`: the string representation of the generated globally unique ID set 
    to the calling object.

If the decorated class defines a property named `id`, this instance method
`generateId()` is automatically added to the decorated class. Each call to this 
method generates a globally unique ID for the current calling object 
(represented as a string of an integer), sets the `id` field of the calling
object to the generated ID, and returns the generated ID. Note that if a parent
class `A` defines the `id` field, and a subclass `B` inherits the `id` field but
does not define its own `id` field, the `generateId()` method is added only to
class `A`, not to class `B`.

#### <span id="model-normalizeField">Instance method: Class.prototype.normalizeField(field)</span>

- Parameters:
  - `field: string`: the name of the specified field to be normalized. 
- Returns:
  - `boolean`: whether the specified field was normalized.

This function normalizes the specified field of this object. If the object has
the specified field and the specified field is normalizable, the function 
normalizes the specified field and returns `true`; otherwise, the function does
nothing and returns `false`. Note that a field is normalizable if and only if it 
is decorated by the `{@link Normalizable}` decorator.

#### <span id="model-normalize">Instance method: Class.prototype.normalize(fields)</span>

- Parameters:
  - `fields: undefined | null | string | string[]`: the fields to be normalized. 
    It can be one of the following values:
    - `undefined`: normalizes all the normalizable fields of this object.
    - `null`: normalizes all the normalizable fields of this object.
    - `"*"`: normalizes all the normalizable fields of this object.
    - `string[]`: normalizes all the normalizable fields whose names are 
      specified in this array. 
- Returns:
  - `object`: the normalized calling object.

This function normalizes the specified fields of this object. The `fields` 
parameter specifies the names of fields to be normalized. If `fields` is 
`undefined`, `null`, or the string `"*"`, it normalizes all the normalizable 
fields of this object. If `fields` is an array of strings, it normalizes all the
normalizable fields whose names are specified in the array. Note that a field is 
normalizable if and only if it is decorated by the `{@link Normalizable}` 
decorator.

#### <span id="model-validateField">Instance method: Class.prototype.validateField(field)</span>

- Parameters:
  - `field: string`: the name of the specified field to be validated.
- Returns:
  - `ValidationResult | null`: the validation result.

This function validates the specified field of this object. If the object has
the specified field and the specified field is validatable, the function
validates the specified field and returns the validation result; otherwise, the 
function does nothing and returns `null`. Note that a field is validatable if 
and only if it is decorated by the `{@link Validatable}` decorator.

#### <span id="model-validate">Instance method: Class.prototype.validate(fields)</span>

- Parameters:
  - `fields: undefined | null | string | string[]`: the fields to be validated.
    It can be one of the following values:
    - `undefined`: validates all the validatable fields of this object.
    - `null`: validates all the validatable fields of this object.
    - `"*"`: validates all the validatable fields of this object.
    - `string[]`: validates all the validatable fields whose names are
      specified in this array.
- Returns:
  - `ValidationResult`: the validation result.

This function validates the specified fields of this object. The `fields`
parameter specifies the names of fields to be validated. If `fields` is
`undefined`, `null`, or the string `"*"`, it validates all the validatable
fields of this object. If `fields` is an array of strings, it validates all the
validatable fields whose names are specified in the array. Note that a field is
validatable if and only if it is decorated by the `{@link Validatable}`
decorator.

#### <span id="model-toJSON">Instance method: Class.prototype.toJSON(key, options = undefined)</span>

- Parameters:
    - `key: string`:`JSON.stringify()` calls `toJSON()` with one parameter,
      the `key`,which takes the following values:
        - if this object is a property value, this argument is the property
          name;
        - if this object is in an array, this argument is the index in the
          array, as a string;
        - if `JSON.stringify()` was directly called on this object, this
          argument is an empty string.
    - `options: null|undefined|object`: the additional options for the 
      serialization. If this argument is `undefined` or `null`, the default 
      options will be used. The default options can be retrieved by calling 
      `DefaultOptions.get('toJSON')`. Available options are:
        - `normalize: boolean`, indicates whether to normalize this object
          before serializing. The default value is `true`.
        - `convertNaming: boolean`, indicates whether to convert the naming
          of properties of the object represented by the result JSON string.
          The default value is `false`.
        - `sourceNamingStyle: string`, the naming style of the source object,
          i.e., the object calling the `toJSON()` method. The default value
          of this argument is `'LOWER_CAMEL'`.
        - `targetNamingStyle: string`, the naming style of the target object,
          i.e., the object represented by the result JSON string of the
          `toJSON()` method. The default value of this argument is
          `'LOWER_UNDERSCORE'`.
        - `space: string | number`, a string or number that's used to insert
          white space (including indentation, line break characters, etc.) into
          the output JSON string for readability purposes. If this is a number,
          it indicates the number of space characters to be used as indentation,
          clamped to 10 (that is, any number greater than 10 is treated as if
          it were 10). Values less than 1 indicate that no space should be used.
          If this is a string, the string (or the first 10 characters of the
          string, if it's longer than that) is inserted before every nested
          object or array. If this is anything other than a string or number
          (can be either a primitive or a wrapper object) — for example, is
          `null` or not provided — no white space is used. The default value
          of this option is `null`.
- Returns:
    - `object`: the object to be serialized by `JSON.stringify()`, which may be
      a modify copy of this object.

This function gets the object to be serialized by `JSON.stringify()`.
If the value has a `toJSON()` method, it's responsible to define what
data will be serialized. Instead of the object being serialized, the value
returned by the `toJSON()` method when called will be serialized.

**NOTE:** this function returns an object to be serialized by
`JSON.stringify()`, instead of a JSON string. Use `JSON.stringify()`
or `this.toJsonString()` methods to serialize this object into a JSON
string.

#### <span id="model-toJsonString">Instance method: Class.prototype.toJsonString(options = undefined)</span>

- Parameters:
    - `options: null|undefined|object`: the additional options for the
      serialization. If this argument is `undefined` or `null`, the default
      options will be used. The default options can be retrieved by calling
      `DefaultOptions.get('toJSON')`. Available options are:
        - `normalize: boolean`, indicates whether to normalize this object
          before serializing. The default value is `true`.
        - `convertNaming: boolean`, indicates whether to convert the naming
          of properties of the object represented by the result JSON string.
          The default value is `false`.
        - `sourceNamingStyle: string`, the naming style of the source object,
          i.e., the object calling the `toJSON()` method. The default value
          of this argument is `'LOWER_CAMEL'`.
        - `targetNamingStyle: string`, the naming style of the target object,
          i.e., the object represented by the result JSON string of the
          `toJSON()` method. The default value of this argument is
          `'LOWER_UNDERSCORE'`.
        - `space: string | number`, a string or number that's used to insert
          white space (including indentation, line break characters, etc.) into
          the output JSON string for readability purposes. If this is a number,
          it indicates the number of space characters to be used as indentation,
          clamped to 10 (that is, any number greater than 10 is treated as if
          it were 10). Values less than 1 indicate that no space should be used.
          If this is a string, the string (or the first 10 characters of the
          string, if it's longer than that) is inserted before every nested
          object or array. If this is anything other than a string or number
          (can be either a primitive or a wrapper object) — for example, is
          `null` or not provided — no white space is used. The default value
          of this option is `null`.
- Returns:
    - `string`: the JSON string serialized from this object, as `JSON.stringify()`
      does, except that this function provides additional stringification
      options.

This function serializes this object into a JSON string.

**NOTE:** This method supports native `bigint` value. For example, the
`bigint` value `9223372036854775807n` will be stringify as
`9223372036854775807`.

#### <span id="model-create">Class method: Class.create(obj, options = undefined)</span>

- Parameters: 
  - `obj: object`: the data object used to create the new instance. 
  - `options: null|undefined|object`: the additional options for the creation.
    If this argument is `undefined` or `null`, the default options will be used. 
    The default options can be retrieved by calling `DefaultOptions.get('assign')`.
    Available options are:
      - `normalize: boolean`, indicates whether to normalize this object
        after the assignment. The default value is `true`.
      - `convertNaming: boolean`, indicates whether to convert the naming
        style of the target object. The default value is `false`.
      - `sourceNamingStyle: string`, the naming style of the source object,
        i.e., the first argument of the `create()` method. The default
        value of this argument is `'LOWER_UNDERSCORE'`.
      - `targetNamingStyle: string`, the naming style of the target object,
        i.e., the object returned by the `create()` method. The default
        value of this argument is `'LOWER_CAMEL'`.
- Returns:
  - `object | null`: if the `obj` is `undefined` or `null`, returns `null`;
    otherwise, returns a new instance of the model class whose fields are 
    initialized with the data in the `obj`.

This function creates a instance of the specified class from a data object, 
whose fields are recursively initialized with properties in the `obj`. Note that
`obj` can have a different prototype to the specified class. 

#### <span id="model-createArray">Class method: Class.createArray(array, options = undefined)</span>

- Parameters:
  - `array: object[]`: the data object array used to create the new array.
  - `options: null|undefined|object`: the additional options for the creation. 
    If this argument is `undefined` or `null`, the default options will be used.
    The default options can be retrieved by calling `DefaultOptions.get('assign')`.
    Available options are:
      - `normalize: boolean`, indicates whether to normalize this object
        after the assignment. The default value is `true`.
      - `convertNaming: boolean`, indicates whether to convert the naming
        style of the target object. The default value is `false`.
      - `sourceNamingStyle: string`, the naming style of the source object,
        i.e., the elements in the first argument of the `createArray()`
        method. The default value of this argument is `'LOWER_UNDERSCORE'`.
      - `targetNamingStyle: string`, the naming style of the target object,
        i.e., the elements in the array returned by the `createArray()`
        method. The default value of this argument is `'LOWER_CAMEL'`.
- Returns:
  - `object[] | null`: if the `array` is `undefined` or `null`, returns `null`; 
    otherwise, returns a new array of instances of the model class whose 
    fields are initialized with corresponding data object in the `array`.

This function creates an array of instances of the specified class from a data 
object array. The fields of instances in the returned array are recursively 
initialized with corresponding properties of the corresponding data object in 
the `array`. Note that data objects in `array` can have different prototypes to
the specified class. 

#### <span id="model-createPage">Class method: Class.createPage(page, options = undefined)</span>

- Parameters:
  - `page: object`: the pagination data object used to create the new `Page`
    instance.
  - `options: null|undefined|object`: the additional options for the creation.
    If this argument is `undefined` or `null`, the default options will be used.
    The default options can be retrieved by calling `DefaultOptions.get('assign')`.
    Available options are:
      - `normalize: boolean`, indicates whether to normalize this object
        after the assignment. The default value is `true`.
      - `convertNaming: boolean`, indicates whether to convert the naming
        style of the target object. The default value is `false`.
      - `sourceNamingStyle: string`, the naming style of the source object,
        i.e., the elements in the `content` array of the first argument of
        the `createPage()` method. The default value of this argument is
        `'LOWER_UNDERSCORE'`.
      - `targetNamingStyle: string`, the naming style of the target object,
        i.e., the elements in the `content` array of the `Page` object
        returned by the `createPage()` method. The default value of this
        argument is `'LOWER_CAMEL'`.
- Returns:
  - `Page | null`: if the `page` is `undefined` or `null`, returns `null`;
    otherwise, returns a new instance of the `Page` class whose content are
    initialized with the content of the pagination data object `page`.

This function creates a `Page` object, whose content are initialized with the 
content of the specified pagination data object. Typically, `page` is a list of 
domain objects obtained from a server using the `GET` method, and the object 
should conform to the `Page` class definition. This class method returns
a new `Page` object, with the `content` property being the result of 
`createArray(page.content, options)`, and the other properties matching those of
the `page` object. If `page` is not a valid `Page` object, it returns `null`.

#### <span id="model-isNullishOrEmpty">Class method: Class.isNullishOrEmpty(obj)</span>

- Parameters:
    - `obj: object`: the object to be checked.
- Returns:
    - `boolean`: whether the specified object is `undefined`, `null`, or an 
      empty object constructed with default values.

This function checks whether the specified object is `undefined`, `null`, or an
empty object constructed with default values. An object is empty if and only if
all of its fields have default values. The default value of a field is the value
of the field of the default constructed instance of the class. This function is
a convenient method to call `Class.prototype.isEmpty()`, with the handling of
nullish values.

#### <span id="model-parseJsonString">Class method: Class.parseJsonString(json, options = undefined)</span>

- Parameters:
    - `json: string`: the JSON string to be parsed.
    - `options: null|undefined|object`: the additional options for the parsing.
      If this argument is `undefined` or `null`, the default options will be used.
      The default options can be retrieved by calling `DefaultOptions.get('assign')`.
      Available options are:
        - `normalize: boolean`, indicates whether to normalize this object
          after the assignment. The default value is `true`.
        - `convertNaming: boolean`, indicates whether to convert the naming
          style of properties of the object represented by the JSON string.
          The default value is `false`.
        - `sourceNamingStyle: string`, the naming style of the source object,
          i.e., the object represented by the JSON string. The default value
          of this argument is `'LOWER_UNDERSCORE'`.
        - `targetNamingStyle: string`, the naming style of the target object,
          i.e., the object returned by the `parseJsonString()` method. The 
          default value of this argument is `'LOWER_CAMEL'`.
- Returns:
    - `boolean`: whether the specified object is `undefined`, `null`, or an
      empty object constructed with default values.

This function parses an object of this class from a JSON string.

**NOTE:** This method supports integer values fall out of IEEE 754 integer
precision. For example, the integer value `9223372036854775807` will be
parsed as the native `bigint` value `9223372036854775807n`.

#### <span id="model-usage-examples">Usage Examples</span>

The following is the usage example of the `@Model` decorator.

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
      // If one of the two people does not have ID inofmation, it is impossible
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

**NOTE:**

- Because the `Credential` class does not have an `id` attribute, the `@Model` 
  decorator does not add a `generateId()` instance method to it.
- Because `Person` already implements the `Person.prototype.equals()` method, 
  the `@Model` decorator will **not** override its own implementation of 
  the `Person.prototype.equals()` method.

### <span id="enum">@Enum Decorator</span>

This decorator is used to decorate an enumeration class.

#### <span id="enum-fields">Enumerator Fields</span>

An enumeration class is a class whose instances are enumerators. An enumerator
is an object with the following properties:
- `value`：the value of the enumerator, which is exactly the name of the
  static field of the enumeration class that corresponds to the enumerator.
- `name`: the display name of the enumerator, which could be specified
  by the default string or object value of the static field of the
  enumeration class that corresponds to the enumerator. It the default value
  is not specified, the name of the enumerator is the same as its value.
- `i18n`: the i18n key of the enumerator, which is an optional property. It
  could be specified by the default object value of the static field of the
  enumeration class that corresponds to the enumerator. If this property is
  specified, the `name` property will be transformed to a `getter`, which will
  get the i18n value of the enumerator from the i18n resource bundle.
- `code`: the code of the enumerator, which is an optional property. It could
  be specified by the default object value of the static field of the
  enumeration class that corresponds to the enumerator.
- other properties: other properties of the enumerator could be specified
  by the default object value of the static field of the enumeration class
  that corresponds to the enumerator.

#### <span id="enum-toString">Instance method: Class.prototype.toString()</span>

- Parameters: none.
- Returns:
  - `string`: the string representation of this enumerator, which is the 
    `value` of this enumerator.

This function returns the string representation of this enumerator, which is
the `value` of this enumerator.

#### <span id="enum-toJSON">Instance method: Class.prototype.toJSON()</span>

- Parameters: none.
- Returns:
  - `string`: the JSON representation of this enumerator, which is the JSON
    string representation of the `value` of this enumerator, i.e., the double
    quoted string of the `value`.

This function returns the JSON representation of this enumerator.

#### <span id="enum-values">Class method: Class.values()</span>

- Parameters: none.
- Returns:
  - `Class[]`: the array of all enumerators of this enumeration class.

This function returns the array of all enumerators of this enumeration class.

#### <span id="enum-ofValue">Class method: Class.ofValue(value)</span>

- Parameters: 
  - `value: string`: the value of the enumerator to be returned. Note that this
    argument will be trimmed and uppercased to get the actual value of the 
    enumerator.
- Returns:
  - `Class`: the enumerator in this enumeration class with the specified value,
    or `undefined` if no such enumerator exists.

This function returns the enumerator with the specified value.

#### <span id="enum-hasValue">Class method: Class.hasValue(value)</span>

- Parameters:
    - `value: string`: the value of the enumerator to be tested. Note that this
      argument will be trimmed and uppercased to get the actual value of the
      enumerator.
- Returns:
    - `boolean`: returns `true` if there is an enumerator in this enumeration
      class with the specified value, or `false` otherwise.

This function tests whether there is an enumerator with the specified value.

#### <span id="enum-ofName">Class method: Class.ofName(name)</span>

- Parameters:
    - `name: string`: the name of the enumerator to be returned.
- Returns:
    - `Class`: the enumerator in this enumeration class with the specified name,
      or `undefined` if no such enumerator exists.

This function returns the enumerator with the specified name.

#### <span id="enum-hasName">Class method: Class.hasName(name)</span>

- Parameters:
    - `name: string`: the name of the enumerator to be tested. 
- Returns:
    - `boolean`: returns `true` if there is an enumerator in this enumeration
      class with the specified name, or `false` otherwise.

This function tests whether there is an enumerator with the specified name.

#### <span id="enum-ofCode">Class method: Class.ofCode(code)</span>

- Parameters:
    - `code: string`: the code of the enumerator to be returned. 
- Returns:
    - `Class`: the enumerator in this enumeration class with the specified code,
      or `undefined` if no such enumerator exists.

This function returns the enumerator with the specified value.

#### <span id="enum-hasCode">Class method: Class.hasCode(code)</span>
- Parameters:
    - `code: string`: the code of the enumerator to be tested. 
- Returns:
    - `boolean`: returns `true` if there is an enumerator in this enumeration
      class with the specified code, or `false` otherwise.

This function tests whether there is an enumerator with the specified code.

#### <span id="enum-of">Class method: Class.of(expr)</span>

- Parameters:
    - `expr: object | string`: the expression corresponds to the enumerator to 
      be returned. The  expression could be one of the following:
        - an enumerator of this enumeration class;
        - or the value of an enumerator of this enumeration class;
        - or the name of an enumerator of this enumeration class;
        - or the code of an enumerator of this enumeration class.
- Returns:
    - `Class`: the enumerator in this enumeration class corresponds to the 
      specified expression, or `undefined` if no such enumerator exists.

This function returns the enumerator with the specified value.

#### <span id="enum-has">Class method: Class.has(expr)</span>
- Parameters:
    - `expr: object | string`: the expression corresponds to the enumerator to
      be returned. The  expression could be one of the following:
        - an enumerator of this enumeration class;
        - or the value of an enumerator of this enumeration class;
        - or the name of an enumerator of this enumeration class;
        - or the code of an enumerator of this enumeration class.
- Returns:
    - `boolean`: returns `true` if there is an enumerator in this enumeration
      class corresponds to the specified expression, or `false` otherwise.

This function tests whether there is an enumerator with the specified code.

#### <span id="enum-usage-example">Usage Example</span>

```js
@Enum
class Gender {
  static MALE = 'Male';
  static FEMALE = 'Female';
}
```
The above code is equivalent to the following code:
```js
class Gender {
  static MALE = Object.freeze(new Gender('MALE', 'Male'));

  static FEMALE = Object.freeze(new Gender('FEMALE', 'Female'));

  static values() {
    return [ Gender.MALE, Gender.FEMALE ];
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

The static fields of the enumeration class could also be specified as objects,
which will be used to initialize the enumerators. For example:
```js
@Enum
class Gender {
  static MALE = { name: 'Male', i18n: 'i18n.gender.male', code: '001', data: { value: 0 } };

  static FEMALE = { name: 'Female', i18n: 'i18n.gender.female', code: '002', data: { value: 1 } };
}
```
The above code is equivalent to the following code:
```js
class Gender {
  static MALE = Object.freeze(new Gender('MALE', 'Male',
     { i18n: 'i18n.gender.male', code: '001', data: {value: 0 } }));

  static FEMALE = Object.freeze(new Gender('FEMALE', 'Female',
     { i18n: 'i18n.gender.female', code: '002', data: {value: 1 } }));

  ...

  constructor(value, name, payload) {
    this.value = value;
    this.name = name;
    Object.assign(this, payload);
  }

  ...
}
```
Note that the enumerator in the above `Gender` class has a `code`, `i18n`
and `data` properties. Since it has `i18n` property which specifies the i18n
key of the enumerator in the resource bundle, the `name` property of the
enumerator will be transformed to a `getter` which will get the i18n value
corresponding to the i18n key from the i18n resource bundle.

The enumerators can also be defined without default values, for example:
```js
@Enum
class Gender {
  static MALE;
  static FEMALE;
}
```
The above code is equivalent to the following code:
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
That is, the name of the enumerator is exactly its value.

### <span id="default-options">`DefaultOptions` class</span>

The `DefaultOptions` class is used to get or set the default options of different
aspects of this library.

The class accesses an internal `Map` object. The key of the map is the name
of aspects, and the value of the map is an object representing the default
options of the aspect.

For example, the default options of the `assign()` method of the class
decorated by `@Model` is stored in the key `assign`. That is,
`DefaultOption.get('assign')` returns the object representing the default
options of the `assign()` method.

The program can change the default options with `DefaultOptions.set('key', options)`
method.

Currently, the following aspects are supported:
- `assign`: the default options of the `Class.prototype.assign()`,
  `Class.create()`, `Class.createArray()`, `Class.createPage()`,
  `Class.parseJsonString()` methods of  the class decorated by `@Model`.
- `toJSON`: the default options of the `Class.prototype.toJSON()`,
  `Class.prototype.toJsonString()` methods of the class decorated by `@Model`.

#### <span id="default-options-get">Class method: `DefaultOptions.get(aspect)`</span>

Gets the default options of the specified aspect.

The function returns the object representing the default options of the aspect, 
or `undefined`if the aspect does not exist. Note that the returned object is a
deep cloned copy of the object stored in the internal map, so that the
modification of the returned object will **not** affect the default options
stored in the internal map.

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
opt1.convertNaming = true;
const opt2 = DefaultOptions.get('assign');
expect(opt2.convertNaming).toBe(false);
```

#### <span id="default-options-set">Class method: `DefaultOptions.set(aspect, options)`</span>

Sets the default options of the specified aspect.

This function will merge the new options into the old default options of the aspect. 
If the new options have the same property as the old default options stored
in the internal map, the value of the new options will override the value of the
old default options; otherwise, the new property will be added to the old default
options.

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
DefaultOptions.set('assign', { convertNaming: true });
const opt2 = DefaultOptions.get('assign');
expect(opt2.convertNaming).toBe(true);
expect(opt1.convertNaming).toBe(false);
```


#### <span id="default-options-merge">Class method: `DefaultOptions.merge(aspect, options)`</span>

Gets the default options of the specified aspect, merging the provided default
options into the returned object.

**NOTE:** This function does **NOT** change the default options stored in the
internal map, instead, it returns a new object representing the merged options.

```js
import { DefaultOptions } from '@haixing_hu/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
const opt2 = DefaultOptions.merge('assign', { convertNaming: true });
expect(opt2.convertNaming).toBe(true);
expect(opt1.convertNaming).toBe(false);
const opt3 = DefaultOptions.merge('assign', null);
expect(opt3.convertNaming).toBe(false);
```

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
