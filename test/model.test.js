////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { mount } from '@vue/test-utils';
import { Page } from '../src';
import classMetadataCache from '../src/impl/class-metadata-cache';
import { KEY_CLASS_CATEGORY } from '../src/impl/metadata-keys';
import { getClassMetadata, getDefaultInstance } from '../src/impl/utils';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import CredentialWithWrongNormalizer
  from './model/credential-with-wrong-normalizer';
import Person from './model/person';
import Parent from './model/parent';
import Child from './model/child';
import PersonWithEquals from './model/person-with-equals';
import PersonChild from './model/person-child';
import ArrayWrapper from './model/vue-array-wrapper';
import PageWrapper from './model/vue-page-wrapper';
import ObjWithArrayField from './model/obj-with-array-field';
import ObjWithArrayFieldsOfWrongNormalize from './model/obj-with-array-fields-of-wrong-normalize';

describe('Test the meta information of the decorated class', () => {
  test('The category meta-attribute of the decorated class must be "model"', () => {
    const value = getClassMetadata(Person, KEY_CLASS_CATEGORY);
    expect(value).toBe('model');
  });
  test('The constructor of the decorated class should be correct', () => {
    const person = new Person();
    console.log('person.constructor = ', person.constructor);
    console.log('person.prototype = ', Object.getPrototypeOf(person));
    console.log('Person.prototype.constructor = ', Person.prototype.constructor);
    console.log('Person.prototype = ', Person.prototype);
    expect(person.constructor).toBe(Person);
    expect(Person.prototype.constructor).toBe(Person);
    expect(Object.getPrototypeOf(person)).toBe(Person.prototype);
  });
});

describe('Test the default instance of the decorated class', () => {
  test('The metadata of the decorated class should store a default instance', () => {
    const defaultIntance = getDefaultInstance(Person);
    expect(defaultIntance).toEqual(new Person());
  });
});

describe('Test the prototype method `clone()`', () => {
  test('Test `Person.prototype.clone()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: 'xx1234567',
      },
    };
    const person = new Person();
    person.assign(data, false);
    const result = person.clone();
    expect(result).toBeInstanceOf(Person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
  });
});

describe('Test the prototype method `isEmpty()`', () => {
  test('Test `Person.prototype.isEmpty()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    };
    const person = new Person();
    expect(person.isEmpty()).toBe(true);
    person.assign(data);
    expect(person.isEmpty()).toBe(false);
    person.clear();
    expect(person.isEmpty()).toBe(true);
    person.credential.type = CredentialType.PASSPORT;
    expect(person.isEmpty()).toBe(false);
  });
});

describe('Test the prototype method `equals()`', () => {
  test('Test `Person.prototype.equals()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    };
    const person = new Person();
    person.assign(data);
    const result = person.clone();
    expect(result.equals(person)).toBe(true);
    expect(result.equals(data)).toBe(false);
    person.credential.number = 'xxx';
    expect(result.equals(person)).toBe(false);
    expect(result.equals(null)).toBe(false);
    expect(result.equals(undefined)).toBe(false);
    expect(result.equals(result)).toBe(true);
  });
  test('The @Model should not override the customized prototype method `equals()`', () => {
    const p1 = PersonWithEquals.create({
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    });
    const p2 = PersonWithEquals.create({
      id: 'xxxxx',
      name: 'XXXX',
      age: 55,
      mobile: 'wwww',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    });
    expect(p1.equals(p2)).toBe(true);
    const p3 = PersonWithEquals.create({
      id: 'xxxxx',
      name: 'XXXX',
      age: 55,
      mobile: 'wwww',
      credential: {
        type: 'PASSPORT',
        number: 'xxxx',
      },
    });
    expect(p1.equals(p3)).toBe(false);
  });
});

describe('Test the prototype method `generateId()`', () => {
  test('Test `Person.prototype.generateId()`', () => {
    expect(Object.prototype.hasOwnProperty.call(Person.prototype, 'generateId')).toBe(true);
    const p1 = new Person();
    expect(p1.id).toBe('');
    const id1 = p1.generateId();
    expect(typeof id1).toBe('string');
    expect(id1).toBe(p1.id);
    expect(id1).not.toBe('');

    const p2 = new Person();
    expect(p2.id).toBe('');
    const id2 = p2.generateId();
    expect(typeof id2).toBe('string');
    expect(id2).toBe(p2.id);
    expect(id2).not.toBe('');

    expect(id1).not.toBe(id2);
  });
  test('`Credential` classes should not have a `generateId()` prototype method', () => {
    expect(Object.hasOwn(Credential.prototype, 'generateId'))
      .toBe(false);
  });
  test('The `PersonChild` class that inherits from `Person` should not redefine the `generateId()`', () => {
    expect(Object.hasOwn(PersonChild.prototype, 'generateId'))
      .toBe(false);
  });
  test('`PersonChild` class should inherit the `generateId()` from `Person`', () => {
    const p1 = new PersonChild();
    expect(p1.id).toBe('');
    const id1 = p1.generateId();
    expect(typeof id1).toBe('string');
    expect(id1).toBe(p1.id);
    expect(id1).not.toBe('');

    const p2 = new PersonChild();
    expect(p2.id).toBe('');
    const id2 = p2.generateId();
    expect(typeof id2).toBe('string');
    expect(id2).toBe(p2.id);
    expect(id2).not.toBe('');

    expect(id1).not.toBe(id2);
  });
});

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
});

