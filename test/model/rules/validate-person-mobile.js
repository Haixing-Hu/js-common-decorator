////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '../../../src';
import { isNullishOrEmpty } from '../../../src/impl/utils';
import Mobile from './mobile';

export default function validatePersonMobile(mobile, { instance, displayName, nullable }) {
  const whose = (instance.name ? `${instance.name}的` : '');
  if (isNullishOrEmpty(mobile)) {
    if (nullable) {
      return new ValidationResult(true);
    } else {
      return new ValidationResult(false, `请输入${whose}${displayName}`);
    }
  } else if (Mobile.isValid(mobile)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${whose}${displayName}格式不正确`);
  }
}
