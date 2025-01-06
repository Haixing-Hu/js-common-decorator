////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isEmpty } from '@qubit-ltd/common-util';
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import isEnumClass from './is-enum-class';

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
 *     the value to be validated.
 * @param {object} context
 *     the validation context.
 * @returns {ValidationResult}
 *     the validation result.
 * @author Haixing Hu
 * @see Model
 * @see Validatable
 * @see ValidationResult
 */
function defaultValidator(value, { owner, type, label, nullable, nonEmpty }) {
  if (value === undefined || value === null) {
    if (nullable) {
      return new ValidationResult(true);
    } else {
      // TODO: make the message i18n
      // const message = owner
      //   ? `The ${label} of ${owner} must be specified.`
      //   : `The ${label} must be specified.`;
      const message = owner
        ? `必须设置${owner}的${label}的值`
        : `必须设置${label}的值`;
      return new ValidationResult(false, message);
    }
  }
  if (isEmpty(value)) {
    if (nonEmpty) {
      // TODO: make the message i18n
      // const message = owner
      //   ? `The ${label} of ${owner} cannot be empty.`
      //   : `The ${label} cannot be empty.`;
      const message = owner
        ? `${owner}的${label}不能为空`
        : `${label}不能为空`;
      return new ValidationResult(false, message);
    }
  }
  if (type) {   // validate the type
    // special deal with the case that the type is an enumeration class
    if (isEnumClass(type) && (typeof value === 'string')) {
      if (type.hasValue(value)) {
        return new ValidationResult(true);
      } else {
        // TODO: i18n the following message
        // const message = owner
        //   ? `The ${label} of ${owner} is not supported: ${value}`
        //   : `The ${label} is not supported: ${value}`;
        const message = owner
          ? `${owner}的${label}的值不受支持: ${value}`
          : `${label}的值不受支持: ${value}`;
        return new ValidationResult(false, message);
      }
    }
    // note that the following test also covers the case that the value is a primitive
    if (value.constructor !== type) {
      // TODO: i18n the following message
      // const message = owner
      //   ? `The ${label} of ${owner} must be of the type ${type.name}.`
      //   : `The ${label} must be of the type ${type.name}.`;
      const message = owner
        ? `${owner}的${label}必须是 ${type.name} 类型`
        : `${label}必须是 ${type.name} 类型`;
      return new ValidationResult(false, message);
    }
  }
  if ((typeof value === 'object') && (typeof value.validate === 'function')) {
    return value.validate('*', { owner });
  }
  return new ValidationResult(true);
}

export default defaultValidator;
