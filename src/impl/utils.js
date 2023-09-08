/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import {
  PROPERTY_TYPE,
  PROPERTY_METADATA,
  PROPERTY_DEFAULT_INSTANCE,
  PROPERTY_FIELDS,
} from './constants';

/**
 * 判定给定的对象是否是一个属性描述符(descriptor)。
 *
 * @param {Object} desc
 *     给定的对象。
 * @returns
 *     该对象是否是一个属性描述符。
 * @author 胡海星
 */
export function isDescriptor(desc) {
  if (!desc || (typeof desc !== 'object') || !desc.hasOwnProperty) {
    return false;
  }
  return ['value', 'initializer', 'get', 'set']
    .find((key) => Object.prototype.hasOwnProperty.call(desc, key)) !== undefined;
}

/**
 * 返回被修饰的目标对象的属性描述符。
 *
 * 此函数的目的是为了能够统一处理针对类、方法和字段的修饰符。
 *
 * @param {Function} handleDescriptor
 *     目标对象的属性描述符修改函数。
 * @param {Array} entryArgs
 *     修饰器输入的参数。
 * @returns
 *     修饰后的目标对象的新的属性描述符。
 * @author 胡海星
 */
export function decorate(handleDescriptor, entryArgs) {
  if (isDescriptor(entryArgs[entryArgs.lengh - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return (...args) => handleDescriptor(...args, entryArgs);
  }
}

/**
 * 返回一个属性的默认值。
 *
 * @param {Object} descriptor
 *     该属性的描述符。
 * @returns
 *     该属性的默认值，或`undefined`如果没有定义默认值。
 * @author 胡海星
 */
export function getDefaultValue(descriptor) {
  if (descriptor.value !== undefined) {
    return descriptor.value;
  }
  if (typeof descriptor.initializer === 'function') {
    return descriptor.initializer();
  }
  if (typeof descriptor.get === 'function') {
    return descriptor.get();
  }
  return undefined;
}

/**
 * 获取指定类的元数据对象，如果不存在则为其创建一个新的。
 *
 * @param {Function} Class
 *     指定的类的构造器函数。
 * @returns  {Object}
 *     指定类的元数据对象，如果不存在则为其创建一个新的。
 * @author 胡海星
 */
export function getClassMetadataObject(Class) {
  if (!Object.hasOwn(Class, PROPERTY_METADATA)) {
    Object.defineProperty(Class, PROPERTY_METADATA, {
      enumerable: false,      // 设置一个非可枚举的属性
      value: {},              // 默认值为空对象
    });
  }
  return Class[PROPERTY_METADATA];
}

/**
 * 获取指定的类的元数据的指定的属性值。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} key
 *     指定的属性的名称。
 * @return  {Object}
 *     指定的类的元数据的指定属性值，如果不存在则返回`undefined`。
 * @author 胡海星
 */
export function getClassMetadata(Class, key) {
  const metadata = getClassMetadataObject(Class);
  return metadata[key];
}

/**
 * 设置指定的类的元数据的指定属性值。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} key
 *     指定的属性名称。
 * @param {any} value
 *     待设置的属性值。
 * @author 胡海星
 */
export function setClassMetadata(Class, key, value) {
  const metadata = getClassMetadataObject(Class);
  metadata[key] = value;
}

/**
 * 获取指定类的字段的元数据对象，如果不存在则为其创建一个新的。
 *
 * @param {Function} Class
 *     指定的类的构造器函数。
 * @param {String} field
 *     指定的字段的名称。
 * @returns {Object}
 *     指定类的字段的元数据对象，如果不存在则为其创建一个新的。
 * @author 胡海星
 */
export function getFieldMetadataObject(Class, field) {
  const metadata = getClassMetadataObject(Class);
  if (!metadata[PROPERTY_FIELDS]) {
    metadata[PROPERTY_FIELDS] = {};
  }
  const fieldMetadata = metadata[PROPERTY_FIELDS];
  if (!fieldMetadata[field]) {
    fieldMetadata[field] = {};
  }
  return fieldMetadata[field];
}

/**
 * 获取指定的类的指定字段的元数据的指定属性值。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} field
 *     指定的字段的名称。
 * @param {String} key
 *     指定字段的指定属性的名称。
 * @return {Object}
 *     指定的类的指定字段的元数据的指定属性值，如果不存在则返回`undefined`。
 * @author 胡海星
 */
export function getFieldMetadata(Class, field, key) {
  const metadata = getFieldMetadataObject(Class, field);
  return metadata[key];
}

/**
 * 设置指定的类的指定字段的元数据的指定属性值。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} field
 *     指定的字段的名称。
 * @param {String} key
 *     指定字段的指定属性的名称。
 * @param {any} value
 *     待设置的属性值。
 * @author 胡海星
 */
export function setFieldMetadata(Class, field, key, value) {
  const metadata = getFieldMetadataObject(Class, field);
  metadata[key] = value;
}

/**
 * 获取制指定类的默认实例，若不存在则创建一个新的实例。
 *
 * @param {Function} Class
 *     指定类的构造器。
 * @returns {Object}
 *     该指定类的默认实例，若不存在则创建一个新的实例。
 */
export function getDefaultInstance(Class) {
  const metadata = getClassMetadataObject(Class);
  if (!metadata[PROPERTY_DEFAULT_INSTANCE]) {
    metadata[PROPERTY_DEFAULT_INSTANCE] = new Class();
  }
  return metadata[PROPERTY_DEFAULT_INSTANCE];
}

/**
 * 正则化一个对象。
 *
 * @param {Object} obj
 *     待正则化的对象。
 * @returns {Object}
 *     正则化后的对象。
 */
export function normalize(obj) {
  if (typeof obj.normalize === 'function') {
    obj.normalize();
  }
  return obj;
}

/**
 * 判定一个指定的类的原型中是否自己定义了指定的原型函数。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} name
 *     指定的原型函数的名称。
 * @returns {Boolean}
 *     指定的类的原型中是否自己定义了指定的原型函数。
 * @see hasPrototypeFunction
 */
export function hasOwnPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Object.hasOwn(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

/**
 * 判定一个指定的类的原型中是否拥有指定的原型函数，注意该函数可能从其父类继承而来。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} name
 *     指定的原型函数的名称。
 * @returns {Boolean}
 *     指定的类的原型中是否拥有指定的原型函数，注意该函数可能从其父类继承而来。
 * @see hasOwnPrototypeFunction
 */
export function hasPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Reflect.has(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

/**
 * 检查并确保指定类的指定字段的类型是被`@Enum`修饰的枚举类。
 *
 * @param {Function} Class
 *     指定的类的构造器。
 * @param {String} field
 *     指定的字段的名称。
 * @return {Function}
 *     指定字段的枚举类的构造器。
 */
export function ensureEnumField(Class, field) {
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

/**
 * 判定给定的值是否是空值。
 *
 * @param {String|Array} value
 *     待判定的值。
 * @returns
 *     给定的值是否为`undefined`或`null`或空字符串或空数组。
 */
export function isNull(value) {
  return (value === undefined || value === null || value === '' || value.length === 0);
}
