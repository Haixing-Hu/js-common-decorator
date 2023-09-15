/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { ValidationResult } from '../../../main';
import Name from './name';

export default function validatePersonName(name, { displayName }) {
  if (name === undefined
      || name === null
      || (typeof name !== 'string')
      || name.trim() === '') {
    return new ValidationResult(false, `请输入${displayName}`);
  }
  if (Name.isValid(name)) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${displayName}格式不正确`);
  }
}
