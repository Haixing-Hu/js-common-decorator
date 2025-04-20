////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Enum from '../../../src/enum';
import Model from '../../../src/model';

describe('assign with complex cases', () => {
  // 测试处理枚举类型错误情况
  test('should throw error when trying to assign invalid enum string value', () => {
    @Enum
    class TestEnum {
      static OPTION_1 = new TestEnum('OPTION_1');

      static OPTION_2 = new TestEnum('OPTION_2');
    }

    @Model
    class TestClass {
      constructor() {
        this.enumField = TestEnum.OPTION_1;
      }
    }

    const instance = new TestClass();
    const source = { enumField: 'INVALID_OPTION' };

    // 当尝试将无效的字符串值赋给枚举字段时应该抛出错误
    expect(() => {
      instance.assign(source);
    }).toThrow();
  });

  test('should throw error when trying to assign non-string enum value', () => {
    @Enum
    class TestEnum {
      static OPTION_1 = new TestEnum('OPTION_1');

      static OPTION_2 = new TestEnum('OPTION_2');
    }

    @Model
    class TestClass {
      constructor() {
        this.enumField = TestEnum.OPTION_1;
      }
    }

    const instance = new TestClass();
    const source = { enumField: 123 };

    // 当尝试将非字符串的值赋给枚举字段时应该抛出错误
    expect(() => {
      instance.assign(source);
    }).toThrow();
  });

  // 测试 cloneWithType 函数处理内置类型的警告情况
  test('should warn and assign source of incorrect built-in type', () => {
    // Spy on console.warn
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    @Model
    class TestClass {
      constructor() {
        this.stringField = '';
      }
    }

    const instance = new TestClass();
    const source = { stringField: 123 };

    // 虽然类型不匹配，但仍然能成功赋值
    instance.assign(source);

    expect(warnSpy).toHaveBeenCalled();
    expect(instance.stringField).toBe(123);

    warnSpy.mockRestore();
  });

  // 测试处理复杂对象
  test('should copy properties', () => {
    @Model
    class NestedClass {
      constructor() {
        this.value = '';
      }
    }

    @Model
    class TestClass {
      constructor() {
        this.field1 = 'default';
        this.field2 = 0;
        this.nested = new NestedClass();
      }
    }

    const instance = new TestClass();
    const source = {
      field1: 'test value',
      field2: 42,
      nested: { value: 'nested value' },
    };

    instance.assign(source);

    expect(instance.field1).toBe('test value');
    expect(instance.field2).toBe(42);
    expect(instance.nested.value).toBe('nested value');
  });

  // 测试处理源对象为空的情况
  test('should handle null or undefined source', () => {
    @Model
    class TestClass {
      constructor() {
        this.field1 = 'default';
        this.field2 = 0;
      }
    }

    const instance = new TestClass();
    const originalField1 = instance.field1;
    const originalField2 = instance.field2;

    // 测试null
    instance.assign(null);
    expect(instance.field1).toBe(originalField1);
    expect(instance.field2).toBe(originalField2);

    // 测试undefined
    instance.assign(undefined);
    expect(instance.field1).toBe(originalField1);
    expect(instance.field2).toBe(originalField2);
  });

  // 测试父类字段赋值
  test('should call parent class assign method and handle own fields', () => {
    @Model
    class ParentClass {
      constructor() {
        this.parentField = 'parent default';
      }
    }

    @Model
    class ChildClass extends ParentClass {
      constructor() {
        super();
        this.childField = 'child default';
      }
    }

    const instance = new ChildClass();
    const source = {
      parentField: 'new parent value',
      childField: 'new child value',
    };

    instance.assign(source);

    expect(instance.parentField).toBe('new parent value');
    expect(instance.childField).toBe('new child value');
  });
});
