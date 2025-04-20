////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import equalsImpl from '../../../src/impl/model/equals-impl';
import Model from '../../../src/model';

/**
 * 此测试文件专门用于提高equals-impl.js文件的覆盖率
 * 特别是第30行，验证两个对象prototype不同的情况
 */
describe('equalsImpl enhanced coverage tests', () => {
  // 测试相同对象的情况
  test('should return true for same object reference', () => {
    const obj = { a: 1, b: 'test' };
    expect(equalsImpl(obj, obj)).toBe(true);
  });
  
  // 测试两个对象都是null或undefined的情况
  test('should handle null and undefined correctly', () => {
    // 两边都是null
    expect(equalsImpl(null, null)).toBe(true);
    
    // 两边都是undefined
    expect(equalsImpl(undefined, undefined)).toBe(true);
    
    // 一边是null，一边是undefined
    expect(equalsImpl(null, undefined)).toBe(true);
    expect(equalsImpl(undefined, null)).toBe(true);
    
    // 一边是null或undefined，一边是对象
    expect(equalsImpl(null, {})).toBe(false);
    expect(equalsImpl({}, null)).toBe(false);
    expect(equalsImpl(undefined, {})).toBe(false);
    expect(equalsImpl({}, undefined)).toBe(false);
  });
  
  // 测试不同类型对象的原型比较（覆盖第30行）
  test('should compare object prototypes correctly', () => {
    // 创建两个不同类的实例
    @Model
    class ClassA {
      constructor() {
        this.value = 1;
      }
    }
    
    @Model
    class ClassB {
      constructor() {
        this.value = 1;
      }
    }
    
    const objA = new ClassA();
    const objB = new ClassB();
    
    // 虽然两个对象的属性相同，但它们的原型不同，所以应该返回false
    expect(equalsImpl(objA, objB)).toBe(false);
    
    // 比较具有相同原型的对象
    const objA2 = new ClassA();
    objA2.value = 1;
    expect(equalsImpl(objA, objA2)).toBe(true);
    
    // 比较子类和父类的实例
    class SubClassA extends ClassA {
      constructor() {
        super();
      }
    }
    
    const subObjA = new SubClassA();
    // 子类和父类的实例有不同的原型
    expect(equalsImpl(objA, subObjA)).toBe(false);
  });
  
  // 测试使用deep-equal比较复杂对象的情况
  test('should use deep-equal for complex objects with same prototype', () => {
    // 创建两个相同结构的对象
    const obj1 = {
      a: 1,
      b: 'test',
      c: [1, 2, 3],
      d: { nested: 'value' }
    };
    
    const obj2 = {
      a: 1,
      b: 'test',
      c: [1, 2, 3],
      d: { nested: 'value' }
    };
    
    // 应该是相等的
    expect(equalsImpl(obj1, obj2)).toBe(true);
    
    // 修改嵌套属性后应该不相等
    const obj3 = { ...obj2 };
    obj3.d = { nested: 'different' };
    expect(equalsImpl(obj1, obj3)).toBe(false);
    
    // 测试数组顺序不同的情况
    const obj4 = { ...obj2 };
    obj4.c = [3, 2, 1];
    expect(equalsImpl(obj1, obj4)).toBe(false);
  });
}); 