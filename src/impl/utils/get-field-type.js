////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_TYPE } from '../metadata-keys';
import getDefaultInstance from './get-default-instance';
import getFieldMetadata from './get-field-metadata';

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
function getFieldType(Class, metadata, field) {
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

export default getFieldType;
