////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { requirePrototypeMethod } from '../utils';

/**
 * Creates an instance of a model class.
 *
 * @param {function} Class
 *     The constructor of a model class.
 * @param {object} obj
 *     The data object, usually obtained from a JSON object.
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
 * @returns {Class | null}
 *     If the `obj` is `undefined` or `null`, returns `null`; otherwise, returns
 *     a new instance of the model class whose fields are initialized with the
 *     data in the `obj`.
 * @author Haixing Hu
 * @private
 */
function createImpl(Class, obj, options) {
  requirePrototypeMethod(Class, 'assign');
  if (obj === undefined || obj === null) {
    return null;
  } else if (typeof obj !== 'object') {
    throw new TypeError(`The first argument of ${Class.name}.create() must be an object.`);
  } else {
    return new Class().assign(obj, options);
  }
}

export default createImpl;
