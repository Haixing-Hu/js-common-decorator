////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@haixing_hu/common-validation-rule';
import { isNullishOrEmpty } from '../../../src/impl/utils';
import Email from './email';

export default function validatePersonEmail(email, { owner, label, nullable }) {
  const whose = (owner ? `${owner}的` : '');
  if (isNullishOrEmpty(email)) {
    if (nullable) {
      return new ValidationResult(true);
    } else {
      return new ValidationResult(false, `请输入${whose}${label}`);
    }
  } else if (Email.isValid(email)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${whose}${label}格式不正确`);
  }
}
