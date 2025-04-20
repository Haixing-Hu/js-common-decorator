////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType, Model } from '../../src';
import Credential from './credential';
import Gender from './gender';
import NonDecoratedClass from './non-decorated-class';

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
