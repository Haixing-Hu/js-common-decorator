# js-common-decorator

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/common-decorator.svg)](https://npmjs.com/package/@qubit-ltd/common-decorator)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/js-common-decorator/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/js-common-decorator/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/js-common-decorator/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/js-common-decorator?branch=master)

## Overview

[@qubit-ltd/common-decorator] is a JavaScript library of common decorators that provides powerful tools to enhance your domain classes. The library supports the most recent (as of November 2023) [stage 3 proposal of JavaScript decorators].

With this library, you can easily add common methods to your domain classes, implement Java-like enum functionality, add validation and normalization capabilities, and much more - all using the modern decorator syntax.

## Features

- **Modern Decorator Support**: Compatible with the latest Stage 3 proposal for JavaScript decorators
- **Model Enhancement**: `@Model` decorator adds common methods to domain model classes
- **Enum Implementation**: `@Enum` decorator provides Java-like enumeration capabilities
- **Validation Support**: `@Validatable` decorator enables field validation
- **Normalization Support**: `@Normalizable` decorator enables field normalization
- **Type Safety**: `@Type` and `@ElementType` decorators for type checking
- **Serialization Utilities**: Built-in JSON serialization/deserialization support
- **High Test Coverage**: Comprehensive test suite ensuring reliability of all features

## Installation

```bash
# Using npm
npm install @qubit-ltd/common-decorator

# Using yarn
yarn add @qubit-ltd/common-decorator

# Using pnpm
pnpm add @qubit-ltd/common-decorator
```

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
- [Recent Updates](#recent-updates)
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
      - `types: object`, the additional information about types of fields of 
        classes. The keys of this object are the path of the fields or
        sub-fields of the target object, the values are the type of the
        fields, represented as the constructor function of the type.
        The default value is `{}`.
      - `elementTypes: object`, the additional information about types of
        elements of fields of classes. The keys of this object are the path of
        the fields or sub-fields of the target object, the values are the type
        of the elements, represented as the constructor function of the type.
        The default value is `{}`.
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
is decorated by the `@Normalizable` decorator.

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
normalizable if and only if it is decorated by the `@Normalizable` decorator.

#### <span id="model-validateField">Instance method: Class.prototype.validateField(field)</span>

- Parameters:
  - `field: string`: the name of the specified field to be validated.
- Returns:
  - `ValidationResult | null`: the validation result.

This function validates the specified field of this object. If the object has
the specified field and the specified field is validatable, the function
validates the specified field and returns the validation result; otherwise, the 
function does nothing and returns `null`. Note that a field is validatable if 
and only if it is decorated by the `@Validatable` decorator.

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
validatable if and only if it is decorated by the `@Validatable`
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
        - `removeEmptyFields: boolean`, indicates whether to ignore the empty
          fields of the object. If it is `true`, the empty fields of the object
          will be removed before serialization. The default value is `false`.
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
        - `removeEmptyFields: boolean`, indicates whether to ignore the empty
          fields of the object. If it is `true`, the empty fields of the object
          will be removed before serialization. The default value is `false`.
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
      - `types: object`, the additional information about types of
        fields of classes. The keys of this object are the path of the fields
        or sub-fields of the target object, the values are the type of the
        fields, represented as the constructor function of the type.
        The default value is `{}`.
      - `elementTypes: object`, the additional information about types of
        elements of fields of classes. The keys of this object are the path of
        the fields or sub-fields of the target object, the values are the type
        of the elements, represented as the constructor function of the type.
        The default value is `{}`.
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
      - `types: object`, the additional information about types of
        fields of classes. The keys of this object are the path of the fields
        or sub-fields of the target object, the values are the type of the
        fields, represented as the constructor function of the type.
        The default value is `{}`.
      - `elementTypes: object`, the additional information about types of
        elements of fields of classes. The keys of this object are the path of
        the fields or sub-fields of the target object, the values are the type
        of the elements, represented as the constructor function of the type.
        The default value is `{}`.
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
      - `types: object`, the additional information about types of
        fields of classes. The keys of this object are the path of the fields
        or sub-fields of the target object, the values are the type of the
        fields, represented as the constructor function of the type.
        The default value is `{}`.
      - `elementTypes: object`, the additional information about types of
        elements of fields of classes. The keys of this object are the path of
        the fields or sub-fields of the target object, the values are the type
        of the elements, represented as the constructor function of the type.
        The default value is `{}`.
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
- 
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
import { DefaultOptions } from '@qubit-ltd/common-decorator';

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
import { DefaultOptions } from '@qubit-ltd/common-decorator';

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
import { DefaultOptions } from '@qubit-ltd/common-decorator';

const opt1 = DefaultOptions.get('assign');
expect(opt1.convertNaming).toBe(false);
const opt2 = DefaultOptions.merge('assign', { convertNaming: true });
expect(opt2.convertNaming).toBe(true);
expect(opt1.convertNaming).toBe(false);
const opt3 = DefaultOptions.merge('assign', null);
expect(opt3.convertNaming).toBe(false);
```

## <span id="configuration">Configuration</span>

This library uses the most recent (currently November 2023)
[stage 3 proposal of JavaScript decorators]. Therefore, you must configure
[Babel] with [@babel/plugin-transform-class-properties] and the
[@babel/plugin-proposal-decorators] plugins.

**NOTE:** To support the [stage 3 proposal of JavaScript decorator metadata] 
at November 2023, the version of the [Babel] plugin [@babel/plugin-proposal-decorators] 
must be at least `7.24.0`.

### <span id="webpack">Bundling with [webpack]</span>

1.  Install the required dependencies:
    ```shell
    yarn add @qubit-ltd/common-decorator
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
        ["@babel/plugin-proposal-decorators", { "version": "2023-11" }],
        "@babel/plugin-transform-class-properties"
      ]
    }
    ```

### <span id="vite">Bundling with [vite]</span>

1.  Install the required dependencies:
    ```shell
    yarn add @qubit-ltd/common-decorator
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
        ["@babel/plugin-proposal-decorators", { "version": "2023-11" }],
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
    import babel from '@qubit-ltd/vite-plugin-babel';

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

