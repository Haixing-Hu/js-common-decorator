////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Type } from '../../src';
import ObjWithPersonField from './ObjWithPersonField';

@Model
class ChildObject {
  @Type(String)
  firstChildField = '';

  @Type(ObjWithPersonField)
  secondChildField = null;
}

export default ChildObject;
