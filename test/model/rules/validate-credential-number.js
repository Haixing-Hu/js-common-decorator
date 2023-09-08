/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import IdentityCard from './identity-card';
import Passport from './passport';
import OfficerCard from './officer-card';
import OtherCredential from './other-credential';
import CredentialType from '../credential-type';
import { ValidationResult } from '../../../src/index';

export default function validateCredentialNumber(number, { instance, displayName, parentInstance }) {
  let credentialName = '';
  if (instance && instance.type) {
    credentialName = CredentialType.nameOfValue(instance.type) || '';
  }
  const whose = (parentInstance && parentInstance.name ? `${parentInstance.name}的` : '');
  if ((number === undefined)
      || (number === null)
      || (number === '')) {
    return new ValidationResult(false, `请输入${whose}${credentialName}${displayName}`);
  }
  // console.log('validateCredentialNumber: number = ', number, ', instance = ', instance);
  let valid = true;
  if ((instance.type === IdentityCard.type)
      && (!IdentityCard.isValid(number))) {      // 检查身份证号码是否合法
    valid = false;
  } else if ((instance.type === Passport.type)
      && (!Passport.isValid(number))) {          // 检查护照号码是否合法
    valid = false;
  } else if ((instance.type === OfficerCard.type)
      && (!OfficerCard.isValid(number))) {       // 检查军官证号码是否合法
    valid = false;
  } else if (!OtherCredential.isValid(number)) { // 检查其他证件号码是否合法
    // console.log('validateCredentialNumber: number = ', number);
    valid = false;
  }
  if (valid) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${whose}${credentialName}${displayName}格式不正确`);
  }
}
