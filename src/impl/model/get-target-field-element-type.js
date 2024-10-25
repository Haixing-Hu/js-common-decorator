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
 * Gets the field element type of the target object.
 *
 * The function will first check the annotated element type information of the
 * field of the target object. If the annotated type information is found, the
 * function will return it. Otherwise, the function will check the additional
 * type information provided by the options. If the additional type information
 * is found, the function will return it. Otherwise, the function will return
 * `null`.
 *
 * @param {object} metadata
 *     the metadata of the class of the target object.
 * @param {string} field
 *     the name of the field.
 * @param {string} path
 *     the path of the target object in the property tree of the original root
 *     object.
 * @param {object} options
 *     the additional options for the assignment.
 * @return {function|null}
 *     the field element type of the target, or `null` if the field type cannot
 *     be inferred.
 * @private
 * @author Haixing Hu
 */
function getTargetFieldElementType(metadata, field, path, options) {
  const annotatedElementType = getFieldMetadata(metadata, field, KEY_FIELD_ELEMENT_TYPE);
  if (annotatedElementType) {
    if (typeof annotatedElementType !== 'function') {
      throw new TypeError(`The annotated element type of the field '${path}' is not a function.`);
    }
    return annotatedElementType;
  }
  if (options && options.targetElementTypes && options.targetElementTypes[path]) {
    const result = options.targetElementTypes[path];
    if (typeof result !== 'function') {
      throw new TypeError(`The target element type of the field '${path}' is not a function.`);
    }
    return result;
  }
  return null;
}

export default getTargetFieldElementType;
