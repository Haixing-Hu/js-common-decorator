////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isString } from '@qubit-ltd/type-detect';
import ofCodeImpl from './of-code-impl';
import ofNameImpl from './of-name-impl';
import ofValueImpl from './of-value-impl';

/**
 * Returns the enumerator of an enumeration class corresponding to the specified
 * value.
 *
 * The value could be an enumerator of the enumeration class, or the value of an
 * enumerator of the enumeration class, or the name of an enumerator of the
 * enumeration class, or the code of an enumerator of the enumeration class.
 *
 * @param {function} Class
 *     The constructor of the specified enumeration class.
 * @param {object|string} value
 *     The specified value.
 * @returns {undefined|object}
 *     The enumerator corresponding to the specified value.; or `undefined` if
 *     there is no such enumerator.
 * @author Haixing Hu
 * @private
 */
function ofImpl(Class, value) {
  if ((value === undefined) || (value === null)) {
    return undefined;
  }
  if (value instanceof Class) {
    return value;
  }
  if (isString(value)) {
    return ofValueImpl(Class, value)
        ?? ofNameImpl(Class, value)
        ?? ofCodeImpl(Class, value);
  }
  return undefined;
}

export default ofImpl;
