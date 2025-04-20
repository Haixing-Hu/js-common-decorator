////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { Model, Type } from '../../src';
import CredentialType from './credential-type';

@Model
export default class Credential {
  @Type(CredentialType)
  type = CredentialType.DEFAULT;

  number = '';

  constructor(type = CredentialType.DEFAULT, number = '') {
    this.type = type;
    this.number = number;
  }

  isIdentityCard() {
    return (this.type === CredentialType.IDENTITY_CARD);
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
    if (this.type !== undefined && this.type !== null) {
      if (typeof this.type === 'string') {
        this.type = CredentialType.ofValue(this.type);
      } else if (this.type.value !== undefined) {
        this.type = CredentialType.ofValue(this.type.value);
      } else if (!(this.type instanceof CredentialType)) {
        throw new TypeError('The type must be a string or an instance of `CredentialType`.');
      }
    }
    this.number = trimUppercaseString(this.number);
    return this;
  }
}
