////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getClassMetadata from './get-class-metadata';
import getFieldMetadata from './get-field-metadata';
import { PROPERTY_TYPE } from '../constants';

/**
 * Ensure that the type of the field of a specified class
 * is an enumeration type decorated by the `@Enum` decorator.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @return {function}
 *     The constructor of the enumeration type of the specified field.
 * @throws TypeError
 *     If the specified field is not decorated by the `@Type` decorator, or the
 *     type of the specified field is not an enumeration class decorated by the
 *     `@Enum` decorator.
 * @author Haixing Hu
 * @private
 */
function ensureEnumField(Class, field) {
  // 获取被修饰字段的枚举类型
  const EnumClass = getFieldMetadata(Class, field, PROPERTY_TYPE);
  if (!EnumClass) {
    throw new TypeError(`The field "${Class.name}.${field}" must be decorated by the @Type decorator.`);
  }
  if (getClassMetadata(EnumClass, 'category') !== 'enum') {
    throw new TypeError(`The field "${Class.name}.${field}" must be an enumeration whose class should be decorated by @Enum.`);
  }
  // console.log('Class = ', Class.name,  ', field = ', field, ', EnumClass = ', EnumClass.name);
  return EnumClass;
}

export default ensureEnumField;
