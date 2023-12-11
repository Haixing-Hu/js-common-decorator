////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Normalizes the specified fields of the specified object。
 *
 * @param {function} Class
 *     The constructor of the class of the object to be normalized.
 * @param {object} obj
 *     The object to be normalized, which must be an instance of the `Class` class.
 * @param {string | array<string>} fields
 *     The names of fields to be normalized. If it is `undefined`, `null`, or
 *     the string `"*"`, all normalizable fields of the specified object will be
 *     normalized; if it is an array of strings, all normalizable fields of the
 *     specified object whose names in this array will be normalized.
 * @return {object}
 *     The normalized object.
 * @author Haixing Hu
 * @private
 */
function normalizeImpl(Class, obj, fields) {
  if (fields === undefined || fields === null || fields === '*') {
    Object.keys(obj).forEach((f) => obj.normalizeField(f));
  } else if (Array.isArray(fields)) {
    fields.forEach((f) => obj.normalizeField(f));
  } else if (typeof fields === 'string') {
    obj.normalizeField(fields);
  } else {
    throw new TypeError(`The argument ${Class.name}.normalize() must be a string or an array of strings.`);
  }
  return obj;
}

export default normalizeImpl;
