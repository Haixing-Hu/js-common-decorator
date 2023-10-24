////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 验证字符串是否表示合法的整数的正则表达式。
 *
 * 整数可以是正数或者负数，只考虑十进制。
 *
 * @author 胡海星
 */
const INTEGER_REGEXP = /^\s*[+-]?\d+\s*$/;

export default {

  /**
   * 测试一个字符串是否表示一个合法的整数。
   *
   * 整数可以是正数或者负数，只考虑十进制。
   *
   * 注意此函数允许字符串首位出现空格。
   *
   * @param {String} str
   *    待测试的字符串。
   * @return
   *    若该字符串表示一个合法的整数则返回true；否则返回false。
   * @author 胡海星
   */
  isValid(str) {
    if (str === undefined || str === null || str === '') {
      return false;
    }
    return INTEGER_REGEXP.test(str);
  },
};
