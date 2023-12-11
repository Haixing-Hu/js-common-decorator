////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Validatable, ElementType, Nullable } from '../../src';
import validateArrayField from './rules/validate-array-field';
import validateIntegerField from './rules/validate-integer-field';

@Model
export default class ObjWithArrayField {
  @Validatable(validateArrayField, { elementValidator: validateIntegerField })
  @ElementType(Number)
  @Nullable
  array = [];

  @Validatable(validateArrayField, { elementValidator: validateIntegerField })
  @ElementType(Number)
  nonNullableArray = [];
}
