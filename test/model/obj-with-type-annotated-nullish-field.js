////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Type } from '../../src';
import Credential from './credential';
import Gender from './gender';
import NonDecoratedClass from './non-decorated-class';

@Model
export default class ObjWithTypeAnnotatedNullishField {
  id = '';

  @Type(Credential)
  credential = null;

  @Type(Credential)
  undefinedCredential;

  nonAnnotatedCredential = null;

  @Type(NonDecoratedClass)
  nonDecoratedClass = null;

  @Type(Gender)
  genderWithDefaultEmpty = '';

  @Type(Gender)
  genderWithDefaultNull = null;
}
