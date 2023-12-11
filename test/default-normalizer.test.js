////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import classMetadataCache from '../src/impl/class-metadata-cache';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import ObjWithDefaultNormalizerField from './model/obj-with-default-normalizer-field';
import NonDecoratedClass from './model/non-decorated-class';
import ObjWithArrayField from './model/obj-with-array-field';


/**
 * 单元测试 @DefaultNormalizer 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @DefaultNormalizer', () => {
  test('测试 ObjWithDefaultNormalizerField 类的 metadata 对象', () => {
    const metadata = classMetadataCache.get(ObjWithDefaultNormalizerField);
    expect(metadata).not.toBeNull();
    console.log('ObjWithDefaultNormalizerField.metadata = ', metadata);
  });
  test('测试 ObjWithDefaultNormalizerField.normalize()', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      credential: {
        type: ' identity_card  ',
        number: ' 123xxx',
      },
      noNormalizeField: {
        value: '  xxx ',
      },
      credentialDefaultNonNull: {
        type: ' passport  ',
        number: ' 123xxx',
      },
    };
    const obj = new ObjWithDefaultNormalizerField();
    obj.assign(data, false);
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
    expect(obj.credentialDefaultNonNull).toBeInstanceOf(Credential);
    expect(obj.credentialDefaultNonNull.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentialDefaultNonNull.number).toBe('');
  });
  test('测试 DefaultNormalizer 对数组字段是否生效', () => {
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
});
