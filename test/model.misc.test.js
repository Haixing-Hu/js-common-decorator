////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model } from '../src';

describe('Test the misc aspects of `@Model`', () => {
  test('Test decorate non-class', () => {
    expect(() => {
      class Foo {
        @Model
        field = 'foo';
      }
    }).toThrow(TypeError);
  });
});
