////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

describe('Test field decorator', () => {
  test('Test the execution order', () => {
    function TestDecorator(target, context) {
      console.log(`TextDecorator the ${context.name}`);
      // 注册一个后置初始化器，在实例完全构造完后执行
      context.addInitializer(() => {
        // 这时 this[name] 已经被赋过一次（可能在 constructor 里），是可写的
        // 我们把它改成不可写，不可配置
        console.log(`Object.defineProperty(this, ${context.name}, { writable： false})`);
        // Object.defineProperty(this, context.name, {
        //   writable: false,
        //   configurable: false,
        // });
      });
      return function initializer(initialValue) {
        console.log(`Initialize the ${context.name} with initial value '${initialValue}'`);
        return initialValue;
      };
    }

    class Foo {
      @TestDecorator
      field1;

      @TestDecorator
      field2 = 123;

      constructor() {
        console.log('construct a Foo.');
        this.field1 = 234;
        console.log('After setting field1');
        this.field2 = 456;
        console.log('After setting field2');
        console.log('Exit constructor');
      }
    }

    const foo = new Foo();
  });
});
