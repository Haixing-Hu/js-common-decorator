////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createArray, Model } from '../src';

describe('Test createArray() function', () => {
  @Model
  class Person {
    constructor() {
      this.id = '';
      this.name = '';
      this.age = 0;
    }

    normalize(field = '*') {
      if (field === '*' || field === 'name') {
        if (typeof this.name === 'string') {
          this.name = this.name.trim();
        }
      }
      if (field === '*' || field === 'age') {
        if (typeof this.age === 'string') {
          this.age = parseInt(this.age, 10);
        }
      }
      return this;
    }
  }

  @Model
  class Address {
    constructor() {
      this.city = '';
      this.street = '';
    }
  }

  @Model
  class ComplexPerson {
    constructor() {
      this.id = '';
      this.name = '';
      this.age = 0;
      this.address = null;
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

    const result = createArray(Person, data, { normalize: true });

    expect(result[0].name).toBe('Alice'); // 空格被移除
    expect(result[0].age).toBe(25); // 字符串被转换为数字
    expect(result[1].name).toBe('Bob');
    expect(result[1].age).toBe(30);
  });

  test('should not normalize data when normalize option is false', () => {
    const data = [
      { id: '1', name: ' Alice ', age: '25' },
    ];

    // Mock the normalize method to track calls
    const originalNormalize = Person.prototype.normalize;
    Person.prototype.normalize = jest.fn();

    createArray(Person, data, { normalize: false });

    expect(Person.prototype.normalize).not.toHaveBeenCalled();

    // Restore original method
    Person.prototype.normalize = originalNormalize;
  });

  test('should handle nested objects using `types` option', () => {
    const data = [
      {
        id: '1',
        name: 'Alice',
        address: { city: 'New York', street: 'Broadway' },
      },
    ];
    const result = createArray(ComplexPerson, data, {
      types: {
        '.address': Address,
      },
    });
    expect(result[0].address).toBeInstanceOf(Address);
    expect(result[0].address.city).toBe('New York');
    expect(result[0].address.street).toBe('Broadway');
  });
});
