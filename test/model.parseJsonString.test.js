////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { DefaultOptions } from '../src';
import ChildObj from './model/child-obj';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import ObjWithNamingConversion from './model/obj-with-naming-conversion';
import ObjWithPersonField from './model/ObjWithPersonField';
import Person from './model/person';

/**
 * Unit test of the prototype method `parseJsonString()` added by `@Model`.
 *
 * @author Haixing Hu
 */
describe('Test the prototype method `parseJsonString()`', () => {
  test('`parseJsonString()` should work', () => {
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
    const json = JSON.stringify(data);
    const person = Person.create(data);
    const result = Person.parseJsonString(json);
    expect(result).not.toBe(person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
  });
  test('`parseJsonString()` should work with naming conversion options', () => {
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
    const json = JSON.stringify(obj);
    const expected = ObjWithNamingConversion.create(obj, { convertNaming: true });
    const result = ObjWithNamingConversion.parseJsonString(json, { convertNaming: true });
    expect(result.firstField).toBe('first-field');
    expect(result.secondField).toBeInstanceOf(ChildObj);
    expect(result.secondField.firstChildField).toBe('first-child-field');
    expect(result.secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result.secondField.secondChildField.thePerson).toEqual(person);
    expect(result.secondField.secondChildField.thePerson).not.toBe(person);
    expect(result).not.toBe(expected);
    expect(result).toEqual(expected);
  });
  test('`parseJsonString()` should work with default naming conversion options', () => {
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
    const json = JSON.stringify(obj);
    DefaultOptions.set('assign', { convertNaming: true });
    const expected = ObjWithNamingConversion.create(obj);
    const result = ObjWithNamingConversion.parseJsonString(json);
    expect(result.firstField).toBe('first-field');
    expect(result.secondField).toBeInstanceOf(ChildObj);
    expect(result.secondField.firstChildField).toBe('first-child-field');
    expect(result.secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result.secondField.secondChildField.thePerson).toEqual(person);
    expect(result.secondField.secondChildField.thePerson).not.toBe(person);
    expect(result).not.toBe(expected);
    expect(result).toEqual(expected);
    DefaultOptions.set('assign', { convertNaming: false });
  });
  test('`parseJsonString()` should support bigint', () => {
    const json = '{"id":9223372036854775807,'
      + '"name":"Bill Gates",'
      + '"age":55,'
      + '"gender":"",'
      + '"mobile":"139280384745",'
      + '"credential":{"type":"PASSPORT","number":"1234567"}}';
    const expected = new Person();
    expected.id = 9223372036854775807n;
    expected.name = 'Bill Gates';
    expected.age = 55;
    expected.mobile = '139280384745';
    expected.credential.type = CredentialType.PASSPORT;
    expected.credential.number = '1234567';
    const result = Person.parseJsonString(json);
    expect(result).toEqual(expected);
    expect(result).not.toBe(expected);
  });
});
