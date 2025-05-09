////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import defaultNormalizer from './default-normalizer';
import { KEY_FIELD_NORMALIZER } from './impl/metadata-keys';
import isDecoratorContext from './impl/utils/is-decorator-context';
import setFieldMetadata from './impl/utils/set-field-metadata';

/**
 * Sets the normalizer of a decorated field.
 *
 * @param {undefined} field
 *     The decorated target. In the case of decorating a class field, this
 *     argument is always `undefined` and is ignored.
 * @param {object} metadata
 *     The metadata in the context of the decorated target.
 * @param {string} kind
 *     The kind of the decorated target.
 * @param {string} name
 *     The name of the decorated target.
 * @param {function} normalizer
 *     The normalizer to set.
 * @author Haixing Hu
 * @private
 */
function setNormalizer(field, { metadata, kind, name }, normalizer) {
  if (kind !== 'field') {
    throw new SyntaxError(`The @Normalizable must decorate a class field: ${name}`);
  }
  if (typeof normalizer !== 'function') {
    throw new TypeError(
      `The argument of @Normalizable decorated on the "${name}" field must be a function, but it is a ${typeof normalizer}.`,
    );
  }
  setFieldMetadata(metadata, name, KEY_FIELD_NORMALIZER, normalizer);
}

/**
 * Decorates a class field to specify a normalization function for it.
 *
 * The decorated target must be a non-static field of a class.
 *
 * ##### Usage example:
 *
 * ```js
 * class Foo {
 *   &#064;Normalizable(trimUppercaseString)
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
 * - `Array`, `Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`,
 *   `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`,
 *   `BigInt64Array`, `BigUint64Array`: the normalization function will be
 *   called to normalize each element in the array.
 * - `Set`: the normalization function will be called to normalize each entry in
 *   the set.
 * - `Map`: the normalization function will be called to normalize each value in
 *   the map.
 *
 * The decorator can also be used without any arguments, in which case the
 * {@link defaultNormalizer} function will be used. For example,
 * ```js
 * class Foo {
 *   &#064;Normalizable
 *   code = '';
 *
 *   &#064;Normalizable
 *   names = [];
 *
 *   &#064;Normalizable
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
 * @return {Function|undefined}
 *     If this function has only one argument, this function returns another
 *     function which is the decorator of a field; otherwise, this function
 *     sets the normalizer of the decorated field and returns nothing.
 * @author Haixing Hu
 * @see defaultNormalizer
 * @see Model
 */
function Normalizable(...args) {
  if (args.length === 1) {
    const normalizer = args[0] ?? defaultNormalizer;
    return (field, context) => setNormalizer(field, context, normalizer);
  } else if ((args.length === 2) && isDecoratorContext(args[1])) {
    setNormalizer(args[0], args[1], defaultNormalizer);
  } else {
    throw new SyntaxError('Invalid use of @Normalizable decorator.');
  }
}

export default Normalizable;
