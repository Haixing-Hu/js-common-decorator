/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { ValidationResult } from '@/index';
import Gender from '../gender';
import IdentityCard from './identity-card';

export default function validatePersonGenderField(gender, { instance, displayName }) {
  const whose = (instance.name ? `${instance.name}的` : '');
  if ((gender === undefined)
      || (gender === null)
      || (gender === '')
      || (typeof gender !== 'string')) {
    return new ValidationResult(false, `请选择${whose}${displayName}`);
  }
  // 确认性别的取值正确
  if (!Gender.has(gender)) {
    return new ValidationResult(false, `${whose}${displayName}只能是“男”或“女”`);
  }
  // 检查性别和身份证号码是否匹配
  const credential = instance.credential;
  if (credential !== undefined
      && credential !== null
      && credential.type === IdentityCard.type
      && IdentityCard.isValid(credential.number)) {
    const expectedGender = IdentityCard.getGender(credential.number);
    if (gender !== expectedGender) {
      return new ValidationResult(false, `${whose}${displayName}和身份证号码不匹配`);
    }
  }
  return new ValidationResult(true);
}
