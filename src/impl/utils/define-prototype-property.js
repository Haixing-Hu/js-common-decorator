////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

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
function definePrototypeProperty(Class, ...properties) {
  for (const property of properties) {
    Object.defineProperty(Class.prototype, property, {
      value: '',
      configurable: false,
      enumerable: true,
      writable: true,
    });
  }
}

export default definePrototypeProperty;
