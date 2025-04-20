////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates an initializer function that immediately sets the field to read-only.
 *
 * @param {string|symbol} propertyName
 *   the name of the property
 * @param {*} initialValue
 *   the initial value of the property
 * @returns {Function}
 *   the initializer function
 */
export function createImmediateReadonlyInitializer(propertyName, initialValue) {
  return function immediateReadonlyInitializer() {
    Object.defineProperty(this, propertyName, {
      value: initialValue,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  };
}

/**
 * Creates an initializer function that sets the field to read-only after the
 * first assignment of any value.
 *
 * @param {string|symbol} propertyName
 *   the name of the property
 * @returns {Function}
 *   the initializer function
 */
export function createDeferredReadonlyInitializer(propertyName) {
  return function deferredReadonlyInitializer() {
    let fieldValue;
    // Define the property with a custom getter and setter
    // The setter will be called only once - on the first assignment
    // After that, it replaces itself with a non-writable data property
    Object.defineProperty(this, propertyName, {
      configurable: true,
      enumerable: true,
      get() {
        return fieldValue;
      },
      set(newValue) {
        // Store the value being assigned
        fieldValue = newValue;
        // Immediately redefine the property as read-only
        // This replaces the current property descriptor (including this setter)
        // with a non-writable data property
        Object.defineProperty(this, propertyName, {
          value: newValue,
          writable: false,
          configurable: false,
          enumerable: true,
        });
        // After this point, the JavaScript engine itself will prevent any
        // further assignments to this property, and this setter will never
        // be called again
      },
    });
  };
}

/**
 * Decorates a class field to mark it as read-only.
 *
 * The decorated target must be a class field. This decorator does not support
 * decorating classes, methods, getters, setters, or accessors.
 *
 * The behavior of this decorator follows these rules:
 * 1. If the field has a non-undefined initial value when defined, it becomes immediately read-only.
 * 2. If the field has no initial value or is undefined, it will become read-only after the first
 *    assignment of any value (including undefined).
 *
 * ##### Usage examples:
 *
 * ```js
 * class Meal {
 *   // Field with initial value - immediately read-only
 *   @Readonly
 *   entree = 'steak';
 *
 *   // Field without initial value - will be read-only after first assignment
 *   @Readonly
 *   dessert;
 * }
 *
 * const dinner = new Meal();
 *
 * // This will throw an error since entree is already read-only:
 * // dinner.entree = 'salmon';
 *
 * // This works - first assignment to dessert:
 * dinner.dessert = 'cake';
 *
 * // This will throw an error - second assignment to dessert:
 * // dinner.dessert = 'ice cream';
 *
 * // Alternatively, the first assignment could be undefined:
 * const lunch = new Meal();
 * lunch.dessert = undefined;  // This is allowed (first assignment)
 * // lunch.dessert = 'salad'; // This will throw an error (second assignment)
 * ```
 *
 * ## Compatibility Note
 *
 * This decorator **only** supports the ECMAScript decorators specification from Stage 3
 * proposal that was accepted in November 2023 or later. It is incompatible with:
 *
 * - Legacy experimental decorators (TypeScript's `experimentalDecorators` option)
 * - Earlier Stage 2 decorator proposals
 * - Any decorator implementations before November 2023
 *
 * Ensure your environment supports the latest ECMAScript 2023+ decorators specification.
 *
 * @param {*} value
 *    The value of the decorated element (for field decorators, this value is
 *    always `undefined`)
 * @param {object} context
 *    The decorator context object with properties:
 *    - kind: "field"
 *    - name: the name of the field (string | symbol)
 *    - access: { get(): unknown, set(value: unknown): void }
 *    - static: boolean
 *    - private: boolean
 *    - addInitializer(initializer: () => void): void
 * @returns
 *    returns a function that initializes the initial value of the decorated field.
 * @throws {Error}
 *    If the decorator is applied to anything other than a class field.
 * @author Haixing Hu
 */
export function Readonly(value, context) {
  // check if the decorator is applied to a class field
  if (context.kind !== 'field') {
    throw new Error('@Readonly can only be applied to class fields.');
  }
  // store the initial value
  let initialFieldValue;
  // add an initializer that determines which strategy to use based on initialFieldValue
  context.addInitializer(function initializer() {
    if (initialFieldValue !== undefined) {
      // If the field has an initial value, use createImmediateReadonlyInitializer
      createImmediateReadonlyInitializer(context.name, initialFieldValue).call(this);
    } else {
      // If the field has no initial value, use createDeferredReadonlyInitializer
      createDeferredReadonlyInitializer(context.name).call(this);
    }
  });
  // Return the initializer function which will receive the field's initial value
  return function initializer(initialValue) {
    // Store the initial value directly
    initialFieldValue = initialValue;
    return initialValue;
  };
}

export default Readonly;
