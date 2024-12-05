////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { KEY_FIELD_VALIDATOR } from './impl/metadata-keys';
import setFieldMetadata from './impl/utils/set-field-metadata';
import isDecoratorContext from './impl/utils/is-decorator-context';
import defaultValidator from './default-validator';

/**
 * Sets the validator of a decorated field.
 *
 * @param {undefined} field
 *     The decorated target. In the case of decorating a class field, this
 *     argument is always `undefined` and is ignored.
 * @param {object} metadata
 *     The metadata in the context of the decorated target.
 * @param {string} kind
 *     The kind of the decorated target.
 * @param {string} name
 *     The name of the decorated target.
 * @param {function} validator
 *     The validator to set.
 * @author Haixing Hu
 * @private
 */
function setValidator(field, { metadata, kind, name }, validator) {
  if (kind !== 'field') {
    throw new SyntaxError(`The @Validatable must decorate a class field: ${name}`);
  }
  if (typeof validator !== 'function') {
    throw new TypeError(`The argument of @Validatable decorated on the "${name}" field must be a function, but it is a ${typeof validator}.`);
  }
  setFieldMetadata(metadata, name, KEY_FIELD_VALIDATOR, validator);
}

/**
 * Decorates a class field to specify a verification function for it.
 *
 * The decorated target must be a field of a class.
 *
 * ##### Usage example:
 *
 * ```js
 * class Foo {
 *   &#064;Validatable(validateNameField)
 *   &#064;Label('Name', 'i18n.field.name')
 *   name = '';
 *
 *   &#064;Validatable(validateIntegerField)
 *   &#064;Label('Number', 'i18n.field.number')
 *   number = 0;
 *
 *   &#064;Validatable(validateIntegerField)
 *   &#064;Label('Series', 'i18n.field.series')
 *   &#064;ElementType(Number)
 *   series = [12, 13, 14];
 *
 *   &#064;Validatable
 *   bar = new Bar();
 * }
 * ```
 *
 * The verification function in the above example is roughly implemented as
 * follows:
 * ```js
 * function validateNameField(value, context) {
 *   if (NAME_PATTERN.test(value)) {
 *     return new ValidationResult(true);
 *   } else {
 *     return new ValidationResult(false, `Please enter the correct ${context.label}`);
 *   }
 * }
 *
 * function validateIntegerField(value, context) {
 *   if ((typeof value === 'number') && Number.isInteger(value)) {
 *     return new ValidationResult(true);
 *   } else if ((typeof value === 'string') && /^\s*[+-]?\d+\s*$/.test(value)) {
 *     return new ValidationResult(true);
 *   }
 *   return new ValidationResult(false, `${context.label} must be an integer`);
 * }
 * ```
 *
 * The parameter of this decorator is a verification function, which should have
 * the following form:
 * ```js
 * function validate(value, context) {
 *   ...
 *   return new ValidationResult(true);
 * }
 * ```
 * Where
 * - The parameter `value` is the field value to be verified;
 * - The parameter `context` is an `Object`, representing the validation context.
 *   It may have the following properties:
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
 * - The return value of the function must be a `ValidationResult` object,
 *   representing the verification result.
 *
 * @param {...any} args
 *     The array of arguments for calling this decorator. If it has only one
 *     argument, the only argument is the specified validator of this
 *     decorator, and this function should return another function which is the
 *     decorator of a class; If it has two arguments, the first argument is the
 *     decorated target (in the case of decorating a class field, this argument
 *     should always be `undefined`), and the second argument is the context
 *     object containing information about the decorated target.
 * @return {Function|undefined}
 *     If this function has only one argument, this function returns another
 *     function which is the decorator of a field; otherwise, this function
 *     sets the normalizer of the decorated field and returns nothing.
 * @author Haixing Hu
 * @see defaultValidator
 * @see Model
 */
function Validatable(...args) {
  if (args.length === 1) {
    return (field, context) => setValidator(field, context, args[0]);
  } else if ((args.length === 2) && isDecoratorContext(args[1])) {
    setValidator(args[0], args[1], defaultValidator);
  } else {
    throw new SyntaxError('Invalid use of @Validatable decorator.');
  }
}

export default Validatable;
