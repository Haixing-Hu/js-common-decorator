////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Normalizable } from '../src';
import defaultNormalizer from '../src/default-normalizer';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_NORMALIZER } from '../src/impl/metadata-keys';
import getFieldMetadata from '../src/impl/utils/get-field-metadata';

/**
 * Unit test of the `@Normalizable` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @Normalizable', () => {
  test('@Normalizable without argument', () => {
    @Model
    class Foo {
      @Normalizable
      name = '';

      hello() {
        console.log(`Hello, ${this.name}`);
      }
    }
    const metadata = classMetadataCache.get(Foo);
    const validator = getFieldMetadata(metadata, 'name', KEY_FIELD_NORMALIZER);
    expect(validator).toBe(defaultNormalizer);
  });
  test('@Normalizable with argument', () => {
    function nameValidator(value) {
      if (value && value.length > 0) {
        return value.trim();
      } else {
        return value;
      }
    }
    @Model
    class Foo {
      @Normalizable(nameValidator)
      name = '';

      hello() {
        console.log(`Hello, ${this.name}`);
      }
    }
    const metadata = classMetadataCache.get(Foo);
    const validator = getFieldMetadata(metadata, 'name', KEY_FIELD_NORMALIZER);
    expect(validator).toBe(nameValidator);
  });
  test('The @Normalizable is not decorated a class field', () => {
    expect(() => {
      @Model
      class Obj {
        @Normalizable
        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(
      SyntaxError,
      'The @Normalizable must decorate a class field: hello',
    );
  });
  test('The argument of @Normalizable is not a function', () => {
    expect(() => {
      @Model
      class Obj {
        @Normalizable('xxx')
        number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(
      TypeError,
      'The argument of @Normalizable decorated on the "number" field must be a function, but it is a string.',
    );
  });
  test('Invalid number of arguments of @Normalizable', () => {
    expect(() => {
      @Model
      class Obj {
        @Normalizable(defaultNormalizer, {})
        number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(SyntaxError, 'Invalid use of @Normalizable decorator.');
  });
});
