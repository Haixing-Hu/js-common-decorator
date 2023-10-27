////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isUndefinedOrNull, isBuiltInClass, clone } from '@haixing_hu/common-util';
import metadataSymbol from './symbol-metadata';
import { PROPERTY_TYPE, PROPERTY_ELEMENT_TYPE } from './constants';
import {
  getClassMetadata,
  getFieldMetadata,
  getDefaultInstance,
  hasOwnPrototypeFunction,
  normalize,
} from './utils';

/**
 * Parameters used when calling the `clone()` function to copy attributes.
 *
 * @author Haixing Hu
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
   * Copies all configurable, enumerable, and non-read-only properties of the
   * source object to the target object.
   *
   * @param {Object} target
   *     The target object.
   * @param {Object} source
   *     The source object.
   * @author Haixing Hu
   * @private
   */
  copyAllProperties(target, source) {
    // console.log('AssignImpl.copyAllProperties: target = ', target, ', source = ', source);
    Object.keys(target).forEach((key) => {
      // console.log('copyAllProperties: key = ', key);
      if (Object.hasOwn(source, key)) {
        const value = source[key];
        target[key] = clone(value, CLONE_OPTIONS);
        // console.log('copyAllProperties: key = ', key, ', value = ', value, ', cloned = ', target[key]);
      }
    });
    // console.log('copyAllProperties: finished. target = ', target);
  },

  /**
   * Copies an object of an unknown type.
   *
   * @param {String} path
   *     The path in the property tree of the currently copied object.
   * @param {Object} sourceValue
   *     The source object being copied.
   * @param {Object} defaultValue
   *     The default instance of the source object.
   * @param {Boolean} normalizable
   *     Whether to regularize the copied target object.
   * @returns
   *     The type of the target object deeply copied from the source object is
   *     exactly the same as the default object.
   * @author Haixing Hu
   * @private
   */
  copyObjectWithoutType(path, sourceValue, defaultValue, normalizable) {
    // If the property value of the target object is an object, you must create
    // an object of the same prototype and copy the property values of the
    // source object
    const prototype = Object.getPrototypeOf(defaultValue);
    const TargetClass = prototype.constructor;
    const targetValue = new TargetClass();
    // Recursively assign each attribute value of sourceValue to targetValue,
    // using defaultValue as the default instance
    return this.assign(path, targetValue, sourceValue, defaultValue, normalizable);
  },

  /**
   * Copies an object of a known type.
   *
   * @param {String} path
   *     The path in the property tree of the currently copied object.
   * @param {Function} SourceType
   *     Constructor for the class of the object being copied.
   * @param {Object} sourceValue
   *     The source object being copied.
   * @param {Object} defaultValue
   *     Default object instance.
   * @param {Boolean} normalizable
   *     Whether to regularize the copied target object.
   * @returns
   *     The type of the target object deeply copied from the source object is
   *     exactly the same as the specified class.
   * @author Haixing Hu
   * @private
   */
  copyObjectWithType(path, SourceType, sourceValue, defaultValue, normalizable) {
    const category = getClassMetadata(SourceType, 'category');
    switch (category) {
      case 'enum':
        // 对于枚举类，因为枚举类型总是以字符串形式表示，所以只需要将源字符串复制一份即可
        if (typeof sourceValue === 'string') {
          return sourceValue;
        } else {
          // 源属性值不是字符串，返回默认值
          console.warn('The value of %s should be a string representation of '
              + 'the %s enumeration.', path, SourceType.name);
          return defaultValue;
        }
      case 'model':
      default: {
        // 根据 @Type 标注的类型构造一个 targetValue
        const targetValue = new SourceType();
        const defaultValue = getDefaultInstance(SourceType);
        // 递归地将sourceValue的各属性值赋值给targetValue，使用defaultValue作为默认实例
        return this.assign(path, targetValue, sourceValue, defaultValue, normalizable);
      }
    }
  },

  /**
   * Copies an array whose element type is unknown.
   *
   * @param {String} path
   *     The path in the property tree of the currently copied array.
   * @param {Array} sourceArray
   *     The source array being copied.
   * @param {Array} defaultArray
   *     Default array.
   * @returns
   *     The element type of the target array deeply copied from the source
   *     array is exactly the same as the element type of the default array.。
   * @author Haixing Hu
   * @private
   */
  copyArrayWithoutElementType(path, sourceArray, defaultArray) {
    // TODO: 如果其默认字段值中有类型信息，则可以根据默认字段值中类型信息构造同类型数组
    if (!Array.isArray(sourceArray)) {
      console.warn('The value of %s should be an array.', path);
      return clone(defaultArray, CLONE_OPTIONS);
    }
    return clone(sourceArray, CLONE_OPTIONS);
  },

  /**
   * Copies an array whose element types are known.
   *
   * @param {String} path
   *     The path in the property tree of the currently copied array.
   * @param {Function} ElementType
   *     Constructor for the class of the array elements to be copied.
   * @param {Object} sourceArray
   *     The source array being copied.
   * @param {Object} defaultArray
   *     Default array instance.
   * @param {Boolean} normalizable
   *     Whether to regularize the copied target object.
   * @returns
   *     The element type of the target object deeply copied from the source
   *     array is exactly the same as the specified element class.
   * @author Haixing Hu
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
   * Copies all properties of a source object to a target object.
   *
   * @param {Object} target
   *     The target object.
   * @param {Object} source
   *     The source object, which can be null or undefined, and can be a
   *     plain old JavaScript object without class information.
   * @param {String} path
   *     The path of the currently copied object in the original root object.
   * @param {Function} type
   *     The type of the target object, i.e., the constructor of the class of
   *     the target object.
   * @param {Object} metadata
   *     The metadata associated to the class of the target object, which usually
   *     can be obtained by `type[Symbol.metadata]`.
   * @param {Object} defaultInstance
   *     A default instance that has the same prototype as the target object.
   *     If a certain attribute value of the target object does not exist in the
   *     source object or is null, the corresponding attribute value of this
   *     default instance is used to assign the corresponding attribute of the
   *     target object.
   * @param {Boolean} normalizable
   *     Whether to regularize the copied target object.
   * @returns
   *     The target object after assignment.
   * @author Haixing Hu
   * @private
   */
  assign(target, source, { path, type, metadata, defaultInstance, normalizable }) {
    // console.log('AssignImpl.assign: target = ', target,
    //   ', source = ', source,
    //   ', type = ', type,
    //   ', metadata = ', metadata,
    //   ', defaultInstance = ', defaultInstance,
    //   ', normalizable = ', normalizable);
    if (isUndefinedOrNull(source)) {
      // if source is undefined or null, assign the default instance to the target
      this.copyAllProperties(target, defaultInstance);
    } else {
      // Get all fields of the default instance of the current class
      let fields = Object.keys(defaultInstance);
      // Get its parent class of the class of target object
      const parentType = Object.getPrototypeOf(type);
      // console.log('parentType = ', parentType);
      if (hasOwnPrototypeFunction(parentType, 'assign')) {
        // If the parent class has an `assign()` method, call the `assign()`
        // method of the parent class.
        parentType.prototype.assign.call(target, source, normalizable);
        // then exclude fields owned by the parent class
        const parentMetadata = parentType[metadataSymbol];
        const parentInstance = getDefaultInstance(parentType, parentMetadata);
        const parentFields = Object.keys(parentInstance);
        // console.log('parentFields = ', parentFields);
        fields = fields.filter((f) => !parentFields.includes(f));
      }
      // console.log('fields = ', fields);
      fields.forEach((field) => {
        const targetPath = `${path}.${field}`;
        const sourceFieldValue = source[field];            // field value of source
        const defaultFieldValue = defaultInstance[field];  // field value of default instance
        // If field of the target object is decorated with `@Type`, get the type
        // FIXME
        const FieldType = getFieldMetadata(Class, field, PROPERTY_TYPE);
        // If field of the target object is decorated with `@ElementType`, get the element type
        // FIXME
        const FieldElementType = getFieldMetadata(Class, field, PROPERTY_ELEMENT_TYPE);
        // console.log('targetPath = ', targetPath,
        //   ', field = ', field,
        //   ', sourceFieldValue = ', sourceFieldValue,
        //   ', defaultFieldValue = ', defaultFieldValue,
        //   ', FieldType = ', FieldType,
        //   ', FieldElementType = ', FieldElementType);
        if (isUndefinedOrNull(sourceFieldValue)) {
          // If the source object field value is nullish, copy the default field
          // value directly.
          target[field] = clone(defaultFieldValue, CLONE_OPTIONS);
        } else if (FieldType) {
          // If the field of the target object is decorated with `@Type`
          target[field] = this.copyObjectWithType(
            targetPath,
            FieldType,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else if (FieldElementType) {
          // If the field of the target object is decorated with `@ElementType`
          target[field] = this.copyArrayWithElementType(
            targetPath,
            FieldElementType,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else if (isUndefinedOrNull(defaultFieldValue)) {
          // If the field value of the default instance is empty, but the
          // source object field value is not empty, and the field is not
          // decorated with `@Type`, it is impossible to determine the type of
          // the attribute, therefore we directly clone the source object field
          // value.
          target[field] = clone(sourceFieldValue, CLONE_OPTIONS);
        } else if (Array.isArray(defaultFieldValue)) {
          // Note that Array is a special Object
          // If the field value of the target object is an array but has not
          // been annotated with `@ElementType`
          target[field] = this.copyArrayWithoutElementType(
            targetPath,
            sourceFieldValue,
            defaultFieldValue,
          );
        } else if ((typeof defaultFieldValue) === 'object') {
          // If the property value of the target object is an object, you must
          // create an object of the same prototype and copy the property value
          // of the source object
          target[field] = this.copyObjectWithoutType(
            targetPath,
            sourceFieldValue,
            defaultFieldValue,
            normalizable,
          );
        } else {
          // If the attribute value of the target object is not an object,
          // directly clone the attribute value of the source object and assign
          // it to the target object.
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
