////////////////////////////////////////////////////////////////////////////////
import ElementType from '../src/element-type';
import Enum from '../src/enum';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Model from '../src/model';
import Type from '../src/type';

/**
 * 此测试文件专门用于提高model.js文件的分支覆盖率。
 * 尤其针对model.js文件的第259行附近可能存在的未覆盖分支。
 */
describe('Model decorator branch coverage tests', () => {
  // 测试Model装饰器应用于非类的情况
  test('should throw TypeError when applied to non-class', () => {
    // 尝试将Model装饰器应用于非类的情况应该抛出错误
    expect(() => {
      // @ts-ignore
      Model({}, { kind: 'property' });
    }).toThrow(TypeError);

    expect(() => {
      // @ts-ignore
      Model('not a class', { kind: 'class' });
    }).toThrow(TypeError);
  });

  // 测试Model装饰器的上下文参数无效的情况
  test('should throw TypeError when context is invalid', () => {
    expect(() => {
      // @ts-ignore
      Model(class TestClass {}, null);
    }).toThrow(TypeError);

    expect(() => {
      // @ts-ignore
      Model(class TestClass {}, 'not an object');
    }).toThrow(TypeError);
  });

  // 测试已经有自定义assign方法的类
  test('should not override existing assign method', () => {
    // 创建一个已经有自定义assign方法的类
    class CustomAssignClass {
      constructor() {
        this.field = 'default';
      }

      assign(obj) {
        this.field = `custom assign: ${obj ? obj.field : ''}`;
        return this;
      }
    }

    // 应用Model装饰器
    Model(CustomAssignClass, { kind: 'class', metadata: {} });

    // 测试assign方法是否保持自定义实现
    const instance = new CustomAssignClass();
    instance.assign({ field: 'test' });
    expect(instance.field).toBe('custom assign: test');
  });

  // 测试已经有自定义clear方法的类
  test('should not override existing clear method', () => {
    // 创建一个已经有自定义clear方法的类
    class CustomClearClass {
      constructor() {
        this.field = 'default';
      }

      clear() {
        this.field = 'custom cleared';
        return this;
      }
    }

    // 应用Model装饰器
    Model(CustomClearClass, { kind: 'class', metadata: {} });

    // 测试clear方法是否保持自定义实现
    const instance = new CustomClearClass();
    instance.clear();
    expect(instance.field).toBe('custom cleared');
  });

  // 测试已经有自定义clone方法的类
  test('should not override existing clone method', () => {
    // 创建一个已经有自定义clone方法的类
    class CustomCloneClass {
      constructor() {
        this.field = 'default';
      }

      clone() {
        const result = new CustomCloneClass();
        result.field = `custom cloned: ${this.field}`;
        return result;
      }
    }

    // 应用Model装饰器
    Model(CustomCloneClass, { kind: 'class', metadata: {} });

    // 测试clone方法是否保持自定义实现
    const instance = new CustomCloneClass();
    const cloned = instance.clone();
    expect(cloned.field).toBe('custom cloned: default');
  });

  // 测试已经有自定义isEmpty方法的类
  test('should not override existing isEmpty method', () => {
    // 创建一个已经有自定义isEmpty方法的类
    class CustomIsEmptyClass {
      constructor() {
        this.field = 'default';
      }

      isEmpty() {
        return this.field === 'custom empty check';
      }
    }

    // 应用Model装饰器
    Model(CustomIsEmptyClass, { kind: 'class', metadata: {} });

    // 测试isEmpty方法是否保持自定义实现
    const instance = new CustomIsEmptyClass();
    expect(instance.isEmpty()).toBe(false);

    instance.field = 'custom empty check';
    expect(instance.isEmpty()).toBe(true);
  });

  // 测试已经有自定义equals方法的类
  test('should not override existing equals method', () => {
    // 创建一个已经有自定义equals方法的类
    class CustomEqualsClass {
      constructor() {
        this.field = 'default';
      }

      equals(other) {
        return other && this.field === other.field && this.field === 'custom equality';
      }
    }

    // 应用Model装饰器
    Model(CustomEqualsClass, { kind: 'class', metadata: {} });

    // 测试equals方法是否保持自定义实现
    const instance1 = new CustomEqualsClass();
    const instance2 = new CustomEqualsClass();

    expect(instance1.equals(instance2)).toBe(false);

    instance1.field = 'custom equality';
    instance2.field = 'custom equality';
    expect(instance1.equals(instance2)).toBe(true);
  });

  // 测试已经有自定义normalize方法的类
  test('should not override existing normalize method', () => {
    // 创建一个已经有自定义normalize方法的类
    class CustomNormalizeClass {
      constructor() {
        this.field = ' needs trimming ';
      }

      normalize() {
        this.field = 'custom normalized';
        return this;
      }
    }

    // 应用Model装饰器
    Model(CustomNormalizeClass, { kind: 'class', metadata: {} });

    // 测试normalize方法是否保持自定义实现
    const instance = new CustomNormalizeClass();
    instance.normalize();
    expect(instance.field).toBe('custom normalized');
  });

  // 测试已经有自定义normalizeField方法的类
  test('should not override existing normalizeField method', () => {
    // 创建一个已经有自定义normalizeField方法的类
    class CustomNormalizeFieldClass {
      constructor() {
        this.field = ' needs trimming ';
      }

      normalizeField(fieldName) {
        if (fieldName === 'field') {
          this.field = 'custom field normalized';
        }
        return true;
      }
    }

    // 应用Model装饰器
    Model(CustomNormalizeFieldClass, { kind: 'class', metadata: {} });

    // 测试normalizeField方法是否保持自定义实现
    const instance = new CustomNormalizeFieldClass();
    instance.normalizeField('field');
    expect(instance.field).toBe('custom field normalized');
  });

  // 测试已经有自定义validate方法的类
  test('should not override existing validate method', () => {
    // 创建一个已经有自定义validate方法的类
    class CustomValidateClass {
      constructor() {
        this.field = 'invalid';
      }

      validate() {
        return this.field === 'valid' ? { valid: true } : { valid: false, reason: 'custom validation' };
      }
    }

    // 应用Model装饰器
    Model(CustomValidateClass, { kind: 'class', metadata: {} });

    // 测试validate方法是否保持自定义实现
    const instance = new CustomValidateClass();
    expect(instance.validate().valid).toBe(false);

    instance.field = 'valid';
    expect(instance.validate().valid).toBe(true);
  });

  // 测试已经有自定义validateField方法的类
  test('should not override existing validateField method', () => {
    // 创建一个已经有自定义validateField方法的类
    class CustomValidateFieldClass {
      constructor() {
        this.field = 'invalid';
      }

      validateField(fieldName) {
        if (fieldName === 'field') {
          return this.field === 'valid' ? { valid: true } : { valid: false, reason: 'custom field validation' };
        }
        return { valid: true };
      }
    }

    // 应用Model装饰器
    Model(CustomValidateFieldClass, { kind: 'class', metadata: {} });

    // 测试validateField方法是否保持自定义实现
    const instance = new CustomValidateFieldClass();
    expect(instance.validateField('field').valid).toBe(false);

    instance.field = 'valid';
    expect(instance.validateField('field').valid).toBe(true);
  });

  // 测试已经有自定义generateId方法的类
  test('should not override existing generateId method', () => {
    // 创建一个已经有自定义generateId方法的类
    class CustomGenerateIdClass {
      constructor() {
        this.id = null;
      }

      generateId() {
        this.id = 'custom-id-123';
        return this;
      }
    }

    // 应用Model装饰器
    Model(CustomGenerateIdClass, { kind: 'class', metadata: {} });

    // 测试generateId方法是否保持自定义实现
    const instance = new CustomGenerateIdClass();
    instance.generateId();
    expect(instance.id).toBe('custom-id-123');
  });

  // 测试已经有自定义toJSON方法的类
  test('should not override existing toJSON method', () => {
    // 创建一个已经有自定义toJSON方法的类
    class CustomToJsonClass {
      constructor() {
        this.field = { nested: 'value' };
      }

      toJSON() {
        return { customJson: true, field: this.field };
      }
    }

    // 应用Model装饰器
    Model(CustomToJsonClass, { kind: 'class', metadata: {} });

    // 测试toJSON方法是否保持自定义实现
    const instance = new CustomToJsonClass();
    expect(instance.toJSON()).toEqual({ customJson: true, field: { nested: 'value' } });
  });

  // 测试已经有自定义toJsonString方法的类
  test('should not override existing toJsonString method', () => {
    // 创建一个已经有自定义toJsonString方法的类
    class CustomToJsonStringClass {
      constructor() {
        this.field = 'value';
      }

      toJsonString() {
        return `{"custom":true,"field":"${this.field}"}`;
      }
    }

    // 应用Model装饰器
    Model(CustomToJsonStringClass, { kind: 'class', metadata: {} });

    // 测试toJsonString方法是否保持自定义实现
    const instance = new CustomToJsonStringClass();
    expect(instance.toJsonString()).toBe('{"custom":true,"field":"value"}');
  });

  // 测试静态方法：create, createArray, createPage, isNullishOrEmpty, parseJsonString

  // 测试已经有自定义静态create方法的类
  test('should not override existing static create method', () => {
    // 创建一个已经有自定义静态create方法的类
    class CustomCreateClass {
      constructor() {
        this.field = 'default';
      }

      static create(obj) {
        const instance = new CustomCreateClass();
        instance.field = `custom created: ${obj ? obj.field : ''}`;
        return instance;
      }
    }

    // 应用Model装饰器
    Model(CustomCreateClass, { kind: 'class', metadata: {} });

    // 测试静态create方法是否保持自定义实现
    const instance = CustomCreateClass.create({ field: 'test' });
    expect(instance.field).toBe('custom created: test');
  });

  // 测试已经有自定义静态createArray方法的类
  test('should not override existing static createArray method', () => {
    // 创建一个已经有自定义静态createArray方法的类
    class CustomCreateArrayClass {
      constructor() {
        this.field = 'default';
      }

      static createArray(array) {
        return ['custom array'].concat(array || []);
      }
    }

    // 应用Model装饰器
    Model(CustomCreateArrayClass, { kind: 'class', metadata: {} });

    // 测试静态createArray方法是否保持自定义实现
    const result = CustomCreateArrayClass.createArray([1, 2, 3]);
    expect(result).toEqual(['custom array', 1, 2, 3]);
  });

  // 测试已经有自定义静态createPage方法的类
  test('should not override existing static createPage method', () => {
    // 创建一个已经有自定义静态createPage方法的类
    class CustomCreatePageClass {
      constructor() {
        this.field = 'default';
      }

      static createPage(page) {
        return {
          customPage: true,
          content: page ? page.content : [],
          totalElements: page ? page.totalElements : 0,
        };
      }
    }

    // 应用Model装饰器
    Model(CustomCreatePageClass, { kind: 'class', metadata: {} });

    // 测试静态createPage方法是否保持自定义实现
    const result = CustomCreatePageClass.createPage({ content: [1, 2, 3], totalElements: 3 });
    expect(result).toEqual({ customPage: true, content: [1, 2, 3], totalElements: 3 });
  });

  // 测试已经有自定义静态isNullishOrEmpty方法的类
  test('should not override existing static isNullishOrEmpty method', () => {
    // 创建一个已经有自定义静态isNullishOrEmpty方法的类
    class CustomIsNullishOrEmptyClass {
      constructor() {
        this.field = 'default';
      }

      static isNullishOrEmpty(obj) {
        return !obj || obj.field === 'empty';
      }
    }

    // 应用Model装饰器
    Model(CustomIsNullishOrEmptyClass, { kind: 'class', metadata: {} });

    // 测试静态isNullishOrEmpty方法是否保持自定义实现
    expect(CustomIsNullishOrEmptyClass.isNullishOrEmpty(null)).toBe(true);

    const instance1 = new CustomIsNullishOrEmptyClass();
    expect(CustomIsNullishOrEmptyClass.isNullishOrEmpty(instance1)).toBe(false);

    const instance2 = new CustomIsNullishOrEmptyClass();
    instance2.field = 'empty';
    expect(CustomIsNullishOrEmptyClass.isNullishOrEmpty(instance2)).toBe(true);
  });

  // 测试已经有自定义静态parseJsonString方法的类
  test('should not override existing static parseJsonString method', () => {
    // 创建一个已经有自定义静态parseJsonString方法的类
    class CustomParseJsonStringClass {
      constructor() {
        this.field = 'default';
      }

      static parseJsonString(json) {
        const instance = new CustomParseJsonStringClass();
        instance.field = `custom parsed: ${json}`;
        return instance;
      }
    }

    // 应用Model装饰器
    Model(CustomParseJsonStringClass, { kind: 'class', metadata: {} });

    // 测试静态parseJsonString方法是否保持自定义实现
    const instance = CustomParseJsonStringClass.parseJsonString('{"field":"test"}');
    expect(instance.field).toBe('custom parsed: {"field":"test"}');
  });

  // 综合测试：创建一个完整的模型类并测试各种功能
  test('should provide full Model functionality for a decorated class', () => {
    @Enum
    class Status {
      static ACTIVE = new Status('ACTIVE');

      static INACTIVE = new Status('INACTIVE');

      constructor(value) {
        this.value = value;
      }
    }

    @Model
    class Address {
      city = '';

      street = '';
    }

    @Model
    class Person {
      name = '';

      age = 0;

      @Type(Status)
      status = Status.ACTIVE;

      @Type(Address)
      address = new Address();

      @ElementType(Address)
      addresses = [];
    }

    // 测试assign方法
    const person = new Person();
    person.assign({
      name: 'John',
      age: 30,
      status: 'INACTIVE',
      address: { city: 'New York', street: 'Broadway' },
      addresses: [{ city: 'Boston', street: 'Main St' }],
    });

    expect(person.name).toBe('John');
    expect(person.age).toBe(30);
    expect(person.status).toBe(Status.INACTIVE);
    expect(person.address instanceof Address).toBe(true);
    expect(person.address.city).toBe('New York');
    expect(person.addresses.length).toBe(1);
    expect(person.addresses[0] instanceof Address).toBe(true);

    // 测试clone方法
    const cloned = person.clone();
    expect(cloned).not.toBe(person); // 不是同一个对象
    expect(cloned instanceof Person).toBe(true);
    expect(cloned.name).toBe('John');
    expect(cloned.status).toBe(Status.INACTIVE);
    expect(cloned.address).not.toBe(person.address); // 深度克隆

    // 测试clear方法
    cloned.clear();
    expect(cloned.name).toBe('');
    expect(cloned.age).toBe(0);
    expect(cloned.status).toBe(Status.ACTIVE);

    // 测试isEmpty方法
    expect(cloned.isEmpty()).toBe(true);
    expect(person.isEmpty()).toBe(false);

    // 测试equals方法
    const personCopy = new Person();
    personCopy.assign(person);
    expect(personCopy.equals(person)).toBe(true);

    personCopy.name = 'Jane';
    expect(personCopy.equals(person)).toBe(false);

    // 测试静态create方法
    const created = Person.create({
      name: 'Alice',
      age: 25,
    });

    expect(created instanceof Person).toBe(true);
    expect(created.name).toBe('Alice');
    expect(created.age).toBe(25);

    // 测试静态createArray方法
    const peopleArray = Person.createArray([
      { name: 'Bob', age: 40 },
      { name: 'Charlie', age: 35 },
    ]);

    expect(Array.isArray(peopleArray)).toBe(true);
    expect(peopleArray.length).toBe(2);
    expect(peopleArray[0] instanceof Person).toBe(true);
    expect(peopleArray[0].name).toBe('Bob');
    expect(peopleArray[1].name).toBe('Charlie');

    // 测试toJSON和toJsonString方法
    const json = person.toJSON();
    expect(json.name).toBe('John');
    expect(json.status).toBe('INACTIVE');

    const jsonString = person.toJsonString();
    const parsed = JSON.parse(jsonString);
    expect(parsed.name).toBe('John');
    expect(parsed.age).toBe(30);

    // 测试静态parseJsonString方法
    const parsedPerson = Person.parseJsonString(jsonString);
    expect(parsedPerson instanceof Person).toBe(true);
    expect(parsedPerson.name).toBe('John');
    expect(parsedPerson.status).toBe(Status.INACTIVE);
  });
});
