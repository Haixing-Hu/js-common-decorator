////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Label, Model, NameField } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_CLASS_NAME_FIELD } from '../src/impl/metadata-keys';

/**
 * Unit test of the `@NameField` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @NameField', () => {
  test('Check the field metadata of @NameField decorated fields', () => {
    @Model
    class Foo {
      @Label('Name')
      @NameField
      name = 'Bill Gates';

      gender = 'MALE';
    }
    const metadata = classMetadataCache.get(Foo);
    expect(metadata).not.toBeNull();
    expect(metadata[KEY_CLASS_NAME_FIELD]).toBe('name');
  });
  test('@NameField decorated non-fields', () => {
    expect(() => {
      @Model
      class Foo {
        @NameField
        bar() {
          return 'abc';
        }
      }
      new Foo();
    }).toThrowWithMessage(
      SyntaxError,
      'The decorator @NameField can only decorate a class field: bar',
    );
  });
  test('@NameField decorated on more than one fields', () => {
    expect(() => {
      @Model
      class Foo {
        @NameField
        name1 = 'Bill Gates';

        @NameField
        name2 = 'Bill Gates';
      }
      new Foo();
    }).toThrowWithMessage(
      SyntaxError,
      '@NameField cannot decorate on "name2", since it has already decorated on "name1".',
    );
  });
});
