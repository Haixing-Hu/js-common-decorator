/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import CredentialType from '../credential-type';
import {
  isIdCardNumberValid, getIdCardBirthday, getIdCardGender,
} from './identity-card-validator';

/**
 * 中华人民共和国大陆身份证号码验证规则。
 *
 * 身份证号码第1~6位为地址码，表示登记户口时所在地的行政区划代码（省、市、县）。
 * 其中1-2位省、自治区、直辖市代码；3-4位地级市、盟、自治州代码；5-6位县、县级市、
 * 区代码。如果行政区划进行了重新划分，同一个地方进行户口登记的可能存在地址码不
 * 一致的情况。行政区划代码按GB/T2260的规定执行。
 *
 * 身份证号码第7~12为日期码，表示该居民的出生年月日。格式为YYYYMMDD，如19491001。
 * 出生日期码是按GB/T 7408的规定执行的。
 *
 * 身份证号码第15~17为顺序码，表示同一地址码区域内，同年、同月、同日生的人所编订
 * 的顺序号，根据自己身份证的顺序码就可以知道：与我们同年同月同日生的同 性至少有
 * 多少个，且在我们之前登记户籍的有多少人。身份证顺序码的奇数分配给男性，偶数分
 * 配给女性。因此身份证号码倒数第2位是奇数则为男性，偶数则为女性。
 *
 * 身份证中第十八位数字的计算方法如下：
 * - 将前面的身份证号码17位数分别乘以不同的系数，从第一位到第十七位的系数分别
 *   为：7、9、10、5、8、4、2、1、6、3、7、9、10、5、8、4、2；
 * - 将这17位数字和系数相乘的结果相加；
 * - 用加出来和除以11，看余数是多少；
 * - 余数只可能有0 、1、 2、 3、 4、 5、 6、 7、 8、 9、 10这11个数字；
 * - 其分别对应的最后一位身份证的号码为1、0、X、9、8、7、6、5、4、3、2；
 *
 * 通过上面得知如果余数是2，就会在身份证的第18位数字上出现罗马数字的Ⅹ。
 * 如果余数是10，身份证的最后一位号码就是2。
 *
 * 注意：对于身份证号码中编码的出生日期，此验证规则只验证该日期是否存在，没有验
 * 证出生日期的范围是否合法。
 *
 * @author 胡海星
 */
export default {

  /**
   * 表示身份证的证件类型的字符串。
   *
   * @author 胡海星
   */
  type: CredentialType.IDENTITY_CARD.value,

  /**
   * 身份证的证件名称。
   *
   * @author 胡海星
   */
  name: CredentialType.IDENTITY_CARD.name,

  /**
   * 检查身份证号码是否合法
   *
   * @param {String} number
   *    身份证号码，必须是trim()后的值，此函数不做trim()
   * @return {Boolean}
   *    若该身份证号码合法，返回true；否则返回false
   * @author 胡海星
   */
  isValid(number) {
    return isIdCardNumberValid(number);
  },

  /**
   * 根据身份证号码计算性别
   *
   * @param {String} number
   *    身份证号码，必须是trim()后的值，此函数不做trim()
   * @return {String}
   *    若该身份证号码合法，返回对应的性别；否则返回null.
   * @author 胡海星
   */
  getGender(number) {
    return getIdCardGender(number);
  },

  /**
   * 根据身份证号码计算出生日期。
   *
   * 注意此函数不验证给定的身份证号码是否合法，也不验证提取出的出生日期是否合法。
   *
   * @param {String} number
   *    身份证号码，必须是trim()后的值，此函数不做trim()
   * @return {String}
   *    返回该身份证号码对应的出生日期，以字符串形式表示，格式为'YYYY-MM-DD'；
   *    如身份证号码长度不对，则返回null。
   * @author 胡海星
   */
  getBirthday(number) {
    return getIdCardBirthday(number);
  },
};
