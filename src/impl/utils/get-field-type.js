////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../class-metadata-cache';
import { KEY_FIELD_TYPE } from '../metadata-keys';
import getDefaultInstance from './get-default-instance';
import getFieldMetadata from './get-field-metadata';

/**
 * Gets the type of the specified field of an object.
 *
 * The function will first check the annotated type information of the specified
 * field of the object. If the annotated type information is found, the function
 * will return it. Otherwise, the function will check the additional type
 * information provided by the options. If the additional type information is
 * found, the function will return it. Otherwise, the function will return
 * `undefined`.
 *
 * @param {function} Class
 *     The constructor of the class of the object.
 * @param {string} field
 *     the name of the field.
 * @param {string} path
 *     the path of the field in the property tree of the original root object.
 * @param {object} options
 *     the additional options for the assignment.
 * @return {function|undefined}
 *     the type of the specified field of the object, or `undefined` if the field
 *     type cannot be inferred.
 * @private
 * @author Haixing Hu
 */
function getFieldType(Class, field, path = undefined, options = {}) {
  path ??= `.${field}`;
  options ??= {};
  // try to find the annotated type information
  const metadata = classMetadataCache.get(Class);
  const annotatedType = getFieldMetadata(metadata, field, KEY_FIELD_TYPE);
  if (annotatedType) {
    if (typeof annotatedType !== 'function') {
      throw new TypeError(`The annotated type of '${Class.name}.${path}' is not a function.`);
    }
    return annotatedType;
  }
  // try to find the additional type information provided by the options
  if (options && options.types && options.types[path]) {
    const result = options.types[path];
    if (typeof result !== 'function') {
      throw new TypeError(`The target type of '${Class.name}.${path}' is not a function.`);
    }
    return result;
  }
  // try to find the type information from the default field value
  const defaultInstance = getDefaultInstance(Class);
  const defaultFieldValue = defaultInstance[field];
  if ((defaultFieldValue !== undefined)
      && (defaultFieldValue !== null)
      && (typeof defaultFieldValue.constructor === 'function')) {
    return defaultFieldValue.constructor;
  }
  // otherwise returns undefined
  return undefined;
}

export default getFieldType;
