////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Normalizes the specified field of the specified object.
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
 *     This function always returns true.
 * @author Haixing Hu
 * @private
 */
function normalizeNormalField(obj, field, value, normalizer) {
  // call the normalizer function to normalize the field value.
  obj[field] = normalizer(value);
  return true;
}

export default normalizeNormalField;
