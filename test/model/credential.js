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
   * Normalizes the document type and document number of this object, that is,
   * remove leading and trailing spaces, and convert them all to uppercase letters.
   *
   * If the credential type is incorrectly set to a {@link CredentialType}
   * object, this function will modify the credential type to the value attribute
   * of the enumeration item in the {@link CredentialType} enumeration.
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
