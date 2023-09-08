/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { logger, Logger } from '@haixing_hu/common-util';
import { mount } from '@vue/test-utils';
import Foo from './model/foo';
import Hello from './model/hello-vue';

const myLogger = new Logger('DEBUG');
let logs = [];        // 记录所有的日志
const appender = {
  debug: (...args) => {
    logs.push({ type: 'DEBUG', args });
    myLogger.debug(args.slice(2).join(' '));
  },
  info: (...args) => {
    logs.push({ type: 'INFO', args });
    myLogger.info(args.slice(2).join(' '));
  },
  warn: (...args) => {
    logs.push({ type: 'WARN', args });
    myLogger.warn(args.slice(2).join(' '));
  },
  error: (...args) => {
    logs.push({ type: 'ERROR', args });
    myLogger.error(args.slice(2).join(' '));
  },
};
logger.setAppender(appender);   // 设置自定义的 appender

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
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG]',
        logger.lastTimestamp,
        'Foo.say:',
        'Hello',
      ],
    });
  });

  test('普通类方法，多个参数', () => {
    logs = [];
    const foo = new Foo();
    foo.add(1, 2);
    expect(logs.length).toBe(2);
    expect(logs[0].type).toBe('DEBUG');
    expect(logs[0].args.length).toBe(6);
    expect(logs[0].args[0]).toBe('[DEBUG]');
    expect(logs[0].args[2]).toBe('Foo.add:');
    expect(logs[0].args[3]).toEqual(1);
    expect(logs[0].args[4]).toEqual(',');
    expect(logs[0].args[5]).toEqual(2);
    expect(logs[1]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG]',
        logger.lastTimestamp,
        'Foo.say:',
        'Foo.add: 1, 2',
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
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG]',
        logger.lastTimestamp,
        'Hello.created.',
      ],
    });
    // 检查 Hello.foo() 的日志
    hello.vm.foo(1, 2);
    expect(logs.length).toBe(2);
    expect(logs[1]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG]',
        logger.lastTimestamp,
        'Hello.foo:',
        1,
        ',',
        2,
      ],
    });
    // 检查 Hello.add(1, 2)的结果
    const result = hello.vm.add(1, 2);
    expect(result).toBe(3);
    expect(logs[2]).toEqual({
      type: 'DEBUG',
      args: [
        '[DEBUG]',
        logger.lastTimestamp,
        'Hello.add:',
        1,
        ',',
        2,
      ],
    });
  });
});
