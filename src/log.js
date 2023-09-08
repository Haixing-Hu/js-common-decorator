/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Vue } from 'vue-property-decorator';

/**
 * Vue 的生命周期钩子函数名称列表。
 *
 * @author 胡海星
 * @private
 */
const VUE_LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeUnmount',
  'unmounted',
  'errorCaptured',  // 2.5
  'renderTracked',
  'renderTriggered',
  'serverPrefetch', // 2.6
  'beforeDestroy',
  'destroyed',
];

/**
 * 打印类方法的跟踪日志。
 *
 * @param {String} className
 *     类名称。
 * @param {String} methodName
 *     方法名称。
 * @param {Array} args
 *     该方法的调用参数。
 * @author 胡海星
 * @private
 */
function printMethodLog(className, methodName, args) {
  if (args.length === 0) {
    console.trace(`${className}.${methodName}.`);
  } else {
    console.trace(`${className}.${methodName}:`, ...args);
  }
}

/**
 * 符合 vue-class-component 的 createDecorator() 函数要求的装饰器函数。
 *
 * @param {Object} options
 *     用于创建Vue组件的options对象。
 * @param {String} key
 *     该装饰器所应用于的属性或方法的名称。
 * @author 胡海星
 * @private
 */
function vueLogDecorator(options, key) {
  // 如果装饰器所修饰的方法是Vue的生命周期钩子函数，
  // 则col就是options；否则col是options.methods
  const col = (VUE_LIFECYCLE_HOOKS.includes(key) ? options : options.methods);
  const originalMethod = col[key];
  col[key] = function logWrapperMethod(...args) {
    printMethodLog(options.name, key, args);
    return originalMethod.apply(this, args);
  };
}

/**
 * 修饰目标方法，在日志中打印其调用签名，包括类名、方法名和参数。
 *
 * 使用示例：
 * ```js
 * class Person {
 *   &#064;Log
 *   eat(meal) {
 *     ...
 *   }
 * }
 *
 * const person = new Person();
 * const meal = new Meal();
 * person.eat(meal);   // 日志中将会打印此方法调用的签名
 * ```
 *
 * @param {Function} target
 *     目标对象所属的类的原型。
 * @param {String} name
 *     目标对象的名称。
 * @param {Object} descriptor
 *     目标对象原来的属性描述符。
 * @returns
 *     目标对象被修饰后的属性描述符。
 * @author 胡海星
 */
export function Log(target, name, descriptor) {
  const ctor = target.constructor;
  if (target instanceof Vue) {
    // 对于 Vue 的派生类，必须特殊处理，
    // 参考 vue-class-component 的 createDecorator() 方法的实现
    if (!ctor.__decorators__) {
      Object.defineProperty(ctor, '__decorators__', {
        configurable: true,
        enumerable: false,
        value: [],
      });
    }
    ctor.__decorators__.push((options) => vueLogDecorator(options, name));
  } else {
    // 对于其他函数，正常处理
    const originalMethod = descriptor.value;
    descriptor.value = function wrapperMethod(...args) {
      printMethodLog(ctor.name, name, args);
      return originalMethod.call(this, ...args);
    };
  }
  return descriptor;
}

export default Log;
