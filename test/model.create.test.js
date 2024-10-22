////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { DefaultOptions, Page } from '../src';
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
        'The value of property \'source.credential.type\' is not an enumerator of CredentialType: xxx',
      );
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

  test('create() with options.targetElementTypes', () => {
    const data = {
      total_count: 3,
      total_pages: 1,
      page_index: 0,
      page_size: 5,
      content: [{
        id: 'xxxxx',
        name: 'Bill Gates',
        age: 63,
        mobile: '139280384745',
        credential: {
          type: 'PASSPORT',
          number: '1234567',
        },
      }, {
        name: 'Jack Ma',
        age: 55,
        credential: {
          type: '',
          number: null,
        },
      }, null,
      ],
    };
    const result = Page.create(data, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
      targetElementTypes: {
        'Page.content': Person,
      },
    });
    expect(result).toBeInstanceOf(Page);
    expect(result.totalCount).toBe(3);
    expect(result.totalPages).toBe(1);
    expect(result.pageIndex).toBe(0);
    expect(result.pageSize).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(3);
    expect(result.content[0]).toBeInstanceOf(Person);
    expect(result.content[0].id).toBe(data.content[0].id);
    expect(result.content[0].name).toBe(data.content[0].name);
    expect(result.content[0].age).toBe(data.content[0].age);
    expect(result.content[0].gender).toBe('');
    expect(result.content[0].mobile).toBe(data.content[0].mobile);
    expect(result.content[0].credential).toBeInstanceOf(Credential);
    expect(result.content[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result.content[0].credential.number).toBe(data.content[0].credential.number);
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(data.content[1].name);
    expect(result.content[1].age).toBe(data.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBeNull();
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
});
