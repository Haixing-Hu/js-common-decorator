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
 * Unit test of the prototype method `toJsonString()` added by `@Model`.
 *
 * @author Haixing Hu
 */
describe('Test the prototype method `toJsonString()`', () => {
  test('`toJsonString()` should work', () => {
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
    const person = new Person();
    const result = person.assign(data);
    expect(result).toBe(person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
    const json = result.toJsonString();
    const expected = JSON.stringify({
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      gender: '',
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    });
    expect(json).toBe(expected);
  });
  test('`toJsonString()` should work with naming conversion options', () => {
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
    const result = new ObjWithNamingConversion();
    result.assign(obj, { convertNaming: true });
    expect(result.firstField).toBe('first-field');
    expect(result.secondField).toBeInstanceOf(ChildObj);
    expect(result.secondField.firstChildField).toBe('first-child-field');
    expect(result.secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result.secondField.secondChildField.thePerson).toEqual(person);
    expect(result.secondField.secondChildField.thePerson).not.toBe(person);
    const json = result.toJsonString({ convertNaming: true, space: '\t' });
    console.log('JSON:', json);
    const expected = JSON.stringify(obj, null, '\t');
    expect(json).toBe(expected);
  });
  test('`toJsonString()` should work with default naming conversion options', () => {
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
    const result = new ObjWithNamingConversion();
    result.assign(obj, { convertNaming: true, space: 2 });
    expect(result.firstField).toBe('first-field');
    expect(result.secondField).toBeInstanceOf(ChildObj);
    expect(result.secondField.firstChildField).toBe('first-child-field');
    expect(result.secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result.secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result.secondField.secondChildField.thePerson).toEqual(person);
    expect(result.secondField.secondChildField.thePerson).not.toBe(person);
    DefaultOptions.set('toJSON', { convertNaming: true, space: 2 });
    const json = result.toJsonString();
    console.log('JSON:', json);
    const expected = JSON.stringify(obj, null, 2);
    expect(json).toBe(expected);
    DefaultOptions.set('toJSON', { convertNaming: false, space: null });
  });
  test('`toJsonString()` should support bigint', () => {
    const person = new Person();
    person.id = 9223372036854775807n;
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = CredentialType.PASSPORT;
    person.credential.number = '1234567';
    const result = new Person();
    result.assign(person);
    expect(result).toEqual(person);
    expect(result).not.toBe(person);
    const json = result.toJsonString();
    console.log('JSON:', json);
    const expected = '{"id":9223372036854775807,'
      + '"name":"Bill Gates",'
      + '"age":55,'
      + '"gender":"",'
      + '"mobile":"139280384745",'
      + '"credential":{"type":"PASSPORT","number":"1234567"}}';
    expect(json).toBe(expected);
  });
});
