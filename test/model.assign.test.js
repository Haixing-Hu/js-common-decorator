////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../src/impl/class-metadata-cache';
import Child from './model/child';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Parent from './model/parent';
import Person from './model/person';

/**
 * Unit test of the prototype method `assign()` added by `@Model`.
 *
 * @author Haixing Hu
 */
describe('Test the prototype method `assign()`', () => {
  test('`assign()` should work', () => {
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
  });
  test('`assign(data, { normalize: true })` should call `Credential.normalize()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'passport',
        number: 'xx1234567',
      },
    };
    const person = new Person();
    const result = person.assign(data, { normalize: true });     // normalize == true
    expect(result).toBe(person);  // assign() must returns the reference to the object
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('XX1234567');
  });
  test('`assign(data, { normalize: false })` should not call `Credential.normalize()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'passport',
        number: 'xx1234567',
      },
    };
    const person = new Person();
    const result = person.assign(data, { normalize: false });
    expect(result).toBe(person); // assign() must returns the reference to the object
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('xx1234567');
  });
  test('`assign(data)` should call `Credential.normalize()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'passport',
        number: 'xx1234567',
      },
    };
    const person = new Person();
    const result = person.assign(data);     // normalize == true
    expect(result).toBe(person);  // assign() must returns the reference to the object
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('XX1234567');
  });
  test('`Child.assign()` should call `Parent.assign()`', () => {
    const metadata = classMetadataCache.get(Child);
    console.log(metadata);
    const data = {
      x: 1,
      z: 'abc',
      message: 'hello',
    };
    const parent = new Parent();
    parent.assign(data, { normalize: true });
    expect(parent.x).toBe(1);
    expect(parent.y).toBe(0);
    expect(parent.z).toBe('ABC');

    const child = new Child();
    child.assign(data, { normalize: true });
    expect(child.message).toBe('HELLO');
    expect(child.x).toBe(1);
    expect(child.y).toBe(0);
    expect(child.z).toBe('ABC');
  });
  test('`assign(undefined) should set the object to default', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = 'PASSPORT';
    person.credential.number = '1234567';
    const result = person.assign(undefined);
    console.log('result:', result);
    console.log('CredentialType.DEFAULT:', CredentialType.DEFAULT);
    expect(result).toBe(person);
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.age).toBe(0);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe('');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.DEFAULT);
    expect(result.credential.number).toBe('');
  });
  test('`assign(null) should set the object to default', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = 'PASSPORT';
    person.credential.number = '1234567';
    const result = person.assign(null);
    expect(result).toBe(person);
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.age).toBe(0);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe('');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.DEFAULT);
    expect(result.credential.number).toBe('');
  });
  test('`assign({}) should set the object to default', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = 'PASSPORT';
    person.credential.number = '1234567';
    const result = person.assign({});
    expect(result).toBe(person);
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.age).toBe(0);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe('');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.DEFAULT);
    expect(result.credential.number).toBe('');
  });
});
