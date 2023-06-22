/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, Validator, ElementType, Nullable } from '@/index';
import validateArrayField from './rules/validate-array-field';
import validateIntegerField from './rules/validate-integer-field';

@Model
export default class ObjWithArrayField {

  @Validator(validateArrayField, { elementValidator: validateIntegerField })
  @ElementType(Number)
  @Nullable
  array = [];

  @Validator(validateArrayField, { elementValidator: validateIntegerField })
  @ElementType(Number)
  nonNullableArray = [];
}
