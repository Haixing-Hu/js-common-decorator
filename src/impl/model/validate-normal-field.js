////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getValidationContext from '../utils/get-validation-context';

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
function validateNormalField(Class, metadata, obj, field, value, validator, context) {
  // get the validation context
  const ctx = getValidationContext(Class, metadata, obj, field, context);
  // call the validator
  return validator(value, ctx);
}

export default validateNormalField;
