/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { trimUppercaseString } from '@haixing_hu/common-util';
import { Model, Type, EnumNormalizer, Normalizer } from '@/index';
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
