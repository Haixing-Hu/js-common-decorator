////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { ElementType, Model, Normalizable, Type } from '../../src';
import CredentialType from './credential-type';
import Credential from './normalizable-credential';

@Model
export default class ObjWithNormalizableField {
  @Normalizable
  @Type(CredentialType)
  type = null;

  @Normalizable(trimUppercaseString)
  number = '';

  nonNormalizable = '';

  @Normalizable(trimUppercaseString)
  @ElementType(String)
  array = null;

  @Normalizable
  @Type(Credential)
  credential = null;
}
