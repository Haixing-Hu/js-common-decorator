////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_NULLABLE } from './impl/metadata-keys';

/**
 * Decorates the class field to indicate that it can be `null`.
 *
 * The decorated target must be a field of a class.
 *
 * Usage example:
 *
 * ```js
 * class Employee {
 *   @Validator(nameValidator)
 *   @DisplayName('Name', 'i18n.field.name')
 *   name = '';
 *
 *   @Validator(integerValidator)
 *   @DisplayName('Level', 'i18n.field.level')
 *   @Nullable
 *   level = 0;
 * }
 * ```
 *
 * @param {undefined} field
 *     The decorated target. This argument should be `undefined` if this
 *     decorator decorates a class field.
 * @param {string} kind
 *     The kind of decorated target. This argument should be `field` if this
 *     decorator decorates a class field.
 * @param {string} name
 *     The name of the decorated target. This argument should be the name of a
 *     class field if this decorator decorates a class field.
 * @param {object} metadata
 *     The metadata associated to the class the decorated target belongs to.
 * @author Haixing Hu
 * @see Model
 */
function Nullable(field, { kind, name, metadata }) {
  if (kind !== 'field') {
    throw new TypeError(`The decorator @Nullable can only decorate a class field: ${name}`);
  }
  setFieldMetadata(metadata, name, KEY_FIELD_NULLABLE, true);
}

export default Nullable;
