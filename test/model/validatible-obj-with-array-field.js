////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Validatable, ElementType, Nullable, NonEmpty } from '../../src';
import validateIntegerField from './rules/validate-integer-field';

@Model
export default class ObjWithArrayField {
  @Validatable(validateIntegerField)
  @ElementType(Number)
  @Nullable
  array = [];

  @Validatable(validateIntegerField)
  @ElementType(Number)
  @NonEmpty
  nonEmptyArray = [];
}
