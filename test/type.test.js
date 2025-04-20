////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model, Type } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_TYPE } from '../src/impl/metadata-keys';
import getFieldMetadata from '../src/impl/utils/get-field-metadata';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Gender from './model/gender';
import NonDecoratedClass from './model/non-decorated-class';
import ObjWithTypeAnnotatedNullishField from './model/obj-with-type-annotated-nullish-field';

describe('Test the `@Type` annotated fields', () => {
  test('Check the field metadata of `ObjWithAnnotatedNullField`', () => {
    const metadata = classMetadataCache.get(ObjWithTypeAnnotatedNullishField);
    expect(metadata).not.toBeNull();
    console.log('ObjWithAnnotatedNullField.metadata = ', metadata);
    expect(getFieldMetadata(metadata, 'id', KEY_FIELD_TYPE)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'credential', KEY_FIELD_TYPE)).toBe(Credential);
    expect(getFieldMetadata(metadata, 'undefinedCredential', KEY_FIELD_TYPE)).toBe(Credential);
    expect(getFieldMetadata(metadata, 'nonAnnotatedCredential', KEY_FIELD_TYPE)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'nonDecoratedClass', KEY_FIELD_TYPE)).toBe(NonDecoratedClass);
    expect(getFieldMetadata(metadata, 'genderWithDefaultEmpty', KEY_FIELD_TYPE)).toBe(Gender);
    expect(getFieldMetadata(metadata, 'genderWithDefaultNull', KEY_FIELD_TYPE)).toBe(Gender);
  });
  test('Test `ObjWithAnnotatedNullField.prototype.assign()`', () => {
    const data = {
      id: 'xxx',
      credential: {
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
      },
      undefinedCredential: {
        type: 'PASSPORT',
        number: 'XXXX',
      },
      nonAnnotatedCredential: {
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
      },
      nonDecoratedClass: {
        value: 'abc',
      },
      genderWithDefaultEmpty: 'MALE',
      genderWithDefaultNull: 'FEMALE',
    };
    const obj = new ObjWithTypeAnnotatedNullishField();
    obj.assign(data);

    expect(obj.id).toBe('xxx');

    expect(obj.credential).toBeInstanceOf(Credential);
    expect(obj.credential.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credential.number).toBe('32010311110101X');

    expect(obj.undefinedCredential).toBeInstanceOf(Credential);
    expect(obj.undefinedCredential.type).toBe(CredentialType.PASSPORT);
    expect(obj.undefinedCredential.number).toBe('XXXX');

    expect(obj.nonAnnotatedCredential).toBeInstanceOf(Object);
    expect(obj.nonAnnotatedCredential.type).toBe('IDENTITY_CARD');
    expect(obj.nonAnnotatedCredential.number).toBe('32010311110101X');

    expect(obj.nonDecoratedClass).toBeInstanceOf(NonDecoratedClass);
    expect(obj.nonDecoratedClass.value).toBe('abc');

    expect(obj.genderWithDefaultEmpty).toBe(Gender.MALE);
    expect(obj.genderWithDefaultNull).toBe(Gender.FEMALE);
  });
  test('@Type decorated non-fields', () => {
    expect(() => {
      @Model
      class Foo {
        @Type(Credential)
        bar() {
          return 'abc';
        }
      }
      new Foo();
    }).toThrowWithMessage(
      SyntaxError,
      'The decorator @Type can only decorate a class field: bar',
    );
  });
  test('Argument of @Type is not a function', () => {
    expect(() => {
      @Model
      class Foo {
        @Type('Credential')
        credential = null;
      }
      new Foo();
    }).toThrowWithMessage(
      TypeError,
      'The argument of @Type decorated on "credential" must be the constructor of a class.',
    );
  });
});
