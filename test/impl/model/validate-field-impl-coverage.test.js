////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import validateFieldImpl from '../../../src/impl/model/validate-field-impl';

/**
 * 此测试文件专门用于提高validate-field-impl.js文件的覆盖率
 * 特别是第47行，验证没有装饰 @Validatable 的字段时返回成功的验证结果的情况
 */
describe('validateFieldImpl enhanced coverage tests', () => {
  // 测试字段未被 @Validatable 装饰时返回成功结果
  test('should return success result when field is not decorated with @Validatable (line 47)', () => {
    // 创建一个普通的类，没有使用 @Validatable 装饰器
    class TestClass {}

    // 创建一个对象，包含一个普通字段
    const obj = new TestClass();
    obj.testField = 'test value';

    // 验证这个普通字段 - 这应该触发第47行的代码路径
    const result = validateFieldImpl(TestClass, obj, 'testField', {});

    // 由于该字段没有被 @Validatable 装饰，应该返回成功的验证结果
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
});
