////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { LOWER_UNDERSCORE, LOWER_CAMEL } from '@haixing_hu/naming-style';

/**
 * The map storing the default values of options of different aspects.
 *
 * The key of this map is the name of aspects, and the value of this map is an
 * object representing the default options of the aspect.
 *
 * @type {Map<string, object>}
 * @author Haixing Hu
 * @private
 */
const DEFAULT_OPTIONS_MAP = new Map();

/**
 * The class used to get or set the default options of different aspects.
 *
 * This class accesses an internal `Map` object. The key of the map is the name
 * of aspects, and the value of the map is an object representing the default
 * options of the aspect.
 *
 * For example, the default options of the `assign()` method of the class
 * decorated by `@Model` is stored in the key `assign`. That is,
 * `DefaultOption.get('assign')` returns the object representing the default
 * options of the `assign()` method.
 *
 * The program can change the default options with `DefaultOptions.set('key', options)`
 * method.
 *
 * Currently, the following aspects are supported:
 * - `assign`: the default options of the `assign()` method of the class decorated
 *   by `@Model`.
 *
 * @author Haixing Hu
 */
class DefaultOptions {
  /**
   * Gets the default options of the specified aspect.
   *
   * @param {string} aspect
   *     the name of the aspect.
   * @return {object}
   *     the object representing the default options of the aspect, or `undefined`
   *     if the aspect does not exist. Note that the returned object is exactly
   *     the same object stored in the internal map, so the caller can modify
   *     the object directly to change the default options.
   */
  static get(aspect) {
    return DEFAULT_OPTIONS_MAP.get(aspect);
  }

  /**
   * Sets the default options of the specified aspect.
   *
   * @param {string} aspect
   *     the name of the aspect.
   * @param {object} options
   *     the new default options of the aspect to be set. This function will
   *     store the exactly same object in the internal map, so the caller can
   *     modify the object directly to change the default options.
   */
  static set(aspect, options) {
    DEFAULT_OPTIONS_MAP.set(aspect, options);
  }
}

// setting up default options of the `assign()` methods of the class decorated by `@Model`
DEFAULT_OPTIONS_MAP.set('assign', {
  /**
   * Indicates whether to normalize this object after the assignment.
   *
   * The default value is `true`.
   */
  normalize: true,

  /**
   * Indicates whether to convert the naming style of the target object.
   *
   * The default value is `false`.
   */
  convertNaming: false,

  /**
   * The naming style of the source object.
   *
   * The default value is {@link LOWER_UNDERSCORE}.
   */
  sourceNamingStyle: LOWER_UNDERSCORE,

  /**
   * The naming style of the target object.
   *
   * The default value is {@link LOWER_CAMEL}.
   */
  targetNamingStyle: LOWER_CAMEL,
});

export default DefaultOptions;
