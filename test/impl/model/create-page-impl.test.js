////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 测试createPageImpl函数
 */

import createPageImpl from '../../../src/impl/model/create-page-impl';
import Page from '../../../src/model/page';

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

describe('createPageImpl', () => {
  test('应该处理undefined和null返回null', () => {
    // 测试 null 和 undefined
    expect(createPageImpl(MockClass, null)).toBeNull();
    expect(createPageImpl(MockClass, undefined)).toBeNull();
  });

  test('应该对其他无效页面源数据抛出TypeError', () => {
    // 各种其他无效数据类型
    const invalidSources = ['', 0, false, {}];

    for (const invalidSource of invalidSources) {
      // 执行函数并期望抛出TypeError
      expect(() => {
        createPageImpl(MockClass, invalidSource);
      }).toThrow(TypeError);
    }
  });

  test('应该正确处理完整的页面数据', () => {
    // 准备测试数据 - 包含所有必需字段的页面
    const validPage = {
      totalCount: 100,
      totalPages: 10,
      pageIndex: 0,
      pageSize: 10,
      content: []
    };

    // 执行函数
    const result = createPageImpl(MockClass, validPage);

    // 验证结果
    expect(result).toBeInstanceOf(Page);
    expect(result.totalCount).toBe(100);
    expect(result.totalPages).toBe(10);
    expect(result.pageIndex).toBe(0);
    expect(result.pageSize).toBe(10);
    expect(result.content).toEqual([]);
  });

  test('应该正确处理有元素的页面数据', () => {
    // 准备测试数据 - 带有content数组的页面
    const pageWithContent = {
      totalCount: 100,
      totalPages: 10,
      pageIndex: 0,
      pageSize: 10,
      content: [
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
      ],
    };

    // 执行函数
    const result = createPageImpl(MockClass, pageWithContent);

    // 验证结果
    expect(result).toBeInstanceOf(Page);
    expect(result.totalCount).toBe(100);
    expect(result.totalPages).toBe(10);
    expect(result.pageIndex).toBe(0);
    expect(result.pageSize).toBe(10);
    expect(result.content).toHaveLength(2);
    expect(result.content[0]).toBeInstanceOf(MockClass);
    expect(result.content[0].id).toBe('1');
    expect(result.content[0].name).toBe('item1');
    expect(result.content[1]).toBeInstanceOf(MockClass);
    expect(result.content[1].id).toBe('2');
    expect(result.content[1].name).toBe('item2');
  });

  test('应该处理缺少content字段的情况抛出TypeError', () => {
    // 准备测试数据 - 没有content数组的页面
    const pageWithoutContent = {
      totalCount: 100,
      totalPages: 10,
      pageIndex: 0,
      pageSize: 10,
    };

    // 执行函数并期望抛出TypeError
    expect(() => {
      createPageImpl(MockClass, pageWithoutContent);
    }).toThrow(TypeError);
  });

  test('应该处理content不是数组的情况抛出TypeError', () => {
    // 准备测试数据 - content是字符串而不是数组
    const pageWithStringContent = {
      totalCount: 100,
      totalPages: 10,
      pageIndex: 0,
      pageSize: 10,
      content: '这不是一个数组',
    };

    // 执行函数并期望抛出TypeError
    expect(() => {
      createPageImpl(MockClass, pageWithStringContent);
    }).toThrow(TypeError);
  });

  test('应该处理页面数据是字符串的情况抛出TypeError', () => {
    // 准备测试数据 - 一个JSON字符串
    const jsonStr = '{"totalCount":100,"totalPages":10,"pageIndex":0,"pageSize":10,"content":[{"id":"1","name":"item1"}]}';

    // 执行函数并期望抛出TypeError
    expect(() => {
      createPageImpl(MockClass, jsonStr);
    }).toThrow(TypeError);
  });

  test('应该处理非法JSON字符串抛出TypeError', () => {
    // 准备测试数据 - 一个非法的JSON字符串
    const invalidJsonStr = '{totalCount:100,totalPages:10,pageIndex:0,pageSize:10}'; // 缺少引号的键

    // 执行函数并期望抛出TypeError
    expect(() => {
      createPageImpl(MockClass, invalidJsonStr);
    }).toThrow(TypeError);
  });

  test('应该应用options参数到页面创建过程', () => {
    // 准备测试数据 - 有效的页面格式
    const pageData = {
      totalCount: 100,
      totalPages: 10,
      pageIndex: 0,
      pageSize: 10,
      content: [
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
      ],
    };

    // 准备自定义选项 - 只设置 normalize: false
    const options = {
      normalize: false,
    };

    // 模拟normalize方法确认它不会被调用
    const originalNormalize = MockClass.prototype.normalize;
    MockClass.prototype.normalize = jest.fn();

    // 执行函数
    const result = createPageImpl(MockClass, pageData, options);

    // 验证结果
    expect(result).toBeInstanceOf(Page);
    expect(result.content).toHaveLength(2);
    expect(MockClass.prototype.normalize).not.toHaveBeenCalled(); // normalize选项为false

    // 恢复原始方法
    MockClass.prototype.normalize = originalNormalize;
  });
});
