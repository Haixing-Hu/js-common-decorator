////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isTypedArray, isCollection } from '@qubit-ltd/type-detect';

/**
 * Gets the element types of a collection.
 *
 * @param {any} obj
 *     The collection object.
 * @return {Function}
 *     The element type of the collection, or `null` if the object is not a
 *     collection, or the collection is empty, or the element type cannot be
 *     determined.
 * @author Haixing Hu
 * @private
 */
function getCollectionElementType(obj) {
  if (Array.isArray(obj) || isTypedArray(obj)) {
    if ((obj.length > 0) && (typeof obj[0]?.constructor === 'function')) {
      return obj[0].constructor;
    }
  } else if (isCollection(obj)) {
    if (obj.size > 0) {
      const first = obj.values().next().value;
      if (first && (typeof first.constructor === 'function')) {
        return first.constructor;
      }
    }
  }
  return null;
}

export default getCollectionElementType;
