////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isString } from '@haixing_hu/type-detect';

/**
 * Returns the enumerator of an enumeration class which has the specified value.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {string} value
 *     The value of the enumerator to be returned. If the value is a primitive
 *     string or a `String` object, it will be trimmed and converted to an
 *     uppercase string.
 * @returns {undefined|Class}
 *     The enumerator of the specified enumeration class which has the specified
 *     value; or `undefined` if there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function ofValueImpl(Class, value) {
  if (!isString(value)) {
    return undefined;
  }
  const key = String(value).trim().toUpperCase(); // ensure the value is a primitive string and trim it
  const e = Class[key];
  return (e instanceof Class ? e : undefined);
}

export default ofValueImpl;
