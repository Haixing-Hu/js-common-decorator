////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getDefaultInstance from '../utils/get-default-instance';

/**
 * Normalizes the specified nullish field of the specified object.
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
 * @returns {boolean}
 *     If the field value is nullish, this function normalizes the field of the
 *     specified object by setting its field value to the corresponding field
 *     value of the default instance of the specified class, and returns `true`;
 *     otherwise, this function does nothing and returns `false`.
 * @author Haixing Hu
 * @private
 */
function normalizeNullishField(Class, obj, field, value) {
  if (value === undefined || value === null) {
    // For field values that are `undefined` or `null`, the normalized value
    // should be the default value of the field.
    const defaultInstance = getDefaultInstance(Class);
    obj[field] = defaultInstance[field];
    return true;
  }
  return false;
}

export default normalizeNullishField;
