/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { setFieldMetadata } from '@/impl/utils';

/**
 * 被`@{@link Normalizer}`修饰的字段的元信息属性名。
 *
 * @private
 */
const PROPERTY_NORMALIZER = 'normalizer';

/**
 * 修饰类字段，为其指定正则化函数。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @Normalizer(trimUppercaseString)
 *   number = '';
 * }
 * ```
 *
 * 此装饰器的参数为一个正则化函数，它应该具有如下形式：
 * ```js
 * function normalize(value) {
 *   // TODO
 *   return result;
 * }
 * ```
 * 其中
 * - 参数`value`是待正则化的字段值；
 * - 该函数的返回值是对输入参数正则化的结果，其类型取决于被修饰的字段的类型。
 *
 * @param {Function} normalizer
 *     被修饰的属性所指定的正则化函数。
 * @param {Function} prototype
 *     目标属性所属的类的原型。
 * @param {String} field
 *     目标属性的名称。
 * @param {Object} descriptor
 *     目标属性原来的属性描述符。
 * @returns
 *     目标属性被修饰后的属性描述符。
 * @author 胡海星
 */
function Normalizer(normalizer) {
  return function decorate(prototype, field, descriptor) {
    const Class = prototype.constructor;
    if (typeof normalizer !== 'function') {
      throw new TypeError(`The normalizer of the field "${Class.name}.${field}" must be a function.`);
    }
    setFieldMetadata(Class, field, PROPERTY_NORMALIZER, normalizer);
    return descriptor;
  };
}

export {
  PROPERTY_NORMALIZER,
  Normalizer,
};
