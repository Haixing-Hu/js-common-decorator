////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from './impl/class-metadata-cache';
import { KEY_CLASS_CATEGORY, KEY_CLASS_NEXT_ID } from './impl/metadata-keys';
import assignImpl from './impl/model/assign-impl';
import clearImpl from './impl/model/clear-impl';
import cloneImpl from './impl/model/clone-impl';
import createArrayImpl from './impl/model/create-array-impl';
import createImpl from './impl/model/create-impl';
import createPageImpl from './impl/model/create-page-impl';
import equalsImpl from './impl/model/equals-impl';
import generateIdImpl from './impl/model/generate-id-impl';
import isEmptyImpl from './impl/model/is-empty-impl';
import isNullishOrEmptyImpl from './impl/model/is-nullish-or-empty-impl';
import normalizeFieldImpl from './impl/model/normalize-field-impl';
import normalizeImpl from './impl/model/normalize-impl';
import parseJsonStringImpl from './impl/model/parse-json-string-impl';
import toJsonImpl from './impl/model/to-json-impl';
import toJsonStringImpl from './impl/model/to-json-string-impl';
import validateFieldImpl from './impl/model/validate-field-impl';
import validateImpl from './impl/model/validate-impl';
import hasOwnClassField from './impl/utils/has-own-class-field';
import hasOwnPrototypeFunction from './impl/utils/has-own-prototype-function';
import hasPrototypeFunction from './impl/utils/has-prototype-function';
import setClassMetadata from './impl/utils/set-class-metadata';

