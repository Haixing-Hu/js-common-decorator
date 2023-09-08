/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { setClassMetadata } from '@/impl/utils';

/**
 * 被`@{@link NameField}`修饰的字段的元信息属性名。
 *
 * @private
 */
const PROPERTY_NAME_FIELD = 'name_field';

/**
 * 修饰类字段，指定其为该对象的"名称"。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @Validator(nameValidator)
 *   @DisplayName('姓名')
 *   @NameField
 *   name = '';
 *
 *   @EnumValidator
 *   @DisplayName('性别')
 *   @Type(Gender)
 *   @Nullable
 *   gender = null;
 *
 *   @Validator(validatePersonBirthday)
 *   @DisplayName('出生日期')
 *   @Nullable
 *   brithday = '';
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
function NameField(prototype, field, descriptor) {
  const Class = prototype.constructor;
  // 将“名称”字段的名字记录在被修饰字段所属类的元信息内
  setClassMetadata(Class, PROPERTY_NAME_FIELD, field);
  return descriptor;
}

export {
  PROPERTY_NAME_FIELD,
  NameField,
};
