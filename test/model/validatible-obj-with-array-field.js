////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType, Model, NonEmpty, Nullable, Validatable } from '../../src';
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
