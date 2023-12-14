////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ValidationResult from './model/validation-result';

/**
 * A default validator for a non-static class field.
 *
 * This validator does the following things:
 * - If the field value is `undefined` or `null`, and the field is not decorated
 *   with `@Nullable`, an error is reported.
 * - If the field value is an empty string or an empty collection, and the field
 *   is decorated with `@NonEmpty`, an error is reported.
 * - If the field value is a collection, it recursively validates each element
 *   in the collection.
 * - If the field value has an initial value, it validates whether the field
 *   value has the same type with its initial value.
 * - If the field is decorated with `@Type`, it validates whether the field
 *   value has the type specified by the `@Type`.
 * - If the field is a collection and is decorated with `@ElementType`, it
 *   validates whether each element of the field value has the type specified by
 *   the `@ElementType`.
 * - If the value is an object with the `validate()` method, it returns the
 *   result of calling the `validate()`  method of the object.
 * - Otherwise, it does nothing and returns a success validation result.
 *
 * @param {any} value
 *     the value to be validated, which is assumed to be non-nullish, non-empty,
 *     non-collection.
 * @param {object} options
 *     the validation options.
 * @returns {ValidationResult}
 *     the validation result.
 * @see Validatable
 */
function defaultValidator(value, options) {
  if (options.type) {
    // validate the type
    // note that the following test also covers the case that the value is a primitive
    if (value.constructor !== options.type) {
      // TODO: make the following message i18n
      const message = options.name
        ? `The ${options.label} of ${options.name} must be of the type ${options.type.name}`
        : `The ${options.label} must be of the type ${options.type.name}`
      return new ValidationResult(false, message);
    }
  }
  if ((typeof value === 'object') && (typeof value.validate === 'function')) {
    // validate the value itself, and set the current instance as the parent of the value
    return value.validate('*', { parent: options.instance });
  }
}

export default defaultValidator;
