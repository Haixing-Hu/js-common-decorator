////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { setFieldMetadata } from './impl/utils';
import { KEY_FIELD_VALIDATABLE } from './impl/metadata-keys';

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
 * @param {function} validator
 *     The verification function specified to the decorated field, whose
 *     parameters was described above.
 * @param {object} options
 *     An object containing additional arguments which will be merged into the
 *     second argument of the verification function and passed to the
 *     verification function.
 * @returns {function}
 *     The field decorating function, which returns `void`.
 * @author Haixing Hu
 * @see Model
 * @see Label
 */
function Validatable(validator, options = {}) {
  return function decorate(field, { kind, name, metadata }) {
    if (kind !== 'field') {
      throw new TypeError(`The @Validatable must decorate a non-static class field: ${name}`);
    }
    if (typeof validator !== 'function') {
      throw new TypeError(
        `The first argument of @Validatable decorated on the "${name}" field must a function.`
      );
    }
    setFieldMetadata(metadata, name, KEY_FIELD_VALIDATABLE, { validator, options });
  };
}

export default Validatable;
