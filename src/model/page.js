////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import assignImpl from '../impl/model/assign-impl';

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

  /**
   * Assigns the properties of another page to this page.
   *
   * @param {object} obj
   *     the data object, which may have a different prototype than this object.
   * @param {null|undefined|object} options
   *     the additional options for the assignment. If this argument is
   *     `undefined` or `null`, the default options will be used. The default
   *     options can be retrieved by calling `DefaultOptions.get('assign')`.
   *     Available options are:
   *  - `normalize: boolean`, indicates whether to normalize this object
   *     after the assignment. The default value is `true`.
   *  - `convertNaming: boolean`, indicates whether to convert the naming
   *     style of the target object. The default value is `false`.
   *  - `sourceNamingStyle: string`, the naming style of the source object,
   *     i.e., the first argument of the `assign()` method. The default value
   *     of this argument is `'LOWER_UNDERSCORE'`.
   *  - `targetNamingStyle: string`, the naming style of the target object,
   *     i.e., the object calling the `assign()` method. The default value
   *     of this argument is `'LOWER_CAMEL'`.
   *  - `types: object`, the additional information about types of
   *     fields of classes. The keys of this object are the path of the fields
   *     or sub-fields of the target object, the values are the type of the
   *     fields, represented as the constructor function of the type.
   *     The default value is `{}`.
   *  - `elementTypes: object`, the additional information about types of
   *     elements of fields of classes. The keys of this object are the path of
   *     the fields or sub-fields of the target object, the values are the type
   *     of the elements, represented as the constructor function of the type.
   *     The default value is `{}`.
   * @returns {object}
   *     the reference to this object.
   * @see DefaultOptions.get('assign')
   */
  assign(obj, options = undefined) {
    return assignImpl(Page, this, obj, options);
  }

  /**
   * Creates a empty page with the specified page size.
   *
   * @param pageSize
   *     the size of the page.
   * @return {Page}
   *     the created empty page.
   */
  static emptyPage(pageSize) {
    return new Page(0, 0, 0, pageSize, []);
  }
}

export default Page;
