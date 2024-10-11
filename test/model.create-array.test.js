////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { mount } from '@vue/test-utils';
import { DefaultOptions } from '../src';
import ChildObj from './model/child-obj';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import CredentialWithWrongNormalizer
  from './model/credential-with-wrong-normalizer';
import ObjWithArrayField from './model/obj-with-array-field';
import ObjWithArrayFieldsOfWrongNormalize
  from './model/obj-with-array-fields-of-wrong-normalize';
import ObjWithNamingConversion from './model/obj-with-naming-conversion';
import ObjWithPersonField from './model/ObjWithPersonField';
import Person from './model/person';
import ArrayWrapper from './model/vue-array-wrapper';

describe('Test static method `createArray()`', () => {
  test('Test `Person.createArray(null)`', () => {
    const result = Person.createArray(null);
    expect(result).toBeNull();
  });
  test('Test `Person.createArray(undefined)`', () => {
    const result = Person.createArray(undefined);
    expect(result).toBeNull();
  });
  test('Test `Person.createArray([])`', () => {
    const result = Person.createArray([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
  test('Test `Person.createArray()`', () => {
    const array = [{
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 63,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    }, {
      name: 'Jack Ma',
      age: 55,
      credential: {
        type: '',
        number: null,
      },
    }, null];
    const result = Person.createArray(array);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(Person);
    expect(result[0].id).toBe(array[0].id);
    expect(result[0].name).toBe(array[0].name);
    expect(result[0].age).toBe(array[0].age);
    expect(result[0].gender).toBe('');
    expect(result[0].mobile).toBe(array[0].mobile);
    expect(result[0].credential).toBeInstanceOf(Credential);
    expect(result[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result[0].credential.number).toBe(array[0].credential.number);
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBeNull();
    expect(result[1].credential.number).toBe('');
    expect(result[2]).toBeNull();
  });
  test('`Person.createArray()` should call `Credential.normalize()`', () => {
    let result = Person.createArray(null);
    expect(result).toBeNull();
    result = Person.createArray(undefined);
    expect(result).toBeNull();
    result = Person.createArray([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    const array = [{
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 63,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567xx',
      },
    }, {
      name: 'Jack Ma',
      age: 55,
      credential: {
        type: '',
        number: null,
      },
    }, null];
    result = Person.createArray(array);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(Person);
    expect(result[0].id).toBe(array[0].id);
    expect(result[0].name).toBe(array[0].name);
    expect(result[0].age).toBe(array[0].age);
    expect(result[0].gender).toBe('');
    expect(result[0].mobile).toBe(array[0].mobile);
    expect(result[0].credential).toBeInstanceOf(Credential);
    expect(result[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result[0].credential.number).toBe('1234567XX');
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBeNull();
    expect(result[1].credential.number).toBe('');
    expect(result[2]).toBeNull();

    result = Person.createArray(array, { normalize: true });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(Person);
    expect(result[0].id).toBe(array[0].id);
    expect(result[0].name).toBe(array[0].name);
    expect(result[0].age).toBe(array[0].age);
    expect(result[0].gender).toBe('');
    expect(result[0].mobile).toBe(array[0].mobile);
    expect(result[0].credential).toBeInstanceOf(Credential);
    expect(result[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result[0].credential.number).toBe('1234567XX');
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBeNull();
    expect(result[1].credential.number).toBe('');
    expect(result[2]).toBeNull();

    result = Person.createArray(array, { normalize: false });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(Person);
    expect(result[0].id).toBe(array[0].id);
    expect(result[0].name).toBe(array[0].name);
    expect(result[0].age).toBe(array[0].age);
    expect(result[0].gender).toBe('');
    expect(result[0].mobile).toBe(array[0].mobile);
    expect(result[0].credential).toBeInstanceOf(Credential);
    expect(result[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result[0].credential.number).toBe(array[0].credential.number);
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBeNull();
    expect(result[1].credential.number).toBeNull();
    expect(result[2]).toBeNull();
  });
  test('`Credential.createArray()` should handle the array managed by `Vue`', () => {
    const wrapper = mount(ArrayWrapper);
    expect(wrapper.vm.array).toBeDefined();
    expect(wrapper.vm.array).not.toBeNull();
    const result = Credential.createArray(wrapper.vm.array);
    expect(result).toBeArray();
    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(Credential);
    expect(result[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(result[0].number).toBe('00000000');
    expect(result[1]).toBeInstanceOf(Credential);
    expect(result[1].type).toBe(CredentialType.PASSPORT);
    expect(result[1].number).toBe('XXXXXXXX');
    expect(result[2].type).toBe(CredentialType.IDENTITY_CARD);
    expect(result[2].number).toBe('99999999');
    const obj = ObjWithArrayField.create(wrapper.vm.obj);
    expect(obj).toBeInstanceOf(ObjWithArrayField);
    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(3);
    expect(obj.credentials[0]).toBeInstanceOf(Credential);
    expect(obj.credentials[0].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentials[0].number).toBe('00000000');
    expect(obj.credentials[1]).toBeInstanceOf(Credential);
    expect(obj.credentials[1].type).toBe(CredentialType.PASSPORT);
    expect(obj.credentials[1].number).toBe('XXXXXXXX');
    expect(obj.credentials[2].type).toBe(CredentialType.IDENTITY_CARD);
    expect(obj.credentials[2].number).toBe('99999999');
  });
  test('`Credential.createArray()` should handle incorrect `normalize()`', () => {
    const data = {
      credentials: [
        { type: 'IDENTITY_CARD', number: '00000000' },
        { type: 'PASSPORT', number: 'xxxxxxxx' },
        { type: 'IDENTITY_CARD', number: '99999999' },
      ],
    };
    const obj = ObjWithArrayFieldsOfWrongNormalize.create(data);
    expect(obj).toBeInstanceOf(ObjWithArrayFieldsOfWrongNormalize);
    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(3);
    expect(obj.credentials[0]).toBeInstanceOf(CredentialWithWrongNormalizer);
    expect(obj.credentials[0].type).toBe('IDENTITY_CARD');
    expect(obj.credentials[0].number).toBe('00000000');
    expect(obj.credentials[1]).toBeInstanceOf(CredentialWithWrongNormalizer);
    expect(obj.credentials[1].type).toBe('PASSPORT');
    expect(obj.credentials[1].number).toBe('XXXXXXXX');
    expect(obj.credentials[2].type).toBe('IDENTITY_CARD');
    expect(obj.credentials[2].number).toBe('99999999');
  });
  test('`createArray()` with naming conversion options', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = CredentialType.PASSPORT;
    person.credential.number = '1234567';
    const obj = {
      first_field: 'first-field',
      second_field: {
        first_child_field: 'first-child-field',
        second_child_field: {
          the_person: person,
        },
      },
    };
    const result = ObjWithNamingConversion.createArray([obj], {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });
    expect(result).toBeArray();
    expect(result.length).toBe(1);
    expect(result[0].firstField).toBe('first-field');
    expect(result[0].secondField).toBeInstanceOf(ChildObj);
    expect(result[0].secondField.firstChildField).toBe('first-child-field');
    expect(result[0].secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result[0].secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result[0].secondField.secondChildField.thePerson).toEqual(person);
    expect(result[0].secondField.secondChildField.thePerson).not.toBe(person);
  });
  test('`createArray()` with default naming conversion options', () => {
    const person = new Person();
    person.id = 'xxxx';
    person.name = 'Bill Gates';
    person.age = 55;
    person.mobile = '139280384745';
    person.credential.type = CredentialType.PASSPORT;
    person.credential.number = '1234567';
    const obj = {
      first_field: 'first-field',
      second_field: {
        first_child_field: 'first-child-field',
        second_child_field: {
          the_person: person,
        },
      },
    };
    DefaultOptions.set('assign', { convertNaming: true });
    const result = ObjWithNamingConversion.createArray([obj]);
    expect(result).toBeArray();
    expect(result.length).toBe(1);
    expect(result[0].firstField).toBe('first-field');
    expect(result[0].secondField).toBeInstanceOf(ChildObj);
    expect(result[0].secondField.firstChildField).toBe('first-child-field');
    expect(result[0].secondField.secondChildField).toBeInstanceOf(ObjWithPersonField);
    expect(result[0].secondField.secondChildField.thePerson).toBeInstanceOf(Person);
    expect(result[0].secondField.secondChildField.thePerson).toEqual(person);
    expect(result[0].secondField.secondChildField.thePerson).not.toBe(person);
    DefaultOptions.set('assign', { convertNaming: false });
  });
});
