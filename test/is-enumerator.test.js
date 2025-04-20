////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum, isEnumerator } from '../src';

describe('isEnumerator', () => {
  // 使用实际的Enum装饰器创建一个枚举类
  @Enum
  class Gender {
    static MALE = '男';

    static FEMALE = '女';
  }

  // 创建一个普通类作为对照
  class RegularClass {
    constructor(name) {
      this.name = name;
    }
  }

  test('应该对枚举实例返回true', () => {
    // 测试实际的枚举实例
    expect(isEnumerator(Gender.MALE)).toBe(true);
    expect(isEnumerator(Gender.FEMALE)).toBe(true);
  });

  test('应该对基本类型值返回false', () => {
    expect(isEnumerator(null)).toBe(false);
    expect(isEnumerator(undefined)).toBe(false);
    expect(isEnumerator(123)).toBe(false);
    expect(isEnumerator('字符串')).toBe(false);
    expect(isEnumerator(true)).toBe(false);
    expect(isEnumerator(Symbol('symbol'))).toBe(false);
  });

  test('应该对非枚举对象返回false', () => {
    expect(isEnumerator({})).toBe(false);
    expect(isEnumerator([])).toBe(false);
    expect(isEnumerator(new Date())).toBe(false);
    expect(isEnumerator(/正则表达式/)).toBe(false);
    expect(isEnumerator(new RegularClass('测试'))).toBe(false);
  });

  test('应该对无原型的对象返回false', () => {
    const obj = Object.create(null);
    expect(isEnumerator(obj)).toBe(false);
  });

  test('应该对枚举类本身返回false', () => {
    expect(isEnumerator(Gender)).toBe(false);
  });

  test('应该对模拟枚举但未被@Enum装饰的对象返回false', () => {
    class FakeEnum {
      static ONE = new FakeEnum('ONE', '一');

      static TWO = new FakeEnum('TWO', '二');

      constructor(value, name) {
        this.value = value;
        this.name = name;
      }
    }

    expect(isEnumerator(FakeEnum.ONE)).toBe(false);
  });

  test('应该对带有枚举属性的复杂枚举实例返回true', () => {
    @Enum
    class Status {
      static ACTIVE = { name: '活跃', code: 'A', order: 1 };

      static INACTIVE = { name: '不活跃', code: 'I', order: 2 };
    }

    expect(isEnumerator(Status.ACTIVE)).toBe(true);
    expect(isEnumerator(Status.INACTIVE)).toBe(true);

    // 验证额外属性
    expect(Status.ACTIVE.code).toBe('A');
    expect(Status.ACTIVE.order).toBe(1);
  });
});