describe('Test the static method `create()`', () => {
  test('Test `Person.create()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'PASSPORT',
        number: '1234567',
      },
    };
    let result = Person.create(null);
    expect(result).toBeNull();

    result = Person.create(undefined);
    expect(result).toBeNull();

    result = Person.create(data);
    expect(result).toBeInstanceOf(Person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe(data.credential.number);
  });
  test('`Person.create()` should call `Credential.normalize()`', () => {
    const data = {
      id: 'xxxxx',
      name: 'Bill Gates',
      age: 55,
      mobile: '139280384745',
      credential: {
        type: 'passport',
        number: 'xx1234567',
      },
    };
    let result = Person.create(data);       // normalize == true
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('XX1234567');

    result = Person.create(data, false);      // normalize == false
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(CredentialType.PASSPORT);
    expect(result.credential.number).toBe('xx1234567');
  });
  test('`create()` should work with enumerator field in data object', () => {
    const data = { type: CredentialType.PASSPORT, number: '12345' };
    const credential = Credential.create(data, true);
    expect(credential.type).toBe(CredentialType.PASSPORT);
    expect(credential.number).toBe('12345');
  });
});

describe('Test static method `createArray()`', () => {
  test('Test `Person.createArray()`', () => {
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
        type: 'passport',
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

    result = Person.createArray(array, true);
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

    result = Person.createArray(array, false);
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
    }
    const obj = ObjWithArrayFieldsOfWrongNormalize.create(data);
    expect(obj).toBeInstanceOf(ObjWithArrayFieldsOfWrongNormalize);
    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(3);
    expect(obj.credentials[0]).toBeInstanceOf(CredentialWithWrongNormalizer);
    expect(obj.credentials[0].type).toBe(Credential.IDENTITY_CARD);
    expect(obj.credentials[0].number).toBe('00000000');
    expect(obj.credentials[1]).toBeInstanceOf(CredentialWithWrongNormalizer);
    expect(obj.credentials[1].type).toBe(Credential.PASSPORT);
    expect(obj.credentials[1].number).toBe('XXXXXXXX');
    expect(obj.credentials[2].type).toBe(Credential.IDENTITY_CARD);
    expect(obj.credentials[2].number).toBe('99999999');
  });
});

