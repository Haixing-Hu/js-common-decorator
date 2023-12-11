////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import defaultNormalizer from './default-normalizer';
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_NORMALIZER } from './impl/metadata-keys';

/**
 * Sets the normalizer of a decorated field.
 *
 * @param {function} normalizer
 *     The normalizer to set.
 * @param {undefined} field
 *     The decorated target. In the case of decorating a class field, this
 *     argument is always `undefined` and is ignored.
 * @param {object} context
 *     The context object containing information about the decorated target.
 */
function setNormalizer(normalizer, field, context) {
  if (context.kind !== 'field' || context.static) {
    throw new TypeError(
      `The @Normalizable must decorate a non-static class field: ${context.name}`,
    );
  }
  if (typeof normalizer !== 'function') {
    throw new TypeError(
      `The argument of @Normalizable decorated on the "${context.name}" field must a function.`,
    );
  }
  setFieldMetadata(context.metadata, context.name, KEY_FIELD_NORMALIZER, normalizer);
}

/**
 * Decorates a class field to specify a normalization function for it.
 *
 * The decorated target must be a non-static field of a class.
 *
 * Usage example:
 *
 * ```js
 * class Foo {
 *   @Normalizable(trimUppercaseString)
 *   number = '';
 * }
 * ```
 *
 * The argument of this decorator must be a normalization function in the
 * following form:
 * ```js
 * function normalize(value) {
 *   ...
 *   return result;
 * }
 * ```
 * where
 * - The argument `value` is the field value to be normalized;
 * - The returned value of the function is the result of normalization of the
 *   input argument, whose type depends on the type of the decorated field.
 *
 * **NOTE:** If the field is a collection field, such as `Array`, `Set`, `Map`,
 * the normalization function will be called to normalize each element in the
 * collection. Currently, the following JavaScript build-in collection types are
 * supported:
 * - `Array`
 * - `Set`, `WeakSet`: the normalization function will be called to normalize
 *    each entry in the set.
 * - `Map`, `WeakMap`: the normalization function will be called to normalize
 *   each value in the map.
 * - `ArrayBuffer`
 * - `SharedArrayBuffer`
 * - `DataView`
 * - `Int8Array`
 * - `Uint8Array`
 * - `Uint8ClampedArray`
 * - `Int16Array`
 * - `Uint16Array`
 * - `Int32Array`
 * - `Uint32Array`
 * - `Float32Array`
 * - `Float64Array`
 * - `BigInt64Array`
 * - `BigUint64Array`
 *
 * The decorator can also be used without any arguments, in which case the
 * {@link defaultNormalizer} function will be used. For example,
 * ```js
 * class Foo {
 *   @Normalizable
 *   code = '';
 *
 *   @Normalizable
 *   names = [];
 *
 *   @Normalizable
 *   person = new Person();
 * }
 * ```
 * The default normalization function does the following things:
 * - If the value is `undefined` or `null`, it returns the value itself;
 * - If the value is a string, it returns the trimmed string;
 * - If the value is an array, it returns an array whose elements are normalized
 *   by the default normalizer;
 * - If the value is an object, it returns the result of calling the `normalize()`
 *   method of the object, if the object has such a method;
 * - Otherwise, it returns the value itself.
 *
 * @param {...any} args
 *     The array of arguments for calling this decorator. If it has only one
 *     argument, the only argument is the specified normalizer of this
 *     decorator, and this function should return another function which is the
 *     decorator of a class; If it has two arguments, the first argument is the
 *     decorated target (in the case of decorating a class field, this argument
 *     should always be `undefined`), and the second argument is the context
 *     object containing information about the decorated target.
 * @return {Function}
 *     If this function has only one argument, this function returns another
 *     function which is the decorator of a class; otherwise, this function
 *     returns nothing.
 * @author Haixing Hu
 * @see defaultNormalizer
 * @see Model
 */
function Normalizable(...args) {
  if (args.length === 1) {
    return (field, context) => setNormalizer(args[0], field, context);
  } else if (args.length === 2) {
    return setNormalizer(defaultNormalizer, args[0], args[1]);
  } else {
    throw new TypeError('Invalid use of @Normalizable decorator.');
  }
}

export default Normalizable;
