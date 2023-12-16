////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the enumerator of an enumeration class which has the specified name.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {string} name
 *     The name of the enumerator to be returned.
 * @returns {undefined|Class}
 *     The enumerator of the specified enumeration class which has the specified
 *     name; or `undefined` if there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function ofNameImpl(Class, name) {
  if ((name === undefined) || (name === null) || (typeof name !== 'string')) {
    return undefined;
  }
  const item = Object.keys(Class)
    .filter((key) => (Class[key] instanceof Class))
    .find((key) => Class[key]?.name === name);
  return (item ? Class[item] : undefined);
}

export default ofNameImpl;
