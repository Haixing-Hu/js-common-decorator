////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ValidationResult from '../../model/validation-result';
import getElementValidationOptions from './get-element-validation-options';

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
 * @param {function} Class
 *     The class of the object to be validated.
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is validatable, and is non-nullish.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @param {object} config
 *     The configuration of the `@Validatable` decorator.
 * @param {object} options
 *     The options of validation.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field is a set; `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateSetField(Class, metadata, obj, field, value, config, options) {
  if (value instanceof Set) {
    // get the validator
    const validator = config.validator;
    // get the validation options
    const opts = getElementValidationOptions(metadata, obj, field, config, options);
    // validate each element of the set
    const results = Array.from(value, (e, i) => {
      opts.index = i;
      return validator(e, opts);
    });
    return ValidationResult.merge(results);
  }
  return null;
}

export default validateSetField;
