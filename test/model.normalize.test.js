////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Child from './model/child';
import Parent from './model/parent';

describe('Test the prototype method `normalize()`', () => {
  test('`Child.normalize()` should call `Parent.normalize()`', () => {
    const data = {
      x: 1,
      z: 'abc',
      message: 'hello',
    };
    const parent = new Parent();
    parent.assign(data, false);
    expect(parent.x).toBe(1);
    expect(parent.y).toBe(0);
    expect(parent.z).toBe('abc');
    parent.normalize();
    expect(parent.z).toBe('ABC');

    const child = new Child();
    child.assign(data, false);
    expect(child.message).toBe('hello');
    expect(child.x).toBe(1);
    expect(child.y).toBe(0);
    expect(child.z).toBe('abc');
    child.normalize();
    expect(child.message).toBe('HELLO');
    expect(child.x).toBe(1);
    expect(child.y).toBe(0);
    expect(child.z).toBe('ABC');
  });
});
