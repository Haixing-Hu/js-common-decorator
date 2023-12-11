////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_CATEGORY } from '../src/impl/metadata-keys';
import { getClassMetadata } from '../src/impl/utils';
import Person from './model/person';

describe('Test the meta information of the decorated class', () => {
  test('The category meta-attribute of the decorated class must be "model"', () => {
    const value = getClassMetadata(Person, KEY_CLASS_CATEGORY);
    expect(value).toBe('model');
  });
  test('The constructor of the decorated class should be correct', () => {
    const person = new Person();
    console.log('person.constructor = ', person.constructor);
    console.log('person.prototype = ', Object.getPrototypeOf(person));
    console.log('Person.prototype.constructor = ', Person.prototype.constructor);
    console.log('Person.prototype = ', Person.prototype);
    expect(person.constructor).toBe(Person);
    expect(Person.prototype.constructor).toBe(Person);
    expect(Object.getPrototypeOf(person)).toBe(Person.prototype);
  });
});
