////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getFieldElementType from '../../../src/impl/utils/get-field-element-type';
import Model from '../../../src/model';
import ElementType from '../../../src/element-type';
import { KEY_FIELD_ELEMENT_TYPE } from '../../../src/impl/metadata-keys';

/**
 * 此测试文件专门用于提高get-field-element-type.js文件的覆盖率
 * 特别是第47行，验证注解类型不是函数的情况
 */
describe('getFieldElementType enhanced coverage tests', () => {
  // 测试常规使用场景
  test('should get element type from annotation', () => {
    @Model
    class Item {
      id = '';
      name = '';
    }
    
    @Model
    class TestClass {
      @ElementType(Item)
      items = [];
    }
    
    // 获取items字段的元素类型
    const elementType = getFieldElementType(TestClass, 'items');
    
    // 验证正确获取了元素类型
    expect(elementType).toBe(Item);
  });
  
  // 测试从options中获取元素类型
  test('should get element type from options', () => {
    @Model
    class Item {
      id = '';
      name = '';
    }
    
    @Model
    class TestClass {
      // 没有使用@ElementType注解
      items = [];
    }
    
    // 通过options提供元素类型信息
    const options = {
      elementTypes: {
        '.items': Item
      }
    };
    
    // 获取items字段的元素类型
    const elementType = getFieldElementType(TestClass, 'items', undefined, options);
    
    // 验证正确获取了元素类型
    expect(elementType).toBe(Item);
  });
  
  // 测试当注解的元素类型不是函数时抛出异常（覆盖第47行）
  test('should throw TypeError when annotated element type is not a function', () => {
    // 修改模拟策略，使用更直接的方式
    const originalGetFieldMetadata = jest.requireActual('../../../src/impl/utils/get-field-metadata').default;
    const mockGetFieldMetadata = jest.spyOn(require('../../../src/impl/utils/get-field-metadata'), 'default');
    
    // 模拟对特定字段和键的调用返回非函数值
    mockGetFieldMetadata.mockImplementation((metadata, field, key) => {
      if (key === KEY_FIELD_ELEMENT_TYPE && field === 'items') {
        return 'Not a function but a string';
      }
      return originalGetFieldMetadata(metadata, field, key);
    });
    
    @Model
    class TestClass {
      items = [];
    }
    
    // 应该抛出TypeError
    expect(() => {
      getFieldElementType(TestClass, 'items');
    }).toThrow(TypeError);
    
    // 恢复原始实现
    mockGetFieldMetadata.mockRestore();
  });
  
  // 测试当options中的元素类型不是函数时抛出异常
  test('should throw TypeError when options element type is not a function', () => {
    @Model
    class TestClass {
      items = [];
    }
    
    // 故意在options中提供非函数的元素类型
    const options = {
      elementTypes: {
        '.items': 'Not a function'
      }
    };
    
    // 应该抛出TypeError
    expect(() => {
      getFieldElementType(TestClass, 'items', undefined, options);
    }).toThrow(TypeError);
  });
  
  // 测试从默认字段值中推断元素类型
  test('should infer element type from default field value', () => {
    @Model
    class Item {
      id = '';
      name = '';
    }
    
    @Model
    class TestClass {
      // 不使用@ElementType注解，但默认值是包含Item实例的数组
      items = [new Item()];
    }
    
    // 获取items字段的元素类型
    const elementType = getFieldElementType(TestClass, 'items');
    
    // 验证正确推断了元素类型
    expect(elementType).toBe(Item);
  });
  
  // 测试无法推断元素类型的情况
  test('should return null when element type cannot be inferred', () => {
    @Model
    class TestClass {
      // 空数组，无法推断元素类型
      items = [];
    }
    
    // 获取items字段的元素类型
    const elementType = getFieldElementType(TestClass, 'items');
    
    // 应该返回null
    expect(elementType).toBeNull();
  });
  
  // 测试当默认字段值为null或undefined时的情况
  test('should handle null or undefined default field value', () => {
    @Model
    class TestClass {
      nullItems = null;
      undefinedItems = undefined;
    }
    
    // 获取nullItems字段的元素类型
    const nullElementType = getFieldElementType(TestClass, 'nullItems');
    
    // 应该返回null
    expect(nullElementType).toBeNull();
    
    // 获取undefinedItems字段的元素类型
    const undefinedElementType = getFieldElementType(TestClass, 'undefinedItems');
    
    // 应该返回null
    expect(undefinedElementType).toBeNull();
  });
}); 