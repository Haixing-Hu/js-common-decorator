////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import typeInfo from '@qubit-ltd/typeinfo';
import enumNormalizer from './enum-normalizer';
import isEnumClass from './is-enum-class';

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
 * @param {object} context
 *     The context of normalization. It is an object with the following fields:
 *  - `path: string`, the path of the root object of this object.
 *     The default value of this option is `''`.
 *  - `type: function`, the type of the field to be normalized.
 *  - `types: object`, the additional information about types of fields of
 *     classes. The keys of this object are the path of the fields or
 *     sub-fields of this object, the values are the type of the fields,
 *     represented as the constructor function of the type. The path of the
 *     root of this object is an empty, therefore the path of the direct field of
 *     this object is of the form `'.field'`, and the path of the sub-field of
 *     a field is of the form `'.field.subField'`. The default value of this
 *     option is `{}`.
 *  - `elementTypes: object`, the additional information about types of
 *     elements of fields of classes. The keys of this object are the path of
 *     the fields or sub-fields of the target object, the values are the type
 *     of the elements, represented as the constructor function of the type.
 *     The default value of this option is `{}`.
 * @return {any}
 *     The normalized value.
 * @author Haixing Hu
 */
function defaultNormalizer(value, context = {}) {
  context ??= {};
  context.path ??= '';
  const info = typeInfo(value);
  switch (info.category) {
    case 'string':
      if (isEnumClass(context.type)) {
        // special treatment for enum class
        const normalizer = enumNormalizer(context.type);
        return normalizer(value);
      } else {
        return value.trim();
      }
    case 'array':       // drop down
    case 'typed-array':
      return value.map((v) => defaultNormalizer(v));
    case 'map':
      return new Map(Array.from(value, ([k, v]) => [k, defaultNormalizer(v, context)]));
    case 'set':
      return new Set(Array.from(value, (v) => defaultNormalizer(v, context)));
    default:
      if (info.isBuiltIn) {
        return value;
      }
      if (typeof value.normalize === 'function') {
        // NOTE: we CANNOT just `return value.normalize()`, because the incorrect
        // implementation of `normalize()` method may return nothing.
        const newContext = {
          path: context.path,
          types: context.types,
          elementTypes: context.elementTypes,
        };
        value.normalize('*', newContext);
      }
      return value;
  }
}

export default defaultNormalizer;
