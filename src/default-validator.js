////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata, isNull } from './impl/utils';
import { PROPERTY_VALIDATOR } from './validator';
import ValidationResult from './models/ValidationResult';

function defaultValidate(value, options) {
  if (isNull(value)) {
    if (options.nullable === true) {
      return new ValidationResult(true);
    } else {
      const whose = (options.instance?.name ? `${options.instance.name}的` : '');
      return new ValidationResult(false, `${whose}${options.displayName}不能为空`);
    }
  } else if ((typeof value === 'object') && (typeof value.validate === 'function')) {
    // 调用该字段值本身的validate()方法，将当前对象作为其父对象实例，以额外选项的形式传递
    return value.validate('*', { parentInstance: options.instance });
  }
  return new ValidationResult(true);
}

/**
 * 修饰类字段，指定其校验函数为该属性对象的`validate()`函数。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @DefaultValidator
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
function DefaultValidator(prototype, field, descriptor) {
  const Class = prototype.constructor;
  // validate(obj) 函数调用其自身的 obj.validate() 进行校验。
  setFieldMetadata(Class, field, PROPERTY_VALIDATOR, {
    validator: defaultValidate,
    options: {},
  });
  return descriptor;
}

export default DefaultValidator;
