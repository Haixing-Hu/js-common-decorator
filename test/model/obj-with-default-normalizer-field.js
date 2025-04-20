////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { Model, Normalizable, Type } from '../../src';
import Credential from './credential';
import CredentialType from './credential-type';
import NonDecoratedClass from './non-decorated-class';

@Model
export default class ObjWithNormalizableField {
  @Normalizable(trimUppercaseString)
  number = '';

  @Normalizable
  @Type(CredentialType)
  type = null;

  nonNormalizable = '';

  @Normalizable
  @Type(Credential)
  credential = null;

  @Normalizable
  @Type(NonDecoratedClass)
  noNormalizeField = null;

  @Normalizable
  credentialDefaultNonNull = new Credential();
}
