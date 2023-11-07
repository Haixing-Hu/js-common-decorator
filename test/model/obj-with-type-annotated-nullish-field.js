////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Type } from '../../src';
import Credential from './credential';
import NonDecoratedClass from './non-decorated-class';
import Gender from './gender';

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
