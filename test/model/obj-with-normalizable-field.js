/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { trimUppercaseString } from '@haixing_hu/common-util';
import { Model, Type, Normalizer, EnumNormalizer, DefaultNormalizer } from '@/index';
import Credential from './normalizable-credential';
import CredentialType from './credential-type';
import { ElementType } from '../../src';

@Model
export default class ObjWithNormalizableField {

  @EnumNormalizer
  @Type(CredentialType)
  type = null;

  @Normalizer(trimUppercaseString)
  number = '';

  nonNormalizable = '';

  @Normalizer(trimUppercaseString)
  @ElementType(String)
  array = null;

  @DefaultNormalizer
  @Type(Credential)
  credential = null;
}
