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
 *   `obj` to this object, only copying properties defined in this object's class.
 *   If a property in the `obj` object is `undefined` or `null`, it sets the
 *   property's value to the default value. The function returns the object itself.
 *   Note that `obj` can have a different prototype than this object.
 *   The `normalized` parameter indicates whether to normalize this object after
 *   copying properties, with a default value of `true`.
 * - Instance method `clear()`: Sets all the properties of this object to their
 *   default values.
 * - Instance method `clone()`: Returns a deep clone of this object.
 * - Instance method `isEmpty()`: Checks if this object is empty, meaning that all
 *   of its properties have default values.
 * - Instance method `equals(obj)`: Determines if this object is deeply equal
 *   to `obj`.
 * - Instance method `normalize(fields)`: Normalizes a specified field of this
 *   object. The `fields` parameter specifies the names of fields to be normalized.
 *   If `fields` is `undefined`, `null`, or the string `"*"`, it normalizes all
 *   the fields that can be normalized for this object. If `fields` is an array of
 *   strings, it normalizes all the fields specified in the array. Note that a
 *   field must be specified as normalized using the `@{@link Normalizable}`
 *   decorator.
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
 *   Each call to this method generates a globally unique ID for the current
 *   calling object (represented as a string of an integer) and returns it. Note
 *   that if a parent class `A` defines the `id` field, and a subclass `B` inherits
 *   the `id` field but does not define its own `id` field, the `generateId()`
 *   method is added only to class `A`, not to class `B`.
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
 *   &#064;EnumNormalizer
 *   &#064;Validator(validateCredentialTypeField)
 *   &#064;Type(CredentialType)
 *   &#064;Label('证件类型')
 *   type = 'IDENTITY_CARD';
 *
 *   &#064;Normalizer(trimUppercaseString)
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
 *   &#064;DefaultNormalizer
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
    Class.prototype.assign = function assign(obj, normalized = true) {
      return assignImpl(Class, this, obj, normalized);
    };
  }
  // Add the instance method `clear()`
  if (!hasOwnPrototypeFunction(Class, 'clear')) {
    Class.prototype.clear = function clear() {
      return clearImpl(Class, this);
    };
  }
  // Add the instance method `clone()`
  if (!hasOwnPrototypeFunction(Class, 'clone')) {
    Class.prototype.clone = function clone() {
      return cloneImpl(this);
    };
  }
  // Add the instance method `isEmpty()`
  if (!hasOwnPrototypeFunction(Class, 'isEmpty')) {
    Class.prototype.isEmpty = function isEmpty() {
      return isEmptyImpl(Class, this);
    };
  }
  // Add the instance method `equals()`
  if (!hasOwnPrototypeFunction(Class, 'equals')) {
    Class.prototype.equals = function equals(obj) {
      return equalsImpl(this, obj);
    };
  }
  // Add the instance method `normalizeField()`
  if (!hasOwnPrototypeFunction(Class, 'normalizeField')) {
    Class.prototype.normalizeField = function normalizeField(field) {
      return normalizeFieldImpl(Class, this, field);
    };
  }
  // Add the instance method `normalize()`
  if (!hasOwnPrototypeFunction(Class, 'normalize')) {
    Class.prototype.normalize = function normalize(fields = '*') {
      return normalizeImpl(Class, this, fields);
    };
  }
  // // Add the instance method `validate()`
  // if (!hasOwnPrototypeFunction(Class, 'validate')) {
  //   Class.prototype.validate = function validate(fields = '*', options = {}) {
  //     return ValidateImpl.validate(Class, this, fields, options);
  //   };
  // }
  // Add the instance method `generateId()` to the class containing the `id` field
  if (hasOwnClassField(Class, 'id') && !hasPrototypeFunction(Class, 'generateId')) {
    // If its own instance has an `id` field, and there is no `generateId()`
    // method on itself or its parent class prototype
    setClassMetadata(Class, KEY_CLASS_NEXT_ID, 0);
    Class.prototype.generateId = function generateId() {
      return generateIdImpl(Class, this);
    };
  }
  // Add the class method `create()`
  if (!Object.hasOwn(Class, 'create')) {
    Class.create = function create(obj, normalized = true) {
      return createImpl(Class, obj, normalized);
    };
  }
  // Add the class method `createArray()`
  if (!Object.hasOwn(Class, 'createArray')) {
    Class.createArray = function createArray(array, normalized = true) {
      return createArrayImpl(Class, array, normalized);
    };
  }
  // Add the class method `createPage()`
  if (!Object.hasOwn(Class, 'createPage')) {
    Class.createPage = function createPage(page) {
      return createPageImpl(Class, page);
    };
  }
  // Add the class method `isNullishOrEmpty()`
  if (!Object.hasOwn(Class, 'isNullishOrEmpty')) {
    Class.isNullishOrEmpty = function isNullishOrEmpty(obj) {
      return isNullishOrEmptyImpl(Class, obj);
    };
  }
  // console.log('@Model: Class = ', Class, ', Class.prototype = ', Class.prototype);
}

export default Model;
