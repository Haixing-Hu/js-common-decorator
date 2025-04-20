////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { stringifyId } from '../src';

describe('Test stringifyId() function', () => {
  test('should handle null input', () => {
    expect(stringifyId(null)).toBe('');
  });

  test('should handle undefined input', () => {
    expect(stringifyId(undefined)).toBe('');
  });

  test('should handle string input', () => {
    expect(stringifyId('test')).toBe('test');
    expect(stringifyId('')).toBe('');
    expect(stringifyId('123')).toBe('123');
  });

  test('should convert number to string', () => {
    expect(stringifyId(123)).toBe('123');
    expect(stringifyId(0)).toBe('0');
    expect(stringifyId(-456)).toBe('-456');
  });

  test('should convert bigint to string', () => {
    expect(stringifyId(123n)).toBe('123');
    expect(stringifyId(9223372036854775807n)).toBe('9223372036854775807');
  });

  test('should stringify complex objects correctly', () => {
    expect(stringifyId({ id: 123 })).toBe('{"id":123}');
    expect(stringifyId([1, 2, 3])).toBe('[1,2,3]');
  });
});
