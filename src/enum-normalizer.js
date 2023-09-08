/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import trimUppercaseString from '@haixing_hu/common-util/src/trim-uppercase-string';
import { setFieldMetadata, ensureEnumField } from '@/impl/utils';
import { PROPERTY_NORMALIZER } from '@/normalizer';

/**
 * 修饰某个枚举字段，指定其正则化函数为特定的`trimUppercaseString()`函数。
 *
 * 被修饰的对象必须是类的字段，且该字段类型必须是一个被`@Enum`修饰的枚举类。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @EnumNormalizer
 *   @Type(CredentialType)
 *   credentialType = null;
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
function EnumNormalizer(prototype, field, descriptor) {
  const Class = prototype.constructor;
  // 确保指定类的指定字段的类型是被@Enum修饰的枚举类
  ensureEnumField(Class, field);
  // normalize(obj) 函数调用 trimUppercaseString() 进行正则化。
  setFieldMetadata(Class, field, PROPERTY_NORMALIZER, trimUppercaseString);
  return descriptor;
}

export default EnumNormalizer;
