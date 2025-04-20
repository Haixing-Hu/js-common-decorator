////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试equalsImpl函数
 */

import equalsImpl from '../../../src/impl/model/equals-impl';

describe('equalsImpl', () => {
  test('当两个对象引用相同时应返回true', () => {
    // 准备测试数据
    const obj = { id: '1', name: 'test' };

    // 执行函数
    const result = equalsImpl(obj, obj);

    // 验证结果
    expect(result).toBe(true);
  });

  test('当第二个参数为null或undefined时应返回false', () => {
    // 准备测试数据
    const obj = { id: '1', name: 'test' };

    // 执行函数
    const resultNull = equalsImpl(obj, null);
    const resultUndefined = equalsImpl(obj, undefined);

    // 验证结果
    expect(resultNull).toBe(false);
    expect(resultUndefined).toBe(false);
  });

  test('当两个对象属性完全相同时应返回true', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test', age: 25 };
    const obj2 = { id: '1', name: 'test', age: 25 };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(true);
  });

  test('当两个对象有不同属性时应返回false', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test', age: 25 };
    const obj2 = { id: '1', name: 'test', age: 30 };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(false);
  });

  test('当两个对象属性数量不同时应返回false', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test', age: 25 };
    const obj2 = { id: '1', name: 'test' };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(false);
  });

  test('当两个对象有嵌套对象且完全相同时应返回true', () => {
    // 准备测试数据
    const obj1 = {
      id: '1',
      name: 'test',
      address: { city: 'Beijing', code: '100000' },
    };
    const obj2 = {
      id: '1',
      name: 'test',
      address: { city: 'Beijing', code: '100000' },
    };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(true);
  });

  test('当两个对象有嵌套对象且不同时应返回false', () => {
    // 准备测试数据
    const obj1 = {
      id: '1',
      name: 'test',
      address: { city: 'Beijing', code: '100000' },
    };
    const obj2 = {
      id: '1',
      name: 'test',
      address: { city: 'Shanghai', code: '200000' },
    };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(false);
  });

  test('当两个对象有数组且完全相同时应返回true', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test', tags: ['a', 'b', 'c'] };
    const obj2 = { id: '1', name: 'test', tags: ['a', 'b', 'c'] };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(true);
  });

  test('当两个对象有数组且内容不同时应返回false', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test', tags: ['a', 'b', 'c'] };
    const obj2 = { id: '1', name: 'test', tags: ['a', 'b', 'd'] };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(false);
  });

  test('当两个对象有数组但长度不同时应返回false', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test', tags: ['a', 'b', 'c'] };
    const obj2 = { id: '1', name: 'test', tags: ['a', 'b'] };

    // 执行函数
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(false);
  });

  test('当两个对象有循环引用时应正确处理', () => {
    // 准备测试数据
    const obj1 = { id: '1', name: 'test' };
    const obj2 = { id: '1', name: 'test' };
    obj1.self = obj1;
    obj2.self = obj2;

    // 执行函数 - 不应该导致堆栈溢出
    const result = equalsImpl(obj1, obj2);

    // 验证结果
    expect(result).toBe(true);
  });
});
