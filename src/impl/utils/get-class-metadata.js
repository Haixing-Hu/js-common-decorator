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
 * Get the specified attribute value from the metadata of the specified class.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} key
 *     The key of the specified attribute.
 * @return  {object}
 *     The value associated with the specified key in the metadata of the
 *     specified class.
 * @throws Error
 *     If the metadata of the specified class has not been cached.
 * @author Haixing Hu
 * @private
 */
function getClassMetadata(Class, key) {
  const metadata = classMetadataCache.get(Class);
  // if (!metadata) {
  //   throw new Error(`The metadata of the class "${Class.name}" has not been cached.`);
  // }
  if (!metadata) {
    return undefined;
  }
  return metadata[key];
}

export default getClassMetadata;
