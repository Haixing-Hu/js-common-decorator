////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isUndefinedOrNullOrEmptyArray } from '@qubit-ltd/common-util';
import { ValidationResult } from '@qubit-ltd/common-validation-rule';

/**
 * 校验某个对象的一个数组类型的字段值中每个元素是否合法。
 *
 * @param {Array} value
 *     待校验的字段值，必须是数组类型；对于其他类型，返回校验结果将报错。
 * @param {Object} options
 *     校验函数的额外参数。
 * @return {ValidationResult}
 *     返回验证结果。
 */
export default function validateArrayField(value, options) {
  if (!options.elementValidator) {
    throw new TypeError(`Must specify the element validator for the field "${options.field}".`);
  }
  if (typeof options.elementValidator !== 'function') {
    throw new TypeError(`The element validator for the field "${options.field}" must be a function.`);
  }
  if (isUndefinedOrNullOrEmptyArray(value)) {
    if (!options.nullable) {
      return new ValidationResult(false, `请填写或选择${options.displayName}`);
    } else {
      return new ValidationResult(true);
    }
  } else if (Array.isArray(value)) {
    const results = [];
    for (let i = 0; i < value.length; ++i) {
      const r = options.elementValidator(value[i], options);
      results.push(r);
    }
    return ValidationResult.merge(results);
  } else {
    return new ValidationResult(false, `请填写或选择正确的${options.displayName}`);
  }
}
