////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { NamingStyle } from '@haixing_hu/naming-style';

/**
 * Gets the name of the field of the source object from the corresponding field
 * of the target object.
 *
 * @param {string} targetField
 *     The key of the target object.
 * @param {object} options
 *     The options of the cloning algorithm.
 * @return {string}
 *     The corresponding key of the source object.
 * @author Haixing Hu
 * @private
 */
function getSourceField(targetField, options) {
  if (options?.convertNaming === true) {
    const sourceNamingStyle = NamingStyle.of(options.sourceNamingStyle);
    const targetNamingStyle = NamingStyle.of(options.targetNamingStyle);
    return targetNamingStyle.to(sourceNamingStyle, targetField);
  } else {
    return targetField;
  }
}

export default getSourceField;
