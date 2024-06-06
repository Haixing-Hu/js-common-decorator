////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '@haixing_hu/clone';
import { isBuiltInClass } from '@haixing_hu/typeinfo';
import { isUndefinedOrNull } from '@haixing_hu/common-util';
import {
  getClassMetadata,
  getFieldMetadata,
  getDefaultInstance,
  hasPrototypeFunction,
} from '../utils';
import {
  KEY_CLASS_CATEGORY,
  KEY_FIELD_ELEMENT_TYPE,
  KEY_FIELD_TYPE,
} from '../metadata-keys';
import ClassMetadataCache from '../class-metadata-cache';
import DefaultOptions from '../../default-options';
import defaultNormalizer from '../../default-normalizer';
import ofValueImpl from '../enum/of-value-impl';
import { getSourceKey } from '../get-key';

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

const Impl = {
  /**
   * Gets the names of all fields of the default instance of target class.
   *
   * If the parent class of the target class has an `assign()` method, the
   * `assign()` method of the parent class is called firstly, and then the
   * fields owned by the parent class are excluded.
   *
   * @param {object} target
   *     The target object to be assigned to.
   * @param {object} source
   *     The source object to assigned from, which can be `null` or `undefined`,
   *     or a plain old JavaScript object without class information.
   * @param {function} type
   *     The type of the target object, i.e., the constructor of the class of
   *     the target object.
   * @param {object} options
   *     the additional options for the assignment.
   * @returns {string[]}
   *     The names of all fields of the default instance of the target class,
   *     excluding the fields owned by the parent class of the target class if
   *     the parent class has an `assign()` method.
   * @author Haixing Hu
   * @private
   */
  getAllFields(target, source, { type, options }) {
    // Get all names of fields of the default object of the `type`
    const fields = Object.keys(target);
    // call the `assign()` method in the parent classes of the target class
    const parentType = Object.getPrototypeOf(type);
    if (hasPrototypeFunction(parentType, 'assign')) {
      // If the parent class or its ancestor classes has an `assign()` method,
      // call the `assign()` method of the parent class.
      parentType.prototype.assign.call(target, source, options);
      // then exclude fields owned by the parent class
      const parentInstance = getDefaultInstance(parentType);
      const parentFields = Object.keys(parentInstance);
      return fields.filter((f) => !parentFields.includes(f));
    } else {
      return fields;
    }
  },

  /**
   * Copies all configurable, enumerable, and non-read-only properties of the
   * source object to the target object without naming conversion.
   *
   * @param {object} target
   *     The target object.
   * @param {object} source
   *     The source object, which may be `null` or `undefined`.
   * @author Haixing Hu
   * @private
   */
  copyAllPropertiesWithoutNamingConversion(target, source) {
    if (isUndefinedOrNull(source)) {
      return;
    }
    Object.keys(target).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = clone(source[key], CLONE_OPTIONS);
      }
    });
  },

  /**
   * Clones an enumeration value.
   *
   * @param {string|any} source
   *    The source value being cloned.
   * @param {string} path
   *    The path of the target value in the property tree of the original root.
   * @param {Function} type
   *    The constructor of the enumeration class of the target value. Note that
   *    this enumeration class **must** be decorated by `@Enum`.
   * @param {undefined|null|type} defaultInstance
   *    The default value of the target value. If the source value is an invalid
   *    enumeration value, this default value is used to assign the target value.
   * @return {type|*|null}
   *    The target value deeply cloned from the source value, whose type is
   *    exactly the same as the specified type.
   * @author Haixing Hu
   * @private
   */
  cloneEnumValue(source, { path, type, defaultInstance }) {
    if (source === null || source === undefined) {
      return null;
    } else if (typeof source === 'string') {
      // the blank string is treated as null enumerator
      if (source.trim().length === 0) {
        return null;
      }
      // convert the string representation to the enumerator
      const e = ofValueImpl(type, source);
      if (e === undefined) {
        console.error(`The value of ${path} is not a valid enumeration value:`, source);
        return defaultInstance;
      } else {
        return e;
      }
    } else if (source instanceof type) {
      return source;
    } else {
      console.error(`The value of ${path} is not a valid enumeration value:`, source);
      return defaultInstance;
    }
  },

  /**
   * Clones an object of a known type.
   *
   * @param {object} source
   *     The source object being cloned.
   * @param {string} path
   *     The path of the target object in the property tree of the original root
   *     object.
   * @param {function} type
   *     The constructor of the class of the cloned target object.
   * @param {object} defaultInstance
   *     A default instance in the class of the target object. If a certain
   *     attribute value of the target object does not exist in the source
   *     object or is null, the corresponding attribute value of this default
   *     instance is used to assign the corresponding attribute of the target
   *     object. Note that this argument may be `null` or `undefined`.
   * @param {object} options
   *     the additional options for the assignment.
   * @returns
   *     A target object deeply cloned from the source object, whose type is
   *     exactly the same as the specified type.
   * @author Haixing Hu
   * @private
   */
  cloneWithTypeInfo(source, { path, type, defaultInstance, options }) {
    if (isUndefinedOrNull(source)) {
      // If the source object is nullish, directly deep clone the default object
      // without naming conversion
      return clone(defaultInstance, CLONE_OPTIONS);
    }
    if (isBuiltInClass(type)) {
      // For JS built-in standard types, directly deep clone the source object
      // without naming conversion
      return clone(source, CLONE_OPTIONS);
    }
    const category = getClassMetadata(type, KEY_CLASS_CATEGORY);
    switch (category) {
      case 'enum':
        return this.cloneEnumValue(source, {
          path,
          type,
          defaultInstance,
        });
      case 'model':
      default: {
        // Construct a target value based on the source type
        /* eslint-disable-next-line new-cap */
        const target = new type();
        // Recursively assign each attribute value of `source` to `target`
        return this.doAssign(target, source, {
          path,
          type,
          defaultInstance,
          options,
        });
      }
    }
  },

  /**
   * Clones an array whose element types are known.
   *
   * @param {object} sourceArray
   *     The source array being cloned.
   * @param {string} path
   *     The path of the target array in the property tree of the original root
   *     object.
   * @param {function} elementType
   *     The constructor of the class of the target array elements to be cloned.
   * @param {object} defaultArray
   *     The default array, which may be `undefined` or `null`.
   * @param {object} options
   *     the additional options for the assignment.
   * @returns
   *     A target array deeply cloned from the source array, whose element type
   *     is exactly the same as the specified element type.
   * @author Haixing Hu
   * @private
   */
  cloneArrayWithElementTypeInfo(sourceArray, { path, elementType, defaultArray, options }) {
    if (!Array.isArray(sourceArray)) {
      console.error(`The value of ${path} should be an array:`, sourceArray);
      // clone the default array without naming conversion
      return clone(defaultArray, CLONE_OPTIONS);
    }
    if (isBuiltInClass(elementType)) {
      // For JS built-in standard element types, directly deep clone the array
      // without naming conversion
      return clone(sourceArray, CLONE_OPTIONS);
    }
    const elementTypeCategory = getClassMetadata(elementType, KEY_CLASS_CATEGORY);
    switch (elementTypeCategory) {
      case 'enum':
        // For enumeration classes, because enumeration types are always
        // expressed in string form, we only need to copy the source string array.
        return sourceArray.map((sourceElement, index) => this.cloneEnumValue(sourceElement, {
          path: `${path}[${index}]`,
          type: elementType,
          defaultInstance: (defaultArray ? defaultArray[index] : undefined),
        }));
      case 'model':
      default: {
        // For non-enumerated element classes, create a target array of the same
        // element type, and assign the values in the source array to the target
        // array one by one.
        const defaultElement = getDefaultInstance(elementType);
        return sourceArray.map((sourceElement, index) => {
          // Create an element from the target array
          /* eslint-disable-next-line new-cap */
          const targetElement = new elementType();
          // Recursively assign each attribute value of `sourceElement` to `targetElement`.
          // Use `defaultElement` as default instance
          const targetPath = `${path}[${index}]`;
          const defaultInstance = ((defaultArray && defaultArray[index]) ? defaultArray[index] : defaultElement);
          // Recursively assign each element of `sourceArray` to `targetArray`
          this.doAssign(targetElement, sourceElement, {
            path: targetPath,
            type: elementType,
            defaultInstance,
            options,
          });
          return targetElement;
        });
      }
    }
  },

  /**
   * Clones an object of an unknown type.
   *
   * @param {object} source
   *     The source object being cloned.
   * @param {string} path
   *     The path of the target object in the property tree of the original root
   *     object.
   * @param {object} defaultInstance
   *     A default instance in the class of the target object. If a certain
   *     attribute value of the target object does not exist in the source
   *     object or is null, the corresponding attribute value of this default
   *     instance is used to assign the corresponding attribute of the target
   *     object. Note that this argument may be `null` or `undefined`.
   * @param {object} options
   *     the additional options for the assignment.
   * @returns
   *     A target object deeply cloned from the source object, whose type is
   *     exactly the same as the default object.
   * @author Haixing Hu
   * @private
   */
  cloneWithoutTypeInfo(source, { path, defaultInstance, options }) {
    // If the default instance is nullish, directly deep clone the source object
    if (isUndefinedOrNull(defaultInstance)) {
      // clone the source with naming conversion options
      return clone(source, {
        ...CLONE_OPTIONS,
        convertNaming: options.convertNaming,
        sourceNamingStyle: options.sourceNamingStyle,
        targetNamingStyle: options.targetNamingStyle,
      });
    }
    // If the property value of the target object is an object, we must create
    // an object of the same prototype and copy the property values of the
    // source object
    const Class = Object.getPrototypeOf(defaultInstance).constructor;
    const target = new Class();
    // Recursively assign each attribute value of `source` to `target`
    return this.doAssign(target, source, {
      path,
      type: Class,
      defaultInstance,
      options,
    });
  },

  /**
   * Clones an array whose element type is unknown.
   *
   * @param {array} sourceArray
   *     The source array being cloned.
   * @param {string} path
   *     The path of the target array in the property tree of the original root
   *     object.
   * @param {array} defaultArray
   *     The default array, which may be `undefined` or `null`.
   * @param {object} options
   *     the additional options for the assignment.
   * @returns
   *     A target array deeply cloned from the source array, whose element type
   *     is exactly the same as the element type of the default array.
   * @author Haixing Hu
   * @private
   */
  cloneArrayWithoutElementTypeInfo(sourceArray, { path, defaultArray, options }) {
    // TODO: If there is type information in its default field value, we can
    //  construct an array of the same type based on the type information in
    //  the default field value.
    if (Array.isArray(sourceArray)) {
      // clone the source array with naming conversion options
      return clone(sourceArray, {
        ...CLONE_OPTIONS,
        convertNaming: options.convertNaming,
        sourceNamingStyle: options.sourceNamingStyle,
        targetNamingStyle: options.targetNamingStyle,
      });
    } else {
      console.error(`The value of ${path} should be an array:`, sourceArray);
      // clone the default array without naming conversion
      return clone(defaultArray, CLONE_OPTIONS);
    }
  },

  /**
   * Copies all properties of a source object to a target object.
   *
   * @param {object} target
   *     The target object to be assigned to.
   * @param {object} source
   *     The source object to be assigned from, which can be `null` or `undefined`,
   *     or a plain old JavaScript object without class information.
   * @param {string} path
   *     The path of the target object in the property tree of the original root
   *     object.
   * @param {function} type
   *     The type of the target object, i.e., the constructor of the class of
   *     the target object.
   * @param {object} defaultInstance
   *     A default instance in the class of the target object. If a certain
   *     attribute value of the target object does not exist in the source
   *     object or is null, the corresponding attribute value of this default
   *     instance is used to assign the corresponding attribute of the target
   *     object. Note that this argument may be `null` or `undefined`.
   * @param {object} options
   *     the additional options for the assignment.
   * @returns
   *     The target object after assignment.
   * @author Haixing Hu
   * @private
   */
  doAssign(target, source, { path, type, defaultInstance, options }) {
    if (isUndefinedOrNull(source)) {
      // if source is nullish, assign the default object to the target object
      this.copyAllPropertiesWithoutNamingConversion(target, defaultInstance);
    } else {
      // Loops over all enumerable properties of the default instance,
      // excluding those inherited from the parent class
      const metadata = ClassMetadataCache.get(type);
      const theDefaultInstance = defaultInstance ?? {}; // defaultInstance may be null or undefined
      const targetKeys = this.getAllFields(target, source, { type, options });
      targetKeys.forEach((targetKey) => {
        const defaultFieldValue = theDefaultInstance[targetKey];
        const fieldPath = `${path}.${targetKey}`;
        const sourceKey = getSourceKey(targetKey, options);
        const sourceFieldValue = source[sourceKey];
        // If field of the target object is annotated with `@Type`, get the annotated type
        const annotatedFieldType = getFieldMetadata(metadata, targetKey, KEY_FIELD_TYPE);
        // If field of the target object is annotated with `@ElementType`, get the annotated element type
        const annotatedFieldElementType = getFieldMetadata(metadata, targetKey, KEY_FIELD_ELEMENT_TYPE);
        if (isUndefinedOrNull(sourceFieldValue)) {
          // If the source object field value is nullish, copy the default field
          // value directly.
          target[targetKey] = clone(defaultFieldValue, CLONE_OPTIONS);
        } else if (annotatedFieldType) {
          // If the field of the target object is annotated with `@Type`
          target[targetKey] = this.cloneWithTypeInfo(sourceFieldValue, {
            path: fieldPath,
            type: annotatedFieldType,
            defaultInstance: defaultFieldValue,
            options,
          });
        } else if (annotatedFieldElementType) {
          // If the field of the target object is annotated with `@ElementType`
          target[targetKey] = this.cloneArrayWithElementTypeInfo(sourceFieldValue, {
            path: fieldPath,
            elementType: annotatedFieldElementType,
            defaultArray: defaultFieldValue,
            options,
          });
        } else if (isUndefinedOrNull(defaultFieldValue)) {
          // If the field value of the default instance is nullish, but the
          // source object field value is not nullish, and the field is not
          // decorated with `@Type`, it is impossible to determine the type of
          // the attribute, therefore we directly clone the source object field
          // value.
          console.warn(`There is no type information for the field ${fieldPath}.`);
          // clone the source field value with the naming conversion options
          target[targetKey] = clone(sourceFieldValue, {
            ...CLONE_OPTIONS,
            convertNaming: options.convertNaming,
            sourceNamingStyle: options.sourceNamingStyle,
            targetNamingStyle: options.targetNamingStyle,
          });
        } else if (Array.isArray(defaultFieldValue)) {
          // If the field value of the target object is an array but has not
          // been annotated with `@ElementType`
          console.warn(`There is no element type information for the array field ${fieldPath}.`);
          target[targetKey] = this.cloneArrayWithoutElementTypeInfo(sourceFieldValue, {
            path: fieldPath,
            defaultArray: defaultFieldValue,
            options,
          });
        } else if ((typeof defaultFieldValue) === 'object') {
          // If the property value of the target object is a non-null and
          // non-array object, we must create an object of the same prototype
          // and copy the property value of the source object
          target[targetKey] = this.cloneWithoutTypeInfo(sourceFieldValue, {
            path: fieldPath,
            defaultInstance: defaultFieldValue,
            options,
          });
        } else {
          // If the attribute value of the target object is not an object,
          // directly clone the attribute value of the source object and assign
          // it to the target object.
          target[targetKey] = clone(sourceFieldValue, {
            ...CLONE_OPTIONS,
            convertNaming: options.convertNaming,
            sourceNamingStyle: options.sourceNamingStyle,
            targetNamingStyle: options.targetNamingStyle,
          });
        }
      });
    }
    if (options.normalize) {
      return defaultNormalizer(target);
    } else {
      return target;
    }
  },
};

