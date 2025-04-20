////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isDescriptor from './is-descriptor';

/**
 * Gets the property descriptor of the decorated target.
 *
 * The purpose of this function is to unify the handling of decorators for
 * classes, methods, and fields.
 *
 * @param {function} handleDescriptor
 *     The property descriptor modification function of the decorated target.
 * @param {array} entryArgs
 *     The arguments of the decorator.
 * @returns
 *     The new property descriptor of the decorated target.
 * @author Haixing Hu
 * @private
 */
function decorate(handleDescriptor, entryArgs) {
  if ((entryArgs.length > 0) && isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return (...args) => handleDescriptor(...args, entryArgs);
  }
}

export default decorate;
