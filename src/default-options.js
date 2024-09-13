////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '@haixing_hu/clone';
import DefaultAssignmentOptions from './impl/default-options/default-assignment-options';
import DefaultToJsonOptions from './impl/default-options/default-to-json-options';

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
 * The class is used to get or set the default options of different aspects of
 * this library.
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
 * - `assign`: the default options of the `Class.prototype.assign()`,
 *   `Class.create()`, `Class.createArray()`, `Class.createPage()`,
 *   `Class.parseJsonString()` methods of  the class decorated by `@Model`.
 * - `toJSON`: the default options of the `Class.prototype.toJSON()`,
 *   `Class.prototype.toJsonString()` methods of the class decorated by `@Model`.
 *
 * @author Haixing Hu
 */
class DefaultOptions {
  /**
   * Gets the default options of the specified aspect.
   *
   * ##### Usage example:
   *
   * ```js
   * const opt1 = DefaultOptions.get('assign');
   * expect(opt1.convertNaming).toBe(false);
   * opt1.convertNaming = true;
   * const opt2 = DefaultOptions.get('assign');
   * expect(opt2.convertNaming).toBe(false);
   * ```
   *
   * @param {string} aspect
   *     the name of the aspect.
   * @return {object}
   *     the object representing the default options of the aspect, or `undefined`
   *     if the aspect does not exist. Note that the returned object is a deep
   *     cloned copy of the object stored in the internal map, so that the
   *     modification of the returned object will **not** affect the default
   *     options stored in the internal map.
   * @see DefaultOptions.merge
   * @see DefaultOptions.set
   * @author Haixing Hu
   */
  static get(aspect) {
    const result = DEFAULT_OPTIONS_MAP.get(aspect);
    return result ? clone(result) : undefined;
  }

  /**
   * Gets the default options of the specified aspect, merging the provided
   * default options into the returned object.
   *
   * **NOTE:** This function does **NOT** change the default options stored in the
   * internal map, instead, it returns a new object representing the merged options.
   *
   * ##### Usage example:
   *
   * ```js
   * const opt1 = DefaultOptions.get('assign');
   * expect(opt1.convertNaming).toBe(false);
   * const opt2 = DefaultOptions.merge('assign', { convertNaming: true });
   * expect(opt2.convertNaming).toBe(true);
   * expect(opt1.convertNaming).toBe(false);
   * const opt3 = DefaultOptions.merge('assign', null);
   * expect(opt3.convertNaming).toBe(false);
   * ```
   *
   * @param {string} aspect
   *     the name of the aspect.
   * @param {undefined|null|object} options
   *     the provided options of the aspect.
   * @return {object}
   *     the default options of the specified aspect, merging the provided
   *     options into the returned object.
   * @see DefaultOptions.get
   * @see DefaultOptions.set
   * @author Haixing Hu
   */
  static merge(aspect, options) {
    const result = DEFAULT_OPTIONS_MAP.get(aspect);
    if (result === undefined) {
      return clone(options);
    } else {
      return clone({ ...result, ...options });
    }
  }

  /**
   * Sets the default options of the specified aspect.
   *
   * ##### Usage example:
   *
   * ```js
   * const opt1 = DefaultOptions.get('assign');
   * expect(opt1.convertNaming).toBe(false);
   * DefaultOptions.set('assign', { convertNaming: true });
   * const opt2 = DefaultOptions.get('assign');
   * expect(opt2.convertNaming).toBe(true);
   * expect(opt1.convertNaming).toBe(false);
   * ```
   *
   * @param {string} aspect
   *     the name of the aspect.
   * @param {object} options
   *     the new default options of the aspect to be set. This function will
   *     merge the new options into the old default options of the aspect. If
   *     the new options have the same property as the old default options stored
   *     in the internal map, the value of the new options will override the
   *     value of the old default options; otherwise, the new property will be
   *     added to the old default options.
   * @see DefaultOptions.get
   * @see DefaultOptions.merge
   * @author Haixing Hu
   */
  static set(aspect, options) {
    const newOptions = clone(options);
    const oldOptions = DEFAULT_OPTIONS_MAP.get(aspect);
    if (oldOptions === undefined) {
      DEFAULT_OPTIONS_MAP.set(aspect, newOptions);
    } else {
      DEFAULT_OPTIONS_MAP.set(aspect, { ...oldOptions, ...newOptions });
    }
  }

  /**
   * Resets the default options to factory settings.
   *
   * @author Haixing Hu
   */
  static reset() {
    // setting up default options of the `assign()` methods of the class decorated by `@Model`
    DEFAULT_OPTIONS_MAP.set('assign', new DefaultAssignmentOptions());
    // setting up default options of the `toJSON()` methods of the class decorated by `@Model`
    DEFAULT_OPTIONS_MAP.set('toJSON', new DefaultToJsonOptions());
  }
}

DefaultOptions.reset();

export default DefaultOptions;
