////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_NON_EMPTY } from './impl/metadata-keys';

/**
 * Decorates the class field to indicate that it can be empty.
 *
 * The decorated target must be a field of a class.
 *
 * The decorator can decorate string fields, array fields, map fields, or set
 * fields. Decorating other non-string, non-collection fields has no effect.
 *
 * ##### Usage example:
 *
 * ```js
 * class Employee {
 *   &#064;Validatable
 *   &#064;Label('Name', 'i18n.field.name')
 *   &#064;NonEmpty
 *   name = '';
 *
 *   &#064;Validatable
 *   &#064;Label('Titles', 'i18n.field.titles')
 *   &#064;NonEmpty
 *   titles = [];
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
function NonEmpty(field, { kind, name, metadata }) {
  if (kind !== 'field') {
    throw new SyntaxError(`The decorator @NonEmpty can only decorate a class field: ${name}`);
  }
  setFieldMetadata(metadata, name, KEY_FIELD_NON_EMPTY, true);
}

export default NonEmpty;
