////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Readonly } from '../src';

describe('Readonly 装饰器', () => {
  describe('应用于有初始值的字段', () => {
    test('应该使具有初始值的字段立即变为只读', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        field = 'initial value';
      }

      // 创建实例
      const instance = new TestClass();

      // 验证初始值已正确设置
      expect(instance.field).toBe('initial value');

      // 验证字段是只读的
      const descriptor = Object.getOwnPropertyDescriptor(instance, 'field');
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
      expect(descriptor.enumerable).toBe(true);

      // 验证不能修改值
      expect(() => {
        instance.field = 'new value';
      }).toThrow(TypeError);

      // 确认值未被修改
      expect(instance.field).toBe('initial value');
    });

    test('应该对不同类型的初始值都有效', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        numberField = 123;

        @Readonly
        booleanField = true;

        @Readonly
        objectField = { key: 'value' };

        @Readonly
        arrayField = [1, 2, 3];
      }

      // 创建实例
      const instance = new TestClass();

      // 验证所有字段的初始值已正确设置
      expect(instance.numberField).toBe(123);
      expect(instance.booleanField).toBe(true);
      expect(instance.objectField).toEqual({ key: 'value' });
      expect(instance.arrayField).toEqual([1, 2, 3]);

      // 验证所有字段都是只读的
      const numDescriptor = Object.getOwnPropertyDescriptor(instance, 'numberField');
      const boolDescriptor = Object.getOwnPropertyDescriptor(instance, 'booleanField');
      const objDescriptor = Object.getOwnPropertyDescriptor(instance, 'objectField');
      const arrDescriptor = Object.getOwnPropertyDescriptor(instance, 'arrayField');

      expect(numDescriptor.writable).toBe(false);
      expect(boolDescriptor.writable).toBe(false);
      expect(objDescriptor.writable).toBe(false);
      expect(arrDescriptor.writable).toBe(false);

      // 验证不能修改值
      expect(() => {
        instance.numberField = 456;
      }).toThrow(TypeError);
      expect(() => {
        instance.booleanField = false;
      }).toThrow(TypeError);
      expect(() => {
        instance.objectField = {};
      }).toThrow(TypeError);
      expect(() => {
        instance.arrayField = [];
      }).toThrow(TypeError);
    });

    test('应该使有初始值的静态字段变为只读', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        static staticField = 'static value';
      }

      // 验证静态字段的初始值已正确设置
      expect(TestClass.staticField).toBe('static value');

      // 验证静态字段是只读的
      const descriptor = Object.getOwnPropertyDescriptor(TestClass, 'staticField');
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
      expect(descriptor.enumerable).toBe(true);

      // 验证不能修改值
      expect(() => {
        TestClass.staticField = 'new static value';
      }).toThrow(TypeError);

      // 确认值未被修改
      expect(TestClass.staticField).toBe('static value');
    });
  });

  describe('应用于没有初始值的字段', () => {
    test('应该允许第一次赋值并在赋值后使字段变为只读', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        field;
      }

      // 创建实例
      const instance = new TestClass();

      // 验证初始值为 undefined
      expect(instance.field).toBeUndefined();

      // 第一次赋值
      instance.field = 'first value';

      // 验证赋值成功
      expect(instance.field).toBe('first value');

      // 验证字段现在是只读的
      const descriptor = Object.getOwnPropertyDescriptor(instance, 'field');
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
      expect(descriptor.enumerable).toBe(true);

      // 验证不能再次修改值
      expect(() => {
        instance.field = 'second value';
      }).toThrow(TypeError);

      // 确认值未被修改
      expect(instance.field).toBe('first value');
    });

    test('应该在构造函数中赋值后使字段变为只读', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        field;

        constructor() {
          this.field = 'constructor value';
        }
      }

      // 创建实例
      const instance = new TestClass();

      // 验证构造函数中的赋值成功
      expect(instance.field).toBe('constructor value');

      // 验证字段现在是只读的
      const descriptor = Object.getOwnPropertyDescriptor(instance, 'field');
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
      expect(descriptor.enumerable).toBe(true);

      // 验证不能再次修改值
      expect(() => {
        instance.field = 'outside value';
      }).toThrow(TypeError);

      // 确认值未被修改
      expect(instance.field).toBe('constructor value');
    });

    test('应该允许第一次赋值为 undefined 并在之后使字段变为只读', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        field;
      }

      // 创建实例
      const instance = new TestClass();

      // 显式赋值为 undefined
      instance.field = undefined;

      // 验证字段现在是只读的
      const descriptor = Object.getOwnPropertyDescriptor(instance, 'field');
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
      expect(descriptor.enumerable).toBe(true);

      // 验证不能再次修改值
      expect(() => {
        instance.field = 'any value';
      }).toThrow(TypeError);

      // 确认值仍为 undefined
      expect(instance.field).toBeUndefined();
    });

    test('应该使没有初始值的静态字段在第一次赋值后变为只读', () => {
      // 定义测试类
      class TestClass {
        @Readonly
        static staticField;
      }

      // 验证初始值为 undefined
      expect(TestClass.staticField).toBeUndefined();

      // 第一次赋值
      TestClass.staticField = 'static value';

      // 验证赋值成功
      expect(TestClass.staticField).toBe('static value');

      // 验证字段现在是只读的
      const descriptor = Object.getOwnPropertyDescriptor(TestClass, 'staticField');
      expect(descriptor.writable).toBe(false);
      expect(descriptor.configurable).toBe(false);
      expect(descriptor.enumerable).toBe(true);

      // 验证不能再次修改值
      expect(() => {
        TestClass.staticField = 'new static value';
      }).toThrow(TypeError);

      // 确认值未被修改
      expect(TestClass.staticField).toBe('static value');
    });
  });

  describe('错误处理', () => {
    test('应该在应用于非字段目标时抛出错误', () => {
      // 验证应用于方法时抛出错误
      expect(() => {
        class TestClass {
          @Readonly
          method() {}
        }
        new TestClass();
      }).toThrow('@Readonly can only be applied to class fields.');

      // 验证应用于类时抛出错误
      expect(() => {
        @Readonly
        class TestClass {}
        new TestClass();
      }).toThrow('@Readonly can only be applied to class fields.');

      // 验证应用于getter时抛出错误
      expect(() => {
        class TestClass {
          @Readonly
          get property() { return 'value'; }
        }
        new TestClass();
      }).toThrow('@Readonly can only be applied to class fields.');

      // 验证应用于setter时抛出错误
      expect(() => {
        class TestClass {
          _value = '';

          @Readonly
          set property(value) {
            this._value = value;
          }
        }
        new TestClass();
      }).toThrow('@Readonly can only be applied to class fields.');
    });
  });
});
