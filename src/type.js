////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_TYPE } from './impl/metadata-keys';

/**
 * Decorates a class field to mark it as an object of the specified type.
 *
 * The decorated target must be a field of a class.
 *
 * Usage example:
 *
 * ```js
 * class Foo {
 *   &#064;Type(ItemType)
 *   item = null;
 * }
 * ```
 *
 * @param {function} type
 *     The constructor of the class to which the decorated field belongs.
 * @returns {function}
 *     The field decorating function, which returns `void`.
 * @author Haixing Hu
 * @see Model
 * @see ElementType
 */
function Type(type) {
  return function decorate(field, { kind, name, metadata }) {
    if (kind !== 'field') {
      throw new TypeError(`The decorator @Type can only decorate a class field: ${name}`);
    }
    if (typeof type !== 'function') {
      throw new TypeError(`The argument of @Type decorated on "${name}" must a class.`);
    }
    setFieldMetadata(metadata, name, KEY_FIELD_TYPE, type);
  };
}

export default Type;
