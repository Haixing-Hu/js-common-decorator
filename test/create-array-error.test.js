////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createArray } from '../src';

// 模拟类定义
class TestClass {
  constructor() {
    this.name = '';
  }
}

describe('createArray non-array argument', () => {
  test('当传入非数组参数时应抛出TypeError', () => {
    // 测试所有非数组类型的参数
    const nonArrayValues = [
      'string',
      123,
      true,
      {},
      () => {},
      new Date(),
      new Map(),
      new Set(),
    ];

    nonArrayValues.forEach((value) => {
      expect(() => {
        createArray(TestClass, value);
      }).toThrow(TypeError);

      // 确认错误消息
      try {
        createArray(TestClass, value);
      } catch (e) {
        expect(e.message).toBe('The first argument of TestClass.createArray() must be an array.');
      }
    });
  });
});
