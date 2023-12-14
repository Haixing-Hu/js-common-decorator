////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ValidationResult from '../../model/validation-result';
import getElementValidationContext from './get-element-validation-context';

/**
 * Validates the specified set field of the specified object.
 *
 * If the field value is a set, this function recursively validates each element
 * in the set, and returns the combination of the validation results;
 * otherwise, this function does nothing and returns `null`.
 *
 * This function assumes that the field exists, and is validatable, not nullish
 * nor empty.
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
 * @param {function} validator
 *     The validator function
 * @param {object} context
 *     The validation context.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field is a set; `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateSetField(metadata, obj, field, value, validator, context) {
  if (value instanceof Set) {
    // get the validation options
    const ctx = getElementValidationContext(metadata, obj, field, context);
    // validate each element of the set
    const results = Array.from(value, (e, i) => {
      ctx.index = i;
      return validator(e, ctx);
    });
    return ValidationResult.merge(results);
  }
  return null;
}

export default validateSetField;
