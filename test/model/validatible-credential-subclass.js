////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Label, Model, Validatable } from '../../src';
import validateCredentialNumber from './rules/validate-credential-number';
import Credential from './validatible-credential';

@Model
export default class CredentialSubclass extends Credential {
  @Validatable(validateCredentialNumber)
  @Label('证件子号码')
  childNumber = '';
}
