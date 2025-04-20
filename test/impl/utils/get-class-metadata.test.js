////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../../../src/impl/class-metadata-cache';
import getClassMetadata from '../../../src/impl/utils/get-class-metadata';

/**
 * @test Test of the getClassMetadata function
 * @author Haixing Hu
 */
describe('getClassMetadata', () => {
  // 由于不能使用clear方法，我们直接使用一个新的模拟缓存
  beforeEach(() => {
    // 恢复原始实现
    jest.restoreAllMocks();
  });

  it('should throw TypeError if first argument is not a function', () => {
    expect(() => {
      getClassMetadata({}, 'key');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata(null, 'key');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata('string', 'key');
    }).toThrow(TypeError);
  });

  it('should return undefined if metadata is not cached', () => {
    // 创建一个类但不添加到缓存
    class TestClass {}

    // 应该返回undefined而不是抛出错误
    expect(getClassMetadata(TestClass, 'key')).toBeUndefined();
  });

  it('should return correct metadata if it exists', () => {
    // 创建一个类
    class TestClass {}

    // 模拟缓存并设置测试数据
    jest.spyOn(classMetadataCache, 'get').mockImplementation((key) => ({
      key1: 'value1',
      key2: 'value2',
    }));

    // 测试获取元数据
    expect(getClassMetadata(TestClass, 'key1')).toBe('value1');
    expect(getClassMetadata(TestClass, 'key2')).toBe('value2');
    expect(getClassMetadata(TestClass, 'nonExistentKey')).toBeUndefined();

    // 清理
    jest.restoreAllMocks();
  });

  it('should work with cached metadata', () => {
    // 创建一个类
    class SimpleClass {}

    // 直接使用内部API设置元数据
    const metadata = { testKey: 'testValue' };
    jest.spyOn(classMetadataCache, 'get').mockImplementation(() => metadata);

    // 验证getClassMetadata可以正确获取元数据
    expect(getClassMetadata(SimpleClass, 'testKey')).toBe('testValue');

    // 清理
    jest.restoreAllMocks();
  });
});
