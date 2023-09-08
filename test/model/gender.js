/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
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
