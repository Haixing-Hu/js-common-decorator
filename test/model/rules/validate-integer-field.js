////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isUndefinedOrNullOrEmptyString } from '@haixing_hu/common-util';
import { ValidationResult } from '@haixing_hu/common-validator';
import Integer from './integer';

/**
 * Verifies whether a field value of an object is a correct integer, or a
 * character representation of an integer (spaces are allowed before and after).
 *
 * @param {string | number} value
 *     The field value to be verified can be of string type or numeric type;
 *     for other types, an error will be reported when returning the verification
 *     result.
 * @param {string} label
 *     The label of the field to be verified.
 * @param {boolean} nullable
 *     Whether the field value can be `null` or `undefined`.
 * @return {ValidationResult}
 *     The verification result.
 */
export default function validateIntegerField(value, { label, nullable }) {
  if (isUndefinedOrNullOrEmptyString(value)) {
    if (!nullable) {
      return new ValidationResult(false, `请填写${label}`);
    } else {
      return new ValidationResult(true);
    }
  } else if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      return new ValidationResult(false, `${label}格式不正确`);
    } else {
      return new ValidationResult(true);
    }
  } else if (typeof value === 'string' && Integer.isValid(value)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${label}格式不正确`);
  }
}
