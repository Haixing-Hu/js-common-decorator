////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_CLASS_NAME_FIELD } from '../metadata-keys';

/**
 * Gets the name of a instance.
 *
 * The name of an instance is the value of the field decorated by the `@NameField`
 * decorator.
 *
 * @param {object} metadata
 *     the metadata of the class.
 * @param {object} instance
 *     the instance of the class.
 * @return {string}
 *     the name of the instance, or `undefined` if the instance has no field
 *     decorated by the `@NameField` decorator.
 * @author Haixing Hu
 * @private
 */
function getInstanceName(metadata, instance) {
  const field = metadata[KEY_CLASS_NAME_FIELD];
  if (field) {
    return instance[field];
  } else {
    return undefined;
  }
}

export default getInstanceName;
