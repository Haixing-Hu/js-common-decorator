////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@haixing_hu/common-validation-rule';
import Name from './name';

export default function validatePersonName(name, { label }) {
  if ((name === undefined)
      || (name === null)
      || (typeof name !== 'string')
      || (name.trim() === '')) {
    return new ValidationResult(false, `请输入${label}`);
  }
  if (Name.isValid(name)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${label}格式不正确`);
  }
}
