////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from '@qubit-ltd/json';

/**
 * 将某个字段值正则化为表示整数的`Number`或`bigint`对象。
 *
 * @param {string|number|bigint} value
 *     待正则化的字段值。
 * @return {number|bigint|null}
 *     正则化的结果。
 */
function normalizeInteger(value) {
  if (value === undefined || value === null) {
    return null;
  }
  const type = typeof value;
  if (type === 'bigint') {
    return value;     // support native bigint
  }
  if ((type === 'string') || (value instanceof String)) {
    const val = value.trim();
    if (val === '') {
      return null;
    } if (/^[+-]?\d+$/.test(val)) {
      return Json.parse(val);
    } else {
      throw new RangeError(`Invalid integer format: "${value}"`);
    }
  } else if ((type === 'number') || (value instanceof Number)) {
    const val = Number(value);  // 将wrapped object转换为primitive
    if (Number.isInteger(val)) {
      return Math.floor(val);   // 删除小数点后面可能的0
    } else {
      throw new RangeError(`Invalid integer value: "${value}"`);
    }
  } else {
    throw new TypeError(`Invalid integer type: actual type is ${typeof value}`);
  }
}

export default normalizeInteger;
