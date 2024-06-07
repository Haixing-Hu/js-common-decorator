////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The default options for the `Class.prototype.assign()`, `Class.create()`,
 * `Class.createArray()`, `Class.createPage()`, `Class.parseJsonString()`
 * methods of  the class decorated by `@Model`.
 *
 * @author Haixing Hu
 */
class DefaultAssignmentOptions {
  /**
   * Indicates whether to normalize this object after the assignment.
   *
   * The default value of this option is `true`.
   *
   * @type {boolean}
   */
  normalize = true;

  /**
   * Indicates whether to convert the naming style of the target object.
   *
   * The default value of this option is `false`.
   *
   * @type {boolean}
   */
  convertNaming = false;

  /**
   * The naming style of the source object, i.e., the first argument of the
   * `assign()` method.
   *
   * The default value of this option is `LOWER_UNDERSCORE`.
   *
   * @type {string}
   */
  sourceNamingStyle = 'LOWER_UNDERSCORE';

  /**
   * The naming style of the target object, i.e., the object calling the
   * `assign()` method.
   *
   * The default value of this option is `LOWER_CAMEL`.
   *
   * @type {string}
   */
  targetNamingStyle = 'LOWER_CAMEL';
}

export default DefaultAssignmentOptions;
