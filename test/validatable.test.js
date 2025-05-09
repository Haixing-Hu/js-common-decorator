////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@qubit-ltd/common-validation-rule';
import { Model, Validatable } from '../src';
import defaultValidator from '../src/default-validator';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_VALIDATOR } from '../src/impl/metadata-keys';
import getFieldMetadata from '../src/impl/utils/get-field-metadata';

/**
 * Unit test `@Validatable` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @Validatable', () => {
  test('@Validatable without argument', () => {
    @Model
    class Foo {
      @Validatable
      name = '';

      hello() {
        console.log(`Hello, ${this.name}`);
      }
    }
    const metadata = classMetadataCache.get(Foo);
    const validator = getFieldMetadata(metadata, 'name', KEY_FIELD_VALIDATOR);
    expect(validator).toBe(defaultValidator);
  });
  test('@Validatable with argument', () => {
    function nameValidator(value) {
      if (value && value.length > 0) {
        return new ValidationResult(true);
      } else {
        return new ValidationResult(false, 'invalid name');
      }
    }
    @Model
    class Foo {
      @Validatable(nameValidator)
      name = '';

      hello() {
        console.log(`Hello, ${this.name}`);
      }
    }
    const metadata = classMetadataCache.get(Foo);
    const validator = getFieldMetadata(metadata, 'name', KEY_FIELD_VALIDATOR);
    expect(validator).toBe(nameValidator);
  });
  test('The @Validatable is not decorated a class field', () => {
    expect(() => {
      @Model
      class Obj {
        @Validatable
        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(
      SyntaxError,
      'The @Validatable must decorate a class field: hello',
    );
  });
  test('The argument of @Validatable is not a function', () => {
    expect(() => {
      @Model
      class Obj {
        @Validatable('xxx')
        number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(
      TypeError,
      'The argument of @Validatable decorated on the "number" field must be a function, but it is a string.',
    );
  });
  test('Invalid number of arguments of @Validatable', () => {
    expect(() => {
      @Model
      class Obj {
        @Validatable(defaultValidator, {})
        number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(SyntaxError, 'Invalid use of @Validatable decorator.');
  });
});
