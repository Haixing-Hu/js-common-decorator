////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ValidationResult from '../../model/validation-result';

/**
 * Validates the specified fields of the specified object。
 *
 * @param {function} Class
 *     The constructor of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string | array<string>} fields
 *     The names of fields to be validated. If it is `undefined`, `null`, or
 *     the string `"*"`, all validatable fields of the specified object will be
 *     validated; if it is an array of strings, all validatable fields of the
 *     specified object whose names in this array will be validated.
 * @param {object} options
 *     The validation options.
 * @return {object}
 *     The validated object.
 * @author Haixing Hu
 * @private
 */
function validateImpl(Class, obj, fields, options) {
  if (fields === undefined || fields === null || fields === '*') {
    const results = Object.keys(obj).map((f) => obj.validateField(f, options));
    return ValidationResult.merge(results);
  } else if (Array.isArray(fields)) {
    const results = fields.map((f) => obj.validateField(f, options));
    return ValidationResult.merge(results);
  } else if (typeof fields === 'string') {
    const result = obj.validateField(fields, options);
    return result ?? new ValidationResult(true);
  } else {
    throw new TypeError(`The argument ${Class.name}.validate() must be a string or an array of strings.`);
  }
}

export default validateImpl;
