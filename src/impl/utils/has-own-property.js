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
 * Determines whether a class directly owns a specific property (not inherited from parent classes).
 *
 * This function checks if the specified property is directly defined on either:
 * 1. The prototype of the class itself, or
 * 2. The default instance of the class
 *
 * Unlike JavaScript's built-in Object.prototype.hasOwnProperty, this function:
 * - Accepts a class constructor rather than an object instance
 * - Checks both the prototype and default instance
 * - Only reports properties owned directly by the class (not inherited properties)
 *
 * @param {function} Class
 *     The constructor of the class to check.
 * @param {string} field
 *     The name of the property to check for.
 * @returns {boolean}
 *     Returns true if and only if the property is directly defined by the class
 *     (either on its prototype or default instance), not inherited from parent classes.
 * @see hasPrototypeFunction
 *     For checking inherited properties in the prototype chain.
 * @author Haixing Hu
 */
function hasOwnProperty(Class, field) {
  if (!Class || !Class.prototype) {
    return false;
  }
  if (Object.prototype.hasOwnProperty.call(Class.prototype, field)) {
    return true;
  } else {
    const defaultInstance = getDefaultInstance(Class);
    return defaultInstance && Object.prototype.hasOwnProperty.call(defaultInstance, field);
  }
}

export default hasOwnProperty;
