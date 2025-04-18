////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { Timeout } from '../src/timeout';

describe('Test @Timeout decorator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should delay function execution by specified time', () => {
    const mockFn = jest.fn();

    // 使用老式装饰器语法
    class TestClass {
      testMethod() {
        mockFn();
      }
    }

    // 手动应用装饰器
    const descriptor = {
      value: TestClass.prototype.testMethod,
      configurable: true,
      writable: true,
    };

    const decoratedDescriptor = Timeout(1000)(
      TestClass.prototype,
      'testMethod',
      descriptor,
    );

    // 替换原方法
    TestClass.prototype.testMethod = decoratedDescriptor.value;

    const instance = new TestClass();
    instance.testMethod();

    // 函数不应该在延迟前被调用
    expect(mockFn).not.toBeCalled();

    // 前进 500ms
    jest.advanceTimersByTime(500);
    expect(mockFn).not.toBeCalled();

    // 前进到 1000ms
    jest.advanceTimersByTime(500);
    expect(mockFn).toBeCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should use default timeout of 0ms when no argument is provided', () => {
    const mockFn = jest.fn();

    // 使用老式装饰器语法
    class TestClass {
      testMethod() {
        mockFn();
      }
    }

    // 手动应用装饰器
    const descriptor = {
      value: TestClass.prototype.testMethod,
      configurable: true,
      writable: true,
    };

    const decoratedDescriptor = Timeout()(
      TestClass.prototype,
      'testMethod',
      descriptor,
    );

    // 替换原方法
    TestClass.prototype.testMethod = decoratedDescriptor.value;

    const instance = new TestClass();
    instance.testMethod();

    // 应该在下一个事件循环执行（0ms延迟）
    expect(mockFn).not.toBeCalled();
    jest.advanceTimersByTime(0);
    expect(mockFn).toBeCalled();
  });

  test('should pass arguments correctly to the original function', () => {
    const mockFn = jest.fn();

    // 使用老式装饰器语法
    class TestClass {
      testMethod(arg1, arg2) {
        mockFn(arg1, arg2);
      }
    }

    // 手动应用装饰器
    const descriptor = {
      value: TestClass.prototype.testMethod,
      configurable: true,
      writable: true,
    };

    const decoratedDescriptor = Timeout(500)(
      TestClass.prototype,
      'testMethod',
      descriptor,
    );

    // 替换原方法
    TestClass.prototype.testMethod = decoratedDescriptor.value;

    const instance = new TestClass();
    instance.testMethod('test', 123);

    // 前进到 500ms
    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });
});
