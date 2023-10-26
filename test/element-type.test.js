////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { ElementType } from '../src';
import { getClassMetadataObject } from '../src/impl/utils';
import Credential from './model/credential';
import ObjWithArrayMember from './model/obj-with-array-member';
import NonDecoratedClass from './model/non-decorated-class';

/**
 * 单元测试 @Model 和 @ElementType 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @Model 类装饰器针对包含被 @ElementType 标注的数组属性的类的效果', () => {
  test('测试 ObjWithArrayMember 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(ObjWithArrayMember);
    expect(metadata).not.toBeNull();
    console.log('ObjWithArrayMember.metadata = ', metadata);
  });
  test('测试实例方法 ObjWithArrayMember.prototype.assign()', () => {
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
      stringArray: ['abc', 'def'],
      numberArray: [123, 456],
    };
    const obj = new ObjWithArrayMember();
    obj.assign(data);

    expect(obj.id).toBe('xxx');

    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(4);
    expect(obj.credentials[0]).toBeInstanceOf(Credential);
    expect(obj.credentials[0].type).toBe('IDENTITY_CARD');
    expect(obj.credentials[0].number).toBe('32010311110101X');
    expect(obj.credentials[1]).toBeInstanceOf(Credential);
    expect(obj.credentials[1].type).toBe('PASSPORT');
    expect(obj.credentials[1].number).toBe('US1234567');
    expect(obj.credentials[2]).toBeInstanceOf(Credential);
    expect(obj.credentials[2].type).toBe('IDENTITY_CARD');
    expect(obj.credentials[2].number).toBe('320103111101333X');
    expect(obj.credentials[3].type).toBe('IDENTITY_CARD');
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
    expect(obj.credentialsArrayDefaultNull[0].type).toBe('IDENTITY_CARD');
    expect(obj.credentialsArrayDefaultNull[0].number).toBe('32010311110101X');
    expect(obj.credentialsArrayDefaultNull[1]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultNull[1].type).toBe('PASSPORT');
    expect(obj.credentialsArrayDefaultNull[1].number).toBe('US1234567');
    expect(obj.credentialsArrayDefaultNull[2]).toBeInstanceOf(Credential);
    expect(obj.credentialsArrayDefaultNull[2].type).toBe('IDENTITY_CARD');
    expect(obj.credentialsArrayDefaultNull[2].number).toBe('320103111101333X');
    expect(obj.credentialsArrayDefaultNull[3].type).toBe('IDENTITY_CARD');
    expect(obj.credentialsArrayDefaultNull[3].number).toBe('');

    expect(obj.stringArray).toBeArray();
    expect(obj.stringArray.length).toBe(2);
    expect(obj.stringArray[0]).toBe('abc');
    expect(obj.stringArray[1]).toBe('def');

    expect(obj.numberArray).toBeArray();
    expect(obj.numberArray.length).toBe(2);
    expect(obj.numberArray[0]).toBe(123);
    expect(obj.numberArray[1]).toBe(456);
  });

  test('测试 @ElementType 注解加在非数组属性上', () => {
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
      SyntaxError,
      'The field "Foo.nonArrayField" decorated by @ElementType must be an array type field.',
    );
  });
});
