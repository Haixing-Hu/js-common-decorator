////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, ElementType, Normalizable } from '../../src';
import CredentialWithWrongNormalizer from './credential-with-wrong-normalizer';

@Model
export default class ObjWithArrayFieldsOfWrongNormalize {
  @Normalizable
  @ElementType(CredentialWithWrongNormalizer)
  credentials = [
    new CredentialWithWrongNormalizer('IDENTITY_CARD', '12345678'),
    new CredentialWithWrongNormalizer('PASSPORT', 'abcdefgh'),
  ];
}
