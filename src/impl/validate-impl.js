/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { PROPERTY_VALIDATOR } from '@/validator';
import { PROPERTY_TYPE } from '@/type';
import { PROPERTY_NULLABLE } from '@/nullable';
import { PROPERTY_DISPLAY_NAME } from '@/display-name';
import {
  getFieldMetadata,
  getDefaultInstance,
  hasOwnPrototypeFunction,
  isNull,
} from '@/impl/utils';
import ValidationResult from '@/models/ValidationResult';

const ValidateImpl = {

  /**
   * 校验指定的对象的指定字段。
   *
   * @param {Function} Class
   *     待校验的对象的类的构造器。
   * @param {Object} obj
   *     待校验的对象，必须是一个`Class`类的实例。
   * @param {String} field
   *     待校验的字段名称，如果是`undefined`或`null`或字符串`"*"`，则对指定对象
   *     所有可校验的字段进行校验；如果是一个字符串数组，则对该数组中所有可校验
   *     的字段进行校验.
   * @param {Object} options
   *     其他额外参数。
   * @return {ValidationResult}
   *     校验结果。
   */
  validate(Class, obj, field, options) {
    if (field === undefined || field === null || field === '*') {
      const fields = Object.keys(obj);
      const results = fields.map((f) => this.validateField(Class, obj, f, options));
      return ValidationResult.merge(results);
    } else if (Array.isArray(field)) {
      const results = field.map((f) => this.validateField(Class, obj, f, options));
      return ValidationResult.merge(results);
    } else if (typeof field !== 'string') {
      throw new TypeError(`Field name of ${Class.name} must be a string.`);
    } else {
      return this.validateField(Class, obj, field, options);
    }
  },

  /**
   * 校验指定的对象的指定字段。
   *
   * @param {Function} Class
   *     指定对象的类的构造器。
   * @param {Object} instance
   *     指定的对象，必须是一个`Class`类的实例。
   * @param {String} field
   *     指定的字段名称。
   * @param {Object} options
   *     其他额外参数。
   * @return {ValidationResult}
   *     校验结果。
   */
  validateField(Class, instance, field, options) {
    // console.log('ValidateImpl.validate: Class = ', Class,
    //    ', instance = ', instance, ', field = ', field,
    //    ', options = ', options);
    if (!Object.hasOwn(instance, field)) {
      // 若该字段不存在，则报错
      return new ValidationResult(false, `${Class.name}的字段${field}不存在`);
    }
    // 获取其父类构造器
    const Parent = Object.getPrototypeOf(Class);
    // console.log('ValidateImpl.validate: Parent = ', Parent, ', Parent.prototype = ', Parent.prototype);
    // 若其父类实现了 validate() 原型函数
    if (hasOwnPrototypeFunction(Parent, 'validate')) {
      const parentInstance = getDefaultInstance(Parent);
      // console.log('ValidateImpl.validate: parentInstance= ', parentInstance);
      // 并且field是其父类的字段
      if (Object.hasOwn(parentInstance, field)) {
        // 调用其父类的 validate 函数正则化field字段
        return Parent.prototype.validate.call(instance, field, options);
      }
    }
    // 否则，根据其字段的 @Validator 装饰器参数，调用验证函数对该字段进行验证
    const config = getFieldMetadata(Class, field, PROPERTY_VALIDATOR);
    if (config === undefined) {
      // 若字段没有被 @Validator 装饰，则不需要验证
      return new ValidationResult(true);
    }
    if ((typeof config !== 'object') || (typeof config.validator !== 'function')) {
      // 若字段被 @Validator 装饰，但装饰器参数类型不对，则报错
      return new ValidationResult(false, `${Class.name}的字段${field}没有通过@Validator装饰器提供正确的验证函数`);
    }
    // 获取字段值
    const value = instance[field];
    // 获取字段的标注类型
    const type = getFieldMetadata(Class, field, PROPERTY_TYPE);
    // 获取字段的显示名称
    const displayName = getFieldMetadata(Class, field, PROPERTY_DISPLAY_NAME) || field;
    // 获取字段是否可空
    const nullable = (getFieldMetadata(Class, field, PROPERTY_NULLABLE) === true);
    // 若字段可空，且字段值为空，则直接认为校验成功
    if (isNull(value) && nullable) {
      return new ValidationResult(true);
    }
    // 获取字段的校验函数
    const validator = config.validator;
    // 默认的选项
    const defaultOptions = {
      instance,
      type,
      field,
      displayName,
      nullable,
    };
    // 执行校验，合并字段的校验函数的额外选项参数
    return validator(value, Object.assign(defaultOptions, config.options, options));
  },

};

export default ValidateImpl;
