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
 * Gets the validation context of elements in the specified collection field.
 *
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is an array, set, or map.
 * @param {object} context
 *     The current context of validation.
 * @returns {object}
 *     The validation context of the elements in the specified collection field.
 * @author Haixing Hu
 * @private
 */
function getElementValidationContext(metadata, obj, field, context) {
  // get the element type of the field
  const elementType = context.type ?? getFieldElementType(metadata, field);
  // get the label of the field
  const label = context.label ?? getFieldLabel(metadata, field);
  // get the name of the instance
  const owner = context.owner ?? getInstanceName(metadata, obj);
  // constructs the validation options
  const ctx = {
    instance: obj,
    field,
    type: elementType,
    label,
    owner,
  };
  // merge the context
  return Object.assign(ctx, context);
}

export default getElementValidationContext;
