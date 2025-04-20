////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isDescriptor from '../../../src/impl/utils/is-descriptor';

describe('isDescriptor', () => {
  test('should return true for object with value property', () => {
    const descriptor = { value: 'test value' };
    expect(isDescriptor(descriptor)).toBe(true);
  });

  test('should return true for object with initializer property', () => {
    const descriptor = { initializer: () => 'test value' };
    expect(isDescriptor(descriptor)).toBe(true);
  });

  test('should return true for object with get property', () => {
    const descriptor = { get: () => 'test value' };
    expect(isDescriptor(descriptor)).toBe(true);
  });

  test('should return true for object with set property', () => {
    const descriptor = { set: () => {} };
    expect(isDescriptor(descriptor)).toBe(true);
  });

  test('should return false for empty object', () => {
    const descriptor = {};
    expect(isDescriptor(descriptor)).toBe(false);
  });

  test('should return false for object without descriptor properties', () => {
    const descriptor = { foo: 'bar' };
    expect(isDescriptor(descriptor)).toBe(false);
  });

  test('should return false for null', () => {
    expect(isDescriptor(null)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isDescriptor(undefined)).toBe(false);
  });

  test('should return false for primitive values', () => {
    expect(isDescriptor('')).toBe(false);
    expect(isDescriptor(123)).toBe(false);
    expect(isDescriptor(true)).toBe(false);
    expect(isDescriptor(Symbol('test'))).toBe(false);
  });

  test('should return false for object without hasOwnProperty method', () => {
    const descriptor = Object.create(null);
    descriptor.value = 'test';
    expect(isDescriptor(descriptor)).toBe(false);
  });
});
