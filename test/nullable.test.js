////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Nullable } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_NULLABLE } from '../src/impl/metadata-keys';
import { getFieldMetadata } from '../src/impl/utils';
import ObjWithNullableField from './model/obj-with-nullable-field';

/**
 * Unit test of the `@Nullable` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @Nullable', () => {
  test('Check the field metadata of @Nullable decorated fields', () => {
    const metadata = classMetadataCache.get(ObjWithNullableField);
    expect(metadata).not.toBeNull();
    console.log('ObjWithNullableField.metadata = ', metadata);
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
    }).toThrowWithMessage(SyntaxError, 'The decorator @Nullable can only decorate a class field: bar');
  });
});
