/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { mount } from '@vue/test-utils';
import { getClassMetadataObject, getClassMetadata, getDefaultInstance } from '@/impl/utils';
import Credential from './model/credential';
import CredentialType from './model/credential-type';
import Person from './model/person';
import PersonWithEquals from './model/person-with-equals';
import PersonChild from './model/person-child';
import Parent from './model/parent';
import Child from './model/child';
import ArrayWrapper from './model/vue-array-wrapper';
import PageWrapper from './model/vue-page-wrapper';
import ObjWithArrayField from './model/obj-with-array-field';
import Page from '../src/models/Page';

describe('测试@Model类装饰器添加的元信息', () => {
  test('测试 Person 类的 metadata 对象', () => {
    const metadata = getClassMetadataObject(Person);
    expect(metadata).not.toBeNull();
    console.log('Person.metadata = ', metadata);
  });
  test('测试 @Model 修饰的类的 category 元属性是否为 "model"', () => {
    const value = getClassMetadata(Person, 'category');
    expect(value).toBe('model');
  });
  test('验证被@Model修改后的类的原型的constructor是否正确', () => {
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

describe('测试@Model类装饰器添加的静态类成员DEFAULT_INSTANCE', () => {
  test('测试 Person 类的 default instance 对象', () => {
    const defaultIntance = getDefaultInstance(Person);
    expect(defaultIntance).toEqual(new Person());
  });
});

describe('测试@Model类装饰器添加的实例方法assign()', () => {
  test('测试实例方法 Person.prototype.assign()', () => {
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
    let result = person.assign(data);
    expect(result).toBe(person);            // assign() 必须返回该对象的引用
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(data.credential.type);
    expect(result.credential.number).toBe(data.credential.number);

    result = person.assign(null);
    expect(result).toBe(person);            // assign() 必须返回该对象的引用
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.age).toBe(0);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe('');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe('IDENTITY_CARD');
    expect(result.credential.number).toBe('');

    result = person.assign(undefined);
    expect(result).toBe(person);            // assign() 必须返回该对象的引用
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.age).toBe(0);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe('');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe('IDENTITY_CARD');
    expect(result.credential.number).toBe('');
  });
  test('测试实例方法 Person.prototype.assign() 是否调用 Credential.normalize() 方法', () => {
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
    const person = new Person();
    let result = person.assign(data);       // normalize == true
    expect(result).toBe(person);            // assign() 必须返回该对象的引用
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe('PASSPORT');
    expect(result.credential.number).toBe('XX1234567');

    result = person.assign(data, false);    // normalize == false
    expect(result).toBe(person);            // assign() 必须返回该对象的引用
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe('passport');
    expect(result.credential.number).toBe('xx1234567');
  });
  test('测试继承类Child.assign()，应该调用其父类 Parent.assign()', () => {
    const data = {
      x: 1,
      z: 'abc',
      message: 'hello',
    };
    const parent = new Parent();
    parent.assign(data, true);
    expect(parent.x).toBe(1);
    expect(parent.y).toBe(0);
    expect(parent.z).toBe('ABC');

    const child = new Child();
    child.assign(data, true);
    expect(child.message).toBe('HELLO');
    expect(child.x).toBe(1);
    expect(child.y).toBe(0);
    expect(child.z).toBe('ABC');
  });
});

describe('测试@Model类装饰器添加的实例方法clear()', () => {
  test('测试实例方法 Person.prototype.clear()', () => {
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
    const result = person.clear();
    expect(result).toBe(person);            // clear() 必须返回该对象的引用
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.age).toBe(0);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe('');
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe('IDENTITY_CARD');
    expect(result.credential.number).toBe('');
  });
});

describe('测试@Model类装饰器添加的实例方法clone()', () => {
  test('测试实例方法 Person.prototype.clone()', () => {
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
    expect(result).toBeInstanceOf(Person);
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe(data.credential.type);
    expect(result.credential.number).toBe(data.credential.number);
  });
});

describe('测试@Model类装饰器添加的实例方法isEmpty()', () => {
  test('测试实例方法 Person.prototype.isEmpty()', () => {
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
    person.credential.type = 'PASSPORT';
    expect(person.isEmpty()).toBe(false);
  });
});

describe('测试@Model类装饰器添加的实例方法equals()', () => {
  test('测试实例方法 Person.prototype.equals()', () => {
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
  test('测试 @Model 添加的方法equals()是否会覆盖原型已有自定义equals()方法', () => {
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

describe('测试@Model类装饰器添加的实例方法normalize()', () => {
  test('测试继承类Child.normalize()，应该调用其父类 Parent.normalize()', () => {
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

describe('测试@Model类装饰器添加的实例方法validate()', () => {
});

describe('测试@Model类装饰器添加的实例方法generateId()', () => {
  test('测试Person.prototype.generateId()', () => {
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
  test('Credential类不应有generateId()实例方法', () => {
    expect(Object.prototype.hasOwnProperty.call(Credential.prototype, 'generateId')).toBe(false);
  });
  test('继承自Person的PersonChild类不应重复定义generateId()实例方法', () => {
    expect(Object.prototype.hasOwnProperty.call(PersonChild.prototype, 'generateId')).toBe(false);
  });
  test('继承自Person的PersonChild类的实例应继承其父类的generateId()实例方法', () => {
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

describe('测试@Model类装饰器添加的静态类方法create()', () => {
  test('测试类方法 Person.create()', () => {
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
    expect(result.credential.type).toBe(data.credential.type);
    expect(result.credential.number).toBe(data.credential.number);
  });
  test('测试实例方法 Person.create() 是否调用 Credential.normalize() 方法', () => {
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
    expect(result.credential.type).toBe('PASSPORT');
    expect(result.credential.number).toBe('XX1234567');

    result = Person.create(data, false);      // normalize == false
    expect(result.id).toBe(data.id);
    expect(result.name).toBe(data.name);
    expect(result.age).toBe(data.age);
    expect(result.gender).toBe('');
    expect(result.mobile).toBe(data.mobile);
    expect(result.credential).toBeInstanceOf(Credential);
    expect(result.credential.type).toBe('passport');
    expect(result.credential.number).toBe('xx1234567');
  });
  test('测试 @Model 添加的方法create()对于错误的Credential.type类型是否work', () => {
    const data = { type: CredentialType.PASSPORT, number: '12345' };
    const credential = Credential.create(data, true);
    expect(credential.type).toBe(CredentialType.PASSPORT.value);
    expect(credential.number).toBe('12345');
  });
});

describe('测试@Model类装饰器添加的静态类方法createArray()', () => {
  test('测试类方法 Person.createArray()', () => {
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
    expect(result[0].credential.type).toBe(array[0].credential.type);
    expect(result[0].credential.number).toBe(array[0].credential.number);

    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBe(array[1].credential.type);
    expect(result[1].credential.number).toBe('');

    expect(result[2]).toBeNull();
  });
  test('测试类方法 Person.createArray() 是否调用 Credential.normalize() 方法', () => {
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
    expect(result[0].credential.type).toBe('PASSPORT');
    expect(result[0].credential.number).toBe('1234567XX');
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBe(array[1].credential.type);
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
    expect(result[0].credential.type).toBe('PASSPORT');
    expect(result[0].credential.number).toBe('1234567XX');
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBe(array[1].credential.type);
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
    expect(result[0].credential.type).toBe(array[0].credential.type);
    expect(result[0].credential.number).toBe(array[0].credential.number);
    expect(result[1]).toBeInstanceOf(Person);
    expect(result[1].id).toBe('');
    expect(result[1].name).toBe(array[1].name);
    expect(result[1].age).toBe(array[1].age);
    expect(result[1].gender).toBe('');
    expect(result[1].mobile).toBe('');
    expect(result[1].credential).toBeInstanceOf(Credential);
    expect(result[1].credential.type).toBe(array[1].credential.type);
    expect(result[1].credential.number).toBe('');
    expect(result[2]).toBeNull();
  });
  test('测试类方法 Credential.createArray() 是否可正确处理Vue托管的array', () => {
    const wrapper = mount(ArrayWrapper);
    expect(wrapper.vm.array).toBeDefined();
    expect(wrapper.vm.array).not.toBeNull();
    const result = Credential.createArray(wrapper.vm.array);
    expect(result).toBeArray();
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(Credential);
    expect(result[0].type).toBe('IDENTITY_CARD');
    expect(result[0].number).toBe('12345678');
    expect(result[1]).toBeInstanceOf(Credential);
    expect(result[1].type).toBe('PASSPORT');
    expect(result[1].number).toBe('ABCDEFGH');
    const obj = ObjWithArrayField.create(wrapper.vm.array);
    expect(obj).toBeInstanceOf(ObjWithArrayField);
    expect(obj.credentials).toBeArray();
    expect(obj.credentials.length).toBe(2);
    expect(obj.credentials[0]).toBeInstanceOf(Credential);
    expect(obj.credentials[0].type).toBe('IDENTITY_CARD');
    expect(obj.credentials[0].number).toBe('12345678');
    expect(obj.credentials[1]).toBeInstanceOf(Credential);
    expect(obj.credentials[1].type).toBe('PASSPORT');
    expect(obj.credentials[1].number).toBe('ABCDEFGH');
  });
});

describe('测试@Model类装饰器添加的静态类方法createPage()', () => {
  test('Person.createPage(undefined)', () => {
    const result = Person.createPage(undefined);
    expect(result).toBeNull();
  });
  test('Person.createPage(null)', () => {
    const result = Person.createPage(null);
    expect(result).toBeNull();
  });
  test('Person.createPage("")', () => {
    const result = Person.createPage('');
    expect(result).toBeNull();
  });
  test('Person.createPage("xx")', () => {
    const result = Person.createPage('xx');
    expect(result).toBeNull();
  });
  test('Person.createPage({ xx: 123 })', () => {
    const result = Person.createPage({ xx: 123 });
    expect(result).toBeNull();
  });
  test('Person.createPage({ page_index: 0, page_size: 10 })', () => {
    const result = Person.createPage({ page_index: 0, page_size: 10 });
    expect(result).toBeNull();
  });
  test('Person.createPage(), 空页', () => {
    const result = Person.createPage({
      total_count: 0,
      total_pages: 0,
      page_index: 0,
      page_size: 10,
      content: [],
    });
    expect(result).toEqual(new Page(0, 0, 0, 10, []));
  });
  test('Person.createPage(), 非空页', () => {
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
    expect(result.content[0].credential.type).toBe(page.content[0].credential.type);
    expect(result.content[0].credential.number).toBe(page.content[0].credential.number);
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(page.content[1].name);
    expect(result.content[1].age).toBe(page.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBe(page.content[1].credential.type);
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
  test('测试类方法 Person.createArray() 是否调用 Credential.normalize() 方法', () => {
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
    expect(result.content[0].credential.type).toBe('PASSPORT');
    expect(result.content[0].credential.number).toBe('1234567XX');
    expect(result.content[1]).toBeInstanceOf(Person);
    expect(result.content[1].id).toBe('');
    expect(result.content[1].name).toBe(page.content[1].name);
    expect(result.content[1].age).toBe(page.content[1].age);
    expect(result.content[1].gender).toBe('');
    expect(result.content[1].mobile).toBe('');
    expect(result.content[1].credential).toBeInstanceOf(Credential);
    expect(result.content[1].credential.type).toBe(page.content[1].credential.type);
    expect(result.content[1].credential.number).toBe('');
    expect(result.content[2]).toBeNull();
  });
  test('测试类方法 Credential.createArray() 是否可正确处理Vue托管的page', () => {
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
    expect(result.content[0].type).toBe('IDENTITY_CARD');
    expect(result.content[0].number).toBe('12345678');
    expect(result.content[1]).toBeInstanceOf(Credential);
    expect(result.content[1].type).toBe('PASSPORT');
    expect(result.content[1].number).toBe('ABCDEFGH');
  });
});

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
