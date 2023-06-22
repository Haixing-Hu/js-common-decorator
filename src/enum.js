/*******************************************************************************
 *
 *    Copyright (c) 2017 - 2021
 *    Nanjing Smart Medical Investment Operation Service Co. Ltd.
 *    All rights reserved.
 *
 ******************************************************************************/
import { setClassMetadata } from '@/impl/utils';

/**
 * 修饰一个空类，将其转换为枚举类。
 *
 * 此装饰器需要一个数组作为参数，数组中每个元素是一个对象。每个对象必须具有`name`和`value`属性，
 * 分别其对应的枚举子的显示名称和枚举值字符串表示。该对象还可以具有可选属性`code`和`data`，分别
 * 表示其对应的枚举子的编码（通常是字符串或整数类型）和额外数据（可以是任意Object）。
 *
 * 该装饰器所装饰的类必须是一个类，此类可以有自定义属性和自定义方法。该装饰器会为被装饰的类添加下述
 * 属性和方法：
 *
 * - 原型属性`name`，表示该对象对应的枚举子的显示名称；
 * - 原型属性`value`，表示该对象对应的枚举子的字符串表示；
 * - 可选原型属性`code`，表示该对象对应的枚举子的可选编码，编码可以是任意类型的数据，但通常应为字符串
 *   或整数型；
 * - 可选原型属性`data`，表示该对象对应的枚举子的其他额外数据；
 * - 对每个枚举子，添加一个与其`value`属性同名的静态类成员，表示对应的枚举子；
 * - 静态类方法`values()`，返回该枚举类所有枚举值组成的数组；
 * - 静态类方法`forValue(value)`，返回字符串表示为`value`的枚举子，若不存在这样
 *   的枚举子则返回`undefined`；
 * - 静态类方法`getNameOf(value)`，返回字符串表示为`value`的枚举子的名称，若不存
 *   在这样的枚举子则返回`undefined`。
 * - 静态类方法`has(value)`，测试字符串`value`是否为该枚举类的某个枚举子的值。
 *
 * 使用示例：
 * ```js
 * &#064;Enum([{
 *   name: '男',
 *   value: 'MALE',
 * }, {
 *   name: '女',
 *   value: 'FEMALE',
 * }])
 * class Gender {}
 * ```
 *
 * 对`Gender`类按上述方式使用`@Enum`装饰器后，会将该类修改为类似下述代码的形式：
 * ```js
 * class Gender {
 *   name = '';
 *   value = '';
 * }
 *
 * Gender.MALE = new Gender();
 * Gender.MALE.name = '男';
 * Gender.MALE.value = 'MALE';
 * Object.freeze(Gender.MALE);
 *
 * Gender.FEMALE = new Gender();
 * Gender.FEMALE.name = '男';
 * Gender.FEMALE.value = 'FEMALE';
 * Object.freeze(Gender.FEMALE);
 *
 * Gender.values = function() {
 *   return [ Gender.MALE, Gender.FEMALE ];
 * }
 *
 * Gender.forValue = function(value) {
 *   return Gender[value];
 * }
 *
 * Gender.getNameOf = function(value) {
 *    return (Gender[value] ? Gender[value].name : undefined);
 * }
 *
 * Gender.has = function(value) {
 *   return (Gender[value] instanceof Gender);
 * }
 *
 * Object.freeze(Gender);
 * ```
 *
 * @param {Array} items
 *     对被修饰的类的枚举子的描述。
 * @param {Function} Class
 *     被修饰的类。
 * @author 胡海星
 */
export function Enum(items) {
  return function decorate(Class) {
    // 被@Enum修饰的类的category分类设置为'enum'
    setClassMetadata(Class, 'category', 'enum');
    // 添加属性 name
    Object.defineProperty(Class.prototype, 'name', {
      configurable: false,
      enumerable: true,
      writable: true,
      value: '',
    });
    // 添加属性 value
    Object.defineProperty(Class.prototype, 'value', {
      configurable: false,
      enumerable: true,
      writable: true,
      value: '',
    });
    // 添加属性 code
    Object.defineProperty(Class.prototype, 'code', {
      configurable: false,
      enumerable: true,
      writable: true,
      value: undefined,
    });
    // 添加属性 data
    Object.defineProperty(Class.prototype, 'data', {
      configurable: false,
      enumerable: true,
      writable: true,
      value: undefined,
    });
    // 为每个枚举值添加一个不可更改的同名类静态成员
    items.forEach((item) => {
      const e = new Class();
      e.name = item.name;
      e.value = item.value;
      e.code = item.code;
      e.data = item.data;
      Object.freeze(e);
      Class[item.value] = e;
    });
    // 添加类静态方法 values()
    Class.values = function values() {
      const result = [];
      items.forEach((item) => {
        const e = Class[item.value];
        result.push(e);
      });
      return result;
    };
    // 添加类静态方法 forValue()
    Class.forValue = function forValue(value) {
      // if (value === undefined || value === null || typeof value !== 'string') {
      //   return undefined;
      // }
      const e = Class[value];
      return (e instanceof Class ? e : undefined);
    };
    // 添加类静态方法 getNameOf()
    Class.getNameOf = function getNameOf(value) {
      // if (value === undefined || value === null || typeof value !== 'string') {
      //   return undefined;
      // }
      const e = Class[value];
      return (e instanceof Class ? e.name : undefined);
    };
    // 添加类静态方法 has()
    Class.has = function has(value) {
      // if (value === undefined || value === null || typeof value !== 'string') {
      //   return false;
      // }
      const e = Class[value];
      return (e instanceof Class);
    };
    // 冻结这个枚举类
    Object.freeze(Class);
  };
}

export default Enum;
