////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试getFieldType函数
 */

import classMetadataCache from '../../../src/impl/class-metadata-cache';
import { KEY_CLASS_FIELDS_METADATA, KEY_FIELD_TYPE } from '../../../src/impl/metadata-keys';
import getFieldType from '../../../src/impl/utils/get-field-type';

// 模拟类定义
class MockClass {
  id = '';

  undefinedField;

  constructor() {
    this.name = '';
    this.items = [];
  }
}

// 模拟一些特定类型
class StringType {}
class ArrayType {}

describe('getFieldType', () => {
  // 每个测试前重置元数据缓存
  beforeEach(() => {
    // 重置元数据
    const metadata = {};
    classMetadataCache.set(MockClass, metadata);
  });

  test('当field在options.types中指定了类型时应返回该类型', () => {
    // 准备测试数据
    const options = {
      types: {
        '.name': StringType,
      },
    };

    // 执行函数
    const result = getFieldType(MockClass, 'name', '.name', options);

    // 验证结果
    expect(result).toBe(StringType);
  });

  test('当field没有在options.types中指定类型时应返回字段元数据中的类型', () => {
    // 准备测试数据 - 模拟字段元数据
    const metadata = classMetadataCache.get(MockClass);
    metadata[KEY_CLASS_FIELDS_METADATA] = {
      items: {
        [KEY_FIELD_TYPE]: ArrayType,
      },
    };

    // 执行函数
    const result = getFieldType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBe(ArrayType);
  });

  test('当field既没有在options中指定类型也没有字段元数据时，应尝试从默认实例字段值推断类型', () => {
    // 执行函数 - items字段是数组，应该能从默认实例中推断类型
    const result = getFieldType(MockClass, 'items', '.items', {});

    // 验证结果 - 默认实例中items是Array类型
    expect(result).toBe(Array);
  });

  test('当field既没有在options中指定类型也没有字段元数据，也没有在默认实例中设置初始值时，应返回undefined', () => {
    // 执行函数
    const result = getFieldType(MockClass, 'undefinedField', '.undefinedField', {});

    // 验证结果
    expect(result).toBeUndefined();
  });

  test('当元数据中没有字段元数据时应尝试从默认实例推断类型', () => {
    // 执行函数 - name字段在构造函数中初始化为字符串
    const result = getFieldType(MockClass, 'name', '.name', {});

    // 验证结果 - 默认实例中name是String类型
    expect(result).toBe(String);
  });

  test('当元数据中的字段元数据类型不是函数时应抛出TypeError', () => {
    // 准备测试数据 - 设置非函数类型的字段元数据
    const metadata = classMetadataCache.get(MockClass);
    metadata[KEY_CLASS_FIELDS_METADATA] = {
      items: {
        [KEY_FIELD_TYPE]: 'not a function',
      },
    };

    // 执行函数并验证抛出异常
    expect(() => getFieldType(MockClass, 'items', '.items', {})).toThrow(TypeError);
    expect(() => getFieldType(MockClass, 'items', '.items', {})).toThrow(/The annotated type of 'MockClass\.\.items' is not a function/);
  });

  test('当options.types中指定的类型不是函数时应抛出TypeError', () => {
    // 准备测试数据
    const options = {
      types: {
        '.name': 'not a function',
      },
    };

    // 执行函数并验证抛出异常
    expect(() => getFieldType(MockClass, 'name', '.name', options)).toThrow(TypeError);
    expect(() => getFieldType(MockClass, 'name', '.name', options)).toThrow(/The target type of 'MockClass\.\.name' is not a function/);
  });
});
