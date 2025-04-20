////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getDefaultValue from '../../../src/impl/utils/get-default-value';

describe('getDefaultValue', () => {
  test('should return the value property if defined', () => {
    const descriptor = { value: 'test value' };
    expect(getDefaultValue(descriptor)).toBe('test value');
  });

  test('should call initializer function if value is undefined', () => {
    const initializer = jest.fn().mockReturnValue('initialized value');
    const descriptor = { initializer };

    expect(getDefaultValue(descriptor)).toBe('initialized value');
    expect(initializer).toHaveBeenCalled();
  });

  test('should call get function if value and initializer are undefined', () => {
    const get = jest.fn().mockReturnValue('get value');
    const descriptor = { get };

    expect(getDefaultValue(descriptor)).toBe('get value');
    expect(get).toHaveBeenCalled();
  });

  test('should return undefined if no value, initializer, or get function are defined', () => {
    const descriptor = {};
    expect(getDefaultValue(descriptor)).toBeUndefined();
  });

  test('should prioritize value over initializer and get', () => {
    const initializer = jest.fn().mockReturnValue('initialized value');
    const get = jest.fn().mockReturnValue('get value');
    const descriptor = { value: 'test value', initializer, get };

    expect(getDefaultValue(descriptor)).toBe('test value');
    expect(initializer).not.toHaveBeenCalled();
    expect(get).not.toHaveBeenCalled();
  });

  test('should prioritize initializer over get', () => {
    const initializer = jest.fn().mockReturnValue('initialized value');
    const get = jest.fn().mockReturnValue('get value');
    const descriptor = { initializer, get };

    expect(getDefaultValue(descriptor)).toBe('initialized value');
    expect(initializer).toHaveBeenCalled();
    expect(get).not.toHaveBeenCalled();
  });
});
