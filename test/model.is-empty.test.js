////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import CredentialType from './model/credential-type';
import Person from './model/person';

describe('Test the prototype method `isEmpty()`', () => {
  test('Test `Person.prototype.isEmpty()`', () => {
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
    expect(person.isEmpty()).toBe(true);
    person.assign(data);
    expect(person.isEmpty()).toBe(false);
    person.clear();
    expect(person.isEmpty()).toBe(true);
    person.credential.type = CredentialType.PASSPORT;
    expect(person.isEmpty()).toBe(false);
  });
});
