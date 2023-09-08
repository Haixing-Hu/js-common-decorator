/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { isUndefinedOrNull, deepEqual } from '@haixing_hu/common-util';

const EqualsImpl = {
  /**
   * 判定两个对象是否逻辑相等。
   *
   * @param {Object} lhs
   *     左边的对象，不可为`undefined`或`null`。
   * @param {Object} rhs
   *     右边的对象，可以为`undefined`或`null`。
   * @return {Boolean}
   *     左右两边对象是否逻辑相等。
   */
  equals(lhs, rhs) {
    if (lhs === rhs) {
      return true;
    } else if (isUndefinedOrNull(rhs)) {
      return isUndefinedOrNull(lhs);
    } else if (Object.getPrototypeOf(lhs) !== Object.getPrototypeOf(rhs)) {
      return false;
    } else {
      return deepEqual(lhs, rhs);
    }
  },
};

export default EqualsImpl;
