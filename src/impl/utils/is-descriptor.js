////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * The keys of a property descriptor.
 *
 * @type {string[]}
 * @author Haixing Hu
 * @private
 */
const DESCRIPTOR_KEYS = ['value', 'initializer', 'get', 'set'];

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
function isDescriptor(desc) {
  if (!desc || (typeof desc !== 'object') || !desc.hasOwnProperty) {
    return false;
  }
  const key = DESCRIPTOR_KEYS.find((key) => Object.prototype.hasOwnProperty.call(desc, key));
  return (key !== undefined);
}

export default isDescriptor;
