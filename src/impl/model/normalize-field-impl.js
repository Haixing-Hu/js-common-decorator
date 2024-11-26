////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../class-metadata-cache';
import { KEY_FIELD_NORMALIZER } from '../metadata-keys';
import normalizeArrayField from './normalize-array-field';
import normalizeMapField from './normalize-map-field';
import normalizeNormalField from './normalize-normal-field';
import normalizeNullishField from './normalize-nullish-field';
import normalizeSetField from './normalize-set-field';
import hasOwnPrototypeFunction from '../utils/has-own-prototype-function';
import getFieldMetadata from '../utils/get-field-metadata';

/**
 * Normalizes the specified field of the specified object.
 *
 * @param {function} Class
 *     The constructor of the class of the object to be normalized.
 * @param {object} obj
 *     The object to be normalized, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be normalized.
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
 * @return {boolean}
 *     `true` if the specified field exists and is normalizable; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
function normalizeFieldImpl(Class, obj, field, options) {
  options ??= {};
  options.path ??= '';
  if (!Object.prototype.hasOwnProperty.call(obj, field)) {
    // the field does not exist
    return false;
  }
  // If the class has a parent class, call the normalizeField of the parent class
  // to normalize the field.
  const Parent = Object.getPrototypeOf(Class);
  if (hasOwnPrototypeFunction(Parent, 'normalizeField')) {
    if (Parent.prototype.normalizeField.call(obj, field, options)) {
      // the field is normalized by its parent class
      return true;
    }
  }
  // Otherwise, use the normalizer function to normalize the field according to
  // the argument of the `@Normalizable` decorator of the field.
  // Note that the context metadata of a class is inherited from its ancestor
  // classes, therefore, we can use the metadata of the current class to get the
  // normalizer function.
  const metadata = classMetadataCache.get(Class);
  const normalizer = getFieldMetadata(metadata, field, KEY_FIELD_NORMALIZER);
  if (normalizer === undefined) {
    // the field is not decorated with @Normalizable
    return false;
  }
  const value = obj[field];
  return normalizeNullishField(Class, obj, field, value)
      || normalizeArrayField(Class, obj, field, value, options, normalizer)
      || normalizeSetField(Class, obj, field, value, options, normalizer)
      || normalizeMapField(Class, obj, field, value, options, normalizer)
      || normalizeNormalField(Class, obj, field, value, options, normalizer);
}

export default normalizeFieldImpl;
