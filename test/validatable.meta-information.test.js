////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import defaultValidator from '../src/default-validator';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_VALIDATOR } from '../src/impl/metadata-keys';
import { getFieldMetadata } from '../src/impl/utils';
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
    expect(type).toEqual({ validator: defaultValidator, options: {} });
    const number = getFieldMetadata(metadata, 'number', KEY_FIELD_VALIDATOR);
    expect(number).toEqual({ validator: validateCredentialNumber, options: {} });
  });
  test('Test metadata of CredentialSubclass', () => {
    const metadata = classMetadataCache.get(CredentialSubclass);
    expect(metadata).not.toBeNull();
    const type = getFieldMetadata(metadata, 'type', KEY_FIELD_VALIDATOR);
    expect(type).toEqual({ validator: defaultValidator, options: {} });
    const number = getFieldMetadata(metadata, 'number', KEY_FIELD_VALIDATOR);
    expect(number).toEqual({ validator: validateCredentialNumber, options: {} });
    const childNumber = getFieldMetadata(metadata, 'childNumber', KEY_FIELD_VALIDATOR);
    expect(childNumber).toEqual({ validator: validateCredentialNumber, options: { label: '证件子号码' } });
  });
  test('Test metadata of Person', () => {
    const metadata = classMetadataCache.get(Person);
    expect(metadata).not.toBeNull();
    const name = getFieldMetadata(metadata, 'name', KEY_FIELD_VALIDATOR);
    expect(name).toEqual({ validator: validatePersonName, options: {} });
    const credential = getFieldMetadata(metadata, 'credential', KEY_FIELD_VALIDATOR);
    expect(credential).toEqual({ validator: defaultValidator, options: {} });
    const gender = getFieldMetadata(metadata, 'gender', KEY_FIELD_VALIDATOR);
    expect(gender).toEqual({ validator: validatePersonGender, options: {} });
    const birthday = getFieldMetadata(metadata, 'birthday', KEY_FIELD_VALIDATOR);
    expect(birthday).toEqual({ validator: validatePersonBirthday, options: {} });
    const mobile = getFieldMetadata(metadata, 'mobile', KEY_FIELD_VALIDATOR);
    expect(mobile).toEqual({ validator: validatePersonMobile, options: {} });
    const email = getFieldMetadata(metadata, 'email', KEY_FIELD_VALIDATOR);
    expect(email).toEqual({ validator: validatePersonEmail, options: {} });
  });
});
