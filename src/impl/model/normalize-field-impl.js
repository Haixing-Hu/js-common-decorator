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
  hasOwnPrototypeFunction,
} from '../utils';
import normalizeArrayField from './normalize-array-field';
import normalizeMapField from './normalize-map-field';
import normalizeNormalField from './normalize-normal-field';
import normalizeNullishField from './normalize-nullish-field';
import normalizeSetField from './normalize-set-field';

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
 *     `true` if the specified field exists and is normalizable; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
function normalizeFieldImpl(Class, obj, field) {
  if (!Object.hasOwn(obj, field)) {
    // the field does not exist
    return false;
  }
  // If the class has a parent class, call the normalizeField of the parent class
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
  if (normalizer === undefined) {
    // the field is not decorated with @Normalizable
    return false;
  }
  const value = obj[field];
  return normalizeNullishField(Class, obj, field, value)
      || normalizeArrayField(obj, field, value, normalizer)
      || normalizeSetField(obj, field, value, normalizer)
      || normalizeMapField(obj, field, value, normalizer)
      || normalizeNormalField(obj, field, value, normalizer);
}

export default normalizeFieldImpl;
