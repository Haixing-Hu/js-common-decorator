////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getDefaultInstance from './get-default-instance';

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
function hasOwnClassField(Class, field) {
  if (!Class || !Class.prototype) {
    return false;
  }
  if (Object.prototype.hasOwnProperty.call(Class.prototype, field)) {
    return true;
  } else {
    const defaultInstance = getDefaultInstance(Class);
    return defaultInstance && Object.prototype.hasOwnProperty.call(defaultInstance, field);
  }
}

export default hasOwnClassField;
