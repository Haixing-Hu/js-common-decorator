////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import validateEmptyField from '../../../src/impl/model/validate-empty-field';

/**
 * 此测试文件专门用于提高validate-empty-field.js文件的覆盖率
 * 特别是第52行，验证空字段但未被标记为NonEmpty时返回成功的验证结果的情况
 */
describe('validateEmptyField enhanced coverage tests', () => {
  // 测试值为空且字段未被标记为非空时返回成功结果
  test('should return success result when field is empty but not marked as non-empty (line 52)', () => {
    // 创建测试数据 - 空字符串值是一个"空"值
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = '';  // 空字符串是一个空值
    
    // 创建上下文，确保 nonEmpty 标志为 false
    const context = { nonEmpty: false };
    
    // 执行测试 - 这应该触发第52行的代码路径
    const result = validateEmptyField(metadata, obj, field, value, context);
    
    // 验证结果是成功的验证结果
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
}); 