## <span id="recent-updates">Recent Updates</span>

### Test Coverage Enhancements (December 2023)

- **Enum Clone Hook Test**: Added comprehensive tests to verify the behavior of enum clone hooks, ensuring that enumerator objects are properly handled during cloning operations.
- **Field Validation Coverage**: Enhanced test coverage for field validation, specifically targeting edge cases to ensure robust validation in all scenarios.
- **Model Implementation Tests**: Added additional tests for various model implementation functions to achieve higher code coverage.

The latest updates focus on improving test coverage and reliability, with particular attention to:

- Ensuring enumerator objects maintain their singleton pattern during cloning
- Validating empty fields with proper error handling
- Verifying that model implementation functions work correctly in all edge cases

## <span id="contributing">Contributing</span>

If you find any issues or have suggestions for improvements, please feel free
to open an issue or submit a pull request to the [GitHub repository].

## <span id="license">License</span>

[@qubit-ltd/common-decorator] is distributed under the Apache 2.0 license.
See the [LICENSE](LICENSE) file for more details.

[@qubit-ltd/common-decorator]: https://npmjs.com/package/@qubit-ltd/common-decorator
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
[our version of vite-plugin-babel]: https://npmjs.com/package/@qubit-ltd/vite-plugin-babel

## Front-end and Back-end Data Exchange Example

In real-world applications, data exchange between front-end and back-end is a common scenario. The following example demonstrates how to use this library to process data from RESTful APIs and send it back to the server.

### Complete Example

Suppose we have an e-commerce application that needs to handle order data. The back-end API returns data in snake_case naming convention (e.g., `order_id`), while the front-end code uses camelCase (e.g., `orderId`). Additionally, order IDs use Java's Long type (which may exceed JavaScript's safe integer range).

First, let's define our domain models:

