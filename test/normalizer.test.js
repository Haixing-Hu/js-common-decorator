/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { trimString } from '@haixing_hu/common-util';
import { Model, Normalizer } from '@/index';
import ObjWithNormalizableField from './model/obj-with-normalizable-field';
import ObjWithoutDecoratedField from './model/obj-without-decorated-field';
import Credential from './model/normalizable-credential';
import { getClassMetadataObject } from '@/impl/utils';

/**
 * 单元测试 @Normalizer 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @Normalizer', () => {
  test('测试 ObjWithNormalizableField 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(ObjWithNormalizableField);
    expect(metadata).not.toBeNull();
    console.log('ObjWithNormalizableField.metadata = ', metadata);
  });
  test('测试 ObjWithNormalizableField.normalize()', () => {
    const data = {
      number: ' 111xyz  ',
      type: ' identity_card    ',
      nonNormalizable: ' 111xyz  ',
      array: null,
      credential: null,
    };
    const obj = new ObjWithNormalizableField();
    obj.assign(data, false);
    expect(obj).toEqual(data);
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe('IDENTITY_CARD');
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
    expect(obj).toEqual(data);
    const result = obj.normalize(null);
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe('IDENTITY_CARD');
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
    expect(obj).toEqual(data);
    const result = obj.normalize('*');
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe('IDENTITY_CARD');
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
    expect(obj).toEqual(data);
    const result = obj.normalize('number');
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe(' identity_card    ');
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
    expect(obj).toEqual(data);
    const result = obj.normalize('type');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe('IDENTITY_CARD');
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
    expect(obj).toEqual(data);
    const result = obj.normalize('nonNormalizable');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(' identity_card    ');
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
    console.log('obj = ', obj);
    expect(obj).toEqual(data);
    const result = obj.normalize('array');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(' identity_card    ');
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
    console.log('obj = ', obj);
    expect(obj).toEqual(data);
    const result = obj.normalize('credential');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(' identity_card    ');
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
    expect(obj.array).toEqual(['abc ', ' 12def ', '  h i g ']);
    expect(obj.credential).toEqual(new Credential('IDENTITY_CARD', 'ABC-123-DEF'));
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
    expect(obj).toEqual(data);
    const result = obj.normalize('xxx');
    expect(result).toBe(obj);
    expect(obj.number).toBe(' 111xyz  ');
    expect(obj.type).toBe(' identity_card    ');
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
    expect(obj).toEqual(data);
    expect(() => obj.normalize(123))
      .toThrowWithMessage(TypeError, 'Field name of ObjWithNormalizableField must be a string.');
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
    expect(obj).toEqual(data);
    obj.number = undefined;
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.type).toBe('IDENTITY_CARD');
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
    expect(obj).toEqual(data);
    obj.number = null;
    const result = obj.normalize();
    expect(result).toBe(obj);
    expect(obj.type).toBe('IDENTITY_CARD');
    expect(obj.number).toBe('');
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });
  test('@Normalizer参数不是函数', () => {
    expect(() => {
      @Model
      class ObjWithInvalidNormalizer {
        @Normalizer('xxx')
          number = '';

        hello() {
          console.log('hello');
        }
      }
      const obj = new ObjWithInvalidNormalizer();
      obj.hello();
    }).toThrowWithMessage(TypeError, 'The normalizer of the field "ObjWithInvalidNormalizer.number" must be a function.');
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
    expect(obj).toEqual(data);
    const result = obj.normalize(['number', 'type']);
    expect(result).toBe(obj);
    expect(obj.number).toBe('111XYZ');
    expect(obj.type).toBe('IDENTITY_CARD');
    expect(obj.nonNormalizable).toBe(' 111xyz  ');
  });

  test('字段声明在父类，父类没有normalize()函数，但字段指定了normalizer', () => {
    class A {
      @Normalizer(trimString)
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
      @Normalizer(trimString)
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
