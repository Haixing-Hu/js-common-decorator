/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model } from '@/index';
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
    // 若两人之一无身份证信息，无法比较他们是否同一人，认为不同
    return false;
  }
  return (this.credential.type === other.credential.type)
      && (this.credential.number === other.credential.number);
  }
}
