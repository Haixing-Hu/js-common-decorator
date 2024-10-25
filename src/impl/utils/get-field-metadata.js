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
 * Gets the specified attribute value of the metadata of the specified field
 * of the specified class.
 *
 * @param {object} metadata
 *     The metadata of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @param {string} key
 *     The key of the specified attribute for the specified field.
 * @return {object}
 *     The attribute value associated with the specified key in the metadata of
 *     the specified field of the specified class, or `undefined` if it does
 *     not exist.
 * @author Haixing Hu
 * @private
 */
function getFieldMetadata(metadata, field, key) {
  const md = getFieldMetadataObject(metadata, field);
  return (md ? md[key] : undefined);
}

export default getFieldMetadata;
