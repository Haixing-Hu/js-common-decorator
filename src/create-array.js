////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import createArrayImpl from './impl/model/create-array-impl';

/**
 * Creates a new array of instances of the specified class based on an array of
 * data objects.
 *
 * The property values of each element in the created instances array are
 * copied from the corresponding elements in the data object array,
 * maintaining the same prototype and class definition.
 *
 * This method is usually used to transform an array of plain JSON objects
 * into an array of specified domain objects.
 *
 * @param {function} Class
 *     The constructor of the specified class.
 * @param {array} array
 *     The specified array of objects.
 * @param {object} options
 *     the additional options for the creation. If this argument is
 *     `undefined` or `null`, the default options will be used. The default
 *     options can be retrieved by calling `DefaultOptions.get('assign')`.
 *     Available options are:
 *  - `normalize: boolean`, indicates whether to normalize this object
 *     after the assignment. The default value is `true`.
 *  - `convertNaming: boolean`, indicates whether to convert the naming
 *     style of the target object. The default value is `false`.
 *  - `sourceNamingStyle: NamingStyle`, the naming style of the source
 *     object. The default value is {@link LOWER_UNDERSCORE}.
 *  - `targetNamingStyle: NamingStyle`, the naming style of the target
 *     object. The default value is {@link LOWER_CAMEL}.
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
 * @return {array}
 *     A new array of instances of the specified class, or `null` if the
 *     specified array is `undefined` or `null`. Each element of the created
 *     array is an instance of the specified class, whose fields are initialized
 *     with the corresponding element of the specified object array.
 * @see DefaultOptions.get('assign')
 * @author Haixing Hu
 */
function createArray(Class, array, options = undefined) {
  return createArrayImpl(Class, array, options);
}

export default createArray;
