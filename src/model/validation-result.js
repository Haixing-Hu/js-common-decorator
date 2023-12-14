////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The model of validation result.
 *
 * @author Haixing Hu
 */
class ValidationResult {
  /**
   * Indicates whether the validation is successful.
   */
  success = true;

  /**
   * The description of the validation result.
   */
  description = '';

  /**
   * Next validation result.
   *
   * If the validation has multiple failed results, the next failed result will
   * be chained to this field.
   *
   * @type {ValidationResult | null}
   */
  next = null;

  /**
   * 创建一个新的{@link ValidationResult}对象。
   *
   * @param {boolean} success
   *     新的{@link ValidationResult}对象的验证正确与否标记，如不提供则使用默认值 true。
   * @param {string} description
   *     新的{@link ValidationResult}对象的对验证结果的描述，如不提供则使用默认值空字符串。
   */
  constructor(success = true, description = '') {
    this.success = success ?? true;
    this.description = description ?? '';
    this.next = null;
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
   * Merge multiple {@link ValidationResult} objects.
   *
   * If all {@link ValidationResult} objects to be merged are successful,
   * the merging result is a single successful {@link ValidationResult} object;
   * otherwise, the merging result is the chain of all failed
   * {@link ValidationResult} objects.
   *
   * @param  {Array} results
   *     An array of multiple {@link ValidationResult} objects.
   * @return {ValidationResult}
   *     Returns the result of merging all objects in the specified
   *     {@link ValidationResult} object array as a new {@link ValidationResult}
   *     object.
   */
  static merge(results) {
    if (Array.isArray(results) && (results.length > 0)) {
      const first = new ValidationResult(true);
      let last = first;
      for (let i = 0; i < results.length; ++i) {
        const result = results[i];
        if (result && !result.success) {
          last.next = result;
          last = result;
        }
      }
      last.next = null;
      if (first.next) {
        last = first.next;
        first.next = null;
        return last;
      } else {
        return first;
      }
    } else {
      return new ValidationResult(true);
    }
  }
}

export default ValidationResult;
