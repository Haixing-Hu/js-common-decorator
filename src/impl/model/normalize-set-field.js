////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Normalizes the specified set field of the specified object.
 *
 * @param {object} obj
 *     The object to be normalized, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be normalized. This function assumes
 *     that the field exists and is normalizable.
 * @param {any} value
 *     The value of the specified field of the specified object.
 * @param {function} normalizer
 *     The normalizer function of the specified field.
 * @returns {boolean}
 *     If the field value is a built-in set, this function normalizes the field
 *     of the specified object by calling the normalizer function on each
 *     element in the set, and returns `true`; otherwise, this function does
 *     nothing and returns `false`.
 * @author Haixing Hu
 * @private
 */
function normalizeSetField(obj, field, value, normalizer) {
  if (value instanceof Set) {
    obj[field] = new Set(Array.from(value, (v) => normalizer(v)));
    return true;
  }
  return false;
}

export default normalizeSetField;
