////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Enum } from '../src';

/**
 * 测试Enum装饰器的边缘情况，特别是确保freeze操作正常工作，
 * 目标是覆盖enum.js中的第228和231行
 */
describe('Enum edge cases', () => {
  it('should freeze the enumeration class', () => {
    @Enum
    class TestEnum {
      static ZERO = { value: '0', name: 'ZERO', code: '0' };

      static ONE = { value: '1', name: 'ONE', code: '1' };
    }

    // 检查类是否被冻结
    expect(Object.isFrozen(TestEnum)).toBe(true);

    // 尝试添加新的枚举值（应该失败，因为类已被冻结）
    const addNewEnum = () => {
      TestEnum.TWO = { value: '2', name: 'TWO', code: '2' };
    };

    expect(addNewEnum).toThrow();
  });

  it('should make enumerator instances immutable', () => {
    @Enum
    class TestEnum {
      static ZERO = { value: '0', name: 'ZERO', code: '0' };

      static ONE = { value: '1', name: 'ONE', code: '1' };
    }

    // 获取一个枚举值
    const enumValue = TestEnum.ONE;

    // 尝试修改枚举值的属性
    const modifyEnum = () => {
      enumValue.value = 'changed';
    };

    // 确认枚举值是冻结的
    expect(Object.isFrozen(enumValue)).toBe(true);
    expect(modifyEnum).toThrow();
  });
});
