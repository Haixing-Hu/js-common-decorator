////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import defaultValidator from '../src/default-validator';
import CredentialType from './model/credential-type';

/**
 * Unit tests of the `defaultValidator()` function.
 *
 * @author Haixing Hu
 */
describe('Test `defaultValidator()` function', () => {
  test('value is undefined, context.nullable is true', () => {
    const context = { type: String, label: 'name', nullable: true };
    const result = defaultValidator(undefined, context);
    expect(result.success).toBe(true);
  });
  test('value is undefined, context.nullable is false', () => {
    let context = { type: String, label: 'name', nullable: false };
    let result = defaultValidator(undefined, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('必须设置name的值');

    context = { owner: 'Bill Gates', type: String, label: 'name', nullable: false };
    result = defaultValidator(undefined, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('必须设置Bill Gates的name的值');
  });
  test('value is null, context.nullable is true', () => {
    const context = { type: String, label: 'name', nullable: true };
    const result = defaultValidator(null, context);
    expect(result.success).toBe(true);
  });
  test('value is null, context.nullable is false', () => {
    let context = { type: String, label: 'name', nullable: false };
    let result = defaultValidator(null, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('必须设置name的值');

    context = { owner: 'Bill Gates', type: String, label: 'name', nullable: false };
    result = defaultValidator(null, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('必须设置Bill Gates的name的值');
  });

  test('value is an empty string, context.nonEmpty is true', () => {
    let context = { type: String, label: 'name', nonEmpty: true };
    let result = defaultValidator('', context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('name不能为空');

    context = { owner: 'Bill Gates', type: String, label: 'name', nonEmpty: true };
    result = defaultValidator('', context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Bill Gates的name不能为空');
  });
  test('value is an empty string, context.nonEmpty is false', () => {
    const context = { type: String, label: 'name', nonEmpty: false };
    const result = defaultValidator('', context);
    expect(result.success).toBe(true);
  });

  test('value is a primitive type with the corresponding built-in class in context.type', () => {
    const context = { type: String };
    const result = defaultValidator('test', context);
    expect(result.success).toBe(true);
  });
  test('value is a primitive type with a different built-in class in context.type', () => {
    let context = { type: Number, label: 'numberField' };
    let result = defaultValidator('test', context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('numberField必须是 Number 类型');

    context = { type: Number, label: 'numberField', owner: 'Test' };
    result = defaultValidator('test', context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Test的numberField必须是 Number 类型');
  });
  test('value is a built-in object with the same built-in class in context.type', () => {
    const dateString = new String('2023-01-01');
    const context = { type: String };
    const result = defaultValidator(dateString, context);
    expect(result.success).toBe(true);
  });
  test('value is a built-in object with a different built-in class in context.type', () => {
    const dateObj = new Date();
    let context = { type: String, label: 'stringField' };
    let result = defaultValidator(dateObj, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('stringField必须是 String 类型');

    context = { type: String, label: 'stringField', owner: 'Test' };
    result = defaultValidator(dateObj, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Test的stringField必须是 String 类型');
  });
  test('value is a user-defined class with the same class in context.type', () => {
    class CustomClass {}
    const customObj = new CustomClass();
    const context = { type: CustomClass };
    const result = defaultValidator(customObj, context);
    expect(result.success).toBe(true);
  });
  test('value is a user-defined class with a different class in context.type', () => {
    class CustomClass {}
    class DifferentClass {}
    const customObj = new CustomClass();
    let context = { type: DifferentClass, label: 'field' };
    let result = defaultValidator(customObj, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('field必须是 DifferentClass 类型');

    context = { type: DifferentClass, label: 'field', owner: 'Test' };
    result = defaultValidator(customObj, context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Test的field必须是 DifferentClass 类型');
  });
  test('context.type is an enumeration class and value is a valid enumerator', () => {
    const context = { type: CredentialType, label: 'Status' };
    const result = defaultValidator(CredentialType.IDENTITY_CARD, context);
    expect(result.success).toBe(true);
  });
  test('context.type is an enumeration class and value is a valid enum value', () => {
    const context = { type: CredentialType, label: 'Status' };
    const result = defaultValidator('IDENTITY_CARD', context);
    expect(result.success).toBe(true);
  });
  test('context.type is an enumeration class and value is not a valid enum value', () => {
    let context = { type: CredentialType, label: 'Status' };
    let result = defaultValidator('xxx', context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Status的值不受支持: xxx');

    context = { type: CredentialType, label: 'Status', owner: 'Test' };
    result = defaultValidator('xxx', context);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Test的Status的值不受支持: xxx');
  });

  test('value is an object with a validate method returning success', () => {
    class MockValidatable {
      validate() {
        return new ValidationResult(true);
      }
    }
    const validatableObj = new MockValidatable();
    const result = defaultValidator(validatableObj, {});
    expect(result.success).toBe(true);
  });
  test('value is an object with a validate method returning failure', () => {
    class MockInvalidValidatable {
      validate() {
        return new ValidationResult(false, 'Invalid object');
      }
    }
    const invalidValidatableObj = new MockInvalidValidatable();
    const result = defaultValidator(invalidValidatableObj, {});
    expect(result.success).toBe(false);
    expect(result.description).toBe('Invalid object');
  });
});
