////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * Determines whether the specified prototype function is defined in the
 * prototype of a specified class.
 *
 * @param {function} Class
 *     Constructor for the specified class.
 * @param {string} name
 *     The name of the specified prototype function.
 * @returns {Boolean}
 *     Whether the specified prototype function is defined in the prototype of
 *     the specified class.
 * @see hasPrototypeFunction
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
