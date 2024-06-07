////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Type } from '../../src';
import Person from './person';

@Model
class ObjWithPersonField {
  @Type(Person)
  thePerson = null;
}

export default ObjWithPersonField;
