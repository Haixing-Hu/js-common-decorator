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
   * @param {boolean} normalized
   *     Whether to regularize the copied target object.
   * @returns {string[]}
   *     The names of all fields of the default instance of the target class,
   *     excluding the fields owned by the parent class of the target class if
   *     the parent class has an `assign()` method.
   * @author Haixing Hu
   * @private
   */
  getAllFields(target, source, { type, normalized }) {
    // Get all names of fields of the default object of the `type`
    const fields = Object.keys(target);
    // call the `assign()` method in the parent classes of the target class
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
   *     The source object, which may be `null` or `undefined`.
   * @author Haixing Hu
   * @private
   */
  copyAllProperties(target, source) {
    if (isUndefinedOrNull(source)) {
      return;
    }
    Object.keys(target).forEach((key) => {
      if (Object.hasOwn(source, key)) {
        target[key] = clone(source[key], CLONE_OPTIONS);
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
   * @param {object} defaultInstance
   *     A default instance in the class of the target object. If a certain
   *     attribute value of the target object does not exist in the source
   *     object or is null, the corresponding attribute value of this default
   *     instance is used to assign the corresponding attribute of the target
   *     object. Note that this argument may be `null` or `undefined`.
   * @param {boolean} normalized
   *     Whether to normalize the cloned target object.
   * @returns
   *     A target object deeply cloned from the source object, whose type is
   *     exactly the same as the default object.
   * @author Haixing Hu
   * @private
   */
  cloneWithoutTypeInfo(source, { path, defaultInstance, normalized }) {
    // If the default instance is nullish, directly deep clone the source object
    if (isUndefinedOrNull(defaultInstance)) {
      return clone(source, CLONE_OPTIONS);
    }
    // If the property value of the target object is an object, we must create
    // an object of the same prototype and copy the property values of the
    // source object
    const Class = Object.getPrototypeOf(defaultInstance).constructor;
    const target = new Class();
    // Recursively assign each attribute value of `source` to `target`
    return this.assign(target, source, {
      path,
      type: Class,
      defaultInstance,
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
   * @param {object} defaultInstance
   *     A default instance in the class of the target object. If a certain
   *     attribute value of the target object does not exist in the source
   *     object or is null, the corresponding attribute value of this default
   *     instance is used to assign the corresponding attribute of the target
   *     object. Note that this argument may be `null` or `undefined`.
   * @param {boolean} normalized
   *     Whether to normalize the cloned target object.
   * @returns
   *     A target object deeply cloned from the source object, whose type is
   *     exactly the same as the specified type.
   * @author Haixing Hu
   * @private
   */
  cloneWithTypeInfo(source, { path, type, defaultInstance, normalized }) {
    if (isBuiltInClass(type)) {
      // For JS built-in standard types, directly deep clone the source object
      return clone(source, CLONE_OPTIONS);
    }
    if (isUndefinedOrNull(source)) {
      // If the source object is nullish, directly deep clone the default object
      return clone(defaultInstance, CLONE_OPTIONS);
    }
    const category = getClassMetadata(type, KEY_CLASS_CATEGORY);
    switch (category) {
      case 'enum':
        if (typeof source === 'string') {
          if (source.trim().length === 0) {
            return null;
          }
          // convert the string representation to the enumerator
          const e = type.ofValue(source);
          if (e === undefined) {
            throw new Error(`The value of ${path} is not a valid enumeration value: ${source}`);
          }
          return e;
        } else if (source instanceof type) {
          return source;
        } else {
          throw new Error(`The value of ${path} is not a valid enumeration value: ${source}`);
        }
      case 'model':
      default: {
        // Construct a target value based on the source type
        /* eslint-disable-next-line new-cap */
        const target = new type();
        // Recursively assign each attribute value of `source` to `target`
        return this.assign(target, source, {
          path,
          type,
          defaultInstance,
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
   *     The default array, which may be `undefined` or `null`.
   * @returns
   *     A target array deeply cloned from the source array, whose element type
   *     is exactly the same as the element type of the default array.
   * @author Haixing Hu
   * @private
   */
  cloneArrayWithoutElementTypeInfo(sourceArray, { path, defaultArray }) {
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
   *     The default array, which may be `undefined` or `null`.
   * @param {boolean} normalized
   *     Whether to normalize the cloned target array.
   * @returns
   *     A target array deeply cloned from the source array, whose element type
   *     is exactly the same as the specified element type.
   * @author Haixing Hu
   * @private
   */
  cloneArrayWithElementTypeInfo(sourceArray, { path, elementType, defaultArray, normalized }) {
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
          /* eslint-disable-next-line new-cap */
          const targetElement = new elementType();
          // Recursively assign each attribute value of `sourceElement` to `targetElement`.
          // Use `defaultElement` as default instance
          const targetPath = `${path}[${index}]`;
          this.assign(targetElement, sourceElement, {
            path: targetPath,
            type: elementType,
            defaultInstance: defaultElement,
            normalized,
          });
          return targetElement;
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
   * @param {object} defaultInstance
   *     A default instance in the class of the target object. If a certain
   *     attribute value of the target object does not exist in the source
   *     object or is null, the corresponding attribute value of this default
   *     instance is used to assign the corresponding attribute of the target
   *     object. Note that this argument may be `null` or `undefined`.
   * @param {boolean} normalized
   *     Whether to normalize the copied target object.
   * @returns
   *     The target object after assignment.
   * @author Haixing Hu
   * @private
   */
  assign(target, source, { path, type, defaultInstance, normalized }) {
    // FIXME: shall we use an option to control the name convention of JSON object?
    // console.log('AssignImpl.assign: target = ', target,
    //   ', source = ', source,
    //   ', type = ', type,
    //   ', metadata = ', metadata,
    //   ', defaultInstance = ', defaultInstance,
    //   ', normalizable = ', normalizable);
    if (isUndefinedOrNull(source)) {
      // if source is nullish, assign the default object to the target object
      this.copyAllProperties(target, defaultInstance);
    } else {
      // Loops over all enumerable properties of the default instance,
      // excluding those inherited from the parent class
      const metadata = ClassMetadataCache.get(type);
      const fields = this.getAllFields(target, source, { type, normalized });
      const theDefaultInstance = defaultInstance ?? {}; // defaultInstance may be null or undefined
      fields.forEach((field) => {
        const defaultFieldValue = theDefaultInstance[field];
        const fieldPath = `${path}.${field}`;
        const sourceFieldValue = source[field];
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
          target[field] = this.cloneWithTypeInfo(sourceFieldValue, {
            path: fieldPath,
            type: annotatedFieldType,
            defaultInstance: defaultFieldValue,
            normalized,
          });
        } else if (annotatedFieldElementType) {
          // If the field of the target object is annotated with `@ElementType`
          target[field] = this.cloneArrayWithElementTypeInfo(sourceFieldValue, {
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
          target[field] = this.cloneArrayWithoutElementTypeInfo(sourceFieldValue, {
            path: fieldPath,
            defaultArray: defaultFieldValue,
          });
        } else if ((typeof defaultFieldValue) === 'object') {
          // If the property value of the target object is a non-null and
          // non-array object, we must create an object of the same prototype
          // and copy the property value of the source object
          target[field] = this.cloneWithoutTypeInfo(sourceFieldValue, {
            path: fieldPath,
            defaultInstance: defaultFieldValue,
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
      if (typeof target.normalize === 'function') {
        target.normalize();
      }
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
    defaultInstance,
    normalized,
  });
}

export default assignImpl;
