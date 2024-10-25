////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../class-metadata-cache';

/**
 * Sets the specified attribute value of the metadata of the specified class.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} key
 *     The key of the specified attribute.
 * @param {any} value
 *     The attribute value to be set.
 * @throws Error
 *     If the metadata of the specified class has not been cached.
 * @author Haixing Hu
 * @private
 */
function setClassMetadata(Class, key, value) {
  const metadata = classMetadataCache.get(Class);
  if (!metadata) {
    throw new Error(`The metadata of the class "${Class.name}" has not been cached.`);
  }
  metadata[key] = value;
}

export default setClassMetadata;
