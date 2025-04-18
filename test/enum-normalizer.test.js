////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import enumNormalizer from '../src/enum-normalizer';
import isEnumClass from '../src/is-enum-class';

// 模拟枚举类的元数据
function mockEnumClass(Class) {
  // 模拟标记为枚举类
  Class.prototype.constructor.__cd_category__ = 'enum';
  // 为新的元数据系统设置
  if (!Class[Symbol.metadata]) {
    Class[Symbol.metadata] = Object.create(null);
  }
  Class[Symbol.metadata].__cd_category__ = 'enum';
  
  // 添加of方法
  Class.of = function(value) {
    if (value === null || value === undefined) {
      return null;
    }
    if (value instanceof Class) {
      return value;
    }
    const strValue = String(value).toUpperCase();
    // 查找匹配的枚举值
    for (const key in Class) {
      if (Class.hasOwnProperty(key) && Class[key] instanceof Class) {
        if (Class[key].value.toUpperCase() === strValue) {
          return Class[key];
        }
        if (Class[key].name && Class[key].name === value) {
          return Class[key];
        }
      }
    }
    return null;
  };
  return Class;
}

describe('enumNormalizer', () => {
  // 创建枚举类
  class Gender {
    static MALE = new Gender('MALE', '男');
    static FEMALE = new Gender('FEMALE', '女');
    
    constructor(value, name) {
      this.value = value;
      this.name = name;
    }
  }
  // 模拟枚举类
  mockEnumClass(Gender);
  
  class Status {
    static ACTIVE = new Status('ACTIVE', '活跃');
    static INACTIVE = new Status('INACTIVE', '不活跃');
    static PENDING = new Status('PENDING', '待定');
    
    constructor(value, name) {
      this.value = value;
      this.name = name;
    }
  }
  // 模拟枚举类
  mockEnumClass(Status);
  
  // 验证我们的模拟正确
  expect(isEnumClass(Gender)).toBe(true);
  expect(isEnumClass(Status)).toBe(true);
  
  test('should return a function', () => {
    const normalizer = enumNormalizer(Gender);
    expect(typeof normalizer).toBe('function');
  });
  
  test('should normalize string value to enum instance', () => {
    const normalizer = enumNormalizer(Gender);
    
    const result1 = normalizer('MALE');
    expect(result1).toBe(Gender.MALE);
    
    const result2 = normalizer('FEMALE');
    expect(result2).toBe(Gender.FEMALE);
  });
  
  test('should normalize case-insensitive string value', () => {
    const normalizer = enumNormalizer(Status);
    
    const result = normalizer('active');
    expect(result).toBe(Status.ACTIVE);
  });
  
  test('should normalize by name property', () => {
    const normalizer = enumNormalizer(Status);
    
    const result = normalizer('活跃');
    expect(result).toBe(Status.ACTIVE);
  });
  
  test('should return null if input is not a valid enum value or name', () => {
    const normalizer = enumNormalizer(Gender);
    
    // This will result in null since the enum's of() method returns null for invalid values
    const result = normalizer('UNKNOWN');
    expect(result).toBeNull();
  });
  
  test('should throw TypeError if argument is not an enum class', () => {
    class RegularClass {}
    
    expect(() => {
      enumNormalizer(RegularClass);
    }).toThrow(TypeError);
    
    expect(() => {
      enumNormalizer(RegularClass)('someValue');
    }).toThrow(TypeError);
  });
  
  test('should handle null and undefined inputs', () => {
    const normalizer = enumNormalizer(Gender);
    
    // Enum.of() typically returns null for nullish values
    expect(normalizer(null)).toBeNull();
    expect(normalizer(undefined)).toBeNull();
  });
  
  test('should pass through enum instances unchanged', () => {
    const normalizer = enumNormalizer(Gender);
    
    const result = normalizer(Gender.MALE);
    expect(result).toBe(Gender.MALE);
  });
}); 