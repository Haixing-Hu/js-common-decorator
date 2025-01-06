////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { deepEqual } from '@qubit-ltd/common-util';

/**
 * Determine whether two objects are logically equal.
 *
 * @param {object} lhs
 *     The object on the left hand side, which **can** be `undefined` or `null`.
 * @param {object} rhs
 *     The object on the right hand side, which **can** be `undefined` or `null`.
 * @return {boolean}
 *     Whether the objects on the left hand side and right hand side are
 *     logically equal.
 * @author Haixing Hu
 * @private
 */
function equalsImpl(lhs, rhs) {
  if (lhs === rhs) {
    return true;
  } else if (rhs === undefined || rhs === null) {
    return (lhs === undefined || lhs === null);
  } else if (lhs === undefined || lhs === null) {
    return false;
  } else if (Object.getPrototypeOf(lhs) !== Object.getPrototypeOf(rhs)) {
    return false;
  } else {
    return deepEqual(lhs, rhs);
  }
}

export default equalsImpl;
