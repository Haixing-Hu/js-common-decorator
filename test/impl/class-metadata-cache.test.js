////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../../src/impl/class-metadata-cache';

describe('classMetadataCache', () => {
  // 创建测试用类
  class TestClass {}
  
  beforeEach(() => {
    // 清除测试类上的所有元数据
    classMetadataCache.set(TestClass, undefined);
  });
  
  test('get should return empty object for class without metadata', () => {
    const metadata = classMetadataCache.get(TestClass);
    
    expect(metadata).toBeDefined();
    expect(metadata).toEqual({});
  });
  
  test('set and get should work properly', () => {
    const testMetadata = { key: 'value', nested: { prop: 123 } };
    
    classMetadataCache.set(TestClass, testMetadata);
    const retrievedMetadata = classMetadataCache.get(TestClass);
    
    expect(retrievedMetadata).toBe(testMetadata); // 应该是同一个对象引用
    expect(retrievedMetadata).toEqual(testMetadata); 
  });
  
  test('get should return cached metadata if available', () => {
    const testMetadata = { key: 'cached' };
    
    classMetadataCache.set(TestClass, testMetadata);
    
    // 如果缓存工作正常，第二次调用应该直接返回缓存的内容
    const firstRetrieved = classMetadataCache.get(TestClass);
    const secondRetrieved = classMetadataCache.get(TestClass);
    
    expect(firstRetrieved).toBe(testMetadata);
    expect(secondRetrieved).toBe(testMetadata);
    expect(firstRetrieved).toBe(secondRetrieved);
  });
  
  test('get should use Class[Symbol.metadata] if available', () => {
    // 创建一个带有Symbol.metadata的类
    class ClassWithMetadata {}
    const symbolMetadata = { fromSymbol: true };
    Object.defineProperty(ClassWithMetadata, Symbol.metadata, {
      value: symbolMetadata,
      writable: false,
      enumerable: false,
      configurable: true,
    });
    
    const retrievedMetadata = classMetadataCache.get(ClassWithMetadata);
    
    expect(retrievedMetadata).toBe(symbolMetadata);
  });
  
  test('set should update metadata for existing class', () => {
    const initialMetadata = { initial: true };
    const updatedMetadata = { updated: true };
    
    classMetadataCache.set(TestClass, initialMetadata);
    const firstRetrieved = classMetadataCache.get(TestClass);
    
    classMetadataCache.set(TestClass, updatedMetadata);
    const secondRetrieved = classMetadataCache.get(TestClass);
    
    expect(firstRetrieved).toBe(initialMetadata);
    expect(secondRetrieved).toBe(updatedMetadata);
    expect(firstRetrieved).not.toBe(secondRetrieved);
  });
  
  test('cache should work with multiple classes independently', () => {
    class AnotherClass {}
    
    const metadataA = { forA: true };
    const metadataB = { forB: true };
    
    classMetadataCache.set(TestClass, metadataA);
    classMetadataCache.set(AnotherClass, metadataB);
    
    const retrievedA = classMetadataCache.get(TestClass);
    const retrievedB = classMetadataCache.get(AnotherClass);
    
    expect(retrievedA).toBe(metadataA);
    expect(retrievedB).toBe(metadataB);
    expect(retrievedA).not.toBe(retrievedB);
  });
}); 