////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setClassMetadata, getClassMetadata } from '../utils';
import { KEY_CLASS_NEXT_ID } from '../metadata-keys';

/**
 * Generates a unique ID for the specified object.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {object} obj
 *     The specified object, whose `id` attribute will be set to the newly
 *     generated ID.
 * @return {string}
 *     The generated ID.
 */
function generateIdImpl(Class, obj) {
  const id = getClassMetadata(Class, KEY_CLASS_NEXT_ID);
  obj.id = id.toString();
  setClassMetadata(Class, KEY_CLASS_NEXT_ID, id + 1);
  return obj.id;
}

export default generateIdImpl;
