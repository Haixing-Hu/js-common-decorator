////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_ELEMENT_TYPE } from '../metadata-keys';
import getFieldMetadata from './get-field-metadata';

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
function getFieldElementType(metadata, field) {
  return getFieldMetadata(metadata, field, KEY_FIELD_ELEMENT_TYPE);
}

export default getFieldElementType;
