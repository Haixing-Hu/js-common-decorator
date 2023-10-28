////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum } from '../../src';

// @Enum([{
//   name: '男',
//   value: 'MALE',
// }, {
//   name: '女',
//   value: 'FEMALE',
// }])
// class Gender {}

@Enum
class Gender {

  @Label('男')
  static MALE;

  @Label('女')
  static FEMALE;
}

export default Gender;
