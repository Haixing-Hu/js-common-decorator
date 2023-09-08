/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * 修饰目标对象，将其设置为可枚举的。
 *
 * 被修饰的对象必须是类成员。注意类属性本身就是可枚举的，所以此修饰符只对类方法
 * 有意义。
 *
 * 使用示例：
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
 *     目标对象所属的类的原型。
 * @param {String} name
 *     目标对象的名称。
 * @param {Object} descriptor
 *     目标对象原来的属性描述符。
 * @returns
 *     目标对象被修饰后的属性描述符。
 * @author 胡海星
 */
export function Enumerable(target, name, descriptor) {
  descriptor.enumerable = true;
  return descriptor;
}

export default Enumerable;
