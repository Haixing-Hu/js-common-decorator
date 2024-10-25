////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * Determine whether the prototype of a specified class has the specified
 * prototype function.
 *
 * Note that the function may be inherited from its parent class.
 *
 * @param {function} Class
 *     Constructor for the specified class.
 * @param {string} name
 *     The name of the specified prototype function.
 * @returns {Boolean}
 *     Whether the prototype of the specified class has the specified prototype
 *     function. Note that the function may be inherited from its parent class.
 * @see hasOwnPrototypeFunction
 * @author Haixing Hu
 * @private
 */
function hasPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Reflect.has(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

export default hasPrototypeFunction;
