/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { ValidationResult } from '@/index';

/**
 * 单元测试 ValidationResult.merge
 *
 * @author 胡海星
 */
describe('ValidationResult.merge', () => {
  test('参数为undefined', () => {
    const merged = ValidationResult.merge();
    expect(merged.success).toBe(true);
    expect(merged.description).toBe('');
  });
  test('参数为null', () => {
    const merged = ValidationResult.merge(null);
    expect(merged.success).toBe(true);
    expect(merged.description).toBe('');
  });
  // test('参数为空数组', () => {
  //   const args = [];
  //   const merged = ValidationResult.merge(args);
  //   expect(merged.success).toBe(true);
  //   expect(merged.description).toBe('');
  // });
  test('参数为单个success的ValidationResult', () => {
    const r0 = new ValidationResult();
    const merged = ValidationResult.merge([r0]);
    expect(merged.success).toBe(true);
    expect(merged.description).toBe('');
  });
  test('参数为单个fail的ValidationResult', () => {
    const r0 = new ValidationResult(false, '错误原因0');
    const merged = ValidationResult.merge([r0]);
    expect(merged.success).toBe(false);
    expect(merged.description).toBe('错误原因0');
  });
  test('参数为多个success的ValidationResult', () => {
    const r0 = new ValidationResult();
    const r1 = new ValidationResult();
    const r2 = new ValidationResult();
    const merged = ValidationResult.merge([r0, r1, r2]);
    expect(merged.success).toBe(true);
    expect(merged.description).toBe('');
  });
  test('参数为多个failed的ValidationResult', () => {
    const r0 = new ValidationResult(false, '错误原因0');
    const r1 = new ValidationResult(false, '错误原因1');
    const r2 = new ValidationResult(false, '错误原因2');
    const merged = ValidationResult.merge([r0, r1, r2]);
    expect(merged.success).toBe(false);
    expect(merged.description).toBe('错误原因0');
  });
  test('参数为多个success或failed的ValidationResult', () => {
    const r0 = new ValidationResult(true);
    const r1 = new ValidationResult(false, '错误原因1');
    const r2 = new ValidationResult(false, '错误原因2');
    const merged = ValidationResult.merge([r0, r1, r2]);
    expect(merged.success).toBe(false);
    expect(merged.description).toBe('错误原因1');
  });
});
