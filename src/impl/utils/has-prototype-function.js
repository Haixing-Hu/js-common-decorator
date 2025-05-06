////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Determines whether the specified prototype function exists anywhere in the
 * prototype chain of a specified class.
 *
 * This function checks the entire prototype chain, including methods inherited
 * from parent classes. It uses `Reflect.has()` which searches through the complete
 * prototype chain, unlike `Object.prototype.hasOwnProperty` which only checks
 * direct properties.
 *
 * @param {function} Class
 *     Constructor for the specified class.
 * @param {string} name
 *     The name of the specified prototype function.
 * @returns {Boolean}
 *     Returns true if the specified function exists anywhere in the prototype chain
 *     of the class, whether defined by the class itself or inherited from a parent class.
 * @see hasOwnPrototypeFunction
 *     Checks only methods defined directly on the class.
 * @author Haixing Hu
 */
function hasPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Reflect.has(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

export default hasPrototypeFunction;
