////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@haixing_hu/common-util';
import { Model, Normalizable } from '../../src';
import Parent from './parent';

@Model
export default class Child extends Parent {
  @Normalizable(trimUppercaseString)
  message = '';
}
