////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType, Model } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_ELEMENT_TYPE } from '../src/impl/metadata-keys';
import { getFieldMetadata } from '../src/impl/utils';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Gender from './model/gender';
import ObjWithArrayMember from './model/obj-with-array-member';
import NonDecoratedClass from './model/non-decorated-class';

describe('Test `@ElementType``', () => {
  test('Check the field metadata of `ObjWithArrayMember`', () => {
    const metadata = classMetadataCache.get(ObjWithArrayMember);
    expect(metadata).not.toBeNull();
    console.log('ObjWithArrayMember.metadata = ', metadata);
    expect(getFieldMetadata(metadata, 'id', KEY_FIELD_ELEMENT_TYPE)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'credentials', KEY_FIELD_ELEMENT_TYPE)).toBe(Credential);
    expect(getFieldMetadata(metadata, 'noTypeCredentials', KEY_FIELD_ELEMENT_TYPE)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'nonDecoratedClassArray', KEY_FIELD_ELEMENT_TYPE)).toBe(NonDecoratedClass);
    expect(getFieldMetadata(metadata, 'assignedToNonArray', KEY_FIELD_ELEMENT_TYPE)).toBeUndefined();
    expect(getFieldMetadata(metadata, 'genders', KEY_FIELD_ELEMENT_TYPE)).toBe(Gender);
    expect(getFieldMetadata(metadata, 'credentialsArrayDefaultNull', KEY_FIELD_ELEMENT_TYPE)).toBe(Credential);
    expect(getFieldMetadata(metadata, 'credentialsArrayDefaultUndefined', KEY_FIELD_ELEMENT_TYPE)).toBe(Credential);
    expect(getFieldMetadata(metadata, 'stringArray', KEY_FIELD_ELEMENT_TYPE)).toBe(String);
    expect(getFieldMetadata(metadata, 'numberArray', KEY_FIELD_ELEMENT_TYPE)).toBe(Number);
  });
  test('Test `ObjWithArrayMember.prototype.assign()`', () => {
    const data = {
      id: 'xxx',
      // genders: [ Gender.MALE, null ],
      credentials: [{
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
      }, {
        type: 'PASSPORT',
        number: 'US1234567',
      }, {
        number: '320103111101333X',
      }, null],
      noTypeCredentials: [{
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
      }, {
        type: 'PASSPORT',
        number: 'US1234567',
      }, {
        number: '320103111101333X',
      }, null],
      nonDecoratedClassArray: [{
        value: 'abc',
      }, {
        value: null,
      }, null],
      assignedToNonArray: 'xxx',
      genders: ['MALE', 'FEMALE', null],
      credentialsArrayDefaultNull: [{
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
      }, {
        type: 'PASSPORT',
        number: 'US1234567',
      }, {
        number: '320103111101333X',
      }, null],
      credentialsArrayDefaultUndefined: [{
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
      }, {
        type: 'PASSPORT',
        number: 'US1234567',
      }, {
        number: '320103111101333X',
      }, null],
      stringArray: ['abc', 'def'],
      numberArray: [123, 456],
    };
    const obj = new ObjWithArrayMember();
    obj.assign(data);

    expect(obj.id).toBe('xxx');

    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(4);
    expect(obj.credentials[0]).toBeInstanceOf(Credential);
    expect(obj.credentials[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentials[0].number).toBe('32010311110101X');
    expect(obj.credentials[1]).toBeInstanceOf(Credential);
    expect(obj.credentials[1].type).toBe(CredentialType.PASSPORT);
    expect(obj.credentials[1].number).toBe('US1234567');
    expect(obj.credentials[2]).toBeInstanceOf(Credential);
    expect(obj.credentials[2].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentials[2].number).toBe('320103111101333X');
    expect(obj.credentials[3].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentials[3].number).toBe('');

    expect(obj.noTypeCredentials).toBeArray();
    expect(obj.noTypeCredentials.length).toBe(4);
    expect(obj.noTypeCredentials[0]).toBeInstanceOf(Object);
    expect(obj.noTypeCredentials[0].type).toBe('IDENTITY_CARD');
    expect(obj.noTypeCredentials[0].number).toBe('32010311110101X');
    expect(obj.noTypeCredentials[1]).toBeInstanceOf(Object);
    expect(obj.noTypeCredentials[1].type).toBe('PASSPORT');
    expect(obj.noTypeCredentials[1].number).toBe('US1234567');
    expect(obj.noTypeCredentials[2]).toBeInstanceOf(Object);
    expect(obj.noTypeCredentials[2].type).toBeUndefined();
    expect(obj.noTypeCredentials[2].number).toBe('320103111101333X');
    expect(obj.noTypeCredentials[3]).toBeNull();

    expect(obj.nonDecoratedClassArray).toBeArray();
    expect(obj.nonDecoratedClassArray.length).toBe(3);
    expect(obj.nonDecoratedClassArray[0]).toBeInstanceOf(NonDecoratedClass);
    expect(obj.nonDecoratedClassArray[0].value).toBe('abc');
    expect(obj.nonDecoratedClassArray[1]).toBeInstanceOf(NonDecoratedClass);
    expect(obj.nonDecoratedClassArray[1].value).toBe('');
    expect(obj.nonDecoratedClassArray[2]).toBeInstanceOf(NonDecoratedClass);
    expect(obj.nonDecoratedClassArray[2].value).toBe('');

    expect(obj.assignedToNonArray).toBeArray();
    expect(obj.assignedToNonArray.length).toBe(0);

    expect(obj.genders).toBeArray();
    expect(obj.genders.length).toBe(3);
    expect(obj.genders[0]).toBe('MALE');
    expect(obj.genders[1]).toBe('FEMALE');
    expect(obj.genders[2]).toBeNull();

    expect(obj.credentialsArrayDefaultNull).toBeArray();
    expect(obj.credentialsArrayDefaultNull.length).toBe(4);
    expect(obj.credentialsArrayDefaultNull[0]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultNull[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialsArrayDefaultNull[0].number).toBe('32010311110101X');
    expect(obj.credentialsArrayDefaultNull[1]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultNull[1].type).toBe(CredentialType.PASSPORT);
    expect(obj.credentialsArrayDefaultNull[1].number).toBe('US1234567');
    expect(obj.credentialsArrayDefaultNull[2]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultNull[2].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialsArrayDefaultNull[2].number).toBe('320103111101333X');
    expect(obj.credentialsArrayDefaultNull[3].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialsArrayDefaultNull[3].number).toBe('');

    expect(obj.credentialsArrayDefaultUndefined).toBeArray();
    expect(obj.credentialsArrayDefaultUndefined.length).toBe(4);
    expect(obj.credentialsArrayDefaultUndefined[0]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultUndefined[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialsArrayDefaultUndefined[0].number).toBe('32010311110101X');
    expect(obj.credentialsArrayDefaultUndefined[1]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultUndefined[1].type).toBe(CredentialType.PASSPORT);
    expect(obj.credentialsArrayDefaultUndefined[1].number).toBe('US1234567');
    expect(obj.credentialsArrayDefaultUndefined[2]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultUndefined[2].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialsArrayDefaultUndefined[2].number).toBe('320103111101333X');
    expect(obj.credentialsArrayDefaultUndefined[3].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialsArrayDefaultUndefined[3].number).toBe('');

    expect(obj.stringArray).toBeArray();
    expect(obj.stringArray.length).toBe(2);
    expect(obj.stringArray[0]).toBe('abc');
    expect(obj.stringArray[1]).toBe('def');

    expect(obj.numberArray).toBeArray();
    expect(obj.numberArray.length).toBe(2);
    expect(obj.numberArray[0]).toBe(123);
    expect(obj.numberArray[1]).toBe(456);
  });
  test('@ElementType decorated non-fields', () => {
    expect(() => {
      @Model
      class Foo {
        @ElementType(Credential)
        bar() {
          return 'abc';
        }
      }
      new Foo();
    }).toThrowWithMessage(
      SyntaxError,
      'The decorator @ElementType can only decorate a class field: bar',
    );
  });
  test('Argument of @ElementType is not a function', () => {
    expect(() => {
      @Model
      class Foo {
        @ElementType('Credential')
        credentials = [];
      }
      new Foo();
    }).toThrowWithMessage(
      TypeError,
      'The argument of @ElementType decorated on "credentials" must be the constructor of a class.',
    );
  });
  test('`@ElementType` decorates non-array field should throw error', () => {
    expect(() => {
      class Foo {
        @ElementType(String)
        nonArrayField = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Foo();
      obj.hello();
    }).toThrowWithMessage(
      TypeError,
      'The field "nonArrayField" decorated by @ElementType must be initialized with an array.',
    );
  });
});
