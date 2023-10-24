////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isUndefinedOrNullOrEmptyString from '@haixing_hu/common-util/src/is-undefined-or-null-or-empty-string';
import { ValidationResult } from '../../../main';
import Integer from './integer';

/**
 * 校验某个对象的一个字段值是否是正确的整数，或整数的字符表示（允许前后有空格）。
 *
 * @param {String | Number} value
 *     待校验的字段值，可以是字符串类型，或者数字类型；对于其他类型，返回校验结
 *     果将报错。
 * @param {Object} options
 *     校验函数的额外参数。
 * @return {ValidationResult}
 *     返回验证结果。
 */
export default function validateIntegerField(value, options = {}) {
  if (isUndefinedOrNullOrEmptyString(value)) {
    if (!options.nullable) {
      return new ValidationResult(false, `请填写${options.displayName}`);
    } else {
      return new ValidationResult(true);
    }
  } else if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      return new ValidationResult(false, `${options.displayName}格式不正确`);
    } else {
      return new ValidationResult(true);
    }
  } else if (typeof value === 'string' && Integer.isValid(value)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${options.displayName}格式不正确`);
  }
}
