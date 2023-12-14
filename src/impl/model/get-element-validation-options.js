////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getFieldElementType, getFieldLabel } from '../field-utils';
import { getInstanceName } from '../utils';

/**
 * Gets the validation options of elements in the specified collection field.
 *
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is an array, set, or map.
 * @param {object} config
 *     The configuration of the `@Validatable` decorator.
 * @param {object} options
 *     The options of validation.
 * @returns {object}
 *     The validation options of the elements in the specified collection field.
 */
function getElementValidationOptions(metadata, obj, field, config, options) {
  // get the element type of the field
  const elementType = options.type ?? getFieldElementType(metadata, field);
  // get the label of the field
  const label = options.label ?? getFieldLabel(metadata, field);
  // get the name of the instance
  const name = options.name ?? getInstanceName(metadata, obj);
  // constructs the validation options
  const defaultOptions = {
    instance: obj,
    field,
    type: elementType,
    label,
    name,
  };
  // combine the options
  return Object.assign(defaultOptions, config.options, options);
}

export default getElementValidationOptions;
