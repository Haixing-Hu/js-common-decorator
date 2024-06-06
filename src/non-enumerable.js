////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Decorates a class field to make it non-enumerable.
 *
 * The decorated target must be a class member. Note that class methods are
 * non-enumerable by default, so this decorator only makes sense for class
 * properties.
 *
 * Usage example：
 * ```js
 * class Meal {
 *    entree = 'steak';
 *    &#064;NonEnumerable
 *    cost = 20.99;
 * }
 *
 * const dinner = new Meal();
 * for (var key in dinner) {
 *    console.log(key);   // "entree" only, not "cost"
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
export function NonEnumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

export default NonEnumerable;
