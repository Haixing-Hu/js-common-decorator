/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import isBuiltInClass from '@haixing_hu/common-util/src/is-built-in-class';
import isUndefinedOrNull from '@haixing_hu/common-util/src/is-undefined-or-null';
import clone from '@haixing_hu/common-util/src/clone';
import { PROPERTY_TYPE, PROPERTY_ELEMENT_TYPE } from './constants';
import {
  getClassMetadata,
  getFieldMetadata,
  getDefaultInstance,
  hasOwnPrototypeFunction,
  normalize,
} from './utils';

/**
 * 用于调用 clone() 函数复制属性时用到的参数。
 *
 * @author 胡海星
 * @private
 */
const CLONE_OPTIONS = {
  includeAccessor: false,
  includeNonEnumerable: false,
  includeReadonly: true,
  includeNonConfigurable: true,
};

const AssignImpl = {

  /**
   * 将源对象的所有可配置、可枚举，以及非只读属性复制到目标对象。
   *
   * @param {Object} target
   *     目标对象。
   * @param {Object} source
   *     源对象。
   * @author 胡海星
   * @private
   */
  copyAllProperties(target, source) {
    // console.log('AssignImpl.copyAllProperties: target = ', target, ', source = ', source);
    Object.keys(target).forEach((key) => {
      // console.log('copyAllProperties: key = ', key);
      if (Object.hasOwn(source, key)) {
        const value = source[key];
        const clonedValue = clone(value, CLONE_OPTIONS);
        // console.log('copyAllProperties: key = ', key,
        //   ', value = ', value,
        //   ', clonedValue = ', clonedValue);
        target[key] = clonedValue;
      }
    });
    // console.log('copyAllProperties: finished. target = ', target);
  },

  /**
   * 复制一个不知类型的对象。
   *
   * @param {String} path
   *     当前被复制的对象在属性树中的路径。
   * @param {Object} sourceValue
   *     被复制的源对象。
   * @param {Object} defaultValue
   *     默认对象实例。
   * @param {Boolean} normalizable
   *     是否要对复制后的目标对象进行正则化。
   * @returns
   *     从源对象深度复制而来的目标对象，其类型和默认对象完全一致。
   * @author 胡海星
   * @private
   */
  copyObjectWithoutType(path, sourceValue, defaultValue, normalizable) {
    // 如果目标对象的属性值是一个对象，必须创建相同原型的对象并复制源对象的属性值
    const prototype = Object.getPrototypeOf(defaultValue);
    const targetValue = Object.create(prototype);
    // 递归地将sourceValue的各属性值赋值给targetValue，使用defaultValue作为默认实例
    return this.assign(path, targetValue, sourceValue, defaultValue, normalizable);
  },

  /**
   * 复制一个知道类型的对象。
   *
   * @param {String} path
   *     当前被复制的对象在属性树中的路径。
   * @param {Function} Type
   *     被复制的对象的类的构造器。
   * @param {Object} sourceValue
   *     被复制的源对象。
   * @param {Object} defaultValue
   *     默认对象实例。
   * @param {Boolean} normalizable
   *     是否要对复制后的目标对象进行正则化。
   * @returns
   *     从源对象深度复制而来的目标对象，其类型和指定的类完全一致。
   * @author 胡海星
   * @private
   */
  copyObjectWithType(path, Type, sourceValue, defaultValue, normalizable) {
    const category = getClassMetadata(Type, 'category');
    switch (category) {
      case 'enum':
        // 对于枚举类，因为枚举类型总是以字符串形式表示，所以只需要将源字符串复制一份即可
        if (typeof sourceValue === 'string') {
          return sourceValue;
        } else {
          // 源属性值不是字符串，返回默认值
          console.warn('The value of %s should be a string representation of '
              + 'the %s enumeration.', path, Type.name);
          return defaultValue;
        }
      case 'model':
      default: {
        // 根据 @Type 标注的类型构造一个 targetValue
        const targetValue = new Type();
        const defaultValue = getDefaultInstance(Type);
        // 递归地将sourceValue的各属性值赋值给targetValue，使用defaultValue作为默认实例
        return this.assign(path, targetValue, sourceValue, defaultValue, normalizable);
      }
    }
  },

  /**
   * 复制一个不知元素类型的数组。
   *
   * @param {String} path
   *     当前被复制的数组在属性树中的路径。
   * @param {Array} sourceArray
   *     被复制的源数组。
   * @param {Array} defaultArray
   *     默认数组。
   * @param {Boolean} normalizable
   *     是否要对复制后的目标对象进行正则化。
   * @returns
   *     从源数组深度复制而来的目标数组，其元素类型和默认数组的元素类型完全一致。
   * @author 胡海星
   * @private
   */
  copyArrayWithoutElementType(path, sourceArray, defaultArray/* , normalizable*/) {
    // TODO: 如果其默认字段值中有类型信息，则可以根据默认字段值中类型信息构造同类型数组
    if (!Array.isArray(sourceArray)) {
      console.warn('The value of %s should be an array.', path);
      return clone(defaultArray, CLONE_OPTIONS);
    }
    return clone(sourceArray, CLONE_OPTIONS);
  },

  /**
   * 复制一个知道元素类型的数组。
   *
   * @param {String} path
   *     当前被复制的数组在属性树中的路径。
   * @param {Function} ElementType
   *     被复制的数组的元素的类的构造器。
   * @param {Object} sourceArray
   *     被复制的源数组。
   * @param {Object} defaultArray
   *     默认数组实例。
   * @param {Boolean} normalizable
   *     是否要对复制后的目标对象进行正则化。
   * @returns
   *     从源数组深度复制而来的目标对象，其元素类型和指定的元素类完全一致。
   * @author 胡海星
   * @private
   */
  copyArrayWithElementType(path, ElementType, sourceArray, defaultArray, normalizable) {
    if (!Array.isArray(sourceArray)) {
      console.warn('The value of %s should be an array.', path);
      return clone(defaultArray, CLONE_OPTIONS);
    }
    if (isBuiltInClass(ElementType)) {
      // 对于JS内建标准类，直接深度克隆数组
      return clone(sourceArray, CLONE_OPTIONS);
    }
    const category = getClassMetadata(ElementType, 'category');
    switch (category) {
      case 'enum':
        // 对于枚举类，因为枚举类型总是以字符串形式表示，所以只需要将源字符串数组复制一份即可
        // TODO: 判定 sourceArray 内是否全是字符串或null，如不是应返回defaultArray并输出警告日志
        return clone(sourceArray, CLONE_OPTIONS);
      case 'model':
      default: {
        // 对于非枚举的元素类，创建相同该元素类型的目标数组，并逐一将源数组内的值赋值给目标数组
        const defaultElement = getDefaultInstance(ElementType);
        return sourceArray.map((sourceElement, index) => {
          // 创建一个目标数组中的元素
          const targetElement = new ElementType();
          // 递归地将sourceElement的各属性值赋值给targetFieldElement，
          // 使用defaultFieldElement作为默认实例
          const targetPath = `${path}[${index}]`;
          return this.assign(
            targetPath,
            targetElement,
            sourceElement,
            defaultElement,
            normalizable,
          );
        });
      }
    }
  },

  /**
   * 复制一个源对象的属性到目标对象。
   *
   * @param {String} path
   *     当前被复制的对象在原始根对象中的路径。
   * @param {Object} target
   *     目标对象。
   * @param {Object} source
   *     源对象，可以为null或undefined。
   * @param {Object} defaultInstance
   *     与目标对象有相同原型的默认实例，如果目标对象的某个属性值在源对象中不存在
   *     或为null，则使用此默认实例的对应属性值赋值给目标对象的对应属性。
   * @param {Boolean} normalizable
   *     是否要对复制后的目标对象进行正则化。
   * @returns
   *     赋值后的目标对象。
   * @author 胡海星
   * @private
   */
  assign(path, target, source, defaultInstance, normalizable) {
    // console.log('AssignImpl.assign: target = ', target,
    //   ', source = ', source,
    //   ', defaultInstance = ', defaultInstance,
    //   ', normalizable = ', normalizable);
    if (isUndefinedOrNull(source)) {
      this.copyAllProperties(target, defaultInstance);
    } else {
      // 获取当前类的构造器
      const Class = Object.getPrototypeOf(defaultInstance).constructor;
      // 获取当前类默认实例的所有字段
      let fields = Object.keys(defaultInstance);
      // 获取其父类构造器
      const Parent = Object.getPrototypeOf(Class);
      // console.log('Parent = ', Parent, ', normalizable = ', normalizable);
      if (hasOwnPrototypeFunction(Parent, 'assign')) {
        // 父类如果有assign方法，先调用父类的assign方法
        Parent.prototype.assign.call(target, source, normalizable);
        // console.log('target = ', target);
        // 然后排除父类拥有的字段
        const parentInstance = getDefaultInstance(Parent);
        const parentFields = Object.keys(parentInstance);
        // console.log('parentFields = ', parentFields);
        fields = fields.filter((f) => !parentFields.includes(f));
      }
      // console.log('fields = ', fields);
      fields.forEach((field) => {
        const targetPath = `${path}.${field}`;
        const sourceFieldValue = source[field];            // 源对象的字段值
        const defaultFieldValue = defaultInstance[field];  // 默认实例的字段值
        // 目标对象的字段被@Type标注的类型
        const FieldType = getFieldMetadata(Class, field, PROPERTY_TYPE);
        // 目标对象的字段被@ElementType标注的类型
        const FieldElementType = getFieldMetadata(Class, field, PROPERTY_ELEMENT_TYPE);
        // console.log('targetPath = ', targetPath,
        //   ', field = ', field,
        //   ', sourceFieldValue = ', sourceFieldValue,
        //   ', defaultFieldValue = ', defaultFieldValue,
        //   ', FieldType = ', FieldType,
        //   ', FieldElementType = ', FieldElementType);
        if (isUndefinedOrNull(sourceFieldValue)) {
          // 如果源对象字段值为空，则直接复制默认字段值
          target[field] = clone(defaultFieldValue, CLONE_OPTIONS);
        } else if (FieldType) {
          // 如果目标对象的字段被@Type标注过
          target[field] = this.copyObjectWithType(
            targetPath,
            FieldType,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else if (FieldElementType) {
          // 如果目标对象的字段被@ElementType标注过
          target[field] = this.copyArrayWithElementType(
            targetPath,
            FieldElementType,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else if (isUndefinedOrNull(defaultFieldValue)) {
          // 如果默认字段值为空，但源对象字段值不为空，且字段没有被@Type标注，
          // 则无法判定该属性的类型，直接克隆源对象字段值
          target[field] = clone(sourceFieldValue, CLONE_OPTIONS);
        } else if (Array.isArray(defaultFieldValue)) {   // 注意Array是一种特殊的Object
          // 如果目标对象字段值是一个数组，但没有被 @ElementType 标注过
          target[field] = this.copyArrayWithoutElementType(
            targetPath,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else if ((typeof defaultFieldValue) === 'object') {
          // 如果目标对象的属性值是一个对象，必须创建相同原型的对象并复制源对象的属性值
          target[field] = this.copyObjectWithoutType(
            targetPath,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else {
          // 如果目标对象的属性值不是一个对象，直接将源对象的属性值克隆赋值给目标对象
          target[field] = clone(sourceFieldValue, CLONE_OPTIONS);
        }
      });
    }
    // console.log('AssignImpl.assign: target = ', target, ', normalizable = ', normalizable);
    if (normalizable) {
      normalize(target);
    }
    return target;
  },
};

export default AssignImpl;
