/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, Validator, Type, EnumValidator, DisplayName } from '@/index';
import CredentialType from './credential-type';
import validateCredentialNumber from './rules/validate-credential-number';

@Model
export default class Credential {
  @EnumValidator
  @Type(CredentialType)
  @DisplayName('证件类型')
  type = 'IDENTITY_CARD';

  @Validator(validateCredentialNumber)
  @DisplayName('证件号码')
  number = '';

  nonValidable = '';

  constructor(type = 'IDENTITY_CARD', number = '') {
    this.type = type;
    this.number = number;
  }
}
