////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Validatable, Type, Label, NonEmpty } from '../../src';
import CredentialType from './credential-type';
import validateCredentialNumber from './rules/validate-credential-number';

@Model
export default class Credential {
  @Validatable
  @Type(CredentialType)
  @Label('证件类型')
  @NonEmpty
  type = CredentialType.IDENTITY_CARD;

  @Validatable(validateCredentialNumber)
  @Label('证件号码')
  @NonEmpty
  number = '';

  nonValidatable = '';

  constructor(type = CredentialType.IDENTITY_CARD, number = '') {
    this.type = type;
    this.number = number;
  }
}
