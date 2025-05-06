////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Determines whether the specified prototype function is directly defined in the
 * prototype of a specified class (not inherited from parent classes).
 *
 * This function checks ONLY the methods defined directly on the class's prototype,
 * and ignores methods inherited from parent classes. It uses `Object.prototype.hasOwnProperty`
 * to ensure only "own properties" of the prototype are considered.
 *
 * @param {function} Class
 *     Constructor for the specified class.
 * @param {string} name
 *     The name of the specified prototype function.
 * @returns {Boolean}
 *     Returns true if and only if the specified function is directly defined on
 *     the prototype of the class itself (not inherited from parent classes).
 * @see hasPrototypeFunction
 *     Checks for methods anywhere in the prototype chain.
 * @author Haixing Hu
 * @private
 */
function hasOwnPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Object.prototype.hasOwnProperty.call(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

export default hasOwnPrototypeFunction;
