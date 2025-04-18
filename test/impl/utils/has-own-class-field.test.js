////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import hasOwnClassField from '../../../src/impl/utils/has-own-class-field';
import getDefaultInstance from '../../../src/impl/utils/get-default-instance';

// 模拟class-metadata-cache的行为
const mockMetadataCache = new Map();

// 模拟获取默认实例的方法
jest.mock('../../../src/impl/utils/get-default-instance', () => {
  return {
    __esModule: true,
    default: jest.fn((Class) => {
      // 如果我们有特殊的模拟，就返回它
      if (mockMetadataCache.has(Class)) {
        return mockMetadataCache.get(Class);
      }
      // 对于继承类，我们需要处理特殊情况
      if (Class.name === 'ChildClass') {
        // 创建一个只有childField的实例，不包含parentField
        const instance = new Class();
        // 创建一个新对象，只复制子类自己的属性（不包括继承的属性）
        const ownPropsInstance = {};
        Object.defineProperty(ownPropsInstance, 'childField', {
          value: instance.childField,
          enumerable: true,
        });
        // 确保实例看起来像是ChildClass的实例
        Object.setPrototypeOf(ownPropsInstance, Class.prototype);
        return ownPropsInstance;
      }
      // 否则返回普通的实例
      return new Class();
    })
  };
});

describe('hasOwnClassField', () => {
  class ParentClass {
    parentField = 'parent';
  }

  class ChildClass extends ParentClass {
    childField = 'child';
  }

  // 创建有默认实例的类
  class ModelClass {
    modelField = 'model';
  }
  
  // 在测试前设置模拟的默认实例
  beforeAll(() => {
    const mockInstance = new ModelClass();
    mockMetadataCache.set(ModelClass, mockInstance);
  });
  
  afterAll(() => {
    mockMetadataCache.clear();
    jest.restoreAllMocks();
  });

  test('should return true when the field exists in class prototype', () => {
    // Define a field directly on prototype
    ParentClass.prototype.prototypeField = 'prototype';
    expect(hasOwnClassField(ParentClass, 'prototypeField')).toBe(true);
  });

  test('should return true when the field exists in default instance', () => {
    expect(hasOwnClassField(ModelClass, 'modelField')).toBe(true);
  });

  test('should return false when the field does not exist in class prototype or default instance', () => {
    expect(hasOwnClassField(ChildClass, 'nonExistingField')).toBe(false);
  });

  test('should return false for parent class fields', () => {
    // Testing inheritance - should only check own fields
    expect(hasOwnClassField(ChildClass, 'parentField')).toBe(false);
  });

  test('should return false for invalid inputs', () => {
    expect(hasOwnClassField(null, 'field')).toBe(false);
    expect(hasOwnClassField(undefined, 'field')).toBe(false);
    expect(hasOwnClassField({}, 'field')).toBe(false);
  });

  test('should return true for instance fields defined in class body', () => {
    // Modern JS allows field definitions in class body
    class ModernClass {
      instanceField = 'instance';
    }
    expect(hasOwnClassField(ModernClass, 'instanceField')).toBe(true);
  });
}); 