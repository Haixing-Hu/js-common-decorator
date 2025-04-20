////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * 验证其他证件号码合法性的正则表达式。
 *
 * 合法的证件号码由2~60位字母、数字或句点组成。
 *
 * @author 胡海星
 */
const NUMBER_REGEXP = /^[a-zA-Z0-9.]{2,60}$/;

/**
 * 其他证件号码验证规则。
 *
 * @author 胡海星
 */
export default {

  /**
   * 检查其他证件号码是否合法
   *
   * @param {in} number
   *    证件号码，必须是trim()后的值，此函数不做trim()
   * @return
   *    若该证件号码合法，返回true；否则返回false
   * @author 胡海星
   */
  isValid(number) {
    return NUMBER_REGEXP.test(number);
  },
};
