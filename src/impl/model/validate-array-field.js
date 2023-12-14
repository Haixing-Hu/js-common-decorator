////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isTypedArray } from '@haixing_hu/typeinfo';
import ValidationResult from '../../model/validation-result';
import getElementValidationContext from './get-element-validation-context';

/**
 * Validates the specified array field of the specified object.
 *
 * If the field value is an array or a typed array, this function recursively
 * validates each element in the array, and returns the combination of the
 * validation results; otherwise, this function does nothing and returns `null`.
 *
 * This function assumes that the field exists, and is validatable, not nullish
 * nor empty.
 *
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is validatable, and is non-nullish.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @param {function} validator
 *     The validator function
 * @param {object} context
 *     The validation context.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field is an array or a typed array;
 *     `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateArrayField(metadata, obj, field, value, validator, context) {
  if (Array.isArray(value) || isTypedArray(value)) {
    // get the validation options
    const ctx = getElementValidationContext(metadata, obj, field, context);
    // validate each element of the array
    const results = value.map((e, i) => {
      ctx.index = i;
      return validator(e, ctx);
    });
    return ValidationResult.merge(results);
  }
  return null;
}

export default validateArrayField;
