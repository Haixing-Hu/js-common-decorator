/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Enum } from '../../src/index';

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
