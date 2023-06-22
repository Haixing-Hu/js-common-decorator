/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, ElementType } from '@/index';
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

  @ElementType(String)
  stringArray = [];

  @ElementType(Number)
  numberArray = [];
}
