////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import equalsImpl from '../../../src/impl/model/equals-impl';

/**
 * 测试equalsImpl函数中的边缘情况，特别是关于对象原型比较的部分
 */
describe('equalsImpl edge cases', () => {
  it('should return false when objects have different prototypes', () => {
    // 创建两个具有不同原型的对象
    function TypeA() {
      this.prop = 'value';
    }

    function TypeB() {
      this.prop = 'value';
    }

    const objA = new TypeA();
    const objB = new TypeB();

    // 虽然属性值相同，但它们的原型不同，应该返回false
    expect(equalsImpl(objA, objB)).toBe(false);
  });

  it('should handle null prototypes correctly', () => {
    // 创建一个没有原型的对象
    const objA = Object.create(null);
    objA.prop = 'value';

    // 创建一个有原型的对象
    const objB = { prop: 'value' };

    // 由于原型不同，应该返回false
    expect(equalsImpl(objA, objB)).toBe(false);
  });

  it('should handle objects with same prototype but different properties', () => {
    // 创建两个具有相同原型但不同属性的对象
    const objA = { prop1: 'value1', prop2: 'value2' };
    const objB = { prop1: 'value1', prop3: 'value3' };

    // 属性不同，应该返回false
    expect(equalsImpl(objA, objB)).toBe(false);
  });
});
