////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from '@haixing_hu/json';
import assignImpl from './assign-impl';

/**
 * Parses the specified object from a JSON string.
 *
 * @param {Function} Class
 *     the constructor of the model class of the object.
 * @param {string} json
 *     the JSON string to be parsed.
 * @param {null|undefined|object} options
 *     the additional options for the parsing. If this argument is
 *     `undefined` or `null`, the default options will be used. The default
 *     options can be retrieved by calling `DefaultOptions.get('assign')`.
 *     Available options are:
 *     - `normalize: boolean`, indicates whether to normalize this object
 *       after the assignment. The default value is `true`.
 *     - `convertNaming: boolean`, indicates whether to convert the naming
 *       style of the target object. The default value is `false`.
 *     - `sourceNamingStyle: string | NamingStyle`, the naming style of the
 *       source object, i.e., the first argument of the `assign()` method.
 *       The default value of this argument is {@link LOWER_UNDERSCORE}.
 *     - `targetNamingStyle: string | NamingStyle`, the naming style of the
 *       target object, i.e., the object calling the `assign()` method. The
 *       default value of this argument is {@link LOWER_CAMEL}.
 * @returns {object}
 *     the object deserialized from the specified JSON string.
 * @see DefaultOptions.get('assign')
 * @author Haixing Hu
 * @private
 */
function parseJsonStringImpl(Class, json, options) {
  const obj = Json.parse(json);
  const result = new Class();
  return assignImpl(Class, result, obj, options);
}

export default parseJsonStringImpl;
