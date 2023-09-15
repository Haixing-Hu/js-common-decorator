/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import trimUppercaseString from '@haixing_hu/common-util/src/trim-uppercase-string';
import { Model, Type, Normalizer, DefaultNormalizer, EnumNormalizer } from '../../main';
import Credential from './credential';
import CredentialType from './credential-type';
import NonDecoratedClass from './non-decorated-class';

@Model
export default class ObjWithNormalizableField {

  @Normalizer(trimUppercaseString)
  number = '';

  @EnumNormalizer
  @Type(CredentialType)
  type = null;

  nonNormalizable = '';

  @DefaultNormalizer
  @Type(Credential)
  credential = null;

  @DefaultNormalizer
  @Type(NonDecoratedClass)
  noNormalizeField = null;

  @DefaultNormalizer
  credentialDefaultNonNull = new Credential();
}
