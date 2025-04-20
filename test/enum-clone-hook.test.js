////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { clone } from '@qubit-ltd/clone';
import { Enum } from '../src';
import isEnumerator from '../src/is-enumerator';

/**
 * 此测试文件专门用于提高enum.js文件中registerCloneHook回调函数的代码覆盖率
 * 覆盖第228和231行，特别是当对象不是枚举器时，回调返回null的分支
 */
describe('Enum clone hook tests', () => {
  // 测试枚举器对象的克隆行为
  test('should not clone enumerator objects (line 228)', () => {
    // 定义一个简单的枚举类
    @Enum
    class TestEnum {
      static ONE = 'One';

      static TWO = 'Two';
    }

    // 获取一个枚举值
    const enumValue = TestEnum.ONE;

    // 克隆这个枚举值，应该返回原始对象（不克隆）
    const clonedEnum = clone(enumValue);

    // 验证克隆的对象就是原始对象（引用相同）
    expect(clonedEnum).toBe(enumValue);

    // 确认对象确实是枚举器
    expect(isEnumerator(enumValue)).toBe(true);
  });

  // 测试非枚举器对象的克隆行为，确保覆盖第231行
  test('should clone non-enumerator objects normally (line 231)', () => {
    // 创建一个普通对象
    const regularObject = { id: 1, name: 'Test Object' };

    // 克隆这个普通对象，应该返回一个新对象（深拷贝）
    const clonedObject = clone(regularObject);

    // 验证克隆的对象不是原始对象（引用不同）
    expect(clonedObject).not.toBe(regularObject);

    // 但值应该相等
    expect(clonedObject).toEqual(regularObject);

    // 确认对象不是枚举器
    expect(isEnumerator(regularObject)).toBe(false);

    // 修改克隆对象的属性不应影响原始对象
    clonedObject.name = 'Modified';
    expect(regularObject.name).toBe('Test Object');
  });

  // 测试null和undefined的克隆行为
  test('should handle null and undefined values', () => {
    // 确认这些值不是枚举器
    expect(isEnumerator(null)).toBe(false);
    expect(isEnumerator(undefined)).toBe(false);

    // 克隆null和undefined
    const clonedNull = clone(null);
    const clonedUndefined = clone(undefined);

    // 应该原样返回
    expect(clonedNull).toBeNull();
    expect(clonedUndefined).toBeUndefined();
  });

  // 测试原始值的克隆行为
  test('should handle primitive values', () => {
    // 确认这些值不是枚举器
    expect(isEnumerator(123)).toBe(false);
    expect(isEnumerator('string')).toBe(false);
    expect(isEnumerator(true)).toBe(false);

    // 克隆原始值
    const clonedNumber = clone(123);
    const clonedString = clone('string');
    const clonedBoolean = clone(true);

    // 应该原样返回
    expect(clonedNumber).toBe(123);
    expect(clonedString).toBe('string');
    expect(clonedBoolean).toBe(true);
  });
});
