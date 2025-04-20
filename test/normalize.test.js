////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

import { defaultNormalizer, normalize } from '../src';

// Mock the default normalizer
jest.mock('../src/default-normalizer', () => jest.fn((value) => `normalized:${value}`));

describe('normalize function', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    defaultNormalizer.mockClear();
  });

  test('should call defaultNormalizer with the provided value', () => {
    const result = normalize('test');

    // Check that defaultNormalizer was called with the correct argument
    expect(defaultNormalizer).toHaveBeenCalledTimes(1);
    expect(defaultNormalizer).toHaveBeenCalledWith('test');

    // Check that the result is what defaultNormalizer returned
    expect(result).toBe('normalized:test');
  });

  test('should pass through null and undefined values to defaultNormalizer', () => {
    normalize(null);
    expect(defaultNormalizer).toHaveBeenCalledWith(null);

    normalize(undefined);
    expect(defaultNormalizer).toHaveBeenCalledWith(undefined);
  });

  test('should pass objects to defaultNormalizer', () => {
    const obj = { key: 'value' };
    normalize(obj);
    expect(defaultNormalizer).toHaveBeenCalledWith(obj);
  });

  test('should pass arrays to defaultNormalizer', () => {
    const arr = [1, 2, 3];
    normalize(arr);
    expect(defaultNormalizer).toHaveBeenCalledWith(arr);
  });
});
