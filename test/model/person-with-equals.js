////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model } from '../../src';
import Credential from './credential';

@Model
export default class PersonWithEquals {
  id = '';

  name = '';

  age = 0;

  gender = '';

  mobile = '';

  credential = new Credential();

  hasMobile() {
    return (this.mobile !== undefined && this.mobile !== null && this.mobile !== '');
  }

  equals(other) {
    if (!(other instanceof PersonWithEquals)) {
      return false;
    }
    if ((this.credential === null) || (other.credential === null)) {
      // If one of the two people does not have ID information, it is impossible
      // to compare whether they are the same person, so consider them different.
      return false;
    }
    return (this.credential.type === other.credential.type)
      && (this.credential.number === other.credential.number);
  }
}
