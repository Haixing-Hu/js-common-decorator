////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import createPageImpl from './impl/model/create-page-impl';

/**
 *  Creates a new page object based on the specified pagination data object.
 *
 *  Typically, the pagination data object is the JSON representation of a
 *  list of domain objects obtained from a server using the GET method, and
 *  the object should conform to the `Page` class definition.
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
 *  - `normalize: boolean`, indicates whether to normalize this object
 *     after the assignment. The default value is `true`.
 *  - `convertNaming: boolean`, indicates whether to convert the naming
 *     style of the target object. The default value is `false`.
 *  - `sourceNamingStyle: NamingStyle`, the naming style of the source
 *     object. The default value is {@link LOWER_UNDERSCORE}.
 *  - `targetNamingStyle: NamingStyle`, the naming style of the target
 *     object. The default value is {@link LOWER_CAMEL}.
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
 * @returns {Page}
 *     The created `Page` object.
 * @see DefaultOptions.get('assign')
 * @see Page
 * @author Haixing Hu
 */
function createPage(Class, page, options = undefined) {
  return createPageImpl(Class, page, options);
}

export default createPage;
