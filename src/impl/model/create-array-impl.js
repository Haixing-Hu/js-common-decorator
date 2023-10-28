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
 * @param {boolean} normalized
 *     Indicates to normalize the instances in the created array.
 * @return {array}
 *     A new array of instances of the specified class, or `null` if the
 *     specified array is `undefined` or `null`. Each element of the created
 *     array is an instance of the specified class, whose fields are initialized
 *     with the corresponding element of the specified object array.
 * @author Haixing Hu
 * @private
 */
function createArrayImpl(Class, array, normalized) {
  if (array === undefined || array === null) {
    return null;
  }
  if (Array.isArray(array)) {
    // Handle standard arrays
    return array.map((e) => createImpl(Class, e, normalized));
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
