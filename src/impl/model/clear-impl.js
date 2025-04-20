////////////////////////////////////////////////////////////////////////////////
import getDefaultInstance from '../utils/get-default-instance';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import requirePrototypeMethod from '../utils/require-prototype-method';

/**
 * Clears all fields of an object.
 *
 * @param {function} Class
 *     The constructor of the specified model class.
 * @param {object} obj
 *     An object in the specified model class.
 * @returns {Class}
 *     The cleared object.
 * @author Haixing Hu
 * @private
 */
function clearImpl(Class, obj) {
  requirePrototypeMethod(Class, 'assign');
  const defaultInstance = getDefaultInstance(Class);
  // note that the following statement must NOT normalize the object after
  // assignment, since the default instance may be un-normalized.
  return obj.assign(defaultInstance, { normalize: false, convertNaming: false });
}

export default clearImpl;
