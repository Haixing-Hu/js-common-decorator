////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
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
function getDefaultValue(descriptor) {
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

export default getDefaultValue;
