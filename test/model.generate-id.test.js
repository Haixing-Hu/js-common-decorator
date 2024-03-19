////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Credential from './model/credential';
import Person from './model/person';
import PersonChild from './model/person-child';

describe('Test the prototype method `generateId()`', () => {
  test('Test `Person.prototype.generateId()`', () => {
    expect(Object.prototype.hasOwnProperty.call(Person.prototype, 'generateId')).toBe(true);
    const p1 = new Person();
    expect(p1.id).toBe('');
    const id1 = p1.generateId();
    expect(typeof id1).toBe('number');
    expect(id1).toBe(p1.id);
    expect(id1).not.toBe('');
    const p2 = new Person();
    expect(p2.id).toBe('');
    const id2 = p2.generateId();
    expect(typeof id2).toBe('number');
    expect(id2).toBe(p2.id);
    expect(id2).not.toBe('');
    expect(id1).not.toBe(id2);
  });
  test('`Credential` classes should not have a `generateId()` prototype method', () => {
    expect(Object.prototype.hasOwnProperty.call(Credential.prototype, 'generateId'))
      .toBe(false);
  });
  test('The `PersonChild` class that inherits from `Person` should not redefine the `generateId()`', () => {
    expect(Object.prototype.hasOwnProperty.call(PersonChild.prototype, 'generateId'))
      .toBe(false);
  });
  test('`PersonChild` class should inherit the `generateId()` from `Person`', () => {
    const p1 = new PersonChild();
    expect(p1.id).toBe('');
    const id1 = p1.generateId();
    expect(typeof id1).toBe('number');
    expect(id1).toBe(p1.id);
    expect(id1).not.toBe('');
    const p2 = new PersonChild();
    expect(p2.id).toBe('');
    const id2 = p2.generateId();
    expect(typeof id2).toBe('number');
    expect(id2).toBe(p2.id);
    expect(id2).not.toBe('');
    expect(id1).not.toBe(id2);
  });
});
