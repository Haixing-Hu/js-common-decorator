////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import definePrototypeProperty from '../../../src/impl/utils/define-prototype-property';

describe('definePrototypeProperty', () => {
  test('should define properties on the prototype of a class', () => {
    // 创建一个测试类
    class TestClass {}

    // 定义属性
    definePrototypeProperty(TestClass, 'prop1', 'prop2');

    // 检查属性是否被正确定义
    const descriptor1 = Object.getOwnPropertyDescriptor(TestClass.prototype, 'prop1');
    const descriptor2 = Object.getOwnPropertyDescriptor(TestClass.prototype, 'prop2');

    expect(descriptor1).toBeDefined();
    expect(descriptor2).toBeDefined();

    expect(descriptor1.value).toBe('');
    expect(descriptor1.configurable).toBe(false);
    expect(descriptor1.enumerable).toBe(true);
    expect(descriptor1.writable).toBe(true);

    expect(descriptor2.value).toBe('');
    expect(descriptor2.configurable).toBe(false);
    expect(descriptor2.enumerable).toBe(true);
    expect(descriptor2.writable).toBe(true);

    // 检查实例属性
    const instance = new TestClass();
    expect(instance.prop1).toBe('');
    expect(instance.prop2).toBe('');

    // 检查属性是否可以被修改
    instance.prop1 = 'new value';
    expect(instance.prop1).toBe('new value');
  });

  test('should handle no properties case', () => {
    class TestClass {}

    // 没有提供属性名
    definePrototypeProperty(TestClass);

    // 不应该有任何变化
    const prototypePropertyNames = Object.getOwnPropertyNames(TestClass.prototype);
    expect(prototypePropertyNames).toEqual(['constructor']);
  });
});