```javascript
import { Model, Type, ElementType, Normalizable, Validatable, NonEmpty } from '@qubit-ltd/common-decorator';

// Configure default options for naming style conversion
DefaultOptions.set('assign', {
  normalize: true,
  convertNaming: true,
  sourceNamingStyle: 'LOWER_UNDERSCORE',  // JSON data format from back-end
  targetNamingStyle: 'LOWER_CAMEL'        // Format used in front-end
});

DefaultOptions.set('toJSON', {
  normalize: true,
  removeEmptyFields: true,    // Automatically remove empty fields
  convertNaming: true,
  sourceNamingStyle: 'LOWER_CAMEL',       // Format used in front-end
  targetNamingStyle: 'LOWER_UNDERSCORE'   // Format to send to back-end
});

// Define the OrderItem model
@Model
class OrderItem {
  constructor() {
    this.id = null;           // Java Long type, automatically converted to BigInt
    this.productId = null;    // Front-end uses camelCase, corresponding to product_id in back-end
    this.productName = '';
    this.quantity = 0;
    this.unitPrice = 0;
  }
  
  @Normalizable
  @Validatable
  @Type(String)
  get productName() {
    return this._productName;
  }
  
  set productName(value) {
    this._productName = value;
  }
  
  @Normalizable
  @Validatable
  @Type(Number)
  get quantity() {
    return this._quantity;
  }
  
  set quantity(value) {
    this._quantity = value;
  }
  
  @Normalizable
  @Validatable
  @Type(Number)
  get unitPrice() {
    return this._unitPrice;
  }
  
  set unitPrice(value) {
    this._unitPrice = value;
  }
  
  // Calculate total price
  getTotalPrice() {
    return this.quantity * this.unitPrice;
  }
}

// Define the Order model
@Model
class Order {
  constructor() {
    this.id = null;               // Java Long type, automatically converted to BigInt
    this.orderNumber = '';        // Front-end uses camelCase, corresponding to order_number in back-end
    this.customerId = null;
    this.customerName = '';
    this.orderDate = null;
    this.orderItems = [];         // Array of order items
    this.totalAmount = 0;
    this.status = '';
    this.note = '';               // Optional field, empty values will be removed when sent to back-end
  }
  
  @Normalizable
  @Validatable
  @NonEmpty
  @Type(String)
  get orderNumber() {
    return this._orderNumber;
  }
  
  set orderNumber(value) {
    this._orderNumber = value;
  }
  
  @Normalizable
  @Validatable
  @Type(String)
  get customerName() {
    return this._customerName;
  }
  
  set customerName(value) {
    this._customerName = value;
  }
  
  @Normalizable
  @Validatable
  @Type(Date)
  get orderDate() {
    return this._orderDate;
  }
  
  set orderDate(value) {
    this._orderDate = value;
  }
  
  @Normalizable
  @Validatable
  @ElementType(OrderItem)
  get orderItems() {
    return this._orderItems;
  }
  
  set orderItems(value) {
    this._orderItems = value;
  }
}

// Example usage - Fetching data from back-end
async function fetchOrder(orderId) {
  try {
    // Assume this is the response from a back-end API
    const response = await fetch(`/api/orders/${orderId}`);
    const data = await response.json();
    
    // Sample data (in snake_case naming style)
    // {
    //   "id": "9223372036854775807",  // Note: Max value of Java Long, exceeds JS Number safe range
    //   "order_number": "ORD-2023-001",
    //   "customer_id": "5678",
    //   "customer_name": "John Doe",
    //   "order_date": "2023-08-15T14:30:00.000Z",
    //   "order_items": [
    //     {
    //       "id": "8345678912345678901",  // Another large integer
    //       "product_id": "101",
    //       "product_name": "Laptop",
    //       "quantity": 1,
    //       "unit_price": 999.99
    //     },
    //     {
    //       "id": "8345678912345678902",
    //       "product_id": "202",
    //       "product_name": "Wireless Mouse",
    //       "quantity": 2,
    //       "unit_price": 29.99
    //     }
    //   ],
    //   "total_amount": 1059.97,
    //   "status": "PENDING",
    //   "note": null
    // }
    
    // Create domain object using Order.create(), automatically handling naming style conversion and large integers
    const order = Order.create(data);
    
    console.log(order.id);  // Output: 9223372036854775807n (BigInt type)
    console.log(order.orderNumber);  // Output: "ORD-2023-001" (converted to camelCase)
    console.log(order.orderItems[0].productName);  // Output: "Laptop"
    
    // Validation and normalization
    order.normalize();
    const validationResult = order.validate();
    if (!validationResult.valid) {
      console.error('Order data validation failed:', validationResult.message);
    }
    
    return order;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw error;
  }
}

// Sending data back to the back-end
async function updateOrder(order) {
  try {
    // Use toJSON to convert domain object to plain JavaScript object
    // Automatically handles: 1. Naming style conversion 2. Empty field removal 3. BigInt conversion
    const orderData = order.toJSON();
    
    // Example of converted data format:
    // {
    //   "id": "9223372036854775807",  // BigInt converted to string, without 'n' suffix
    //   "order_number": "ORD-2023-001",
    //   "customer_id": "5678",
    //   "customer_name": "John Doe",
    //   "order_date": "2023-08-15T14:30:00.000Z",
    //   "order_items": [
    //     {
    //       "id": "8345678912345678901",
    //       "product_id": "101",
    //       "product_name": "Laptop",
    //       "quantity": 1,
    //       "unit_price": 999.99
    //     },
    //     // ...other order items
    //   ],
    //   "total_amount": 1059.97,
    //   "status": "PENDING"
    //   // Note: 'note' field was null and has been automatically removed
    // }
    
    const response = await fetch(`/api/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)  // No additional processing needed, already in the right format
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
}

