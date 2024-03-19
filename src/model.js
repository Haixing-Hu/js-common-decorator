////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import cloneImpl from '@haixing_hu/clone';
import classMetadataCache from './impl/class-metadata-cache';
import { KEY_CLASS_CATEGORY, KEY_CLASS_NEXT_ID } from './impl/metadata-keys';
import {
  hasOwnClassField,
  hasOwnPrototypeFunction,
  hasPrototypeFunction,
  setClassMetadata,
} from './impl/utils';
import assignImpl from './impl/model/assign-impl';
import isEmptyImpl from './impl/model/is-empty-impl';
import equalsImpl from './impl/model/equals-impl';
import generateIdImpl from './impl/model/generate-id-impl';
import clearImpl from './impl/model/clear-impl';
import normalizeFieldImpl from './impl/model/normalize-field-impl';
import normalizeImpl from './impl/model/normalize-impl';
import validateFieldImpl from './impl/model/validate-field-impl';
import validateImpl from './impl/model/validate-impl';
import createImpl from './impl/model/create-impl';
import createArrayImpl from './impl/model/create-array-impl';
import createPageImpl from './impl/model/create-page-impl';
import isNullishOrEmptyImpl from './impl/model/is-nullish-or-empty-impl';

/**
 * This decorator is used to add common methods to a domain model class.
 *
 * It must decorate a class.
 *
 * It adds the following methods to the decorated class:
 *
 * - Instance method `assign(obj, normalized)`: Copies the properties of the object
 *   `obj` to this object, only copying properties defined in the class of this
 *   object. If a property in the `obj` object is `undefined` or `null`, it sets
 *   the property of this object to the default value. The function returns this
 *   object itself. Note that `obj` can have a different prototype than this object.
 *   The `normalized` parameter indicates whether to normalize this object after
 *   copying properties, with a default value of `true`.
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
 * - Static class method `create(obj, normalized)`: Creates a new instance object
 *   based on the `obj` object. It copies the property values from the corresponding
 *   properties of `obj`, maintaining the same prototype and class definition. This
 *   method is used to transform a plain JSON object into the specified domain
 *   object. The `normalized` parameter indicates whether to normalize the returned
 *   object, with a default value of `true`.
 * - Static class method `createArray(array, normalized)`: Creates a new instance
 *   array based on an object array `array`, where each element's property values
 *   are copied from the corresponding elements in `array`, maintaining the same
 *   prototype and class definition. This method is used to transform an array of
 *   plain JSON objects into an array of specified domain objects. The `normalized`
 *   parameter indicates whether to normalize each object in the returned array,
 *   with a default value of `true`.
 * - Static class method `createPage(page)`: Creates a new page object based on a
 *   `page` pagination object. Typically, `page` is a list of domain objects
 *   obtained from a server using the GET method, and the object should conform to
 *   the `Page` class definition. This static class method returns a new `Page`
 *   object, with the `content` property being the result of
 *   `createArray(page.content, true)`, and the other properties matching those of
 *   the `page` object. If the input is not a valid `Page` object, it
 *   returns `null`.
 * - Static class method `isNullishOrEmpty(obj)`: Determines if the given instance
 *   is `undefined`, `null`, or an empty object constructed with default values.
 *
 * **NOTE:** If the decorated class already implements any of the above methods,
 * this decorator will not override the methods already implemented by the
 * decorated class.
 *
 * Usage example:
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
 * - `Credential.prototype.assign(obj, normalized)`
 * - `Credential.prototype.clear()`
 * - `Credential.prototype.clone()`
 * - `Credential.prototype.isEmpty()`
 * - `Credential.prototype.equals(obj)`
 * - `Credential.prototype.normalize(fields)`
 * - `Credential.prototype.validate(fields, options)`
 * - `Credential.create(obj)`
 * - `Credential.createArray(array)`
 * - `Credential.createPage(page)`
 * - `Credential.isNullishOrEmpty(obj)`
 * - `Person.prototype.assign(obj, normalized)`
 * - `Person.prototype.clear()`
 * - `Person.prototype.clone()`
 * - `Person.prototype.isEmpty()`
 * - `Person.prototype.normalize(fields)`
 * - `Person.prototype.validate(fields, options)`
 * - `Person.prototype.generateId()`
 * - `Person.create(obj, normalized)`
 * - `Person.createArray(array, normalized)`
 * - `Person.createPage(page)`
 * - `Person.isNullishOrEmpty(obj)`
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
 * @author Haixing Hu
 * @see Type
 * @see ElementType
 * @see Nullable
 * @see Label
 * @see NameField
 * @see Normalizable
 * @see Validatable
 * @see ValidationResult
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
     * If a property in the data object is `undefined` or `null`, the function
     * sets the property of this object to the default value.
     *
     * Note that the data object may have a different prototype than this object.
     *
     * @param {object} obj
     *     the data object, which may have a different prototype than this object.
     * @param {boolean} normalized
     *     indicates whether to normalize this object after assignment. Default
     *     value is `true`.
     * @returns {object}
     *     the reference to this object.
     */
    Class.prototype.assign = function assign(obj, normalized = true) {
      return assignImpl(Class, this, obj, normalized);
    };
  }
  // Add the instance method `clear()`
  if (!hasOwnPrototypeFunction(Class, 'clear')) {
    /**
     * Sets all the properties of this object to their default values.
     *
     * @returns {object}
     *     the reference to this object.
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
     */
    Class.prototype.clone = function clone() {
      return cloneImpl(this);
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
     * @param {undefined|string|array} fields
     *     the names of fields to be normalized. If this argument is not specified,
     *     or `undefined`, or `null`, or a string `'*'`, this function normalizes
     *     all normalizable fields of this object; If this argument is an array of
     *     strings, this function normalizes all normalizable fields specified
     *     in the array. If this argument is a string other than `'*'`, this
     *     function normalizes the field with the name equals to this argument;
     *     if the specified field does not exist nor non-normalizable, this
     *     function does nothing.
     * @returns {object}
     *     the reference to this object.
     */
    Class.prototype.normalize = function normalize(fields = '*') {
      return normalizeImpl(Class, this, fields);
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
     * @returns {boolean}
     *     `true` if the specified field exists and is normalizable; `false`
     *     otherwise.
     */
    Class.prototype.normalizeField = function normalizeField(field) {
      return normalizeFieldImpl(Class, this, field);
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
     */
    Class.prototype.generateId = function generateId() {
      return generateIdImpl(Class, this);
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
     * If a property in the data object is `undefined` or `null`, the function
     * sets the property of the created instance to the default value.
     *
     * This method is usually used to transform a plain JSON object into the
     * specified domain object.
     *
     * @param {object} obj
     *     the specified data object.
     * @param {boolean} normalized
     *     indicates whether to normalize the created object. The default value
     *     is `true`.
     * @returns {Class|null}
     *     the new instance of this class created from the specified data object,
     *     or `null` if the specified object is `null` or `undefined`.
     */
    Class.create = function create(obj, normalized = true) {
      return createImpl(Class, obj, normalized);
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
     * This method is usually used to transform an array of plain JSON objects
     * into an array of specified domain objects.
     *
     * @param {Array<object>}  array
     *     the specified array of data objects.
     * @param {boolean} normalized
     *     indicates whether to normalize the created objects. The default value
     *     is `true`.
     * @returns {Array<Class>|null}
     *     the new array of instances of this class created from the specified
     *     data object array, or `null` if the specified data object array is
     *     `null` or `undefined`.
     */
    Class.createArray = function createArray(array, normalized = true) {
      return createArrayImpl(Class, array, normalized);
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
     * @param {object} page
     *     the specified pagination data object, which must conform to the
     *     `Page` class definition.
     * @returns {Page|null}
     *     A new `Page` object, whose `content` property is the result of
     *     `this.createArray(page.content, true)`, and the other properties
     *     matching those of the `page` object. If the argument `page` is not a
     *     valid `Page` object, this function returns `null`.
     */
    Class.createPage = function createPage(page) {
      return createPageImpl(Class, page);
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
     */
    Class.isNullishOrEmpty = function isNullishOrEmpty(obj) {
      return isNullishOrEmptyImpl(Class, obj);
    };
  }
  // console.log('@Model: Class = ', Class, ', Class.prototype = ', Class.prototype);
}

export default Model;
