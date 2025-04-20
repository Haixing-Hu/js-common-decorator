////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Nullable } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_NULLABLE } from '../src/impl/metadata-keys';
import getFieldMetadata from '../src/impl/utils/get-field-metadata';

/**
 * Unit test of the `@Nullable` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @Nullable', () => {
  test('Check the field metadata of @Nullable decorated fields', () => {
    @Model
    class Foo {
      @Nullable
      nullableField = null;

      nonNullableField = 'abc';

      @Nullable
      nullableWithDefaultValue = 'abc';
    }
    const metadata = classMetadataCache.get(Foo);
    expect(metadata).not.toBeNull();
    console.log('Foo.metadata = ', metadata);
    expect(getFieldMetadata(metadata, 'nullableField', KEY_FIELD_NULLABLE)).toBe(true);
    expect(getFieldMetadata(metadata, 'nonNullableField', KEY_FIELD_NULLABLE)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'nullableWithDefaultValue', KEY_FIELD_NULLABLE)).toBe(true);
  });
  test('@Nullable decorated non-fields', () => {
    expect(() => {
      @Model
      class Foo {
        @Nullable
        bar() {
          return 'abc';
        }
      }
      new Foo();
    }).toThrowWithMessage(SyntaxError,
      'The decorator @Nullable can only decorate a class field: bar');
  });
});
