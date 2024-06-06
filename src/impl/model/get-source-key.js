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
 * The default naming style.
 *
 * @type {Readonly<NamingStyle>}
 * @private
 */
const DEFAULT_NAMING_STYLE = NamingStyle.LOWER_CAMEL;

/**
 * Gets the naming style from the specified style.
 *
 * @param {null|undefined|string|NamingStyle} style
 *    the specified naming style.
 * @return {Readonly<NamingStyle>}
 *    the effective naming style.
 * @author Haixing Hu
 * @private
 */
function getNamingStyle(style) {
  if (style === null || style === undefined) {
    return DEFAULT_NAMING_STYLE;
  } else {
    return NamingStyle.of(style);
  }
}

/**
 * Gets the key of the source object from the corresponding key of the target
 * object.
 *
 * @param {string} targetKey
 *     The key of the target object.
 * @param {object} options
 *     The options of the cloning algorithm.
 * @return {string}
 *     The corresponding key of the source object.
 * @author Haixing Hu
 * @private
 */
function getSourceKey(targetKey, options) {
  if (options && (options.convertNaming === true)) {
    const sourceNamingStyle = getNamingStyle(options.sourceNamingStyle);
    const targetNamingStyle = getNamingStyle(options.targetNamingStyle);
    return targetNamingStyle.to(sourceNamingStyle, targetKey);
  } else {
    return targetKey;
  }
}

export default getSourceKey;
