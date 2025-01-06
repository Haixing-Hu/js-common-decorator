////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isTypedArray } from '@qubit-ltd/type-detect';
import getFieldElementType from '../utils/get-field-element-type';

/**
 * Normalizes the specified array field of the specified object.
 *
 * @param {function} Class
 *     The class of the object to be normalized.
 * @param {object} obj
 *     The object to be normalized, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be normalized. This function assumes
 *     that the field exists and is normalizable.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @param {object} options
 *     The optional options for the normalization. Default value is an empty
 *     object. Currently, the following options are supported:
 *     - `path: string`, the path of the root object of this object.
 *       The default value of this option is `''`.
 *     - `types: object`, the additional information about types of fields of
 *       classes. The keys of this object are the path of the fields or
 *       sub-fields of this object, the values are the type of the fields,
 *       represented as the constructor function of the type. The path of the
 *       root of this object is an empty, therefore the path of the direct field of
 *       this object is of the form `'.field'`, and the path of the sub-field of
 *       a field is of the form `'.field.subField'`. The default value of this
 *       option is `{}`.
 *     - `elementTypes: object`, the additional information about types of
 *       elements of fields of classes. The keys of this object are the path of
 *       the fields or sub-fields of the target object, the values are the type
 *       of the elements, represented as the constructor function of the type.
 *       The default value of this option is `{}`.
 * @param {function} normalizer
 *     The normalizer function of the specified field.
 * @returns {boolean}
 *     If the field value is an array or a typed array, this function normalizes
 *     the field of the specified object by calling the normalizer function on
 *     each element in the array, and returns `true`; otherwise, this function
 *     does nothing and returns `false`.
 * @author Haixing Hu
 * @private
 */
function normalizeArrayField(Class, obj, field, value, options, normalizer) {
  if (Array.isArray(value) || isTypedArray(value)) {
    const fieldPath = `${options.path}.${field}`;
    const elementType = getFieldElementType(Class, field, fieldPath, options);
    const context = {
      type: elementType,
      path: fieldPath,
      types: options.types,
      elementTypes: options.elementTypes,
    };
    obj[field] = value.map((v) => normalizer(v, context));
    return true;
  }
  return false;
}

export default normalizeArrayField;
