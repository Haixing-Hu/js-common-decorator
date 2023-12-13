////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_NAME_FIELD } from './impl/metadata-keys';

/**
 * Decorates a class field to specify it as the "name" of the object.
 *
 * The decorated target must be a field of a class.
 *
 * Usage example:
 *
 * ```js
 * class Foo {
 *   @Validatable(nameValidator)
 *   @Label('Name')
 *   @NameField
 *   name = '';
 *
 *   @Validatable
 *   @Label('Gender')
 *   @Type(Gender)
 *   @Nullable
 *   gender = null;
 *
 *   @Validatable(validatePersonBirthday)
 *   @Label('Birthday')
 *   @Nullable
 *   birthday = '';
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
function NameField(field, { kind, name, metadata }) {
  if (kind !== 'field') {
    throw new TypeError(`The decorator @NameField can only decorate a class field: ${name}`);
  }
  // Set the name of the decorated field as the name field of the class
  if (metadata[KEY_CLASS_NAME_FIELD]) {
    throw new Error(`There is already a name field for the class: ${metadata[KEY_CLASS_NAME_FIELD]}`);
  }
  metadata[KEY_CLASS_NAME_FIELD] = name;
}

export default NameField;
