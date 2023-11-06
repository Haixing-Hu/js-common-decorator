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
import {
  getFieldMetadata,
  getDefaultInstance,
  hasOwnPrototypeFunction,
} from '../utils';

/**
 * Normalizes the specified field of the specified object.
 *
 * @param {function} Class
 *     The constructor of the class of the object to be normalized.
 * @param {object} obj
 *     The object to be normalized, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be normalized.
 * @return {boolean}
 *     `true` if the specified field is normalized; otherwise, `false` otherwise.
 */
function normalizeFieldImpl(Class, obj, field) {
  // console.log('normalizeFieldImpl:', Class, obj, field);
  if (!Object.hasOwn(obj, field)) {
    // the field does not exist
    return false;
  }
  // If the class has a parent class, call the normalizer of the parent class
  // to normalize the field.
  const Parent = Object.getPrototypeOf(Class);
  if (hasOwnPrototypeFunction(Parent, 'normalizeField')) {
    if (Parent.prototype.normalizeField.call(obj, field)) {
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
  // console.log('Get the normalizer: ', normalizer);
  if (typeof normalizer === 'function') {
    const value = obj[field];
    // console.log('Use normalizer to normalize: ', value);
    if (value === undefined || value === null) {
      // For field values that are `undefined` or `null`, the normalized value
      // should be the default value of the field.
      const defaultInstance = getDefaultInstance(Class);
      obj[field] = defaultInstance[field];
    } else if (Array.isArray(value)) {
      // If it is an array, call the normalizer function to normalize each
      // element in the array.
      obj[field] = value.map((v) => normalizer(v));
    } else {
      // Otherwise, call the normalizer function to normalize the field value.
      obj[field] = normalizer(value);
    }
    return true;
  }
  // the field is not normalized
  return false;
}

export default normalizeFieldImpl;
