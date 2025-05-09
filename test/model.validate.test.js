////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import CredentialType from './model/credential-type';
import Credential from './model/validatible-credential';
import CredentialSubclass from './model/validatible-credential-subclass';
import ObjWithArrayField from './model/validatible-obj-with-array-field';
import Person from './model/validatible-person';

describe('Test the prototype method `validate()`', () => {
  test('Credential.validate(), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入护照证件号码');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Credential.validate(undefined), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(undefined), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(undefined), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入护照证件号码');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Credential.validate(null), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(null), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(null), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入护照证件号码');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Credential.validate("*"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("*"), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("*"), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入护照证件号码');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Credential.validate("type"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("type"), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("type"), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });

  test('Credential.validate("number"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("number"), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入身份证证件号码');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("number"), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });

  test('Credential.validate("*", { owner }), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("*", { owner }), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('*', { owner: '张三' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('*', { owner: '张三' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate("*", { owner }), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入Bill Gates的护照证件号码');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Bill Gates的护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Credential.validate("nonValidatable"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('nonValidatable');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate([non-exist-field]), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('xxx');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });

  test('Credential.validate(["type", "number"]), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(["type", "number"]), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入身份证证件号码');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(["type", "number"]), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(["type", "number"]), invalid type and number', () => {
    const obj = new Credential('xxx', '');
    const result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).not.toBeNull();
    expect(result.next.success).toBe(false);
    expect(result.next.description).toBe('请输入证件号码');
    expect(result.next.next).toBeNull();
  });

  test('Credential.validate(["type", "nonValidatable", "xxx", "number"]), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(['type', 'nonValidatable', 'xxx', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(["type", "nonValidatable", "xxx", "number"]), invalid number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate(['type', 'nonValidatable', 'xxx', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate(['type', 'nonValidatable', 'xxx', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入身份证证件号码');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(["type", "nonValidatable", "xxx", "number"]), invalid type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(['type', 'nonValidatable', 'xxx', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(['type', 'nonValidatable', 'xxx', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validate(["type", "nonValidatable", "xxx", "number"]), invalid type and number', () => {
    const obj = new Credential('xxx', '');
    const result = obj.validate(['type', 'nonValidatable', 'xxx', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).not.toBeNull();
    expect(result.next.success).toBe(false);
    expect(result.next.description).toBe('请输入证件号码');
    expect(result.next.next).toBeNull();
  });

  test('CredentialSubclass.validate()', () => {
    const credential = new CredentialSubclass();
    credential.assign({
      type: 'PASSPORT',
      number: 'E12345678',
      nonValidatable: 'xxx',
      childNumber: 'E12345678',
    });
    let result = credential.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();

    credential.assign({
      type: 'PASSPORT',
      number: 'E12345678',
      nonValidatable: 'xxx',
      childNumber: 'X12345678',
    });
    result = credential.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件子号码格式不正确');
    expect(result.next).toBeNull();
  });

  const personData = {
    id: '0001',
    name: '张三',
    credential: {
      type: 'IDENTITY_CARD',
      number: '110101199003078515',
    },
    gender: 'MALE',
    birthday: '1990-03-07',
    mobile: '13574937629',
    email: 'i@i.com',
  };

  test('Test Person.validate()', () => {
    const person = new Person();
    person.assign(personData);
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Person.validate(), name is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.name = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入姓名');
  });
  test('Test Person.validate(), invalid name format', () => {
    const person = new Person();
    person.assign(personData);
    person.name = '张s';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('姓名格式不正确');
  });
  test('Test Person.validate(), credential is null', () => {
    const person = new Person();
    person.assign(personData);
    person.credential = null;
    let result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('必须设置张三的证件的值');

    person.assign(personData);
    person.credential = null;
    person.name = '';
    result = person.validate('credential');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('必须设置证件的值');
  });
  test('Test Person.validate(), credential.type is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.type = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型不能为空');
  });
  test('Test Person.validate(), invalid credential.type', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.type = 'xxx';
    let result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型的值不受支持: xxx');

    person.assign(personData);
    person.credential.type = 'xxx';
    person.name = '';
    result = person.validate('credential');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
  });
  test('Test Person.validate(), credential.number is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.number = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入张三的身份证证件号码');
  });
  test('Test Person.validate(), invalid credential.number', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.number = '110101199003078516';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的身份证证件号码格式不正确');
  });
  test('Test Person.validate(), gender is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.gender = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请选择张三的性别');
  });
  test('Test Person.validate(), invalid gender value', () => {
    const person = new Person();
    person.assign(personData);
    person.gender = 'xxx';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的性别只能是“男”或“女”');
  });
  test('Test Person.validate(), unmatched gender and identity card number', () => {
    const person = new Person();
    person.assign(personData);
    person.gender = 'FEMALE';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的性别和身份证号码不匹配');
  });
  test('Test Person.validate(), birthday is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.birthday = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请选择张三的出生日期');
  });
  test('Test Person.validate(), invalid birthday format', () => {
    const person = new Person();
    person.assign(personData);
    person.birthday = '19900307';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的出生日期格式不正确');
  });
  test('Test Person.validate(), unmatched birthday and identity card number', () => {
    const person = new Person();
    person.assign(personData);
    person.birthday = '1990-03-08';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的出生日期和身份证号码不匹配');
  });
  test('Test Person.validate(), mobile is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.mobile = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('Test Person.validate(), invalid mobile number', () => {
    const person = new Person();
    person.assign(personData);
    person.mobile = '1357493762';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的手机号码格式不正确');
  });
  test('Test Person.validate(), email address is empty', () => {
    const person = new Person();
    person.assign(personData);
    person.email = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('Test Person.validate(), email address is not exist', () => {
    const person = new Person();
    person.assign(personData);
    person.email = 'ii';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的电子邮件地址格式不正确');
  });
  test('Test Person.validate("credential.number")', () => {
    const person = new Person();
    person.assign(personData);
    const result = person.validate('credential.number');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });

  test('Test ObjWithArrayField.validate()', () => {
    const obj = new ObjWithArrayField();
    obj.array = [];
    obj.nonEmptyArray = [1, 2];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('Test ObjWithArrayField.validate(), array is null', () => {
    const obj = new ObjWithArrayField();
    obj.array = [];
    obj.nonEmptyArray = [];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The nonEmptyArray cannot be empty.');
  });
  test('Test ObjWithArrayField.validate(), invalid element in the array', () => {
    const obj = new ObjWithArrayField();
    obj.array = ['abc'];
    obj.nonEmptyArray = [1, 2];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('array格式不正确');
  });
  test('Test ObjWithArrayField.validate(), elements in the array is string representation of numbers', () => {
    const obj = new ObjWithArrayField();
    obj.array = ['12', 34];
    obj.nonEmptyArray = [1, 2];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
});
