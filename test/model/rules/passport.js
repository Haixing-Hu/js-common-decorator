////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import CredentialType from '../credential-type';

/**
 * 验证护照号码合法性的正则表达式。
 *
 * 中国于2012年5月起正式签发普通电子护照。
 *
 * 普通电子护照颁发给因定居、探亲、学习、就业、旅行、从事商务活动等非公务原因出
 * 国的中国公民，护照号码格式市：E+8 位数字编号 或 E+字母+7位数字编号。
 *
 * 公务护照又分为因公普通护照、公务护照和外交护照三个类别
 * 1. 因公普通护照：PE+7 位数字编码
 * 2. 公务护照：SE+7 位数字编码
 * 3. 外交护照：DE+7 位数字编码
 *
 * 发给有澳门特区永久性居民身份证的中国公民，护照号码格式是：MA+7 位编号。
 *
 * 发给有香港永久性居民身份证，并享有香港特别行政区居留权的中国公民，护照号格
 * 式是：K+8 位编号。
 *
 * 旧版护照号码格式如下：
 *
 * 1. 因私普通护照号码格式：14 + 7位数字， 15 + 7位数字， G + 8位数字；
 * 2. 因公普通护照号码格式：P + 7位数；
 * 3. 公务护照号码格式：S + 7位数 或  S + 8位数；
 * 4. 外交护照号码格式：D + 8为数字；
 *
 * @author 胡海星
 */
const NUMBER_REGEXP = /^(E[A-Z0-9][0-9]{7}|[SDP]E[0-9]{7}|MA[0-9]{7}|K[0-9]{8}|1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]{8})$/;

/**
 * 护照号码验证规则。
 *
 * @author 胡海星
 */
export default {

  /**
   * 表示护照的证件类型的字符串。
   *
   * @author 胡海星
   */
  type: CredentialType.PASSPORT.value,

  /**
   * 护照的证件名称。
   *
   * @author 胡海星
   */
  name: CredentialType.PASSPORT.name,

  /**
   * 检查护照号码是否合法
   *
   * @param {in} number
   *    护照号码，必须是trim()后的值，此函数不做trim()
   * @return
   *    若该护照号码合法，返回true；否则返回false
   * @author 胡海星
   */
  isValid(number) {
    return NUMBER_REGEXP.test(number);
  },
};
