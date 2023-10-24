////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getClassMetadataObject } from '../src/impl/utils';
import Credential from './model/credential';
import NonDecoratedClass from './model/non-decorated-class';
import ObjWithAnnotatedNullField from './model/obj-with-annotated-null-field';

/**
 * 单元测试 @Model 和 @Type 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @Model 类装饰器针对包含被 @Type 标注的属性的类的效果', () => {
  test('测试 ObjWithAnnotatedNullField 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(ObjWithAnnotatedNullField);
    expect(metadata).not.toBeNull();
    console.log('ObjWithAnnotatedNullField.metadata = ', metadata);
  });
  test('测试实例方法 ObjWithAnnotatedNullField.prototype.assign()', () => {
    const data = {
      id: 'xxx',
      credential: {
        type: 'IDENTITY_CARD',
        number: '32010311110101X',
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
    const obj = new ObjWithAnnotatedNullField();
    obj.assign(data);

    expect(obj.id).toBe('xxx');

    expect(obj.credential).toBeInstanceOf(Credential);
    expect(obj.credential.type).toBe('IDENTITY_CARD');
    expect(obj.credential.number).toBe('32010311110101X');

    expect(obj.nonAnnotatedCredential).toBeInstanceOf(Object);
    expect(obj.nonAnnotatedCredential.type).toBe('IDENTITY_CARD');
    expect(obj.nonAnnotatedCredential.number).toBe('32010311110101X');

    expect(obj.nonDecoratedClass).toBeInstanceOf(NonDecoratedClass);
    expect(obj.nonDecoratedClass.value).toBe('abc');

    expect(obj.genderWithDefaultEmpty).toBe('MALE');
    expect(obj.genderWithDefaultNull).toBe('FEMALE');
  });
});
