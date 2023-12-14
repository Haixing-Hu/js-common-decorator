////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getValidationOptions from './get-validation-options';

/**
 * Validates the specified field of the specified object.
 *
 * This function simply calls the validator function provided by the `@Validatable`
 * decorator of the field to validate the field.
 *
 * This function assumes that the field exists, is validatable, is non-nullish,
 * is non-empty, and is not an array, nor a set, nor a map.
 *
 * @param {function} Class
 *     The constructor of the class of the object to be validated.
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
 *     The validation result if the specified field is an array or a typed array;
 *     `null` otherwise.
 * @author Haixing Hu
 * @private
 */
function validateNormalField(Class, metadata, obj, field, value, config, options) {
  // get the validator
  const validator = config.validator;
  // get the validation options
  const opts = getValidationOptions(Class, metadata, obj, field, config, options);
  // call the validator
  return validator(value, opts);
}

export default validateNormalField;
