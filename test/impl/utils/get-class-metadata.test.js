////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getClassMetadata from '../../../src/impl/utils/get-class-metadata';
import classMetadataCache from '../../../src/impl/class-metadata-cache';

describe('getClassMetadata', () => {
  class TestClass {}
  
  beforeEach(() => {
    // 在每个测试之前，预先设置一个空的元数据对象
    classMetadataCache.set(TestClass, {});
  });
  
  test('should return undefined for non-existent key', () => {
    const value = getClassMetadata(TestClass, 'nonExistentKey');
    
    expect(value).toBeUndefined();
  });
  
  test('should return metadata value for existing key', () => {
    // 设置初始元数据
    const initialMetadata = { testKey: 'testValue' };
    classMetadataCache.set(TestClass, initialMetadata);
    
    const value = getClassMetadata(TestClass, 'testKey');
    
    expect(value).toBe('testValue');
  });
  
  test('should return undefined if class metadata is not set', () => {
    // 创建一个新类，没有设置元数据
    class NewClass {}
    
    const value = getClassMetadata(NewClass, 'anyKey');
    
    expect(value).toBeUndefined();
  });
  
  test('should handle complex value types', () => {
    const complexValue = { 
      nested: { 
        array: [1, 2, 3],
        object: { prop: 'value' }
      } 
    };
    
    // 设置复杂类型的元数据
    const metadata = { complex: complexValue };
    classMetadataCache.set(TestClass, metadata);
    
    const value = getClassMetadata(TestClass, 'complex');
    
    expect(value).toBe(complexValue);
    expect(value.nested.array).toEqual([1, 2, 3]);
  });
  
  test('should work correctly with Symbol.metadata', () => {
    // 创建一个带有Symbol.metadata的类
    class ClassWithMetadata {}
    const testValue = 'symbolValue';
    const symbolMetadata = { symbolKey: testValue };
    
    Object.defineProperty(ClassWithMetadata, Symbol.metadata, {
      value: symbolMetadata,
      writable: false,
      enumerable: false,
      configurable: true,
    });
    
    const value = getClassMetadata(ClassWithMetadata, 'symbolKey');
    
    expect(value).toBe(testValue);
  });
  
  test('should return undefined for null metadata', () => {
    // 强制将元数据设为null
    classMetadataCache.set(TestClass, null);
    
    const value = getClassMetadata(TestClass, 'anyKey');
    
    expect(value).toBeUndefined();
  });
}); 