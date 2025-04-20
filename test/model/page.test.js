////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Page from '../../src/model/page';

describe('Page class', () => {
  test('constructor should initialize with default values', () => {
    const page = new Page();
    expect(page.totalCount).toBe(0);
    expect(page.totalPages).toBe(0);
    expect(page.pageIndex).toBe(0);
    expect(page.pageSize).toBe(0);
    expect(page.content).toEqual([]);
  });

  test('constructor should initialize with provided values', () => {
    const content = [{ id: 1 }, { id: 2 }];
    const page = new Page(100, 10, 2, 10, content);
    expect(page.totalCount).toBe(100);
    expect(page.totalPages).toBe(10);
    expect(page.pageIndex).toBe(2);
    expect(page.pageSize).toBe(10);
    expect(page.content).toBe(content);
  });

  test('assign should correctly update properties', () => {
    const page = new Page();
    const data = {
      totalCount: 200,
      totalPages: 20,
      pageIndex: 5,
      pageSize: 10,
      content: [{ id: 3 }, { id: 4 }],
    };

    const result = page.assign(data);

    expect(result).toBe(page); // Returns this reference
    expect(page.totalCount).toBe(200);
    expect(page.totalPages).toBe(20);
    expect(page.pageIndex).toBe(5);
    expect(page.pageSize).toBe(10);
    expect(page.content).toEqual([{ id: 3 }, { id: 4 }]);
  });

  test('assign should handle null/undefined', () => {
    const page = new Page(100, 10, 2, 10, [{ id: 1 }]);

    page.assign(null);

    expect(page.totalCount).toBe(0);
    expect(page.totalPages).toBe(0);
    expect(page.pageIndex).toBe(0);
    expect(page.pageSize).toBe(0);
    expect(page.content).toEqual([]);
  });

  test('assign should handle different naming styles', () => {
    const page = new Page();
    const data = {
      total_count: 200,
      total_pages: 20,
      page_index: 5,
      page_size: 10,
      content: [{ id: 3 }, { id: 4 }],
    };

    const result = page.assign(data, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });

    expect(result).toBe(page);
    expect(page.totalCount).toBe(200);
    expect(page.totalPages).toBe(20);
    expect(page.pageIndex).toBe(5);
    expect(page.pageSize).toBe(10);
    expect(page.content).toEqual([{ id: 3 }, { id: 4 }]);
  });

  test('newEmpty should create an empty page with specified page size', () => {
    const page = Page.newEmpty(15);

    expect(page).toBeInstanceOf(Page);
    expect(page.totalCount).toBe(0);
    expect(page.totalPages).toBe(0);
    expect(page.pageIndex).toBe(0);
    expect(page.pageSize).toBe(15);
    expect(page.content).toEqual([]);
  });

  test('getFrom should extract a page from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const pageRequest = {
      pageIndex: 1,
      pageSize: 3,
    };

    const page = Page.getFrom(pageRequest, array);

    expect(page).toBeInstanceOf(Page);
    expect(page.totalCount).toBe(11);
    expect(page.totalPages).toBe(4); // ceil(11/3)
    expect(page.pageIndex).toBe(1);
    expect(page.pageSize).toBe(3);
    expect(page.content).toEqual([4, 5, 6]);
  });

  test('getFrom should handle last page with less items than page size', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const pageRequest = {
      pageIndex: 3,
      pageSize: 3,
    };

    const page = Page.getFrom(pageRequest, array);

    expect(page.totalCount).toBe(11);
    expect(page.totalPages).toBe(4);
    expect(page.pageIndex).toBe(3);
    expect(page.pageSize).toBe(3);
    expect(page.content).toEqual([10, 11]);
  });

  test('getFrom should handle empty array', () => {
    const array = [];
    const pageRequest = {
      pageIndex: 0,
      pageSize: 10,
    };

    const page = Page.getFrom(pageRequest, array);

    expect(page.totalCount).toBe(0);
    expect(page.totalPages).toBe(0);
    expect(page.pageIndex).toBe(0);
    expect(page.pageSize).toBe(10);
    expect(page.content).toEqual([]);
  });
});
