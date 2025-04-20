////////////////////////////////////////////////////////////////////////////////
import Json from '@qubit-ltd/json';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isString } from '@qubit-ltd/type-detect';

/**
 * Convert an id to a string.
 *
 * @param {string|number|bigint} id
 *     The id to be converted.
 * @return {string}
 *     The string representation of the id, or an empty string if the id is
 *     `null` or `undefined`.
 */
function stringifyId(id) {
  if (id === null || id === undefined) {
    return '';
  }
  if (isString(id)) {
    return id;
  }
  return Json.stringify(id);
}

export default stringifyId;
