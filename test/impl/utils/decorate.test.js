////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import decorate from '../../../src/impl/utils/decorate';

describe('decorate', () => {
  test('should handle descriptor as last argument', () => {
    const handleDescriptor = jest.fn().mockReturnValue('result');
    const descriptor = { value: 'value' };
    const args = ['arg1', 'arg2', descriptor];

    const result = decorate(handleDescriptor, args);

    expect(result).toBe('result');
    expect(handleDescriptor).toHaveBeenCalledWith('arg1', 'arg2', descriptor, []);
  });

  test('should return a decorator function when last argument is not a descriptor', () => {
    const handleDescriptor = jest.fn().mockReturnValue('result');
    const args = ['arg1', 'arg2'];

    const decorator = decorate(handleDescriptor, args);

    expect(typeof decorator).toBe('function');

    const descriptor = { value: 'value' };
    const result = decorator('target', 'key', descriptor);

    expect(result).toBe('result');
    expect(handleDescriptor).toHaveBeenCalledWith('target', 'key', descriptor, ['arg1', 'arg2']);
  });
});
