////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata, ensureEnumField, isNullishOrEmpty } from './impl/utils';
import { PROPERTY_VALIDATOR } from './validatable';
import ValidationResult from './model/validation-result';

/**
 * 校验某个字符串字段值是否是指定的枚举类的枚举子的值。
 *
 * @param {Object} value
 *     待校验的字段值。
 * @param {Object} options
 *     校验函数的额外参数。
 * @returns {ValidationResult}
 *     对该字段的校验结果。
 */
function validateEnumValue(value, options) {
  // console.log('options = ', options);
  let whose = '';
  if (options.instance?.name) {
    whose = `${options.instance.name}的`;
  } else if (options.parentInstance?.name) {
    whose = `${options.parentInstance.name}的`;
  }
  if (isNullishOrEmpty(value)) {
    if (options.nullable) {
      return new ValidationResult(true);
    } else {
      return new ValidationResult(false, `请选择${whose}${options.displayName}`);
    }
  } else if (options.type.hasValue(value)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${whose}${options.displayName}不受支持："${value}"`);
  }
}

/**
 * 修饰某个枚举字段，指定其校验函数为校验其字符串值是否为正确的枚举值的函数。
 *
 * 被修饰的对象必须是类的字段，且该字段类型必须是一个被`@Enum`修饰的枚举类。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @EnumValidator
 *   @Type(CredentialType)
 *   credentialType = null;
 * }
 * ```
 * @param {Function} prototype
 *     目标字段所属的类的原型。
 *     目标字段的名称。
 * @param {Object} descriptor
 *     目标字段原来的属性描述符。
 * @returns
 *     目标字段被修饰后的属性描述符。
 * @author 胡海星
 */
function EnumValidator(prototype, field, descriptor) {
  const Class = prototype.constructor;
  // 确保指定类的指定字段的类型是被@Enum修饰的枚举类
  ensureEnumField(Class, field);
  // validate() 函数调用 validateEnumValue 进行校验，并绑定枚举类构造器作为参数。
  setFieldMetadata(Class, field, PROPERTY_VALIDATOR, {
    validator: validateEnumValue,
    options: {},
  });
  return descriptor;
}

export default EnumValidator;
