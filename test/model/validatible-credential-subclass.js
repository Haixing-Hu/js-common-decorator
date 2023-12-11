////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Validatable, Label } from '../../src';
import Credential from './validatible-credential';
import validateCredentialNumber from './rules/validate-credential-number';

@Model
export default class CredentialSubclass extends Credential {
  @Validatable(validateCredentialNumber)
  @Label('证件子号码')
  childNumber = '';
}
