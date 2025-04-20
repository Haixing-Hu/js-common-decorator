////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Credential from './model/credential';
import Person from './model/person';

describe('Test the static method isNullishOrEmpty()', () => {
  test('Test Person.isNullishOrEmpty(undefined), ', () => {
    const person = undefined;
    const result = Person.isNullishOrEmpty(person);
    expect(result).toBe(true);
  });
  test('Test Person.isNullishOrEmpty(null), ', () => {
    const person = null;
    const result = Person.isNullishOrEmpty(person);
    expect(result).toBe(true);
  });
  test('Test Person.isNullishOrEmpty(empty-person)', () => {
    const person = new Person();
    const result = Person.isNullishOrEmpty(person);
    expect(result).toBe(true);
  });
  test('Test Person.isNullishOrEmpty(non-empty-person)', () => {
    const person = new Person();
    person.name = '张三';
    const result = Person.isNullishOrEmpty(person);
    expect(result).toBe(false);
  });
  test('Test Person.isNullishOrEmpty(a-Credential-instance)', () => {
    const credential = new Credential();
    expect(() => Person.isNullishOrEmpty(credential))
      .toThrowWithMessage(TypeError, 'The object must be an instance of the class Person.');
  });
});
