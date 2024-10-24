////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import typeInfo from '@haixing_hu/typeinfo';

/**
 * A default normalizer for a non-static class field.
 *
 * This normalizer does the following things:
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
function defaultNormalizer(value) {
  const info = typeInfo(value);
  switch (info.type) {
    case 'string':
      return value.trim();
    case 'undefined':
    case 'null':
    case 'boolean':
    case 'number':
    case 'bigint':
    case 'symbol':
    case 'function':
      return value;
    case 'object':
    default:
      break;
  }
  switch (info.category) {
    case 'array':
    case 'typed-array':
      return value.map((item) => defaultNormalizer(item));
    case 'map':
      return new Map(Array.from(value, ([k, v]) => [k, defaultNormalizer(v)]));
    case 'set':
      return new Set(Array.from(value, (v) => defaultNormalizer(v)));
    default:
      if (info.isBuiltIn) {
        return value;
      }
      if (typeof value.normalize === 'function') {
        // NOTE: we CANNOT just `return value.normalize()`, because the incorrect
        // implementation of `normalize()` method may return nothing.
        value.normalize();
      }
      return value;
  }
}

export default defaultNormalizer;
