////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { NamingStyle } from '@haixing_hu/naming-style';
import getExistKeyWithDifferentNamingStyle from '../src/impl/model/get-exist-key-with-different-naming-style';

describe('getExistKeyWithDifferentNamingStyle', () => {
  test('returns the key with different naming styles if it exists', () => {
    const obj = {
      camelCaseKey: 'value',
      snake_case_key: 'value',
    };
    const key = 'camelCaseKey';
    expect(getExistKeyWithDifferentNamingStyle(key, obj)).toBe('camelCaseKey');
  });

  test('returns undefined if the key does not exist in any naming style', () => {
    const obj = {
      anotherKey: 'value',
    };
    const key = 'nonExistentKey';
    expect(getExistKeyWithDifferentNamingStyle(key, obj)).toBeUndefined();
  });

  test('handles empty object correctly', () => {
    const obj = {};
    const key = 'anyKey';
    expect(getExistKeyWithDifferentNamingStyle(key, obj)).toBeUndefined();
  });

  test('handles empty key correctly', () => {
    const obj = {
      someKey: 'value',
    };
    const key = '';
    expect(getExistKeyWithDifferentNamingStyle(key, obj)).toBeUndefined();
  });

  test('returns the first matching key with different naming styles', () => {
    const obj = {
      camelCaseKey: 'value',
      snake_case_key: 'value',
    };
    const key = 'snake_case_key';
    expect(getExistKeyWithDifferentNamingStyle(key, obj)).toBe('snake_case_key');
  });

  test('iterates all combination of naming styles', () => {
    const styles = NamingStyle.values();
    const key = 'the_name_of_key';
    for (const s1 of styles) {
      const key1 = NamingStyle.LOWER_UNDERSCORE.to(s1, key);
      for (const s2 of styles) {
        const key2 = NamingStyle.LOWER_UNDERSCORE.to(s2, key);
        const obj = {
          [key2]: 'value',
        };
        expect(getExistKeyWithDifferentNamingStyle(key1, obj)).toBe(key2);
        expect(getExistKeyWithDifferentNamingStyle('xxx', obj)).toBeUndefined();
      }
    }
  });
});
