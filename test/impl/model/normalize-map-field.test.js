////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import normalizeMapField from '../../../src/impl/model/normalize-map-field';
import getFieldElementType from '../../../src/impl/utils/get-field-element-type';

// 模拟getFieldElementType函数
jest.mock('../../../src/impl/utils/get-field-element-type');

describe('normalizeMapField', () => {
  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();
    // 默认返回String类型
    getFieldElementType.mockReturnValue(String);
  });

  // 定义测试类
  class TestClass {
    constructor() {
      this.stringMap = new Map();
      this.objectMap = new Map();
      this.numberMap = new Map();
      this.nonMapField = [];
    }
  }

  test('should return false for non-Map value', () => {
    const obj = new TestClass();
    const value = ['item1', 'item2'];
    obj.nonMapField = value;  // 设置初始值
    const options = { path: '', types: {}, elementTypes: {} };
    const normalizer = jest.fn();

    const result = normalizeMapField(TestClass, obj, 'nonMapField', value, options, normalizer);

    expect(result).toBe(false);
    expect(normalizer).not.toHaveBeenCalled();
    // 当返回false时，字段不会被修改，所以它仍然是原始值
    expect(obj.nonMapField).toBe(value);
  });

  test('should normalize each value in the map using the normalizer', () => {
    const obj = new TestClass();
    const map = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    obj.stringMap = map;
    const options = {
      path: '',
      types: {},
      elementTypes: { '.stringMap': String },
    };
    // 模拟normalizer函数将字符串转为大写
    const normalizer = jest.fn((val) => val.toUpperCase());

    const result = normalizeMapField(TestClass, obj, 'stringMap', map, options, normalizer);

    // 验证结果
    expect(result).toBe(true);
    expect(obj.stringMap).toBeInstanceOf(Map);
    expect(obj.stringMap.size).toBe(2);
    expect(obj.stringMap.get('key1')).toBe('VALUE1');
    expect(obj.stringMap.get('key2')).toBe('VALUE2');

    // 验证getFieldElementType被正确调用
    expect(getFieldElementType).toHaveBeenCalledWith(TestClass, 'stringMap', '.stringMap', options);

    // 验证normalizer被正确调用了两次，一次处理'value1'，一次处理'value2'
    expect(normalizer).toHaveBeenCalledTimes(2);
    expect(normalizer).toHaveBeenCalledWith('value1', {
      type: String,
      path: '.stringMap',
      types: options.types,
      elementTypes: options.elementTypes,
    });
    expect(normalizer).toHaveBeenCalledWith('value2', {
      type: String,
      path: '.stringMap',
      types: options.types,
      elementTypes: options.elementTypes,
    });
  });

  test('should handle complex objects in map values', () => {
    // 模拟元素类型为对象
    class Person {
      constructor(name, age) {
        this.name = name;
        this.age = age;
      }
    }
    getFieldElementType.mockReturnValue(Person);

    const obj = new TestClass();
    const map = new Map([
      ['person1', { name: 'Alice', age: '25' }],
      ['person2', { name: 'Bob', age: '30' }],
    ]);
    obj.objectMap = map;
    const options = {
      path: '',
      types: {},
      elementTypes: { '.objectMap': Person },
    };

    // 模拟normalizer函数转换对象为Person实例并将age转为数字
    const normalizer = jest.fn((val, context) => {
      if (typeof val === 'object' && val !== null && context.type === Person) {
        const person = new Person(val.name, parseInt(val.age, 10));
        return person;
      }
      return val;
    });

    const result = normalizeMapField(TestClass, obj, 'objectMap', map, options, normalizer);

    // 验证结果
    expect(result).toBe(true);
    expect(obj.objectMap).toBeInstanceOf(Map);
    expect(obj.objectMap.size).toBe(2);

    const person1 = obj.objectMap.get('person1');
    const person2 = obj.objectMap.get('person2');

    expect(person1).toBeInstanceOf(Person);
    expect(person1.name).toBe('Alice');
    expect(person1.age).toBe(25);

    expect(person2).toBeInstanceOf(Person);
    expect(person2.name).toBe('Bob');
    expect(person2.age).toBe(30);

    // 验证getFieldElementType被正确调用
    expect(getFieldElementType).toHaveBeenCalledWith(TestClass, 'objectMap', '.objectMap', options);

    // 验证normalizer被正确调用
    expect(normalizer).toHaveBeenCalledTimes(2);
    expect(normalizer).toHaveBeenCalledWith({ name: 'Alice', age: '25' }, {
      type: Person,
      path: '.objectMap',
      types: options.types,
      elementTypes: options.elementTypes,
    });
    expect(normalizer).toHaveBeenCalledWith({ name: 'Bob', age: '30' }, {
      type: Person,
      path: '.objectMap',
      types: options.types,
      elementTypes: options.elementTypes,
    });
  });

  test('should handle nested paths in options', () => {
    const obj = new TestClass();
    const map = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]);
    obj.stringMap = map;
    const options = {
      path: 'parent',
      types: {},
      elementTypes: { 'parent.stringMap': String },
    };
    const normalizer = jest.fn((val) => val);

    const result = normalizeMapField(TestClass, obj, 'stringMap', map, options, normalizer);

    // 验证结果
    expect(result).toBe(true);

    // 验证getFieldElementType被正确调用，使用正确的路径
    expect(getFieldElementType).toHaveBeenCalledWith(TestClass, 'stringMap', 'parent.stringMap', options);

    // 验证normalizer被正确调用，使用正确的路径
    expect(normalizer).toHaveBeenCalledWith('value1', {
      type: String,
      path: 'parent.stringMap',
      types: options.types,
      elementTypes: options.elementTypes,
    });
  });

  test('should handle empty options by using default values', () => {
    const obj = new TestClass();
    const map = new Map([['key', 'value']]);
    obj.stringMap = map;
    const options = { path: undefined }; // 空路径
    const normalizer = jest.fn((val) => val);

    const result = normalizeMapField(TestClass, obj, 'stringMap', map, options, normalizer);

    // 验证结果
    expect(result).toBe(true);

    // 验证getFieldElementType被正确调用，使用"undefined.stringMap"作为路径
    expect(getFieldElementType).toHaveBeenCalledWith(TestClass, 'stringMap', 'undefined.stringMap', options);

    // 验证normalizer被正确调用，使用正确的上下文
    expect(normalizer).toHaveBeenCalledWith('value', {
      type: String,
      path: 'undefined.stringMap',
      types: undefined,
      elementTypes: undefined,
    });
  });
});
