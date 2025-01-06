////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { Model, Type, Normalizable, ElementType } from '../../src';
import Credential from './normalizable-credential';
import CredentialType from './credential-type';

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
