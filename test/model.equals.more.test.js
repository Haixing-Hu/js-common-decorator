////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Model } from '../src';

/**
 * @test 测试Model.equals方法的边界情况
 * @author Haixing Hu
 */
describe('Test Model.equals edge cases', () => {
  @Model
  class Person {
    name = '';

    age = 0;

    constructor(name = '', age = 0) {
      this.name = name;
      this.age = age;
    }
  }

  @Model
  class Employee {
    name = '';

    age = 0;

    constructor(name = '', age = 0) {
      this.name = name;
      this.age = age;
    }
  }

  it('should correctly handle identity comparison', () => {
    const person = new Person('Alice', 30);
    // 同一个对象实例
    expect(person.equals(person)).toBe(true);
  });

  it('should handle null comparisons correctly', () => {
    const person = new Person('Alice', 30);
    expect(person.equals(null)).toBe(false);
    expect(person.equals(undefined)).toBe(false);
  });

  it('should compare null with null correctly', () => {
    const person = null;
    // 使用equalsImpl作为内部函数
    const equalsImpl = require('../src/impl/model/equals-impl').default;
    expect(equalsImpl(null, null)).toBe(true);
    expect(equalsImpl(undefined, null)).toBe(true);
    expect(equalsImpl(null, undefined)).toBe(true);
    expect(equalsImpl(undefined, undefined)).toBe(true);
  });

  it('should handle different prototype comparisons', () => {
    const person = new Person('Alice', 30);
    const employee = new Employee('Alice', 30);

    // 即使内容相同，但是不同的类
    expect(person.equals(employee)).toBe(false);
  });

  it('should compare content correctly', () => {
    const person1 = new Person('Alice', 30);
    const person2 = new Person('Alice', 30);
    const person3 = new Person('Bob', 25);

    expect(person1.equals(person2)).toBe(true);
    expect(person1.equals(person3)).toBe(false);
  });

  it('should handle complex object comparisons', () => {
    @Model
    class Team {
      name = '';

      members = [];

      constructor(name = '', members = []) {
        this.name = name;
        this.members = members;
      }
    }

    const team1 = new Team('Alpha', [new Person('Alice', 30), new Person('Bob', 25)]);
    const team2 = new Team('Alpha', [new Person('Alice', 30), new Person('Bob', 25)]);
    const team3 = new Team('Beta', [new Person('Alice', 30), new Person('Bob', 25)]);

    expect(team1.equals(team2)).toBe(true);
    expect(team1.equals(team3)).toBe(false);
  });
});
