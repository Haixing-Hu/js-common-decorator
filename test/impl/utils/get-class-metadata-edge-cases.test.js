////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getClassMetadata from '../../../src/impl/utils/get-class-metadata';

/**
 * 测试getClassMetadata函数中的边缘情况
 */
describe('getClassMetadata edge cases', () => {
  it('should throw TypeError if Class is not a function', () => {
    // 尝试使用非函数作为第一个参数
    expect(() => {
      getClassMetadata({}, 'someKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata(null, 'someKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata(undefined, 'someKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata('string', 'someKey');
    }).toThrow(TypeError);

    expect(() => {
      getClassMetadata(123, 'someKey');
    }).toThrow(TypeError);
  });

  it('should return undefined when metadata is not available', () => {
    // 创建一个没有元数据的普通类
    class NoMetadataClass {}

    // 当元数据不存在时应该返回undefined
    expect(getClassMetadata(NoMetadataClass, 'someKey')).toBeUndefined();
  });
});
