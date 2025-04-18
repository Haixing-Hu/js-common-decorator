////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import normalizeSetField from '../../../src/impl/model/normalize-set-field';

describe('normalizeSetField', () => {
  class TestClass {
    mySet = new Set();
  }

  test('should return true and normalize Set elements', () => {
    const obj = new TestClass();
    obj.mySet = new Set(['  hello  ', '  world  ']);
    const options = {
      path: '',
      types: {},
      elementTypes: {},
    };
    const normalizer = (v) => (typeof v === 'string' ? v.trim() : v);
    
    const result = normalizeSetField(TestClass, obj, 'mySet', obj.mySet, options, normalizer);
    
    expect(result).toBe(true);
    expect(obj.mySet).toBeInstanceOf(Set);
    expect(obj.mySet.size).toBe(2);
    expect(obj.mySet.has('hello')).toBe(true);
    expect(obj.mySet.has('world')).toBe(true);
  });
  
  test('should return true and normalize Set with elementType specified', () => {
    const obj = new TestClass();
    obj.mySet = new Set(['123', '456']);
    const options = {
      path: '',
      types: {},
      elementTypes: {
        '.mySet': Number,
      },
    };
    const normalizer = (v, context) => {
      if (context.type === Number) {
        return Number(v);
      }
      return v;
    };
    
    const result = normalizeSetField(TestClass, obj, 'mySet', obj.mySet, options, normalizer);
    
    expect(result).toBe(true);
    expect(obj.mySet).toBeInstanceOf(Set);
    expect(obj.mySet.size).toBe(2);
    expect(obj.mySet.has(123)).toBe(true);
    expect(obj.mySet.has(456)).toBe(true);
  });
  
  test('should return false for non-Set values', () => {
    const obj = new TestClass();
    obj.mySet = ['value1', 'value2']; // array instead of Set
    const options = {
      path: '',
      types: {},
      elementTypes: {},
    };
    const normalizer = (v) => v;
    
    const result = normalizeSetField(TestClass, obj, 'mySet', obj.mySet, options, normalizer);
    
    expect(result).toBe(false);
    expect(obj.mySet).toEqual(['value1', 'value2']); // unchanged
  });
  
  test('should handle empty Set', () => {
    const obj = new TestClass();
    obj.mySet = new Set();
    const options = {
      path: '',
      types: {},
      elementTypes: {},
    };
    const normalizer = (v) => v;
    
    const result = normalizeSetField(TestClass, obj, 'mySet', obj.mySet, options, normalizer);
    
    expect(result).toBe(true);
    expect(obj.mySet).toBeInstanceOf(Set);
    expect(obj.mySet.size).toBe(0);
  });
  
  test('should apply normalizer to each element in the Set', () => {
    const obj = new TestClass();
    obj.mySet = new Set([1, 2, 3]);
    const options = {
      path: '',
      types: {},
      elementTypes: {},
    };
    const normalizer = (v) => v * 2;
    
    const result = normalizeSetField(TestClass, obj, 'mySet', obj.mySet, options, normalizer);
    
    expect(result).toBe(true);
    expect(obj.mySet).toBeInstanceOf(Set);
    expect(obj.mySet.size).toBe(3);
    expect(obj.mySet.has(2)).toBe(true);
    expect(obj.mySet.has(4)).toBe(true);
    expect(obj.mySet.has(6)).toBe(true);
  });
}); 