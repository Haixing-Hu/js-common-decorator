////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import deepEqual from 'deep-equal';
import getDefaultInstance from '../utils/get-default-instance';

/**
 * Tests whether the specified object of the specified model class is empty.
 *
 * @param {function} Class
 *     The constructor of the specified model class.
 * @param {object} obj
 *     The specified object in the specified model class.
 * @return {boolean}
 *     `true` if the specified object is empty; otherwise, `false`.
 * @author Haixing Hu
 * @private
 */
function isEmptyImpl(Class, obj) {
  const defaultInstance = getDefaultInstance(Class);
  return deepEqual(obj, defaultInstance);
}

export default isEmptyImpl;
