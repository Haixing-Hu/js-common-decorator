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
 * Clones an object.
 *
 * @param {function} Class
 *     The constructor of the specified model class.
 * @param {object} obj
 *     The specified object in the specified model class.
 * @return {Class}
 *     A clone of the specified object.
 */
function cloneImpl(Class, obj) {
  requirePrototypeMethod(Class, 'assign');
  // note that the following statement must NOT normalize the object after
  // assignment, since the default instance may be un-normalized.
  return new Class().assign(obj, false);
}

export default cloneImpl;
