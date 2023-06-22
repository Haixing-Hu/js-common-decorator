/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { Enum } from '@/index';

@Enum([{
  name: '男',
  value: 'MALE',
  code: 0,
  data: {
    value: 0,
  },
}, {
  name: '女',
  value: 'FEMALE',
  code: 1,
  data: {
    value: 1,
  },
}])
class GenderWithCodeData {}

export default GenderWithCodeData;
