////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { NamingStyle } from '@haixing_hu/naming-style';

/**
 * Gets the existing field of the object with different naming styles.
 *
 * @param {string} key
 *     the key of the object.
 * @param {object} obj
 *     the specified object.
 * @return {undefined|string}
 *     If the object contains the key with different naming styles, then return the
 *     name of the field with different naming styles; otherwise, return `undefined`.
 * @author Haixing Hu
 * @private
 */
function getExistFieldWithDifferentNamingStyle(key, obj) {
  const styles = NamingStyle.values();
  for (const s1 of styles) {
    for (const s2 of styles) {
      const newKey = s1.to(s2, key);
      if (Object.prototype.hasOwnProperty.call(obj, newKey)) {
        return newKey;
      }
    }
  }
  return undefined;
}

export default getExistFieldWithDifferentNamingStyle;
