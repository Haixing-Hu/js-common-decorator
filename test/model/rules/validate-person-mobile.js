////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import isNullishOrEmpty from '../../../src/impl/utils/is-nullish-or-empty';
import Mobile from './mobile';

export default function validatePersonMobile(mobile, { owner, label, nullable }) {
  const whose = (owner ? `${owner}的` : '');
  if (isNullishOrEmpty(mobile)) {
    if (nullable) {
      return new ValidationResult(true);
    } else {
      return new ValidationResult(false, `请输入${whose}${label}`);
    }
  } else if (Mobile.isValid(mobile)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${whose}${label}格式不正确`);
  }
}
