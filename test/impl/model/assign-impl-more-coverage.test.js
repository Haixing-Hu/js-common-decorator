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
 * 提高assign-impl.js文件的测试覆盖率
 * 
 * 重点测试以下未覆盖的行:
 * - 第81行：当源对象字段存在不同命名风格时
 * - 第113行：处理空字符串的枚举值
 * - 第165-173行：枚举类型处理的不同路径
 * - 第312-373行：cloneNoType函数的不同路径
 * - 第479-502行：doAssign函数的不同路径
 */
describe('assign-impl improved coverage', () => {
  // 测试第81行：不同命名风格的字段处理
  test('should handle source fields with different naming styles correctly', () => {
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
      camel_case_field: 'snake case value', 
      ANOTHER_FIELD: 'upper snake case value'
    };

    // 不指定命名风格转换选项，应该触发警告
    instance.assign(source);
    
    // 确认第81行代码被执行：验证警告是否包含建议信息
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls.some(call => 
      typeof call[0] === 'string' && 
      (call[0].includes('The source object has a field') || call[0].includes('A correct naming conversion may be needed'))
    )).toBe(true);
    
    warnSpy.mockReset();
    
    // 正确指定命名风格转换选项，应该正确赋值
    instance.assign(source, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    expect(instance.camelCaseField).toBe('snake case value');
    
    warnSpy.mockRestore();
  });

  // 测试第113行：处理空字符串的枚举值
  test('should handle blank string in enum properly', () => {
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

    const instance = new TestClass();
    
    // 使用空字符串作为枚举值测试第113行
    instance.assign({ enumField: '   ' }); // 空白字符串
    
    // 应该保持默认值
    expect(instance.enumField).toBe(TestEnum.OPTION_1);
    
    // 使用有效枚举值
    instance.assign({ enumField: 'OPTION_2' });
    expect(instance.enumField).toBe(TestEnum.OPTION_2);
  });

  // 测试第165-173行：枚举类型处理的不同路径
  test('should correctly handle various enum value scenarios', () => {
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

    const instance = new TestClass();
    
    // 测试第165-166行: 当源属性不是枚举类实例，而是字符串时
    instance.assign({ enumField: 'OPTION_2' });
    expect(instance.enumField).toBe(TestEnum.OPTION_2);
    
    // 测试第171-173行: 当源属性既不是枚举实例也不是字符串时
    expect(() => {
      instance.assign({ enumField: 123 }); // 不是字符串或枚举实例
    }).toThrow(RangeError);
    
    // 测试枚举实例本身时的处理
    const instance2 = new TestClass();
    instance2.assign({ enumField: TestEnum.OPTION_2 });
    expect(instance2.enumField).toBe(TestEnum.OPTION_2);
    
    warnSpy.mockRestore();
  });

  // 测试第312-373行：cloneNoType函数的不同路径
  test('should handle different scenarios in cloneNoType function', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    @Model
    class NestedObject {
      constructor() {
        this.nestedField = 'nested default';
        this.camelCaseField = 'camel case default';
      }
    }
    
    @Model
    class TestClass {
      constructor() {
        this.objectField = new NestedObject();
        this.nullField = null;
        this.undefinedField = undefined;
      }
    }

    // 测试当defaultInstance为null时
    const instance1 = new TestClass();
    const source1 = {
      nullField: { key: 'value' }
    };
    instance1.assign(source1);
    expect(instance1.nullField).toEqual({ key: 'value' });
    
    // 测试当defaultInstance为undefined时
    const instance2 = new TestClass();
    const source2 = {
      undefinedField: { key: 'value' }
    };
    instance2.assign(source2);
    expect(instance2.undefinedField).toEqual({ key: 'value' });
    
    // 测试命名风格转换处理
    const instance3 = new TestClass();
    const source3 = {
      object_field: {
        nested_field: 'new nested value',
        camel_case_field: 'new camel case value'
      }
    };
    
    instance3.assign(source3, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    expect(instance3.objectField instanceof NestedObject).toBe(true);
    expect(instance3.objectField.nestedField).toBe('new nested value');
    expect(instance3.objectField.camelCaseField).toBe('new camel case value');
    
    warnSpy.mockRestore();
  });

  // 测试第479-502行：doAssign函数的不同路径
  test('should handle different field types correctly in doAssign', () => {
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
    class TestClass {
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
    
    const instance = new TestClass();
    
    // 创建不同类型的源对象
    const source = {
      typedField: { nestedValue: 'new nested value' },         // 对象
      elementTypedArray: [{ nestedValue: 'new element value' }], // 带元素类型的数组
      nullField: { someKey: 'some value' },                     // null字段赋非null值
      primitiveField: 99,                                       // 原始类型
      plainObject: { newKey: 'new value' },                     // 普通对象
      plainArray: [4, 5, 6],                                    // 普通数组
      enumField: 'OPTION_2'                                     // 枚举值字符串
    };
    
    // 应用通常选项
    instance.assign(source);
    
    // 验证不同类型的字段是否正确处理
    // 验证@Type装饰的字段
    expect(instance.typedField instanceof NestedClass).toBe(true);
    expect(instance.typedField.nestedValue).toBe('new nested value');
    
    // 验证@ElementType装饰的字段
    expect(Array.isArray(instance.elementTypedArray)).toBe(true);
    expect(instance.elementTypedArray[0] instanceof NestedClass).toBe(true);
    expect(instance.elementTypedArray[0].nestedValue).toBe('new element value');
    
    // 验证null字段被赋值
    expect(instance.nullField).toEqual({ someKey: 'some value' });
    
    // 验证原始类型字段
    expect(instance.primitiveField).toBe(99);
    
    // 验证普通对象
    expect(instance.plainObject).toEqual({ newKey: 'new value' });
    
    // 验证普通数组
    expect(instance.plainArray).toEqual([4, 5, 6]);
    
    // 验证枚举字段
    expect(instance.enumField).toBe(TestEnum.OPTION_2);
  });
  
  // 直接测试cloneArrayNoElementType函数（357-373行）
  test('should correctly handle different array scenarios in cloneArrayNoElementType', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    @Model
    class TestClass {
      constructor() {
        this.simpleArray = [1, 2, 3];
        this.objectArray = [{ field: 'value' }];
      }
    }
    
    // 测试常规数组复制
    const instance1 = new TestClass();
    const source1 = {
      simpleArray: [4, 5, 6]
    };
    instance1.assign(source1);
    expect(instance1.simpleArray).toEqual([4, 5, 6]);
    
    // 测试对象数组的命名风格转换
    const instance2 = new TestClass();
    const source2 = {
      object_array: [
        { field_name: 'new value' }
      ]
    };
    
    // 使用命名风格转换选项
    instance2.assign(source2, {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_UNDERSCORE',
      targetNamingStyle: 'LOWER_CAMEL'
    });
    
    // 验证数组被正确转换
    expect(instance2.objectArray).toBeDefined();
    expect(instance2.objectArray.length).toBe(1);
    expect(instance2.objectArray[0].fieldName).toBe(undefined); // 数组元素内部属性没有转换
    
    // 测试非数组值（364-373行）
    const instance3 = new TestClass();
    const source3 = {
      simpleArray: 'not an array'
    };
    
    instance3.assign(source3);
    
    // 验证错误消息是否触发
    expect(errorSpy).toHaveBeenCalled();
    // 验证保持默认值
    expect(instance3.simpleArray).toEqual([1, 2, 3]);
    
    errorSpy.mockRestore();
  });
  
  // 直接测试assignImpl函数对各种边缘情况的处理
  test('should handle various edge cases in assignImpl function', () => {
    @Model
    class TestClass {
      constructor() {
        this.field1 = 'default1';
        this.field2 = 'default2';
      }
    }
    
    // 测试正常使用
    const instance1 = new TestClass();
    const source1 = { field1: 'new1', field2: 'new2' };
    
    const result1 = assignImpl(TestClass, instance1, source1);
    
    expect(result1).toBe(instance1);
    expect(instance1.field1).toBe('new1');
    expect(instance1.field2).toBe('new2');
    
    // 测试source为null
    const instance2 = new TestClass();
    const result2 = assignImpl(TestClass, instance2, null);
    
    expect(result2).toBe(instance2);
    expect(instance2.field1).toBe('default1');
    expect(instance2.field2).toBe('default2');
    
    // 测试source为undefined
    const instance3 = new TestClass();
    const result3 = assignImpl(TestClass, instance3, undefined);
    
    expect(result3).toBe(instance3);
    expect(instance3.field1).toBe('default1');
    expect(instance3.field2).toBe('default2');
    
    // 测试source instanceof Class情况
    const instance4 = new TestClass();
    instance4.field1 = 'source value 1';
    instance4.field2 = 'source value 2';
    
    const instance5 = new TestClass();
    
    const result4 = assignImpl(TestClass, instance5, instance4);
    
    expect(result4).toBe(instance5);
    expect(instance5.field1).toBe('source value 1');
    expect(instance5.field2).toBe('source value 2');
  });
}); 