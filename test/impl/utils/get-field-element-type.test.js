////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试getFieldElementType函数
 */

import { KEY_FIELD_ELEMENT_TYPE } from '../../../src/impl/metadata-keys';
import getFieldElementType from '../../../src/impl/utils/get-field-element-type';

// 模拟类定义 - 确保默认实例不会含有元素类型信息
class MockClass {
  constructor() {
    this.id = '';
    this.name = '';
    // 空数组，确保不含有元素类型信息
    this.items = [];
    this.map = new Map();
    this.set = new Set();
  }

  // 清空items数组中的元素类型判断
  // 模拟默认值检测失败的情况
  static createDefault() {
    return {
      id: '',
      name: '',
      items: Object.freeze([]), // 冻结的空数组，防止被修改
      map: new Map(),
      set: new Set(),
    };
  }
}

// 模拟一些特定类型
class ItemType {}
class MapValueType {}
class SetElementType {}

// 模拟getDefaultInstance，使其返回没有元素类型信息的对象
jest.mock('../../../src/impl/utils/get-default-instance', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((Class) => {
    if (Class === MockClass) {
      return MockClass.createDefault();
    }
    return new Class();
  }),
}));

// 模拟getCollectionElementType，对于空数组返回null
jest.mock('../../../src/impl/utils/get-collection-element-type', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((value) => null),
}));

// 模拟classMetadataCache
jest.mock('../../../src/impl/class-metadata-cache', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((Class) => {
      if (Class[Symbol.metadata]) {
        return Class[Symbol.metadata];
      }
      return {};
    }),
  },
}));

describe('getFieldElementType', () => {
  test('当field在options.elementTypes中指定了类型时应返回该类型', () => {
    // 准备测试数据
    const options = {
      elementTypes: {
        '.items': ItemType,
      },
    };

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', options);

    // 验证结果
    expect(result).toBe(ItemType);
  });

  test('当field没有在options中指定类型但有字段元数据时应返回元数据中的类型', () => {
    // 准备测试数据 - 模拟字段元数据
    MockClass[Symbol.metadata] = {
      __cd_fields_metadata__: {
        items: {
          [KEY_FIELD_ELEMENT_TYPE]: ItemType,
        },
      },
    };

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBe(ItemType);
  });

  test('当field既没有在options中指定类型也没有字段元数据时应返回null', () => {
    // 准备测试数据 - 清除元数据
    delete MockClass[Symbol.metadata];

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBeNull();
  });

  test('当类没有Symbol.metadata时应返回null', () => {
    // 准备测试数据 - 确保删除Symbol.metadata
    delete MockClass[Symbol.metadata];

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBeNull();
  });

  test('当元数据中没有__cd_fields_metadata__时应返回null', () => {
    // 准备测试数据 - 设置没有__cd_fields_metadata__的元数据
    MockClass[Symbol.metadata] = {};

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBeNull();
  });

  test('当元数据中没有该字段的元数据时应返回null', () => {
    // 准备测试数据 - 设置不包含目标字段的元数据
    MockClass[Symbol.metadata] = {
      __cd_fields_metadata__: {
        name: { // 只有name字段有元数据
          [KEY_FIELD_ELEMENT_TYPE]: ItemType,
        },
      },
    };

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBeNull();
  });

  test('当字段元数据中没有KEY_FIELD_ELEMENT_TYPE时应返回null', () => {
    // 准备测试数据 - 设置没有KEY_FIELD_ELEMENT_TYPE的字段元数据
    MockClass[Symbol.metadata] = {
      __cd_fields_metadata__: {
        items: {
          // 没有KEY_FIELD_ELEMENT_TYPE
        },
      },
    };

    // 执行函数
    const result = getFieldElementType(MockClass, 'items', '.items', {});

    // 验证结果
    expect(result).toBeNull();
  });

  test('应该处理不同字段类型的元素类型', () => {
    // 准备测试数据 - 不同字段类型的元数据
    MockClass[Symbol.metadata] = {
      __cd_fields_metadata__: {
        items: {
          [KEY_FIELD_ELEMENT_TYPE]: ItemType,
        },
        map: {
          [KEY_FIELD_ELEMENT_TYPE]: MapValueType,
        },
        set: {
          [KEY_FIELD_ELEMENT_TYPE]: SetElementType,
        },
      },
    };

    // 验证数组字段
    expect(getFieldElementType(MockClass, 'items', '.items', {})).toBe(ItemType);

    // 验证Map字段
    expect(getFieldElementType(MockClass, 'map', '.map', {})).toBe(MapValueType);

    // 验证Set字段
    expect(getFieldElementType(MockClass, 'set', '.set', {})).toBe(SetElementType);
  });
});
