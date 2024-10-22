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

  /**
   * The additional information about types of fields of classes.
   *
   * The keys of this object are the path of the fields or sub-fields of the
   * target object, the values are the type of the fields, represented
   * as the constructor function of the type.
   *
   * For example:
   * ```js
   * &#064;Model
   * class Child {
   *   name = null;
   *
   *   credential = null;
   * }
   *
   * &#064;Model
   * class Foo {
   *   id = null;
   *
   *   &#064;Type(Child)
   *   child = null;
   * }
   * ```
   * In this example, in order to assign a JSON object to an instance of `Foo`,
   * we could specify the type of the `Foo.id`, `Foo.child.name`, and
   * `Foo.child.credential` as follows:
   * ```
   * const foo = Foo.create(obj, {
   *   targetTypes: {
   *     'Foo.id': Number,
   *     'Foo.child.name': String,
   *     'Foo.child.credential': Credential,
   *   },
   * });
   * ```
   *
   * Note that the path of the fields or sub-fields of the target object should
   * include the class name of the target object.
   *
   * The default value of this option is an empty object.
   *
   * @type {object}
   */
  targetTypes = {};

  /**
   * The additional information about element types of fields of the target object.
   *
   * The keys of this object are the path of the fields or sub-fields of the
   * target object, the values are the type of the fields, represented
   * as the constructor function of the type.
   *
   * For example:
   * ```js
   * &#064;Model
   * class Child {
   *   name = null;
   *
   *   credentials = [];
   * }
   *
   * &#064;Model
   * class Foo {
   *   id = null;
   *
   *   &#064;Type(Child)
   *   child = null;
   * }
   * ```
   * In this example, in order to assign a JSON object to an instance of `Foo`,
   * we could specify the type of the `Foo.id`, `Foo.child.name`, and
   * `Foo.child.credentials` as follows:
   * ```
   * const foo = Foo.create(obj, {
   *   targetTypes: {
   *     'Foo.id': Number,
   *     'Foo.child.name': String,
   *   },
   *   targetElementTypes: {
   *     'Foo.child.credential': Credential,
   *   },
   * });
   * ```
   *
   * Note that the path of the fields or sub-fields of the target object should
   * include the class name of the target object.
   *
   * The default value of this option is an empty object.
   *
   * @type {object}
   */
  targetElementTypes = {};
}

export default DefaultAssignmentOptions;
