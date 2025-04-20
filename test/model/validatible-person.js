////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Label, Model, NameField, Nullable, Type, Validatable } from '../../src';
import Gender from './gender';
import validatePersonBirthday from './rules/validate-person-birthday';
import validatePersonEmail from './rules/validate-person-email';
import validatePersonGender from './rules/validate-person-gender';
import validatePersonMobile from './rules/validate-person-mobile';
import validatePersonName from './rules/validate-person-name';
import Credential from './validatible-credential';

@Model
export default class Person {
  @Label('ID')
  id = '';

  @Validatable(validatePersonName)
  @Label('姓名')
  @NameField
  name = '';

  @Validatable
  @Type(Credential)
  @Label('证件')
  credential = new Credential();

  @Validatable(validatePersonGender)
  @Type(Gender)
  @Label('性别')
  gender = '';

  @Validatable(validatePersonBirthday)
  @Label('出生日期')
  birthday = '';

  @Validatable(validatePersonMobile)
  @Label('手机号码')
  @Nullable
  mobile = '';

  @Validatable(validatePersonEmail)
  @Label('电子邮件地址')
  @Nullable
  email = '';
}
