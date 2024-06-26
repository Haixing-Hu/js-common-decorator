////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  KEY_CLASS_CATEGORY,
  KEY_CLASS_DEFAULT_INSTANCE,
  KEY_CLASS_FIELDS_METADATA,
  KEY_CLASS_NAME_FIELD,
} from './metadata-keys';
import {
  PROPERTY_TYPE,
} from './constants';
import classMetadataCache from './class-metadata-cache';

/**
 * Tests whether the given object is a property descriptor.
 *
 * @param {object} desc
 *     the given object to be tested.
 * @returns
 *     `true` if the given object is a property descriptor; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
export function isDescriptor(desc) {
  if (!desc || (typeof desc !== 'object') || !desc.hasOwnProperty) {
    return false;
  }
  return ['value', 'initializer', 'get', 'set']
    .find((key) => Object.prototype.hasOwnProperty.call(desc, key)) !== undefined;
}

/**
 * Gets the property descriptor of the decorated target.
 *
 * The purpose of this function is to unify the handling of decorators for
 * classes, methods, and fields.
 *
 * @param {function} handleDescriptor
 *     The property descriptor modification function of the decorated target.
 * @param {array} entryArgs
 *     The arguments of the decorator.
 * @returns
 *     The new property descriptor of the decorated target.
 * @author Haixing Hu
 * @private
 */
export function decorate(handleDescriptor, entryArgs) {
  if ((entryArgs.length > 0) && isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return (...args) => handleDescriptor(...args, entryArgs);
  }
}

/**
 * Gets the default value of a property.
 *
 * @param {object} descriptor
 *     the property descriptor.
 * @returns
 *     the default value of the property, or `undefined` if no default value is
 *     defined.
 * @author Haixing Hu
 * @private
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
  const metadata = classMetadataCache.get(Class);
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
  const metadata = classMetadataCache.get(Class);
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
 *     The constructor of the specified class.
 * @returns {object}
 *     The default instance of the specified class, or a new instance will be
 *     created if it does not exist.
 * @author Haixing Hu
 * @private
 */
export function getDefaultInstance(Class) {
  const metadata = classMetadataCache.get(Class);
  let obj = metadata[KEY_CLASS_DEFAULT_INSTANCE];
  if (!(obj instanceof Class)) {
    // Note that the metadata of a class can inherit the metadata of its parent
    // class. Therefore, if the parent class has a default instance stored in
    // its metadata, it can be accessed by the child class. That's why we have
    // to check whether the default instance is an instance of the specified
    // class.
    obj = new Class();
    metadata[KEY_CLASS_DEFAULT_INSTANCE] = obj;
  }
  return obj;
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
 * @author Haixing Hu
 * @private
 */
export function hasOwnClassField(Class, field) {
  if (!Class || !Class.prototype) {
    return false;
  }
  if (Object.prototype.hasOwnProperty.call(Class.prototype, field)) {
    return true;
  } else {
    const defaultInstance = getDefaultInstance(Class);
    return Object.prototype.hasOwnProperty.call(defaultInstance, field);
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
 * @author Haixing Hu
 * @private
 */
export function hasOwnPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Object.prototype.hasOwnProperty.call(Class.prototype, name)
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
 * @author Haixing Hu
 * @private
 */
export function hasPrototypeFunction(Class, name) {
  return (Class !== null)
    && (Class.prototype)
    && Reflect.has(Class.prototype, name)
    && (typeof Class.prototype[name] === 'function');
}

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
 * @author Haixing Hu
 * @private
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
 * @author Haixing Hu
 * @private
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
 * @author Haixing Hu
 * @private
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

/**
 * Tests whether a specified class is an enumeration class decorated by `@Enum`.
 *
 * @param {function} Class
 *     The constructor function of a class.
 * @return {boolean}
 *     `true` if the specified class is an enumeration class decorated by
 *     `@Enum`; `false` otherwise.
 * @author Haixing Hu
 */
export function isEnumClass(Class) {
  if (typeof Class !== 'function') {
    return false;
  }
  const category = getClassMetadata(Class, KEY_CLASS_CATEGORY);
  return category === 'enum';
}

/**
 * Tests whether a specified value is an enumerator of an enumeration class,
 * i.e., the static constants of a class decorated by `@Enum`.
 *
 * @param {any} value
 *     The specified value.
 * @return {boolean}
 *     `true` if the specified value is an enumerator of an enumeration class,
 *     i.e., the static constants of a class decorated by `@Enum`; `false`
 *     otherwise.
 * @author Haixing Hu
 */
export function isEnumerator(value) {
  if (value === undefined || value === null || (typeof value !== 'object')) {
    return false;
  }
  const Class = Object.getPrototypeOf(value).constructor;
  const category = getClassMetadata(Class, KEY_CLASS_CATEGORY);
  return category === 'enum';
}

/**
 * Gets the name of a instance.
 *
 * The name of an instance is the value of the field decorated by the `@NameField`
 * decorator.
 *
 * @param {object} metadata
 *     the metadata of the class.
 * @param {object} instance
 *     the instance of the class.
 * @return {string}
 *     the name of the instance, or `undefined` if the instance has no field
 *     decorated by the `@NameField` decorator.
 * @author Haixing Hu
 * @private
 */
export function getInstanceName(metadata, instance) {
  const field = metadata[KEY_CLASS_NAME_FIELD];
  if (field) {
    return instance[field];
  } else {
    return undefined;
  }
}

/**
 * Checks the type of an object.
 *
 * @param {string} name
 *     the name of the object.
 * @param {object} obj
 *     the object.
 * @param {function} type
 *     the constructor of the type.
 * @throws TypeError
 *     if the object is not an instance of the specified type.
 */
export function checkType(name, obj, type) {
  if (!(obj instanceof type)) {
    throw new TypeError(`The ${name} must be an object of the type ${type.name}`);
  }
}
