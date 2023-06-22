/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * 用于控制一个函数延时执行的修饰器。
 *
 * 使用示例：
 * ```js
 * &#064;Timeout(1000)
 * function doSomething() {
 *   console.log('do something.');
 * }
 *
 * doSomething();     // 将会延迟1秒再打印日志
 *
 * ```
 *
 * @param {Number} milliseconds
 *     延时的时间，单位为毫秒，默认值为0。
 * @returns
 *     被修饰的函数修饰后的描述器。
 */
export function Timeout(milliseconds = 0) {
  return (target, key, descriptor) => {
    const func = descriptor.value;
    descriptor.value = (...args) => {
      setTimeout(() => {
        func.apply(this, args);
      }, milliseconds);
    };
    return descriptor;
  };
}

export default Timeout;
