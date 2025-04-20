////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model } from '../../../src';
import createPageImpl from '../../../src/impl/model/create-page-impl';

/**
 * 测试createPageImpl函数中的边缘情况，特别是当参数为非法JSON字符串时的抛出异常行为
 */
describe('createPageImpl edge cases', () => {
  @Model
  class Item {
    id = '';

    name = '';
  }

  it('should throw TypeError for invalid page format', () => {
    // 准备一个无效的页面数据格式
    const invalidPage = {
      // 缺少content字段
      total: 100,
      pageSize: 10,
      pageNumber: 1,
    };

    // 尝试创建页面，应该抛出TypeError
    expect(() => {
      createPageImpl(Item, invalidPage, {});
    }).toThrow(TypeError);

    // 验证错误消息包含"Invalid page format"
    expect(() => {
      createPageImpl(Item, invalidPage, {});
    }).toThrow(/Invalid page format/);
  });

  it('should throw TypeError when Json.stringify fails', () => {
    // 创建一个带有循环引用的对象，使Json.stringify失败
    const circularObj = {};
    circularObj.self = circularObj;

    // 尝试创建页面，应该抛出TypeError
    // 注意：这个测试期望在第57行抛出异常，因为Json.stringify会失败
    expect(() => {
      createPageImpl(Item, circularObj, {});
    }).toThrow(TypeError);
  });
});