/**
 * This decorator is used to add common methods to a domain model class.
 *
 * It must decorate a class.
 *
 * It adds the following methods to the decorated class:
 *
 * - Instance method `assign(obj, options)`: Copies the properties of the object
 *   `obj` to this object, only copying properties defined in the class of this
 *   object. If a property in `obj` does not exist, it sets the property of this
 *   object to the default value. If a property exists in `obj` but its value is
 *   `null` or `undefined`, the function preserves the `null` or `undefined` value.
 *   The function returns this object itself. Note that `obj` can have a different
 *   prototype than this object. The `options` parameter is the additional options
 *   for the assignment. Available options will be explained below. If the `options`
 *   parameter is `undefined` or `null`, the default options will be used. The default
 *   options can be retrieved by calling `DefaultOptions.get('assign')`.
 * - Instance method `clear()`: Sets all the properties of this object to their
 *   default values.
 * - Instance method `clone()`: Returns a deep clone of this object.
 * - Instance method `isEmpty()`: Checks if this object is empty, meaning that all
 *   of its properties have default values.
 * - Instance method `equals(obj)`: Determines if this object is deeply equal
 *   to `obj`.
 * - Instance method `normalize(fields)`: Normalizes specified fields of this
 *   object. The `fields` parameter specifies the names of fields to be normalized.
 *   If `fields` is `undefined`, `null`, or the string `"*"`, it normalizes all
 *   the fields that can be normalized for this object. If `fields` is an array of
 *   strings, it normalizes all the fields specified in the array. Note that a
 *   field is normalizable if and only if it is decorated with the
 *   `@{@link Normalizable}` decorator.
 * - Instance method `normalizeField(field)`: Normalizes the specified field of
 *   this object. The `field` parameter specifies the name of the field to be
 *   normalized. If the specified exists and is normalizable, the function
 *   normalizes it and returns `true`; otherwise, the function does nothing and
 *   returns `false`.
 * - Instance method `validate(fields, options)`: Validates the specified fields of
 *   this object. The `fields` parameter is the names of the fields to be validated.
 *   If `fields` is `undefined`, `null`, or the string `"*"`, it validates all the
 *   fields that can be validated for this object. If `fields` is an array of
 *   strings, it validates all the fields specified in the array. Note that a field
 *   must be specified as validatable using the `@{@link Validatable}` decorator.
 *   The `options` parameter is an object comprising additional parameters, and its
 *   property values are passed as the second argument to the validation function.
 *   Refer to the documentation of `@{@link Validatable}` for more details.
 * - Instance method `generateId()`: If the decorated class defines a property
 *   named `id`, this decorator automatically adds a `generateId()` instance method.
 *   Each call to this method generates a globally unique ID (represented as an
 *   integer) for the class of this object, sets it to this object and returns
 *   the generated ID. Note that if a parent class `A` defines the `id` field,
 *   and a subclass `B` inherits  the `id` field but does not define its own
 *   `id` field, the `generateId()` method is only added to class `A`, not to
 *   class `B`.
 * - Static class method `create(obj, options)`: Creates a new instance object
 *   based on the `obj` object. It copies the property values from the corresponding
 *   properties of `obj`, maintaining the same prototype and class definition. This
 *   method is used to transform a plain JSON object into the specified domain
 *   object. The `options` parameter is the additional options for the creation,
 *   which is the same as the `options` parameter of the `create()` method.
 * - Static class method `createArray(array, options)`: Creates a new instance
 *   array based on an object array `array`, where each element's property values
 *   are copied from the corresponding elements in `array`, maintaining the same
 *   prototype and class definition. This method is used to transform an array of
 *   plain JSON objects into an array of specified domain objects. The `options`
 *   parameter is the additional options for the creation, which is the same
 *   as the `options` parameter of the `create()` method.
 * - Static class method `createPage(page, options)`: Creates a new page object
 *   based on a `page` pagination object. Typically, `page` is a list of domain
 *   objects obtained from a server using the GET method, and the object should
 *   conform to the `{@link Page}` class definition. This static class method
 *   returns a new `{@link Page}` object, with the `content` property being the
 *   result of `createArray(page.content, options)`, and the other properties
 *   matching those of the `page` object. If the input is not a valid
 *   `{@link Page}` object, it returns `null`. The `options` parameter is the
 *   additional options for the creation, which is the same as the `options`
 *   parameter of the `create()` method.
 * - Static class method `isNullishOrEmpty(obj)`: Determines if the given instance
 *   is `undefined`, `null`, or an empty object constructed with default values.
 *
 * **NOTE:** If the decorated class already implements any of the above methods,
 * this decorator will not override the methods already implemented by the
 * decorated class.
 *
 * ##### Usage example:
 *
 * ```js
 * &#064;Model
 * class Credential {
 *
 *   &#064;Normalizable
 *   &#064;Validator(validateCredentialTypeField)
 *   &#064;Type(CredentialType)
 *   &#064;Label('证件类型')
 *   type = CredentialType.IDENTITY_CARD;
 *
 *   &#064;Normalizable(trimUppercaseString)
 *   &#064;Validator(validateCredentialNumberField)
 *   &#064;Label('证件号码')
 *   number = '';
 *
 *   constructor(type = CredentialType.DEFAULT.value, number = '') {
 *     this.type = type;
 *     this.number = number;
 *   }
 *
 *   isIdentityCard() {
 *     return (this.type === 'IDENTITY_CARD');
 *   }
 * }
 *
 * &#064;Model
 * class Person {
 *
 *   &#064;Normalizable(trimString)
 *   &#064;Label('ID')
 *   id = null;
 *
 *   &#064;Normalizable(trimUppercaseString)
 *   &#064;Validatable(validatePersonNameField)
 *   &#064;Label('姓名')
 *   name = '';
 *
 *   &#064;Normalizable
 *   &#064;DefaultValidator
 *   &#064;Type(Credential)
 *   &#064;Label('证件')
 *   credential = null;
 *
 *   &#064;Normalizable
 *   &#064;Validatable(validatePersonGenderField)
 *   &#064;Type(Gender)
 *   &#064;Label('性别')
 *   gender = '';
 *
 *   &#064;Normalizable(trimString)
 *   &#064;Validatable(validatePersonBirthdayField)
 *   &#064;Label('出生日期')
 *   birthday = '';
 *
 *   &#064;Normalizable(trimUppercaseString)
 *   &#064;Validatable(validateMobileField)
 *   &#064;Label('手机号码')
 *   mobile = '';
 *
 *   &#064;Normalizable(trimString)
 *   &#064;Validatable(validateEmailField)
 *   &#064;Label('电子邮件地址')
 *   &#064;Nullable
 *   email = '';
 *
 *   equals(other) {
 *     if (!(other instanceof PersonWithEquals)) {
 *       return false;
 *     }
 *    if ((this.credential === null) || (other.credential === null)) {
 *       // If one of the two people does not have an ID information, it is
 *       // impossible to compare whether they are the same person thus they
 *       // will be considered different.
 *       return false;
 *     }
 *     // Two persons are logically equals if and only if they have the same
 *     // credential.
 *     return (this.credential.type === other.credential.type)
 *         && (this.credential.number === other.credential.number);
 *   }
 * }
 * ```
 *
 * After applying the `@Model` decorator, the following methods will be
 * automatically added:
 *
 * - `Credential.prototype.assign(obj, options = undefined)`
 * - `Credential.prototype.clear()`
 * - `Credential.prototype.clone()`
 * - `Credential.prototype.isEmpty()`
 * - `Credential.prototype.equals(obj)`
 * - `Credential.prototype.normalize(fields)`
 * - `Credential.prototype.validate(fields, options)`
 * - `Credential.prototype.toJSON(key, options = undefined)`
 * - `Credential.prototype.toJsonString(options = undefined)`
 * - `Credential.create(obj, options = undefined)`
 * - `Credential.createArray(array, options = undefined)`
 * - `Credential.createPage(page, options = undefined)`
 * - `Credential.isNullishOrEmpty(obj)`
 * - `Credential.parseJsonString(json, options = undefined)`
 * - `Person.prototype.assign(obj, normalized)`
 * - `Person.prototype.clear()`
 * - `Person.prototype.clone()`
 * - `Person.prototype.isEmpty()`
 * - `Person.prototype.normalize(fields)`
 * - `Person.prototype.validate(fields, options)`
 * - `Person.prototype.generateId()`
 * - `Person.prototype.toJSON(key, options = undefined)`
 * - `Person.prototype.toJsonString(options = undefined)`
 * - `Person.create(obj, options = undefined)`
 * - `Person.createArray(array, options = undefined)`
 * - `Person.createPage(page, options = undefined)`
 * - `Person.isNullishOrEmpty(obj)`
 * - `Person.parseJsonString(json, options = undefined)`
 *
 * **NOTE:**
 *
 * - Because the `Credential` class does not have an `id` attribute, the `@Model`
 *   decorator does not add a `generateId()` instance method to it.
 * - Because `Person` already implements the `Person.prototype.equals()` method,
 *   the `@Model` decorator will **not** override its own implementation of
 *   the `Person.prototype.equals()` method.
 *
 * @param {function} Class
 *     The constructor of the class being decorated.
 * @param {object} context
 *     The context object containing information about the class being decorated.
 * @namespace
 * @see Type
 * @see ElementType
 * @see Nullable
 * @see Label
 * @see NameField
 * @see Normalizable
 * @see Validatable
 * @see ValidationResult
 * @see DefaultOptions.get('assign')
 * @see DefaultOptions.get('toJSON')
 * @author Haixing Hu
 */
