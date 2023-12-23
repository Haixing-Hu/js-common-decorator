////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ValidationResult } from '@haixing_hu/common-validator';
import CredentialType from './model/credential-type';
import Credential from './model/validatible-credential';

describe('Test the prototype method `validateField()`', () => {
  test('Credential.validateField("type"), success', () => {
    const obj = new Credential(CredentialType.PASSPORT, 'E12345678');
    const result = obj.validateField('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("type"), invalid field type', () => {
    const obj = new Credential(0, 'E12345678');
    const result = obj.validateField('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("type"), invalid enum value', () => {
    const obj = new Credential('xxx', 'E12345678');
    const result = obj.validateField('type');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number"), success', () => {
    const obj = new Credential('PASSPORT', 'E12345678');
    const result = obj.validateField('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number"), empty number', () => {
    const obj = new Credential(CredentialType.IDENTITY_CARD, '');
    const result = obj.validateField('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入身份证证件号码');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number"), type === IDENTITY_CARD, invalid number format', () => {
    const obj = new Credential(CredentialType.IDENTITY_CARD, 'PE123');
    const result = obj.validateField('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('身份证证件号码格式不正确');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number"), type === PASSPORT, invalid number format', () => {
    const obj = new Credential(CredentialType.PASSPORT, 'PE123');
    const result = obj.validateField('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('护照证件号码格式不正确');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number"), type === OFFICER_CARD, invalid number format', () => {
    const obj = new Credential(CredentialType.OFFICER_CARD, 'PE123');
    const result = obj.validateField('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('中国人民解放军军官证证件号码格式不正确');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number"), type === other, invalid number format', () => {
    const obj = new Credential(CredentialType.OTHER, ' 123 ');
    const result = obj.validateField('number');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('其他证件证件号码格式不正确');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("type", { label: "credential type" }), invalid field type', () => {
    const obj = new Credential(0, 'E12345678');
    const result = obj.validateField('type', { label: 'credential type' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('credential type必须是 CredentialType 类型');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("type", { label: "credential type" }), invalid enum value', () => {
    const obj = new Credential('xxx', 'E12345678');
    const result = obj.validateField('type', { label: 'credential type' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('credential type的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("type", { label, owner }), invalid field type', () => {
    const obj = new Credential(0, 'E12345678');
    const result = obj.validateField('type', { label: '证件类型', owner: '张三' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型必须是 CredentialType 类型');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("type", { label, owner }), invalid enum value', () => {
    const obj = new Credential('xxx', 'E12345678');
    const result = obj.validateField('type', { label: '证件类型', owner: '张三' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的证件类型的值不受支持: xxx');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number", { label, owner }), invalid number format', () => {
    const obj = new Credential(CredentialType.PASSPORT, '123');
    const result = obj.validateField('number', { label: '号码', owner: '张三' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('张三的护照号码格式不正确');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("number", { owner }), empty number', () => {
    const obj = new Credential(CredentialType.IDENTITY_CARD, '');
    const result = obj.validateField('number', { owner: 'Bill Gates' });
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('请输入Bill Gates的身份证证件号码');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField("nonValidatable")', () => {
    const obj = new Credential(CredentialType.IDENTITY_CARD, '');
    obj.nonValidatable = 'xxx';
    const result = obj.validateField('nonValidatable');
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
    expect(result.next).toBeNull();
  });
  test('Credential.validateField([non-exist-field]), failed', () => {
    const obj = new Credential(CredentialType.OTHER, ' 123 ');
    const result = obj.validateField('xxx');
    expect(result).toBeNull();
  });
  test('Credential.validateField(null), failed', () => {
    const obj = new Credential(CredentialType.OTHER, ' 123 ');
    const result = obj.validateField(null);
    expect(result).toBeNull();
  });
  test('Credential.validateField(undefined), failed', () => {
    const obj = new Credential(CredentialType.OTHER, ' 123 ');
    const result = obj.validateField(undefined);
    expect(result).toBeNull();
  });
});
