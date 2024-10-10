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
 * Returns the enumerator of an enumeration class which has the specified name.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {string} name
 *     The name of the enumerator to be returned. If the name is a primitive
 *     string or a `String` object, it will be trimmed.
 * @returns {undefined|Class}
 *     The enumerator of the specified enumeration class which has the specified
 *     name; or `undefined` if there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function ofNameImpl(Class, name) {
  if (!isString(name)) {
    return undefined;
  }
  const target = String(name).trim(); // ensure the name is a primitive string and trim it
  const item = Object.keys(Class)
    .filter((key) => (Class[key] instanceof Class))
    .find((key) => Class[key]?.name === target);
  return (item ? Class[item] : undefined);
}

export default ofNameImpl;
