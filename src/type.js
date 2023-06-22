/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { setFieldMetadata } from '@/impl/utils';

/**
 * 被`@{@link Type}`修饰的字段的元信息属性名。
 *
 * @private
 */
const PROPERTY_TYPE = 'type';

/**
 * 修饰类字段，将其类型标记为指定的类。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @Type(ItemType)
 *   item = null;
 * }
 * ```
 * @param {Function} type
 *     被修饰的字段所属类的原型。
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
function Type(type) {
  return function decorate(prototype, field, descriptor) {
    const Class = prototype.constructor;
    setFieldMetadata(Class, field, PROPERTY_TYPE, type);
    return descriptor;
  };
}

export {
  PROPERTY_TYPE,
  Type,
};
