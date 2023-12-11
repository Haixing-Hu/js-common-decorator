////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { registerCloneHook } from '@haixing_hu/clone';
import { isEnumerator, setClassMetadata } from './impl/utils';
import classMetadataCache from './impl/class-metadata-cache';
import { KEY_CLASS_CATEGORY } from './impl/metadata-keys';
import defineEnumerator from './impl/enum/define-enumerator';
import valueOfImpl from './impl/enum/value-of-impl';
import valuesImpl from './impl/enum/values-impl';
import codeOfImpl from './impl/enum/code-of-impl';
import nameOfImpl from './impl/enum/name-of-impl';

/**
 * This decorator is used to decorate an enumeration class.
 *
 * It must decorate a class.
 *
 * An enumeration class is a class whose instances are enumerators. An enumerator
 * is an object with the following properties:
 * - `value`：the value of the enumerator, which is exactly the name of the
 *   static field of the enumeration class that corresponds to the enumerator.
 * - `name`: the display name of the enumerator, which could be specified
 *   by the default string or object value of the static field of the
 *   enumeration class that corresponds to the enumerator. It the default value
 *   is not specified, the name of the enumerator is the same as its value.
 * - `i18n`: the i18n key of the enumerator, which is an optional property. It
 *   could be specified by the default object value of the static field of the
 *   enumeration class that corresponds to the enumerator. If this property is
 *   specified, the `name` property will be transformed to a `getter`, which will
 *   get the i18n value of the enumerator from the i18n resource bundle.
 * - `code`: the code of the enumerator, which is an optional property. It could
 *   be specified by the default object value of the static field of the
 *   enumeration class that corresponds to the enumerator.
 * - other properties: other properties of the enumerator could be specified
 *   by the default object value of the static field of the enumeration class
 *   that corresponds to the enumerator.
 *
 * An enumerator also has the following prototype method:
 * - `toString()`: returns the value of the enumerator.
 * - `toJSON()`: also returns the value of the enumerator.
 *
 * The enumeration class will have the following static methods:
 * - `values()`: returns the array of all enumerators of this enumeration class.
 * - `valueOf(value): returns the enumerator whose value is `value`, or
 *   `undefined` if no such enumerator exists.
 * - `hasValue(value): returns `true` if there is an enumerator whose value is
 *   `value`, or `false` otherwise.
 * - `nameOf(name): returns the enumerator whose name is `name`, or
 *   `undefined` if no such enumerator exists.
 * - `hasName(name): returns `true` if there is an enumerator whose name is
 *   `name`, or `false` otherwise.
 * - `codeOf(code): returns the enumerator whose code is `code`, or
 *   `undefined` if no such enumerator exists.
 * - `hasCode(code): returns `true` if there is an enumerator whose code is
 *   `code`, or `false` otherwise.
 *
 * Usage example:
 * ```js
 * &#064;Enum
 * class Gender {
 *   static MALE = 'Male';
 *   static FEMALE = 'Female';
 * }
 * ```
 * The above code is equivalent to the following code:
 * ```js
 * class Gender {
 *   static MALE = Object.freeze(new Gender('MALE', 'Male'));
 *
 *   static FEMALE = Object.freeze(new Gender('FEMALE', 'Female'));
 *
 *   static values() {
 *     return [ Gender.MALE, Gender.FEMALE ];
 *   }
 *
 *   static valueOf(value) {
 *     switch (value) {
 *     case 'MALE':
 *       return Gender.MALE;
 *     case 'FEMALE':
 *       return Gender.FEMALE;
 *     default:
 *       return undefined;
 *     }
 *   }
 *
 *   static hasValue(value) {
 *     return Gender.valueOf(value) !== undefined;
 *   }
 *
 *   static nameOf(name) {
 *     return Gender.values().find((e) => e.name === name);
 *   }
 *
 *   static hasName(name) {
 *     return Gender.nameOf(name) !== undefined;
 *   }
 *
 *   static codeOf(code) {
 *     return Gender.values().find((e) => e.code === code);
 *   }
 *
 *   static hasCode(code) {
 *     return Gender.codeOf(code) !== undefined;
 *   }
 *
 *   constructor(value, name) {
 *     this.value = value;
 *     this.name = name;
 *   }
 *
 *   toString() {
 *     return this.value;
 *   }
 *
 *   toJSON() {
 *     return this.value;
 *   }
 * }
 * ```
 *
 * The static fields of the enumeration class could also be specified as objects,
 * which will be used to initialize the enumerators. For example:
 * ```js
 * &#064;Enum
 * class Gender {
 *   static MALE = { name: 'Male', i18n: 'i18n.gender.male', code: '001', data: { value: 0 } };
 *
 *   static FEMALE = { name: 'Female', i18n: 'i18n.gender.female', code: '002', data: { value: 1 } };
 * }
 * ```
 * The above code is equivalent to the following code:
 * ```js
 * class Gender {
 *   static MALE = Object.freeze(new Gender('MALE', 'Male',
 *      { i18n: 'i18n.gender.male', code: '001', data: {value: 0 } }));
 *
 *   static FEMALE = Object.freeze(new Gender('FEMALE', 'Female',
 *      { i18n: 'i18n.gender.female', code: '002', data: {value: 1 } }));
 *
 *   ...
 *
 *   constructor(value, name, payload) {
 *     this.value = value;
 *     this.name = name;
 *     Object.assign(this, payload);
 *   }
 *
 *   ...
 * }
 * ```
 * Note that the enumerator in the above `Gender` class has a `code`, `i18n`
 * and `data` properties. Since it has `i18n` property which specifies the i18n
 * key of the enumerator in the resource bundle, the `name` property of the
 * enumerator will be transformed to a `getter` which will get the i18n value
 * corresponding to the i18n key from the i18n resource bundle.
 *
 * The enumerators can also be defined without default values, for example:
 * ```js
 * &#064;Enum
 * class Gender {
 *   static MALE;
 *   static FEMALE;
 * }
 * ```
 * The above code is equivalent to the following code:
 * ```js
 * class Gender {
 *   static MALE = Object.freeze(new Gender('MALE'));
 *
 *   static FEMALE = Object.freeze(new Gender('FEMALE'));
 *
 *   ...
 *
 *   constructor(value) {
 *     this.value = value;
 *     this.name = value;
 *   }
 *
 *   ...
 * }
 * ```
 * That is, the name of the enumerator is exactly its value.
 *
 * @param {function} Class
 *     The constructor of the class being decorated.
 * @param {object} context
 *     The context object containing information about the class being decorated.
 * @author Haixing Hu
 */
