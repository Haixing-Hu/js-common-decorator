////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_LABEL } from '../metadata-keys';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getFieldMetadata from './get-field-metadata';

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
function getFieldLabel(metadata, field) {
  const config = getFieldMetadata(metadata, field, KEY_FIELD_LABEL);
  if (config) {
    // TODO: i18n the label
    return config.label;
  }
  return field;
}

export default getFieldLabel;
