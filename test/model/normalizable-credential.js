////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import trimUppercaseString from '@haixing_hu/common-util/src/trim-uppercase-string';
import { Model, Type, EnumNormalizer, Normalizer } from '../../main';
import CredentialType from './credential-type';

@Model
export default class Credential {

  @EnumNormalizer
  @Type(CredentialType)
  type = 'IDENTITY_CARD';

  @Normalizer(trimUppercaseString)
  number = '';

  constructor(type = 'IDENTITY_CARD', number = '') {
    this.type = type;
    this.number = number;
  }
}
