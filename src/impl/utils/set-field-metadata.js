////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getFieldMetadataObject from './get-field-metadata-object';

/**
 * Sets the specified attribute value of the metadata for the specified field
 * of the specified class.
 *
 * @param {object} metadata
 *     The metadata of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @param {string} key
 *     The key of the specified attribute for the specified field.
 * @param {any} value
 *     The attribute value to be set.
 * @author Haixing Hu
 * @private
 */
function setFieldMetadata(metadata, field, key, value) {
  const md = getFieldMetadataObject(metadata, field);
  if (md) {
    md[key] = value;
  } else {
    throw new Error(`The metadata of the field "${field}" of the class`);
  }
}

export default setFieldMetadata;
