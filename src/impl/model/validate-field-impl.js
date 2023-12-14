////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '../../index';
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../class-metadata-cache';
import { KEY_FIELD_VALIDATOR } from '../metadata-keys';
import {
  getFieldMetadata,
  hasOwnPrototypeFunction,
} from '../utils';
import validateArrayField from './validate-array-field';
import validateEmptyField from './validate-empty-field';
import validateMapField from './validate-map-field';
import validateNormalField from './validate-normal-field';
import validateNullishField from './validate-nullish-field';
import validateSetField from './validate-set-field';

/**
 * Validates the specified field of the specified object.
 *
 * @param {function} Class
 *     The constructor of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated.
 * @param {object} context
 *     The validation context.
 * @returns {ValidationResult|null}
 *     The validation result if the specified field exists; `null` otherwise.
 *     If the specified field exist but is non-validatable, returns the success
 *     validation result.
 * @author Haixing Hu
 * @private
 */
function validateFieldImpl(Class, obj, field, context) {
  if (!Object.hasOwn(obj, field)) {
    // the field does not exist
    return null;
  }
  // If the class has a parent class, call the validateField of the parent class
  // to validate the field.
  const Parent = Object.getPrototypeOf(Class);
  if (hasOwnPrototypeFunction(Parent, 'validateField')) {
    const result = Parent.prototype.validateField.call(obj, field, context);
    if (result !== null) {
      // the field is validated by its parent class
      return result;
    }
  }
  // Otherwise, use the validator function to validate the field according to
  // the argument of the `@Validatable` decorator of the field.
  // Note that the context metadata of a class is inherited from its ancestor
  // classes, therefore, we can use the metadata of the current class to get the
  // validator function.
  const metadata = classMetadataCache.get(Class);
  const validator = getFieldMetadata(metadata, field, KEY_FIELD_VALIDATOR);
  if (validator === undefined) {
    // the field is not decorated with @Validatable
    return new ValidationResult(true);
  }
  const value = obj[field];
  return validateNullishField(metadata, obj, field, value)
    ?? validateEmptyField(metadata, obj, field, value, context)
    ?? validateArrayField(metadata, obj, field, value, validator, context)
    ?? validateSetField(metadata, obj, field, value, validator, context)
    ?? validateMapField(metadata, obj, field, value, validator, context)
    ?? validateNormalField(Class, metadata, obj, field, value, validator, context);
}

export default validateFieldImpl;