// Example usage
async function example() {
  // Fetch order data and modify it
  const order = await fetchOrder('123');
  order.status = 'COMPLETED';
  order.note = '';  // Empty string, will be removed when sent to back-end
  
  // Add a new item to the order
  const newItem = new OrderItem();
  newItem.productId = '303';
  newItem.productName = 'Headphones';
  newItem.quantity = 1;
  newItem.unitPrice = 79.99;
  order.orderItems.push(newItem);
  
  // Recalculate total amount
  order.totalAmount = order.orderItems.reduce(
    (sum, item) => sum + item.getTotalPrice(), 0
  );
  
  // Send the updated order back to the server
  await updateOrder(order);
}

```

### Key Points

1. **Automatic Naming Style Conversion**:
   - Data from the back-end uses snake_case format (e.g., `order_number`)
   - Front-end domain objects use camelCase format (e.g., `orderNumber`)
   - Through `DefaultOptions.set('assign', {...})` configuration, `Model.create()` and `model.assign()` automatically convert naming styles
   - Through `DefaultOptions.set('toJSON', {...})` configuration, `model.toJSON()` automatically converts camelCase back to snake_case

2. **Large Integer Handling**:
   - Back-end uses Java Long type IDs (e.g., `9223372036854775807`) that exceed JavaScript's safe integer range
   - `Model.create()` and `model.assign()` automatically convert these large integers to JavaScript's BigInt type
   - `model.toJSON()` automatically converts BigInt to the correct JSON format (without the 'n' suffix)

3. **Empty Field Handling**:
   - With `removeEmptyFields: true` configuration, `model.toJSON()` automatically removes null, undefined, and empty string properties
   - In the example, the 'note' field with null or empty string value won't be sent to the back-end

4. **Type Conversion and Validation**:
   - Use `@Type` and `@ElementType` decorators to ensure type safety
   - Use `model.normalize()` for data normalization
   - Use `model.validate()` to validate data integrity

This complete example demonstrates how to use the features of this library to easily handle various challenges in front-end and back-end data exchange in real-world applications.

## Advanced Usage

### Combining Multiple Decorators

You can combine multiple decorators to add rich functionality to your classes:

```javascript
import { 
  Model, 
  Type, 
  ElementType, 
  Normalizable, 
  Validatable, 
  NonEmpty 
} from '@qubit-ltd/common-decorator';

@Model
class Product {
  constructor() {
    this.id = null;
    this.name = '';
    this.price = 0;
    this.tags = [];
    this.createdAt = null;
  }
  
  @NonEmpty
  @Validatable
  @Normalizable
  @Type(String)
  get name() {
    return this._name;
  }
  
  set name(value) {
    this._name = value;
  }
  
  @Validatable
  @Normalizable
  @Type(Number)
  get price() {
    return this._price;
  }
  
  set price(value) {
    this._price = value;
  }
  
  @Normalizable
  @ElementType(String)
  get tags() {
    return this._tags;
  }
  
  set tags(value) {
    this._tags = value;
  }
}

// Usage
const product = new Product();
product.assign({
  name: '  Product Name  ',
  price: '99.99',
  tags: ['tag1', 2, 'tag3']
});

// After normalization, product.name will be trimmed, 
// product.price will be a Number,
// and all elements in product.tags will be strings
product.normalize();

console.log(product.validate()); // Checks if name is not empty and all types match
```

### Custom Validation and Normalization

You can implement custom validation and normalization logic:

```javascript
import { Model, Normalizable, Validatable } from '@qubit-ltd/common-decorator';

@Model
class EmailSubscription {
  constructor() {
    this.email = '';
    this.subscribed = false;
  }
  
