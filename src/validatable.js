////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_VALIDATOR } from './impl/metadata-keys';
import isDecoratorContext from './impl/is-decorator-context';
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
    throw new TypeError(`The @Validatable must decorate a class field: ${name}`);
  }
  if (typeof validator !== 'function') {
    throw new TypeError(`The first argument of @Validatable decorated on the "${name}" field must a function.`);
  }
  setFieldMetadata(metadata, name, KEY_FIELD_VALIDATOR, validator);
}

/**
 * Decorates a class field to specify a verification function for it.
 *
 * The decorated target must be a field of a class.
 *
 * Usage example:
 *
 * ```js
 * class Foo {
 *   @Validatable({ validator : validateNameField })
 *   @Label('Name', 'i18n.field.name')
 *   name = '';
 *
 *   @Validatable({ validator : validateIntegerField })
 *   @Label('Number', 'i18n.field.number')
 *   number = 0;
 *
 *   @Validatable({ validator : validateArrayField, elementValidator: validateIntegerField })
 *   @Label('Series', 'i18n.field.series')
 *   @ElementType(Number)
 *   series = [12, 13, 14];
 *
 *   @Validatable
 *   bar = new Bar();
 * }
 * ```
 *
 * The verification function in the above example is roughly implemented as
 * follows:
 * ```js
 * function validateNameField(value, options) {
 *   if (NAME_PATTERN.test(value)) {
 *     return new ValidationResult(true);
 *   } else {
 *     return new ValidationResult(false, `Please enter the correct ${options.label}`);
 *   }
 * }
 *
 * function validateIntegerField(value, options) {
 *   if ((typeof value === 'number') && Number.isInteger(value)) {
 *     return new ValidationResult(true);
 *   } else if ((typeof value === 'string') && /^\s*[+-]?\d+\s*$/.test(value)) {
 *     return new ValidationResult(true);
 *   }
 *   return new ValidationResult(false, `${options.label} must be an integer`);
 * }
 * ```
 *
 * The parameter of this decorator is a verification function, which should have
 * the following form:
 * ```js
 * function validate(value, options) {
 *   ...
 *   return new ValidationResult(true);
 * }
 * ```
 * Where
 * - The parameter `value` is the field value to be verified;
 * - The parameter `options` is an `Object`, which contains at least the
 *   following properties:
 *     - `options.instance`：The object to which the field to be verified belongs;
 *     - `options.parentInstance`：Optional, indicating the parent object of the
 *        object to which the field to be verified belongs;
 *     - `options.type`：The type of the field to be verified. If the field is
 *        decorated by the `@{@link Type}` decorator, this property is a
 *        parameter of the decorator, otherwise it is `undefined`;
 *     - `options.field`：The name of the field to be verified;
 *     - `options.label`：The display name of the field to be verified.
 *       If the field is decorated with the `@{@link Label}` decorator,
 *       this property is a parameter of the decorator, otherwise it is `options.field`;
 *     - `options.nullable`：Indicates whether the field to be verified can be
 *       null. If the field is decorated with the `@{@link Nullable}` decorator,
 *       this attribute is `true`, otherwise it is `false`;
 *     - Other parameters passed through the second parameter `options` of the decorator.
 * - The return value of the function must be a `{@link ValidationResult}`
 *   object, representing the verification result.
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
    throw new TypeError('Invalid use of @Normalizable decorator.');
  }
}

export default Validatable;
