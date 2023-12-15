////////////////////////////////////////////////////////////////////////////////
import { trimString, trimUppercaseString } from '@haixing_hu/common-util';
import { Model, Normalizable } from '../src';
import defaultNormalizer from '../src/default-normalizer';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_FIELD_NORMALIZER } from '../src/impl/metadata-keys';
import { getFieldMetadata } from '../src/impl/utils';
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Child from './model/child';
import CredentialType from './model/credential-type';
import Credential from './model/normalizable-credential';
import ObjWithNormalizableField from './model/obj-with-normalizable-field';
import ObjWithoutDecoratedField from './model/obj-without-decorated-field';
import Parent from './model/parent';

describe('Test the prototype method `normalize()`', () => {
  test('`Child.normalize()` should call `Parent.normalize()`', () => {
    const data = {
      x: 1,
      z: 'abc',
      message: 'hello',
    };
    const parent = new Parent();
    parent.assign(data, false);
    expect(parent.x).toBe(1);
    expect(parent.y).toBe(0);
    expect(parent.z).toBe('abc');
    parent.normalize();
    expect(parent.z).toBe('ABC');

    const child = new Child();
    child.assign(data, false);
    expect(child.message).toBe('hello');
    expect(child.x).toBe(1);
    expect(child.y).toBe(0);
    expect(child.z).toBe('abc');
    child.normalize();
    expect(child.message).toBe('HELLO');
    expect(child.x).toBe(1);
    expect(child.y).toBe(0);
    expect(child.z).toBe('ABC');
  });

  test('Check the field metadata of @Normalizable decorated fields', () => {
    @Model
    class Foo {
      @Normalizable
      message = ' hello world ';

      @Normalizable(trimUppercaseString)
      name = ' bill gates ';

      nonNormalizableField = '';
    }
    const metadata = classMetadataCache.get(Foo);
    expect(metadata).not.toBeNull();
    console.log('Foo.metadata = ', metadata);
    expect(getFieldMetadata(metadata, 'message', KEY_FIELD_NORMALIZER))
    .toBe(defaultNormalizer);
    expect(getFieldMetadata(metadata, 'name', KEY_FIELD_NORMALIZER))
    .toBe(trimUppercaseString);
    expect(getFieldMetadata(metadata, 'nonNormalizableField', KEY_FIELD_NORMALIZER))
    .toBeUndefined();
  });
  test('Test `ObjWithNormalizableField.normalize()`', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize(null)', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize(null);
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize("*")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('*');
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize("number")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('number');
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize("type")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('type');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize("nonNormalizable")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('nonNormalizable');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize("array")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: ['abc ', ' 12def ', '  h i g '],
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('array');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
    expect(obj.array).toEqual(['ABC', '12DEF', 'H I G']);
  });
  test('测试 ObjWithNormalizableField.normalize("credential")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: ['abc ', ' 12def ', '  h i g '],
      credential: {
        type: ' identity_card ',
        number: ' abc-123-def   ',
      },
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    data.credential.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('credential');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
    expect(obj.array).toEqual(['abc ', ' 12def ', '  h i g ']);
    expect(obj.credential).toEqual(new Credential(CredentialType.IDENTITY_CARD, 'ABC-123-DEF'));
  });
  test('测试 ObjWithNormalizableField.normalize("xxx")', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize('xxx');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize(123)', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    expect(() => obj.normalize(123)).toThrowWithMessage(TypeError,
      'The argument ObjWithNormalizableField.normalize() must be a string or an array of strings.');
  });
  test('测试 ObjWithNormalizableField.normalize(number)但number字段值是undefined', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    obj.number = undefined;
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.number).toBe('');
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('测试 ObjWithNormalizableField.normalize(number)但number字段值是null', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    obj.number = null;
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.number).toBe('');
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('@Normalizable参数不是函数', () => {
    expect(() => {
      @Model
      class ObjWithInvalidNormalizer {
        @Normalizable('xxx')
        number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new ObjWithInvalidNormalizer();
      obj.hello();
    }).toThrowWithMessage(TypeError,
      'The argument of @Normalizable decorated on the "number" field must a function.');
  });
  test('ObjWithoutDecoratedField.normalize()', () => {
    const obj = new ObjWithoutDecoratedField();
    obj.key = 'key';
    obj.value = '   value  ';
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.key).toBe('key');
    expect(obj.value).toBe('   value  ');
  });
  test('测试 ObjWithNormalizableField.normalize(["number", "type"])', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    data.type = CredentialType.IDENTITY_CARD;
    expect(obj).toEqual(data);
    const result = obj.normalize(['number', 'type']);
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });

  test('字段声明在父类，父类没有normalize()函数，但字段指定了normalizer', () => {
    class A {
      @Normalizable(trimString)
      name = '';
    }
    @Model
    class B extends A {}
    const obj = new B();
    obj.name = '   xxx  ';
    obj.normalize('name');
    expect(obj.name).toBe('xxx');
  });
  test('字段声明在祖先类，祖先类没有normalize()函数，但字段指定了normalizer', () => {
    class A {
      @Normalizable(trimString)
      name = '';
    }
    class B extends A {}
    @Model
    class C extends B {}
    const obj = new C();
    obj.name = '   xxx  ';
    obj.normalize('name');
    expect(obj.name).toBe('xxx');
  });
});