/**
 * Assigns the specified source object to the specified target object.
 *
 * @param {function} Class
 *     The constructor of the class of the target object.
 * @param {object} target
 *     The target object which will be assigned to. This object must be an
 *     instance of the specified `Class`. Each fields of this object will be
 *     assigned from the corresponding fields of the source object, recursively.
 * @param {object} source
 *     The source object which will be assigned from. This object may be any
 *     plain old JavaScript object without class information.
 * @param {object} options
 *     the additional options for the assignment. If this argument is
 *     `undefined` or `null`, the default options will be used. The default
 *     options can be retrieved by calling `DefaultOptions.get('assign')`.
 *     Available options are:
 *     - `normalize: boolean`, indicates whether to normalize this object
 *       after the assignment. The default value is `true`.
 *     - `convertNaming: boolean`, indicates whether to convert the naming
 *       style of the target object. The default value is `false`.
 *     - `sourceNamingStyle: NamingStyle`, the naming style of the source
 *       object. The default value is {@link LOWER_UNDERSCORE}.
 *     - `targetNamingStyle: NamingStyle`, the naming style of the target
 *       object. The default value is {@link LOWER_CAMEL}.
 * @return {Class}
 *     The target object after assignment.
 * @author Haixing Hu
 * @private
 */
function assignImpl(Class, target, source, options) {
  const defaultInstance = getDefaultInstance(Class);
  let opt;
  if (options === undefined || options === null) {
    opt = { ...DefaultOptions.get('assign') };
  } else {
    // merge the default options with the specified options
    opt = { ...DefaultOptions.get('assign'), ...options };
  }
  return Impl.doAssign(target, source, {
    path: Class.name,
    type: Class,
    defaultInstance,
    options: opt,
  });
}

export default assignImpl;
