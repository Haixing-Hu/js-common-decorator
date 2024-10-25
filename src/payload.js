////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_PAYLOAD } from './impl/metadata-keys';
import setFieldMetadata from './impl/utils/set-field-metadata';

/**
 * Decorates a static filed of an enumeration class to specify the payload of
 * the static field, i.e., the extra properties attached to the enumerator
 * corresponding to the static field.
 *
 * The decorated target must be a static field of a class.
 *
 * ##### Usage example：
 *
 * ```js
 * &#064;Enum
 * class Gender {
 *   &#064;Label('Male', 'i18n.gender.male')
 *   &#064;Payload({ code: '001', data: 0 })
 *   static MALE;
 *
 *   &#064;Label('Female', 'i18n.gender.female')
 *   &#064;Payload({ code: '002', data: 1 })
 *   static FEMALE;
 * }
 * ```
 *
 * @param {object} payload
 *     The object containing payload properties to be set. Note that the
 *     properties `name`, `label`, and `i18n` cannot be included in this object,
 *     since they are already used by the `@Enum` and `@Label` decorator.
 * @returns {function}
 *     The field decorating function, which returns `void`.
 * @author Haixing Hu
 * @see Enum
 */
function Payload(payload) {
  return function decorate(field, { kind, name, metadata }) {
    if (kind !== 'field') {
      throw new TypeError(`The decorator @Payload can only decorate a class field: ${name}`);
    }
    if (payload === null || typeof payload !== 'object') {
      throw new TypeError(`The argument of @Payload decorated on "${name}" must be a non-null object.`);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'name')) {
      throw new TypeError(`The argument of @Payload decorated on "${name}" cannot contain the reserved property "name".`);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'label')) {
      throw new TypeError(`The argument of @Payload decorated on "${name}" cannot contain the reserved property "label".`);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'i18n')) {
      throw new TypeError(`The argument of @Payload decorated on "${name}" cannot contain the reserved property "i18n".`);
    }
    setFieldMetadata(metadata, name, KEY_FIELD_PAYLOAD, payload);
  };
}

export default Payload;
