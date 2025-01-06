////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import IdentityCard from './identity-card';
import CredentialType from '../credential-type';
import Passport from './passport';
import OfficerCard from './officer-card';
import OtherCredential from './other-credential';

export default function validateCredentialNumber(number, { instance, label, owner }) {
  const credentialType = instance?.type?.name || '';
  const whose = (owner ? `${owner}的` : '');
  if ((number === undefined)
      || (number === null)
      || (number === '')) {
    return new ValidationResult(false, `请输入${whose}${credentialType}${label}`);
  }
  let valid;
  switch (instance.type) {
    case CredentialType.IDENTITY_CARD:
      valid = IdentityCard.isValid(number);
      break;
    case CredentialType.PASSPORT:
      valid = Passport.isValid(number);
      break;
    case CredentialType.OFFICER_CARD:
      valid = OfficerCard.isValid(number);
      break;
    default:
      valid = OtherCredential.isValid(number);
      break;
  }
  if (valid) {
    return new ValidationResult(true);
  } else {
    return new ValidationResult(false, `${whose}${credentialType}${label}格式不正确`);
  }
}
