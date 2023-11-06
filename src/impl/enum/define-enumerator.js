////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Defines an enumerator of an enumeration class.
 *
 * This function will modify the specified static field of the specified class
 * to be an instance of the enumeration class, and then freeze it.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} field
 *     The name of the static field corresponding to the enumerator to be defined.
 * @author Haixing Hu
 * @private
 */
function defineEnumerator(Class, field) {
  const defaultValue = Class[field];
  // redefine the static field to be an instance of the enumeration class
  const enumerator = new Class();
  enumerator.value = field;
  if (defaultValue === undefined || defaultValue === null) {
    enumerator.name = field;
  } else if (typeof defaultValue === 'string') {
    enumerator.name = defaultValue;
  } else if (typeof defaultValue === 'object') {
    Object.assign(enumerator, defaultValue);
    if (enumerator.i18n) {
      // TODO: add i18n support
    }
  } else {
    throw new TypeError('The default value of the enumerator'
      + `${Class.name}.${field} should be either a string or an object.`)
  }
  Object.freeze(enumerator);
  Class[field] = enumerator;
}

export default defineEnumerator;
