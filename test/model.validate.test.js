////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '../src';
import CredentialType from './model/credential-type';
import Credential from './model/validatible-credential';

describe('Test the prototype method `validate()`', () => {
  test('Test Credential.validate(), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate(undefined), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(undefined), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(undefined), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate(undefined);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate(null), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(null), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(null), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate(null);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate("*"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("*"), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("*"), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate('*');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate("type"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("type"), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("type"), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate("number"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("number"), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("number"), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate("*", { owner }), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("*", { owner }), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 of Bill Gates must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 of Bill Gates is not supported: xxx');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate("*", { owner }), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '');
    let result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 of Bill Gates cannot be empty.');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.PASSPORT, 'PE123');
    result = obj.validate('*', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('Bill Gates的护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate("nonValidatable"), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('nonValidatable');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate([non-exist-field]), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate('xxx');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });

  test('Test Credential.validate(["type", "number"]), success', () => {
    const obj = new Credential(CredentialType.OTHER, '123');
    const result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(["type", "number"]), invalid credential number', () => {
    let obj = new Credential(CredentialType.PASSPORT, '123');
    let result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();

    obj = new Credential(CredentialType.IDENTITY_CARD, '');
    result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(["type", "number"]), invalid credential type', () => {
    let obj = new Credential(0, 'E12345678');
    let result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 must be of the type CredentialType.');
    expect(result.next).toBeNull();

    obj = new Credential('xxx', 'E12345678');
    result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).toBeNull();
  });
  test('Test Credential.validate(["type", "number"]), invalid credential type and number', () => {
    let obj = new Credential('xxx', '');
    let result = obj.validate(['type', 'number']);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('The 证件类型 is not supported: xxx');
    expect(result.next).not.toBeNull();
    expect(result.next.success).toBe(false);
    expect(result.next.description).toBe('The 证件号码 cannot be empty.');
    expect(result.next.next).toBeNull();
  });
});
