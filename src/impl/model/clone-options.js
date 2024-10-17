////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Options used when calling the `clone()` function to copy attributes.
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

export default CLONE_OPTIONS;
