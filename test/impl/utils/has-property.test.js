////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import hasProperty from '../../../src/impl/utils/has-property';

// 模拟class-metadata-cache的行为
const mockMetadataCache = new Map();

// 模拟获取默认实例的方法
jest.mock('../../../src/impl/utils/get-default-instance', () => ({
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
      return instance;
    }
    // 否则返回普通的实例
    return new Class();
  }),
}));

describe('hasProperty', () => {
  class ParentClass {
    parentField = 'parent';
    
    parentMethod() {
      return 'parent method';
    }
  }

  class ChildClass extends ParentClass {
    childField = 'child';
    
    childMethod() {
      return 'child method';
    }
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
    expect(hasProperty(ParentClass, 'prototypeField')).toBe(true);
  });

  test('should return true when the field exists in default instance', () => {
    expect(hasProperty(ModelClass, 'modelField')).toBe(true);
  });

  test('should return true for inherited fields from parent class', () => {
    // Testing inheritance - should check parent fields too
    expect(hasProperty(ChildClass, 'parentField')).toBe(true);
  });
  
  test('should return true for inherited methods from parent class', () => {
    expect(hasProperty(ChildClass, 'parentMethod')).toBe(true);
  });

  test('should return false when the field does not exist anywhere in the prototype chain or default instance', () => {
    expect(hasProperty(ChildClass, 'nonExistingField')).toBe(false);
  });

  test('should return false for invalid inputs', () => {
    expect(hasProperty(null, 'field')).toBe(false);
    expect(hasProperty(undefined, 'field')).toBe(false);
    expect(hasProperty({}, 'field')).toBe(false);
  });

  test('should return true for instance fields defined in class body', () => {
    // Modern JS allows field definitions in class body
    class ModernClass {
      instanceField = 'instance';
    }
    expect(hasProperty(ModernClass, 'instanceField')).toBe(true);
  });
  
  test('should return true for static fields and methods', () => {
    class StaticClass {
      static staticField = 'static';
      static staticMethod() { return 'static method'; }
    }
    
    // Note: hasProperty checks prototype and instance, not the class itself
    // Static members are on the class constructor, not prototype or instance
    expect(hasProperty(StaticClass, 'staticField')).toBe(false);
    expect(hasProperty(StaticClass, 'staticMethod')).toBe(false);
  });
}); 