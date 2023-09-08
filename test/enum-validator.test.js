/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, EnumValidator, ValidationResult, Type } from '../src/index';
import { getClassMetadataObject } from '../src/impl/utils';
import CredentialType from './model/credential-type';
import Credential from './model/validatible-credential';

/**
 * 单元测试 @EnumValidator 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @EnumValidator', () => {
  test('测试 Credential 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(Credential);
    expect(metadata).not.toBeNull();
    console.log('Credential.metadata = ', metadata);
  });
  test('测试 Credential.prototype.validate()', () => {
    const credential = new Credential(CredentialType.PASSPORT.value, 'E12345678');
    console.log('credential = ', credential);
    let result = credential.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');

    credential.assign({ type: 'xxx' });
    result = credential.validate();
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型不受支持："xxx"');
  });
  test('测试 Credential.prototype.validate("type")', () => {
    const credential = new Credential(CredentialType.PASSPORT.value, 'E12345678');
    console.log('credential = ', credential);
    let result = credential.validate('type');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');

    credential.assign({ type: 'xxx' });
    result = credential.validate('type');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(false);
    expect(result.description).toBe('证件类型不受支持："xxx"');

    credential.assign({ type: CredentialType.PASSPORT.value, number: 'xxxx' });
    result = credential.validate('type');
    expect(result).toBeInstanceOf(ValidationResult);
    expect(result.success).toBe(true);
    expect(result.description).toBe('');
  });
  test('@EnumValidator修饰一个未指定@Type的字段', () => {
    expect(() => {
      @Model
      class Obj {
        @EnumValidator
          type = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(
      TypeError,
      'The field "Obj.type" must be decorated by the @Type decorator.',
    );
  });
  test('@EnumValidator修饰一个非Emum类型的字段', () => {
    expect(() => {
      @Model
      class Obj {
        @EnumValidator
        @Type(Credential)
          type = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new Obj();
      obj.hello();
    }).toThrowWithMessage(
      TypeError,
      'The field "Obj.type" must be an enumeration whose class should be decorated by @Enum.',
    );
  });
});
