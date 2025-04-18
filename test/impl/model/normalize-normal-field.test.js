////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import normalizeNormalField from '../../../src/impl/model/normalize-normal-field';
import getFieldType from '../../../src/impl/utils/get-field-type';

// 模拟getFieldType函数
jest.mock('../../../src/impl/utils/get-field-type');

describe('normalizeNormalField', () => {
  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();
    // 默认返回String类型
    getFieldType.mockReturnValue(String);
  });

  // 定义测试类
  class TestClass {
    constructor() {
      this.name = '';
      this.age = 0;
      this.isActive = false;
    }
  }

  test('should call normalizer with correct context and value', () => {
    const obj = new TestClass();
    const value = 'test value';
    const options = {
      path: '',
      types: { '.name': String },
      elementTypes: {},
    };
    // 模拟normalizer函数
    const normalizer = jest.fn((val, context) => val.toUpperCase());

    const result = normalizeNormalField(TestClass, obj, 'name', value, options, normalizer);

    // 验证结果
    expect(result).toBe(true);
    expect(obj.name).toBe('TEST VALUE');

    // 验证getFieldType被正确调用
    expect(getFieldType).toHaveBeenCalledWith(TestClass, 'name', '.name', options);

    // 验证normalizer被正确调用，并且传递了正确的参数
    expect(normalizer).toHaveBeenCalledTimes(1);
    expect(normalizer).toHaveBeenCalledWith(value, {
      type: String,
      path: '.name',
      types: options.types,
      elementTypes: options.elementTypes,
    });
  });

  test('should handle different field types', () => {
    // 模拟不同的字段类型
    getFieldType.mockReturnValueOnce(Number);

    const obj = new TestClass();
    const value = '42';
    const options = {
      path: '',
      types: { '.age': Number },
      elementTypes: {},
    };

    // 模拟normalizer函数根据类型进行转换
    const normalizer = jest.fn((val, context) => {
      if (context.type === Number) {
        return parseInt(val, 10);
      }
      return val;
    });

    const result = normalizeNormalField(TestClass, obj, 'age', value, options, normalizer);

    // 验证结果
    expect(result).toBe(true);
    expect(obj.age).toBe(42);

    // 验证getFieldType被正确调用
    expect(getFieldType).toHaveBeenCalledWith(TestClass, 'age', '.age', options);

    // 验证normalizer被正确调用，并且传递了正确的参数
    expect(normalizer).toHaveBeenCalledTimes(1);
    expect(normalizer).toHaveBeenCalledWith(value, {
      type: Number,
      path: '.age',
      types: options.types,
      elementTypes: options.elementTypes,
    });
  });

  test('should handle nested paths in options', () => {
    const obj = new TestClass();
    const value = { nested: 'value' };
    const options = {
      path: 'parent',
      types: { 'parent.objField': Object },
      elementTypes: { 'parent.objField.nested': String },
    };
    const normalizer = jest.fn((val) => val);

    const result = normalizeNormalField(TestClass, obj, 'objField', value, options, normalizer);

    // 验证结果
    expect(result).toBe(true);

    // 验证getFieldType被正确调用
    expect(getFieldType).toHaveBeenCalledWith(TestClass, 'objField', 'parent.objField', options);

    // 验证normalizer被正确调用，并且传递了正确的参数
    expect(normalizer).toHaveBeenCalledTimes(1);
    expect(normalizer).toHaveBeenCalledWith(value, {
      type: String, // 从getFieldType的模拟返回值获取
      path: 'parent.objField',
      types: options.types,
      elementTypes: options.elementTypes,
    });
  });

  test('should pass options to context if options are provided as an empty object', () => {
    const obj = new TestClass();
    const value = 'test';
    const options = { path: '' }; // 必须包含path属性
    const normalizer = jest.fn((val) => val);

    const result = normalizeNormalField(TestClass, obj, 'name', value, options, normalizer);

    // 验证结果
    expect(result).toBe(true);

    // 验证getFieldType被正确调用，使用提供的选项
    expect(getFieldType).toHaveBeenCalledWith(TestClass, 'name', '.name', options);

    // 验证normalizer被正确调用，并且传递了上下文
    expect(normalizer).toHaveBeenCalledTimes(1);
    expect(normalizer).toHaveBeenCalledWith(value, {
      type: String,
      path: '.name',
      types: undefined,
      elementTypes: undefined,
    });
  });

  test('should use default path when options.path is undefined', () => {
    const obj = new TestClass();
    const value = 'test';
    const options = { path: undefined }; // 路径未定义
    const normalizer = jest.fn((val) => val);

    const result = normalizeNormalField(TestClass, obj, 'name', value, options, normalizer);

    // 验证结果
    expect(result).toBe(true);

    // 验证getFieldType被正确调用，使用"undefined.name"作为路径
    expect(getFieldType).toHaveBeenCalledWith(TestClass, 'name', 'undefined.name', options);

    // 验证normalizer被正确调用
    expect(normalizer).toHaveBeenCalledTimes(1);
    expect(normalizer).toHaveBeenCalledWith(value, {
      type: String,
      path: 'undefined.name',
      types: undefined,
      elementTypes: undefined,
    });
  });
});
