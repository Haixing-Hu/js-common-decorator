////////////////////////////////////////////////////////////////////////////////
import ElementType from '../../../src/element-type';
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Enum from '../../../src/enum';
import assignImpl from '../../../src/impl/model/assign-impl';
import Model from '../../../src/model';
import Type from '../../../src/type';

/**
 * 测试assign-impl.js中未覆盖的行：
 * - 81: getExistFieldWithDifferentNamingStyle找到具有不同命名风格的字段
 * - 113, 165, 171, 173: 枚举类型相关的路径
 * - 312-373: cloneNoType函数的不同路径
 * - 479-502: doAssign函数的不同路径
 */
describe('assign-impl edge cases', () => {
  // 测试行81 - 测试getExistFieldWithDifferentNamingStyle详细情况
  test('should warn with detailed information when source has field with different naming style', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    @Model
    class TestClass {
      constructor() {
        this.camelCaseField = 'default';
        this.anotherField = 'another default';
      }
    }

    const instance = new TestClass();
    const source = {
      camel_case_field: 'test value', // 下划线命名风格
      another_field: 'another test value',
    };

    // 使用命名转换，但不正确 - 这将触发警告
    instance.assign(source, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_CAMEL', // 错误的源命名风格
      targetNamingStyle: 'LOWER_CAMEL',
    });

    // 验证警告消息是否触发
    expect(warnSpy).toHaveBeenCalled();

    // 验证具体的警告内容
    const warningCalls = warnSpy.mock.calls.flat();
    expect(warningCalls.some((call) => typeof call === 'string'
      && call.includes('A correct naming conversion may be needed'))).toBe(true);

    warnSpy.mockRestore();
  });

  // 测试cloneEnum处理空字符串和无效值（行113-120）
  test('should handle invalid enum values with detailed error message', () => {
    @Enum
    class TestEnum {
      static OPTION_1 = new TestEnum('OPTION_1', 'Option 1');

      static OPTION_2 = new TestEnum('OPTION_2', 'Option 2');

      constructor(value, name) {
        this.value = value;
        this.name = name;
      }
    }

    @Model
    class TestClass {
      @Type(TestEnum)
      enumField = TestEnum.OPTION_1;
    }

    // 测试非字符串枚举值（行171-173）
    const instance = new TestClass();
    expect(() => {
      instance.assign({ enumField: 123 }); // 不是字符串或枚举实例
    }).toThrow(RangeError);

    // 测试无效字符串枚举值（行165-169）
    expect(() => {
      instance.assign({ enumField: 'INVALID_OPTION' });
    }).toThrow(RangeError);
  });

  // 测试cloneNoType函数（行312-373）
  test('should handle various paths in cloneNoType', () => {
    // 测试cloneNoType中当defaultInstance为null或undefined时的情况
    @Model
    class TestClass {
      constructor() {
        this.objectField = null; // 测试defaultInstance为null的情况
      }
    }

    const instance = new TestClass();
    const source = {
      objectField: { key: 'value' },
    };

    // 使用命名风格转换选项，这种情况下，因为defaultInstance为null，
    // 所以直接克隆源对象
    instance.assign(source);

    // 验证是否正确赋值
    expect(instance.objectField).toEqual({ key: 'value' });
  });

  // 测试cloneNoType函数的更多路径（行312-373）
  test('should handle object creation in cloneNoType', () => {
    @Model
    class NestedClass {
      constructor() {
        this.value = 'default';
        this.snake_case_field = 'snake';
      }
    }

    @Model
    class TestClass {
      constructor() {
        this.objectField = new NestedClass();
      }
    }

    const instance = new TestClass();
    const source = {
      object_field: {
        value: 'new value',
        snake_case_field: 'new snake',
      },
    };

    // 使用命名风格转换选项
    instance.assign(source, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });

    // 验证是否正确赋值并保持类型
    expect(instance.objectField instanceof NestedClass).toBe(true);
    expect(instance.objectField.value).toBe('new value');
    expect(instance.objectField.snake_case_field).toBe('new snake');
  });

  // 测试doAssign处理不同类型的边缘情况（行479-502）
  test('should handle various edge cases in doAssign', () => {
    @Model
    class NestedClass {
      constructor() {
        this.nestedValue = 'nested default';
      }
    }

    @Model
    class ArrayElementClass {
      constructor() {
        this.elementValue = 'element default';
      }
    }

    @Model
    class TestClass {
      // 使用@Type装饰器
      @Type(NestedClass)
      typedField = new NestedClass();

      // 使用@ElementType装饰器
      @ElementType(ArrayElementClass)
      elementTypedArray = [new ArrayElementClass()];

      // 默认值为null的字段
      nullDefaultField = null;

      // 默认值为数组但没有ElementType的字段
      plainArray = [1, 2, 3];

      // 默认值为对象但没有Type的字段
      plainObject = { key: 'default value' };

      // 默认值为原始类型的字段
      primitiveField = 42;
    }

    const instance = new TestClass();

    // 创建一个完全匹配源字段名的源对象
    const source = {
      typedField: { nestedValue: 'new nested value' },
      elementTypedArray: [{ elementValue: 'new element value' }],
      nullDefaultField: { someKey: 'some value' },
      plainArray: [4, 5, 6],
      plainObject: { newKey: 'new object value' },
      primitiveField: 99,
    };

    // 应用常规选项
    instance.assign(source, {
      normalize: true,
    });

    // 验证各种字段类型是否正确处理
    expect(instance.typedField instanceof NestedClass).toBe(true);
    expect(instance.typedField.nestedValue).toBe('new nested value');

    expect(Array.isArray(instance.elementTypedArray)).toBe(true);
    expect(instance.elementTypedArray[0] instanceof ArrayElementClass).toBe(true);
    expect(instance.elementTypedArray[0].elementValue).toBe('new element value');

    expect(instance.nullDefaultField).toEqual({ someKey: 'some value' });

    expect(Array.isArray(instance.plainArray)).toBe(true);
    expect(instance.plainArray).toEqual([4, 5, 6]);

    expect(typeof instance.plainObject).toBe('object');
    expect(instance.plainObject).toEqual({ newKey: 'new object value' });

    expect(instance.primitiveField).toBe(99);
  });

  // 测试直接调用assignImpl函数
  test('should correctly handle assignImpl direct call', () => {
    @Model
    class TestClass {
      constructor() {
        this.field1 = 'default1';
        this.field2 = 'default2';
      }
    }

    const instance = new TestClass();
    const source = { field1: 'new1', field2: 'new2' };

    // 直接调用assignImpl函数
    const result = assignImpl(TestClass, instance, source, { normalize: false });

    // 验证结果
    expect(result).toBe(instance); // 应该返回原始实例
    expect(instance.field1).toBe('new1');
    expect(instance.field2).toBe('new2');
  });

  // 测试当source instanceof Class时，命名转换应被禁用
  test('should disable naming conversion when source is instance of same class', () => {
    @Model
    class TestClass {
      constructor() {
        this.camelCaseField = 'default';
      }
    }

    const instance1 = new TestClass();
    instance1.camelCaseField = 'source value';

    const instance2 = new TestClass();

    // 尝试使用命名转换，但因为source是同类实例，应该被禁用
    instance2.assign(instance1, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL',
    });

    // 验证值被正确赋值（不应转换命名风格）
    expect(instance2.camelCaseField).toBe('source value');
  });
});
