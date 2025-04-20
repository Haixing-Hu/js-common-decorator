////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_NEXT_ID } from '../metadata-keys';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getClassMetadata from '../utils/get-class-metadata';
import setClassMetadata from '../utils/set-class-metadata';

/**
 * Generates a unique ID for the specified object.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {object} obj
 *     The specified object, whose `id` attribute will be set to the newly
 *     generated ID.
 * @return {number}
 *     The generated ID.
 * @author Haixing Hu
 * @private
 */
function generateIdImpl(Class, obj) {
  const id = getClassMetadata(Class, KEY_CLASS_NEXT_ID);
  obj.id = id;
  setClassMetadata(Class, KEY_CLASS_NEXT_ID, id + 1);
  return obj.id;
}

export default generateIdImpl;
