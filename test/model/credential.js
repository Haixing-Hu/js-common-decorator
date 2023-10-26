////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@haixing_hu/common-util';
import { Model } from '../../src';

@Model
export default class Credential {
  type = 'IDENTITY_CARD';

  number = '';

  constructor(type = 'IDENTITY_CARD', number = '') {
    this.type = type;
    this.number = number;
  }

  isIdentityCard() {
    return (this.type === 'IDENTITY_CARD');
  }

  /**
   * 将此对象的证件类型和证件号码正则化，即去除头尾空格，全部转换为大写字母。
   *
   * 如果证件类型错误的设置为{@link CredentialType}对象，此函数会将证件类型修改为
   * {@link CredentialType}对象中的枚举项的value属性值。
   */
  normalize() {
    if (typeof this.type === 'string') {
      this.type = trimUppercaseString(this.type);
    } else if (this.type.value !== undefined) {
      this.type = trimUppercaseString(this.type.value);
    }
    this.number = trimUppercaseString(this.number);
  }
}
