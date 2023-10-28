////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isUndefinedOrNull, isBuiltInClass, clone } from '@haixing_hu/common-util';
import {
  getClassMetadata,
  getFieldMetadata,
  getDefaultInstance,
  hasPrototypeFunction,
  normalize,
} from '../utils';
import {
  KEY_CLASS_CATEGORY,
  KEY_FIELD_ELEMENT_TYPE,
  KEY_FIELD_TYPE
} from '../metadata-keys';
import ClassMetadataCache from '../../class-metadata-cache';

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
   * @param {string} path
   *     The path of the target object in the property tree of the original root
   *     object.
   * @param {function} type
   *     The type of the target object, i.e., the constructor of the class of
   *     the target object.
   * @param {object} defaultObject
   *     A default object that has the same prototype as the target object.
   *     If a certain attribute value of the target object does not exist in the
   *     source object or is null, the corresponding attribute value of this
   *     default object is used to assign the corresponding attribute of the
   *     target object.
   * @param {boolean} normalized
   *     Whether to regularize the copied target object.
   * @returns {string[]}
   *     The names of all fields of the default instance of the target class,
   *     excluding the fields owned by the parent class of the target class if
   *     the parent class has an `assign()` method.
   */
  getAllFields(target, source, { type, defaultObject, normalized }) {
    // Get all names of fields of the default object of the `type`
    const fields = Object.keys(defaultObject);
    // Get its parent class of the `type`
    const parentType = Object.getPrototypeOf(type);
    if (hasPrototypeFunction(parentType, 'assign')) {
      // If the parent class or its ancestor classes has an `assign()` method,
      // call the `assign()` method of the parent class.
      parentType.prototype.assign.call(target, source, normalized);
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
   * source object to the target object.
   *
   * @param {object} target
   *     The target object.
   * @param {object} source
   *     The source object.
   * @author Haixing Hu
   * @private
   */
  copyAllProperties(target, source) {
    Object.keys(target).forEach((key) => {
      // console.log('copyAllProperties: key = ', key);
      if (Object.hasOwn(source, key)) {
        const value = source[key];
        target[key] = clone(value, CLONE_OPTIONS);
      }
    });
  },

  /**
   * Clones an object of an unknown type.
   *
   * @param {object} source
   *     The source object being cloned.
   * @param {string} path
   *     The path of the target object in the property tree of the original root
   *     object.
   * @param {object} defaultObject
   *     The default object in the class of the target object.
   * @param {boolean} normalized
   *     Whether to normalize the cloned target object.
   * @returns
   *     A target object deeply cloned from the source object, whose type is
   *     exactly the same as the default object.
   * @author Haixing Hu
   * @private
   */
  cloneObjectWithoutType(source, { path, defaultObject, normalized }) {
    // If the property value of the target object is an object, we must create
    // an object of the same prototype and copy the property values of the
    // source object
    console.assert(defaultObject !== null && defaultObject !== undefined,
        'The default object cannot be `null` nor `undefined`');
    const prototype = Object.getPrototypeOf(defaultObject);
    const targetClass = prototype.constructor;
    const target = new targetClass();
    // Recursively assign each attribute value of `source` to `target`
    return this.assign(target, source, {
      path,
      type: targetClass,
      defaultObject,
      normalized,
    });
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
   * @param {object} defaultObject
   *     The default object in the class of the cloned target object.
   * @param {boolean} normalized
   *     Whether to normalize the cloned target object.
   * @returns
   *     A target object deeply cloned from the source object, whose type is
   *     exactly the same as the specified type.
   * @author Haixing Hu
   * @private
   */
  cloneObjectWithType(source, { path, type, defaultObject, normalized }) {
    const category = getClassMetadata(type, KEY_CLASS_CATEGORY);
    switch (category) {
      case 'enum':
        // For enumeration classes, because enumeration types are always
        // expressed in string form, we only need to copy the source string.
        if (typeof source === 'string') {
          return source;
        } else {
          // The source attribute value is not a string, return the default value
          console.warn('The value of %s should be a string representation of '
              + 'the %s enumeration, but it is actually: %o', path, type.name, source);
          return defaultObject;
        }
      case 'model':
      default: {
        // Construct a target value based on the source type
        const target = new type();
        // Recursively assign each attribute value of `source` to `target`
        return this.assign(target, source, {
          path,
          type,
          defaultObject,
          normalized,
        });
      }
    }
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
   *     A default array.
   * @returns
   *     A target array deeply cloned from the source array, whose element type
   *     is exactly the same as the element type of the default array.
   * @author Haixing Hu
   * @private
   */
  cloneArrayWithoutElementType(sourceArray, { path, defaultArray }) {
    // TODO: If there is type information in its default field value, we can
    //  construct an array of the same type based on the type information in
    //  the default field value.
    if (!Array.isArray(sourceArray)) {
      console.warn('The value of %s should be an array: %o', path, sourceArray);
      return clone(defaultArray, CLONE_OPTIONS);
    }
    return clone(sourceArray, CLONE_OPTIONS);
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
   *     A default array.
   * @param {boolean} normalized
   *     Whether to normalize the cloned target array.
   * @returns
   *     A target array deeply cloned from the source array, whose element type
   *     is exactly the same as the specified element type.
   * @author Haixing Hu
   * @private
   */
  cloneArrayWithElementType(sourceArray, { path, elementType, defaultArray, normalized }) {
    if (!Array.isArray(sourceArray)) {
      console.warn('The value of %s should be an array: %o', path, sourceArray);
      return clone(defaultArray, CLONE_OPTIONS);
    }
    if (isBuiltInClass(elementType)) {
      // For JS built-in standard element types, directly deep clone the array
      return clone(sourceArray, CLONE_OPTIONS);
    }
    const elementTypeCategory = getClassMetadata(elementType, KEY_CLASS_CATEGORY);
    switch (elementTypeCategory) {
      case 'enum':
        // For enumeration classes, because enumeration types are always
        // expressed in string form, we only need to copy the source string array.
        // TODO: Tests whether `sourceArray` is full of strings or `null`.
        //  If not, `defaultArray` should be returned and a warning log should be output.
        return clone(sourceArray, CLONE_OPTIONS);
      case 'model':
      default: {
        // For non-enumerated element classes, create a target array of the same
        // element type, and assign the values in the source array to the target
        // array one by one.
        const defaultElement = getDefaultInstance(elementType);
        return sourceArray.map((sourceElement, index) => {
          // Create an element from the target array
          const targetElement = new elementType();
          // Recursively assign each attribute value of `sourceElement` to `targetElement`.
          // Use `defaultElement` as default instance
          const targetPath = `${path}[${index}]`;
          return this.assign(targetElement, sourceElement, {
            path: targetPath,
            type: elementType,
            defaultObject: defaultElement,
            normalized,
          });
        });
      }
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
   * @param {object} defaultObject
   *     A default object that has the same prototype as the target object.
   *     If a certain attribute value of the target object does not exist in the
   *     source object or is null, the corresponding attribute value of this
   *     default object is used to assign the corresponding attribute of the
   *     target object.
   * @param {boolean} normalized
   *     Whether to normalize the copied target object.
   * @returns
   *     The target object after assignment.
   * @author Haixing Hu
   * @private
   */
  assign(target, source, { path, type, defaultObject, normalized }) {
    // FIXME: shall we use an option to control the name convention of JSON object?
    // console.log('AssignImpl.assign: target = ', target,
    //   ', source = ', source,
    //   ', type = ', type,
    //   ', metadata = ', metadata,
    //   ', defaultObject = ', defaultObject,
    //   ', normalizable = ', normalizable);
    if (isUndefinedOrNull(defaultObject)) {
      throw new Error('The default object cannot be `null` nor `undefined`.');
    }
    if (isUndefinedOrNull(source)) {
      // if source is nullish, assign the default object to the target object
      this.copyAllProperties(target, defaultObject);
    } else {
      // Get all names of fields of the default instance of the current class
      const fields = this.getAllFields(target, source, {
        type,
        defaultObject,
        normalized,
      });
      const metadata = ClassMetadataCache.get(type);
      fields.forEach((field) => {
        const fieldPath = `${path}.${field}`;
        const sourceFieldValue = source[field];
        const defaultFieldValue = defaultObject[field];
        // If field of the target object is annotated with `@Type`, get the annotated type
        const annotatedFieldType = getFieldMetadata(metadata, field, KEY_FIELD_TYPE);
        // If field of the target object is annotated with `@ElementType`, get the annotated element type
        const annotatedFieldElementType = getFieldMetadata(metadata, field, KEY_FIELD_ELEMENT_TYPE);
        // console.log('field = ', field,
        //   ', fieldPath = ', fieldPath,
        //   ', sourceFieldValue = ', sourceFieldValue,
        //   ', defaultFieldValue = ', defaultFieldValue,
        //   ', fieldType = ', fieldType,
        //   ', fieldElementType = ', fieldElementType);
        if (isUndefinedOrNull(sourceFieldValue)) {
          // If the source object field value is nullish, copy the default field
          // value directly.
          target[field] = clone(defaultFieldValue, CLONE_OPTIONS);
        } else if (annotatedFieldType) {
          // If the field of the target object is annotated with `@Type`
          target[field] = this.cloneObjectWithType(sourceFieldValue, {
            path: fieldPath,
            type: annotatedFieldType,
            defaultObject: defaultFieldValue,
            normalized,
          });
        } else if (annotatedFieldElementType) {
          // If the field of the target object is annotated with `@ElementType`
          target[field] = this.cloneArrayWithElementType(sourceFieldValue, {
            path: fieldPath,
            elementType: annotatedFieldElementType,
            defaultArray: defaultFieldValue,
            normalized,
          });
        } else if (isUndefinedOrNull(defaultFieldValue)) {
          // If the field value of the default instance is nullish, but the
          // source object field value is not nullish, and the field is not
          // decorated with `@Type`, it is impossible to determine the type of
          // the attribute, therefore we directly clone the source object field
          // value.
          // TODO: shall we give a warning logging message here?
          target[field] = clone(sourceFieldValue, CLONE_OPTIONS);
        } else if (Array.isArray(defaultFieldValue)) {
          // If the field value of the target object is an array but has not
          // been annotated with `@ElementType`
          // TODO: shall we give a warning logging message here?
          target[field] = this.cloneArrayWithoutElementType(sourceFieldValue, {
            path: fieldPath,
            defaultArray: defaultFieldValue,
          });
        } else if ((typeof defaultFieldValue) === 'object') {
          // If the property value of the target object is a non-null and
          // non-array object, we must create an object of the same prototype
          // and copy the property value of the source object
          target[field] = this.cloneObjectWithoutType(sourceFieldValue, {
            path: fieldPath,
            defaultObject: defaultFieldValue,
            normalized,
          });
        } else {
          // If the attribute value of the target object is not an object,
          // directly clone the attribute value of the source object and assign
          // it to the target object.
          target[field] = clone(sourceFieldValue, CLONE_OPTIONS);
        }
      });
    }
    // console.log('AssignImpl.assign: target = ', target, ', normalized = ', normalized);
    if (normalized) {
      normalize(target);
    }
    return target;
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
 * @param {boolean} normalized
 *     Indicates whether to normalize the target object after assignment.
 * @return {Class}
 *     The target object after assignment.
 * @author Haixing Hu
 * @private
 */
function assignImpl(Class, target, source, normalized) {
  const defaultInstance = getDefaultInstance(Class);
  return Impl.assign(target, source, {
    path: Class.name,
    type: Class,
    defaultObject: defaultInstance,
    normalized,
  });
}

export default assignImpl;
