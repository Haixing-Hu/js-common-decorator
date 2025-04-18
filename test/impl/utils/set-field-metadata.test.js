////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import setFieldMetadata from '../../../src/impl/utils/set-field-metadata';

// 定义一个常量字符串而不是导入
const KEY_FIELDS_METADATA = 'fields';

// 模拟getFieldMetadataObject函数
jest.mock('../../../src/impl/utils/get-field-metadata-object', () => {
  return {
    __esModule: true,
    default: jest.fn((metadata, field) => {
      // 确保metadata[KEY_FIELDS_METADATA]存在
      metadata[KEY_FIELDS_METADATA] = metadata[KEY_FIELDS_METADATA] || {};
      // 如果字段不存在，创建它
      if (field === 'nonExistingField') {
        // 对于非存在字段测试，返回null模拟错误情况
        return null;
      }
      // 确保field字段存在
      metadata[KEY_FIELDS_METADATA][field] = metadata[KEY_FIELDS_METADATA][field] || {};
      // 返回字段的元数据对象
      return metadata[KEY_FIELDS_METADATA][field];
    })
  };
});

describe('setFieldMetadata', () => {
  let metadata;
  
  beforeEach(() => {
    // 在每个测试前清除元数据
    metadata = { [KEY_FIELDS_METADATA]: {} };
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  test('should set metadata property for a field', () => {
    setFieldMetadata(metadata, 'testField', 'testKey', 'testValue');
    
    expect(metadata[KEY_FIELDS_METADATA].testField.testKey).toBe('testValue');
  });
  
  test('should update existing metadata values', () => {
    // 设置初始元数据值
    metadata[KEY_FIELDS_METADATA].testField = { testKey: 'initialValue', otherKey: 123 };
    
    // 更新一个键
    setFieldMetadata(metadata, 'testField', 'testKey', 'updatedValue');
    
    // 验证更新，确保其他键不变
    expect(metadata[KEY_FIELDS_METADATA].testField.testKey).toBe('updatedValue');
    expect(metadata[KEY_FIELDS_METADATA].testField.otherKey).toBe(123);
  });
  
  test('should throw error if field metadata does not exist', () => {
    expect(() => {
      setFieldMetadata(metadata, 'nonExistingField', 'key', 'value');
    }).toThrow(/does not exist/);
  });
  
  test('should set complex value types', () => {
    const complexValue = { 
      nested: { 
        array: [1, 2, 3],
        object: { prop: 'value' }
      } 
    };
    
    setFieldMetadata(metadata, 'testField', 'complex', complexValue);
    
    expect(metadata[KEY_FIELDS_METADATA].testField.complex).toBe(complexValue);
    expect(metadata[KEY_FIELDS_METADATA].testField.complex.nested.array).toEqual([1, 2, 3]);
  });
  
  test('should work with multiple keys for same field', () => {
    setFieldMetadata(metadata, 'testField', 'key1', 'value1');
    setFieldMetadata(metadata, 'testField', 'key2', 'value2');
    
    expect(metadata[KEY_FIELDS_METADATA].testField.key1).toBe('value1');
    expect(metadata[KEY_FIELDS_METADATA].testField.key2).toBe('value2');
  });
}); 