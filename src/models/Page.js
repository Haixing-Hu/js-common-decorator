/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * 表示分页列表操作返回的数据页。
 *
 * @author 胡海星
 */
class Page {
  /**
   * 符合查询条件的记录总数目。
   */
  total_count = 0;

  /**
   * 符合查询条件的分页总数目。
   */
  total_pages = 0;

  /**
   * 当前分页的索引号，从0开始编号。
   */
  page_index = 0;

  /**
   * 当前分页的大小，即每页记录数。
   */
  page_size = 0;

  /**
   * 当前分页的记录集合。
   */
  content = [];

  constructor(total_count = 0, total_pages = 0, page_index = 0, page_size = 0, content = []) {
    this.total_count = total_count;
    this.total_pages = total_pages;
    this.page_index = page_index;
    this.page_size = page_size;
    this.content = content;
  }

  static isValid(page) {
    return (page !== undefined)
      && (page !== null)
      && (typeof page.total_count === 'number')
      && (typeof page.total_pages === 'number')
      && (typeof page.page_index === 'number')
      && (typeof page.page_size === 'number')
      && Array.isArray(page.content);
  }
}

export default Page;
