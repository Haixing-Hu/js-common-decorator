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
 * @param {object} options
 *     The optional options for the normalization. Default value is an empty
 *     object. Currently, the following options are supported:
 *     - `path: string`, the path of the root object of this object.
 *       The default value of this option is `'.'`.
 *     - `types: object`, the additional information about types of fields
 *       of classes. The keys of this object are the path of the fields or
 *       sub-fields of this object, the values are the type of the fields,
 *       represented as the constructor function of the type. The path of
 *       the root of this object is an empty, there the path of the direct
 *       field of this object is of the form `'.field'`, and the
 *       path of the sub-field of a field is of the form `'.field.subField'`.
 *       The default value of this option is `{}`.
 *     - `elementTypes: object`, the additional information about types of
 *       elements of fields of classes. The keys of this object are the path of
 *       the fields or sub-fields of the target object, the values are the type
 *       of the elements, represented as the constructor function of the type.
 *       The default value of this option is `{}`.
 * @return {object}
 *     The normalized object.
 * @author Haixing Hu
 * @private
 */
function normalizeImpl(Class, obj, fields, options) {
  if (fields === undefined || fields === null || fields === '*') {
    Object.keys(obj).forEach((f) => obj.normalizeField(f, options));
  } else if (Array.isArray(fields)) {
    fields.forEach((f) => obj.normalizeField(f, options));
  } else if (typeof fields === 'string') {
    obj.normalizeField(fields, options);
  } else {
    throw new TypeError(`The argument ${Class.name}.normalize() must be a string or an array of strings.`);
  }
  return obj;
}

export default normalizeImpl;
