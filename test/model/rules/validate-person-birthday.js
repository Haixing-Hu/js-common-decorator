////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '../../../src';
import IdentityCard from './identity-card';

/**
 * 日期时间的标准格式正则表达式。
 *
 * @author 胡海星
 * @private
 */
const DATE_REGEXP = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/;

export default function validatePersonBirthdayField(birthday, { instance, displayName }) {
  const whose = (instance.name ? `${instance.name}的` : '');
  if ((birthday === undefined)
      || (birthday === null)
      || (birthday === '')
      || (typeof birthday !== 'string')) {
    return new ValidationResult(false, `请选择${whose}${displayName}`);
  }
  // 确认出生日期的格式正确
  if (!birthday.match(DATE_REGEXP)) {
    return new ValidationResult(false, `${whose}${displayName}格式不正确`);
  }
  // 检查出生日期和身份证号码是否匹配
  const credential = instance.credential;
  if (credential !== undefined
      && credential !== null
      && credential.type === IdentityCard.type
      && IdentityCard.isValid(credential.number)) {
    const expectedBirthday = IdentityCard.getBirthday(credential.number);
    if (birthday !== expectedBirthday) {
      return new ValidationResult(false, `${whose}${displayName}和身份证号码不匹配`);
    }
  }
  return new ValidationResult(true);
}
