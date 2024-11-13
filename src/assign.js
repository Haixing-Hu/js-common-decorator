////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import assignImpl from './impl/model/assign-impl';

/**
 * Copies the properties from a source data object to the target object, only
 * copying properties defined in the class of the target object.
 *
 * If a property in the data object is `undefined` or `null`, the function
 * sets the property of the target object to the default value.
 *
 * Note that the data object may have a different prototype than the target object.
 *
 * @param {object} target
 *     The target object which will be assigned to. This object must be an
 *     instance of the specified `Class`. Each fields of this object will be
 *     assigned from the corresponding fields of the source object, recursively.
 * @param {object} source
 *     The source object which will be assigned from. This object may be any
 *     plain old JavaScript object without class information.
 * @param {null|undefined|object} options
 *     the optional options for the assignment. If this argument is `undefined`
 *     or `null`, the default options will be used. The default options can be
 *     retrieved by calling `DefaultOptions.get('assign')`.
 *     Available options are:
 *  - `normalize: boolean`, indicates whether to normalize this object
 *     after the assignment. The default value is `true`.
 *  - `convertNaming: boolean`, indicates whether to convert the naming
 *     style of the target object. The default value is `false`.
 *  - `sourceNamingStyle: string | NamingStyle`, the naming style of the
 *     source object, i.e., the first argument of the `assign()` method.
 *     The default value of this argument is {@link LOWER_UNDERSCORE}.
 *  - `targetNamingStyle: string | NamingStyle`, the naming style of the
 *     target object, i.e., the object calling the `assign()` method. The
 *     default value of this argument is {@link LOWER_CAMEL}.
 *  - `types: object`, the additional information about types of
 *     fields of classes. The keys of this object are the path of the fields
 *     or sub-fields of the target object, the values are the type of the
 *     fields, represented as the constructor function of the type.
 *     The default value is `{}`.
 *  - `elementTypes: object`, the additional information about types of
 *     elements of fields of classes. The keys of this object are the path of
 *     the fields or sub-fields of the target object, the values are the type
 *     of the elements, represented as the constructor function of the type.
 *     The default value is `{}`.
 * @return {Class}
 *     The target object after assignment.
 * @see DefaultOptions.get('assign')
 * @author Haixing Hu
 */
function assign(target, source, options = undefined) {
  if (typeof target !== 'object') {
    throw new TypeError('The target object must be an object.');
  }
  const Class = target.constructor;
  return assignImpl(Class, target, source, options);
}

export default assign;
