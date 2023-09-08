/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import getDeclaringClass from '@haixing_hu/common-util/src/get-declaring-class';
import { PROPERTY_NORMALIZER } from '@/normalizer';
import {
  getFieldMetadata,
  getDefaultInstance,
  hasOwnPrototypeFunction,
} from '@/impl/utils';

const NormalizeImpl = {

  /**
   * 正则化指定的对象的指定字段。
   *
   * @param {Function} Class
   *     待正则化的对象的类的构造器。
   * @param {Object} obj
   *     待正则化的对象，必须是一个`Class`类的实例。
   * @param {String} field
   *     待正则化的字段名称，如果是`undefined`或`null`或字符串`"*"`，则对指定对
   *     象所有可正则化的字段进行正则化；如果是一个字符串数组，则对该数组中所有
   *     可正则化的字段进行正则化。
   * @return {Object}
   *     被正则化的对象。
   */
  normalize(Class, obj, field) {
    if (field === undefined || field === null || field === '*') {
      const fields = Object.keys(obj);
      fields.forEach((f) => this.normalizeField(Class, obj, f));
    } else if (Array.isArray(field)) {
      field.forEach((f) => this.normalizeField(Class, obj, f));
    } else if (typeof field !== 'string') {
      throw new TypeError(`Field name of ${Class.name} must be a string.`);
    } else {
      NormalizeImpl.normalizeField(Class, obj, field);
    }
    return obj;
  },

  /**
   * 正则化指定的对象的指定字段。
   *
   * @param {Function} Class
   *     指定对象的类的构造器，即该对象的prototype，通过Object.getPrototypeOf(obj)获取。
   * @param {Object} obj
   *     指定的对象，必须是一个`Class`类的实例。
   * @param {String} field
   *     指定的字段名称。
   */
  normalizeField(Class, obj, field) {
    // console.log('NormalizeImpl.normalizeField: Class = ', Class, ', obj = ', obj, ', field = ', field);
    if (!Object.hasOwn(obj, field)) {
      console.warn('Cannot normalize the non-existing field "%s" of the object: %o', field, obj);
      return;
    }
    const DeclClass = getDeclaringClass(Class, field);
    if (DeclClass === null) {
      console.warn('Cannot find the declaration class of the field "%s" of object: %o', field, obj);
      return;
    }
    // 若声明类不是当前类，即使当前类的祖先类，
    // 若它还具有normalize()方法，则直接使用该类的normalize方法
    if (!Object.is(Class, DeclClass)
      && hasOwnPrototypeFunction(DeclClass, 'normalize')) {
      // 调用其该祖先类的normalize函数正则化field字段
      // console.log('Call ancestor normalize: ', DeclClass.constructor.name);
      DeclClass.prototype.normalize.call(obj, field);
      return;
    }
    // 否则，根据其字段的@Normalizer装饰器参数，调用正则化函数对该字段正则化
    // 注意我们必须用在field的声明类中找其元信息数据。
    const normalizer = getFieldMetadata(DeclClass, field, PROPERTY_NORMALIZER);
    // console.log('Get the normalizer: ', normalizer);
    if (typeof normalizer === 'function') {
      const value = obj[field];
      // console.log('Use normalizer to normalize: ', value);
      if (value === undefined || value === null) {
        // 对于字段值为undefined或null，应该把该字段值设置为默认值
        const defaultInstance = getDefaultInstance(Class);
        obj[field] = defaultInstance[field];
      } else if (Array.isArray(value)) {
        // 如果是数组则调用正则化函数对数组每个元素进行正则化
        obj[field] = value.map((v) => normalizer(v));
      } else {
        // 否则调用正则化函数进行正则化
        obj[field] = normalizer(value);
      }
    }
    // else {
    //   console.log('The type of normalizer is not function');
    // }
  },
};

export default NormalizeImpl;
