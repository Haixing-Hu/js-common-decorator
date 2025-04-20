////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../class-metadata-cache';
import { KEY_CLASS_DEFAULT_INSTANCE } from '../metadata-keys';

/**
 * Get the default instance of the specified class, or create a new instance if
 * it does not exist.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @returns {object}
 *     The default instance of the specified class, or a new instance will be
 *     created if it does not exist.
 * @author Haixing Hu
 * @private
 */
export function getDefaultInstance(Class) {
  if (Class.prototype === Object.prototype) {   // Object is a special case
    return {};
  }
  const metadata = classMetadataCache.get(Class);
  let obj = metadata[KEY_CLASS_DEFAULT_INSTANCE];
  if (!(obj instanceof Class)) {
    // Note that the metadata of a class can inherit the metadata of its parent
    // class. Therefore, if the parent class has a default instance stored in
    // its metadata, it can be accessed by the child class. That's why we have
    // to check whether the default instance is an instance of the specified
    // class.
    obj = new Class();
    metadata[KEY_CLASS_DEFAULT_INSTANCE] = obj;
  }
  return obj;
}

export default getDefaultInstance;
