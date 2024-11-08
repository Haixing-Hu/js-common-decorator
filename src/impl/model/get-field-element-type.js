////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_ELEMENT_TYPE } from '../metadata-keys';
import getFieldMetadata from '../utils/get-field-metadata';

/**
 * Gets the element type of a field of an object.
 *
 * The function will first check the annotated element type information of the
 * specified field of the object. If the annotated type information is found, the
 * function will return it. Otherwise, the function will check the additional
 * type information provided by the options. If the additional type information
 * is found, the function will return it. Otherwise, the function will return
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
 *     the element type of the specified field of the object, or `null` if the
 *     field element type cannot be inferred.
 * @private
 * @author Haixing Hu
 */
function getFieldElementType(metadata, field, path, options) {
  const annotatedElementType = getFieldMetadata(metadata, field, KEY_FIELD_ELEMENT_TYPE);
  if (annotatedElementType) {
    if (typeof annotatedElementType !== 'function') {
      throw new TypeError(`The annotated element type of the field '${path}' is not a function.`);
    }
    return annotatedElementType;
  }
  if (options && options.elementTypes && options.elementTypes[path]) {
    const result = options.elementTypes[path];
    if (typeof result !== 'function') {
      throw new TypeError(`The target element type of the field '${path}' is not a function.`);
    }
    return result;
  }
  return null;
}

export default getFieldElementType;
