////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Page from '../../model/page';
import createArrayImpl from './create-array-impl';

/**
 * Creates a Page object from the specified data.
 *
 * @param {function} Class
 *     The constructor of the class of the page content.
 * @param {object} page
 *     The data of the page.
 * @param {object} options
 *     the additional options for the creation. If this argument is
 *     `undefined` or `null`, the default options will be used. The default
 *     options can be retrieved by calling `DefaultOptions.get('assign')`.
 *     Available options are:
 *     - `normalize: boolean`, indicates whether to normalize this object
 *       after the assignment. The default value is `true`.
 *     - `convertNaming: boolean`, indicates whether to convert the naming
 *       style of the target object. The default value is `false`.
 *     - `sourceNamingStyle: NamingStyle`, the naming style of the source
 *       object. The default value is {@link LOWER_UNDERSCORE}.
 *     - `targetNamingStyle: NamingStyle`, the naming style of the target
 *       object. The default value is {@link LOWER_CAMEL}.
 * @returns {Page}
 *     The created `Page` object.
 * @see Page
 * @author Haixing Hu
 * @private
 */
function createPageImpl(Class, page, options) {
  if (page === undefined || page === null) {
    return null;
  } else if (Page.isValid(page)) {
    // FIXME: shall we use an option to control the name convention of JSON object?
    return new Page(
      page.total_count,
      page.total_pages,
      page.page_index,
      page.page_size,
      createArrayImpl(Class, page.content, options),
    );
  } else {
    throw new TypeError(`Invalid page format: ${JSON.stringify(page)}`);
  }
}

export default createPageImpl;
