////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试validateImpl函数
 */
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import validateImpl from '../../../src/impl/model/validate-impl';

// 模拟 ValidationResult.merge 方法
ValidationResult.merge = jest.fn((results) => {
  // 创建一个合并后的结果对象
  const merged = new ValidationResult(true);
  merged.fields = {};
  let allSuccess = true;

  results.forEach((result, index) => {
    if (!result.success) {
      allSuccess = false;
    }
    // 如果是针对单字段的结果，将其添加到 fields 对象中
    if (typeof index === 'string') {
      merged.fields[index] = result;
    }
  });

  merged.success = allSuccess;
  return merged;
});

// 添加 SUCCESS 静态属性
ValidationResult.SUCCESS = new ValidationResult(true);

// 模拟类定义
class MockClass {
  constructor() {
    this.id = '';
    this.name = '';
    this.age = 0;
  }

  // 模拟字段验证方法
  validateField(field, context) {
    const result = new ValidationResult(true);

    if (field === 'id' && this.id === '') {
      return new ValidationResult(false, 'ID不能为空');
    }
    if (field === 'name' && this.name === '') {
      return new ValidationResult(false, 'Name不能为空');
    }
    if (field === 'age' && this.age < 18) {
      return new ValidationResult(false, 'Age必须大于等于18');
    }
    return ValidationResult.SUCCESS;
  }
}

describe('validateImpl', () => {
  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();

    // 模拟 ValidationResult.merge 方法的实现
    ValidationResult.merge.mockImplementation((results) => {
      const merged = new ValidationResult(true);
      merged.fields = {};
      let allSuccess = true;

      // 处理数组类型的结果
      if (Array.isArray(results)) {
        results.forEach((result, index) => {
          if (result && !result.success) {
            allSuccess = false;
          }
        });
      }

      // 处理对象类型的结果
      if (typeof results === 'object' && !Array.isArray(results)) {
        Object.keys(results).forEach((key) => {
          const result = results[key];
          if (result && !result.success) {
            allSuccess = false;
          }
          merged.fields[key] = result;
        });
      }

      merged.success = allSuccess;
      return merged;
    });
  });

  test('当fields为*时应验证所有字段', () => {
    // 准备测试数据
    const instance = new MockClass();
    instance.id = '1';
    instance.name = ''; // 此字段将验证失败
    instance.age = 20;

    // 模拟验证结果
    const mockIdResult = new ValidationResult(true);
    const mockNameResult = new ValidationResult(false, 'Name不能为空');
    const mockAgeResult = new ValidationResult(true);

    // 替换实例的validateField方法
    instance.validateField = jest.fn()
      .mockImplementation((field) => {
        if (field === 'id') return mockIdResult;
        if (field === 'name') return mockNameResult;
        if (field === 'age') return mockAgeResult;
        return ValidationResult.SUCCESS;
      });

    // 准备模拟的合并结果
    const mockMergedResult = new ValidationResult(false);
    mockMergedResult.fields = {
      id: mockIdResult,
      name: mockNameResult,
      age: mockAgeResult
    };
    ValidationResult.merge.mockReturnValue(mockMergedResult);

    // 执行函数
    const result = validateImpl(MockClass, instance, '*', {});

    // 验证结果
    expect(result.success).toBe(false);
    expect(instance.validateField).toHaveBeenCalledWith('id', {});
    expect(instance.validateField).toHaveBeenCalledWith('name', {});
    expect(instance.validateField).toHaveBeenCalledWith('age', {});
    expect(ValidationResult.merge).toHaveBeenCalled();
  });

  test('当fields为特定字段时只验证指定字段', () => {
    // 准备测试数据
    const instance = new MockClass();
    instance.id = '';  // 会验证失败
    instance.name = ''; // 也会验证失败，但不在验证范围内
    instance.age = 15;  // 也会验证失败，但不在验证范围内

    // 模拟验证结果
    const mockIdResult = new ValidationResult(false, 'ID不能为空');

    // 替换实例的validateField方法
    instance.validateField = jest.fn()
      .mockReturnValue(mockIdResult);

    // 执行函数 - 只验证id字段
    const result = validateImpl(MockClass, instance, 'id', {});

    // 验证结果
    expect(result).toBe(mockIdResult);
    expect(instance.validateField).toHaveBeenCalledWith('id', {});
    expect(instance.validateField).toHaveBeenCalledTimes(1);
  });

  test('当fields为数组时应验证数组中的所有字段', () => {
    // 准备测试数据
    const instance = new MockClass();
    instance.id = '';  // 会验证失败
    instance.name = ''; // 也会验证失败
    instance.age = 15;  // 也会验证失败，但不在验证范围内

    // 模拟验证结果
    const mockIdResult = new ValidationResult(false, 'ID不能为空');
    const mockNameResult = new ValidationResult(false, 'Name不能为空');

    // 替换实例的validateField方法
    instance.validateField = jest.fn()
      .mockImplementation((field) => {
        if (field === 'id') return mockIdResult;
        if (field === 'name') return mockNameResult;
        return ValidationResult.SUCCESS;
      });

    // 准备模拟的合并结果
    const mockMergedResult = new ValidationResult(false);
    mockMergedResult.fields = {
      id: mockIdResult,
      name: mockNameResult
    };
    ValidationResult.merge.mockReturnValue(mockMergedResult);

    // 执行函数 - 验证id和name字段
    const result = validateImpl(MockClass, instance, ['id', 'name'], {});

    // 验证结果
    expect(result.success).toBe(false);
    expect(instance.validateField).toHaveBeenCalledWith('id', {});
    expect(instance.validateField).toHaveBeenCalledWith('name', {});
    expect(instance.validateField).not.toHaveBeenCalledWith('age', {});
    expect(ValidationResult.merge).toHaveBeenCalled();
  });

  test('当所有字段验证都成功时应返回成功结果', () => {
    // 准备测试数据
    const instance = new MockClass();
    instance.id = '1';
    instance.name = 'test';
    instance.age = 20;

    // 模拟验证结果
    const successResult = new ValidationResult(true);

    // 替换实例的validateField方法
    instance.validateField = jest.fn()
      .mockReturnValue(successResult);

    // 准备模拟的合并结果
    const mockMergedResult = new ValidationResult(true);
    mockMergedResult.fields = {
      id: successResult,
      name: successResult,
      age: successResult
    };
    ValidationResult.merge.mockReturnValue(mockMergedResult);

    // 执行函数
    const result = validateImpl(MockClass, instance, '*', {});

    // 验证结果
    expect(result.success).toBe(true);
    expect(ValidationResult.merge).toHaveBeenCalled();
  });

  test('当传入不存在的字段名时应返回成功结果', () => {
    // 准备测试数据
    const instance = new MockClass();

    // 替换实例的validateField方法
    instance.validateField = jest.fn()
      .mockReturnValue(new ValidationResult(true));

    // 执行函数 - 验证不存在的字段
    const result = validateImpl(MockClass, instance, 'nonExistField', {});

    // 验证结果 - 应返回成功
    expect(result.success).toBe(true);
    expect(instance.validateField).toHaveBeenCalledWith('nonExistField', {});
  });

  test('当实例没有validateField方法时应抛出错误', () => {
    // 准备测试数据 - 没有validateField方法的实例
    class ClassWithoutValidateField {
      constructor() {
        this.id = '';
      }
    }
    const instance = new ClassWithoutValidateField();

    // 执行函数应抛出错误
    expect(() => {
      validateImpl(ClassWithoutValidateField, instance, '*', {});
    }).toThrow();
  });
});
