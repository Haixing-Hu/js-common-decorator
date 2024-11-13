////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_CATEGORY } from './impl/metadata-keys';
import getClassMetadata from './impl/utils/get-class-metadata';

/**
 * Tests whether a specified value is an enumerator of an enumeration class,
 * i.e., the static constants of a class decorated by `@Enum`.
 *
 * @param {any} value
 *     The specified value.
 * @return {boolean}
 *     `true` if the specified value is an enumerator of an enumeration class,
 *     i.e., the static constants of a class decorated by `@Enum`; `false`
 *     otherwise.
 * @author Haixing Hu
 */
function isEnumerator(value) {
  if (value === undefined || value === null || (typeof value !== 'object')) {
    return false;
  }
  const Class = Object.getPrototypeOf(value).constructor;
  const category = getClassMetadata(Class, KEY_CLASS_CATEGORY);
  return category === 'enum';
}

export default isEnumerator;
