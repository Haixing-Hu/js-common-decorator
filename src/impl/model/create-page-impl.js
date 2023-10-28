////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Page from '../../models/Page';
import createArrayImpl from './create-array-impl';

/**
 * Creates a Page object from the specified data.
 *
 * @param {function} Class
 *     The constructor of the class of the page content.
 * @param {object} page
 *     The data of the page.
 * @returns {Page}
 *     The created `Page` object.
 * @see Page
 * @author Haixing Hu
 * @private
 */
function createPageImpl(Class, page) {
  if (page === undefined || page === null) {
    return null;
  } else if (Page.isValid(page)) {
    // FIXME: shall we use an option to control the name convention of JSON object?
    return new Page(
        page.total_count,
        page.total_pages,
        page.page_index,
        page.page_size,
        createArrayImpl(Class, page.content, true),
    );
  } else {
    throw new TypeError(`Invalid page format: ${JSON.stringify(page)}`);
  }
}

export default createPageImpl;
