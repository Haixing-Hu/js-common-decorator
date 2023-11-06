////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  KEY_CLASS_DEFAULT_INSTANCE,
  KEY_CLASS_FIELDS_METADATA,
} from './metadata-keys';
import {
  PROPERTY_TYPE,
  PROPERTY_FIELDS,
} from './constants';
import ClassMetadataCache from './class-metadata-cache';

/**
 * 判定给定的对象是否是一个属性描述符(descriptor)。
 *
 * @param {object} desc
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
 * @param {function} handleDescriptor
 *     目标对象的属性描述符修改函数。
 * @param {array} entryArgs
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
 * @param {object} descriptor
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
 * Get the specified attribute value from the metadata of the specified class.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} key
 *     The key of the specified attribute.
 * @return  {object}
 *     The value associated with the specified key in the metadata of the
 *     specified class.
 * @throws Error
 *     If the metadata of the specified class has not been cached.
 * @author Haixing Hu
 * @private
 */
export function getClassMetadata(Class, key) {
  const metadata = ClassMetadataCache.get(Class);
  if (!metadata) {
    throw new Error(`The metadata of the class "${Class.name}" has not been cached.`);
  }
  return metadata[key];
}

/**
 * Sets the specified attribute value of the metadata of the specified class.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} key
 *     The key of the specified attribute.
 * @param {any} value
 *     The attribute value to be set.
 * @throws Error
 *     If the metadata of the specified class has not been cached.
 * @author Haixing Hu
 * @private
 */
export function setClassMetadata(Class, key, value) {
  const metadata = ClassMetadataCache.get(Class);
  if (!metadata) {
    throw new Error(`The metadata of the class "${Class.name}" has not been cached.`);
  }
  metadata[key] = value;
}

/**
 * Gets the metadata object for the field of the specified class, or creates a
 * new one if it does not exist.
 *
 * @param {object} metadata
 *     The metadata of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @returns {object}
 *     The metadata object for the field of the specified class, creating a new
 *     one if it does not exist.
 * @author Haixing Hu
 * @private
 */
export function getFieldMetadataObject(metadata, field) {
  metadata[KEY_CLASS_FIELDS_METADATA] ??= {};
  const fieldsMetadata = metadata[KEY_CLASS_FIELDS_METADATA];
  fieldsMetadata[field] ??= {};
  return fieldsMetadata[field];
}

/**
 * Gets the specified attribute value of the metadata of the specified field
 * of the specified class.
 *
 * @param {object} metadata
 *     The metadata of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @param {string} key
 *     The key of the specified attribute for the specified field.
 * @return {object}
 *     The attribute value associated with the specified key in the metadata of
 *     the specified field of the specified class, or `undefined` if it does
 *     not exist.
 * @author Haixing Hu
 * @private
 */
export function getFieldMetadata(metadata, field, key) {
  const md = getFieldMetadataObject(metadata, field);
  return md[key];
}

/**
 * Sets the specified attribute value of the metadata for the specified field
 * of the specified class.
 *
 * @param {object} metadata
 *     The metadata of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @param {string} key
 *     The key of the specified attribute for the specified field.
 * @param {any} value
 *     The attribute value to be set.
 * @author Haixing Hu
 * @private
 */
export function setFieldMetadata(metadata, field, key, value) {
  const md = getFieldMetadataObject(metadata, field);
  md[key] = value;
}

/**
 * Get the default instance of the specified class, or create a new instance if
 * it does not exist.
 *
 * @param {function} Class
 *     The constructor of the class being decorated.
 * @returns {object}
 *     The default instance of the specified class, or a new instance will be
 *     created if it does not exist.
 * @author Haixing Hu
 * @private
 */
export function getDefaultInstance(Class) {
  const metadata = ClassMetadataCache.get(Class);
  if (!metadata) {
    return new Class();
  } else if (!metadata[KEY_CLASS_DEFAULT_INSTANCE]) {
    metadata[KEY_CLASS_DEFAULT_INSTANCE] = new Class();
  }
  const obj = metadata[KEY_CLASS_DEFAULT_INSTANCE];
  if (! (obj instanceof Class)) {
    // Note that the metadata of a class can inherit the metadata of its parent
    // class. Therefore, if the parent class has a default instance stored in
    // its metadata, it can be accessed by the child class. That's why we have
    // to check whether the default instance is an instance of the specified
    // class.
    metadata[KEY_CLASS_DEFAULT_INSTANCE] = new Class();
  }
  return metadata[KEY_CLASS_DEFAULT_INSTANCE];
}

/**
 * Tests whether the specified class has the specified field.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} field
 *     The name of the specified field.
 * @returns {boolean}
 *     Whether the specified class has the specified field defined in its
 *     prototype or its default instance.
 */
export function hasOwnClassField(Class, field) {
  if (!Class || !Class.prototype) {
    return false;
  }
  if (Object.hasOwn(Class.prototype, field)) {
    return true;
  } else {
    const defaultInstance = getDefaultInstance(Class);
    return Object.hasOwn(defaultInstance, field);
  }
}

/**
 * Determines whether the specified prototype function is defined in the
 * prototype of a specified class.
 *
 * @param {function} Class
 *     Constructor for the specified class.
 * @param {string} name
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
 * prototype function.
 *
 * Note that the function may be inherited from its parent class.
 *
 * @param {function} Class
 *     Constructor for the specified class.
 * @param {string} name
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
 * @param {function} Class
 *     指定的类的构造器。
 * @param {string} field
 *     指定的字段的名称。
 * @return {function}
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
 * Determines whether the given value is nullish or empty.
 *
 * @param {String|Array} value
 *     The value to be determined, which must be a string or an array.
 * @returns
 *     Whether the given value is `undefined` or `null` or an empty string or
 *     an empty array.
 */
export function isNullishOrEmpty(value) {
  return (value === undefined
      || value === null
      || value === ''
      || value.length === 0);
}

/**
 * Checks whether the specified class or its parent classes have a prototype
 * method with the specified name.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} func
 *     The name of the specified prototype method.
 * @throws TypeError
 *     If the specified class and its parent classes do not have a prototype
 *     method with the specified name.
 */
export function requirePrototypeMethod(Class, func) {
  if (!hasPrototypeFunction(Class, func)) {
    throw new TypeError(`The class ${Class.name} does not implement the prototype method "${func}()".`);
  }
}

/**
 * Defines the specified properties on the prototype of a class.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {string} properties
 *     The array of names of the specified properties.
 */
export function definePrototypeProperty(Class, ...properties) {
  for (const property of properties) {
    Object.defineProperty(Class.prototype, property, {
      value: '',
      configurable: false,
      enumerable: true,
      writable: true,
    });
  }
}
