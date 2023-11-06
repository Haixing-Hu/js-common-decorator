////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, ElementType } from '../../src';
import Credential from './credential';
import NonDecoratedClass from './non-decorated-class';
import Gender from './gender';

@Model
export default class ObjWithArrayMember {
  id = '';

  @ElementType(Credential)
  credentials = [];

  noTypeCredentials = [];

  @ElementType(NonDecoratedClass)
  nonDecoratedClassArray = [];

  assignedToNonArray = [];

  @ElementType(Gender)
  genders = [];

  @ElementType(Credential)
  credentialsArrayDefaultNull = null;

  @ElementType(Credential)
  credentialsArrayDefaultUndefined;

  @ElementType(String)
  stringArray = [];

  @ElementType(Number)
  numberArray = [];
}
