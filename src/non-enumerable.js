/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * 修饰目标对象，将其设置为不可枚举的。
 *
 * 被修饰的对象必须是类成员。注意类方法本身就是不可枚举的，所以此修饰符只对类属性
 * 有意义。
 *
 * 使用示例：
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
 *     目标对象所属的类的原型。
 * @param {String} name
 *     目标对象的名称。
 * @param {Object} descriptor
 *     目标对象原来的属性描述符。
 * @returns
 *     目标对象被修饰后的属性描述符。
 * @author 胡海星
 */
export function NonEnumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

export default NonEnumerable;
