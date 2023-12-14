////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '../src';
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import CredentialType from './model/credential-type';
import Credential from './model/validatible-credential';

describe('Test the prototype method `validate()`', () => {
  test('Test Credential.validate(), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate(), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
  });
  test('Test Credential.validate(), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
  });
  test('Test Credential.validate(undefined), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate(undefined), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
  });
  test('Test Credential.validate(undefined), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
  });
  test('Test Credential.validate(null), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate(null), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
  });
  test('Test Credential.validate(null), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
  });
  test('Test Credential.validate("*"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate("*"), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
  });
  test('Test Credential.validate("*"), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
  });
  test('Test Credential.validate("type"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate("type"), invalid credential number', () => {
    const obj = new Credential(CredentialType.PASSPORT, '123');
    const result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate("type"), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
  });
  test('Test Credential.validate("*", { owner }), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
  });
  test('Test Credential.validate("*", { owner }), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 of Bill Gates must be of the type CredentialType.');

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 of Bill Gates is not supported: xxx');
  });
  test('Test Credential.validate("*", { owner }), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 of Bill Gates cannot be empty.');

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Bill Gates的护照证件号码格式不正确');
  });
});
