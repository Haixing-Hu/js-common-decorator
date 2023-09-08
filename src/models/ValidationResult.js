/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { defaultIfUndefinedOrNull } from '@haixing_hu/common-util';

/**
 * 此模型表示校验结果。
 *
 * @author 胡海星
 */
class ValidationResult {
  /**
   * 校验结果是否正确。
   */
  success = true;

  /**
   * 对校验结果的描述。
   */
  description = '';

  /**
   * 创建一个新的{@link ValidationResult}对象。
   *
   * @param {String} success
   *     新的{@link ValidationResult}对象的验证正确与否标记，如不提供则使用默认值 true。
   * @param {String} description
   *     新的{@link ValidationResult}对象的对验证结果的描述，如不提供则使用默认值空字符串。
   */
  constructor(success = true, description = '') {
    this.success = defaultIfUndefinedOrNull(success, true);
    this.description = defaultIfUndefinedOrNull(description, '');
  }

  /**
   * 合并另一个{@link ValidationResult}对象。
   *
   * @param  {ValidationResult} other
   *     多个{@link ValidationResult}对象构成的数组。
   * @return {ValidationResult}
   *     当前{@link ValidationResult}对象和指定的另一个{@link ValidationResult}
   *     对象合并的结果，作为一个新的{@link ValidationResult}对象返回。
   */
  join(other) {
    if (!this.success) {
      return this.clone();
    } else if (other && !other.success) {
      return other.clone();
    } else {
      return new ValidationResult(true);
    }
  }

  /**
   * 合并多个{@link ValidationResult}对象。
   *
   * @param  {Array} results
   *     多个{@link ValidationResult}对象构成的数组。
   * @return {ValidationResult}
   *     指定的{@link ValidationResult}对象数组中所有的对象合并的结果，作为一个
   *     新的{@link ValidationResult}对象返回。
   */
  static merge(results) {
    // console.log('ValidationResult.merge: ', results);
    if (results) {
      for (let i = 0; i < results.length; ++i) {
        const result = results[i];
        if (result && !result.success) {
          return result;  // 返回第一个失败结果
        }
      }
      return new ValidationResult(true);
    } else {
      return new ValidationResult(true);
    }
  }
}

export default ValidationResult;