function Enum(Class, context) {
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (typeof Class !== 'function' || context.kind !== 'class') {
    throw new TypeError('The `@Enum` can only decorate a class.');
  }
  // put the context.metadata to the cache
  classMetadataCache.set(Class, context.metadata);
  // The category of the class modified by `@Enum` is set to 'enum'
  setClassMetadata(Class, KEY_CLASS_CATEGORY, 'enum');
  // Loops through all static fields of the `Class` and defines them as enumerators
  context.addInitializer(() => {
    // NOTE that we must perform the following code in the `context.addInitializer()`
    // function, since the decorator @Enum is applied **BEFORE** the static fields
    // of the class were defined, but the `context.addInitializer()` function is
    // called **AFTER** the static fields of the class were defined.
    // see https://github.com/tc39/proposal-decorators#adding-initialization-logic-with-addinitializer
    Object.keys(Class).forEach((field) => {
      if (typeof Class[field] !== 'function') {
        defineEnumerator(Class, field);
      }
    });
  });
  // Add prototype method toString()
  Class.prototype.toString = function toString() {
    return this.value;
  };
  // Add prototype method toJSON()
  Class.prototype.toJSON = function toJSON() {
    return this.value;
  };
  // Add static method values()
  Class.values = function values() {
    return valuesImpl(Class);
  };
  // Add static method valueOf()
  Class.valueOf = function valueOf(value) {
    return valueOfImpl(Class, value);
  };
  // Add static method hasValue()
  Class.hasValue = function hasValue(value) {
    return (valueOfImpl(Class, value) !== undefined);
  };
  // Add static method nameOf()
  Class.nameOf = function nameOf(name) {
    return nameOfImpl(Class, name);
  };
  // Add static method hasName()
  Class.hasName = function hasName(name) {
    return (nameOfImpl(Class, name) !== undefined);
  };
  // Add static method forCode()
  Class.codeOf = function codeOf(code) {
    return codeOfImpl(Class, code);
  };
  // Add static method hasCode()
  Class.hasCode = function hasCode(code) {
    return (codeOfImpl(Class, code) !== undefined);
  };
}

/**
 * Register the clone hook of enumerators.
 *
 * @author Haixing Hu
 * @see registerCloneHook
 * @private
 */
function registerEnumeratorCloneHook() {
  registerCloneHook((info, obj) => {
    if (isEnumerator(obj)) {
      return obj;     // the enumerator should not be cloned
    }
    return null;
  });
}

// Globally register the clone hook of enumerators.
registerEnumeratorCloneHook();

export default Enum;
