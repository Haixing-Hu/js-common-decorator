////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { trimUppercaseString } from '@qubit-ltd/common-util';
import { defaultNormalizer } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_NORMALIZER } from '../src/impl/metadata-keys';
import getFieldMetadata from '../src/impl/utils/get-field-metadata';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import NonDecoratedClass from './model/non-decorated-class';
import ObjWithArrayField from './model/obj-with-array-field';
import ObjWithDefaultNormalizerField from './model/obj-with-default-normalizer-field';

/**
 * Unit test of the `defaultNormalizer()` function.
 *
 * @author Haixing Hu
 */
describe('Test defaultNormalizer() function', () => {
  test('should return undefined and null as-is', () => {
    expect(defaultNormalizer(undefined)).toBeUndefined();
    expect(defaultNormalizer(null)).toBeNull();
  });
  test('should trim and return strings', () => {
    expect(defaultNormalizer('  Hello World  ')).toBe('Hello World');
  });
  test('should return non-string primitives as-is', () => {
    expect(defaultNormalizer(true)).toBe(true);
    expect(defaultNormalizer(123)).toBe(123);
    expect(defaultNormalizer(123n)).toBe(123n);
    expect(defaultNormalizer(Symbol.for('symbol'))).toBe(Symbol.for('symbol'));
    const testFunction = () => {};
    expect(defaultNormalizer(testFunction)).toBe(testFunction);
  });
  test('should return built-in class as-is', () => {
    const date = new Date();
    expect(defaultNormalizer(date)).toBe(date);
    const error = new Error();
    expect(defaultNormalizer(error)).toBe(error);
    const regex = /^.*$/;
    expect(defaultNormalizer(regex)).toBe(regex);
    // eslint-disable-next-line no-undef
    expect(defaultNormalizer(arguments)).toBe(arguments);
  });
  test('should normalize standard arrays', () => {
    expect(defaultNormalizer([' foo ', ' bar '])).toEqual(['foo', 'bar']);
  });
  // Additional tests for typed arrays can be added here
  test('should normalize Sets', () => {
    const set = new Set([' foo ', ' bar ']);
    const normalizedSet = defaultNormalizer(set);
    expect(Array.from(normalizedSet)).toEqual(['foo', 'bar']);
  });
  test('should normalize Maps', () => {
    const map = new Map([['key1', ' foo '], ['key2', ' bar ']]);
    const normalizedMap = defaultNormalizer(map);
    expect(Array.from(normalizedMap.values())).toEqual(['foo', 'bar']);
  });
  test('should return non-built-in objects as-is', () => {
    const obj = { a: 1 };
    expect(defaultNormalizer(obj)).toBe(obj);
  });
  test('should call and use normalize method if available', () => {
    const objWithNormalize = {
      message: ' hello world ',
      normalize() {
        this.message = this.message.trim();
        return this;
      },
    };
    const normalized = defaultNormalizer(objWithNormalize);
    expect(normalized.message).toBe('hello world');
  });
  // test('should handle nested collections and objects', () => {
  //   const complexObject = {
  //     array: [' foo ', ' bar '],
  //     set: new Set([' baz ', ' qux ']),
  //     object: {
  //       message: ' hello world ',
  //       normalize() {
  //         this.message = this.message.trim();
  //         return this;
  //       }
  //     },
  //   };
  //   const normalized = defaultNormalizer(complexObject);
  //   expect(normalized.array).toEqual(['foo', 'bar']);
  //   expect(Array.from(normalized.set)).toEqual(['baz', 'qux']);
  //   expect(normalized.object.message).toBe('hello world');
  // });

  test('Test the metadata of the ObjWithDefaultNormalizerField class', () => {
    const metadata = classMetadataCache.get(ObjWithDefaultNormalizerField);
    const v1 = getFieldMetadata(metadata, 'number', KEY_FIELD_NORMALIZER);
    expect(v1).toBe(trimUppercaseString);
    const v2 = getFieldMetadata(metadata, 'type', KEY_FIELD_NORMALIZER);
    expect(v2).toBe(defaultNormalizer);
    const v3 = getFieldMetadata(metadata, 'nonNormalizable', KEY_FIELD_NORMALIZER);
    expect(v3).toBeUndefined();
    const v4 = getFieldMetadata(metadata, 'credential', KEY_FIELD_NORMALIZER);
    expect(v4).toBe(defaultNormalizer);
    const v5 = getFieldMetadata(metadata, 'noNormalizeField', KEY_FIELD_NORMALIZER);
    expect(v5).toBe(defaultNormalizer);
    const v6 = getFieldMetadata(metadata, 'credentialDefaultNonNull', KEY_FIELD_NORMALIZER);
    expect(v6).toBe(defaultNormalizer);
  });
  test('Test ObjWithDefaultNormalizerField.normalize()', () => {
    const data = {
      number: ' 111xyz  ',
      type: 'IDENTITY_CARD',
      nonNormalizable: ' 111xyz  ',
      credential: {
        type: 'IDENTITY_CARD',
        number: ' 123xxx',
      },
      noNormalizeField: {
        value: '  xxx ',
      },
      credentialDefaultNonNull: {
        type: 'PASSPORT',
        number: ' 123xxx',
      },
    };
    const obj = new ObjWithDefaultNormalizerField();
    obj.assign(data, { normalize: false });
    data.type = CredentialType.IDENTITY_CARD;
    data.credential.type = CredentialType.IDENTITY_CARD;
    data.credentialDefaultNonNull.type = CredentialType.PASSPORT;
    expect(obj).toEqual(data);
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
    expect(obj.credential).toBeInstanceOf(Credential);
    expect(obj.credential.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credential.number).toBe('123XXX');
    expect(obj.noNormalizeField).toBeInstanceOf(NonDecoratedClass);
    expect(obj.noNormalizeField.value).toBe('  xxx ');
    expect(obj.credentialDefaultNonNull).toBeInstanceOf(Credential);
    expect(obj.credentialDefaultNonNull.type).toBe(CredentialType.PASSPORT);
    expect(obj.credentialDefaultNonNull.number).toBe('123XXX');

    obj.credential = null;
    obj.credentialDefaultNonNull = null;
    obj.normalize();
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
    expect(obj.credential).toBeNull();
    expect(obj.noNormalizeField).toBeInstanceOf(NonDecoratedClass);
    expect(obj.noNormalizeField.value).toBe('  xxx ');
    expect(obj.credentialDefaultNonNull).toBeNull();
  });
  test('Test whether defaultNormalizer takes effect on array fields', () => {
    const obj = new ObjWithArrayField();
    obj.normalize();
    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(2);
    expect(obj.credentials[0]).toBeInstanceOf(Credential);
    expect(obj.credentials[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentials[0].number).toBe('12345678');
    expect(obj.credentials[1]).toBeInstanceOf(Credential);
    expect(obj.credentials[1].type).toBe(CredentialType.PASSPORT);
    expect(obj.credentials[1].number).toBe('ABCDEFGH');
  });

  test('Test defaultNormalizer takes effect on enum fields', () => {
    const obj = new ObjWithDefaultNormalizerField();
    obj.type = 'identity_card ';
    obj.number = '  abcdefg  ';
    obj.normalize();
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.number).toBe('ABCDEFG');
  });

  test('Test defaultNormalizer takes effect on nested enum fields', () => {
    const obj = new ObjWithDefaultNormalizerField();
    obj.type = 'identity_card ';
    obj.number = '  abcdefg  ';
    obj.credential = new Credential();
    obj.credential.type = 'identity_card ';
    obj.credential.number = '  abcdefg  ';
    obj.normalize();
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.number).toBe('ABCDEFG');
    expect(obj.credential.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credential.number).toBe('ABCDEFG');
  });
});
