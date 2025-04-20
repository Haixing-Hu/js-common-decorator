////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试getFieldMetadata函数
 */

import getFieldMetadata from '../../../src/impl/utils/get-field-metadata';

// 模拟类定义
class MockClass {
  constructor() {
    this.id = '';
    this.name = '';
  }
}

describe('getFieldMetadata', () => {
  beforeEach(() => {
    // 清除测试前可能存在的元数据
    if (MockClass[Symbol.metadata]) {
      delete MockClass[Symbol.metadata];
    }
  });

  test('当字段存在元数据且key存在时应返回该值', () => {
    // 准备测试数据
    const metadata = {
      __cd_fields_metadata__: {
        name: {
          testKey: 'testValue',
        },
      },
    };

    // 执行函数
    const result = getFieldMetadata(metadata, 'name', 'testKey');

    // 验证结果
    expect(result).toBe('testValue');
  });

  test('当字段存在元数据但key不存在时应返回undefined', () => {
    // 准备测试数据
    const metadata = {
      __cd_fields_metadata__: {
        name: {
          testKey: 'testValue',
        },
      },
    };

    // 执行函数
    const result = getFieldMetadata(metadata, 'name', 'nonExistKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当查询的字段不存在元数据时应返回undefined', () => {
    // 准备测试数据
    const metadata = {
      __cd_fields_metadata__: {
        name: {
          testKey: 'testValue',
        },
      },
    };

    // 执行函数
    const result = getFieldMetadata(metadata, 'id', 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当类元数据中没有__cd_fields_metadata__时应返回undefined', () => {
    // 准备测试数据
    const metadata = {};

    // 执行函数
    const result = getFieldMetadata(metadata, 'name', 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当传入的metadata是null时应返回undefined', () => {
    // 执行函数
    const result = getFieldMetadata(null, 'name', 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当传入的metadata是undefined时应返回undefined', () => {
    // 执行函数
    const result = getFieldMetadata(undefined, 'name', 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当传入的field不是字符串时应返回undefined', () => {
    // 准备测试数据
    const metadata = {
      __cd_fields_metadata__: {
        name: {
          testKey: 'testValue',
        },
      },
    };

    // 执行函数
    const result = getFieldMetadata(metadata, {}, 'testKey');

    // 验证结果
    expect(result).toBeUndefined();
  });
});
