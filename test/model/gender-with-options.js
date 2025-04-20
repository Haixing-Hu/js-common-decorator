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
class GenderWithOptions {
  static MALE = { name: '男', i18n: 'i18n.gender.male' };

  static FEMALE = { name: '女', i18n: 'i18n.gender.female' };
}

export default GenderWithOptions;
