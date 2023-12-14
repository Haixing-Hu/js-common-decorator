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
   * Create a new {@link ValidationResult} object.
   *
   * @param {boolean} success
   *     The validation correctness flag of the new object. If not provided, the
   *     default value `true` is used.
   * @param {string} description
   *     Description of the validation result of the new object. If not provided,
   *     the default value is an empty string.
   */
  constructor(success = true, description = '') {
    this.success = success ?? true;
    this.description = description ?? '';
    this.next = null;
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
