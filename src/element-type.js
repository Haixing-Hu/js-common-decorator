////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_ELEMENT_TYPE } from './impl/metadata-keys';
import setFieldMetadata from './impl/utils/set-field-metadata';

/**
 * Decorates a class field to mark it as an array of the specified type.
 *
 * The decorated target must be a field of a class.
 *
 * ##### Usage example:
 *
 * ```js
 * class Foo {
 *   &#064;ElementType(ItemType)
 *   items = [];
 * }
 * ```
 *
 * @param {function} elementType
 *     The constructor of the class of the element in the decorated field.
 * @returns {function}
 *     The field decorating function, which returns `void`.
 * @author Haixing Hu
 * @see Model
 * @see Type
 */
function ElementType(elementType) {
  return function decorate(field, { kind, name, metadata }) {
    if (kind !== 'field') {
      throw new SyntaxError(`The decorator @ElementType can only decorate a class field: ${name}`);
    }
    if (typeof elementType !== 'function') {
      throw new TypeError(`The argument of @ElementType decorated on "${name}" must be the constructor of a class.`);
    }
    setFieldMetadata(metadata, name, KEY_FIELD_ELEMENT_TYPE, elementType);
    return (initialValue) => {
      if ((initialValue !== undefined) && (initialValue !== null) && (!Array.isArray(initialValue))) {
        throw new TypeError(`The field "${name}" decorated by @ElementType must be initialized with an array.`);
      }
      return initialValue;
    };
  };
}

export default ElementType;
