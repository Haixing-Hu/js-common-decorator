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
import Type from '../../../src/type';
import ElementType from '../../../src/element-type';
import assignImpl from '../../../src/impl/model/assign-impl';

/**
 * 进一步提高assign-impl.js文件的测试覆盖率
 * 
 * 重点测试以下仍未覆盖的行:
 * - 第81行：当源对象字段存在不同命名风格时
 * - 第113行：处理空字符串的枚举值
 * - 第165-173行：枚举类型处理的不同路径
 * - 第312-373行：cloneNoType函数的不同路径
 * - 第479-502行：doAssign函数的不同路径
 */
describe('assign-impl final coverage', () => {
  // 测试第81行的更完整场景
  test('should detect and warn about fields with different naming styles in detail', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    @Model
    class TestClass {
      constructor() {
        this.camelCaseField = 'default';
        this.anotherCamelCaseField = 'another default';
      }
    }

    const instance = new TestClass();
    const source = { 
      camel_case_field: 'snake case value',
      ANOTHER_CAMEL_CASE_FIELD: 'upper snake case value'
    };

    // 使用不正确的命名风格转换选项，这样会触发第81行的代码
    instance.assign(source, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_CAMEL', // 错误的源命名风格
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    // 验证警告是否包含命名风格转换建议信息
    expect(warnSpy).toHaveBeenCalled();
    
    // 确保所有相关的警告信息都被生成
    const warnings = warnSpy.mock.calls.map(call => (typeof call[0] === 'string' ? call[0] : ''));
    expect(warnings.some(msg => msg.includes('A correct naming conversion may be needed'))).toBe(true);
    
    warnSpy.mockRestore();
  });

  // 更详细地测试第113行的空字符串枚举值处理
  test('should properly handle various empty string forms for enum values', () => {
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

    const instance1 = new TestClass();
    instance1.assign({ enumField: '' }); // 完全空字符串
    expect(instance1.enumField).toBe(TestEnum.OPTION_1); // 应该保持默认值
    
    const instance2 = new TestClass();
    instance2.assign({ enumField: '   ' }); // 只有空格的字符串
    expect(instance2.enumField).toBe(TestEnum.OPTION_1); // 应该保持默认值
    
    const instance3 = new TestClass();
    instance3.assign({ enumField: '\t\n' }); // 含有制表符和换行符的字符串
    expect(instance3.enumField).toBe(TestEnum.OPTION_1); // 应该保持默认值
  });

  // 更完整地测试第165-173行
  test('should handle all enum value assignment scenarios', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
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

    // 测试源属性是null的情况
    const instance1 = new TestClass();
    instance1.assign({ enumField: null });
    expect(instance1.enumField).toBe(null);
    
    // 测试源属性是undefined的情况
    const instance2 = new TestClass();
    instance2.assign({ enumField: undefined });
    expect(instance2.enumField).not.toBeNull();  // 只要不是null就可以
    
    // 测试源属性是枚举实例的情况
    const instance3 = new TestClass();
    instance3.assign({ enumField: TestEnum.OPTION_2 });
    expect(instance3.enumField).toBe(TestEnum.OPTION_2);
    
    // 测试各种非法值，这些应该触发异常
    [123, {}, [], true, new Date()].forEach(invalidValue => {
      const instance = new TestClass();
      expect(() => {
        instance.assign({ enumField: invalidValue });
      }).toThrow(RangeError);
    });
    
    warnSpy.mockRestore();
  });

  // 完整测试第312-373行
  test('should thoroughly cover cloneNoType function scenarios', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    @Model
    class NestedObject {
      constructor() {
        this.nestedString = 'nested default';
        this.camelCaseField = 'camel case default';
      }
    }
    
    @Model
    class TestClass {
      constructor() {
        this.objectField = new NestedObject();
        this.nullField = null;
        this.undefinedField = undefined;
        this.arrayField = [1, 2, 3];
      }
    }

    // 测试当defaultInstance为null，且无命名转换的情况
    const instance1 = new TestClass();
    const source1 = {
      nullField: { key: 'value' }
    };
    instance1.assign(source1);
    expect(instance1.nullField).toEqual({ key: 'value' });
    
    // 测试当defaultInstance为undefined，且无命名转换的情况
    const instance2 = new TestClass();
    const source2 = {
      undefinedField: { key: 'value' }
    };
    instance2.assign(source2);
    expect(instance2.undefinedField).toEqual({ key: 'value' });
    
    // 测试当defaultInstance为null，但使用命名转换的情况
    const instance3 = new TestClass();
    const source3 = {
      null_field: { key: 'value' }
    };
    instance3.assign(source3, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    expect(instance3.nullField).toEqual({ key: 'value' });
    
    // 测试嵌套对象的命名转换
    const instance4 = new TestClass();
    const source4 = {
      object_field: {
        nested_string: 'new nested value',
        camel_case_field: 'new camel case value'
      }
    };
    
    instance4.assign(source4, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    expect(instance4.objectField instanceof NestedObject).toBe(true);
    expect(instance4.objectField.nestedString).toBe('new nested value');
    expect(instance4.objectField.camelCaseField).toBe('new camel case value');
    
    // 测试数组字段的处理（cloneArrayNoElementType函数路径）
    const instance5 = new TestClass();
    const source5 = {
      array_field: [4, 5, 6]
    };
    
    instance5.assign(source5, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    expect(instance5.arrayField).toEqual([4, 5, 6]);
    
    // 测试数组字段中的对象元素命名转换
    const instance6 = new TestClass();
    instance6.arrayField = [{ fieldName: 'value1' }];
    
    const source6 = {
      array_field: [{ field_name: 'new value' }]
    };
    
    instance6.assign(source6, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    // 验证数组被正确赋值，但注意数组元素内部属性不会被转换命名风格
    expect(instance6.arrayField.length).toBe(1);
    expect(instance6.arrayField[0].field_name).toBe('new value');
    expect(instance6.arrayField[0].fieldName).toBe(undefined);
    
    warnSpy.mockRestore();
  });

  // 全面测试第479-502行的doAssign函数
  test('should fully test doAssign function for all branch paths', () => {
    @Enum
    class TestEnum {
      static OPTION_1 = new TestEnum('OPTION_1');
      static OPTION_2 = new TestEnum('OPTION_2');
    }
    
    @Model
    class NestedClass {
      constructor() {
        this.nestedValue = 'default';
      }
    }
    
    @Model
    class ParentClass {
      constructor() {
        this.parentField = 'parent default';
      }
    }
    
    @Model
    class TestClass extends ParentClass {
      // 使用@Type装饰器的字段
      @Type(NestedClass)
      typedField = new NestedClass();
      
      // 使用@ElementType装饰器的数组字段
      @ElementType(NestedClass)
      elementTypedArray = [new NestedClass()];
      
      // 默认值为null的字段
      nullField = null;
      
      // 原始类型字段
      primitiveField = 42;
      
      // 普通对象字段
      plainObject = { key: 'value' };
      
      // 普通数组字段
      plainArray = [1, 2, 3];
      
      // 枚举类型字段
      @Type(TestEnum)
      enumField = TestEnum.OPTION_1;
    }
    
    // 测试所有字段类型和嵌套层级
    const instance = new TestClass();
    
    // 创建一个复杂的源对象，覆盖所有字段和类型
    const source = {
      parentField: 'new parent value',
      typedField: { nestedValue: 'new typed value' },
      elementTypedArray: [
        { nestedValue: 'new element value 1' },
        { nestedValue: 'new element value 2' }
      ],
      nullField: { someKey: 'some value' },
      primitiveField: 99,
      plainObject: { newKey: 'new object value' },
      plainArray: [4, 5, 6],
      enumField: 'OPTION_2'
    };
    
    // 使用各种选项测试
    instance.assign(source, {
      normalize: true,
      convertNaming: false
    });
    
    // 验证父类字段
    expect(instance.parentField).toBe('new parent value');
    
    // 验证@Type装饰的字段
    expect(instance.typedField instanceof NestedClass).toBe(true);
    expect(instance.typedField.nestedValue).toBe('new typed value');
    
    // 验证@ElementType装饰的数组字段
    expect(Array.isArray(instance.elementTypedArray)).toBe(true);
    expect(instance.elementTypedArray.length).toBe(2);
    expect(instance.elementTypedArray[0] instanceof NestedClass).toBe(true);
    expect(instance.elementTypedArray[0].nestedValue).toBe('new element value 1');
    expect(instance.elementTypedArray[1].nestedValue).toBe('new element value 2');
    
    // 验证null字段
    expect(instance.nullField).toEqual({ someKey: 'some value' });
    
    // 验证原始类型字段
    expect(instance.primitiveField).toBe(99);
    
    // 验证普通对象字段
    expect(instance.plainObject).toEqual({ newKey: 'new object value' });
    
    // 验证普通数组字段
    expect(instance.plainArray).toEqual([4, 5, 6]);
    
    // 验证枚举字段
    expect(instance.enumField).toBe(TestEnum.OPTION_2);
  });
  
  // 测试多种命名风格转换的情况
  test('should correctly handle different naming style conversions', () => {
    @Model
    class TestClass {
      constructor() {
        this.camelCaseField = 'default';
        this.anotherField = 'another default';
      }
    }
    
    // 测试UPPER_UNDERSCORE到LOWER_CAMEL的转换
    const instance1 = new TestClass();
    instance1.assign({ CAMEL_CASE_FIELD: 'upper snake case' }, {
      convertNaming: true,
      sourceNamingStyle: 'UPPER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    expect(instance1.camelCaseField).toBe('upper snake case');
    
    // 测试LOWER_UNDERSCORE到LOWER_CAMEL的转换
    const instance2 = new TestClass();
    instance2.assign({ camel_case_field: 'lower snake case' }, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    expect(instance2.camelCaseField).toBe('lower snake case');
    
    // 测试UPPER_CAMEL到LOWER_CAMEL的转换
    const instance3 = new TestClass();
    instance3.assign({ CamelCaseField: 'upper camel case' }, {
      convertNaming: true,
      sourceNamingStyle: 'UPPER_CAMEL',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    expect(instance3.camelCaseField).toBe('upper camel case');
  });
}); 