function Model(Class, context) {
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (typeof Class !== 'function' || context.kind !== 'class') {
    throw new TypeError('The `@Model` can only decorate a class.');
  }
  // put the context.metadata to the cache
  classMetadataCache.set(Class, context.metadata);
  // The category of the class modified by `@Model` is set to 'model'
  setClassMetadata(Class, KEY_CLASS_CATEGORY, 'model');
  // Add the instance method `assign()`
  if (!hasOwnPrototypeFunction(Class, 'assign')) {
    /**
     * Copies the properties from a specified data object to this object, only
     * copying properties defined in the class of this object.
     *
     * If a property in the data object doesn't exist, the function
     * sets the property of this object to the default value. However, if a property
     * exists in the data object but its value is `null` or `undefined`, the function
     * will preserve that `null` or `undefined` value in this object.
     *
     * Note that the data object may have a different prototype than this object.
     *
     * @param {object} obj
     *     the data object, which may have a different prototype than this object.
     * @param {null|undefined|object} options
     *     the additional options for the assignment. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('assign')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     after the assignment. The default value is `true`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     style of the target object. The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the first argument of the `assign()` method. The default value
     *     of this argument is `'LOWER_UNDERSCORE'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the object calling the `assign()` method. The default value
     *     of this argument is `'LOWER_CAMEL'`.
     *  - `types: object`, the additional information about types of
     *     fields of classes. The keys of this object are the path of the fields
     *     or sub-fields of the target object, the values are the type of the
     *     fields, represented as the constructor function of the type.
     *     The default value is `{}`.
     *  - `elementTypes: object`, the additional information about types of
     *     elements of fields of classes. The keys of this object are the path of
     *     the fields or sub-fields of the target object, the values are the type
     *     of the elements, represented as the constructor function of the type.
     *     The default value is `{}`.
     * @returns {object}
     *     the reference to this object.
     * @see DefaultOptions.get('assign')
     * @method
     * @name Model#assign
     * @memberof Model
     */
    Class.prototype.assign = function assign(obj, options = undefined) {
      return assignImpl(Class, this, obj, options);
    };
  }
  // Add the instance method `clear()`
  if (!hasOwnPrototypeFunction(Class, 'clear')) {
    /**
     * Sets all the properties of this object to their default values.
     *
     * @returns {object}
     *     the reference to this object.
     * @method
     * @name Model#clear
     * @memberof Model
     */
    Class.prototype.clear = function clear() {
      return clearImpl(Class, this);
    };
  }
  // Add the instance method `clone()`
  if (!hasOwnPrototypeFunction(Class, 'clone')) {
    /**
     * Clones this object.
     *
     * @returns {object}
     *     the cloned copy of this object.
     * @method
     * @name Model#clone
     * @memberof Model
     */
    Class.prototype.clone = function clone() {
      return cloneImpl(Class, this);
    };
  }
  // Add the instance method `isEmpty()`
  if (!hasOwnPrototypeFunction(Class, 'isEmpty')) {
    /**
     * Checks whether this object is empty, i.e., whether all of its properties
     * have default values.
     *
     * @returns {boolean}
     *     `true` if this object is empty; `false` otherwise.
     * @method
     * @name Model#isEmpty
     * @memberof Model
     */
    Class.prototype.isEmpty = function isEmpty() {
      return isEmptyImpl(Class, this);
    };
  }
  // Add the instance method `equals()`
  if (!hasOwnPrototypeFunction(Class, 'equals')) {
    /**
     * Determines whether this object is deeply equal to the other object.
     *
     * @param {object} obj
     *     the other object.
     * @returns {boolean}
     *     `true` if this object is deeply equal to the other object; `false`
     *     otherwise.
     * @method
     * @name Model#equals
     * @memberof Model
     */
    Class.prototype.equals = function equals(obj) {
      return equalsImpl(this, obj);
    };
  }
  // Add the instance method `normalize()`
  if (!hasOwnPrototypeFunction(Class, 'normalize')) {
    /**
     * Normalizes all normalizable fields or specified normalizable fields of
     * this object.
     *
     * A field is normalizable if and only if it is decorated with the
     * `@{@link Normalizable}` decorator.
     *
     * If a field value is `null` or `undefined`, the normalization process will
     * preserve the `null` or `undefined` value rather than replacing it with a
     * default value.
     *
     * @param {undefined|string|array} fields
     *     the names of fields to be normalized. If this argument is not specified,
     *     or `undefined`, or `null`, or a string `'*'`, this function normalizes
     *     all normalizable fields of this object; If this argument is an array of
     *     strings, this function normalizes all normalizable fields specified
     *     in the array. If this argument is a string other than `'*'`, this
     *     function normalizes the field with the name equals to this argument;
     *     if the specified field does not exist nor non-normalizable, this
     *     function does nothing.
     * @param {object} options
     *     The optional options for the normalization. Default value is an empty
     *     object. Currently, the following options are supported:
     *  - `path: string`, the path of the root object of this object.
     *     The default value of this option is `'.'`.
     *  - `types: object`, the additional information about types of fields
     *     of classes. The keys of this object are the path of the fields or
     *     sub-fields of this object, the values are the type of the fields,
     *     represented as the constructor function of the type. The path of
     *     the root of this object is an empty, therefore the path of the direct
     *     field of this object is of the form `'.field'`, and the
     *     path of the sub-field of a field is of the form `'.field.subField'`.
     *     The default value of this option is `{}`.
     *  - `elementTypes: object`, the additional information about types of
     *     elements of fields of classes. The keys of this object are the path of
     *     the fields or sub-fields of the target object, the values are the type
     *     of the elements, represented as the constructor function of the type.
     *     The default value of this option is `{}`.
     * @returns {object}
     *     the reference to this object.
     * @method
     * @name Model#normalize
     * @memberof Model
     */
    Class.prototype.normalize = function normalize(fields = '*', options = {}) {
      return normalizeImpl(Class, this, fields, options);
    };
  }
  // Add the instance method `normalizeField()`
  if (!hasOwnPrototypeFunction(Class, 'normalizeField')) {
    /**
     * Normalizes the specified normalizable fields of this object.
     *
     * A field is normalizable if and only if it is decorated with the
     * `@{@link Normalizable}` decorator.
     *
     * @param {string} field
     *     the names of fields to be normalized. If the specified field does not
     *     exist nor non-normalizable, this function does nothing and returns
     *     `false`.
     * @param {object} options
     *     The optional options for the normalization. Default value is an empty
     *     object. Currently, the following options are supported:
     *  - `path: string`, the path of the root object of this object.
     *     The default value of this option is `'.'`.
     *  - `types: object`, the additional information about types of fields
     *     of classes. The keys of this object are the path of the fields or
     *     sub-fields of this object, the values are the type of the fields,
     *     represented as the constructor function of the type. The path of
     *     the root of this object is an empty, therefore the path of the direct
     *     field of this object is of the form `'.field'`, and the
     *     path of the sub-field of a field is of the form `'.field.subField'`.
     *     The default value of this option is `{}`.
     *  - `elementTypes: object`, the additional information about types of
     *     elements of fields of classes. The keys of this object are the path of
     *     the fields or sub-fields of the target object, the values are the type
     *     of the elements, represented as the constructor function of the type.
     *     The default value of this option is `{}`.
     * @returns {boolean}
     *     `true` if the specified field exists and is normalizable; `false`
     *     otherwise.
     * @method
     * @name Model#normalizeField
     * @memberof Model
     */
    Class.prototype.normalizeField = function normalizeField(field, options = {}) {
      return normalizeFieldImpl(Class, this, field, options);
    };
  }
  // Add the instance method `validate()`
  if (!hasOwnPrototypeFunction(Class, 'validate')) {
    /**
     * Validates this object.
     *
     * @param {undefined|string|array} fields
     *     the names of fields to be validated. If this argument is not specified,
     *     or `undefined`, or `null`, or a string `'*'`, this function validates
     *     all validatable fields of this object; If this argument is an array of
     *     strings, this function validates all validatable fields specified
     *     in the array. If this argument is a string other than `'*'`, this
     *     function validates the field with the name equals to this argument;
     *     if the specified field does not exist nor non-validatable, this
     *     function does nothing.
     * @param {object} context
     *     The validation context. If this argument is not specified, an empty
     *     context is used.
     * @returns {ValidationResult}
     *     The result of validation.
     * @method
     * @name Model#validate
     * @memberof Model
     */
    Class.prototype.validate = function validate(fields = '*', context = {}) {
      return validateImpl(Class, this, fields, context);
    };
  }
  // Add the instance method `validateField()`
  if (!hasOwnPrototypeFunction(Class, 'validateField')) {
    /**
     * Validates the specified validatable fields of this object.
     *
     * A field is validatable if and only if it is decorated with the
     * `@{@link Validatable}` decorator.
     *
     * @param {string} field
     *     the names of fields to be validated. If the specified field does not
     *     exist nor non-validatable, this function does nothing and returns
     *     `null`.
     * @param {object} context
     *     The validation context. If this argument is not specified, an empty
     *     context is used.
     * @returns {ValidationResult|null}
     *     The validation result if the specified field exists; `null` otherwise.
     *     If the specified field exist but is non-validatable, returns the success
     *     validation result.
     * @method
     * @name Model#validateField
     * @memberof Model
     */
    Class.prototype.validateField = function validateField(field, context = {}) {
      return validateFieldImpl(Class, this, field, context);
    };
  }
  // Add the instance method `generateId()` to the class containing the `id` field
  if (hasOwnClassField(Class, 'id') && !hasPrototypeFunction(Class, 'generateId')) {
    // If its own instance has an `id` field, and there is no `generateId()`
    // method on itself or its parent class prototype
    setClassMetadata(Class, KEY_CLASS_NEXT_ID, 0);
    /**
     * Generates the next unique identifier for instances of this class and set
     * it to this object.
     *
     * Each call to this method generates a globally unique ID (represented as
     * an integer) for the class of this object, sets it to this object and
     * returns the generated ID.
     *
     * Note hat if a parent class `A` defines the `id` field, and a subclass `B`
     * inherits the `id` field but does not define its own `id` field, the
     * `generateId()` method is only added to class `A`, not to class `B`.
     *
     * @returns {number}
     *     the generated unique ID.
     * @method
     * @name Model#generateId
     * @memberof Model
     */
    Class.prototype.generateId = function generateId() {
      return generateIdImpl(Class, this);
    };
  }
  // Add the instance method `toJSON()`
  if (!hasOwnPrototypeFunction(Class, 'toJSON')) {
    /**
     * Gets the object to be serialized by `JSON.stringify()`.
     *
     * If the value has a `toJSON()` method, it's responsible to define what
     * data will be serialized. Instead of the object being serialized, the value
     * returned by the `toJSON()` method when called will be serialized.
     *
     * **NOTE:** this function returns an object to be serialized by
     * `JSON.stringify()`, instead of a JSON string. Use `JSON.stringify()`
     * or `this.toJsonString()` methods to serialize this object into a JSON
     * string.
     *
     * @param {string} key
     *     `JSON.stringify()` calls `toJSON()` with one parameter, the `key`,
     *     which takes the following values:
     *  - if this object is a property value, this argument is the property
     *     name;
     *  - if this object is in an array, this argument is the index in the
     *     array, as a string;
     *  - if `JSON.stringify()` was directly called on this object, this
     *     argument is an empty string.
     * @param {null|undefined|object} options
     *     the additional options for the serialization. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('toJSON')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     before serializing. The default value is `true`.
     *  - `removeEmptyFields: boolean`, indicates whether to ignore the empty
     *     fields of the object. If it is `true`, the empty fields of the object
     *     will be removed before serialization. The default value is `false`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     of properties of the object represented by the result JSON string.
     *     The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the object calling the `toJSON()` method. The default value
     *     of this argument is `'LOWER_CAMEL'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the object represented by the result JSON string of the
     *     `toJSON()` method. The default value of this argument is
     *     `'LOWER_UNDERSCORE'`.
     *  - `space: string | number`, a string or number that's used to insert
     *     white space (including indentation, line break characters, etc.) into
     *     the output JSON string for readability purposes. If this is a number,
     *     it indicates the number of space characters to be used as indentation,
     *     clamped to 10 (that is, any number greater than 10 is treated as if
     *     it were 10). Values less than 1 indicate that no space should be used.
     *     If this is a string, the string (or the first 10 characters of the
     *     string, if it's longer than that) is inserted before every nested
     *     object or array. If this is anything other than a string or number
     *     (can be either a primitive or a wrapper object) — for example, is
     *     `null` or not provided — no white space is used. The default value
     *     of this option is `null`.
     * @returns {object}
     *     the object to be serialized by `JSON.stringify()`, which may be a
     *     modify copy of this object.
     * @see toJsonString()
     * @see DefaultOptions.get('toJSON')
     * @method
     * @name Model#toJSON
     * @memberof Model
     */
    Class.prototype.toJSON = function toJSON(key = '', options = {}) {
      if (typeof key === 'object') {
        // if the key is an object, it means that the `toJSON()` method is called
        // directly with the only argument `options`, so the `key` is the `options`
        options = key;
        key = '';
      }
      return toJsonImpl(this, key, {
        ...options,
        skipRootToJSON: true,
      });
    };
  }
  // Add the instance method `toJSON()`
  if (!hasOwnPrototypeFunction(Class, 'toJsonString')) {
    /**
     * Serializes this object into a JSON string.
     *
     * **NOTE:** This method supports native `bigint` value. For example, the
     * `bigint` value `9223372036854775807n` will be stringify as
     * `9223372036854775807`.
     *
     * @param {null|undefined|object} options
     *     the additional options for the serialization. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('toJSON')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     before serializing. The default value is `true`.
     *  - `removeEmptyFields: boolean`, indicates whether to ignore the empty
     *     fields of the object. If it is `true`, the empty fields of the object
     *     will be removed before serialization. The default value is `false`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     of properties of the object represented by the result JSON string.
     *     The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the object calling the `toJSON()` method. The default value
     *     of this argument is `'LOWER_CAMEL'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the object represented by the result JSON string of the
     *     `toJSON()` method. The default value of this argument is
     *     `'LOWER_UNDERSCORE'`.
     *  - `space: string | number`, a string or number that's used to insert
     *     white space (including indentation, line break characters, etc.) into
     *     the output JSON string for readability purposes. If this is a number,
     *     it indicates the number of space characters to be used as indentation,
     *     clamped to 10 (that is, any number greater than 10 is treated as if
     *     it were 10). Values less than 1 indicate that no space should be used.
     *     If this is a string, the string (or the first 10 characters of the
     *     string, if it's longer than that) is inserted before every nested
     *     object or array. If this is anything other than a string or number
     *     (can be either a primitive or a wrapper object) — for example, is
     *     `null` or not provided — no white space is used. The default value
     *     of this option is `null`.
     * @returns {string}
     *     the JSON string serialized from this object, as `JSON.stringify()`
     *     does, except that this function provides additional stringification
     *     options.
     * @see toJSON()
     * @see DefaultOptions.get('toJSON')
     * @method
     * @name Model#toJsonString
     * @memberof Model
     */
    Class.prototype.toJsonString = function toJsonString(options = {}) {
      return toJsonStringImpl(Class, this, options);
    };
  }
  // Add the class method `create()`
  if (!Object.prototype.hasOwnProperty.call(Class, 'create')) {
    /**
     * Creates a new instance of this class based on the specified data object.
     *
     * It copies the property values from the corresponding properties of the
     * specified data object maintaining the same prototype and class definition.
     *
     * If a property doesn't exist in the data object, the function sets the property
     * of the created instance to the default value. If a property exists in the data
     * object but its value is `null` or `undefined`, the function preserves the `null`
     * or `undefined` value.
     *
     * This method is usually used to transform a plain JSON object into the
     * specified domain object.
     *
     * @param {object} obj
     *     the specified data object.
     * @param {null|undefined|object} options
     *     the additional options for the creation. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('assign')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     after the assignment. The default value is `true`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     style of the target object. The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the first argument of the `create()` method. The default
     *     value of this argument is `'LOWER_UNDERSCORE'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the object returned by the `create()` method. The default
     *     value of this argument is `'LOWER_CAMEL'`.
     *  - `types: object`, the additional information about types of
     *     fields of classes. The keys of this object are the path of the fields
     *     or sub-fields of the target object, the values are the type of the
     *     fields, represented as the constructor function of the type.
     *     The default value is `{}`.
     *  - `elementTypes: object`, the additional information about types of
     *     elements of fields of classes. The keys of this object are the path of
     *     the fields or sub-fields of the target object, the values are the type
     *     of the elements, represented as the constructor function of the type.
     *     The default value is `{}`.
     * @returns {Class|null}
     *     the new instance of this class created from the specified data object,
     *     or `null` if the specified object is `null` or `undefined`.
     * @see DefaultOptions.get('assign')
     * @method
     * @memberof Model
     */
    Class.create = function create(obj, options = undefined) {
      return createImpl(Class, obj, options);
    };
  }
  // Add the class method `createArray()`
  if (!Object.prototype.hasOwnProperty.call(Class, 'createArray')) {
    /**
     * Creates a new array of instances of this class based on an array of data
     * objects.
     *
     * The property values of each element in the created instances array are
     * copied from the corresponding elements in the data object array,
     * maintaining the same prototype and class definition.
     *
     * For each element in the array, if a property doesn't exist in the data object,
     * the function sets the property of the created instance to the default value.
     * If a property exists in the data object but its value is `null` or `undefined`,
     * the function preserves the `null` or `undefined` value.
     *
     * This method is usually used to transform an array of plain JSON objects
     * into an array of specified domain objects.
     *
     * @param {Array<object>}  array
     *     the specified array of data objects.
     * @param {null|undefined|object} options
     *     the additional options for the creation. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('assign')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     after the assignment. The default value is `true`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     style of the target object. The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the elements in the first argument of the `createArray()`
     *     method. The default value of this argument is `'LOWER_UNDERSCORE'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the elements in the array returned by the `createArray()`
     *     method. The default value of this argument is `'LOWER_CAMEL'`.
     *  - `types: object`, the additional information about types of
     *     fields of classes. The keys of this object are the path of the fields
     *     or sub-fields of the target object, the values are the type of the
     *     fields, represented as the constructor function of the type.
     *     The default value is `{}`.
     *  - `elementTypes: object`, the additional information about types of
     *     elements of fields of classes. The keys of this object are the path of
     *     the fields or sub-fields of the target object, the values are the type
     *     of the elements, represented as the constructor function of the type.
     *     The default value is `{}`.
     * @returns {Array<Class>|null}
     *     the new array of instances of this class created from the specified
     *     data object array, or `null` if the specified data object array is
     *     `null` or `undefined`.
     * @see DefaultOptions.get('assign')
     * @method
     * @memberof Model
     */
    Class.createArray = function createArray(array, options = undefined) {
      return createArrayImpl(Class, array, options);
    };
  }
  // Add the class method `createPage()`
  if (!Object.prototype.hasOwnProperty.call(Class, 'createPage')) {
    /**
     *  Creates a new page object based on the specified pagination data object.
     *
     *  Typically, the pagination data object is the JSON representation of a
     *  list of domain objects obtained from a server using the GET method, and
     *  the object should conform to the `Page` class definition.
     *
     *  For each element in the page content array, if a property doesn't exist in
     *  the data object, the function sets the property of the created instance to
     *  the default value. If a property exists in the data object but its value is
     *  `null` or `undefined`, the function preserves the `null` or `undefined` value.
     *
     * @param {object} page
     *     the specified pagination data object, which must conform to the
     *     `Page` class definition.
     * @param {null|undefined|object} options
     *     the additional options for the creation. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('assign')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     after the assignment. The default value is `true`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     style of the target object. The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the elements in the `content` array of the first argument of
     *     the `createPage()` method. The default value of this argument is
     *     `'LOWER_UNDERSCORE'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the elements in the `content` array of the `Page` object
     *     returned by the `createPage()` method. The default value of this
     *     argument is `'LOWER_CAMEL'`.
     *  - `types: object`, the additional information about types of
     *     fields of classes. The keys of this object are the path of the fields
     *     or sub-fields of the target object, the values are the type of the
     *     fields, represented as the constructor function of the type.
     *     The default value is `{}`.
     *  - `elementTypes: object`, the additional information about types of
     *     elements of fields of classes. The keys of this object are the path of
     *     the fields or sub-fields of the target object, the values are the type
     *     of the elements, represented as the constructor function of the type.
     *     The default value is `{}`.
     * @returns {Page|null}
     *     A new `Page` object, whose `content` property is the result of
     *     `this.createArray(page.content, true)`, and the other properties
     *     matching those of the `page` object. If the argument `page` is not a
     *     valid `Page` object, this function returns `null`.
     * @see DefaultOptions.get('assign')
     * @method
     * @memberof Model
     */
    Class.createPage = function createPage(page, options = undefined) {
      return createPageImpl(Class, page, options);
    };
  }
  // Add the class method `isNullishOrEmpty()`
  if (!Object.prototype.hasOwnProperty.call(Class, 'isNullishOrEmpty')) {
    /**
     * Determines whether the given instance of this class is `undefined`,
     * `null`, or an empty object constructed with default values.
     *
     * @param {object} obj
     *     the specified object.
     * @returns {boolean}
     *     `true` if the specified object is `undefined`, or `null` or an empty
     *     instance of this class; `false` otherwise.
     * @throws TypeError
     *     if the specified object is not nullish and is not a instance of this
     *     class.
     * @method
     * @memberof Model
     */
    Class.isNullishOrEmpty = function isNullishOrEmpty(obj) {
      return isNullishOrEmptyImpl(Class, obj);
    };
  }
  // Add the class method `parseJsonString()`
  if (!Object.prototype.hasOwnProperty.call(Class, 'parseJsonString')) {
    /**
     * Parses an object of this class from a JSON string.
     *
     * **NOTE:** This method supports integer values fall out of IEEE 754 integer
     * precision. For example, the integer value `9223372036854775807` will be
     * parsed as the native `bigint` value `9223372036854775807n`.
     *
     * @param {string} json
     *     the JSON string to be parsed.
     * @param {null|undefined|object} options
     *     the additional options for the parsing. If this argument is
     *     `undefined` or `null`, the default options will be used. The default
     *     options can be retrieved by calling `DefaultOptions.get('assign')`.
     *     Available options are:
     *  - `normalize: boolean`, indicates whether to normalize this object
     *     after the assignment. The default value is `true`.
     *  - `convertNaming: boolean`, indicates whether to convert the naming
     *     style of the target object. The default value is `false`.
     *  - `sourceNamingStyle: string`, the naming style of the source object,
     *     i.e., the first argument of the `assign()` method. The default
     *     value of this argument is `'LOWER_UNDERSCORE'`.
     *  - `targetNamingStyle: string`, the naming style of the target object,
     *     i.e., the object calling the `assign()` method. The default value
     *     of this argument is `'LOWER_CAMEL'`.
     * @returns {object}
     *     the object deserialized from the specified JSON string.
     * @see toJsonString()
     * @method
     * @memberof Model
     */
    Class.parseJsonString = function parseJsonString(json, options = undefined) {
      return parseJsonStringImpl(Class, json, options);
    };
  }
}

export default Model;
