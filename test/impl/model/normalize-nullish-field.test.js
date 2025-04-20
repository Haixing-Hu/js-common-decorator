////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import normalizeNullishField from '../../../src/impl/model/normalize-nullish-field';
import getDefaultInstance from '../../../src/impl/utils/get-default-instance';

// 模拟getDefaultInstance函数
jest.mock('../../../src/impl/utils/get-default-instance');

describe('normalizeNullishField', () => {
  // 定义测试类
  class TestClass {
    constructor() {
      this.stringField = '';
      this.numberField = 0;
      this.booleanField = false;
      this.objectField = null;
      this.arrayField = [];
    }
  }

  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();
    // 设置默认实例返回值
    const defaultInstance = new TestClass();
    defaultInstance.stringField = 'default';
    defaultInstance.numberField = 42;
    defaultInstance.booleanField = true;
    defaultInstance.objectField = { key: 'value' };
    defaultInstance.arrayField = [1, 2, 3];
    getDefaultInstance.mockReturnValue(defaultInstance);
  });

  test('should return true and set default value when field value is undefined', () => {
    const obj = new TestClass();
    obj.stringField = undefined;

    const result = normalizeNullishField(TestClass, obj, 'stringField', undefined);

    expect(result).toBe(true);
    expect(obj.stringField).toBe('default');
    expect(getDefaultInstance).toHaveBeenCalledWith(TestClass);
  });

  test('should return true and set default value when field value is null', () => {
    const obj = new TestClass();
    obj.numberField = null;

    const result = normalizeNullishField(TestClass, obj, 'numberField', null);

    expect(result).toBe(true);
    expect(obj.numberField).toBe(42);
    expect(getDefaultInstance).toHaveBeenCalledWith(TestClass);
  });

  test('should return false and not modify field when value is a valid string', () => {
    const obj = new TestClass();
    obj.stringField = 'test';

    const result = normalizeNullishField(TestClass, obj, 'stringField', 'test');

    expect(result).toBe(false);
    expect(obj.stringField).toBe('test');
    expect(getDefaultInstance).not.toHaveBeenCalled();
  });

  test('should return false and not modify field when value is zero', () => {
    const obj = new TestClass();
    obj.numberField = 0;

    const result = normalizeNullishField(TestClass, obj, 'numberField', 0);

    expect(result).toBe(false);
    expect(obj.numberField).toBe(0);
    expect(getDefaultInstance).not.toHaveBeenCalled();
  });

  test('should return false and not modify field when value is empty string', () => {
    const obj = new TestClass();
    obj.stringField = '';

    const result = normalizeNullishField(TestClass, obj, 'stringField', '');

    expect(result).toBe(false);
    expect(obj.stringField).toBe('');
    expect(getDefaultInstance).not.toHaveBeenCalled();
  });

  test('should return false and not modify field when value is false', () => {
    const obj = new TestClass();
    obj.booleanField = false;

    const result = normalizeNullishField(TestClass, obj, 'booleanField', false);

    expect(result).toBe(false);
    expect(obj.booleanField).toBe(false);
    expect(getDefaultInstance).not.toHaveBeenCalled();
  });

  test('should return false and not modify field when value is empty array', () => {
    const obj = new TestClass();
    obj.arrayField = [];

    const result = normalizeNullishField(TestClass, obj, 'arrayField', []);

    expect(result).toBe(false);
    expect(obj.arrayField).toEqual([]);
    expect(getDefaultInstance).not.toHaveBeenCalled();
  });

  test('should return false and not modify field when value is empty object', () => {
    const obj = new TestClass();
    obj.objectField = {};

    const result = normalizeNullishField(TestClass, obj, 'objectField', {});

    expect(result).toBe(false);
    expect(obj.objectField).toEqual({});
    expect(getDefaultInstance).not.toHaveBeenCalled();
  });
});
