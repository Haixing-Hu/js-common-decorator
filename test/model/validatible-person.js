////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Model,
  Validator,
  Label,
  DefaultValidator,
  Nullable,
  Type,
} from '../../src';
import Credential from './validatible-credential';
import Gender from './gender';
import validatePersonName from './rules/validate-person-name';
import validatePersonGender from './rules/validate-person-gender';
import validatePersonBirthday from './rules/validate-person-birthday';
import validatePersonMobile from './rules/validate-person-mobile';
import validatePersonEmail from './rules/validate-person-email';

@Model
export default class Person {
  @Label('ID')
  id = '';

  @Validator(validatePersonName)
  @Label('姓名')
  name = '';

  @DefaultValidator
  @Type(Credential)
  @Label('证件')
  credential = new Credential();

  @Validator(validatePersonGender)
  @Type(Gender)
  @Label('性别')
  gender = '';

  @Validator(validatePersonBirthday)
  @Label('出生日期')
  birthday = '';

  @Validator(validatePersonMobile)
  @Label('手机号码')
  @Nullable
  mobile = '';

  @Validator(validatePersonEmail)
  @Label('电子邮件地址')
  @Nullable
  email = '';
}
