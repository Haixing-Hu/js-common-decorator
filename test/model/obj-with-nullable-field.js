////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Nullable } from '../../src';

@Model
class ObjWithNullableField {
  @Nullable
  nullableField = null;

  nonNullableField = 'abc';

  @Nullable
  nullableWithDefaultValue = 'abc';ß
}

export default ObjWithNullableField;
