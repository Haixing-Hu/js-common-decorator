////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The default options for the `toJSON()` and `toJsonString()` methods of the
 * class decorated by `@Model`.
 *
 * @author Haixing Hu
 */
class DefaultToJsonOptions {
  /**
   * Indicates whether to normalize this object before serializing it into JSON.
   *
   * The default value of this option is `true`.
   *
   * @type {boolean}
   */
  normalize = true;

  /**
   * Indicates whether to convert the naming of properties of the object
   * represented by the result JSON string.
   *
   * The default value of this option is `false`.
   *
   * @type {boolean}
   */
  convertNaming = false;

  /**
   * The naming style of the source object, i.e., the object calling the
   * `toJSON()` method.
   *
   * The default value of this option is `LOWER_CAMEL`.
   *
   * @type {string}
   */
  sourceNamingStyle = 'LOWER_CAMEL';

  /**
   * The naming style of the target object, i.e., the object represented by the
   * result JSON string of the `toJSON()` method.
   *
   * The default value of this option is `LOWER_UNDERSCORE`.
   *
   * @type {string}
   */
  targetNamingStyle = 'LOWER_UNDERSCORE';

  /**
   * A string or number that's used to insert white space (including indentation,
   * line break characters, etc.) into the output JSON string for readability
   * purposes.
   *
   * If this is a number, it indicates the number of space characters to be used
   * as indentation, clamped to 10 (that is, any number greater than 10 is
   * treated as if it were 10). Values less than 1 indicate that no space should
   * be used.
   *
   * If this is a string, the string (or the first 10 characters of the string,
   * if it's longer than that) is inserted before every nested object or array.
   *
   * If space is anything other than a string or number (can be either a
   * primitive or a wrapper object) — for example, is null or not provided
   * — no white space is used.
   *
   * The default value of this option is `0`, indicating that no white space is
   * used.
   *
   * @type {string | number}
   */
  space = 0;
}

export default DefaultToJsonOptions;
