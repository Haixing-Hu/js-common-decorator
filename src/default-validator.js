////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import ValidationResult from './model/validation-result';
import { isEnumClass } from './impl/utils';

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
 * @param {object} context
 *     the validation context.
 * @returns {ValidationResult}
 *     the validation result.
 * @author Haixing Hu
 * @see Model
 * @see Validatable
 * @see ValidationResult
 */
function defaultValidator(value, context) {
  if (context.type) {   // validate the type
    // special deal with the case that the type is an enumeration class
    if (isEnumClass(context.type) && (typeof value === 'string')) {
      if (context.type.hasValue(value)) {
        return new ValidationResult(true);
      } else {
        // TODO: i18n the following message
        const message = context.owner
          ? `The ${context.label} of ${context.owner} is not supported: ${value}`
          : `The ${context.label} is not supported: ${value}`;
        return new ValidationResult(false, message);
      }
    }
    // note that the following test also covers the case that the value is a primitive
    if (value.constructor !== context.type) {
      // TODO: i18n the following message
      const message = context.owner
        ? `The ${context.label} of ${context.owner} must be of the type ${context.type.name}.`
        : `The ${context.label} must be of the type ${context.type.name}.`;
      return new ValidationResult(false, message);
    }
  }
  if ((typeof value === 'object') && (typeof value.validate === 'function')) {
    return value.validate('*', { owner: context.owner });
  }
  return new ValidationResult(true);
}

export default defaultValidator;
