/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { clone } from '@haixing_hu/common-util';
import { getClassMetadataObject, getClassMetadata } from '@/impl/utils';
import Gender from './model/gender';
import GenderWithCodeData from './model/gender-with-code-data';

/**
 * 单元测试 @Enum 装饰器。
 *
 * @author 胡海星
 */
describe('测试 @Enum 类装饰器', () => {
  test('测试 Gender 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(Gender);
    expect(metadata).not.toBeNull();
    console.log('Gender.metadata = ', metadata);
  });
  test('测试 @Enum 修饰的类的 category 元属性是否为 "enum"', () => {
    const value = getClassMetadata(Gender, 'category');
    expect(value).toBe('enum');
  });
  test('测试 @Enum 是否为类增加 name, value 成员以及枚举子', () => {
    const male = Gender.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });
  test('测试 @Enum 是否为类增加 code, data 成员以及枚举子', () => {
    const male = GenderWithCodeData.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe(0);
    expect(male.data).toStrictEqual({ value: 0 });
    const female = GenderWithCodeData.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe(1);
    expect(female.data).toStrictEqual({ value: 1 });
  });
  test('测试 @Enum 是为类增加 name, value 成员是否是不可修改', () => {
    const male = Gender.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(() => {
      male.name = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'name\' of object \'#<Gender>\'');
    expect(() => {
      male.value = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'value\' of object \'#<Gender>\'');
    const female = Gender.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(() => {
      female.name = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'name\' of object \'#<Gender>\'');
    expect(() => {
      female.value = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'value\' of object \'#<Gender>\'');
  });
  test('测试 @Enum 是为类增加 code, data 成员是否是不可修改', () => {
    const male = GenderWithCodeData.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe(0);
    expect(male.data).toStrictEqual({ value: 0 });
    expect(() => {
      male.code = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'code\' of object \'#<GenderWithCodeData>\'');
    expect(() => {
      male.data = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'data\' of object \'#<GenderWithCodeData>\'');
    const female = GenderWithCodeData.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe(1);
    expect(female.data).toStrictEqual({ value: 1 });
    expect(() => {
      female.code = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'code\' of object \'#<GenderWithCodeData>\'');
    expect(() => {
      female.data = 'XX';
    }).toThrowWithMessage(TypeError, 'Cannot assign to read only property \'data\' of object \'#<GenderWithCodeData>\'');
  });
  test('测试 @Enum 是否为类增加 values() 静态方法', () => {
    const values = Gender.values();
    expect(values).toBeArray();
    expect(values).toEqual([Gender.MALE, Gender.FEMALE]);
    expect(values[0].name).toBe('男');
    expect(values[0].value).toBe('MALE');
    expect(values[1].name).toBe('女');
    expect(values[1].value).toBe('FEMALE');
  });
  test('测试 @Enum 是否为类增加 forValue() 静态方法', () => {
    const male = Gender.forValue('MALE');
    // console.dir(male);
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.forValue('FEMALE');
    // console.dir(female);
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    // console.dir(female);
    let nonExist = Gender.forValue('xxx');
    expect(nonExist).toBeUndefined();
    nonExist = Gender.forValue(undefined);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.forValue(null);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.forValue(123);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.forValue('forValue');
    expect(nonExist).toBeUndefined();
  });
  test('测试 @Enum 是否为类增加 getNameOf() 静态方法', () => {
    const male = Gender.getNameOf('MALE');
    expect(male).toBe('男');
    const female = Gender.getNameOf('FEMALE');
    expect(female).toBe('女');

    let nonExist = Gender.getNameOf('xxx');
    expect(nonExist).toBeUndefined();
    nonExist = Gender.getNameOf(undefined);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.getNameOf(null);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.getNameOf(123);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.getNameOf('forValue');
    expect(nonExist).toBeUndefined();
  });
  test('测试 @Enum 是否为类增加 has() 静态方法', () => {
    expect(Gender.has('MALE')).toBe(true);
    expect(Gender.has('FEMALE')).toBe(true);
    expect(Gender.has('xxx')).toBe(false);
    expect(Gender.has('has')).toBe(false);
    expect(Gender.has('getNameOf')).toBe(false);
    expect(Gender.has('forValue')).toBe(false);
    expect(Gender.has(undefined)).toBe(false);
    expect(Gender.has(null)).toBe(false);
    expect(Gender.has(123)).toBe(false);
  });
  test('测试 @Enum 装饰的类是否可改变', () => {
    expect(() => {
      Gender.XX = '';
    }).toThrowWithMessage(TypeError, 'Cannot add property XX, object is not extensible');
  });
  test('测试 Object.create() 一个枚举子', () => {
    const male = Gender.MALE;
    const prototype = Object.getPrototypeOf(male);
    const copy = Object.create(prototype);
    Object.assign(copy, male);
    expect(copy).toEqual(male);
    console.log('copy = ', copy);
  });
  test('测试 clone() 一个枚举子', () => {
    const male = Gender.MALE;
    const copy = clone(male, {
      includeAccessor: false,
      includeNonEnumerable: false,
      includeReadonly: true,
      includeNonConfigurable: true,
    });
    expect(copy).toEqual(male);
  });
});
