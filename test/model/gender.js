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
}, {
  name: '女',
  value: 'FEMALE',
}])
class Gender {}

export default Gender;
