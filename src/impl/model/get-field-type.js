////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_TYPE } from '../metadata-keys';
import getFieldMetadata from '../utils/get-field-metadata';

/**
 * Gets the type of the specified field of an object.
 *
 * The function will first check the annotated type information of the specified
 * field of the object. If the annotated type information is found, the function
 * will return it. Otherwise, the function will check the additional type
 * information provided by the options. If the additional type information is
 * found, the function will return it. Otherwise, the function will return
 * `null`.
 *
 * @param {object} metadata
 *     the metadata of the class of the object.
 * @param {string} field
 *     the name of the field.
 * @param {string} path
 *     the path of the field in the property tree of the original root object.
 * @param {object} options
 *     the additional options for the assignment.
 * @return {function|null}
 *     the type of the specified field of the object, or `null` if the field
 *     type cannot be inferred.
 * @private
 * @author Haixing Hu
 */
function getFieldType(metadata, field, path, options) {
  const annotatedType = getFieldMetadata(metadata, field, KEY_FIELD_TYPE);
  if (annotatedType) {
    if (typeof annotatedType !== 'function') {
      throw new TypeError(`The annotated type of the field '${path}' is not a function.`);
    }
    return annotatedType;
  }
  if (options && options.types && options.types[path]) {
    const result = options.types[path];
    if (typeof result !== 'function') {
      throw new TypeError(`The target type of the field '${path}' is not a function.`);
    }
    return result;
  }
  return null;
}

export default getFieldType;
