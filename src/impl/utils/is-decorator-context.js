////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Tests whether an object is a decorator context.
 *
 * @param {any} obj
 *     The object to be tested.
 * @returns {boolean}
 *     `true` if the specified object is a decorator context; otherwise, `false`.
 * @author Haixing Hu
 * @private
 */
function isDecoratorContext(obj) {
  return (obj !== null)
    && (typeof obj === 'object')
    && (obj.metadata !== null)
    && (typeof obj.metadata === 'object')
    && (typeof obj.kind === 'string')
    && (typeof obj.name === 'string');
}

export default isDecoratorContext;
