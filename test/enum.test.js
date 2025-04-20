////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '@qubit-ltd/clone';
import { Enum } from '../src';
import { KEY_CLASS_CATEGORY } from '../src/impl/metadata-keys';
import getClassMetadata from '../src/impl/utils/get-class-metadata';
import Gender from './model/gender';
import GenderWithOptions from './model/gender-with-options';
import GenderWithPayload from './model/gender-with-payload';
import GenderWithoutName from './model/gender-without-name';

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
    expect(male.code).toBe('1');
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
    expect(female.code).toBe('2');
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
    expect(`the gender is ${male}`).toBe('the gender is MALE');
    const female = GenderWithPayload.FEMALE;
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.toString()).toBe('FEMALE');
    expect(String(female)).toBe('FEMALE');
    expect(`the gender is ${female}`).toBe('the gender is FEMALE');
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
  test('`@Enum` decorated class should be unmodifiable', () => {
    expect(() => {
      Gender.XX = '';
    }).toThrowWithMessage(TypeError, 'Cannot add property XX, object is not extensible');
  });
  test('Define enumerator with error type', () => {
    expect(() => {
      @Enum
      class MyEnum {
        static ITEM_1 = 0;
      }
    }).toThrowWithMessage(TypeError,
      'The default value of the enumerator MyEnum.ITEM_1 should be either a string or an object.');
  });
});