describe('Test static method `createPage()`', () => {
  test('Test `Person.createPage(undefined)`', () => {
    const result = Person.createPage(undefined);
    expect(result).toBeNull();
  });
  test('Test `Person.createPage(null)`', () => {
    const result = Person.createPage(null);
    expect(result).toBeNull();
  });
  test('Test `Person.createPage("")`', () => {
    expect(() => Person.createPage(''))
    .toThrowWithMessage(TypeError, 'Invalid page format: ""');
  });
  test('Test `Person.createPage("xx")`', () => {
    expect(() => Person.createPage('xx'))
    .toThrowWithMessage(TypeError, 'Invalid page format: "xx"');
  });
  test('Test `Person.createPage({ xx: 123 })`', () => {
    expect(() => Person.createPage({ xx: 123 }))
    .toThrowWithMessage(TypeError, 'Invalid page format: {"xx":123}');
  });
  test('Test `Person.createPage({ page_index: 0, page_size: 10 })`', () => {
    expect(() => Person.createPage({ page_index: 0, page_size: 10 }))
    .toThrowWithMessage(TypeError, 'Invalid page format: {"page_index":0,"page_size":10}');
  });
  test('Test `Person.createPage(emptyPage)`', () => {
    const result = Person.createPage({
      total_count: 0,
      total_pages: 0,
      page_index: 0,
      page_size: 10,
      content: [],
    });
    expect(result).toEqual(new Page(0, 0, 0, 10, []));
  });
  test('Test `Person.createPage(nonEmptyPage)`', () => {
    const page = {
      total_count: 3,
      total_pages: 1,
      page_index: 0,
      page_size: 5,
      content: [{
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
      },
        null,
      ],
    };
    const result = Person.createPage(page);
    expect(result).toBeInstanceOf(Page);
    expect(result.total_count).toBe(3);
    expect(result.total_pages).toBe(1);
    expect(result.page_index).toBe(0);
    expect(result.page_size).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(3);
    expect(result.content[0]).toBeInstanceOf(Person);
    expect(result.content[0].id).toBe(page.content[0].id);
    expect(result.content[0].name).toBe(page.content[0].name);
    expect(result.content[0].age).toBe(page.content[0].age);
    expect(result.content[0].gender).toBe('');
    expect(result.content[0].mobile).toBe(page.content[0].mobile);
    expect(result.content[0].credential).toBeInstanceOf(Credential);
    expect(result.content[0].credential.type).toBe(CredentialType.PASSPORT);
    expect(result.content[0].credential.number).toBe(page.content[0].credential.number);
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(page.content[1].name);
    expect(result.content[1].age).toBe(page.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBeNull();
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
  test('`Person.createArray()` should call `Credential.normalize()`', () => {
    const page = {
      total_count: 3,
      total_pages: 1,
      page_index: 0,
      page_size: 5,
      content: [{
        id: 'xxxxx',
        name: 'Bill Gates',
        age: 63,
        mobile: '139280384745',
        credential: {
          type: 'passport',
          number: '1234567xx',
        },
      }, {
        name: 'Jack Ma',
        age: 55,
        credential: {
          type: '',
          number: null,
        },
      },
        null,
      ],
    };
    const result = Person.createPage(page);
    expect(result).toBeInstanceOf(Page);
    expect(result.total_count).toBe(3);
    expect(result.total_pages).toBe(1);
    expect(result.page_index).toBe(0);
    expect(result.page_size).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(3);
    expect(result.content[0]).toBeInstanceOf(Person);
    expect(result.content[0].id).toBe(page.content[0].id);
    expect(result.content[0].name).toBe(page.content[0].name);
    expect(result.content[0].age).toBe(page.content[0].age);
    expect(result.content[0].gender).toBe('');
    expect(result.content[0].mobile).toBe(page.content[0].mobile);
    expect(result.content[0].credential).toBeInstanceOf(Credential);
    expect(result.content[0].credential.type).toBe(Credential.PASSPORT);
    expect(result.content[0].credential.number).toBe('1234567XX');
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(page.content[1].name);
    expect(result.content[1].age).toBe(page.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBeNull();
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
  test('`Credential.createArray()` should handle the page managed by Vue', () => {
    const wrapper = mount(PageWrapper);
    expect(wrapper.vm.page).toBeDefined();
    expect(wrapper.vm.page).not.toBeNull();
    const result = Credential.createPage(wrapper.vm.page);
    expect(result.total_count).toBe(2);
    expect(result.total_pages).toBe(1);
    expect(result.page_index).toBe(0);
    expect(result.page_size).toBe(5);
    expect(result.content).toBeArray();
    expect(result.content.length).toBe(2);
    expect(result.content[0]).toBeInstanceOf(Credential);
    expect(result.content[0].type).toBe(Credential.IDENTITY_CARD);
    expect(result.content[0].number).toBe('12345678');
    expect(result.content[1]).toBeInstanceOf(Credential);
    expect(result.content[1].type).toBe(Credential.PASSPORT);
    expect(result.content[1].number).toBe('ABCDEFGH');
  });
});

/*
describe('测试@Model类装饰器添加的实例方法validate()', () => {
});

*/

// describe('测试@Model类装饰器添加的静态类方法nullOrEmpty()', () => {
//   test('测试Person.nullOrEmpty(undefined), ', () => {
//     const person = undefined;
//     const result = Person.nullOrEmpty(person);
//     expect(result).toBe(true);
//   });
//   test('测试Person.nullOrEmpty(null), ', () => {
//     const person = null;
//     const result = Person.nullOrEmpty(person);
//     expect(result).toBe(true);
//   });
//   test('测试Person.nullOrEmpty(<empty person>), ', () => {
//     const person = new Person();
//     const result = Person.nullOrEmpty(person);
//     expect(result).toBe(true);
//   });
//   test('测试Person.nullOrEmpty(<non-empty person>), ', () => {
//     const person = new Person();
//     person.name = '张三'
//     const result = Person.nullOrEmpty(person);
//     expect(result).toBe(false);
//   });
//   test('测试Person.nullOrEmpty(<a Credential instance>), ', () => {
//     const credential = new Credential();
//     expect(() => Person.nullOrEmpty(credential))
//       .toThrowWithMessage(TypeError, 'The object must be an instance of the class Person.');
//   });
// });
