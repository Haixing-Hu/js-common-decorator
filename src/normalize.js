////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import defaultNormalizer from './default-normalizer';

/**
 * Normalizes a value with the default normalizer.
 *
 * This function does the following things:
 * - If the value is `undefined` or `null`, it returns the value itself;
 * - If the value is a string, it returns the trimmed string;
 * - If the value is a collection, it returns the same type of collection whose
 *   elements are normalized by the default normalizer;
 * - If the value is an object, it returns the result of calling the `normalize()`
 *   method of the object, if the object has such a method;
 * - Otherwise, it returns the value itself.
 *
 * Currently, the following JavaScript build-in collection types are supported:
 * - `Array`, `Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`,
 *   `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`,
 *    `BigInt64Array`, `BigUint64Array`: the normalization function will be called
 *    to normalize each element in the collection.
 * - `Set`, `WeakSet`: the normalization function will be called to normalize
 *    each entry in the set.
 * - `Map`, `WeakMap`: the normalization function will be called to normalize
 *   each value in the map.
 *
 * @param {any} value
 *     The value to be normalized.
 * @return {any}
 *     The normalized value.
 * @author Haixing Hu
 */
function normalize(value) {
  return defaultNormalizer(value);
}

export default normalize;
