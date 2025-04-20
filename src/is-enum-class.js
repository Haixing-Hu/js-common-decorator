////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_CATEGORY } from './impl/metadata-keys';
import getClassMetadata from './impl/utils/get-class-metadata';

/**
 * Tests whether a specified class is an enumeration class decorated by `@Enum`.
 *
 * @param {function} Class
 *     The constructor function of a class.
 * @return {boolean}
 *     `true` if the specified class is an enumeration class decorated by
 *     `@Enum`; `false` otherwise.
 * @author Haixing Hu
 */
function isEnumClass(Class) {
  if (typeof Class !== 'function') {
    return false;
  }
  const category = getClassMetadata(Class, KEY_CLASS_CATEGORY);
  return category === 'enum';
}

export default isEnumClass;
