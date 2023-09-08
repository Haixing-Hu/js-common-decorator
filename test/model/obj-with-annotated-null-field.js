/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, Type } from '../../src/index';
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
