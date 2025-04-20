////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import getFieldLabel from '../utils/get-field-label';
import getInstanceName from '../utils/get-instance-name';
import isFieldNullable from '../utils/is-field-nullable';

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
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is validatable.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field is nullish; `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateNullishField(metadata, obj, field, value, context = {}) {
  if (value === undefined || value === null) {
    if ((context && context.nullable) || isFieldNullable(metadata, field)) {
      return new ValidationResult(true);
    } else {
      const label = getFieldLabel(metadata, field);
      const name = getInstanceName(metadata, obj);
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
