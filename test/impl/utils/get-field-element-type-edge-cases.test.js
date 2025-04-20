////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType, Model } from '../../../src';
import getFieldElementType from '../../../src/impl/utils/get-field-element-type';

/**
 * 测试getFieldElementType函数中的边缘情况
 */
describe('getFieldElementType edge cases', () => {
  it('should throw TypeError if options.elementTypes[path] is not a function', () => {
    // 创建一个普通类
    class TestClass {}

    // 创建一个带有无效元素类型的选项对象
    const options = {
      elementTypes: {
        '.items': 'not a function', // 这不是函数
      },
    };

    // 应该抛出TypeError
    expect(() => {
      getFieldElementType(TestClass, 'items', '.items', options);
    }).toThrow(TypeError);
  });

  it('should return null if no element type information is available', () => {
    // 创建一个普通类
    @Model
    class EmptyClass {
      // 这个字段没有ElementType注解
      items = [];
    }

    // 应该返回null
    expect(getFieldElementType(EmptyClass, 'items')).toBeNull();
  });

  it('should get element type from default instance collection', () => {
    // 创建一个类，其字段默认值是一个包含元素的数组
    class Item {}

    @Model
    class TestClass {
      // 数组默认包含一个Item实例
      items = [new Item()];
    }

    // 应该能从默认实例中推断出元素类型
    expect(getFieldElementType(TestClass, 'items')).toBe(Item);
  });

  it('should return null if default instance field value is empty collection', () => {
    @Model
    class TestClass {
      // 空数组
      items = [];
    }

    // 空集合无法推断元素类型，应返回null
    expect(getFieldElementType(TestClass, 'items')).toBeNull();
  });

  it('should get element type from field decorator', () => {
    class Item {}

    @Model
    class TestClass {
      @ElementType(Item)
      items = [];
    }

    // 应该从装饰器中获取元素类型
    expect(getFieldElementType(TestClass, 'items')).toBe(Item);
  });
});
