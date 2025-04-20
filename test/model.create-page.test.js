////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Page } from '../src';
import { Json } from '@qubit-ltd/json';

/**
 * @test 测试Model.createPage方法
 * @author Haixing Hu
 */
describe('Test Model.createPage method', () => {
  @Model
  class Person {
    name = '';
    age = 0;

    constructor(name = '', age = 0) {
      this.name = name;
      this.age = age;
    }
  }

  beforeEach(() => {
    console.error = jest.fn();
  });

  it('should create a page from valid source data', () => {
    const pageData = {
      pageIndex: 1,
      pageSize: 10,
      totalCount: 100,
      totalPages: 10,
      content: [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ],
    };

    const page = Person.createPage(pageData);
    
    expect(page).toBeInstanceOf(Page);
    expect(page.pageIndex).toBe(1);
    expect(page.pageSize).toBe(10);
    expect(page.totalCount).toBe(100);
    expect(page.content).toHaveLength(2);
    expect(page.content[0]).toBeInstanceOf(Person);
    expect(page.content[0].name).toBe('Alice');
    expect(page.content[0].age).toBe(25);
    expect(page.content[1].name).toBe('Bob');
    expect(page.content[1].age).toBe(30);
  });

  it('should return null for null input', () => {
    const page = Person.createPage(null);
    expect(page).toBeNull();
  });

  it('should return null for undefined input', () => {
    const page = Person.createPage(undefined);
    expect(page).toBeNull();
  });

  it('should throw TypeError for invalid page format', () => {
    const invalidData = {
      // 缺少必要的字段
      content: 'not an array'
    };

    expect(() => {
      Person.createPage(invalidData);
    }).toThrow(TypeError);
    expect(() => {
      Person.createPage(invalidData);
    }).toThrow(/Invalid page format/);
  });

  it('should create a page with empty content', () => {
    const pageData = {
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      content: [],
    };

    const page = Person.createPage(pageData);
    
    expect(page).toBeInstanceOf(Page);
    expect(page.content).toHaveLength(0);
  });

  it('should handle custom options when creating page', () => {
    const pageData = {
      pageIndex: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 1,
      content: [
        { name: 'Alice', age: '25' }, // 注意这里年龄是字符串
      ],
    };

    // 使用自定义选项来处理类型转换
    const options = {
      normalize: true,
    };

    const page = Person.createPage(pageData, options);
    
    expect(page).toBeInstanceOf(Page);
    expect(page.content[0]).toBeInstanceOf(Person);
    expect(page.content[0].name).toBe('Alice');
  });
});
