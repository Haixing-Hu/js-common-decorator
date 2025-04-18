////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isEnumerator from '../src/is-enumerator';
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

describe('isEnumerator', () => {
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
  
  // 验证我们的模拟正确
  expect(isEnumClass(Gender)).toBe(true);
  
  class RegularClass {
    constructor(value) {
      this.value = value;
    }
  }
  
  test('should return true for enum instances', () => {
    expect(isEnumerator(Gender.MALE)).toBe(true);
    expect(isEnumerator(Gender.FEMALE)).toBe(true);
  });
  
  test('should return false for primitive values', () => {
    expect(isEnumerator(null)).toBe(false);
    expect(isEnumerator(undefined)).toBe(false);
    expect(isEnumerator(123)).toBe(false);
    expect(isEnumerator('string')).toBe(false);
    expect(isEnumerator(true)).toBe(false);
    expect(isEnumerator(Symbol('symbol'))).toBe(false);
  });
  
  test('should return false for non-enum objects', () => {
    expect(isEnumerator({})).toBe(false);
    expect(isEnumerator([])).toBe(false);
    expect(isEnumerator(new Date())).toBe(false);
    expect(isEnumerator(new RegExp('.*'))).toBe(false);
    expect(isEnumerator(new RegularClass('value'))).toBe(false);
  });
  
  test('should return false for objects with no prototype', () => {
    const obj = Object.create(null);
    expect(isEnumerator(obj)).toBe(false);
  });
  
  test('should return false for enum class itself', () => {
    expect(isEnumerator(Gender)).toBe(false);
  });
  
  test('should handle objects mimicking enumerators', () => {
    // 尝试创建一个模拟枚举值但没有正确元数据的对象
    const mockEnumerator = new Gender('MOCK', 'Mock');
    expect(isEnumerator(mockEnumerator)).toBe(true); // 实际上会返回true，因为它的原型链是正确的
    
    // 创建一个完全不同的对象，但有相同字段名
    const fakeEnumerator = { value: 'FAKE', name: 'Fake' };
    expect(isEnumerator(fakeEnumerator)).toBe(false);
  });
}); 