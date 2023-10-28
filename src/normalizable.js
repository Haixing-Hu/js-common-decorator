////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_NORMALIZER } from './impl/metadata-keys';

/**
 * Decorates a class field to specify a normalization function for it.
 *
 * The decorated target must be a field of a class.
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
 * @param {function} normalizer
 *     The normalization function used by the decorated class field.
 * @returns {function}
 *     The field decorating function, which returns `void`.
 * @author Haixing Hu
 * @see Model
 */
function Normalizable(normalizer) {
  return function decorate(field, { kind, name, metadata }) {
    if (kind !== 'field') {
      throw new TypeError(`The decorator @Normalizer can only decorate a class field: ${name}`);
    }
    if (typeof normalizer !== 'function') {
      throw new TypeError(`The argument of @Normalizer decorated on "${name}" must a function.`);
    }
    setFieldMetadata(metadata, name, KEY_FIELD_NORMALIZER, normalizer);
  };
}

export default Normalizable;
