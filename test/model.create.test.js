////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { DefaultOptions } from '../src';
import AuditablePerson from './model/auditable-person';
import ChildObj from './model/child-obj';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import ObjWithNamingConversion from './model/obj-with-naming-conversion';
import ObjWithPersonField from './model/ObjWithPersonField';
import Person from './model/person';

describe('Test the static method `create()`', () => {
  test('Test `Person.create()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    };
    let result = Person.create(null);
    expect(result).toBeNull();

    result = Person.create(undefined);
    expect(result).toBeNull();

    result = Person.create(data);
    expect(result).toBeInstanceOf(Person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
  });
  test('`Person.create()` should call `Credential.normalize()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: 'xx1234567',
      },
    };
    let result = Person.create(data);       // normalize == true
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('XX1234567');

    result = Person.create(data, { normalize: false });      // normalize == false
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('xx1234567');
  });
  test('`create()` should work with enumerator field in data object', () => {
    const data = { type: CredentialType.PASSPORT, number: '12345' };
    const credential = Credential.create(data, { normalize: true });
    expect(credential.type).toBe(CredentialType.PASSPORT);
    expect(credential.number).toBe('12345');
  });
  test('`create()` with naming conversion options', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = CredentialType.PASSPORT;
    person.credential.number = '1234567';
    const obj = {
      first_field: 'first-field',
      second_field: {
        first_child_field: 'first-child-field',
        second_child_field: {
          the_person: person,
        },
      },
    };
    const result = ObjWithNamingConversion.create(obj, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });
    expect(result.firstField).toBe('first-field');
    expect(result.secondField).toBeInstanceOf(ChildObj);
    expect(result.secondField.firstChildField).toBe('first-child-field');
    expect(result.secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result.secondField.secondChildField.thePerson).toEqual(person);
    expect(result.secondField.secondChildField.thePerson).not.toBe(person);
  });
  test('`create()` with default naming conversion options', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = CredentialType.PASSPORT;
    person.credential.number = '1234567';
    const obj = {
      first_field: 'first-field',
      second_field: {
        first_child_field: 'first-child-field',
        second_child_field: {
          the_person: person,
        },
      },
    };
    DefaultOptions.set('assign', { convertNaming: true });
    const result = ObjWithNamingConversion.create(obj);
    expect(result.firstField).toBe('first-field');
    expect(result.secondField).toBeInstanceOf(ChildObj);
    expect(result.secondField.firstChildField).toBe('first-child-field');
    expect(result.secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result.secondField.secondChildField.thePerson).toEqual(person);
    expect(result.secondField.secondChildField.thePerson).not.toBe(person);
    DefaultOptions.set('assign', { convertNaming: false });
  });
  test('`create()` should throw for invalid enumeration values', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'xxx',
        number: 'xx1234567',
      },
    };
    expect(() => Person.create(data))
      .toThrowWithMessage(
        RangeError,
        'The value of property \'.credential.type\' of the source object is not an enumerator of CredentialType: xxx',
      );
  });
  test('`Person.create()` should preserve null values in source object', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: null,            // 设置null值
      email: null,             // 设置null值，注意实际上email属性在目标对象Person中不存在
      credential: {
        type: 'PASSPORT',
        number: null,         // 嵌套对象中的null值
      },
    };
    const result = Person.create(data);
    expect(result).toBeInstanceOf(Person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    // 验证null值被保留而不是替换为默认值
    expect(result.mobile).toBe(null);
    // email属性在Person对象中不存在
    expect(result).not.toHaveProperty('email');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(null);
  });

  test('`Person.create()` should preserve undefined values in source object', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: undefined,      // 设置undefined值
      credential: {
        type: 'PASSPORT',
        number: undefined,    // 嵌套对象中的undefined值
      },
    };
    const result = Person.create(data);
    expect(result).toBeInstanceOf(Person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    // 验证undefined值被保留而不是替换为默认值
    expect(result.mobile).toBe(undefined);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(undefined);
  });
});

describe('Test the static method `create()` with naming conversion', () => {
  test('Test `AuditablePerson.create()` without naming conversion', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
      createTime: '2022-01-01',
      modifyTime: '2022-01-02',
      deleteTime: '2022-01-03',
    };
    const result = AuditablePerson.create(data);
    expect(result).toBeInstanceOf(AuditablePerson);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
    expect(result.createTime).toBe(data.createTime);
    expect(result.modifyTime).toBe(data.modifyTime);
    expect(result.deleteTime).toBe(data.deleteTime);
  });

  test('Test `AuditablePerson.create()` with naming conversion', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
      create_time: '2022-01-01',
      modify_time: '2022-01-02',
      delete_time: '2022-01-03',
    };
    const result = AuditablePerson.create(data, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });
    expect(result).toBeInstanceOf(AuditablePerson);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
    expect(result.createTime).toBe(data.create_time);
    expect(result.modifyTime).toBe(data.modify_time);
    expect(result.deleteTime).toBe(data.delete_time);
  });

  test('Test `AuditablePerson.create()` with naming conversion set by DefaultOptions', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
      create_time: '2022-01-01',
      modify_time: '2022-01-02',
      delete_time: '2022-01-03',
    };
    DefaultOptions.set('assign', { convertNaming: true });
    const result = AuditablePerson.create(data);
    expect(result).toBeInstanceOf(AuditablePerson);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
    expect(result.createTime).toBe(data.create_time);
    expect(result.modifyTime).toBe(data.modify_time);
    expect(result.deleteTime).toBe(data.delete_time);
    DefaultOptions.reset('assign');
  });

  test('Test `AuditablePerson.create()` with naming conversion and wrong data naming style', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
      createTime: '2022-01-01',
      modifyTime: '2022-01-02',
      deleteTime: '2022-01-03',
    };
    const result = AuditablePerson.create(data, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });
    expect(result).toBeInstanceOf(AuditablePerson);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
    expect(result.createTime).toBe('');
    expect(result.modifyTime).toBe('');
    expect(result.deleteTime).toBe('');
  });
});
