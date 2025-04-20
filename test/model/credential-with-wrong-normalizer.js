////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { Model } from '../../src';

@Model
export default class CredentialWithWrongNormalizer {
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
   * NOTE: this normalize() function returns nothing, which is an error. But the
   * robust implementation of `Class.prototype.normalize()` should work well.
   */
  normalize() {
    if (typeof this.type === 'string') {
      this.type = trimUppercaseString(this.type);
    } else if (this.type.value !== undefined) {
      this.type = trimUppercaseString(this.type.value);
    }
    this.number = trimUppercaseString(this.number);
    // It should return this, but it returns nothing, which is an error.
  }
}
