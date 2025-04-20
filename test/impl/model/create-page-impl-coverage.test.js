////////////////////////////////////////////////////////////////////////////////
import createPageImpl from '../../../src/impl/model/create-page-impl';
import Model from '../../../src/model';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Page from '../../../src/model/page';

/**
 * 此测试文件专门用于提高create-page-impl.js文件的覆盖率
 * 特别是第57行，抛出无效页面格式的错误
 */
describe('createPageImpl enhanced coverage tests', () => {
  // 测试当page参数为null或undefined时的情况
  test('should return null if page is null or undefined', () => {
    @Model
    class TestModel {
      field = 'default';
    }

    // 测试page为null的情况
    expect(createPageImpl(TestModel, null)).toBeNull();

    // 测试page为undefined的情况
    expect(createPageImpl(TestModel, undefined)).toBeNull();
  });

  // 测试有效页面格式的情况
  test('should create page correctly from valid page format', () => {
    @Model
    class TestModel {
      field = 'default';
    }

    const validPage = {
      content: [
        { field: 'item1' },
        { field: 'item2' },
      ],
      totalCount: 2,
      totalPages: 1,
      pageSize: 10,
      pageIndex: 0,
    };

    const result = createPageImpl(TestModel, validPage);

    // 验证创建的是Page对象
    expect(result).toBeInstanceOf(Page);

    // 验证内容被正确转换为TestModel类型
    expect(result.content.length).toBe(2);
    expect(result.content[0]).toBeInstanceOf(TestModel);
    expect(result.content[0].field).toBe('item1');
    expect(result.content[1].field).toBe('item2');

    // 验证其他属性被正确复制
    expect(result.totalCount).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.pageIndex).toBe(0);
  });

  // 测试无效页面格式的情况（覆盖第57行）
  test('should throw TypeError for invalid page format', () => {
    @Model
    class TestModel {
      field = 'default';
    }

    // 使用各种无效格式测试
    const invalidFormats = [
      { invalid: 'format' }, // 没有content字段
      { content: 'not an array' }, // content不是数组
      { content: [], notRecognized: true }, // 含有不识别的属性
      123, // 完全错误的类型
      'not a page', // 字符串而非对象
      [], // 数组而非对象
      true, // 布尔值而非对象
      // 缺少必要字段的对象
      { content: [] },
      { content: [], totalCount: 0 },
      { content: [], totalCount: 0, totalPages: 0 },
      { content: [], totalCount: 0, totalPages: 0, pageIndex: 0 },
      // 字段类型不正确的对象
      { content: [], totalCount: '0', totalPages: 0, pageIndex: 0, pageSize: 0 },
    ];

    invalidFormats.forEach((format) => {
      expect(() => {
        createPageImpl(TestModel, format);
      }).toThrow(TypeError);
    });
  });

  // 测试使用options参数的情况
  test('should respect elementTypes option', () => {
    @Model
    class TestModel {
      field = 'default';
    }

    @Model
    class AnotherModel {
      property = 'another default';
    }

    const validPage = {
      content: [
        { field: 'item1', property: 'prop1' },
        { field: 'item2', property: 'prop2' },
      ],
      totalCount: 2,
      totalPages: 1,
      pageSize: 10,
      pageIndex: 0,
    };

    // 提供已有elementTypes选项
    const options = {
      elementTypes: {
        '.existingField': String, // 一个已存在的elementTypes设置
      },
    };

    const result = createPageImpl(TestModel, validPage, options);

    // 验证内容被正确转换为TestModel类型
    expect(result.content[0]).toBeInstanceOf(TestModel);

    // 验证原有的elementTypes选项被保留
    expect(options.elementTypes['.existingField']).toBe(String);
    // 同时添加了新的.content类型
    expect(options.elementTypes['.content']).toBe(TestModel);
  });
});
