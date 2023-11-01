////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the array of all enumerators of an enumeration class.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @return {array<Class>}
 *     The array of all enumerators of the specified enumeration class.
 * @author Haixing Hu
 * @private
 */
function valuesImpl(Class) {
  return Object.keys(Class)
    .filter((key) => (Class[key] instanceof Class))
    .map((key) => Class[key]);
}

export default valuesImpl;
