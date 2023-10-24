////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model } from '../../main';
import Credential from './credential';

@Model
export default class Person {
  id = '';

  name = '';

  age = 0;

  gender = '';

  mobile = '';

  credential = new Credential();

  hasMobile() {
    return (this.mobile !== undefined && this.mobile !== null && this.mobile !== '');
  }
}
