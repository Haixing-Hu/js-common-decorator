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
export default class AuditablePerson {
  id = '';

  name = '';

  age = 0;

  gender = '';

  mobile = '';

  credential = new Credential();

  createTime = '';

  modifyTime = '';

  deleteTime = '';

  hasMobile() {
    return (this.mobile !== undefined && this.mobile !== null && this.mobile !== '');
  }
}
