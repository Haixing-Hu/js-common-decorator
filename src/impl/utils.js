////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  DEFAULT_INSTANCE_KEY
} from './metadata-keys';
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
 * Get the default instance of the specified class, or create a new instance if
 * it does not exist.
 *
 * @param {Function} Class
 *     The constructor of the class being decorated.
 * @param {Object} metadata
 *     The metadata of the class being decorated. It could be null if the metadata
 *     of the class is not created yet.
 * @returns {Object}
 *     The default instance of the specified class, or a new instance will be
 *     created if it does not exist.
 * @author Haixing Hu
 * @private
 */
export function getDefaultInstance(Class, metadata) {
  if (!metadata) {
    return new Class();
  } else if (!metadata[DEFAULT_INSTANCE_KEY]) {
    metadata[DEFAULT_INSTANCE_KEY] = new Class();
  }
  return metadata[DEFAULT_INSTANCE_KEY];
}

/**
 * Normalizes an object if possible.
 *
 * @param {Object} obj
 *     The object to be normalized.
 * @returns {Object}
 *     The normalized object, or the original object if it has no `normalize()`
 *     method.
 */
export function normalize(obj) {
  if (typeof obj.normalize === 'function') {
    obj.normalize();
  }
  return obj;
}

/**
 * Determines whether the specified prototype function is defined in the
 * prototype of a specified class.
 *
 * @param {Function} Class
 *     Constructor for the specified class.
 * @param {String} name
 *     The name of the specified prototype function.
 * @returns {Boolean}
 *     Whether the specified prototype function is defined in the prototype of
 *     the specified class.
 * @see hasPrototypeFunction
 */
export function hasOwnPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Object.hasOwn(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

/**
 * Determine whether the prototype of a specified class has the specified
 * prototype function. Note that the function may be inherited from its parent
 * class.
 *
 * @param {Function} Class
 *     Constructor for the specified class.
 * @param {String} name
 *     The name of the specified prototype function.
 * @returns {Boolean}
 *     Whether the prototype of the specified class has the specified prototype
 *     function. Note that the function may be inherited from its parent class.
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
