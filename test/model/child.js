/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { trimUppercaseString } from '@haixing_hu/common-util';
import { Model, Normalizer } from '@/index';
import Parent from './parent';

@Model
export default class Child extends Parent {

  @Normalizer(trimUppercaseString)
  message = '';
}
