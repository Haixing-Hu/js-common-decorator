////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@haixing_hu/common-validation-rule';
import getElementValidationContext from './get-element-validation-context';
import validateEmptyField from './validate-empty-field';

/**
 * Validates the specified map field of the specified object.
 *
 * If the field value is a map, this function recursively validates each mapped
 * value in the map, and returns the combination of the validation results;
 * otherwise, this function does nothing and returns `null`.
 *
 * Note that this function only validates the value of each mapping in the map,
 * not the key.
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
 *     The validation result if the specified field is a map; `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateMapField(metadata, obj, field, value, validator, context) {
  if (value instanceof Map) {
    // check the empty map
    const result = validateEmptyField(metadata, obj, field, value, context);
    if (result) {
      return result;
    }
    // get the validation options
    const ctx = getElementValidationContext(metadata, obj, field, context);
    // validate each element of the set
    const results = Array.from(value, (e, i) => {
      ctx.index = i;
      return validator(e[1], ctx);   // only validate the value, not the key
    });
    return ValidationResult.merge(results);
  }
  return null;
}

export default validateMapField;
