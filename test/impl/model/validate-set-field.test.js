////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

// Mock ValidationResult before importing modules that use it
jest.mock('@qubit-ltd/common-validation-rule', () => {
  const ValidationResultMock = jest.fn().mockImplementation((success, message) => ({
    success,
    message,
  }));

  ValidationResultMock.merge = jest.fn().mockImplementation((results) => {
    if (results.length === 0) {
      return { success: true };
    }
    const hasFailure = results.some((r) => !r.success);
    if (hasFailure) {
      return { success: false, message: 'Some values are invalid' };
    }
    return { success: true };
  });

  return {
    ValidationResult: ValidationResultMock,
  };
});

// Import after mocking
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import validateEmptyField from '../../../src/impl/model/validate-empty-field';
import validateSetField from '../../../src/impl/model/validate-set-field';
import getElementValidationContext from '../../../src/impl/utils/get-element-validation-context';

// Mock dependencies
jest.mock('../../../src/impl/model/validate-empty-field');
jest.mock('../../../src/impl/utils/get-element-validation-context');

describe('validateSetField', () => {
  beforeEach(() => {
    // Reset all mocks
    validateEmptyField.mockReset();
    getElementValidationContext.mockReset();

    // Default mock implementations
    validateEmptyField.mockReturnValue(null); // No empty field validation error
    getElementValidationContext.mockReturnValue({}); // Empty context
  });

  test('should return null for non-Set values', () => {
    const Class = class TestClass {};
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = 'not a set';
    const validator = jest.fn();
    const context = {};

    const result = validateSetField(Class, metadata, obj, field, value, validator, context);

    expect(result).toBeNull();
    expect(validateEmptyField).not.toHaveBeenCalled();
    expect(getElementValidationContext).not.toHaveBeenCalled();
    expect(validator).not.toHaveBeenCalled();
  });

  test('should return empty field validation result if set is empty and validation fails', () => {
    const Class = class TestClass {};
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = new Set();
    const validator = jest.fn();
    const context = {};
    const emptyValidationResult = new ValidationResult(false, 'Set cannot be empty');

    validateEmptyField.mockReturnValue(emptyValidationResult);

    const result = validateSetField(Class, metadata, obj, field, value, validator, context);

    expect(result).toBe(emptyValidationResult);
    expect(validateEmptyField).toHaveBeenCalledWith(metadata, obj, field, value, context);
    expect(getElementValidationContext).not.toHaveBeenCalled();
    expect(validator).not.toHaveBeenCalled();
  });

  test('should validate each element in the set and merge results', () => {
    const Class = class TestClass {};
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = new Set(['value1', 'value2', 'value3']);
    const validator = jest.fn();
    const context = {};
    const elementContext = { someOption: true };

    getElementValidationContext.mockReturnValue(elementContext);

    // Mock validator to return success for first two values and failure for the third
    validator.mockImplementation((val, ctx) => {
      if (val === 'value3') {
        return new ValidationResult(false, 'Invalid value');
      }
      return new ValidationResult(true);
    });

    // Mock ValidationResult.merge
    const originalMerge = ValidationResult.merge;
    ValidationResult.merge = jest.fn().mockReturnValue(new ValidationResult(false, 'Some values are invalid'));

    const result = validateSetField(Class, metadata, obj, field, value, validator, context);

    expect(result).toBeTruthy();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Some values are invalid');

    expect(validateEmptyField).toHaveBeenCalledWith(metadata, obj, field, value, context);
    expect(getElementValidationContext).toHaveBeenCalledWith(Class, metadata, obj, field, context);

    // Validator should be called for each value in the set
    expect(validator).toHaveBeenCalledTimes(3);

    // Since Set doesn't guarantee order, we can't check exact index values
    // Instead, check that validator was called with each value and some context
    expect(validator).toHaveBeenCalledWith('value1', expect.objectContaining({ someOption: true }));
    expect(validator).toHaveBeenCalledWith('value2', expect.objectContaining({ someOption: true }));
    expect(validator).toHaveBeenCalledWith('value3', expect.objectContaining({ someOption: true }));

    // ValidationResult.merge should be called with an array of results
    expect(ValidationResult.merge).toHaveBeenCalled();

    // Restore original merge function
    ValidationResult.merge = originalMerge;
  });

  test('should handle empty sets correctly', () => {
    const Class = class TestClass {};
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = new Set();
    const validator = jest.fn();
    const context = {};

    // Mock ValidationResult.merge to return success for empty array
    const originalMerge = ValidationResult.merge;
    ValidationResult.merge = jest.fn().mockReturnValue(new ValidationResult(true));

    const result = validateSetField(Class, metadata, obj, field, value, validator, context);

    expect(result).toBeTruthy();
    expect(result.success).toBe(true);

    expect(validateEmptyField).toHaveBeenCalledWith(metadata, obj, field, value, context);
    expect(getElementValidationContext).toHaveBeenCalledWith(Class, metadata, obj, field, context);

    // Validator should not be called for empty set
    expect(validator).not.toHaveBeenCalled();

    // ValidationResult.merge should be called with empty array
    expect(ValidationResult.merge).toHaveBeenCalledWith([]);

    // Restore original merge function
    ValidationResult.merge = originalMerge;
  });
});
