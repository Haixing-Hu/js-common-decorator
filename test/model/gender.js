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

  static MALE = '男';

  static FEMALE = '女';
}

export default Gender;
