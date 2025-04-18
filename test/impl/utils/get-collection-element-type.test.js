////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getCollectionElementType from '../../../src/impl/utils/get-collection-element-type';

describe('getCollectionElementType', () => {
  class TestClass {}
  class AnotherClass {}

  describe('with arrays', () => {
    test('should return the constructor of the first element for arrays', () => {
      const obj = [new TestClass(), new TestClass()];
      expect(getCollectionElementType(obj)).toBe(TestClass);
    });

    test('should return null for empty arrays', () => {
      const obj = [];
      expect(getCollectionElementType(obj)).toBeNull();
    });
    
    test('should return null if first element has no constructor', () => {
      const obj = [Object.create(null), {}];
      expect(getCollectionElementType(obj)).toBeNull();
    });

    test('should work with typed arrays', () => {
      const obj = new Int32Array([1, 2, 3]);
      expect(getCollectionElementType(obj)).toBe(Number);
    });
    
    test('should return null for empty typed arrays', () => {
      const obj = new Int32Array([]);
      expect(getCollectionElementType(obj)).toBeNull();
    });
  });

  describe('with collections', () => {
    test('should return the constructor of the first element for Sets', () => {
      const obj = new Set([new TestClass(), new AnotherClass()]);
      expect(getCollectionElementType(obj)).toBe(TestClass);
    });

    test('should return the constructor of the first value for Maps', () => {
      const obj = new Map([
        ['key1', new TestClass()], 
        ['key2', new AnotherClass()]
      ]);
      expect(getCollectionElementType(obj)).toBe(TestClass);
    });

    test('should return null for empty Sets', () => {
      const obj = new Set();
      expect(getCollectionElementType(obj)).toBeNull();
    });

    test('should return null for empty Maps', () => {
      const obj = new Map();
      expect(getCollectionElementType(obj)).toBeNull();
    });
    
    test('should return null if first element in collection has no constructor', () => {
      const weirdObj = Object.create(null);
      const obj = new Set([weirdObj, {}]);
      expect(getCollectionElementType(obj)).toBeNull();
    });
  });

  describe('with non-collections', () => {
    test('should return null for primitive values', () => {
      expect(getCollectionElementType(123)).toBeNull();
      expect(getCollectionElementType('string')).toBeNull();
      expect(getCollectionElementType(true)).toBeNull();
    });

    test('should return null for regular objects', () => {
      expect(getCollectionElementType({})).toBeNull();
      expect(getCollectionElementType(new TestClass())).toBeNull();
    });

    test('should return null for null and undefined', () => {
      expect(getCollectionElementType(null)).toBeNull();
      expect(getCollectionElementType(undefined)).toBeNull();
    });
  });
}); 