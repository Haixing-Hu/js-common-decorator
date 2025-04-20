////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import requirePrototypeMethod from '../utils/require-prototype-method';

/**
 * Tests whether an object of the specified model class is nullish or empty.
 *
 * If the specified object is not nullish, this function will test whether
 * the object is an instance of the specified model class, and then call
 * the `isEmpty()` method of the object to determine whether the object is
 * empty.
 *
 * @param {function} Class
 *     The constructor of the model class.
 * @param {object} obj
 *     The object to be tested.
 * @return {boolean}
 *     `true` if the object is nullish or empty; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
function isNullishOrEmptyImpl(Class, obj) {
  requirePrototypeMethod(Class, 'isEmpty');
  if (obj === null || obj === undefined) {
    return true;
  }
  if (!(obj instanceof Class)) {
    throw new TypeError(`The object must be an instance of the class ${Class.name}.`);
  }
  return obj.isEmpty();
}

export default isNullishOrEmptyImpl;
