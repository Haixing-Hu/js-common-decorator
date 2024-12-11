////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import toJsonStringImpl from './impl/model/to-json-string-impl';

/**
 * Serializes the specified into a JSON string.
 *
 * **NOTE:** This method supports native `bigint` value. For example, the
 * `bigint` value `9223372036854775807n` will be stringify as
 * `9223372036854775807`.
 *
 * @param {object} obj
 *     the object to be serialized.
 * @param {null|undefined|object} options
 *     the additional options for the serialization. If this argument is
 *     `undefined` or `null`, the default options will be used. The default
 *     options can be retrieved by calling `DefaultOptions.get('toJSON')`.
 *     Available options are:
 *
 *     - `normalize: boolean`, indicates whether to normalize this object
 *       before serializing. The default value is `true`.
 *     - `removeEmptyFields: boolean`, indicates whether to ignore the empty
 *       fields of the object. If it is `true`, the empty fields of the object
 *       will be removed before serialization. The default value is `false`.
 *     - `convertNaming: boolean`, indicates whether to convert the naming
 *       of properties of the object represented by the result JSON string.
 *       The default value is `false`.
 *     - `sourceNamingStyle: string | NamingStyle`, the naming style of the
 *       source object, i.e., the object calling the `toJSON()` method.
 *       The default value of this argument is {@link LOWER_CAMEL}.
 *     - `targetNamingStyle: string | NamingStyle`, the naming style of the
 *       target object, i.e., the object represented by the result JSON
 *       string of the `toJSON()` method. The default value of this argument
 *       is {@link LOWER_UNDERSCORE}.
 *     - `space: string | number`, a string or number that's used to insert
 *       white space (including indentation, line break characters, etc.) into
 *       the output JSON string for readability purposes. If this is a number,
 *       it indicates the number of space characters to be used as indentation,
 *       clamped to 10 (that is, any number greater than 10 is treated as if
 *       it were 10). Values less than 1 indicate that no space should be used.
 *       If this is a string, the string (or the first 10 characters of the
 *       string, if it's longer than that) is inserted before every nested
 *       object or array. If this is anything other than a string or number
 *       (can be either a primitive or a wrapper object) — for example, is
 *       `null` or not provided — no white space is used. The default value
 *       of this option is `null`.
 * @returns {string}
 *     the JSON string serialized from this object, as `JSON.stringify()`
 *     does, except that this function provides additional stringification
 *     options.
 * @see DefaultOptions.get('toJSON')
 * @author Haixing Hu
 */
function toJsonString(obj, options) {
  if (typeof obj !== 'object') {
    throw new TypeError('The object to be serialized must be an object.');
  }
  const Class = obj.constructor;
  return toJsonStringImpl(Class, obj, options);
}

export default toJsonString;