////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试createArrayImpl函数
 */

import createArrayImpl from '../../../src/impl/model/create-array-impl';
import createImpl from '../../../src/impl/model/create-impl';

// 模拟类定义
class MockClass {
  constructor() {
    this.id = '';
    this.name = '';
  }

  normalize() {
    return this;
  }
}

jest.mock('../../../src/impl/model/create-impl');

describe('createArrayImpl', () => {
  beforeEach(() => {
    // 重置所有模拟函数
    jest.clearAllMocks();

    // 默认的createImpl实现
    createImpl.mockImplementation((Class, obj, options) => {
      const instance = new Class();
      instance.id = obj.id;
      instance.name = obj.name;
      return instance;
    });
  });

  test('应该将数组中的每个元素转换为类实例', () => {
    // 准备测试数据
    const Class = MockClass;
    const array = [
      { id: '1', name: 'name1' },
      { id: '2', name: 'name2' },
    ];
    const options = { normalize: true };

    // 为第一个对象模拟createImpl的行为
    const firstInstance = new MockClass();
    firstInstance.id = '1';
    firstInstance.name = 'name1';

    // 设置createImpl的模拟实现，返回我们控制的实例
    createImpl.mockImplementationOnce(() => firstInstance);

    // 执行函数
    const result = createArrayImpl(Class, array, options);

    // 验证结果
    expect(result).toHaveLength(2);
    // 验证第一个元素具有预期的属性，而不是直接比较引用
    expect(result[0].id).toBe('1');
    expect(result[0].name).toBe('name1');
    expect(result[1].id).toBe('2');
    expect(result[1].name).toBe('name2');

    // 验证createImpl被正确调用
    expect(createImpl).toHaveBeenCalledTimes(2);
    expect(createImpl).toHaveBeenCalledWith(Class, array[0], options);
    expect(createImpl).toHaveBeenCalledWith(Class, array[1], options);
  });

  test('应该正确传递options参数给createImpl', () => {
    // 准备测试数据
    const Class = MockClass;
    const array = [
      { id: '1', name: 'name1' },
      { id: '2', name: 'name2' },
    ];

    // 创建一个自定义类
    class CustomClass {
      constructor() {
        this.customId = '';
        this.customName = '';
      }
    }

    // 设置options参数，包含elementTypes
    const options = {
      normalize: true,
      elementTypes: {
        // elementTypes中的键是数组路径，但在createArrayImpl中不直接使用
        // 这里只需验证options被正确传递给createImpl即可
        'someArrayPath': CustomClass,
      },
    };

    // 执行函数
    const result = createArrayImpl(Class, array, options);

    // 验证结果
    expect(result).toHaveLength(2);

    // 验证createImpl被正确调用，并且传递了完整的options
    expect(createImpl).toHaveBeenCalledTimes(2);
    expect(createImpl).toHaveBeenCalledWith(Class, array[0], options);
    expect(createImpl).toHaveBeenCalledWith(Class, array[1], options);
  });

  test('应该正确处理空数组', () => {
    // 准备测试数据
    const Class = MockClass;
    const array = [];
    const options = { normalize: true };

    // 执行函数
    const result = createArrayImpl(Class, array, options);

    // 验证结果
    expect(result).toEqual([]);

    // 验证createImpl未被调用
    expect(createImpl).not.toHaveBeenCalled();
  });

  test('应该处理normalize为false的情况', () => {
    // 准备测试数据
    const Class = MockClass;
    const array = [
      { id: '1', name: 'name1' },
      { id: '2', name: 'name2' },
    ];
    const options = { normalize: false };

    // 执行函数
    const result = createArrayImpl(Class, array, options);

    // 验证结果
    expect(result).toHaveLength(2);
    // 只验证属性值而不是具体实例类型
    expect(result[0].id).toBe('1');
    expect(result[0].name).toBe('name1');
    expect(result[1].id).toBe('2');
    expect(result[1].name).toBe('name2');

    // 验证createImpl被正确调用，并且传递了normalize: false
    expect(createImpl).toHaveBeenCalledTimes(2);
    expect(createImpl).toHaveBeenCalledWith(Class, array[0], options);
    expect(createImpl).toHaveBeenCalledWith(Class, array[1], options);
  });

  test('应该处理非数组输入抛出TypeError', () => {
    // 准备测试数据
    const Class = MockClass;
    const notArray = { id: '1', name: 'name1' }; // 不是数组而是对象
    const options = { normalize: true };

    // 执行函数应抛出错误
    expect(() => {
      createArrayImpl(Class, notArray, options);
    }).toThrow(TypeError);

    // 验证createImpl未被调用
    expect(createImpl).not.toHaveBeenCalled();
  });
});
