////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_FIELDS_METADATA } from '../metadata-keys';

/**
 * Gets the metadata object for the field of the specified class, or creates a
 * new one if it does not exist.
 *
 * @param {object} metadata
 *     The metadata of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @returns {object|undefined}
 *     The metadata object for the field of the specified class, creating a new
 *     one if it does not exist. Returns undefined if metadata is null or undefined.
 * @author Haixing Hu
 * @private
 */
function getFieldMetadataObject(metadata, field) {
  if (metadata == null) {
    return undefined;
  }
  metadata[KEY_CLASS_FIELDS_METADATA] ??= {};
  const fieldsMetadata = metadata[KEY_CLASS_FIELDS_METADATA];
  fieldsMetadata[field] ??= {};
  return fieldsMetadata[field];
}

export default getFieldMetadataObject;
