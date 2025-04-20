////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Enum from '../src/enum';

/**
 * 此测试文件专门用于提高enum.js文件的分支覆盖率
 * 特别是第228行和第231行
 */
describe('Enum decorator coverage improvement tests', () => {
  // 测试Enum装饰器应用于有函数静态字段的类（覆盖第228行）
  test('should handle classes with static function fields', () => {
    @Enum
    class TestEnum {
      static OPTION_1 = new TestEnum('OPTION_1', 'Option 1');

      static OPTION_2 = new TestEnum('OPTION_2', 'Option 2');

      // 添加静态函数字段，这会触发第228行中的条件判断
      static staticFunction() {
        return 'This is a static function';
      }

      constructor(value, name) {
        this.value = value;
        this.name = name;
      }
    }

    // 验证枚举类是否正确创建
    expect(TestEnum.OPTION_1).toBeDefined();
    expect(TestEnum.OPTION_2).toBeDefined();

    // 验证静态函数是否仍然可用
    expect(typeof TestEnum.staticFunction).toBe('function');
    expect(TestEnum.staticFunction()).toBe('This is a static function');

    // 验证枚举类的其他功能是否正常
    expect(TestEnum.values()).toContain(TestEnum.OPTION_1);
    expect(TestEnum.values()).toContain(TestEnum.OPTION_2);
    expect(TestEnum.values().length).toBe(2); // 只有两个枚举值，静态函数不是枚举值

    // 验证Object.freeze被调用（覆盖第231行）
    expect(Object.isFrozen(TestEnum)).toBe(true);
  });

  // 测试Enum应用于复杂的类结构，以确保Object.freeze被正确调用
  test('should correctly freeze the enum class', () => {
    @Enum
    class ComplexEnum {
      static OPTION_A = new ComplexEnum('A', { code: 'A_CODE', sortOrder: 1 });

      static OPTION_B = new ComplexEnum('B', { code: 'B_CODE', sortOrder: 2 });

      // 嵌套对象
      static CONFIG = {
        defaults: {
          option: 'OPTION_A',
        },
      };

      constructor(value, metadata) {
        this.value = value;
        this.metadata = metadata;
      }
    }

    // 验证类是否被冻结（覆盖第231行）
    expect(Object.isFrozen(ComplexEnum)).toBe(true);

    // 验证无法添加新的静态属性
    expect(() => {
      ComplexEnum.NEW_OPTION = new ComplexEnum('NEW', {});
    }).toThrow();

    // 验证无法修改现有的静态属性
    const originalOptionA = ComplexEnum.OPTION_A;
    expect(() => {
      ComplexEnum.OPTION_A = new ComplexEnum('MODIFIED', {});
    }).toThrow();
    expect(ComplexEnum.OPTION_A).toBe(originalOptionA);
  });
});
