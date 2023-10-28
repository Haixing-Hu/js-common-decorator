////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getDefaultInstance, requirePrototypeMethod } from '../utils';

/**
 * Clears all fields of an object.
 *
 * @param {function} Class
 *     The constructor of the specified model class.
 * @param {object} obj
 *     An object in the specified model class.
 * @returns {Class}
 *     The cleared object.
 */
function clearImpl(Class, obj) {
  requirePrototypeMethod(Class, 'assign');
  const defaultInstance = getDefaultInstance(Class);
  // note that the following statement must NOT normalize the object after
  // assignment, since the default instance may be un-normalized.
  return obj.assign(defaultInstance, false);
}

export default clearImpl;
