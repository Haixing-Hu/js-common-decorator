////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, NonEmpty } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_NON_EMPTY } from '../src/impl/metadata-keys';
import { getFieldMetadata } from '../src/impl/utils';

/**
 * Unit test of the `@NonEmpty` decorator.
 *
 * @author Haixing Hu
 */
describe('Test @NonEmpty', () => {
  test('Check the field metadata of @NonEmpty decorated fields', () => {
    @Model
    class Foo {
      @NonEmpty
      nonEmptyField = 'abc';

      emptyField = 'abc';

      @NonEmpty
      nonEmptyContainer = ['abc'];
    }
    const metadata = classMetadataCache.get(Foo);
    expect(metadata).not.toBeNull();
    console.log('Foo.metadata = ', metadata);
    expect(getFieldMetadata(metadata, 'nonEmptyField', KEY_FIELD_NON_EMPTY)).toBe(true);
    expect(getFieldMetadata(metadata, 'emptyField', KEY_FIELD_NON_EMPTY)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'nonEmptyContainer', KEY_FIELD_NON_EMPTY)).toBe(true);
  });
  test('@Nullable decorated non-fields', () => {
    expect(() => {
      @Model
      class Foo {
        @NonEmpty
        bar() {
          return 'abc';
        }
      }
      new Foo();
    }).toThrowWithMessage(SyntaxError,
      'The decorator @NonEmpty can only decorate a class field: bar');
  });
});
