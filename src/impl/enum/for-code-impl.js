////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the enumerator of an enumeration class which has the specified code.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {string} code
 *     The code of the enumerator to be returned.
 * @returns {undefined|Class}
 *     The enumerator of the specified enumeration class which has the specified
 *     code; or `undefined` if there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function forCodeImpl(Class, code) {
  if ((code === undefined) || (code === null) || (typeof code !== 'string')) {
    return undefined;
  }
  const item = Object.keys(Class)
    .filter((key) => (Class[key] instanceof Class))
    .find((key) => Class[key]?.code === code);
  return (item ? Class[item] : undefined);
}

export default forCodeImpl;
