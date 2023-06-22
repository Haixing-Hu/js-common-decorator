/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { setFieldMetadata } from '@/impl/utils';

/**
 * 被`@{@link Validator}`修饰的字段的元信息属性名。
 *
 * @private
 */
const PROPERTY_VALIDATOR = 'validator';

/**
 * 修饰类字段，为其指定校验函数。
 *
 * 被修饰的对象必须是类的字段。
 *
 * 使用示例：
 * ```js
 * class Foo {
 *   @Validator(validateNameField)
 *   @DisplayName('名称')
 *   name = '';
 *
 *   @Validator(validateIntegerField)
 *   @DisplayName('编码')
 *   number = 0;
 *
 *   @Validator(validateArrayField, { elementValidator: validateIntegerField })
 *   @DisplayName('编号序列')
 *   @ElementType(Number)
 *   series = [12, 13, 14];
 * }
 * ```
 * 上述例子中的校验函数大致实现如下：
 * ```js
 * function validateNameField(value, options) {
 *   if (NAME_PATTERN.test(value)) {
 *     return new ValidationResult(true);
 *   } else {
 *     return new ValidationResult(false, `请输入正确的${options.displayName}`);
 *   }
 * }
 *
 * function validateIntegerField(value, options) {
 *   if ((typeof value === 'number') && Number.isInteger(value)) {
 *     return new ValidationResult(true);
 *   } else if ((typeof value === 'string') && /^\s*[+-]?\d+\s*$/.test(value)) {
 *     return new ValidationResult(true);
 *   }
 *   return new ValidationResult(false, `${options.displayName}必须是整数`);
 * }
 * ```
 *
 * 此装饰器的参数为一个校验函数，它应该具有如下形式：
 * ```js
 * function validate(value, options) {
 *   // TODO
 *   return new ValidationResult(true);
 * }
 * ```
 * 其中
 * - 参数`value`是待校验的字段值；
 * - 参数`options`是一个`Object`，其至少包含以下属性：
 *     - `options.instance`：待校验的字段所属的对象；
 *     - `options.parentInstance`：可选，表示待校验的字段所属的对象的父对象；
 *     - `options.type`：待校验的字段所属的类型，若该字段被`@{@link Type}`
 *       装饰器所装饰，此属性为该装饰器的参数，否则为`undefined`；
 *     - `options.field`：待校验的字段名称；
 *     - `options.displayName`：待校验的字段的显示名称，若该字段被`@{@link DisplayName}`
 *       装饰器所装饰，此属性为该装饰器的参数，否则为`options.field`；
 *     - `options.nullable`：待校验的字段是否可以为空，若该字段被`@{@link Nullable}`
 *       装饰器所装饰，此属性为`true`，否则为`false`；
 *     - 其他通过装饰器的第二个参数`options`传递的参数。
 * - 该函数的返回值必须是一个`{@link ValidationResult}`对象，表示校验结果。
 *
 * @param {Function} validator
 *     被修饰的字段所指定的校验函数，其参数形式如前所属。
 * @param {Object} options
 *     传递给校验函数的额外参数构成的对象，其属性值将会被合并到校验函数的第二个
 *     参数中传递给校验函数。
 * @param {Function} prototype
 *     目标字段所属的类的原型。
 * @param {String} field
 *     目标字段的名称。
 * @param {Object} descriptor
 *     目标字段原来的属性描述符。
 * @returns
 *     目标字段被修饰后的属性描述符。
 * @author 胡海星
 * @see DisplayName
 * @see Model
 */
function Validator(validator, options = {}) {
  return function decorate(prototype, field, descriptor) {
    const Class = prototype.constructor;
    if (typeof validator !== 'function') {
      throw new TypeError(`The validator of the field "${Class.name}.${field}" must be a function.`);
    }
    setFieldMetadata(Class, field, PROPERTY_VALIDATOR, {
      validator,
      options,
    });
    return descriptor;
  };
}

export {
  PROPERTY_VALIDATOR,
  Validator,
};
