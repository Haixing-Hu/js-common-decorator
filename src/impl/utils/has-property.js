////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getDefaultInstance from './get-default-instance';

/**
 * Determines whether a class has a specific property (including inherited properties).
 *
 * This function checks if the specified property is defined on either:
 * 1. The prototype chain of the class, or
 * 2. The default instance of the class
 *
 * Unlike `hasOwnProperty()` which only checks direct properties, this function:
 * - Accepts a class constructor rather than an object instance
 * - Checks both the prototype chain and default instance
 * - Reports properties defined anywhere in the inheritance chain
 *
 * @param {function} Class
 *     The constructor of the class to check.
 * @param {string} field
 *     The name of the property to check for.
 * @returns {boolean}
 *     Returns true if the property is defined by the class or any of its parent
 *     classes (either on its prototype chain or default instance).
 * @see hasOwnProperty
 *     For checking only direct properties not inherited from parent classes.
 * @author Haixing Hu
 */
function hasProperty(Class, field) {
  if (!Class || !Class.prototype) {
    return false;
  }
  if (Reflect.has(Class.prototype, field)) {
    return true;
  } else {
    const defaultInstance = getDefaultInstance(Class);
    return defaultInstance && Reflect.has(defaultInstance, field);
  }
}

export default hasProperty;
