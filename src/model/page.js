////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The data page returned by the pagination list operation.
 *
 * @author Haixing Hu
 */
class Page {
  /**
   * The total number of records that meet the query conditions.
   *
   * @type {number}
   */
  totalCount = 0;

  /**
   * The total number of pages.
   *
   * @type {number}
   */
  totalPages = 0;

  /**
   * The index of the current page, starting from 0.
   *
   * @type {number}
   */
  pageIndex = 0;

  /**
   * The size of the current page, i.e., the number of records per page.
   *
   * @type {number}
   */
  pageSize = 0;

  /**
   * The content of the current page.
   *
   * @type {Array}
   */
  content = [];

  constructor(totalCount = 0, totalPages = 0, pageIndex = 0, pageSize = 0, content = []) {
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.content = content;
  }
}

export default Page;
