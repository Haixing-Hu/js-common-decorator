////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from '@qubit-ltd/json';
import { toJsonString } from '../src';

// 模拟实现对象的 toJSON 方法
const originalObjectToJSON = Object.prototype.toJSON;
const before_all = () => {
  // 添加 toJSON 方法到 Object.prototype 使所有对象都有此方法
  if (!Object.prototype.toJSON) {
    // eslint-disable-next-line no-extend-native
    Object.prototype.toJSON = function toJson() {
      return this;
    };
  }
};

const after_all = () => {
  // 测试结束后恢复原始状态
  if (originalObjectToJSON) {
    // eslint-disable-next-line no-extend-native
    Object.prototype.toJSON = originalObjectToJSON;
  } else {
    delete Object.prototype.toJSON;
  }
};

describe('Test toJsonString() function', () => {
  beforeAll(() => {
    before_all();
  });

  afterAll(() => {
    after_all();
  });

  test('should throw TypeError for non-object inputs', () => {
    expect(() => toJsonString(null)).toThrow(TypeError);
    expect(() => toJsonString(undefined)).toThrow(TypeError);
    expect(() => toJsonString('string')).toThrow(TypeError);
    expect(() => toJsonString(123)).toThrow(TypeError);
    expect(() => toJsonString(true)).toThrow(TypeError);
  });

  test('should serialize simple objects correctly', () => {
    const obj = { name: 'John', age: 30 };
    const result = toJsonString(obj);
    expect(result).toBe(Json.stringify(obj));
  });

  test('should handle bigint values correctly', () => {
    const obj = { id: 9223372036854775807n };
    const result = toJsonString(obj);
    expect(result).toBe('{"id":9223372036854775807}');
  });

  test('should apply spacing for better readability', () => {
    const obj = { name: 'John', age: 30 };
    const result = toJsonString(obj, { space: 2 });
    expect(result).toBe(Json.stringify(obj, null, 2));
  });

  test('should apply string spacing', () => {
    const obj = { name: 'John', age: 30 };
    const result = toJsonString(obj, { space: '  ' });
    expect(result).toBe(Json.stringify(obj, null, '  '));
  });

  // 移除使用@Model装饰器的测试用例，该方式不适用于当前的库
  test('should handle custom class objects', () => {
    class Person {
      constructor() {
        this.name = 'John';
        this.age = 30;
      }

      // 模拟normalize方法
      normalize() {
        this.name = this.name.trim();
        return this;
      }

      // 模拟toJSON方法
      toJSON() {
        return {
          fullName: this.name,
          yearOfBirth: new Date().getFullYear() - this.age,
        };
      }
    }

    const person = new Person();
    const result = toJsonString(person);
    expect(result).toMatch(/"fullName"/);
    expect(result).toMatch(/"yearOfBirth":/);
  });

  test('should handle arrays and nested objects', () => {
    const obj = {
      name: 'John',
      contacts: [
        { type: 'email', value: 'john@example.com' },
        { type: 'phone', value: '123-456-7890' },
      ],
    };
    const result = toJsonString(obj);
    expect(result).toContain('"contacts":[');
    expect(result).toContain('"type":"email"');
    expect(result).toContain('"value":"john@example.com"');
  });
});
