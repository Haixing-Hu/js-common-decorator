////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import createImpl from './create-impl';

/**
 * Creates a new instance array based on the given object array.
 *
 * Each element of the created array is an instance of the specified class,
 * whose fields are initialized with the corresponding element of the specified
 * object array.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {array} array
 *     The specified array of objects.
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
 *     - `elementTypes: object`, the additional information about types of
 *       elements of fields of classes. The keys of this object are the paths of
 *       the fields or sub-fields of the target object, the values are the types
 *       of the elements, represented as the constructor functions of the types.
 * @return {array}
 *     A new array of instances of the specified class, or `null` if the
 *     specified array is `undefined` or `null`. Each element of the created
 *     array is an instance of the specified class, whose fields are initialized
 *     with the corresponding element of the specified object array.
 * @author Haixing Hu
 * @private
 */
function createArrayImpl(Class, array, options) {
  if (array === undefined || array === null) {
    return null;
  }
  if (Array.isArray(array)) {
    // Handle standard arrays
    return array.map((e) => createImpl(Class, e, options));
    // No special handling required for Vue-managed arrays
    // } else if (Object.prototype.toString.call(array) === '[object Array]') {
    //   // 处理Vue托管数组
    //   const result = [];
    //   for (let index in array) {
    //     const e = array[index];
    //     const obj = Class.create(e, normalizable);
    //     result.push(obj);
    //   }
    //   return result;
  } else {
    throw new TypeError(`The first argument of ${Class.name}.createArray() must be an array.`);
  }
}

export default createArrayImpl;
