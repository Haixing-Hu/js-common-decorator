////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../../../src/impl/class-metadata-cache';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getClassMetadata from '../../../src/impl/utils/get-class-metadata';

// 模拟类定义
class MockClass {}

describe('getClassMetadata', () => {
  beforeEach(() => {
    // 清除测试前可能存在的缓存
    if (MockClass[Symbol.metadata]) {
      delete MockClass[Symbol.metadata];
    }
  });

  test('当类缓存中有元数据且key存在时应返回该值', () => {
    // 准备测试数据
    classMetadataCache.set(MockClass, {
      testKey: 'testValue',
    });

    // 执行函数
    const result = getClassMetadata(MockClass, 'testKey');

    // 验证结果
    expect(result).toBe('testValue');
  });

  test('当类缓存中有元数据但key不存在时应返回undefined', () => {
    // 准备测试数据
    classMetadataCache.set(MockClass, {
      testKey: 'testValue',
    });

    // 执行函数
    const result = getClassMetadata(MockClass, 'nonExistKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当类缓存中没有元数据但Symbol.metadata中有时应返回该值', () => {
    // 准备测试数据
    MockClass[Symbol.metadata] = {
      testKey: 'testValue',
    };

    // 清除缓存确保从Symbol.metadata获取
    classMetadataCache.set(MockClass, null);

    // 执行函数
    const result = getClassMetadata(MockClass, 'testKey');

    // 验证结果
    expect(result).toBe('testValue');
  });

  test('当类缓存和Symbol.metadata都没有元数据时应返回undefined', () => {
    // 清除缓存
    classMetadataCache.set(MockClass, null);

    // 执行函数
    const result = getClassMetadata(MockClass, 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当元数据存在但是null时应返回undefined', () => {
    // 准备测试数据
    classMetadataCache.set(MockClass, null);

    // 执行函数
    const result = getClassMetadata(MockClass, 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当传入的Class不是函数时应抛出错误', () => {
    // 执行函数应抛出错误
    expect(() => {
      getClassMetadata({}, 'testKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata(null, 'testKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata(undefined, 'testKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata('string', 'testKey');
    }).toThrow(TypeError);
  });
});
