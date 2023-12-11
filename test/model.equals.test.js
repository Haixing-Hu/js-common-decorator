////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Person from './model/person';
import PersonWithEquals from './model/person-with-equals';

describe('Test the prototype method `equals()`', () => {
  test('Test `Person.prototype.equals()`', () => {
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
    const result = person.clone();
    expect(result.equals(person)).toBe(true);
    expect(result.equals(data)).toBe(false);
    person.credential.number = 'xxx';
    expect(result.equals(person)).toBe(false);
    expect(result.equals(null)).toBe(false);
    expect(result.equals(undefined)).toBe(false);
    expect(result.equals(result)).toBe(true);
  });
  test('The @Model should not override the customized prototype method `equals()`', () => {
    const p1 = PersonWithEquals.create({
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    });
    const p2 = PersonWithEquals.create({
      id: 'xxxxx',
      name: 'XXXX',
      age: 55,
      mobile: 'wwww',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    });
    expect(p1.equals(p2)).toBe(true);
    const p3 = PersonWithEquals.create({
      id: 'xxxxx',
      name: 'XXXX',
      age: 55,
      mobile: 'wwww',
      credential: {
        type: 'PASSPORT',
        number: 'xxxx',
      },
    });
    expect(p1.equals(p3)).toBe(false);
  });
});
