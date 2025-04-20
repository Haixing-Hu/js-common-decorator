////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import hasPrototypeFunction from './has-prototype-function';

/**
 * Checks whether the specified class or its parent classes have a prototype
 * method with the specified name.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} func
 *     The name of the specified prototype method.
 * @throws TypeError
 *     If the specified class and its parent classes do not have a prototype
 *     method with the specified name.
 * @author Haixing Hu
 * @private
 */
export function requirePrototypeMethod(Class, func) {
  if (!hasPrototypeFunction(Class, func)) {
    throw new TypeError(`The class ${Class.name} does not implement the prototype method "${func}()".`);
  }
}

export default requirePrototypeMethod;
