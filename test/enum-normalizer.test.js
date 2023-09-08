/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Model, EnumNormalizer } from '@/index';
import Credential from './model/normalizable-credential';
import { getClassMetadataObject } from '@/impl/utils';
import { Type } from '../src';

/**
 * 单元测试 @EnumNormalizer 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @EnumNormalizer', () => {
  test('测试 Credential 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(Credential);
    expect(metadata).not.toBeNull();
    console.log('Credential.metadata = ', metadata);
  });
  test('测试 Credential.prototype.normalize()', () => {
    const credential = new Credential('passport  ', ' e12345678  ');
    const result = credential.normalize();
    expect(result).toBe(credential);
    expect(credential.type).toBe('PASSPORT');
    expect(credential.number).toBe('E12345678');
  });

  test('@EnumNormalizer修饰一个未指定@Type的字段', () => {
    expect(() => {
      @Model
      class Obj {
        @EnumNormalizer
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
  test('@EnumNormalizer修饰一个非Emum类型的字段', () => {
    expect(() => {
      @Model
      class Obj {
        @EnumNormalizer
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
