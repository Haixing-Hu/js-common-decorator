////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType, Model, Normalizable } from '../../src';
import Credential from './credential';

@Model
export default class ObjWithArrayField {
  @Normalizable
  @ElementType(Credential)
  credentials = [
    new Credential('IDENTITY_CARD', '12345678'),
    new Credential('PASSPORT', 'abcdefgh'),
  ];
}
