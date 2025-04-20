////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createArray } from '../src';

describe('Test createArray() function', () => {
  // 定义一个简单的测试类
  class Person {
    constructor() {
      this.id = '';
      this.name = '';
      this.age = 0;
    }

    // 手动实现normalize方法，供测试使用
    normalize() {
      if (typeof this.name === 'string') {
        this.name = this.name.trim();
      }
      if (typeof this.age === 'string') {
        this.age = parseInt(this.age, 10);
      }
      return this;
    }
  }

  class Address {
    constructor() {
      this.city = '';
      this.street = '';
    }
  }

  class ComplexPerson {
    constructor() {
      this.id = '';
      this.name = '';
      this.age = 0;
      this.address = null;
    }

    normalize() {
      if (typeof this.name === 'string') {
        this.name = this.name.trim();
      }
      return this;
    }
  }

  test('should return null for null array input', () => {
    const result = createArray(Person, null);
    expect(result).toBeNull();
  });

  test('should return null for undefined array input', () => {
    const result = createArray(Person, undefined);
    expect(result).toBeNull();
  });

  test('should create an array of model instances from data objects', () => {
    const data = [
      { id: '1', name: 'Alice', age: 25 },
      { id: '2', name: 'Bob', age: 30 },
    ];

    const result = createArray(Person, data);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Person);
    expect(result[1]).toBeInstanceOf(Person);

    expect(result[0].id).toBe('1');
    expect(result[0].name).toBe('Alice');
    expect(result[0].age).toBe(25);

    expect(result[1].id).toBe('2');
    expect(result[1].name).toBe('Bob');
    expect(result[1].age).toBe(30);
  });

  test('should normalize data when normalize option is true', () => {
    const data = [
      { id: '1', name: ' Alice ', age: '25' },
      { id: '2', name: ' Bob ', age: '30' },
    ];

    // Mock normalize method to track calls
    const originalNormalize = Person.prototype.normalize;
    Person.prototype.normalize = jest.fn(originalNormalize);

    const result = createArray(Person, data, { normalize: true });

    expect(Person.prototype.normalize).toHaveBeenCalled();

    // Restore original method
    Person.prototype.normalize = originalNormalize;
  });

  test('should not normalize data when normalize option is false', () => {
    const data = [
      { id: '1', name: ' Alice ', age: '25' },
    ];

    // Mock normalize method to track calls
    const originalNormalize = Person.prototype.normalize;
    Person.prototype.normalize = jest.fn();

    createArray(Person, data, { normalize: false });

    expect(Person.prototype.normalize).not.toHaveBeenCalled();

    // Restore original method
    Person.prototype.normalize = originalNormalize;
  });
});
