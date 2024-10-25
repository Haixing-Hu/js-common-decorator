////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * Determines whether the given value is nullish or empty.
 *
 * @param {String|Array} value
 *     The value to be determined, which must be a string or an array.
 * @returns
 *     Whether the given value is `undefined` or `null` or an empty string or
 *     an empty array.
 * @author Haixing Hu
 * @private
 */
function isNullishOrEmpty(value) {
  return (value === undefined
    || value === null
    || value === ''
    || value.length === 0);
}

export default isNullishOrEmpty;
