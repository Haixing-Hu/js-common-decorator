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
 * Returns the enumerator of an enumeration class which has the specified code.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {string} code
 *     The code of the enumerator to be returned. If the code is a primitive
 *     string or a `String` object, it will be trimmed.
 * @returns {undefined|Class}
 *     The enumerator of the specified enumeration class which has the specified
 *     code; or `undefined` if there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function ofCodeImpl(Class, code) {
  if (!isString(code)) {
    return undefined;
  }
  const target = String(code).trim(); // ensure the code is a primitive string and trim it
  const item = Object.keys(Class)
    .filter((key) => (Class[key] instanceof Class))
    .find((key) => Class[key]?.code === target);
  return (item ? Class[item] : undefined);
}

export default ofCodeImpl;
