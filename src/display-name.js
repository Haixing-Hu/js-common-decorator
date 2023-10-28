////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { PROPERTY_DISPLAY_NAME } from './impl/constants';

/**
 * 修饰类字段，为其指定显示名称。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @Validator(nameValidator)
 *   @DisplayName('名称')
 *   name = '';
 *
 *   @Validator(integerValidator)
 *   @DisplayName('编码')
 *   number = 0;
 * }
 * ```
 *
 * @param {String} displayName
 *     被修饰的字段所指定的显示名称。
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
function DisplayName(displayName) {
  return function decorate(prototype, field, descriptor) {
    const Class = prototype.constructor;
    if (typeof displayName !== 'string') {
      throw new TypeError(`The display name of the field "${Class.name}.${field}" must be a string.`);
    }
    // 将被修饰属性的正则化函数记录在其所属类的所属字段的元信息的 name 属性中
    setFieldMetadata(Class, field, PROPERTY_DISPLAY_NAME, displayName);
    return descriptor;
  };
}

export default DisplayName;
