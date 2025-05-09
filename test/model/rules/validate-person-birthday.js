////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import CredentialType from '../credential-type';
import IdentityCard from './identity-card';

/**
 * 日期时间的标准格式正则表达式。
 *
 * @author 胡海星
 * @private
 */
const DATE_REGEXP = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/;

export default function validatePersonBirthdayField(birthday, { instance, owner, label }) {
  const whose = (owner ? `${owner}的` : '');
  if ((birthday === undefined)
      || (birthday === null)
      || (birthday === '')
      || (typeof birthday !== 'string')) {
    return new ValidationResult(false, `请选择${whose}${label}`);
  }
  // 确认出生日期的格式正确
  if (!birthday.match(DATE_REGEXP)) {
    return new ValidationResult(false, `${whose}${label}格式不正确`);
  }
  // 检查出生日期和身份证号码是否匹配
  const credential = instance.credential;
  if ((credential !== undefined)
      && (credential !== null)
      && (credential.type === CredentialType.IDENTITY_CARD)
      && IdentityCard.isValid(credential.number)) {
    const expectedBirthday = IdentityCard.getBirthday(credential.number);
    if (birthday !== expectedBirthday) {
      return new ValidationResult(false, `${whose}${label}和身份证号码不匹配`);
    }
  }
  return new ValidationResult(true);
}
