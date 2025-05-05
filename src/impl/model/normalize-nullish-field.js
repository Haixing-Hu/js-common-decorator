////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

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
 *     If the field value is nullish, this function returns `true` and preserves
 *     the nullish value (null or undefined) in the object's field;
 *     otherwise, this function does nothing and returns `false`.
 * @author Haixing Hu
 * @private
 */
function normalizeNullishField(Class, obj, field, value) {
  if (value === undefined || value === null) {
    // For field values that are `undefined` or `null`, preserve the original value
    // instead of replacing it with the default value
    return true;
  }
  return false;
}

export default normalizeNullishField;