  @Normalizable((value) => {
    // Custom normalizer that converts email to lowercase and trims whitespace
    return typeof value === 'string' ? value.toLowerCase().trim() : value;
  })
  @Validatable((value) => {
    // Custom validator that checks if email is valid
    if (typeof value !== 'string' || !value.includes('@')) {
      return {
        valid: false,
        message: 'Invalid email address',
      };
    }
    return { valid: true };
  })
  get email() {
    return this._email;
  }
  
  set email(value) {
    this._email = value;
  }
}
```

### Working with DefaultOptions

You can configure default options for various operations:

```javascript
import { DefaultOptions, Model } from '@qubit-ltd/common-decorator';

// Configure default options for JSON serialization
DefaultOptions.set('toJSON', {
  normalize: true,
  removeEmptyFields: true,
  convertNaming: true,
  sourceNamingStyle: 'LOWER_CAMEL',
  targetNamingStyle: 'LOWER_UNDERSCORE'
});

@Model
class Order {
  constructor() {
    this.orderId = null;
    this.customerName = '';
    this.orderItems = [];
  }
}

const order = new Order();
order.assign({
  orderId: '12345',
  customerName: 'John Doe',
  orderItems: [
    { itemId: 1, name: 'Product 1', quantity: 2 }
  ]
});

// Will use the configured default options for serialization
const json = order.toJsonString();
console.log(json);
// Output will use lower_underscore naming: 
// {"order_id":"12345","customer_name":"John Doe","order_items":[{"item_id":1,"name":"Product 1","quantity":2}]}
```

## Integration Examples

### Using with Vue.js

```javascript
import { Model, Normalizable, Validatable } from '@qubit-ltd/common-decorator';
import { defineComponent, ref } from 'vue';

@Model
class UserProfile {
  constructor() {
    this.username = '';
    this.email = '';
    this.bio = '';
  }
  
  @Normalizable
  @Validatable
  get username() {
    return this._username;
  }
  
  set username(value) {
    this._username = value;
  }
  
  // Other getters and setters...
}

export default defineComponent({
  setup() {
    const profile = ref(new UserProfile());
    
    const updateProfile = (formData) => {
      profile.value.assign(formData);
      profile.value.normalize();
      const validation = profile.value.validate();
      
      if (validation.valid) {
        // Save profile
      } else {
        // Handle validation errors
        console.error(validation.message);
      }
    };
    
    return {
      profile,
      updateProfile
    };
  }
});
```

### Using with Express.js

```javascript
import express from 'express';
import { Model, Normalizable, Validatable, NonEmpty } from '@qubit-ltd/common-decorator';

const app = express();
app.use(express.json());

@Model
class NewUserRequest {
  constructor() {
    this.username = '';
    this.email = '';
    this.password = '';
  }
  
  @NonEmpty
  @Normalizable
  @Validatable
  get username() {
    return this._username;
  }
  
  set username(value) {
    this._username = value;
  }
  
  // Other getters and setters...
}

app.post('/api/users', (req, res) => {
  try {
    const userRequest = NewUserRequest.create(req.body);
    userRequest.normalize();
    const validation = userRequest.validate();
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    
    // Create user in database
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Compatibility and Requirements

- **Node.js**: 14.x or higher
- **ECMAScript**: ES2022 or higher
- **Decorator Support**: Requires babel configuration for Stage 3 decorators
- **Browser Support**: Modern browsers with ES6+ support

## Best Practices

### Project Structure

When using this library, we recommend organizing your domain models in a structured way:

```
src/
├── models/
│   ├── base/
│   │   └── BaseModel.js
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── enums/
│   ├── Status.js
│   └── Role.js
└── app.js
```

### Performance Considerations

- Use `normalize()` only when necessary, not on every operation
- Consider caching validation results for frequently accessed objects
- For large collections, use `createArray()` method instead of mapping each item

### Type Safety

While JavaScript is dynamically typed, this library provides several ways to ensure type safety:

1. Use the `@Type` decorator to enforce type checking for properties
2. Use the `@ElementType` decorator for arrays
3. Enable normalization to automatically convert values to the correct type

### Memory Management

When working with large object graphs:

1. Avoid deep cloning unnecessarily
2. Use the `removeEmptyFields` option in `toJSON` for large objects
3. Be cautious with circular references when serializing objects
