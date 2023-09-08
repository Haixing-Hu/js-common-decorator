/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import Validator from 'email-validator';

export default {

  /**
   * 测试电子邮件地址是否合法
   *
   * @param {in} email
   *    待测试的电子邮件地址，注意必须先对其trim()，此函数不做trim()
   * @return
   *    若电子邮件地址合法则返回true；否则返回false。
   * @author 胡海星
   */
  isValid(email) {
    return (email !== undefined)
      && (email !== null)
      && (email !== '')
      && Validator.validate(email);
  },
};
