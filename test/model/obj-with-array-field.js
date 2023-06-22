/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, ElementType, DefaultNormalizer } from '@/index';
import Credential from './credential';

@Model
export default class ObjWithArrayField {

  @DefaultNormalizer
  @ElementType(Credential)
  credentials = [
    new Credential('IDENTITY_CARD', '12345678'),
    new Credential('PASSPORT', 'abcdefgh'),
  ];
}
