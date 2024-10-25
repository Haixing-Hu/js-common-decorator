////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_NON_EMPTY } from '../metadata-keys';
import getFieldMetadata from './get-field-metadata';

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
function isFieldNonEmpty(metadata, field) {
  const nonEmpty = getFieldMetadata(metadata, field, KEY_FIELD_NON_EMPTY);
  return (nonEmpty === true);
}

export default isFieldNonEmpty;
