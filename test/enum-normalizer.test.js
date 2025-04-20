////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum, enumNormalizer } from '../src';

describe('enumNormalizer', () => {
  // 使用实际的Enum装饰器创建一个简单的枚举类
  @Enum
  class Gender {
    static MALE = '男';

    static FEMALE = '女';
  }

  // 使用实际的Enum装饰器创建一个带有额外属性的枚举类
  @Enum
  class Status {
    static ACTIVE = { name: '活跃', code: 'A' };

    static INACTIVE = { name: '不活跃', code: 'I' };

    static PENDING = { name: '待定', code: 'P' };
  }

  // 创建一个非枚举类作为对照
  class RegularClass {
    constructor(name) {
      this.name = name;
    }
  }

  test('应该返回一个函数', () => {
    const normalizer = enumNormalizer(Gender);
    expect(typeof normalizer).toBe('function');
  });

  test('应该将字符串值归一化为对应的枚举实例', () => {
    const normalizer = enumNormalizer(Gender);

    // 测试通过值查找枚举实例
    expect(normalizer('MALE')).toBe(Gender.MALE);
    expect(normalizer('FEMALE')).toBe(Gender.FEMALE);
  });

  test('应该支持不区分大小写的字符串值查找', () => {
    const normalizer = enumNormalizer(Status);

    // 使用小写值查找枚举实例
    expect(normalizer('active')).toBe(Status.ACTIVE);
    expect(normalizer('inactive')).toBe(Status.INACTIVE);
    expect(normalizer('PENDING')).toBe(Status.PENDING);
  });

  test('应该支持通过显示名称查找枚举实例', () => {
    const normalizer = enumNormalizer(Status);

    // 通过中文名称查找枚举实例
    expect(normalizer('活跃')).toBe(Status.ACTIVE);
    expect(normalizer('不活跃')).toBe(Status.INACTIVE);
    expect(normalizer('待定')).toBe(Status.PENDING);
  });

  test('应该支持通过枚举代码查找枚举实例', () => {
    const normalizer = enumNormalizer(Status);

    // 通过code属性查找枚举实例
    expect(normalizer('A')).toBe(Status.ACTIVE);
    expect(normalizer('I')).toBe(Status.INACTIVE);
    expect(normalizer('P')).toBe(Status.PENDING);
  });

  test('对于无效的枚举值应该返回undefined', () => {
    const normalizer = enumNormalizer(Gender);

    // 测试无效值
    expect(normalizer('UNKNOWN')).toBeUndefined();
    expect(normalizer('')).toBeUndefined();
  });

  test('参数不是枚举类时应该抛出TypeError', () => {
    expect(() => {
      enumNormalizer(RegularClass);
    }).toThrow(TypeError);

    expect(() => {
      enumNormalizer({});
    }).toThrow(TypeError);

    expect(() => {
      enumNormalizer(null);
    }).toThrow(TypeError);
  });

  test('应该正确处理null和undefined输入', () => {
    const normalizer = enumNormalizer(Gender);

    // null和undefined应该返回undefined
    expect(normalizer(null)).toBeUndefined();
    expect(normalizer(undefined)).toBeUndefined();
  });

  test('应该原样返回枚举实例', () => {
    const normalizer = enumNormalizer(Gender);

    // 输入枚举实例时应该原样返回
    expect(normalizer(Gender.MALE)).toBe(Gender.MALE);
    expect(normalizer(Gender.FEMALE)).toBe(Gender.FEMALE);
  });
});
