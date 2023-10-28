////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { requirePrototypeMethod } from '../utils';

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
  return obj.isEmpty();
}

export default isNullishOrEmptyImpl;
