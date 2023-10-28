////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_LABEL } from './impl/metadata-keys';

/**
 * Decorates a class field to specify its label, i.e., the display name of the
 * field in the UI.
 *
 * The decorated target must be a field of a class.
 *
 * Usage example：
 *
 * ```js
 * class Foo {
 *   @Validator(nameValidator)
 *   @Label('Foo name')
 *   name = '';
 *
 *   @Validator(integerValidator)
 *   @Label('number', 'i18n.foo.number')
 *   number = 0;
 * }
 * ```
 *
 * @param {string} label
 *     The label of the field.
 * @param {string} i18nKey
 *     The i18n key of the label. If this parameter is not specified, then the
 *     label is not internationalized.
 * @returns {function}
 *     The field decorating function, which returns `void`.
 * @author Haixing Hu
 * @see Model
 * @see Enum
 */
function Label(label, i18nKey = undefined) {
  return function decorate(field, { kind, name, metadata }) {
    if (kind !== 'field') {
      throw new TypeError(`The decorator @Label can only decorate a class field: ${name}`);
    }
    if (typeof label !== 'string') {
      throw new TypeError(`The first argument of @Label decorated on "${name}" must be a string.`);
    }
    if ((i18nKey !== undefined) && (typeof i18nKey !== 'string')) {
      throw new TypeError(`The second argument of @Label decorated on "${name}" must be a string.`);
    }
    setFieldMetadata(metadata, name, KEY_FIELD_LABEL, { label, i18nKey });
  };
}

export default Label;
