////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

// Mock ValidationResult before importing modules that use it
jest.mock('@qubit-ltd/common-validation-rule', () => ({
  ValidationResult: jest.fn().mockImplementation((success, message) => ({
    success,
    message,
  })),
}));

// Import after mocking
import validateNullishField from '../../../src/impl/model/validate-nullish-field';
import getFieldLabel from '../../../src/impl/utils/get-field-label';
import getInstanceName from '../../../src/impl/utils/get-instance-name';
import isFieldNullable from '../../../src/impl/utils/is-field-nullable';

// Mock dependencies
jest.mock('../../../src/impl/utils/is-field-nullable');
jest.mock('../../../src/impl/utils/get-instance-name');
jest.mock('../../../src/impl/utils/get-field-label');

describe('validateNullishField', () => {
  beforeEach(() => {
    // Reset all mocks
    isFieldNullable.mockReset();
    getInstanceName.mockReset();
    getFieldLabel.mockReset();
  });

  test('should return null for non-nullish values', () => {
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = 'test';

    const result = validateNullishField(metadata, obj, field, value);

    expect(result).toBeNull();
    expect(isFieldNullable).not.toHaveBeenCalled();
    expect(getInstanceName).not.toHaveBeenCalled();
    expect(getFieldLabel).not.toHaveBeenCalled();
  });

  test('should return success result for nullable field with null value', () => {
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = null;

    isFieldNullable.mockReturnValue(true);

    const result = validateNullishField(metadata, obj, field, value);

    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
    expect(isFieldNullable).toHaveBeenCalledWith(metadata, field);
    expect(getInstanceName).not.toHaveBeenCalled();
    expect(getFieldLabel).not.toHaveBeenCalled();
  });

  test('should return success result for nullable field with undefined value', () => {
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = undefined;

    isFieldNullable.mockReturnValue(true);

    const result = validateNullishField(metadata, obj, field, value);

    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
    expect(isFieldNullable).toHaveBeenCalledWith(metadata, field);
    expect(getInstanceName).not.toHaveBeenCalled();
    expect(getFieldLabel).not.toHaveBeenCalled();
  });

  test('should return success result when context.nullable is true', () => {
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = null;
    const context = { nullable: true };

    isFieldNullable.mockReturnValue(false);

    const result = validateNullishField(metadata, obj, field, value, context);

    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
    expect(isFieldNullable).not.toHaveBeenCalled();
    expect(getInstanceName).not.toHaveBeenCalled();
    expect(getFieldLabel).not.toHaveBeenCalled();
  });

  test('should return error result for non-nullable field with null value', () => {
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = null;

    isFieldNullable.mockReturnValue(false);
    getInstanceName.mockReturnValue('TestObject');
    getFieldLabel.mockReturnValue('Test Field');

    const result = validateNullishField(metadata, obj, field, value);

    expect(result).toBeTruthy();
    expect(result.success).toBe(false);
    expect(result.message).toBe('The Test Field of TestObject must be specified.');
    expect(isFieldNullable).toHaveBeenCalledWith(metadata, field);
    expect(getInstanceName).toHaveBeenCalledWith(metadata, obj);
    expect(getFieldLabel).toHaveBeenCalledWith(metadata, field);
  });

  test('should return error result without instance name if not available', () => {
    const metadata = {};
    const obj = {};
    const field = 'testField';
    const value = null;

    isFieldNullable.mockReturnValue(false);
    getInstanceName.mockReturnValue(''); // No instance name
    getFieldLabel.mockReturnValue('Test Field');

    const result = validateNullishField(metadata, obj, field, value);

    expect(result).toBeTruthy();
    expect(result.success).toBe(false);
    expect(result.message).toBe('The Test Field must be specified.');
    expect(isFieldNullable).toHaveBeenCalledWith(metadata, field);
    expect(getInstanceName).toHaveBeenCalledWith(metadata, obj);
    expect(getFieldLabel).toHaveBeenCalledWith(metadata, field);
  });
});
