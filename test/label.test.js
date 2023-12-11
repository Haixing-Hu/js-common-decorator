////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Label } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_LABEL } from '../src/impl/metadata-keys';
import { getFieldMetadata } from '../src/impl/utils';

/**
 * Unit test of the `@Label` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @Label', () => {
  test('Check the field metadata of @Label decorated fields', () => {
    @Model
    class Foo {
      @Label('Labeled Field')
      labeledField = 'abc';

      nonLabeledField = 'def';

      @Label('Labeled Field With i18n', 'i18n.label.key')
      labeledFieldWithI18n = 'xyz';
    }
    const metadata = classMetadataCache.get(Foo);
    expect(metadata).not.toBeNull();
    console.log('Foo.metadata = ', metadata);
    expect(getFieldMetadata(metadata, 'labeledField', KEY_FIELD_LABEL))
      .toEqual({ label: 'Labeled Field', i18n: undefined });
    expect(getFieldMetadata(metadata, 'nonLabeledField', KEY_FIELD_LABEL))
      .toBeUndefined();
    expect(getFieldMetadata(metadata, 'labeledFieldWithI18n', KEY_FIELD_LABEL))
      .toEqual({ label: 'Labeled Field With i18n', i18n: 'i18n.label.key' });
  });
  test('@Nullable decorated non-fields', () => {
    expect(() => {
      @Model
      class Foo {
        @Label('bar')
        bar() {
          return 'abc';
        }
      }
      new Foo();
    }).toThrowWithMessage(
      SyntaxError,
      'The decorator @Label can only decorate a class field: bar',
    );
  });
  test('First argument of @Nullable is not a string', () => {
    expect(() => {
      @Model
      class Foo {
        @Label(123)
        bar = 'abc';
      }
      new Foo();
    }).toThrowWithMessage(
      TypeError,
      'The first argument of @Label decorated on "bar" must be a string.',
    );
  });
  test('Second argument of @Nullable is not a string', () => {
    expect(() => {
      @Model
      class Foo {
        @Label('bar', 123)
        bar = 'abc';
      }
      new Foo();
    }).toThrowWithMessage(
      TypeError,
      'The second argument of @Label decorated on "bar" must be a string.',
    );
  });
});
