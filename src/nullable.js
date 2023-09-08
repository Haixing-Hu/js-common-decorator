/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { setFieldMetadata } from './impl/utils';
import { PROPERTY_NULLABLE } from './impl/constants';

/**
 * 修饰类字段，指定其可以为`null`。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Employee {
 *   @Validator(nameValidator)
 *   @DisplayName('姓名')
 *   name = '';
 *
 *   @Validator(integerValidator)
 *   @DisplayName('级别')
 *   @Nullable
 *   level = 0;
 * }
 * ```
 *
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
function Nullable(prototype, field, descriptor) {
  const Class = prototype.constructor;
  setFieldMetadata(Class, field, PROPERTY_NULLABLE, true);
  return descriptor;
}

export {
  PROPERTY_NULLABLE,
  Nullable,
};
