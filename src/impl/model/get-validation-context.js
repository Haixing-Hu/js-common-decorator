////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getInstanceName from '../utils/get-instance-name';
import getFieldType from '../utils/get-field-type';
import getFieldLabel from '../utils/get-field-label';
import isFieldNullable from '../utils/is-field-nullable';
import isFieldNonEmpty from '../utils/is-field-non-empty';

/**
 * Gets the validation context of the value of the specified field.
 *
 * @param {function} Class
 *     The constructor of the class of the object to be validated.
 * @param {object} metadata
 *     The metadata of the class of the object to be validated.
 * @param {object} obj
 *     The object to be validated, which must be an instance of the `Class` class.
 * @param {string} field
 *     The name of the specified field to be validated. This function assumes
 *     that the field exists and is an array, set, or map.
 * @param {object} context
 *     The current context of validation. It may have the following properties:
 *     - `instance: object`: the object to which the field belongs.
 *     - `owner: string|undefined`: the name of the owner (a person) of the field.
 *     - `field: string`: the name of the field to be validated.
 *     - `type: function`: the constructor of the field to be validated. If the
 *        field is decorated by the `@Type` decorator, this property is the
 *        argument of the decorator, otherwise it is the constructor of the
 *        default value of the field. If the default value of the field is
 *        `null` or `undefined`, this property is set to `undefined`.
 *     - `label: string`: the display label of the field to be validated.
 *     - `nullable: boolean`: whether the field to be validated is nullable.
 *     - `nonEmpty: boolean`: whether the field to be validated is non-empty.
 *     - `extraMessage: string`: extra error message.
 * @returns {object}
 *     The validation context of the value of the specified field.
 * @author Haixing Hu
 * @private
 */
function getValidationContext(Class, metadata, obj, field, context) {
  // get the name of the instance as the owner of the field
  const owner = context.owner ?? getInstanceName(metadata, obj);
  // get the element type of the field
  const type = context.type ?? getFieldType(Class, metadata, field);
  // get the label of the field
  const label = context.label ?? getFieldLabel(metadata, field);
  // get the nullable flag of the field
  const nullable = context.nullable ?? isFieldNullable(metadata, field);
  // get the non-empty flag of the field
  const nonEmpty = context.nonEmpty ?? isFieldNonEmpty(metadata, field);
  // constructs the validation context
  const ctx = {
    instance: obj,
    owner,
    field,
    type,
    label,
    nullable,
    nonEmpty,
  };
  // merge the context
  return Object.assign(ctx, context);
}

export default getValidationContext;
