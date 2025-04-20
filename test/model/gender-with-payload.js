////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum } from '../../src';

@Enum
class GenderWithPayload {
  static MALE = { name: '男', i18n: 'i18n.gender.male', code: '1', data: { value: 0 } };

  static FEMALE = { name: '女', i18n: 'i18n.gender.female', code: '2', data: { value: 1 } };
}

export default GenderWithPayload;
