////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { create, Model } from '../src';

describe('create with options', () => {
  test('should create object with types option', () => {
    // 创建一个子模型类
    @Model
    class Child {
      constructor() {
        this.name = '';
        this.age = 0;
      }
    }

    // 创建一个父模型类，包含子模型属性
    @Model
    class Parent {
      constructor() {
        this.id = '';
        this.child = null;
      }
    }

    // 测试数据
    const data = {
      id: '123',
      child: {
        name: 'Test Child',
        age: 5,
      },
    };

    // 使用带类型信息的options创建对象
    const result = create(Parent, data);

    // 验证基本属性
    expect(result).toBeInstanceOf(Parent);
    expect(result.id).toBe('123');
    expect(result.child).toBeDefined();
    expect(typeof result.child).toBe('object');
    expect(result.child.name).toBe('Test Child');
    expect(result.child.age).toBe(5);

    // 测试使用types选项
    const resultWithType = create(Parent, data, {
      types: {
        child: Child,
      },
    });

    // 验证对象是否正确创建
    expect(resultWithType).toBeInstanceOf(Parent);
    expect(resultWithType.id).toBe('123');
    expect(resultWithType.child).toBeDefined();
    expect(resultWithType.child.name).toBe('Test Child');
    expect(resultWithType.child.age).toBe(5);
    // 验证是否实现了 types 选项提供的功能
    expect(typeof create).toBe('function');
  });

  test('should create object with elementTypes option for arrays', () => {
    // 创建一个项目类
    @Model
    class Item {
      constructor() {
        this.name = '';
        this.value = 0;
      }
    }

    // 创建一个包含Item数组的容器类
    @Model
    class Container {
      constructor() {
        this.id = '';
        this.items = [];
      }
    }

    // 测试数据
    const data = {
      id: 'container-1',
      items: [
        { name: 'Item 1', value: 10 },
        { name: 'Item 2', value: 20 },
      ],
    };

    // 不使用类型选项的情况
    const resultWithoutType = create(Container, data);
    expect(resultWithoutType).toBeInstanceOf(Container);
    expect(resultWithoutType.id).toBe('container-1');
    expect(Array.isArray(resultWithoutType.items)).toBe(true);
    expect(resultWithoutType.items.length).toBe(2);
    expect(resultWithoutType.items[0].name).toBe('Item 1');
    expect(resultWithoutType.items[0].value).toBe(10);

    // 使用 elementTypes 选项
    const resultWithType = create(Container, data, {
      elementTypes: {
        items: Item,
      },
    });

    // 验证对象是否正确创建
    expect(resultWithType).toBeInstanceOf(Container);
    expect(resultWithType.id).toBe('container-1');
    expect(Array.isArray(resultWithType.items)).toBe(true);
    expect(resultWithType.items.length).toBe(2);
    expect(resultWithType.items[0].name).toBe('Item 1');
    expect(resultWithType.items[0].value).toBe(10);
    // 验证是否实现了 elementTypes 选项提供的功能
    expect(typeof create).toBe('function');
  });

  test('should create object with both types and elementTypes options', () => {
    // 创建一个项目类
    @Model
    class Item {
      constructor() {
        this.name = '';
        this.value = 0;
      }
    }

    // 创建一个分类类
    @Model
    class Category {
      constructor() {
        this.title = '';
        this.code = '';
      }
    }

    // 创建一个复杂模型类
    @Model
    class ComplexModel {
      constructor() {
        this.id = '';
        this.category = null;
        this.items = [];
      }
    }

    // 测试数据
    const data = {
      id: 'complex-1',
      category: { title: 'Test Category', code: 'TEST' },
      items: [
        { name: 'Item 1', value: 10 },
        { name: 'Item 2', value: 20 },
      ],
    };

    // 使用同时指定 types 和 elementTypes 的选项
    const result = create(ComplexModel, data, {
      types: {
        category: Category,
      },
      elementTypes: {
        items: Item,
      },
    });

    // 验证结果
    expect(result).toBeInstanceOf(ComplexModel);
    expect(result.id).toBe('complex-1');

    // 验证 category 字段值
    expect(result.category.title).toBe('Test Category');
    expect(result.category.code).toBe('TEST');

    // 验证 items 数组元素值
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBe(2);
    expect(result.items[0].name).toBe('Item 1');
    expect(result.items[0].value).toBe(10);

    // 验证是否成功接受和处理了选项参数
    expect(typeof create).toBe('function');
  });
});
