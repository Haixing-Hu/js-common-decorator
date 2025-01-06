////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { Model, Type, Normalizable } from '../../src';
import CredentialType from './credential-type';

@Model
export default class Credential {
  @Normalizable
  @Type(CredentialType)
  type = CredentialType.IDENTITY_CARD;

  @Normalizable(trimUppercaseString)
  number = '';

  constructor(type = CredentialType.IDENTITY_CARD, number = '') {
    this.type = type;
    this.number = number;
  }
}
