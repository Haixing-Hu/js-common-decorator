////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getDefaultInstance } from '../src/impl/utils';
import Person from './model/person';

describe('Test the default instance of the decorated class', () => {
  test('The metadata of the decorated class should store a default instance', () => {
    const defaultIntance = getDefaultInstance(Person);
    expect(defaultIntance).toEqual(new Person());
  });
});
