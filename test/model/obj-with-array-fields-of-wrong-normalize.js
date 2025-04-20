////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType, Model, Normalizable } from '../../src';
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
