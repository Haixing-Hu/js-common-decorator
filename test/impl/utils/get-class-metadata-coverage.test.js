////////////////////////////////////////////////////////////////////////////////
import Enum from '../../../src/enum';
import { KEY_CLASS_CATEGORY } from '../../../src/impl/metadata-keys';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getClassMetadata from '../../../src/impl/utils/get-class-metadata';
import Model from '../../../src/model';

/**
 * 此测试文件专门用于提高get-class-metadata.js文件的覆盖率
 * 特别是第35行，处理元数据不存在的情况
 */
describe('getClassMetadata enhanced coverage tests', () => {
  // 测试正常情况，从已装饰的类获取元数据
  test('should get metadata from decorated class', () => {
    @Model
    class TestModel {
      field = 'default';
    }

    // 获取类别元数据
    const category = getClassMetadata(TestModel, KEY_CLASS_CATEGORY);

    // Model装饰的类，类别应该是'model'
    expect(category).toBe('model');
  });

  // 测试从Enum装饰的类获取元数据
  test('should get metadata from Enum-decorated class', () => {
    @Enum
    class TestEnum {
      static OPTION_1 = new TestEnum('OPTION_1');

      static OPTION_2 = new TestEnum('OPTION_2');

      constructor(value) {
        this.value = value;
      }
    }

    // 获取类别元数据
    const category = getClassMetadata(TestEnum, KEY_CLASS_CATEGORY);

    // Enum装饰的类，类别应该是'enum'
    expect(category).toBe('enum');
  });

  // 测试传入非函数参数时抛出错误
  test('should throw TypeError when first argument is not a function', () => {
    // 使用各种非函数值测试
    const nonFunctionValues = [
      null,
      undefined,
      123,
      'string',
      true,
      {},
      [],
    ];

    nonFunctionValues.forEach((value) => {
      expect(() => {
        getClassMetadata(value, 'anyKey');
      }).toThrow(TypeError);
    });
  });

  // 测试类的元数据不存在的情况（覆盖第35行）
  test('should return undefined when class metadata does not exist', () => {
    // 直接模拟 classMetadataCache.get 返回 null
    const classMetadataCache = jest.requireActual('../../../src/impl/class-metadata-cache').default;
    const mockGet = jest.spyOn(classMetadataCache, 'get').mockReturnValue(null);

    class TestClass {}

    // 获取不存在的元数据
    const result = getClassMetadata(TestClass, 'anyKey');

    // 验证 classMetadataCache.get 被调用
    expect(mockGet).toHaveBeenCalledWith(TestClass);

    // 应该返回undefined
    expect(result).toBeUndefined();

    // 恢复原始行为
    mockGet.mockRestore();
  });

  // 测试在元数据存在但指定的键不存在的情况
  test('should return undefined when key does not exist in metadata', () => {
    @Model
    class TestModel {
      field = 'default';
    }

    // 尝试获取不存在的键
    const result = getClassMetadata(TestModel, 'nonExistentKey');

    // 应该返回undefined
    expect(result).toBeUndefined();
  });

  // 测试获取嵌套在元数据中的复杂数据
  test('should get complex nested data from metadata', () => {
    // 为了这个测试，我们需要手动设置类元数据缓存
    const classMetadataCache = jest.requireActual('../../../src/impl/class-metadata-cache').default;
    const originalGet = classMetadataCache.get;

    // 模拟一个带有复杂嵌套数据的元数据
    class TestClass {}

    const complexMetadata = {
      complexKey: {
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' },
        },
        simple: 'string',
      },
    };

    // 模拟元数据缓存的get方法
    jest.spyOn(classMetadataCache, 'get').mockImplementation((cls) => {
      if (cls === TestClass) {
        return complexMetadata;
      }
      return originalGet.call(classMetadataCache, cls);
    });

    // 获取复杂嵌套数据
    const result = getClassMetadata(TestClass, 'complexKey');

    // 验证获取的数据
    expect(result).toBe(complexMetadata.complexKey);
    expect(result.nested.array).toEqual([1, 2, 3]);
    expect(result.nested.object.key).toBe('value');
    expect(result.simple).toBe('string');

    // 恢复原始行为
    classMetadataCache.get.mockRestore();
  });
});
