/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { mount } from '@vue/test-utils';
import Foo from './model/foo';
import Hello from './model/hello-vue';

let logs = [];        // 记录所有的日志
window.console = {          // 重载 window.console
  debug: (...args) => {
    logs.push({ type: 'DEBUG', args });
  },
  trace: (...args) => {
    logs.push({ type: 'TRACE', args });
  },
  info: (...args) => {
    logs.push({ type: 'INFO', args });
  },
  warn: (...args) => {
    logs.push({ type: 'WARN', args });
  },
  error: (...args) => {
    logs.push({ type: 'ERROR', args });
  },
  log: (...args) => {
    logs.push({ type: 'LOG', args });
  },
};

/**
 * 单元测试 @Log 装饰器。
 *
 * @author 胡海星
 */
describe('Test @Log decorator for class method', () => {
  test('普通类方法，单个参数', () => {
    logs = [];
    const foo = new Foo();
    foo.say('Hello');
    expect(logs.length).toBe(2);
    expect(logs[0]).toEqual({
      type: 'TRACE',
      args: [
        'Foo.say:',
        'Hello',
      ],
    });
    expect(logs[1]).toEqual({
      type: 'LOG',
      args: [
        'Foo.say: Hello',
      ],
    });
  });

  test('普通类方法，多个参数', () => {
    logs = [];
    const foo = new Foo();
    foo.add(1, 2);
    expect(logs.length).toBe(3);
    expect(logs[0]).toEqual({
      type: 'TRACE',
      args: [
        'Foo.add:',
        1,
        2,
      ],
    });
    expect(logs[1]).toEqual({
      type: 'TRACE',
      args: [
        'Foo.say:',
        'Foo.add: 1, 2',
      ],
    });
    expect(logs[2]).toEqual({
      type: 'LOG',
      args: [
        'Foo.say: Foo.add: 1, 2',
      ],
    });
  });
});

/**
 * 单元测试 @Log 装饰器。
 *
 * @author 胡海星
 */
describe('Test @Log decorator for Vue method', () => {
  test('测试Vue class component方法的@Log装饰器', async () => {
    logs = [];
    const hello = mount(Hello);
    await hello.vm.$nextTick();
    // 检查渲染结果
    const p = hello.findComponent('p');
    expect(p.text()).toBe('Hello World!');
    // 检查 Hello.created() 的日志
    expect(logs.length).toBe(2);
    expect(logs[0]).toEqual({
      type: 'TRACE',
      args: [
        'Hello.created.',
      ],
    });
    expect(logs[1]).toEqual({
      type: 'LOG',
      args: [
        'In Function: Hello.created.',
      ],
    });
    // 检查 Hello.foo() 的日志
    hello.vm.foo(1, 2);
    expect(logs.length).toBe(5);
    expect(logs[2]).toEqual({
      type: 'TRACE',
      args: [
        'Hello.foo:',
        1,
        2,
      ],
    });
    expect(logs[3]).toEqual({
      type: 'LOG',
      args: [
        'In Function: Hello.Foo: 1, 2',
      ],
    });
    expect(logs[4]).toEqual({
      type: 'LOG',
      args: [
        'In Function: ',
        'Hello World!',
        ' x = ',
        1,
        ' y = ',
        2,
      ],
    });
    // 检查 Hello.add(1, 2)的结果
    const result = hello.vm.add(1, 2);
    expect(result).toBe(3);
    expect(logs.length).toBe(7);
    expect(logs[5]).toEqual({
      type: 'TRACE',
      args: [
        'Hello.add:',
        1,
        2,
      ],
    });
    expect(logs[6]).toEqual({
      type: 'LOG',
      args: [
        'In Function: Hello.add: 1, 2',
      ],
    });
  });
});
