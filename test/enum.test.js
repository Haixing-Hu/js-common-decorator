////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { clone } from '@haixing_hu/common-util';
import { getClassMetadata } from '../src/impl/utils';
import { KEY_CLASS_CATEGORY } from '../src/impl/metadata-keys';
import Gender from './model/gender';
import GenderWithoutName from './model/gender-without-name';
import GenderWithOptions from './model/gender-with-options';
import GenderWithPayload from './model/gender-with-payload';

/**
 * Unit test the `@Enum` decorator.
 *
 * @author Haixing Hu
 */
describe('Test the `@Enum` class decorator', () => {
  test('The category meta-attribute of the `@Enum` decorated class should be "enum"', () => {
    const value = getClassMetadata(Gender, KEY_CLASS_CATEGORY);
    expect(value).toBe('enum');
  });
  test('Enumerators with names', () => {
    const male = Gender.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.value).toBe('MALE');
    expect(male.name).toBe('男');
    expect(Object.keys(male)).toEqual(['value', 'name']);
    expect(() => {
      male.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      male.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
    const female = Gender.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.value).toBe('FEMALE');
    expect(female.name).toBe('女');
    expect(Object.keys(female)).toEqual(['value', 'name']);
    expect(() => {
      female.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      female.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
  });
  test('Enumerators without names', () => {
    const male = GenderWithoutName.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.value).toBe('MALE');
    expect(male.name).toBe('MALE');
    expect(Object.keys(male)).toEqual(['value', 'name']);
    expect(() => {
      male.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      male.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
    const female = GenderWithoutName.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.value).toBe('FEMALE');
    expect(female.name).toBe('FEMALE');
    expect(Object.keys(female)).toEqual(['value', 'name']);
    expect(() => {
      female.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      female.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
  });
  test('Enumerators with name and i18n options', () => {
    const male = GenderWithOptions.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.i18n).toBe('i18n.gender.male');
    expect(Object.keys(male)).toEqual(['value', 'name', 'i18n']);
    expect(() => {
      male.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      male.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
    expect(() => {
      male.i18n = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'i18n' of object '[^']+'/);
    const female = GenderWithOptions.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.i18n).toBe('i18n.gender.female');
    expect(Object.keys(female)).toEqual(['value', 'name', 'i18n']);
    expect(() => {
      female.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      female.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
    expect(() => {
      female.i18n = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'i18n' of object '[^']+'/);
  });
  test('Enumerators with more payload options', () => {
    const male = GenderWithPayload.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.i18n).toBe('i18n.gender.male');
    expect(male.code).toBe('001');
    expect(male.data).toStrictEqual({ value: 0 });
    expect(Object.keys(male)).toEqual(['value', 'name', 'i18n', 'code', 'data']);
    expect(() => {
      male.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      male.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
    expect(() => {
      male.code = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'code' of object '[^']+'/);
    expect(() => {
      male.data = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'data' of object '[^']+'/);
    const female = GenderWithPayload.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.i18n).toBe('i18n.gender.female');
    expect(female.code).toBe('002');
    expect(female.data).toStrictEqual({ value: 1 });
    expect(Object.keys(female)).toEqual(['value', 'name', 'i18n', 'code', 'data']);
    expect(() => {
      female.value = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'value' of object '[^']+'/);
    expect(() => {
      female.name = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'name' of object '[^']+'/);
    expect(() => {
      female.code = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'code' of object '[^']+'/);
    expect(() => {
      female.data = 'XX';
    }).toThrowWithMessage(TypeError,
        /^Cannot assign to read only property 'data' of object '[^']+'/);
  });
  test('Enumerators should have `toString()` method', () => {
    const male = GenderWithPayload.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.toString()).toBe('MALE');
    expect(String(male)).toBe('MALE');
    const female = GenderWithPayload.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.toString()).toBe('FEMALE');
    expect(String(female)).toBe('FEMALE');
  });
  test('Enumerators should have `toJSON()` method', () => {
    const male = GenderWithPayload.MALE;
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.toJSON()).toBe('MALE');
    expect(JSON.stringify(male)).toBe('"MALE"');
    const female = GenderWithPayload.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.toJSON()).toBe('FEMALE');
    expect(JSON.stringify(female)).toBe('"FEMALE"');
  });
  test('Enumeration class should have static method `values()`', () => {
    const values = Gender.values();
    expect(values).toBeArray();
    expect(values).toEqual([Gender.MALE, Gender.FEMALE]);
    expect(values[0].name).toBe('男');
    expect(values[0].value).toBe('MALE');
    expect(values[1].name).toBe('女');
    expect(values[1].value).toBe('FEMALE');
  });
  test('Enumeration class should have static method `valueOf()`', () => {
    const male = Gender.valueOf('MALE');
    // console.dir(male);
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.valueOf('FEMALE');
    // console.dir(female);
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    // console.dir(female);
    let nonExist = Gender.valueOf('xxx');
    expect(nonExist).toBeUndefined();
    nonExist = Gender.valueOf(undefined);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.valueOf(null);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.valueOf(123);
    expect(nonExist).toBeUndefined();
    nonExist = Gender.valueOf('valueOf');
    expect(nonExist).toBeUndefined();
  });
  test('Enumeration class should have static method `hasValue()`', () => {
    expect(Gender.hasValue('MALE')).toBe(true);
    expect(Gender.hasValue('FEMALE')).toBe(true);
    expect(Gender.hasValue('xxx')).toBe(false);
    expect(Gender.hasValue('has')).toBe(false);
    expect(Gender.hasValue('nameOfValue')).toBe(false);
    expect(Gender.hasValue('valueOf')).toBe(false);
    expect(Gender.hasValue(undefined)).toBe(false);
    expect(Gender.hasValue(null)).toBe(false);
    expect(Gender.hasValue(123)).toBe(false);
  });
  test('Enumeration class should have static method `nameOf()`', () => {
    const male = GenderWithPayload.nameOf('男');
    // console.dir(male);
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('001');
    const female = GenderWithPayload.nameOf('女');
    // console.dir(female);
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('002');
    // console.dir(female);
    let nonExist = GenderWithPayload.nameOf('xx');
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.nameOf(undefined);
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.nameOf(null);
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.nameOf(123);
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.nameOf('valueOf');
    expect(nonExist).toBeUndefined();
  });
  test('Enumeration class should have static method `hasName()`', () => {
    expect(GenderWithPayload.hasName('男')).toBe(true);
    expect(GenderWithPayload.hasName('女')).toBe(true);
    expect(GenderWithPayload.hasName('xx')).toBe(false);
    expect(GenderWithPayload.hasName(undefined)).toBe(false);
    expect(GenderWithPayload.hasName(null)).toBe(false);
    expect(GenderWithPayload.hasName(123)).toBe(false);
  });
  test('Enumeration class should have static method `codeOf()`', () => {
    const male = GenderWithPayload.codeOf('001');
    // console.dir(male);
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('001');
    const female = GenderWithPayload.codeOf('002');
    // console.dir(female);
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('002');
    // console.dir(female);
    let nonExist = GenderWithPayload.codeOf('003');
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.codeOf(undefined);
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.codeOf(null);
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.codeOf(123);
    expect(nonExist).toBeUndefined();
    nonExist = GenderWithPayload.codeOf('valueOf');
    expect(nonExist).toBeUndefined();
  });
  test('Enumeration class should have static method `hasCode()`', () => {
    expect(GenderWithPayload.hasCode('001')).toBe(true);
    expect(GenderWithPayload.hasCode('002')).toBe(true);
    expect(GenderWithPayload.hasCode('003')).toBe(false);
    expect(GenderWithPayload.hasCode('has')).toBe(false);
    expect(GenderWithPayload.hasCode('nameOfValue')).toBe(false);
    expect(GenderWithPayload.hasCode('valueOf')).toBe(false);
    expect(GenderWithPayload.hasCode(undefined)).toBe(false);
    expect(GenderWithPayload.hasCode(null)).toBe(false);
    expect(GenderWithPayload.hasCode('123')).toBe(false);
  });
  test('Test create a enumerator with Object.create()', () => {
    const male = Gender.MALE;
    const prototype = Object.getPrototypeOf(male);
    const copy = Object.create(prototype);
    Object.assign(copy, male);
    expect(copy).toEqual(male);
    console.log('copy = ', copy);
  });
  test('Test clone a enumerator', () => {
    const male = Gender.MALE;
    const copy = clone(male, {
      includeAccessor: false,
      includeNonEnumerable: false,
      includeReadonly: true,
      includeNonConfigurable: true,
    });
    expect(copy).toEqual(male);
  });
  // test('`@Enum` decorated class should be unmodifiable', () => {
  //   expect(() => {
  //     Gender.XX = '';
  //   }).toThrowWithMessage(TypeError, 'Cannot add property XX, object is not extensible');
  // });
});
