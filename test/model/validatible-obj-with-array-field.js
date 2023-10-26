////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Validator, ElementType, Nullable } from '../../main';
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
