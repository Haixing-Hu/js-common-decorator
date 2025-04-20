////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Gender from '../gender';
import AREA_CODES from './area-codes';

const NUMBER_LENGTH = 18;
const YEAR_INDEX = 6;
const YEAR_LENGTH = 4;
const MONTH_INDEX = 10;
const MONTH_LENGTH = 2;
const DAY_INDEX = 12;
const DAY_LENGTH = 2;
const AREA_INDEX = 0;
const AREA_LENGTH = 6;
const GENDER_INDEX = 16;
const DECIMAL_BASE = 10;
const ASCII_0_CHAR_CODE = 48;
const ASCII_9_CHAR_CODE = 57;
const RATIO = [
  7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,
];
const LAST_CHAR = [
  '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2',
];

/**
 * 将给定的身份证号码给定的片段解析为整数。
 *
 * @param {String} number
 *     给定的身份证号码。
 * @param {Number} start
 *     起始位置。
 * @param {Number} end
 *     结束位置（不包含在内）。
 * @return
 *     若给定的号码的起始位置到结束位置（不包含）的片段可以解析为一个整数，则返
 *     回解析后的整数；否则返回null。
 */
function parseNumber(number, start, end) {
  if (!number || (start < 0) || (end <= start) || (end > number.length)) {
    return null;
  }
  let result = 0;
  for (let i = start; i < end; ++i) {
    const ch = number.charCodeAt(i);
    if (ch < ASCII_0_CHAR_CODE || ch > ASCII_9_CHAR_CODE) {
      return null;
    }
    result *= DECIMAL_BASE;
    result += (ch - ASCII_0_CHAR_CODE);
  }
  return result;
}

/**
 * 判定给定的身份证号码的生日字段是否合法。
 *
 * 身份证号码第7~12为日期码，表示该居民的出生年月日。格式为YYYYMMDD，如19491001。
 * 出生日期码是按GB/T 7408的规定执行的。
 *
 * 注意：对于身份证号码中编码的出生日期，此函数不仅验证该日期是否存在，也会验证
 * 出生日期是否是个合法的日期，同时也会验证该日期是否超过今天的日期（不应该超过
 * 今天的日期）。
 *
 * @param {String} number
 *     给定的身份证号码。
 * @return {Boolean}
 *     若给定的身份证号码的生日字段合法，则返回true；否则返回false。
 * @author 胡海星
 */
function isIdCardBirthdayValid(number) {
  const year = parseNumber(number, YEAR_INDEX, YEAR_INDEX + YEAR_LENGTH);
  const month = parseNumber(number, MONTH_INDEX, MONTH_INDEX + MONTH_LENGTH);
  const day = parseNumber(number, DAY_INDEX, DAY_INDEX + DAY_LENGTH);
  if (year == null || month == null || day == null) {
    return false;
  }
  const birthday = new Date(year, month - 1, day);  // 注意月份从0开始计算
  // 判定解析出来的年、月、日是否是合法的年、月、日
  if (birthday.getFullYear() !== year
      || birthday.getMonth() !== month - 1
      || birthday.getDate() !== day) {
    return false;
  }
  // 判定解析出来的日期是否超过今天，合法的身份证的日期不应该超过今天
  const now = new Date();
  if (birthday.getTime() > now.getTime()) {
    return false;
  }
  return true;
}

/**
 * 判定给定的身份证号码的地址区县字段是否合法。
 *
 * 身份证号码第1~6位为地址码，表示登记户口时所在地的行政区划代码（省、市、县）。
 * 其中1-2位省、自治区、直辖市代码；3-4位地级市、盟、自治州代码；5-6位县、县级市、
 * 区代码。如果行政区划进行了重新划分，同一个地方进行户口登记的可能存在地址码不
 * 一致的情况。行政区划代码按GB/T2260的规定执行。
 *
 * @param {String} number
 *     给定的身份证号码。
 * @return {Boolean}
 *     若给定的身份证号码的地址区县字段合法，则返回true；否则返回false。
 * @author 胡海星
 */
/* eslint  no-unused-vars: "off" */
function isIdCardAreaValid(number) {
  const code = number.substring(AREA_INDEX, AREA_INDEX + AREA_LENGTH);
  return AREA_CODES.has(code);
}

/**
 * 判定给定的身份证号码是否合法。
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
 * 的顺序号，根据自己身份证的顺序码就可以知道：与我们同年同月同日生的同性至少有
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
 * @param {String} number
 *     给定的身份证号码。
 * @return {Boolean}
 *     若给定的身份证号码合法，则返回true；否则返回false。
 * @author 胡海星
 */
export function isIdCardNumberValid(number) {
  if ((typeof number !== 'string') || (number.length !== NUMBER_LENGTH)) {
    return false;
  }
  // 验证奇偶校验码是否合法
  let sum = 0;
  for (let i = 0; i < NUMBER_LENGTH - 1; ++i) {
    const ch = number.charCodeAt(i);
    if (ch < ASCII_0_CHAR_CODE || ch > ASCII_9_CHAR_CODE) {
      return false;
    }
    sum += (ch - ASCII_0_CHAR_CODE) * RATIO[i];
  }
  const lastChar = LAST_CHAR[sum % LAST_CHAR.length];
  if (number.charAt(NUMBER_LENGTH - 1).toUpperCase() !== lastChar) {
    return false;
  }
  // 验证出生日期是否合法
  if (!isIdCardBirthdayValid(number)) {
    return false;
  }
  // 验证地址区县是否合法
  // 暂时屏蔽区号验证
  // if (!isIdCardAreaValid(number)) {
  //   return false;
  // }
  return true;
}

/**
 * 从给定的身份证号码中提取出生日期。
 *
 * 身份证号码第7~12为日期码，表示该居民的出生年月日。格式为YYYYMMDD，如19491001。
 * 出生日期码是按GB/T 7408的规定执行的。
 *
 * 注意此函数不验证给定的身份证号码是否合法，也不验证提取出的出生日期是否合法。
 *
 * @param {String} number
 *     给定的身份证号码。
 * @return {String}
 *     从给定的身份证号码中提取出的出生日期，表示为'YYYY-MM-DD'格式的字符串。如
 *     果无法提取，则返回null。
 */
export function getIdCardBirthday(number) {
  if ((typeof number !== 'string') || (number.length !== NUMBER_LENGTH)) {
    return null;
  }
  const year = number.substring(YEAR_INDEX, YEAR_INDEX + YEAR_LENGTH);
  const month = number.substring(MONTH_INDEX, MONTH_INDEX + MONTH_LENGTH);
  const day = number.substring(DAY_INDEX, DAY_INDEX + DAY_LENGTH);
  return `${year}-${month}-${day}`;
}

/**
 * 从给定的身份证号码中提取性别。
 *
 * 注意此函数不验证给定的身份证号码是否合法。
 *
 * @param {String} number
 *     给定的身份证号码。
 * @return {Gender}
 *     从给定的身份证号码中提取出的性别，表示为Gender枚举的值。如果无法提取，则
 *     返回null。
 */
export function getIdCardGender(number) {
  if ((typeof number !== 'string') || (number.length !== NUMBER_LENGTH)) {
    return null;
  }
  const digit = number.charCodeAt(GENDER_INDEX) - ASCII_0_CHAR_CODE;
  return (digit % 2 === 1 ? Gender.MALE : Gender.FEMALE);
}
