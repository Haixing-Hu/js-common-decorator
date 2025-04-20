////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * The decorator which delays the execution of a function.
 *
 * ##### Usage example:
 *
 * ```js
 * &#064;Timeout(1000)
 * function doSomething() {
 *   console.log('do something.');
 * }
 *
 * doSomething();     // will print 'do something.' after 1 second.
 *
 * ```
 *
 * @param {Number} milliseconds
 *     The time to delay, in milliseconds. The default value is 0.
 * @returns
 *     The descriptor of the decorated function.
 * @author Haixing Hu
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
