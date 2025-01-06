////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from '@qubit-ltd/json';
import Page from '../../model/page';
import assignImpl from './assign-impl';
import isValidPageSource from './is-valid-page-source';

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
 *     - `types: object`, the additional information about types of
 *       fields of classes. The keys of this object are the path of the fields
 *       or sub-fields of the target object, the values are the type of the
 *       fields, represented as the constructor function of the type.
 *       The default value is `{}`.
 *     - `elementTypes: object`, the additional information about types of
 *       elements of fields of classes. The keys of this object are the path of
 *       the fields or sub-fields of the target object, the values are the type
 *       of the elements, represented as the constructor function of the type.
 *       The default value is `{}`.
 * @returns {Page}
 *     The created `Page` object.
 * @see Page
 * @author Haixing Hu
 * @private
 */
function createPageImpl(Class, page, options) {
  if (page === undefined || page === null) {
    return null;
  } else if (isValidPageSource(page, options)) {
    const result = new Page();
    const opt = { ...options };
    if (opt.elementTypes) {
      opt.elementTypes['.content'] = Class;
    } else {
      opt.elementTypes = { '.content': Class };
    }
    return assignImpl(Page, result, page, opt);
  } else {
    throw new TypeError(`Invalid page format: ${Json.stringify(page)}`);
  }
}

export default createPageImpl;
