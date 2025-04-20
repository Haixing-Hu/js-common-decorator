////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import setClassMetadata from '../../../src/impl/utils/set-class-metadata';

// 模拟class-metadata-cache的行为
jest.mock('../../../src/impl/class-metadata-cache', () => ({
  __esModule: true,
  default: {
    get: jest.fn((Class) => {
      // 使用Class.name来判断而不是直接引用类对象
      if (Class && Class.name === 'TestClass') {
        return mockClassMetadata;
      } else if (Class && Class.name === 'UncachedClass') {
        return null; // 模拟未缓存的情况
      }
      return mockEmptyCache;
    }),
  },
}));

// 在外部定义模拟数据
const mockClassMetadata = {};
const mockEmptyCache = {};

// 在测试中定义类
class TestClass {}
class UncachedClass {}

describe('setClassMetadata', () => {
  beforeEach(() => {
    // 在每个测试之前，清除模拟对象
    Object.keys(mockClassMetadata).forEach((key) => {
      delete mockClassMetadata[key];
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should set metadata property for a class', () => {
    setClassMetadata(TestClass, 'testKey', 'testValue');

    expect(mockClassMetadata.testKey).toBe('testValue');
  });

  test('should update existing metadata property', () => {
    // 先创建一些初始元数据
    mockClassMetadata.testKey = 'initialValue';
    mockClassMetadata.otherKey = 123;

    // 更新其中一个属性
    setClassMetadata(TestClass, 'testKey', 'updatedValue');

    // 验证元数据已更新，但其他属性不变
    expect(mockClassMetadata.testKey).toBe('updatedValue');
    expect(mockClassMetadata.otherKey).toBe(123);
  });

  test('should set complex value types', () => {
    const complexValue = {
      nested: {
        array: [1, 2, 3],
        object: { prop: 'value' },
      },
    };

    setClassMetadata(TestClass, 'complex', complexValue);

    expect(mockClassMetadata.complex).toBe(complexValue);
    expect(mockClassMetadata.complex.nested.array).toEqual([1, 2, 3]);
  });

  test('should work with multiple keys for same class', () => {
    setClassMetadata(TestClass, 'key1', 'value1');
    setClassMetadata(TestClass, 'key2', 'value2');

    expect(mockClassMetadata.key1).toBe('value1');
    expect(mockClassMetadata.key2).toBe('value2');
  });

  test('should throw error if class metadata is not cached', () => {
    expect(() => {
      setClassMetadata(UncachedClass, 'key', 'value');
    }).toThrow(/has not been cached/);
  });
});
