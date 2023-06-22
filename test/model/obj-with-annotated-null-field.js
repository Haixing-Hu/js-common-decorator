/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, Type } from '@/index';
import Credential from './credential';
import NonDecoratedClass from './non-decorated-class';
import Gender from './gender';

@Model
export default class ObjWithAnnotatedNullField {
  id = '';

  @Type(Credential)
  credential = null;

  nonAnnotatedCredential = null;

  @Type(NonDecoratedClass)
  nonDecoratedClass = null;

  @Type(Gender)
  genderWithDefaultEmpty = '';

  @Type(Gender)
  genderWithDefaultNull = null;
}
