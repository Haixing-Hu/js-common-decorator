////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the enumerator of an enumeration class which has the specified value.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {string} value
 *     The value of the enumerator to be returned.
 * @returns {undefined|Class}
 *     The enumerator of the specified enumeration class which has the specified
 *     value; or `undefined` if there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function valueOfImpl(Class, value) {
  if ((value === undefined) || (value === null) || (typeof value !== 'string')) {
    return undefined;
  }
  const e = Class[value];
  return (e instanceof Class ? e : undefined);
}

export default valueOfImpl;
