////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import defaultValidator from '../src/default-validator';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_VALIDATOR } from '../src/impl/metadata-keys';
import getFieldMetadata from '../src/impl/utils/get-field-metadata';
import validateCredentialNumber from './model/rules/validate-credential-number';
import validatePersonBirthday from './model/rules/validate-person-birthday';
import validatePersonEmail from './model/rules/validate-person-email';
import validatePersonGender from './model/rules/validate-person-gender';
import validatePersonMobile from './model/rules/validate-person-mobile';
import validatePersonName from './model/rules/validate-person-name';
import Credential from './model/validatible-credential';
import CredentialSubclass from './model/validatible-credential-subclass';
import Person from './model/validatible-person';

/**
 * Unit test the @Validatable decorator.
 *
 * @author Haixing Hu
 */
describe('Unit test the meta-information of the @Validatable', () => {
  test('Test metadata of Credential', () => {
    const metadata = classMetadataCache.get(Credential);
    expect(metadata).not.toBeNull();
    const type = getFieldMetadata(metadata, 'type', KEY_FIELD_VALIDATOR);
    expect(type).toBe(defaultValidator);
    const number = getFieldMetadata(metadata, 'number', KEY_FIELD_VALIDATOR);
    expect(number).toBe(validateCredentialNumber);
  });
  test('Test metadata of CredentialSubclass', () => {
    const metadata = classMetadataCache.get(CredentialSubclass);
    expect(metadata).not.toBeNull();
    const type = getFieldMetadata(metadata, 'type', KEY_FIELD_VALIDATOR);
    expect(type).toBe(defaultValidator);
    const number = getFieldMetadata(metadata, 'number', KEY_FIELD_VALIDATOR);
    expect(number).toBe(validateCredentialNumber);
    const childNumber = getFieldMetadata(metadata, 'childNumber', KEY_FIELD_VALIDATOR);
    expect(childNumber).toBe(validateCredentialNumber);
  });
  test('Test metadata of Person', () => {
    const metadata = classMetadataCache.get(Person);
    expect(metadata).not.toBeNull();
    const name = getFieldMetadata(metadata, 'name', KEY_FIELD_VALIDATOR);
    expect(name).toBe(validatePersonName);
    const credential = getFieldMetadata(metadata, 'credential', KEY_FIELD_VALIDATOR);
    expect(credential).toBe(defaultValidator);
    const gender = getFieldMetadata(metadata, 'gender', KEY_FIELD_VALIDATOR);
    expect(gender).toBe(validatePersonGender);
    const birthday = getFieldMetadata(metadata, 'birthday', KEY_FIELD_VALIDATOR);
    expect(birthday).toBe(validatePersonBirthday);
    const mobile = getFieldMetadata(metadata, 'mobile', KEY_FIELD_VALIDATOR);
    expect(mobile).toBe(validatePersonMobile);
    const email = getFieldMetadata(metadata, 'email', KEY_FIELD_VALIDATOR);
    expect(email).toBe(validatePersonEmail);
  });
});
