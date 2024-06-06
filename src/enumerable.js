////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Decorates a class method to make it enumerable.
 *
 * The decorated target must be a class member. Note that class properties are
 * enumerable by default, so this decorator only makes sense for class methods.
 *
 * Usage example:
 * ```js
 * class Meal {
 *   pay() {}
 *   &#064;Enumerable
 *   eat() {}
 * }
 *
 * const dinner = new Meal();
 * for (var key in dinner) {
 *    console.log(key);   // "eat" only, not "pay"
 * }
 * ```
 *
 * @param {Function} target
 *     The constructor function of the class to which the decorated method belongs.
 * @param {String} name
 *     The name of the decorated method.
 * @param {Object} descriptor
 *     The original property descriptor of the decorated method.
 * @returns
 *     The property descriptor of the decorated method.
 * @author Haixing Hu
 */
export function Enumerable(target, name, descriptor) {
  descriptor.enumerable = true;
  return descriptor;
}

export default Enumerable;
