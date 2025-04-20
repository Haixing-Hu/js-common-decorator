////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Person from './model/person';

describe('Test the prototype method `clear()`', () => {
  test('Test `Person.prototype.clear()`', () => {
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
    person.assign(data);
    const result = person.clear();
    console.log('result:', result);
    expect(result).toBe(person);            // clear() 必须返回该对象的引用
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
