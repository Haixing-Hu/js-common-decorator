////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_NULLABLE } from '../metadata-keys';
import getFieldMetadata from './get-field-metadata';

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
function isFieldNullable(metadata, field) {
  const nullable = getFieldMetadata(metadata, field, KEY_FIELD_NULLABLE);
  return (nullable === true);
}

export default isFieldNullable;