describe('Test the `Enum.ofValue()', () => {
  test('ofValue() for primitive string', () => {
    const male = Gender.ofValue('MALE');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofValue('FEMALE');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofValue() for String object', () => {
    const male = Gender.ofValue(new String('MALE'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofValue(new String('FEMALE'));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofValue() for primitive string with spaces', () => {
    const male = Gender.ofValue('  MALE ');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofValue(' FEMALE  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofValue() for String object with spaces`', () => {
    const male = Gender.ofValue(new String('  MALE '));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofValue(new String(' FEMALE  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofValue() for primitive string with spaces and not all uppercase', () => {
    const male = Gender.ofValue('  MaLE ');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofValue(' female  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofValue() for String object with spaces and not all uppercase`', () => {
    const male = Gender.ofValue(new String('  MaLE '));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofValue(new String(' female  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofValue() for non-exist primitive string`', () => {
    const nonExist = Gender.ofValue('xxx');
    expect(nonExist).toBeUndefined();
  });

  test('ofValue() for non-exist String object`', () => {
    const nonExist = Gender.ofValue(new String('xxx'));
    expect(nonExist).toBeUndefined();
  });

  test('ofValue() for non-string values`', () => {
    const nonExist = Gender.ofValue(123);
    expect(nonExist).toBeUndefined();
  });

  test('ofValue() for undefined`', () => {
    const nonExist = Gender.ofValue(undefined);
    expect(nonExist).toBeUndefined();
  });

  test('ofValue() for null`', () => {
    const nonExist = Gender.ofValue(null);
    expect(nonExist).toBeUndefined();
  });
});

describe('Test the `Enum.hasValue()', () => {
  test('hasValue() for primitive string', () => {
    const maleExist = Gender.hasValue('MALE');
    expect(maleExist).toBe(true);
    const femaleExist = Gender.hasValue('FEMALE');
    expect(femaleExist).toBe(true);
  });

  test('hasValue() for String object', () => {
    const maleExist = Gender.hasValue(new String('MALE'));
    expect(maleExist).toBe(true);
    const femaleExist = Gender.hasValue(new String('FEMALE'));
    expect(femaleExist).toBe(true);
  });

  test('hasValue() for primitive string with spaces', () => {
    const maleExist = Gender.hasValue('  MALE ');
    expect(maleExist).toBe(true);
    const femaleExist = Gender.hasValue(' FEMALE  ');
    expect(femaleExist).toBe(true);
  });

  test('hasValue() for String object with spaces', () => {
    const maleExist = Gender.hasValue(new String('  MALE '));
    expect(maleExist).toBe(true);
    const femaleExist = Gender.hasValue(new String(' FEMALE  '));
    expect(femaleExist).toBe(true);
  });

  test('hasValue() for primitive string with spaces and not all uppercases', () => {
    const maleExist = Gender.hasValue('  MaLe ');
    expect(maleExist).toBe(true);
    const femaleExist = Gender.hasValue(' female  ');
    expect(femaleExist).toBe(true);
  });

  test('hasValue() for String object with spaces and not all uppercases', () => {
    const maleExist = Gender.hasValue(new String('  MaLe '));
    expect(maleExist).toBe(true);
    const femaleExist = Gender.hasValue(new String(' female  '));
    expect(femaleExist).toBe(true);
  });

  test('hasValue() for non-exist primitive string`', () => {
    const nonExist = Gender.hasValue('xxx');
    expect(nonExist).toBe(false);
  });

  test('hasValue() for non-exist String object`', () => {
    const nonExist = Gender.hasValue(new String('xxx'));
    expect(nonExist).toBe(false);
  });

  test('hasValue() for non-string values`', () => {
    const nonExist = Gender.hasValue(123);
    expect(nonExist).toBe(false);
  });

  test('hasValue() for undefined`', () => {
    const nonExist = Gender.hasValue(undefined);
    expect(nonExist).toBe(false);
  });

  test('hasValue() for null`', () => {
    const nonExist = Gender.hasValue(null);
    expect(nonExist).toBe(false);
  });
});

describe('Test the `Enum.ofName()', () => {
  test('ofName() for primitive string', () => {
    const male = Gender.ofName('男');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofName('女');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofName() for String object', () => {
    const male = Gender.ofName(new String('男'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofName(new String('女'));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofName() for primitive string with spaces', () => {
    const male = Gender.ofName('  男');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofName('女  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofName() for String object with spaces', () => {
    const male = Gender.ofName(new String('  男'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(Gender);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = Gender.ofName(new String('女  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(Gender);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('ofName() for non-exist primitive string`', () => {
    const nonExist = Gender.ofName('xxx');
    expect(nonExist).toBeUndefined();
  });

  test('ofName() for non-exist String object`', () => {
    const nonExist = Gender.ofName(new String('xxx'));
    expect(nonExist).toBeUndefined();
  });

  test('ofName() for non-string values`', () => {
    const nonExist = Gender.ofName(123);
    expect(nonExist).toBeUndefined();
  });

  test('ofName() for undefined`', () => {
    const nonExist = Gender.ofName(undefined);
    expect(nonExist).toBeUndefined();
  });

  test('ofName() for null`', () => {
    const nonExist = Gender.ofName(null);
    expect(nonExist).toBeUndefined();
  });
});

describe('Test the `Enum.hasName()', () => {
  test('hasName() for primitive string', () => {
    const male = Gender.hasName('男');
    expect(male).toBe(true);
    const female = Gender.hasName('女');
    expect(female).toBe(true);
  });

  test('hasName() for String object', () => {
    const male = Gender.hasName(new String('男'));
    expect(male).toBe(true);
    const female = Gender.hasName(new String('女'));
    expect(female).toBe(true);
  });

  test('hasName() for primitive string with spaces', () => {
    const male = Gender.hasName('  男');
    expect(male).toBe(true);
    const female = Gender.hasName('女  ');
    expect(female).toBe(true);
  });

  test('hasName() for String object with spaces', () => {
    const male = Gender.hasName(new String('  男'));
    expect(male).toBe(true);
    const female = Gender.hasName(new String('女  '));
    expect(female).toBe(true);
  });

  test('hasName() for non-exist primitive string`', () => {
    const nonExist = Gender.hasName('xxx');
    expect(nonExist).toBe(false);
  });

  test('hasName() for non-exist String object`', () => {
    const nonExist = Gender.hasName(new String('xxx'));
    expect(nonExist).toBe(false);
  });

  test('hasName() for non-string values`', () => {
    const nonExist = Gender.hasName(123);
    expect(nonExist).toBe(false);
  });

  test('hasName() for undefined`', () => {
    const nonExist = Gender.hasName(undefined);
    expect(nonExist).toBe(false);
  });

  test('hasName() for null`', () => {
    const nonExist = Gender.hasName(null);
    expect(nonExist).toBe(false);
  });
});

describe('Test the `Enum.ofCode()', () => {
  test('ofCode() for primitive string', () => {
    const male = GenderWithPayload.ofCode('1');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.ofCode('2');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('ofCode() for String object', () => {
    const male = GenderWithPayload.ofCode(new String('1'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.ofCode(new String('2'));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('ofCode() for primitive string with spaces', () => {
    const male = GenderWithPayload.ofCode('  1');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.ofCode('2  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('ofCode() for String object with spaces', () => {
    const male = GenderWithPayload.ofCode(new String('  1'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.ofCode(new String('2  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('ofCode() for non-exist primitive string`', () => {
    const nonExist = GenderWithPayload.ofCode('xxx');
    expect(nonExist).toBeUndefined();
  });

  test('ofCode() for non-exist String object`', () => {
    const nonExist = GenderWithPayload.ofCode(new String('xxx'));
    expect(nonExist).toBeUndefined();
  });

  test('ofCode() for non-string values`', () => {
    const nonExist = GenderWithPayload.ofCode(2);
    expect(nonExist).toBeUndefined();
  });

  test('ofCode() for undefined`', () => {
    const nonExist = GenderWithPayload.ofCode(undefined);
    expect(nonExist).toBeUndefined();
  });

  test('ofCode() for null`', () => {
    const nonExist = GenderWithPayload.ofCode(null);
    expect(nonExist).toBeUndefined();
  });
});

describe('Test the `Enum.hasCode()', () => {
  test('hasCode() for primitive string', () => {
    const male = GenderWithPayload.hasCode('1');
    expect(male).toBe(true);
    const female = GenderWithPayload.hasCode('2');
    expect(female).toBe(true);
  });

  test('hasCode() for String object', () => {
    const male = GenderWithPayload.hasCode(new String('1'));
    expect(male).toBe(true);
    const female = GenderWithPayload.hasCode(new String('2'));
    expect(female).toBe(true);
  });

  test('hasCode() for primitive string with spaces', () => {
    const male = GenderWithPayload.hasCode('  1');
    expect(male).toBe(true);
    const female = GenderWithPayload.hasCode('2  ');
    expect(female).toBe(true);
  });

  test('hasCode() for String object with spaces', () => {
    const male = GenderWithPayload.hasCode(new String('  1'));
    expect(male).toBe(true);
    const female = GenderWithPayload.hasCode(new String('2  '));
    expect(female).toBe(true);
  });

  test('hasCode() for non-exist primitive string`', () => {
    const nonExist = GenderWithPayload.hasCode('xxx');
    expect(nonExist).toBe(false);
  });

  test('hasCode() for non-exist String object`', () => {
    const nonExist = GenderWithPayload.hasCode(new String('xxx'));
    expect(nonExist).toBe(false);
  });

  test('hasCode() for non-string values`', () => {
    const nonExist = GenderWithPayload.hasCode(2);
    expect(nonExist).toBe(false);
  });

  test('hasCode() for undefined`', () => {
    const nonExist = GenderWithPayload.hasCode(undefined);
    expect(nonExist).toBe(false);
  });

  test('hasCode() for null`', () => {
    const nonExist = GenderWithPayload.hasCode(null);
    expect(nonExist).toBe(false);
  });
});

describe('Test the `Enum.of()', () => {
  test('of() for value of primitive string', () => {
    const male = GenderWithPayload.of('MALE');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of('FEMALE');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for value of String object', () => {
    const male = GenderWithPayload.of(new String('MALE'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(new String('FEMALE'));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for value of primitive string with spaces', () => {
    const male = GenderWithPayload.of('  MALE ');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(' FEMALE  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for value of String object with spaces`', () => {
    const male = GenderWithPayload.of(new String('  MALE '));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(new String(' FEMALE  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for value of primitive string with spaces and not all uppercase', () => {
    const male = GenderWithPayload.of('  MaLE ');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(' female  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for value of String object with spaces and not all uppercase`', () => {
    const male = GenderWithPayload.of(new String('  MaLE '));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(new String(' female  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for name of primitive string', () => {
    const male = GenderWithPayload.of('男');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of('女');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for name of String object', () => {
    const male = GenderWithPayload.of(new String('男'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(new String('女'));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for name of primitive string with spaces', () => {
    const male = GenderWithPayload.of('  男 ');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(' 女  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for name of String object with spaces`', () => {
    const male = GenderWithPayload.of(new String('  男 '));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    const female = GenderWithPayload.of(new String(' 女  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
  });

  test('of() for code of primitive string', () => {
    const male = GenderWithPayload.of('1');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.of('2');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('of() for code of String object', () => {
    const male = GenderWithPayload.of(new String('1'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.of(new String('2'));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('of() for code of primitive string with spaces', () => {
    const male = GenderWithPayload.of('  1');
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.of('2  ');
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('of() for code of String object with spaces', () => {
    const male = GenderWithPayload.of(new String('  1'));
    expect(male).toBeDefined();
    expect(male).not.toBeNull();
    expect(male).toBeInstanceOf(GenderWithPayload);
    expect(male.name).toBe('男');
    expect(male.value).toBe('MALE');
    expect(male.code).toBe('1');
    const female = GenderWithPayload.of(new String('2  '));
    expect(female).toBeDefined();
    expect(female).not.toBeNull();
    expect(female).toBeInstanceOf(GenderWithPayload);
    expect(female.name).toBe('女');
    expect(female.value).toBe('FEMALE');
    expect(female.code).toBe('2');
  });

  test('of() for non-exist primitive string`', () => {
    const nonExist = GenderWithPayload.of('xxx');
    expect(nonExist).toBeUndefined();
  });

  test('of() for non-exist String object`', () => {
    const nonExist = GenderWithPayload.of(new String('xxx'));
    expect(nonExist).toBeUndefined();
  });

  test('of() for non-string values`', () => {
    const nonExist = GenderWithPayload.of(123);
    expect(nonExist).toBeUndefined();
  });

  test('of() for undefined`', () => {
    const nonExist = GenderWithPayload.of(undefined);
    expect(nonExist).toBeUndefined();
  });

  test('of() for null`', () => {
    const nonExist = GenderWithPayload.of(null);
    expect(nonExist).toBeUndefined();
  });
});

describe('Test the `Enum.has()', () => {
  test('has() for value of primitive string', () => {
    const male = GenderWithPayload.has('MALE');
    expect(male).toBe(true);
    const female = GenderWithPayload.has('FEMALE');
    expect(female).toBe(true);
  });

  test('has() for value of String object', () => {
    const male = GenderWithPayload.has(new String('MALE'));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String('FEMALE'));
    expect(female).toBe(true);
  });

  test('has() for value of primitive string with spaces', () => {
    const male = GenderWithPayload.has('  MALE ');
    expect(male).toBe(true);
    const female = GenderWithPayload.has(' FEMALE  ');
    expect(female).toBe(true);
  });

  test('has() for value of String object with spaces`', () => {
    const male = GenderWithPayload.has(new String('  MALE '));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String(' FEMALE  '));
    expect(female).toBe(true);
  });

  test('has() for value of primitive string with spaces and not all uppercase', () => {
    const male = GenderWithPayload.has('  MaLE ');
    expect(male).toBe(true);
    const female = GenderWithPayload.has(' female  ');
    expect(female).toBe(true);
  });

  test('has() for value of String object with spaces and not all uppercase`', () => {
    const male = GenderWithPayload.has(new String('  MaLE '));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String(' female  '));
    expect(female).toBe(true);
  });

  test('has() for name of primitive string', () => {
    const male = GenderWithPayload.has('男');
    expect(male).toBe(true);
    const female = GenderWithPayload.has('女');
    expect(female).toBe(true);
  });

  test('has() for name of String object', () => {
    const male = GenderWithPayload.has(new String('男'));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String('女'));
    expect(female).toBe(true);
  });

  test('has() for name of primitive string with spaces', () => {
    const male = GenderWithPayload.has('  男 ');
    expect(male).toBe(true);
    const female = GenderWithPayload.has(' 女  ');
    expect(female).toBe(true);
  });

  test('has() for name of String object with spaces`', () => {
    const male = GenderWithPayload.has(new String('  男 '));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String(' 女  '));
    expect(female).toBe(true);
  });

  test('has() for code of primitive string', () => {
    const male = GenderWithPayload.has('1');
    expect(male).toBe(true);
    const female = GenderWithPayload.has('2');
    expect(female).toBe(true);
  });

  test('has() for code of String object', () => {
    const male = GenderWithPayload.has(new String('1'));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String('2'));
    expect(female).toBe(true);
  });

  test('has() for code of primitive string with spaces', () => {
    const male = GenderWithPayload.has('  1');
    expect(male).toBe(true);
    const female = GenderWithPayload.has('2  ');
    expect(female).toBe(true);
  });

  test('has() for code of String object with spaces', () => {
    const male = GenderWithPayload.has(new String('  1'));
    expect(male).toBe(true);
    const female = GenderWithPayload.has(new String('2  '));
    expect(female).toBe(true);
  });

  test('has() for non-exist primitive string`', () => {
    const nonExist = GenderWithPayload.has('xxx');
    expect(nonExist).toBe(false);
  });

  test('has() for non-exist String object`', () => {
    const nonExist = GenderWithPayload.has(new String('xxx'));
    expect(nonExist).toBe(false);
  });

  test('has() for non-string values`', () => {
    const nonExist = GenderWithPayload.has(123);
    expect(nonExist).toBe(false);
  });

  test('has() for undefined`', () => {
    const nonExist = GenderWithPayload.has(undefined);
    expect(nonExist).toBe(false);
  });

  test('has() for null`', () => {
    const nonExist = GenderWithPayload.has(null);
    expect(nonExist).toBe(false);
  });
});
