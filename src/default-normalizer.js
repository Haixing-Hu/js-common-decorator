/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { setFieldMetadata, normalize } from '@/impl/utils';
import { PROPERTY_NORMALIZER } from '@/normalizer';

/**
 * 修饰类字段，指定其正则化函数为该属性对象的`normalize()`函数。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @DefaultNormalizer
 *   @Type(Credential)
 *   credential = null;
 * }
 * ```
 * @param {Function} prototype
 *     目标字段所属的类的原型。
 * @param {String} field
 *     目标字段的名称。
 * @param {Object} descriptor
 *     目标字段原来的属性描述符。
 * @returns
 *     目标字段被修饰后的属性描述符。
 * @author 胡海星
 */
function DefaultNormalizer(prototype, field, descriptor) {
  const Class = prototype.constructor;
  // normalize(obj) 函数调用其自身的 obj.normalize() 进行正则化。
  setFieldMetadata(Class, field, PROPERTY_NORMALIZER, normalize);
  return descriptor;
}

export default DefaultNormalizer;
