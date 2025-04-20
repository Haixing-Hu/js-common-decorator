////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Type } from '../../src';
import ChildObj from './child-obj';

@Model
class ObjWithNamingConversion {
  @Type(String)
  firstField = '';

  @Type(ChildObj)
  secondField = null;
}

export default ObjWithNamingConversion;
