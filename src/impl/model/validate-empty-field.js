////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isEmpty } from '@haixing_hu/common-util';
import {
  getFieldLabel,
  isFieldNonEmpty,
} from '../field-utils';
import { getInstanceName } from '../utils';
import ValidationResult from '../../model/validation-result';

/**
 * Validates the specified empty field of the specified object.
 *
 * If the field value is empty, this function check whether the field is
 * decorated with `@NonEmpty`. If it is, a validation error is returned;
 * otherwise a success validation result is returned. If the field value is not
 * empty, this function does nothing and returns `null`.
 *
 * A field value is empty, if it is a string, an array, a map, a set, or any
 * object with `length` property, `size` property or `isEmpty()` function, and
 * these properties or functions return `0` or `true`.
 *
 * This function assumes that the field exists and is validatable, and is
 * non-nullish.
 *
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is validatable, and is non-nullish.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @param {object} context
 *     The validation context.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field is empty; `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateEmptyField(metadata, obj, field, value, context) {
  if (isEmpty(value)) {
    if (isFieldNonEmpty(metadata, field)) {
      const label = context.label ?? getFieldLabel(metadata, field);
      const owner = context.owner ?? getInstanceName(metadata, obj);
      // TODO: make the message i18n
      const message = owner
        ? `The ${label} of ${owner} cannot be empty.`
        : `The ${label} cannot be empty.`;
      return new ValidationResult(false, message);
    } else {
      return new ValidationResult(true);
    }
  }
  return null;
}

export default validateEmptyField;
