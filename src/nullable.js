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
 *   &#064;Validatable(nameValidator)
 *   &#064;Label('Name', 'i18n.field.name')
 *   name = '';
 *
 *   &#064;Validatable(integerValidator)
 *   &#064;Label('Level', 'i18n.field.level')
 *   &#064;Nullable
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
 * @see Validatable
 * @see Model
 */
function Nullable(field, { kind, name, metadata }) {
  if (kind !== 'field') {
    throw new SyntaxError(`The decorator @Nullable can only decorate a class field: ${name}`);
  }
  setFieldMetadata(metadata, name, KEY_FIELD_NULLABLE, true);
}

export default Nullable;
