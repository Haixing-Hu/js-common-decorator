////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  KEY_FIELD_ELEMENT_TYPE,
  KEY_FIELD_LABEL,
  KEY_FIELD_NON_EMPTY,
  KEY_FIELD_NULLABLE,
  KEY_FIELD_TYPE,
} from './metadata-keys';
import { getDefaultInstance, getFieldMetadata } from './utils';

/**
 * Gets the type of the specified field.
 *
 * If the field is decorated with `@Type` decorator, this function returns the
 * type specified by the decorator; otherwise, this function returns the type of
 * the value of the field of the default instance of the class.
 *
 * @param {function} Class
 *     The constructor of the class of the object.
 * @param {object} metadata
 *     the metadata of the class.
 * @param {string} field
 *     the name of the field.
 * @return {function}
 *     the constructor of the type of the field, or `undefined` if the field is
 *     not decorated with `@Type` decorator and its default value is `undefined`
 *     or `null`.
 * @author Haixing Hu
 * @private
 */
export function getFieldType(Class, metadata, field) {
  const result = getFieldMetadata(metadata, field, KEY_FIELD_TYPE);
  if (result !== undefined) {
    return result;
  }
  const defaultInstance = getDefaultInstance(Class);
  const defaultValue = defaultInstance[field];
  if (defaultValue !== undefined && defaultValue !== null) {
    return defaultValue.constructor;
  }
  return undefined;
}

/**
 * Gets the element type of the specified field.
 *
 * @param {object} metadata
 *     the metadata of the class.
 * @param {string} field
 *     the name of the field.
 * @return {function}
 *     the constructor of the element type of the field, or `undefined` if the
 *     field is not decorated with `@ElementType` decorator.
 * @author Haixing Hu
 * @private
 */
export function getFieldElementType(metadata, field) {
  return getFieldMetadata(metadata, field, KEY_FIELD_ELEMENT_TYPE);
}

/**
 * Gets the label of the specified field.
 *
 * @param {object} metadata
 *     the metadata of the class.
 * @param {string} field
 *     the name of the field.
 * @return {string}
 *     the i18n label of the field, or the name of the field if it is not
 *     decorated with `@Label`.
 * @author Haixing Hu
 * @private
 */
export function getFieldLabel(metadata, field) {
  const config = getFieldMetadata(metadata, field, KEY_FIELD_LABEL);
  if (config) {
    // TODO: i18n the label
    return config.label;
  }
  return field;
}

/**
 * Tests whether the specified field is nullable.
 *
 * @param {object} metadata
 *     the metadata of the class.
 * @param {string} field
 *     the name of the specified field.
 * @returns {boolean}
 *     `true` if the specified field is nullable, i.e., it is decorated with
 *     `@Nullable` decorator; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
export function isFieldNullable(metadata, field) {
  const nullable = getFieldMetadata(metadata, field, KEY_FIELD_NULLABLE);
  return (nullable === true);
}

/**
 * Tests whether the specified field should be non-empty.
 *
 * @param {object} metadata
 *     the metadata of the class.
 * @param {string} field
 *     the name of the specified field.
 * @returns {boolean}
 *     `true` if the specified field should be non-empty, i.e., it is decorated
 *     with `@NonEmpty` decorator; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
export function isFieldNonEmpty(metadata, field) {
  const nonEmpty = getFieldMetadata(metadata, field, KEY_FIELD_NON_EMPTY);
  return (nonEmpty === true);
}
