/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { getDefaultValue, setFieldMetadata } from '@/impl/utils';

const PROPERTY_ELEMENT_TYPE = 'element_type';

/**
 * 修饰类字段，将其标记为元素类型为指定的类的数组。
 *
 * 被修饰的对象必须是类的字段，且如果其默认不为null或undefined，则必须是一个数组。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   &#064;ElementType(ItemType)
 *   items = [];
 * }
 * ```
 * @param {Function} type
 *     被修饰的数组字段的元素所属类的原型。
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
function ElementType(type) {
  return function decorate(prototype, field, descriptor) {
    const defaultValue = getDefaultValue(descriptor);
    const Class = prototype.constructor;
    if (defaultValue !== null && !Array.isArray(defaultValue)) {
      throw new SyntaxError(`The field "${Class.name}.${field}" decorated by @ElementType must be an array type field.`);
    }
    setFieldMetadata(Class, field, PROPERTY_ELEMENT_TYPE, type);
    return descriptor;
  };
}

export {
  PROPERTY_ELEMENT_TYPE,
  ElementType,
};
