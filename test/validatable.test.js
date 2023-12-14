////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  Model, Validatable, ValidationResult, ElementType, Nullable,
} from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import CredentialType from './model/credential-type';
import Credential from './model/validatible-credential';
import CredentialSubclass from './model/validatible-credential-subclass';
import Person from './model/validatible-person';
import ObjWithArrayField from './model/validatible-obj-with-array-field';
import validateArrayField from './model/rules/validate-array-field';

/**
 * 单元测试 @Validatable 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @Validatable', () => {

  test('测试 Credential.prototype.validate("xx")', () => {
    const credential = new Credential(CredentialType.PASSPORT.value, 'E12345678');
    console.log('credential = ', credential);
    let result = credential.validate('xx');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Credential的字段xx不存在');

    credential.assign({ type: 'xxx' });
    result = credential.validate('xx');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Credential的字段xx不存在');

    credential.assign({ type: CredentialType.PASSPORT.value, number: 'xxxx' });
    result = credential.validate('xx');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Credential的字段xx不存在');
  });
  test('测试 Credential.prototype.validate("nonValidable")', () => {
    const credential = new Credential(CredentialType.PASSPORT.value, 'E12345678');
    console.log('credential = ', credential);
    let result = credential.validate('nonValidable');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');

    credential.assign({ type: 'xxx' });
    result = credential.validate('nonValidable');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');

    credential.assign({ type: CredentialType.PASSPORT.value, number: 'xxxx' });
    result = credential.validate('nonValidable');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');

    credential.assign({ type: CredentialType.PASSPORT.value, number: 'xxxx', nonValidable: 'xxx' });
    result = credential.validate('nonValidable');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('@Validatable 参数不是函数', () => {
    expect(() => {
      @Model
      class Obj {
        @Validatable('xxx')
        number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(TypeError, 'The validator of the field "Obj.number" must be a function.');
  });
  test('测试 Credential.prototype.validate() 在继承类 CredentialSubclass 中的实现', () => {
    const credential = new CredentialSubclass();
    credential.assign({
      type: 'PASSPORT',
      number: 'E12345678',
      nonValidable: 'xxx',
      childNumber: 'E12345678',
    });
    let result = credential.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');

    credential.assign({
      type: 'PASSPORT',
      number: 'E12345678',
      nonValidable: 'xxx',
      childNumber: 'X12345678',
    });
    result = credential.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件子号码格式不正确');
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
  test('测试 Person.prototype.validate()，各属性均正确', () => {
    const person = new Person();
    person.assign(personData);
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('测试 Person.prototype.validate()，姓名为空', () => {
    const person = new Person();
    person.assign(personData);
    person.name = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入姓名');
  });
  test('测试 Person.prototype.validate()，姓名不正确', () => {
    const person = new Person();
    person.assign(personData);
    person.name = '张s';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('姓名格式不正确');
  });
  test('测试 Person.prototype.validate()，证件为空', () => {
    const person = new Person();
    person.assign(personData);
    person.credential = null;
    let result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件不能为空');

    person.assign(personData);
    person.credential = null;
    person.name = '';
    result = person.validate('credential');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件不能为空');
  });
  test('测试 Person.prototype.validate()，证件类型为空', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.type = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请选择张三的证件类型');
  });
  test('测试 Person.prototype.validate()，证件类型错误', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.type = 'xxx';
    let result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型不受支持："xxx"');

    person.assign(personData);
    person.credential.type = 'xxx';
    person.name = '';
    result = person.validate('credential');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型不受支持："xxx"');
  });
  test('测试 Person.prototype.validate()，证件号码为空', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.number = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入张三的身份证证件号码');
  });
  test('测试 Person.prototype.validate()，证件号码不正确', () => {
    const person = new Person();
    person.assign(personData);
    person.credential.number = '110101199003078516';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的身份证证件号码格式不正确');
  });
  test('测试 Person.prototype.validate()，性别为空', () => {
    const person = new Person();
    person.assign(personData);
    person.gender = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请选择张三的性别');
  });
  test('测试 Person.prototype.validate()，性别不正确', () => {
    const person = new Person();
    person.assign(personData);
    person.gender = 'xxx';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的性别只能是“男”或“女”');
  });
  test('测试 Person.prototype.validate()，性别和身份证号码不匹配', () => {
    const person = new Person();
    person.assign(personData);
    person.gender = 'FEMALE';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的性别和身份证号码不匹配');
  });
  test('测试 Person.prototype.validate()，出生日期为空', () => {
    const person = new Person();
    person.assign(personData);
    person.birthday = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请选择张三的出生日期');
  });
  test('测试 Person.prototype.validate()，出生日期不正确', () => {
    const person = new Person();
    person.assign(personData);
    person.birthday = '19900307';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的出生日期格式不正确');
  });
  test('测试 Person.prototype.validate()，出生日期和身份证号码不匹配', () => {
    const person = new Person();
    person.assign(personData);
    person.birthday = '1990-03-08';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的出生日期和身份证号码不匹配');
  });
  test('测试 Person.prototype.validate()，手机号码为空', () => {
    const person = new Person();
    person.assign(personData);
    person.mobile = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('测试 Person.prototype.validate()，手机号码不正确', () => {
    const person = new Person();
    person.assign(personData);
    person.mobile = '1357493762';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的手机号码格式不正确');
  });

  test('测试 Person.prototype.validate()，电子邮件地址为空', () => {
    const person = new Person();
    person.assign(personData);
    person.email = '';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('测试 Person.prototype.validate()，电子邮件地址不正确', () => {
    const person = new Person();
    person.assign(personData);
    person.email = 'ii';
    const result = person.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的电子邮件地址格式不正确');
  });
  test('测试 Person.prototype.validate("credential.number")', () => {
    const person = new Person();
    person.assign(personData);
    const result = person.validate('credential.number');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Person的字段credential.number不存在');
  });
});

/**
 * 单元测试 @Validator 装饰器的额外参数。
 *
 * @author 胡海星
 */
describe('测试 @Validator 的额外参数', () => {
  test('正确对象', () => {
    const obj = new ObjWithArrayField();
    obj.array = [];
    obj.nonNullableArray = [1, 2];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('非空字段为空', () => {
    const obj = new ObjWithArrayField();
    obj.array = [];
    obj.nonNullableArray = [];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请填写或选择nonNullableArray');
  });
  test('数组字段内部元素值不正确', () => {
    const obj = new ObjWithArrayField();
    obj.array = ['abc'];
    obj.nonNullableArray = [1, 2];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('array格式不正确');
  });
  test('数组字段内部元素值为整数的字符串表示', () => {
    const obj = new ObjWithArrayField();
    obj.array = ['12', 34];
    obj.nonNullableArray = [1, 2];
    const result = obj.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('elementValidator没有设置', () => {
    expect(() => {
      @Model
      class Obj {
        @Validator(validateArrayField)
        @ElementType(Number)
        @Nullable
          array = [];
      }
      const obj = new Obj();
      obj.array = [1, 2, 3];
      obj.validate();
    }).toThrowWithMessage(TypeError, 'Must specify the element validator for the field "array".');
  });
  test('elementValidator不是一个函数', () => {
    expect(() => {
      @Model
      class Obj {
        @Validator(validateArrayField, { elementValidator: 'abc' })
        @ElementType(Number)
        @Nullable
          array = [];
      }
      const obj = new Obj();
      obj.array = [1, 2, 3];
      obj.validate();
    }).toThrowWithMessage(TypeError, 'The element validator for the field "array" must be a function.');
  });
});
