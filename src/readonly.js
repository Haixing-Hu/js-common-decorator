////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Decorates a class field to mark it as read-only.
 *
 * The decorated object must be a class member, which can be a class property or
 * a class method.
 *
 * Usage example:
 * ```js
 * Class Meal {
 *   &#064;Readonly
 *   entree = 'steak';
 * }
 *
 * const dinner = new Meal();
 * dinner.entree = 'salmon';
 * // Cannot assign to read only property 'entree' of [object Object]
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
export function Readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

export default Readonly;
