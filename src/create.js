////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import createImpl from './impl/model/create-impl';

/**
 * Creates a new instance of the specified class based on a data object.
 *
 * It copies the property values from the corresponding properties of the
 * specified data object maintaining the same prototype and class definition.
 *
 * If a property in the data object is `undefined` or `null`, the function
 * sets the property of the created instance to the default value.
 *
 * This method is usually used to transform a plain JSON object into the
 * specified domain object.
 *
 * @param {function} Class
 *     The constructor of a class.
 * @param {object} obj
 *     The data object, usually obtained from a JSON object.
 * @param {object} options
 *     the additional options for the creation. If this argument is
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
 *     - `targetTypes: object`, the additional information about types of
 *       fields of classes. The keys of this object are the path of the fields
 *       or sub-fields of the target object, the values are the type of the
 *       fields, represented as the constructor function of the type.
 *       The default value is `{}`.
 *     - `targetElementTypes: object`, the additional information about types of
 *       elements of fields of classes. The keys of this object are the path of
 *       the fields or sub-fields of the target object, the values are the type
 *       of the elements, represented as the constructor function of the type.
 *       The default value is `{}`.
 * @returns {Class | null}
 *     If the `obj` is `undefined` or `null`, returns `null`; otherwise, returns
 *     a new instance of the model class whose fields are initialized with the
 *     data in the `obj`.
 * @see DefaultOptions.get('assign')
 * @author Haixing Hu
 */
function create(Class, obj, options = undefined) {
  return createImpl(Class, obj, options);
}

export default create;
