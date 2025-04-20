////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * 验证中文姓名的正则表达式
 *
 * 中文名称允许出现下述 Unicode 字符集
 * - CJK Unified Ideographs (U+4E00..U+9FEF)
 * - CJK Unified Ideographs Extension A (U+3400..U+4DBF)
 * - CJK Unified Ideographs Extension B (U+20000..U+2A6D6)
 * - CJK Unified Ideographs Extension C (U+2A700..U+2B734)
 * - CJK Unified Ideographs Extension D (U+2B740..U+2B81D)
 * - CJK Unified Ideographs Extension E (U+2B820..U+2CEA1)
 * - CJK Unified Ideographs Extension F (U+2CEB0..U+2EBE0)
 * - CJK Compatibility Ideographs (U+F900..U+FAD9)
 * - CJK Compatibility Ideographs Supplement (U+2F800..U+2FA1F)
 *
 *
 * 同时允许出现少数民族名中的点，包含[.·]等。
 *
 * 最小长度为２个字符，最大为30个字符。名字中间不允许出现空格。
 *
 * 参考链接：
 * 1. https://en.wikipedia.org/wiki/CJK_Unified_Ideographs
 * 2. https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs
 * 3. https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs_Supplement
 *
 * @author 胡海星
 */
const CHINESE_NAME_REGEXP = /^[\u{4E00}-\u{9FEF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{F900}-\u{FAD9}\u{2F800}-\u{2FA1F}][\u{4E00}-\u{9FEF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{F900}-\u{FAD9}\u{2F800}-\u{2FA1F}·.]{0,28}[\u{4E00}-\u{9FEF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{F900}-\u{FAD9}\u{2F800}-\u{2FA1F}]$/u;

/**
 * 验证英文姓名或汉语拼音名字的正则表达式
 *
 * 英文姓名或汉语拼音姓名允许大小写英文字母，半角空格，半角句点。
 *
 * 最短需要有2个字符，最长不超过60个字符。
 *
 * @author 胡海星
 */
const ENGLISH_NAME_REGEXP = /^[a-zA-Z][a-zA-Z .]{0,58}[a-zA-Z]$/;

export default {

  /**
   * 测试姓名是否合法
   *
   * @param {in} name
   *    待测试的姓名，注意必须先对其trim()，此函数不做trim()
   * @return
   *    若姓名合法则返回true；否则返回false。
   * @author 胡海星
   */
  isValid(name) {
    return (name !== undefined)
        && (name !== null)
        && (name !== '')
        && (CHINESE_NAME_REGEXP.test(name)
         || ENGLISH_NAME_REGEXP.test(name));
  },
};
