////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getFieldLabel, isFieldNullable } from '../field-utils';
import { getInstanceName } from '../utils';
import ValidationResult from '../../model/validation-result';

/**
 * Validates the specified nullish field of the specified object.
 *
 * If the field value is nullish, i.e., is `null` or `undefined`, this function
 * check whether the field is decorated with `@Nullable`. If it is not, a
 * validation error is returned; otherwise a success validation result is
 * returned. If the field value is not nullish, this function does nothing and
 * returns `null`.
 *
 * This function assumes that the field exists and is validatable.
 *
 * @param {function} Class
 *     The class of the object to be validated.
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is validatable.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @param {object} config
 *     The configuration of the `@Validatable` decorator.
 * @param {object} options
 *     The options of validation.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field is nullish; `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateNullishField(Class, metadata, obj, field, value, config, options) {
  if (value === undefined || value === null) {
    if (isFieldNullable(metadata, field)) {
      return new ValidationResult(true);
    } else {
      const label = options.label ?? getFieldLabel(metadata, field);
      const name = options.name ?? getInstanceName(metadata, obj);
      // TODO: make the message i18n
      const message = name
        ? `The ${label} of ${name} must be specified.`
        : `The ${label} must be specified.`;
      return new ValidationResult(false, message);
    }
  }
  return null;
}

export default validateNullishField;
