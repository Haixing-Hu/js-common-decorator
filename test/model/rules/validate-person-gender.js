////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '../../../src';
import CredentialType from '../credential-type';
import Gender from '../gender';
import IdentityCard from './identity-card';

export default function validatePersonGenderField(value, { instance, owner, label }) {
  const whose = (owner ? `${owner}的` : '');
  if ((value === undefined)
      || (value === null)
      || (value === '')) {
    return new ValidationResult(false, `请选择${whose}${label}`);
  }
  // 确认性别的取值正确
  const gender = Gender.of(value);
  if (gender === undefined) {
    return new ValidationResult(false, `${whose}${label}只能是“男”或“女”`);
  }
  // 检查性别和身份证号码是否匹配
  const credential = instance.credential;
  if ((credential !== undefined)
      && (credential !== null)
      && (credential.type === CredentialType.IDENTITY_CARD)
      && IdentityCard.isValid(credential.number)) {
    const expectedGender = IdentityCard.getGender(credential.number);
    if (gender !== expectedGender) {
      return new ValidationResult(false, `${whose}${label}和身份证号码不匹配`);
    }
  }
  return new ValidationResult(true);
}
