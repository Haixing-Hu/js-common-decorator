/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * 修饰目标对象，将其设置为只读。
 *
 * 被修饰的对象必须是类成员，可以是类属性或类方法。
 *
 * 使用示例：
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
 *     目标对象所属的类的原型。
 * @param {String} name
 *     目标对象的名称。
 * @param {Object} descriptor
 *     目标对象原来的属性描述符。
 * @returns
 *     目标对象被修饰后的属性描述符。
 * @author 胡海星
 */
export function Readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

export default Readonly;
