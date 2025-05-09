////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isEnumClass from './is-enum-class';

/**
 * The normalizer used to normalize the value of an enumeration.
 *
 * @param {function} EnumClass
 *     The constructor function  of an enumeration class.
 * @return {function(string): EnumClass}
 *     The normalizer function for the specified enumeration class.
 */
function enumNormalizer(EnumClass) {
  if (!isEnumClass(EnumClass)) {
    throw new TypeError('The argument must be the constructor function of an '
      + 'enumeration class decorated by `@Enum`.');
  }
  return (value) => EnumClass.of(value);
}

export default enumNormalizer;
